import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
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
      question_options = []
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

    // Get the highest order number for this quiz
    const lastQuestion = await prisma.quiz_questions.findFirst({
      where: { quiz_id: params.quizId },
      orderBy: { order_index: 'desc' }
    });
    
    const newOrder = lastQuestion ? lastQuestion.order_index + 1 : 1;

    // Create the question
    const questionId = uuidv4();
    const question = await prisma.quiz_questions.create({
      data: {
        id: questionId,
        quiz_id: params.quizId,
        type,
        question: questionText.trim(),
        options: options && options.length > 0 ? JSON.stringify(options) : null,
        correct_answer: correct_answer?.trim() || null,
        points: points || 1,
        explanation: explanation?.trim() || null,
        order_index: newOrder,
        difficulty,
        category,
        hints: hints || '',
        question_config: question_config ? JSON.stringify(question_config) : null,
        media_url,
        media_type
      }
    });

    // Create related QuestionOption records if provided
    let createdOptions = [];
    if (Array.isArray(question_options) && question_options.length > 0) {
      createdOptions = await Promise.all(
        question_options.map(async (opt: unknown, idx: number) => {
          return await prisma.questionOption.create({
            data: {
              question_id: questionId,
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

    // Return the created question with its options
    return NextResponse.json({ ...question, question_options: createdOptions });
  } catch (error) {
    console.error('Error creating question:');
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

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

    // Get all questions for this quiz with their options
    const questions = await prisma.quiz_questions.findMany({
      where: { quiz_id: params.quizId },
      orderBy: { order_index: 'asc' },
      include: {
        questionOptions: {
          orderBy: { order_index: 'asc' }
        }
      }
    });

    // Transform the data to include parsed JSON fields
    const transformedQuestions = questions.map(question => ({
      ...question,
      options: question.options ? JSON.parse(question.options) : null,
      question_config: question.question_config ? JSON.parse(question.question_config) : null,
      questionOptions: question.questionOptions.map(option => ({
        ...option,
        metadata: option.metadata ? JSON.parse(option.metadata) : null
      }))
    }));

    return NextResponse.json(transformedQuestions);
  } catch (error) {
    console.error('Error fetching questions:');
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
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

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const {
      questions
    } = data;

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Questions array is required' },
        { status: 400 }
      );
    }

    // Update all questions in a transaction
    const updatedQuestions = await prisma.$transaction(async (tx) => {
      const results = [];

      for (const questionData of questions) {
        const {
          id: questionId,
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
        } = questionData;

        // Basic validation
        if (!questionId) {
          throw new Error(`Question ID is required for updates - Context: throw new Error('Question ID is required for updat...`);
        }

        if (!questionText || questionText.trim().length === 0) {
          throw new Error(`Question text is required - Context: if (!questionText || questionText.trim().length ==...`);
        }

        if (!type) {
          throw new Error('Question type is required');
        }

        if (points < 1 || points > 100) {
          throw new Error(`Points must be between 1 and 100 - Context: if (!type) {...`);
        }

        // Verify the question exists and belongs to this quiz
        const existingQuestion = await tx.quiz_questions.findFirst({
          where: {
            id: questionId,
            quiz_id: params.quizId
          }
        });

        if (!existingQuestion) {
          throw new Error(`Question with ID ${questionId} not found - Context: // Verify the question exists and belongs to this ...`);
        }

        // Update the question
        const updatedQuestion = await tx.quiz_questions.update({
          where: { id: questionId },
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
          where: { question_id: questionId }
        });

        // Create new QuestionOption records if provided
        let createdOptions = [];
        if (Array.isArray(question_options) && question_options.length > 0) {
          createdOptions = await Promise.all(
            question_options.map(async (opt: unknown, idx: number) => {
              return await tx.questionOption.create({
                data: {
                  question_id: questionId,
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

        results.push({
          ...updatedQuestion,
          question_options: createdOptions
        });
      }

      return results;
    });

    return NextResponse.json(updatedQuestions);
  } catch (error) {
    console.error('Error updating questions:');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update questions' },
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

    const { searchParams } = new URL(request.url);
    const questionIds = searchParams.get('ids');

    if (!questionIds) {
      return NextResponse.json(
        { error: 'Question IDs are required for deletion' },
        { status: 400 }
      );
    }

    const idsArray = questionIds.split(',').map(id => id.trim());

    // Delete questions and their options in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete related question options first
      await tx.questionOption.deleteMany({
        where: {
          question_id: {
            in: idsArray
          }
        }
      });

      // Delete the questions
      await tx.quiz_questions.deleteMany({
        where: {
          id: {
            in: idsArray
          },
          quiz_id: params.quizId
        }
      });
    });

    return NextResponse.json({ 
      message: `Successfully deleted ${idsArray.length} question(s)` 
    });
  } catch (error) {
    console.error('Error deleting questions:');
    return NextResponse.json(
      { error: 'Failed to delete questions' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 