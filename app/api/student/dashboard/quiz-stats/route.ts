import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'STUDENT') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get all quiz attempts for the student
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        student_id: session.user.id,
        status: 'COMPLETED'
      },
      orderBy: {
        completed_at: 'desc'
      }
    });

    // Get quiz information for attempts
    const quizIds = [...new Set(attempts.map(a => a.quiz_id))];
    const quizzes = await prisma.quizzes.findMany({
      where: {
        id: {
          in: quizIds
        }
      },
      select: {
        id: true,
        title: true,
        passing_score: true,
        module_id: true
      }
    });

    // Get module information for quizzes
    const moduleIds = [...new Set(quizzes.map(q => q.module_id))];
    const modules = await prisma.modules.findMany({
      where: {
        id: {
          in: moduleIds
        }
      },
      select: {
        id: true,
        title: true,
        course_id: true
      }
    });

    // Get course information for modules
    const courseIds = [...new Set(modules.map(m => m.course_id))];
    const courses = await prisma.course.findMany({
      where: {
        id: {
          in: courseIds
        }
      },
      select: {
        id: true,
        title: true
      }
    });

    // Calculate statistics
    const totalAttempts = attempts.length;
    const completedQuizzes = attempts.length;
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
    
    const scores = attempts.map(attempt => attempt.percentage || 0);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

    // Calculate pass rate
    const passedQuizzes = attempts.filter(attempt => {
      const quiz = quizzes.find(q => q.id === attempt.quiz_id);
      return attempt.percentage && attempt.percentage >= quiz.passing_score;
    }).length;

    // Get unique quizzes
    const uniqueQuizzes = new Set(attempts.map(attempt => attempt.quiz_id));
    const totalQuizzes = uniqueQuizzes.size;

    // Calculate current streak (consecutive days with quiz attempts)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let currentStreak = 0;
    const checkDate = new Date(today);
    
    while (true) {
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hasAttemptOnDay = attempts.some(attempt => {
        const attemptDate = new Date(attempt.completed_at || attempt.started_at);
        return attemptDate >= dayStart && attemptDate <= dayEnd;
      });
      
      if (hasAttemptOnDay) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Get recent attempts with additional data
    const recentAttempts = attempts.slice(0, 10).map(attempt => {
      const quiz = quizzes.find(q => q.id === attempt.quiz_id);
      const module = quiz ? modules.find(m => m.id === quiz.module_id) : null;
      const course = module ? courses.find(c => c.id === module.course_id) : null;
      
      return {
        id: attempt.id,
        quizId: attempt.quiz_id,
        quizTitle: quiz?.title || 'Unknown Quiz',
        courseTitle: course?.title || 'Unknown Course',
        moduleTitle: module?.title || 'Unknown Module',
        startedAt: attempt.started_at,
        completedAt: attempt.completed_at,
        score: attempt.score,
        maxScore: attempt.total_points,
        percentage: attempt.percentage,
        timeSpent: attempt.time_spent,
        status: attempt.status,
        attemptNumber: attempt.attempt_number,
        passed: attempt.percentage ? attempt.percentage >= (quiz?.passing_score || 0) : false
      };
    });

    const stats = {
      totalAttempts,
      completedQuizzes,
      averageScore,
      totalTimeSpent,
      currentStreak,
      bestScore,
      quizzesPassed: passedQuizzes,
      totalQuizzes
    };

    return NextResponse.json({
      stats,
      recentAttempts
    });
  } catch (error) {
    console.error('Error fetching quiz stats:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 