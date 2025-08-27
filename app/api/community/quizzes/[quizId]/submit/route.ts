import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { attemptId, answers, timeSpent } = await request.json();

    // Verify attempt exists and belongs to the user
    const attempt = await prisma.communityQuizAttempt.findFirst({
      where: {
        id: attemptId,
        quizId: params.quizId,
        userId: session.user.id,
        status: 'IN_PROGRESS'
      }
    });

    if (!attempt) {
      return NextResponse.json(
        { error: 'Invalid attempt' },
        { status: 404 }
      );
    }

    // Get quiz with questions
    const quiz = await prisma.quizzes.findFirst({
      where: {
        id: params.quizId,
        is_published: true
      },
      include: {
        quiz_questions: {
          orderBy: { order_index: 'asc' }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    let questionsAnswered = 0;
    const results = [];

    for (const question of quiz.quiz_questions) {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      
      if (userAnswer !== undefined) {
        questionsAnswered++;
        const isCorrect = userAnswer === question.correct_answer;
        
        if (isCorrect) {
          totalScore += question.points;
        }

        results.push({
          questionId: question.id,
          userAnswer,
          correctAnswer: question.correct_answer,
          isCorrect,
          points: isCorrect ? question.points : 0,
          explanation: question.explanation
        });
      }
    }

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const passed = percentage >= quiz.passing_score;

    // Update attempt
    const updatedAttempt = await prisma.communityQuizAttempt.update({
      where: { id: attemptId },
      data: {
        score: totalScore,
        percentage,
        passed,
        questionsAnswered,
        timeSpent,
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    // Update quiz statistics
    await prisma.quizzes.update({
      where: { id: params.quizId },
      data: {
        total_attempts: { increment: 1 },
        total_completions: { increment: 1 },
        average_score: {
          increment: percentage
        }
      }
    });

    return NextResponse.json({
      attempt: updatedAttempt,
      results,
      summary: {
        totalScore,
        maxScore,
        percentage: Math.round(percentage * 100) / 100,
        passed,
        questionsAnswered,
        timeSpent
      }
    });
  } catch (error) {
    console.error('Error submitting community quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
