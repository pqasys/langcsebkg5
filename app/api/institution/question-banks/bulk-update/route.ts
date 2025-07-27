import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
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
    const { bankIds, updates } = body;

    if (!bankIds || !Array.isArray(bankIds) || bankIds.length === 0) {
      return NextResponse.json({ error: 'No question banks specified for update' }, { status: 400 });
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'No updates specified' }, { status: 400 });
    }

    // Verify user has permission to update all specified banks
    const banksToUpdate = await prisma.questionBank.findMany({
      where: {
        id: { in: bankIds },
        created_by: session.user.id
      }
    });

    if (banksToUpdate.length !== bankIds.length) {
      return NextResponse.json({ error: 'Access denied to some question banks' }, { status: 403 });
    }

    // Prepare update data (only allow specific fields to be updated)
    const updateData: unknown = {};
    
    if (updates.category !== undefined) {
      updateData.category = updates.category;
    }
    
    if (updates.tags !== undefined) {
      updateData.tags = Array.isArray(updates.tags) ? updates.tags : [];
    }
    
    if (updates.is_public !== undefined) {
      updateData.is_public = Boolean(updates.is_public);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid updates specified' }, { status: 400 });
    }

    // Update the question banks
    const result = await prisma.questionBank.updateMany({
      where: {
        id: { in: bankIds }
      },
      data: updateData
    });

    return NextResponse.json({
      message: `${result.count} question bank(s) updated successfully`,
      updatedCount: result.count
    });
  } catch (error) {
    console.error('Error bulk updating question banks:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 