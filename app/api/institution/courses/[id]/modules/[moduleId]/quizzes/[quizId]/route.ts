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

    // Get quiz with all questions
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
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Parse options field for each question
    const quizWithParsedOptions = {
      ...quiz,
      quizQuestions: quiz.quizQuestions.map(question => ({
        ...question,
        options: (() => {
          if (!question.options) return null;
          
          // If options is already an array, return it as is
          if (Array.isArray(question.options)) {
            return question.options;
          }
          
          // If options is a string, try to parse it as JSON
          if (typeof question.options === 'string') {
            try {
              const parsed = JSON.parse(question.options);
              return Array.isArray(parsed) ? parsed : null;
            } catch (error) {
    console.error('Error occurred:', error);
              // If parsing fails, it might be plain text - return null or handle as needed
              // // // // // // console.warn(`Failed to parse options for question ${question.id}:`, error);
              return null;
            }
          }
          
          return null;
        })()
      }))
    };

    return NextResponse.json(quizWithParsedOptions);
  } catch (error) {
    console.error('Error fetching quiz:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string } }
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
    const existingQuiz = await prisma.quizzes.findFirst({
      where: {
        id: params.quizId,
        module_id: params.moduleId
      }
    });

    if (!existingQuiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      description,
      passing_score,
      time_limit,
      quiz_type,
      difficulty,
      allow_retry,
      max_attempts,
      show_results,
      show_explanations
    } = body;

    // Update quiz
    const updatedQuiz = await prisma.quizzes.update({
      where: {
        id: params.quizId
      },
      data: {
        title,
        description,
        passing_score: parseInt(passing_score),
        time_limit: time_limit ? parseInt(time_limit) : null,
        quiz_type,
        difficulty,
        allow_retry: Boolean(allow_retry),
        max_attempts: parseInt(max_attempts),
        show_results: Boolean(show_results),
        show_explanations: Boolean(show_explanations),
        updated_at: new Date()
      },
      include: {
        quizQuestions: {
          orderBy: {
            order_index: 'asc'
          }
        }
      }
    });

    // Parse options field for each question
    const updatedQuizWithParsedOptions = {
      ...updatedQuiz,
      quizQuestions: updatedQuiz.quizQuestions.map(question => ({
        ...question,
        options: (() => {
          if (!question.options) return null;
          
          // If options is already an array, return it as is
          if (Array.isArray(question.options)) {
            return question.options;
          }
          
          // If options is a string, try to parse it as JSON
          if (typeof question.options === 'string') {
            try {
              const parsed = JSON.parse(question.options);
              return Array.isArray(parsed) ? parsed : null;
            } catch (error) {
    console.error('Error occurred:', error);
              // If parsing fails, it might be plain text - return null or handle as needed
              console.warn(`Failed to parse options for question ${question.id}:`, error);
              return null;
            }
          }
          
          return null;
        })()
      }))
    };

    return NextResponse.json(updatedQuizWithParsedOptions);
  } catch (error) {
    console.error('Error updating quiz:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 