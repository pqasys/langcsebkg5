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

    // Verify user has access to the question
    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        OR: [
          { is_public: true },
          {
            shared_with: {
              has: 'PUBLIC'
            }
          },
          {
            shared_with: {
              has: 'INSTITUTION'
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

    // Find user's default question bank or create one
    let userQuestionBank = await prisma.questionBank.findFirst({
      where: {
        created_by: session.user.id,
        name: 'My Questions'
      }
    });

    if (!userQuestionBank) {
      userQuestionBank = await prisma.questionBank.create({
        data: {
          name: 'My Questions',
          description: 'Questions copied from shared sources',
          created_by: session.user.id
        }
      });
    }

    // Check if question already exists in user's question bank
    const existingQuestion = await prisma.question.findFirst({
      where: {
        question_text: question.question_text,
        question_type: question.question_type,
        question_bank_id: userQuestionBank.id
      }
    });

    if (existingQuestion) {
      return NextResponse.json({ error: 'Question already exists in your question bank' }, { status: 409 });
    }

    // Copy the question
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
        question_bank_id: userQuestionBank.id,
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
        copied_at: new Date()
      }
    });

    // // // console.log('Question copied successfully');
    return NextResponse.json({
      message: 'Question copied successfully',
      question: copiedQuestion,
      questionBank: userQuestionBank.name
    });
  } catch (error) {
    console.error('Error copying question:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 