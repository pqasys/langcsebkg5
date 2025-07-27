import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; questionId: string } }
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

    const questionBankId = params.id;
    const questionId = params.questionId;

    // Verify user has access to the question bank
    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: questionBankId,
        OR: [
          { created_by: session.user.id },
          { is_public: true },
          {
            created_by: {
              in: await prisma.user.findMany({
                where: { institution_id: user.institution.id },
                select: { id: true }
              }).then(users => users.map(u => u.id))
            }
          }
        ]
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found' }, { status: 404 });
    }

    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        question_bank_id: questionBankId
      }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching question:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; questionId: string } }
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

    const questionBankId = params.id;
    const questionId = params.questionId;

    // Verify user has access to the question bank
    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: questionBankId,
        OR: [
          { created_by: session.user.id },
          {
            created_by: {
              in: await prisma.user.findMany({
                where: { institution_id: user.institution.id },
                select: { id: true }
              }).then(users => users.map(u => u.id))
            }
          }
        ]
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found or access denied' }, { status: 404 });
    }

    // Verify question exists and user has permission to edit
    const existingQuestion = await prisma.question.findFirst({
      where: {
        id: questionId,
        question_bank_id: questionBankId,
        created_by: session.user.id
      }
    });

    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found or access denied' }, { status: 404 });
    }

    const body = await request.json();
    const { 
      question_text, 
      question_type, 
      options, 
      correct_answer, 
      explanation, 
      difficulty, 
      category, 
      tags, 
      points 
    } = body;

    if (!question_text || !question_type) {
      return NextResponse.json({ error: 'Question text and type are required' }, { status: 400 });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        question_text,
        question_type,
        options: options || [],
        correct_answer,
        explanation,
        difficulty: difficulty || 'MEDIUM',
        category,
        tags: tags || [],
        points: points || 1
      }
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; questionId: string } }
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

    const questionBankId = params.id;
    const questionId = params.questionId;

    // Verify user has access to the question bank
    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: questionBankId,
        OR: [
          { created_by: session.user.id },
          {
            created_by: {
              in: await prisma.user.findMany({
                where: { institution_id: user.institution.id },
                select: { id: true }
              }).then(users => users.map(u => u.id))
            }
          }
        ]
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found or access denied' }, { status: 404 });
    }

    // Verify question exists and user has permission to delete
    const existingQuestion = await prisma.question.findFirst({
      where: {
        id: questionId,
        question_bank_id: questionBankId,
        created_by: session.user.id
      }
    });

    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found or access denied' }, { status: 404 });
    }

    await prisma.question.delete({
      where: { id: questionId }
    });

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 