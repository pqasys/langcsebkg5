import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
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

    const questionBankId = params.id;
    const body = await request.json();
    const { questionIds } = body;

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: 'No questions specified for deletion' }, { status: 400 });
    }

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

    // Verify user has permission to delete all specified questions
    const questionsToDelete = await prisma.question.findMany({
      where: {
        id: { in: questionIds },
        question_bank_id: questionBankId,
        created_by: session.user.id
      }
    });

    if (questionsToDelete.length !== questionIds.length) {
      return NextResponse.json({ error: 'Access denied to some questions' }, { status: 403 });
    }

    // Delete the questions
    await prisma.question.deleteMany({
      where: {
        id: { in: questionIds }
      }
    });

    return NextResponse.json({
      message: `${questionIds.length} question(s) deleted successfully`,
      deletedCount: questionIds.length
    });
  } catch (error) {
    console.error('Error bulk deleting questions:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 