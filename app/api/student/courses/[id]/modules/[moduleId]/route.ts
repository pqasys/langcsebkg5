import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role?.toUpperCase() !== 'STUDENT') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Get the course and module details
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        OR: [
          {
            studentId: session.user.id,
            courseId: params.id,
          },
          {
            studentId: session.user.id,
            id: params.id,
          }
        ]
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    });

    if (!enrollment) {
      return new NextResponse('Course not found', { status: 404 });
    }

    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: enrollment.course.id
      },
      include: {
        contentItems: {
          orderBy: {
            order_index: 'asc'
          }
        },
        exercises: {
          orderBy: {
            order_index: 'asc'
          }
        },
        quizzes: {
          include: {
            quizQuestions: {
              orderBy: {
                order_index: 'asc'
              }
            }
          }
        }
      }
    });

    if (!module) {
      return new NextResponse('Module not found', { status: 404 });
    }

    // Get student progress for this module
    const studentProgress = await prisma.student_progress.findFirst({
      where: {
        student_id: session.user.id,
        module_id: module.id
      }
    });

    // Get exercise completion status
    const exerciseAttempts = await prisma.exerciseAttempt.findMany({
      where: {
        studentId: session.user.id,
        exerciseId: { in: module.exercises.map(e => e.id) },
        isCorrect: true
      },
      select: { exerciseId: true }
    });

    const completedExercises = exerciseAttempts.map(a => a.exerciseId);

    // Calculate progress analytics
    const totalContent = module.contentItems.length;
    const totalExercises = module.exercises.length;
    const totalQuizzes = module.quizzes.length;
    const completedContent = studentProgress?.content_completed ? totalContent : 0;
    const completedExercisesCount = completedExercises.length;
    const quizCompleted = studentProgress?.quiz_completed || false;
    
    const progressPercent = Math.round(
      ((completedContent + completedExercisesCount + (quizCompleted ? 1 : 0)) / 
       (totalContent + totalExercises + totalQuizzes)) * 100
    );

    return NextResponse.json({
      course: enrollment.course,
      module: {
        ...module,
        quizzes: module?.quizzes?.map(q => ({
          ...q,
          mediaUrl: q.mediaUrl || null
        })) || [],
        student_progress: studentProgress || {
          content_completed: false,
          exercises_completed: false,
          quiz_completed: false
        }
      },
      progress: {
        totalContent,
        totalExercises,
        totalQuizzes,
        completedContent,
        completedExercises,
        completedExercisesCount,
        quizCompleted,
        progressPercent
      }
    });
  } catch (error) {
    console.error('[MODULE_GET]');
    return new NextResponse('Internal Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 