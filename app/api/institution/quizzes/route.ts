import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTITUTION') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!session.user.institutionId) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // First get all courses for this institution
    const courses = await prisma.course.findMany({
      where: {
        institutionId: session.user.institutionId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    const courseIds = courses.map(c => c.id);

    // Then get all modules for these courses
    const modules = await prisma.modules.findMany({
      where: {
        course_id: {
          in: courseIds,
        },
      },
      select: {
        id: true,
        title: true,
        course_id: true,
      },
    });

    const moduleIds = modules.map(m => m.id);

    // Finally get all quizzes for these modules
    const quizzes = await prisma.quizzes.findMany({
      where: {
        module_id: {
          in: moduleIds,
        },
      },
      include: {
        quizQuestions: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    // Create a map of course data for easy lookup
    const courseMap = new Map(courses.map(c => [c.id, c]));
    const moduleMap = new Map(modules.map(m => [m.id, m]));

    // Calculate stats
    const total_quizzes = quizzes.length;
    const total_questions = quizzes.reduce((sum, q) => sum + q.quizQuestions.length, 0);
    const difficulties = quizzes.map(q => q.difficulty);
    const average_difficulty = difficulties.length
      ? (difficulties.filter(d => d === 'HARD').length * 3 + difficulties.filter(d => d === 'MEDIUM').length * 2 + difficulties.filter(d => d === 'EASY').length * 1) / difficulties.length
      : 0;
    const most_popular_type = quizzes.length
      ? quizzes.reduce((acc, q) => {
          acc[q.quiz_type] = (acc[q.quiz_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      : {};
    const most_popular_type_key = Object.keys(most_popular_type).reduce((a, b) => (most_popular_type[a] > most_popular_type[b] ? a : b), Object.keys(most_popular_type)[0] || '');
    const recent_activity = quizzes.reduce((sum, q) => sum + (q.total_attempts || 0), 0);
    const completion_rate = quizzes.length
      ? Math.round((quizzes.reduce((sum, q) => sum + (q.total_completions || 0), 0) / quizzes.length) * 100)
      : 0;

    const stats = {
      total_quizzes,
      total_questions,
      average_difficulty: average_difficulty >= 2.5 ? 'HARD' : average_difficulty >= 1.5 ? 'MEDIUM' : 'EASY',
      most_popular_type: most_popular_type_key || '',
      recent_activity,
      completion_rate,
    };

    // Format quizzes for frontend
    const formattedQuizzes = quizzes.map(q => {
      const module = moduleMap.get(q.module_id);
      const course = module ? courseMap.get(module.course_id) : null;
      
      return {
        id: q.id,
        title: q.title,
        description: q.description,
        passing_score: q.passing_score,
        time_limit: q.time_limit,
        quiz_type: q.quiz_type,
        difficulty: q.difficulty,
        allow_retry: q.allow_retry,
        max_attempts: q.max_attempts,
        show_results: q.show_results,
        show_explanations: q.show_explanations,
        quizQuestions: q.quizQuestions.map(qq => ({
          id: qq.id,
          type: qq.type,
          question: qq.question,
          points: qq.points,
        })),
        created_at: q.created_at,
        updated_at: q.updated_at,
        module: {
          id: module?.id || '',
          title: module?.title || '',
          course: {
            id: course?.id || '',
            title: course?.title || '',
          },
        },
        stats: {
          total_attempts: q.total_attempts,
          average_score: q.average_score,
          completion_rate: q.success_rate,
          last_attempt: null, // Not implemented
        },
      };
    });

    return NextResponse.json({ quizzes: formattedQuizzes, stats });
  } catch (error) {
    console.error('Error fetching quizzes:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 