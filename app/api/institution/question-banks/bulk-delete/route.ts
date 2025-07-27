import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    const { bankIds } = body;

    if (!bankIds || !Array.isArray(bankIds) || bankIds.length === 0) {
      return NextResponse.json({ error: 'No question banks specified for deletion' }, { status: 400 });
    }

    // Verify user has permission to delete all specified banks
    const banksToDelete = await prisma.questionBank.findMany({
      where: {
        id: { in: bankIds },
        created_by: session.user.id
      }
    });

    if (banksToDelete.length !== bankIds.length) {
      return NextResponse.json({ error: 'Access denied to some question banks' }, { status: 403 });
    }

    // Delete questions first (due to foreign key constraints)
    await prisma.question.deleteMany({
      where: {
        question_bank_id: { in: bankIds }
      }
    });

    // Delete the question banks
    await prisma.questionBank.deleteMany({
      where: {
        id: { in: bankIds }
      }
    });

    return NextResponse.json({
      message: `${bankIds.length} question bank(s) deleted successfully`,
      deletedCount: bankIds.length
    });
  } catch (error) {
    console.error('Error bulk deleting question banks:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 