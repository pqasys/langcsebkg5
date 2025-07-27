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

    // Verify quiz exists
    const quiz = await prisma.quizzes.findFirst({
      where: {
        id: params.quizId,
        module_id: params.moduleId
      }
    });

    if (!quiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Get the specific question
    const question = await prisma.quiz_questions.findFirst({
      where: {
        id: params.questionId,
        quiz_id: params.quizId
      }
    });

    if (!question) {
      return new NextResponse('Question not found', { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching question:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string; questionId: string } }
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

    // Verify quiz exists
    const quiz = await prisma.quizzes.findFirst({
      where: {
        id: params.quizId,
        module_id: params.moduleId
      }
    });

    if (!quiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Verify question exists
    const existingQuestion = await prisma.quiz_questions.findFirst({
      where: {
        id: params.questionId,
        quiz_id: params.quizId
      }
    });

    if (!existingQuestion) {
      return new NextResponse('Question not found', { status: 404 });
    }

    const body = await request.json();
    
    const {
      type,
      question: questionText,
      points,
      options,
      correct_answer,
      explanation,
      difficulty,
      category,
      hints,
      question_config,
      media_url,
      media_type,
      irt_difficulty,
      irt_discrimination,
      irt_guessing,
      use_manual_irt
    } = body;

    // Basic validation
    if (!questionText || questionText.trim().length === 0) {
      return new NextResponse('Question text is required', { status: 400 });
    }

    if (!type) {
      return new NextResponse('Question type is required', { status: 400 });
    }

    // Convert type to uppercase and validate against enum
    const normalizedType = type.toUpperCase().replace('_', '_');
    const validTypes = [
      'MULTIPLE_CHOICE', 
      'FILL_IN_BLANK', 
      'MATCHING', 
      'SHORT_ANSWER', 
      'TRUE_FALSE', 
      'ESSAY', 
      'DRAG_AND_DROP', 
      'DRAG_DROP',
      'HOTSPOT',
      'MULTIPLE_ANSWER',
      'ORDERING'
    ];
    
    if (!validTypes.includes(normalizedType)) {
      return new NextResponse(`Invalid question type. Must be one of: ${validTypes.join(', ')}`, { status: 400 });
    }

    // Question type-specific validation
    if (normalizedType === 'MULTIPLE_CHOICE' && (!options || !Array.isArray(options) || options.length < 2)) {
      return new NextResponse('Multiple choice questions require at least 2 options', { status: 400 });
    }

    if (normalizedType === 'MATCHING' && (!question_config?.leftItems || !question_config?.rightItems)) {
      return new NextResponse('Matching questions require both left and right items', { status: 400 });
    }

    if (normalizedType === 'DRAG_AND_DROP' && (!question_config?.dragItems || !question_config?.dropZones)) {
      return new NextResponse('Drag and drop questions require both drag items and drop zones', { status: 400 });
    }

    if (normalizedType === 'HOTSPOT' && !media_url) {
      return new NextResponse('Hotspot questions require an uploaded image', { status: 400 });
    }

    if (normalizedType === 'ORDERING' && (!question_config?.orderItems || question_config.orderItems.length < 2)) {
      return new NextResponse('Ordering questions require at least 2 items to order', { status: 400 });
    }

    if (points && (points < 1 || points > 100)) {
      return new NextResponse('Points must be between 1 and 100', { status: 400 });
    }

    // Calculate IRT parameters if not provided manually
    let finalIrtDifficulty = irt_difficulty;
    let finalIrtDiscrimination = irt_discrimination;
    let finalIrtGuessing = irt_guessing;

    if (!use_manual_irt || !irt_difficulty || !irt_discrimination || !irt_guessing) {
      // Automatic IRT parameter calculation
      let calculatedDifficulty = 0;
      let calculatedDiscrimination = 1.0;
      let calculatedGuessing = 0.25;

      // Adjust based on question difficulty
      switch (difficulty) {
        case 'EASY':
          calculatedDifficulty = -1.0;
          calculatedDiscrimination = 0.8;
          calculatedGuessing = 0.3;
          break;
        case 'MEDIUM':
          calculatedDifficulty = 0.0;
          calculatedDiscrimination = 1.0;
          calculatedGuessing = 0.25;
          break;
        case 'HARD':
          calculatedDifficulty = 1.0;
          calculatedDiscrimination = 1.2;
          calculatedGuessing = 0.2;
          break;
      }

      // Adjust based on question type
      switch (normalizedType) {
        case 'MULTIPLE_CHOICE':
          if (options && Array.isArray(options) && options.length > 0) {
            calculatedGuessing = 1 / options.length;
          } else {
            calculatedGuessing = 0.25; // Default for 4 options
          }
          calculatedGuessing = Math.max(calculatedGuessing, 0.1);
          break;
        case 'TRUE_FALSE':
          calculatedGuessing = 0.5;
          break;
        case 'FILL_IN_BLANK':
          calculatedGuessing = 0.05;
          break;
        case 'SHORT_ANSWER':
          calculatedGuessing = 0.05;
          break;
        case 'ESSAY':
          calculatedGuessing = 0.02;
          break;
        case 'MATCHING':
          calculatedGuessing = 0.15;
          break;
        case 'DRAG_AND_DROP':
          calculatedGuessing = 0.1;
          break;
        case 'HOTSPOT':
          calculatedGuessing = 0.05;
          break;
        case 'MULTIPLE_ANSWER':
          calculatedGuessing = 0.1;
          break;
        case 'ORDERING':
          calculatedGuessing = 0.05;
          break;
      }

      finalIrtDifficulty = calculatedDifficulty;
      finalIrtDiscrimination = calculatedDiscrimination;
      finalIrtGuessing = calculatedGuessing;
    }

    // Update the question
    const updatedQuestion = await prisma.quiz_questions.update({
      where: {
        id: params.questionId
      },
      data: {
        type: normalizedType,
        question: questionText.trim(),
        options: options ? JSON.stringify(options) : null,
        correct_answer: correct_answer?.trim() || null,
        points: points || 1,
        explanation: explanation?.trim() || null,
        difficulty: difficulty || 'MEDIUM',
        category: category || null,
        hints: hints || null,
        question_config: question_config ? JSON.stringify(question_config) : null,
        media_url: media_url || null,
        media_type: media_type || null,
        irt_difficulty: finalIrtDifficulty,
        irt_discrimination: finalIrtDiscrimination,
        irt_guessing: finalIrtGuessing,
        irt_last_updated: new Date(),
        updated_at: new Date(),
      }
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string; questionId: string } }
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

    // Verify quiz exists
    const quiz = await prisma.quizzes.findFirst({
      where: {
        id: params.quizId,
        module_id: params.moduleId
      }
    });

    if (!quiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Verify question exists and belongs to this quiz
    const question = await prisma.quiz_questions.findFirst({
      where: {
        id: params.questionId,
        quiz_id: params.quizId
      }
    });

    if (!question) {
      return new NextResponse('Question not found', { status: 404 });
    }

    // Delete question options first (due to foreign key constraints)
    await prisma.questionOption.deleteMany({
      where: {
        question_id: params.questionId
      }
    });

    // Delete the question
    await prisma.quiz_questions.delete({
      where: {
        id: params.questionId
      }
    });

    return new NextResponse('Question deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting question:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 