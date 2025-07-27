import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'STUDENT') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const { userAnswer, isCorrect } = data;

    if (userAnswer === undefined || isCorrect === undefined) {
      return new NextResponse('User answer and correctness are required', { status: 400 });
    }

    // Get the exercise
    const exercise = await prisma.exercises.findUnique({
      where: { id: params.exerciseId },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    });

    if (!exercise) {
      return new NextResponse('Exercise not found', { status: 404 });
    }

    // Check if student is enrolled in the course
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        studentId: session.user.id,
        courseId: exercise.module.course.id
      }
    });

    if (!enrollment) {
      return new NextResponse('Not enrolled in this course', { status: 403 });
    }

    // Record the exercise attempt
    const exerciseAttempt = await prisma.exerciseAttempt.create({
      data: {
        id: crypto.randomUUID(),
        exerciseId: params.exerciseId,
        studentId: session.user.id,
        userAnswer,
        isCorrect,
        submittedAt: new Date()
      }
    });

    // Update module progress if this is the first correct attempt
    const existingProgress = await prisma.moduleProgress.findUnique({
      where: {
        moduleId_studentId: {
          moduleId: exercise.module_id,
          studentId: session.user.id
        }
      }
    });

    if (!existingProgress) {
      // Create new progress record
      await prisma.moduleProgress.create({
        data: {
          moduleId: exercise.module_id,
          studentId: session.user.id,
          exercisesCompleted: isCorrect,
          startedAt: new Date(),
          lastAccessedAt: new Date()
        }
      });
    } else if (isCorrect && !existingProgress.exercisesCompleted) {
      // Update existing progress if this is the first correct attempt
      await prisma.moduleProgress.update({
        where: {
          moduleId_studentId: {
            moduleId: exercise.module_id,
            studentId: session.user.id
          }
        },
        data: {
          exercisesCompleted: true,
          lastAccessedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      attemptId: exerciseAttempt.id,
      isCorrect,
      feedback: isCorrect ? 'Correct answer!' : `Incorrect. The correct answer is: ${exercise.answer}`
    });
  } catch (error) {
    console.error('Error submitting exercise answer:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 