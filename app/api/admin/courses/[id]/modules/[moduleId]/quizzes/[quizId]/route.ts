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
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (case-insensitive)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id }
    });

    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    // Verify the module exists
    const module = await prisma.modules.findUnique({
      where: { id: params.moduleId }
    });

    if (!module) {
      return NextResponse.json(
        { message: 'Module not found' },
        { status: 404 }
      );
    }

    // Get quiz with questions
    const quiz = await prisma.quizzes.findFirst({
      where: {
        id: params.quizId,
        module_id: params.moduleId
      },
      include: {
        quizQuestions: {
          orderBy: {
            order_index: 'asc'
          }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:');
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (case-insensitive)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id }
    });

    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    // Verify the module exists
    const module = await prisma.modules.findUnique({
      where: { id: params.moduleId }
    });

    if (!module) {
      return NextResponse.json(
        { message: 'Module not found' },
        { status: 404 }
      );
    }

    // Verify the quiz exists
    const existingQuiz = await prisma.quizzes.findFirst({
      where: {
        id: params.quizId,
        module_id: params.moduleId
      }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const {
      title,
      description,
      quiz_type,
      difficulty,
      passing_score,
      time_limit,
      is_published
    } = data;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Update the quiz
    const updatedQuiz = await prisma.quizzes.update({
      where: { id: params.quizId },
      data: {
        title,
        description: description || '',
        quiz_type: quiz_type || existingQuiz.quiz_type,
        difficulty: difficulty || existingQuiz.difficulty,
        passing_score: passing_score || existingQuiz.passing_score,
        time_limit: time_limit !== undefined ? time_limit : existingQuiz.time_limit,
        is_published: is_published !== undefined ? is_published : existingQuiz.is_published
      },
      include: {
        quizQuestions: {
          orderBy: {
            order_index: 'asc'
          }
        }
      }
    });

    // // // // // // console.log('Quiz updated successfully');
    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error('Error updating quiz:');
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (case-insensitive)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id }
    });

    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    // Verify the module exists
    const module = await prisma.modules.findUnique({
      where: { id: params.moduleId }
    });

    if (!module) {
      return NextResponse.json(
        { message: 'Module not found' },
        { status: 404 }
      );
    }

    // Verify the quiz exists and belongs to the module
    const quiz = await prisma.quizzes.findFirst({
      where: {
        id: params.quizId,
        module_id: params.moduleId
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Delete the quiz (this will cascade delete questions)
    await prisma.quizzes.delete({
      where: { id: params.quizId }
    });

    console.log('Quiz deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:');
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 