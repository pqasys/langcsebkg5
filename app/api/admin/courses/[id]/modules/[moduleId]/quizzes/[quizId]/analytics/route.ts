import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: courseId, moduleId, quizId } = params;

    // Get quiz attempts
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quizId: quizId
      },
      include: {
        student: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      }
    });

    // Calculate analytics
    const totalAttempts = attempts.length;
    const completedAttempts = attempts.filter(a => a.status === 'COMPLETED');
    const averageScore = completedAttempts.length > 0 
      ? completedAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / completedAttempts.length
      : 0;
    const averageTime = completedAttempts.length > 0
      ? completedAttempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / completedAttempts.length
      : 0;
    const successRate = completedAttempts.length > 0
      ? (completedAttempts.filter(a => (a.percentage || 0) >= 70).length / completedAttempts.length) * 100
      : 0;

    // Get quiz details
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        title: true,
        passing_score: true,
        time_limit: true
      }
    });

    // Recent attempts (last 10)
    const recentAttempts = attempts.slice(0, 10).map(attempt => ({
      id: attempt.id,
      studentName: attempt.student.name,
      studentEmail: attempt.student.email,
      status: attempt.status,
      score: attempt.percentage,
      timeSpent: attempt.timeSpent,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt
    }));

    // Score distribution
    const scoreRanges = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0
    };

    completedAttempts.forEach(attempt => {
      const score = attempt.percentage || 0;
      if (score <= 20) scoreRanges['0-20']++;
      else if (score <= 40) scoreRanges['21-40']++;
      else if (score <= 60) scoreRanges['41-60']++;
      else if (score <= 80) scoreRanges['61-80']++;
      else scoreRanges['81-100']++;
    });

    return NextResponse.json({
      quiz: {
        title: quiz?.title,
        passingScore: quiz?.passing_score,
        timeLimit: quiz?.time_limit
      },
      analytics: {
        totalAttempts,
        completedAttempts: completedAttempts.length,
        averageScore: Math.round(averageScore * 100) / 100,
        averageTime: Math.round(averageTime),
        successRate: Math.round(successRate * 100) / 100,
        scoreRanges
      },
      recentAttempts
    });

  } catch (error) {
    console.error('Error fetching quiz analytics:');
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 