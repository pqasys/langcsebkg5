import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { userHasPermission } from '@/lib/permissions';

export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'INSTITUTION') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return new NextResponse('Institution not found', { status: 404 });
    }

    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: user.institution.id
      }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Get quizzes for the module
    const quizzes = await prisma.quizzes.findMany({
      where: {
        module_id: params.moduleId
      },
      include: {
        quizQuestions: {
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
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// Helper function to validate question data based on type
function validateQuestion(question: unknown, index: number): { isValid: boolean; error?: string } {
  const { type, question: questionText, points, difficulty, category, explanation, hints } = question;

  // Basic validation
  if (!questionText || questionText.trim().length === 0) {
    return { isValid: false, error: `Question ${index + 1}: Question text is required` };
  }

  if (points && (points < 1 || points > 100)) {
    return { isValid: false, error: `Question ${index + 1}: Points must be between 1 and 100` };
  }

  if (difficulty && !['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
    return { isValid: false, error: `Question ${index + 1}: Difficulty must be EASY, MEDIUM, or HARD` };
  }

  // Type-specific validation
  switch (type) {
    case 'MULTIPLE_CHOICE':
      if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
        return { isValid: false, error: `Question ${index + 1}: Multiple choice questions require at least 2 options` };
      }
      if (!question.correct_answer || question.correct_answer.trim().length === 0) {
        return { isValid: false, error: `Question ${index + 1}: Correct answer is required for multiple choice` };
      }
      break;

    case 'TRUE_FALSE':
      if (!question.correct_answer || !['true', 'false', 'TRUE', 'FALSE'].includes(question.correct_answer)) {
        return { isValid: false, error: `Question ${index + 1}: True/False questions require correct answer to be 'true' or 'false'` };
      }
      break;

    case 'FILL_IN_BLANK':
      if (!question.correct_answer || question.correct_answer.trim().length === 0) {
        return { isValid: false, error: `Question ${index + 1}: Correct answer is required for fill-in-the-blank` };
      }
      break;

    case 'MATCHING':
      if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
        return { isValid: false, error: `Question ${index + 1}: Matching questions require at least 2 pairs` };
      }
      if (!question.correct_answer || question.correct_answer.trim().length === 0) {
        return { isValid: false, error: `Question ${index + 1}: Correct matching pairs are required` };
      }
      break;

    case 'SHORT_ANSWER':
    case 'ESSAY':
      // These question types don't require a specific correct answer format
      break;

    case 'DRAG_AND_DROP':
      if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
        return { isValid: false, error: `Question ${index + 1}: Drag and drop questions require at least 2 items` };
      }
      if (!question.correct_answer || question.correct_answer.trim().length === 0) {
        return { isValid: false, error: `Question ${index + 1}: Correct order is required for drag and drop` };
      }
      break;

    case 'HOTSPOT':
      if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
        return { isValid: false, error: `Question ${index + 1}: Hotspot questions require image coordinates` };
      }
      if (!question.correct_answer || question.correct_answer.trim().length === 0) {
        return { isValid: false, error: `Question ${index + 1}: Correct hotspot coordinates are required` };
      }
      break;

    default:
      return { isValid: false, error: `Question ${index + 1}: Invalid question type '${type}'` };
  }

  return { isValid: true };
}

export async function POST(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'INSTITUTION') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user has permission to create quizzes
    const canCreateQuizzes = await userHasPermission(session.user.id, 'canCreateQuizzes');
    if (!canCreateQuizzes) {
      return new NextResponse('Insufficient permissions to create quizzes', { status: 403 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return new NextResponse('Institution not found', { status: 404 });
    }

    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: user.institution.id
      }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Verify module exists
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id
      }
    });

    if (!module) {
      return new NextResponse('Module not found', { status: 404 });
    }

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const {
      title,
      description,
      passing_score,
      time_limit,
      questions,
      mediaUrl,
      // Enhanced quiz features
      quiz_type = 'STANDARD',
      difficulty = 'MEDIUM',
      category,
      tags,
      instructions,
      allow_retry = true,
      max_attempts = 3,
      shuffle_questions = false,
      show_results = true,
      show_explanations = false
    } = data;

    // Basic validation
    if (!title || title.trim().length === 0) {
      return new NextResponse('Quiz title is required', { status: 400 });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return new NextResponse('At least one question is required', { status: 400 });
    }

    if (passing_score && (passing_score < 0 || passing_score > 100)) {
      return new NextResponse('Passing score must be between 0 and 100', { status: 400 });
    }

    if (time_limit && time_limit < 1) {
      return new NextResponse('Time limit must be at least 1 minute', { status: 400 });
    }

    if (max_attempts && (max_attempts < 1 || max_attempts > 10)) {
      return new NextResponse('Max attempts must be between 1 and 10', { status: 400 });
    }

    // Validate quiz type
    if (!['STANDARD', 'ADAPTIVE', 'PRACTICE', 'ASSESSMENT'].includes(quiz_type)) {
      return new NextResponse('Invalid quiz type', { status: 400 });
    }

    // Validate difficulty
    if (!['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
      return new NextResponse('Invalid difficulty level', { status: 400 });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const validation = validateQuestion(questions[i], i);
      if (!validation.isValid) {
        return new NextResponse(validation.error, { status: 400 });
      }
    }

    // Create quiz and questions in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const quiz = await tx.quizzes.create({
        data: {
          id: uuidv4(),
          module_id: params.moduleId,
          title: title.trim(),
          description: description?.trim() || null,
          passing_score: passing_score || 70,
          time_limit: time_limit || null,
          mediaUrl: mediaUrl || null,
          // Enhanced quiz features
          quiz_type,
          difficulty,
          category: category?.trim() || null,
          tags: tags ? JSON.parse(JSON.stringify(tags)) : null,
          instructions: instructions?.trim() || null,
          allow_retry,
          max_attempts,
          shuffle_questions,
          show_results,
          show_explanations,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Create questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await tx.quiz_questions.create({
          data: {
            id: uuidv4(),
            quiz_id: quiz.id,
            type: q.type,
            question: q.question.trim(),
            options: q.options ? JSON.parse(JSON.stringify(q.options)) : null,
            correct_answer: q.correct_answer?.trim() || null,
            points: q.points || 1,
            order_index: i,
            // Enhanced question features
            difficulty: q.difficulty || 'MEDIUM',
            category: q.category?.trim() || null,
            tags: q.tags ? JSON.parse(JSON.stringify(q.tags)) : null,
            explanation: q.explanation?.trim() || null,
            hints: q.hints ? JSON.parse(JSON.stringify(q.hints)) : null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }

      return quiz;
    });

    // // // // // // // // // console.log('Quiz created successfully');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating quiz:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'INSTITUTION') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user has permission to edit quizzes
    const canEditQuizzes = await userHasPermission(session.user.id, 'canEditQuizzes');
    if (!canEditQuizzes) {
      return new NextResponse('Insufficient permissions to edit quizzes', { status: 403 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return new NextResponse('Institution not found', { status: 404 });
    }

    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: user.institution.id
      }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Verify module exists
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id
      }
    });

    if (!module) {
      return new NextResponse('Module not found', { status: 404 });
    }

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const {
      quizId,
      title,
      description,
      passing_score,
      time_limit,
      questions,
      mediaUrl,
      // Enhanced quiz features
      quiz_type = 'STANDARD',
      difficulty = 'MEDIUM',
      category,
      tags,
      instructions,
      allow_retry = true,
      max_attempts = 3,
      shuffle_questions = false,
      show_results = true,
      show_explanations = false
    } = data;

    // Basic validation
    if (!quizId) {
      return new NextResponse('Quiz ID is required', { status: 400 });
    }

    if (!title || title.trim().length === 0) {
      return new NextResponse('Quiz title is required', { status: 400 });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return new NextResponse('At least one question is required', { status: 400 });
    }

    if (passing_score && (passing_score < 0 || passing_score > 100)) {
      return new NextResponse('Passing score must be between 0 and 100', { status: 400 });
    }

    if (time_limit && time_limit < 1) {
      return new NextResponse('Time limit must be at least 1 minute', { status: 400 });
    }

    if (max_attempts && (max_attempts < 1 || max_attempts > 10)) {
      return new NextResponse('Max attempts must be between 1 and 10', { status: 400 });
    }

    // Validate quiz type
    if (!['STANDARD', 'ADAPTIVE', 'PRACTICE', 'ASSESSMENT'].includes(quiz_type)) {
      return new NextResponse('Invalid quiz type', { status: 400 });
    }

    // Validate difficulty
    if (!['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
      return new NextResponse('Invalid difficulty level', { status: 400 });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const validation = validateQuestion(questions[i], i);
      if (!validation.isValid) {
        return new NextResponse(validation.error, { status: 400 });
      }
    }

    // Verify quiz exists and belongs to the module
    const existingQuiz = await prisma.quizzes.findFirst({
      where: {
        id: quizId,
        module_id: params.moduleId
      }
    });

    if (!existingQuiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Update quiz and questions in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update quiz
      const updatedQuiz = await tx.quizzes.update({
        where: { id: quizId },
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          passing_score: passing_score || 70,
          time_limit: time_limit || null,
          mediaUrl: mediaUrl || null,
          // Enhanced quiz features
          quiz_type,
          difficulty,
          category: category?.trim() || null,
          tags: tags ? JSON.parse(JSON.stringify(tags)) : null,
          instructions: instructions?.trim() || null,
          allow_retry,
          max_attempts,
          shuffle_questions,
          show_results,
          show_explanations,
          updated_at: new Date(),
        },
      });

      // Delete existing questions
      await tx.quiz_questions.deleteMany({
        where: { quiz_id: quizId }
      });

      // Create new questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await tx.quiz_questions.create({
          data: {
            id: uuidv4(),
            quiz_id: quizId,
            type: q.type,
            question: q.question.trim(),
            options: q.options ? JSON.parse(JSON.stringify(q.options)) : null,
            correct_answer: q.correct_answer?.trim() || null,
            points: q.points || 1,
            order_index: i,
            // Enhanced question features
            difficulty: q.difficulty || 'MEDIUM',
            category: q.category?.trim() || null,
            tags: q.tags ? JSON.parse(JSON.stringify(q.tags)) : null,
            explanation: q.explanation?.trim() || null,
            hints: q.hints ? JSON.parse(JSON.stringify(q.hints)) : null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }

      return updatedQuiz;
    });

    console.log('Quiz updated successfully');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating quiz:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'INSTITUTION') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user has permission to delete quizzes
    const canDeleteQuizzes = await userHasPermission(session.user.id, 'canDeleteQuizzes');
    if (!canDeleteQuizzes) {
      return new NextResponse('Insufficient permissions to delete quizzes', { status: 403 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return new NextResponse('Institution not found', { status: 404 });
    }

    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: user.institution.id
      }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Verify module exists
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id
      }
    });

    if (!module) {
      return new NextResponse('Module not found', { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    if (!quizId) {
      return new NextResponse('Quiz ID is required', { status: 400 });
    }

    // Verify quiz exists and belongs to the module
    const existingQuiz = await prisma.quizzes.findFirst({
      where: {
        id: quizId,
        module_id: params.moduleId
      }
    });

    if (!existingQuiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Delete quiz and related data in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete quiz responses first (if any)
      await tx.quizResponse.deleteMany({
        where: {
          quiz_question: {
            quiz_id: quizId
          }
        }
      });

      // Delete quiz attempts
      await tx.quizAttempt.deleteMany({
        where: { quiz_id: quizId }
      });

      // Delete quiz questions
      await tx.quiz_questions.deleteMany({
        where: { quiz_id: quizId }
      });

      // Delete the quiz
      await tx.quizzes.delete({
        where: { id: quizId }
      });
    });

    console.log('Quiz deleted successfully');
    return new NextResponse('Quiz deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting quiz:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 