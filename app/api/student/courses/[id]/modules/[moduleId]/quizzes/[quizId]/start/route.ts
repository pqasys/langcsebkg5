import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string } }
) {
  try {
    // // // // // // // // // // // // // // // // // // // // // // // // console.log('=== QUIZ START ROUTE CALLED ===');
    console.log('Params:', { courseId: params.id, moduleId: params.moduleId, quizId: params.quizId });
    
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'STUDENT') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('Student ID:', session.user.id);

    // Verify student enrollment
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        studentId: session.user.id,
        courseId: params.id,
        OR: [
          { status: 'ACTIVE' },
          { status: 'COMPLETED' },
          { status: 'IN_PROGRESS' },
          { status: 'PENDING_PAYMENT' },
          { status: 'ENROLLED' }
        ]
      }
    });

    if (!enrollment) {
      return new NextResponse('Not enrolled in this course', { status: 403 });
    }

    // Verify quiz exists and belongs to the module
    const quiz = await prisma.quizzes.findFirst({
      where: {
        id: params.quizId,
        module_id: params.moduleId
      }
    });

    if (!quiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Check if student has already attempted this quiz
    const existingAttempts = await prisma.quizAttempt.findMany({
      where: {
        quiz_id: params.quizId,
        student_id: session.user.id
      },
      orderBy: {
        attempt_number: 'desc'
      }
    });

    console.log('Existing attempts found:', existingAttempts.length);
    existingAttempts.forEach((attempt, index) => {
      console.log(`Attempt ${index + 1}:`, {
        id: attempt.id,
        attempt_number: attempt.attempt_number,
        status: attempt.status,
        created_at: attempt.created_at
      });
    });

    // Check if there's already an IN_PROGRESS attempt
    const inProgressAttempt = existingAttempts.find(attempt => attempt.status === 'IN_PROGRESS');
    if (inProgressAttempt) {
      console.log('Found existing IN_PROGRESS attempt, returning it:', inProgressAttempt.id);
      return NextResponse.json(inProgressAttempt);
    }

    const nextAttemptNumber = existingAttempts.length > 0 ? existingAttempts[0].attempt_number + 1 : 1;

    // Check if max attempts reached
    if (quiz.max_attempts && nextAttemptNumber > quiz.max_attempts) {
      return new NextResponse('Maximum attempts reached for this quiz', { status: 403 });
    }

    console.log('Creating new attempt with number:', nextAttemptNumber);

    // Create new quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        id: crypto.randomUUID(),
        quiz_id: params.quizId,
        student_id: session.user.id,
        attempt_number: nextAttemptNumber,
        status: 'IN_PROGRESS',
        started_at: new Date(),
        score: 0,
        percentage: 0,
        passed: false,
        total_points: 0,
        questions_answered: 0
      }
    });

    console.log('New attempt created:', {
      id: attempt.id,
      attempt_number: attempt.attempt_number,
      status: attempt.status
    });

    return NextResponse.json(attempt);
  } catch (error) {
    console.error('Error starting quiz:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 