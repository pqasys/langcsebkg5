import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
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

    // Get quizzes for the module
    const quizzes = await prisma.quizzes.findMany({
      where: {
        module_id: params.moduleId
      },
      include: {
        quiz_questions: {
          orderBy: {
            order_index: 'asc'
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:');
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
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

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const {
      title,
      description,
      quiz_type = 'STANDARD',
      difficulty = 'MEDIUM',
      passing_score = 70,
      time_limit = null,
      questions = []
    } = data;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const quizId = uuidv4();

    // Create the quiz
    const quiz = await prisma.quizzes.create({
      data: {
        id: quizId,
        module_id: params.moduleId,
        title,
        description: description || '',
        quiz_type,
        difficulty,
        passing_score,
        time_limit,
        is_published: false
      }
    });

    // Create questions if provided
    if (questions.length > 0) {
      const questionData = questions.map((question: unknown, index: number) => ({
        id: uuidv4(),
        quiz_id: quizId,
        type: question.type,
        question: question.question,
        options: question.options ? JSON.stringify(question.options) : null,
        correct_answer: question.correct_answer || '',
        points: question.points || 1,
        difficulty: question.difficulty || 'MEDIUM',
        category: question.category || '',
        explanation: question.explanation || '',
        hints: question.hints || '',
        order_index: index + 1
      }));

      await prisma.quiz_questions.createMany({
        data: questionData
      });
    }

    // Return the created quiz with questions
    const createdQuiz = await prisma.quizzes.findUnique({
      where: { id: quizId },
      include: {
        quiz_questions: {
          orderBy: {
            order_index: 'asc'
          }
        }
      }
    });

    return NextResponse.json(createdQuiz);
  } catch (error) {
    console.error('Error creating quiz:');
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
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

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
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
        id: quizId,
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
      where: { id: quizId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:');
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 