import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'User not associated with an institution' }, { status: 403 });
    }

    const questionId = params.id;
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Verify user has access to the question
    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        OR: [
          { created_by: session.user.id },
          { is_public: true },
          {
            shared_with: {
              has: 'INSTITUTION'
            }
          },
          {
            shared_with: {
              has: `COURSE_${courseId}`
            }
          }
        ]
      },
      include: {
        questionBank: true
      }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found or access denied' }, { status: 404 });
    }

    // Check if copying is allowed
    if (question.sharing_permissions && !question.sharing_permissions.allowCopy) {
      return NextResponse.json({ error: 'Copying is not allowed for this question' }, { status: 403 });
    }

    // Verify user has access to the target course
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        institution_id: user.institution.id
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Check if question already exists in the course
    const existingQuestion = await prisma.question.findFirst({
      where: {
        question_text: question.question_text,
        question_type: question.question_type,
        questionBank: {
          course_id: courseId
        }
      }
    });

    if (existingQuestion) {
      return NextResponse.json({ error: 'Question already exists in this course' }, { status: 409 });
    }

    // Find or create a question bank for the course
    let courseQuestionBank = await prisma.questionBank.findFirst({
      where: {
        course_id: courseId,
        name: 'Course Questions'
      }
    });

    if (!courseQuestionBank) {
      courseQuestionBank = await prisma.questionBank.create({
        data: {
          name: 'Course Questions',
          description: `Question bank for ${course.name}`,
          course_id: courseId,
          created_by: session.user.id
        }
      });
    }

    // Copy the question to the course
    const copiedQuestion = await prisma.question.create({
      data: {
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.options,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
        difficulty: question.difficulty,
        category: question.category,
        tags: question.tags,
        points: question.points,
        question_bank_id: courseQuestionBank.id,
        created_by: session.user.id,
        copied_from: questionId,
        copied_at: new Date()
      }
    });

    // Create a copy record for tracking
    await prisma.questionCopy.create({
      data: {
        original_question_id: questionId,
        copied_question_id: copiedQuestion.id,
        copied_by: session.user.id,
        copied_to_course_id: courseId,
        copied_at: new Date()
      }
    });

    // // // console.log('Question copied to course successfully');
    return NextResponse.json({
      message: 'Question copied to course successfully',
      question: copiedQuestion,
      course: course.name
    });
  } catch (error) {
    console.error('Error copying question to course:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 