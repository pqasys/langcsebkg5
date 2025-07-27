import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string; questionId: string } }
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

    // Get the specific question with its options
    const question = await prisma.quiz_questions.findFirst({
      where: {
        id: params.questionId,
        quiz_id: params.quizId
      },
      include: {
        questionOptions: {
          orderBy: { order_index: 'asc' }
        }
      }
    });

    if (!question) {
      return NextResponse.json(
        { message: 'Question not found' },
        { status: 404 }
      );
    }

    // Transform the data to include parsed JSON fields
    const transformedQuestion = {
      ...question,
      options: question.options ? JSON.parse(question.options) : null,
      question_config: question.question_config ? JSON.parse(question.question_config) : null,
      questionOptions: question.questionOptions.map(option => ({
        ...option,
        metadata: option.metadata ? JSON.parse(option.metadata) : null
      }))
    };

    return NextResponse.json(transformedQuestion);
  } catch (error) {
    console.error('Error fetching question:');
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string; questionId: string } }
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

    // Verify the question exists
    const existingQuestion = await prisma.quiz_questions.findFirst({
      where: {
        id: params.questionId,
        quiz_id: params.quizId
      }
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { message: 'Question not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const {
      type,
      question: questionText,
      points = 1,
      options = [],
      correct_answer = '',
      explanation = '',
      difficulty = 'MEDIUM',
      category = '',
      hints = '',
      question_config = null,
      media_url = null,
      media_type = null,
      question_options = [],
      order_index
    } = data;

    // Basic validation
    if (!questionText || questionText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question text is required' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Question type is required' },
        { status: 400 }
      );
    }

    if (points < 1 || points > 100) {
      return NextResponse.json(
        { error: 'Points must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Update the question and its options in a transaction
    const updatedQuestion = await prisma.$transaction(async (tx) => {
      // Update the question
      const updatedQuestion = await tx.quiz_questions.update({
        where: { id: params.questionId },
        data: {
          type,
          question: questionText.trim(),
          options: options && options.length > 0 ? JSON.stringify(options) : null,
          correct_answer: correct_answer?.trim() || null,
          points: points || 1,
          explanation: explanation?.trim() || null,
          order_index: typeof order_index === 'number' ? order_index : existingQuestion.order_index,
          difficulty,
          category,
          hints: hints || '',
          question_config: question_config ? JSON.stringify(question_config) : null,
          media_url,
          media_type
        }
      });

      // Delete existing options and create new ones
      await tx.questionOption.deleteMany({
        where: { question_id: params.questionId }
      });

      // Create new QuestionOption records if provided
      let createdOptions = [];
      if (Array.isArray(question_options) && question_options.length > 0) {
        createdOptions = await Promise.all(
          question_options.map(async (opt: unknown, idx: number) => {
            return await tx.questionOption.create({
              data: {
                question_id: params.questionId,
                option_type: opt.option_type || '',
                content: opt.content || '',
                media_url: opt.media_url || null,
                order_index: typeof opt.order_index === 'number' ? opt.order_index : idx,
                is_correct: !!opt.is_correct,
                points: typeof opt.points === 'number' ? opt.points : 0,
                metadata: opt.metadata ? JSON.stringify(opt.metadata) : null
              }
            });
          })
        );
      }

      return {
        ...updatedQuestion,
        question_options: createdOptions
      };
    });

    // // // // // // console.log('Question updated successfully');
    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:');
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string; questionId: string } }
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

    // Verify the question exists
    const existingQuestion = await prisma.quiz_questions.findFirst({
      where: {
        id: params.questionId,
        quiz_id: params.quizId
      }
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { message: 'Question not found' },
        { status: 404 }
      );
    }

    // Delete the question and its options in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete related question options first
      await tx.questionOption.deleteMany({
        where: { question_id: params.questionId }
      });

      // Delete the question
      await tx.quiz_questions.delete({
        where: { id: params.questionId }
      });
    });

    console.log('Question deleted successfully');
    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:');
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 