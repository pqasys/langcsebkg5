import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'STUDENT') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

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

    // Get all attempts for this quiz by the student
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quiz_id: params.quizId,
        student_id: session.user.id
      },
      orderBy: {
        attempt_number: 'desc'
      }
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Error fetching quiz attempts:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 