import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId') || 'all';
    const timeRange = searchParams.get('timeRange') || '30d';

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get all quizzes for the institution
    const quizzes = await prisma.quizzes.findMany({
      where: {
        module: {
          course: {
            institution_id: user.institution.id
          }
        },
        ...(quizId !== 'all' && { id: quizId })
      },
      include: {
        module: {
          include: {
            course: true
          }
        },
        quiz_questions: true,
        attempts: {
          where: {
            started_at: {
              gte: startDate
            }
          },
          include: {
            responses: {
              include: {
                question: true
              }
            }
          }
        }
      }
    });

    // Calculate overview statistics
    const totalQuizzes = quizzes.length;
    const totalAttempts = quizzes.reduce((sum, quiz) => sum + quiz.attempts.length, 0);
    
    const allAttempts = quizzes.flatMap(quiz => quiz.attempts);
    const completedAttempts = allAttempts.filter(attempt => attempt.status === 'COMPLETED');
    
    const averageScore = completedAttempts.length > 0 
      ? completedAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / completedAttempts.length
      : 0;
    
    const completionRate = allAttempts.length > 0 
      ? (completedAttempts.length / allAttempts.length) * 100
      : 0;
    
    const averageTime = completedAttempts.length > 0
      ? completedAttempts.reduce((sum, attempt) => sum + (attempt.time_spent || 0), 0) / completedAttempts.length / 60
      : 0;

    // Calculate performance by quiz
    const performanceByQuiz = quizzes.map(quiz => {
      const attempts = quiz.attempts;
      const completed = attempts.filter(a => a.status === 'COMPLETED');
      
      return {
        quizId: quiz.id,
        quizTitle: quiz.title,
        attempts: attempts.length,
        averageScore: completed.length > 0 
          ? completed.reduce((sum, a) => sum + a.percentage, 0) / completed.length
          : 0,
        completionRate: attempts.length > 0 
          ? (completed.length / attempts.length) * 100
          : 0,
        averageTime: completed.length > 0
          ? completed.reduce((sum, a) => sum + (a.time_spent || 0), 0) / completed.length / 60
          : 0
      };
    });

    // Calculate difficulty analysis
    const allQuestions = quizzes.flatMap(quiz => quiz.quiz_questions);
    const difficultyStats = ['EASY', 'MEDIUM', 'HARD'].map(difficulty => {
      const questions = allQuestions.filter(q => q.difficulty === difficulty);
      const totalAsked = questions.reduce((sum, q) => sum + q.times_asked, 0);
      const totalCorrect = questions.reduce((sum, q) => sum + q.times_correct, 0);
      
      return {
        difficulty,
        count: questions.length,
        averageScore: questions.length > 0 
          ? questions.reduce((sum, q) => sum + q.success_rate, 0) / questions.length
          : 0,
        successRate: totalAsked > 0 ? (totalCorrect / totalAsked) * 100 : 0
      };
    });

    // Calculate question performance
    const questionPerformance = allQuestions.map(question => ({
      questionId: question.id,
      question: question.question,
      type: question.type,
      difficulty: question.difficulty,
      timesAsked: question.times_asked,
      timesCorrect: question.times_correct,
      successRate: question.success_rate,
      averageTime: question.average_time_spent
    }));

    // Calculate adaptive quiz statistics
    const adaptiveAttempts = allAttempts.filter(attempt => attempt.is_adaptive);
    const adaptiveQuizStats = {
      totalAdaptiveQuizzes: quizzes.filter(quiz => quiz.quiz_type === 'ADAPTIVE').length,
      averageAbilityEstimate: adaptiveAttempts.length > 0
        ? adaptiveAttempts.reduce((sum, a) => sum + (a.ability_estimate || 0), 0) / adaptiveAttempts.length
        : 0,
      averageConfidence: adaptiveAttempts.length > 0
        ? adaptiveAttempts.reduce((sum, a) => sum + (a.confidence_level || 0), 0) / adaptiveAttempts.length
        : 0,
      terminationReasons: Object.entries(
        adaptiveAttempts.reduce((acc, attempt) => {
          const reason = attempt.termination_reason || 'UNKNOWN';
          acc[reason] = (acc[reason] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([reason, count]) => ({ reason, count }))
    };

    // Generate time series data (simplified)
    const timeSeriesData = [];
    const days = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const dayAttempts = allAttempts.filter(attempt => {
        const attemptDate = new Date(attempt.started_at);
        return attemptDate.toDateString() === date.toDateString();
      });
      
      timeSeriesData.push({
        date: date.toISOString().split('T')[0],
        attempts: dayAttempts.length,
        averageScore: dayAttempts.length > 0
          ? dayAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / dayAttempts.length
          : 0,
        completions: dayAttempts.filter(a => a.status === 'COMPLETED').length
      });
    }

    return NextResponse.json({
      overview: {
        totalQuizzes,
        totalAttempts,
        averageScore,
        completionRate,
        averageTime
      },
      performanceByQuiz,
      difficultyAnalysis: difficultyStats,
      questionPerformance,
      adaptiveQuizStats,
      timeSeriesData
    });

  } catch (error) {
    console.error('Quiz analytics error:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 