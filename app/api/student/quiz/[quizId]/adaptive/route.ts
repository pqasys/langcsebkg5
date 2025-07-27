import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdaptiveQuizEngine, IRTParameters } from '@/lib/quiz/adaptive-algorithm';

// Helper function to format question data
function formatQuestion(question: unknown) {
  return {
    id: question.id,
    question: question.question,
    type: question.type,
    options: (() => {
      if (!question.options) return [];
      if (Array.isArray(question.options)) return question.options;
      if (typeof question.options === 'string') {
        try {
          const parsed = JSON.parse(question.options);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [question.options];
        }
      }
      return [];
    })(),
    correctAnswer: question.correct_answer,
    points: question.points,
    difficulty: question.difficulty,
    category: question.category,
    explanation: question.explanation,
    hints: question.hints ? (Array.isArray(question.hints) ? question.hints : JSON.parse(question.hints || '[]')) : []
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quizId } = params;
    const { action, questionId, answer, responseTime } = await request.json();

    // Get the quiz and verify it's adaptive
    const quiz = await prisma.quizzes.findUnique({
      where: { id: quizId },
      include: {
        quiz_questions: {
          orderBy: { order_index: 'asc' }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    if (quiz.quiz_type !== 'ADAPTIVE') {
      return NextResponse.json({ error: 'Quiz is not adaptive' }, { status: 400 });
    }

    // Get or create quiz attempt
    let attempt = await prisma.quizAttempt.findFirst({
      where: {
        quiz_id: quizId,
        student_id: session.user.id,
        status: 'IN_PROGRESS'
      }
    });

    if (!attempt) {
      attempt = await prisma.quizAttempt.create({
        data: {
          id: crypto.randomUUID(),
          quiz_id: quizId,
          student_id: session.user.id,
          score: 0,
          total_points: 0,
          percentage: 0,
          passed: false,
          is_adaptive: true,
          questions_answered: 0,
          adaptive_history: []
        }
      });
    }

    if (action === 'start') {
      // Start the adaptive quiz
      const adaptiveConfig = quiz.adaptive_config as any || {};
      const initialAbility = adaptiveConfig.initial_ability || 0;
      
      // Select first question based on initial ability
      const firstQuestion = selectInitialQuestion(quiz.quiz_questions, initialAbility);
      
      return NextResponse.json({
        attemptId: attempt.id,
        currentQuestion: formatQuestion(firstQuestion),
        abilityEstimate: initialAbility,
        confidence: 0,
        shouldContinue: true
      });
    }

    if (action === 'answer') {
      // Process the answer and get next question
      const question = await prisma.quiz_questions.findUnique({
        where: { id: questionId }
      });

      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }

      // Check if answer is correct
      const isCorrect = checkAnswer(question, answer);
      
      // Get IRT parameters
      const irtParams: IRTParameters = {
        difficulty: question.irt_difficulty || 0,
        discrimination: question.irt_discrimination || 1,
        guessing: question.irt_guessing || 0.25
      };

      // Get previous responses for this attempt
      const responses = await prisma.quizResponse.findMany({
        where: { 
          attempt: {
            id: attempt.id
          }
        },
        include: {
          question: true
        }
      });

      // Create response history for IRT calculation
      const responseHistory = responses.map(response => ({
        questionId: response.questionId,
        correct: response.isCorrect,
        irtParams: {
          difficulty: response.question.irt_difficulty || 0,
          discrimination: response.question.irt_discrimination || 1,
          guessing: response.question.irt_guessing || 0.25
        }
      }));

      // Add current response
      responseHistory.push({
        questionId,
        correct: isCorrect,
        irtParams
      });

      // Calculate new ability estimate
      const studentAbility = AdaptiveQuizEngine.estimateAbility(responseHistory);

      // Save the response
      await prisma.quizResponse.create({
        data: {
          id: crypto.randomUUID(),
          answer: JSON.stringify(answer),
          isCorrect: isCorrect,
          timeSpent: responseTime || 0,
          pointsEarned: isCorrect ? question.points : 0,
          attempt: {
            connect: { id: attempt.id }
          },
          question: {
            connect: { id: questionId }
          },
          student: {
            connect: { id: session.user.id }
          }
        }
      });

      // Update attempt
      await prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: {
          questions_answered: attempt.questions_answered + 1,
          adaptive_history: [...(attempt.adaptive_history as any[] || []), {
            questionId,
            ability: studentAbility.theta,
            confidence: studentAbility.confidence,
            correct: isCorrect,
            timestamp: new Date().toISOString()
          }]
        }
      });

      // Check if quiz should continue
      const shouldContinue = AdaptiveQuizEngine.shouldContinueQuiz(
        studentAbility,
        attempt.questions_answered + 1,
        quiz.target_precision
      );

      if (!shouldContinue) {
        // Calculate final results
        const finalResults = AdaptiveQuizEngine.calculateFinalResults(
          studentAbility,
          attempt.questions_answered + 1
        );

        // Update attempt with final results
        await prisma.quizAttempt.update({
          where: { id: attempt.id },
          data: {
            status: 'COMPLETED',
            completed_at: new Date(),
            score: finalResults.score,
            percentage: finalResults.score,
            passed: finalResults.score >= quiz.passing_score,
            ability_estimate: studentAbility.theta,
            confidence_level: studentAbility.confidence,
            termination_reason: 'PRECISION_REACHED'
          }
        });

        return NextResponse.json({
          completed: true,
          results: finalResults,
          abilityEstimate: studentAbility.theta,
          confidence: studentAbility.confidence
        });
      }

      // Select next question
      const availableQuestions = quiz.quiz_questions.map(q => ({
        id: q.id,
        irtParams: {
          difficulty: q.irt_difficulty || 0,
          discrimination: q.irt_discrimination || 1,
          guessing: q.irt_guessing || 0.25
        },
        category: q.category || 'general',
        difficulty: q.difficulty as 'EASY' | 'MEDIUM' | 'HARD',
        estimatedTime: 30
      }));

      const answeredQuestions = responses.map(r => r.questionId);
      const nextQuestion = AdaptiveQuizEngine.selectNextQuestion(
        availableQuestions,
        studentAbility,
        answeredQuestions
      );

      if (!nextQuestion) {
        // No more questions available
        const finalResults = AdaptiveQuizEngine.calculateFinalResults(
          studentAbility,
          attempt.questions_answered + 1
        );

        await prisma.quizAttempt.update({
          where: { id: attempt.id },
          data: {
            status: 'COMPLETED',
            completed_at: new Date(),
            score: finalResults.score,
            percentage: finalResults.score,
            passed: finalResults.score >= quiz.passing_score,
            ability_estimate: studentAbility.theta,
            confidence_level: studentAbility.confidence,
            termination_reason: 'NO_MORE_QUESTIONS'
          }
        });

        return NextResponse.json({
          completed: true,
          results: finalResults,
          abilityEstimate: studentAbility.theta,
          confidence: studentAbility.confidence
        });
      }

      // Get full question details
      const nextQuestionDetails = await prisma.quiz_questions.findUnique({
        where: { id: nextQuestion.id }
      });

      return NextResponse.json({
        completed: false,
        nextQuestion: formatQuestion(nextQuestionDetails),
        abilityEstimate: studentAbility.theta,
        confidence: studentAbility.confidence,
        shouldContinue: true
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Adaptive quiz error:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

function selectInitialQuestion(questions: unknown[], initialAbility: number) {
  // Select a question close to the initial ability estimate
  const questionsWithDistance = questions.map(q => ({
    question: q,
    distance: Math.abs((q.irt_difficulty || 0) - initialAbility)
  }));

  questionsWithDistance.sort((a, b) => a.distance - b.distance);
  return questionsWithDistance[0]?.question || questions[0];
}

function checkAnswer(question: unknown, answer: unknown): boolean {
  switch (question.type) {
    case 'MULTIPLE_CHOICE':
      return answer === question.correct_answer;
    case 'TRUE_FALSE':
      return answer === question.correct_answer;
    case 'FILL_BLANK':
      return answer.toLowerCase().trim() === question.correct_answer?.toLowerCase().trim();
    case 'MATCHING':
      // For matching, answer should be an array of pairs
      const correctPairs = JSON.parse(question.correct_answer || '[]');
      const answerPairs = Array.isArray(answer) ? answer : [];
      return JSON.stringify(correctPairs.sort()) === JSON.stringify(answerPairs.sort());
    default:
      return false;
  }
} 