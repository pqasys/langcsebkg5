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

    const { questionIds } = await request.json();

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: 'Invalid question IDs' }, { status: 400 });
    }

    // Verify user has access to the question bank
    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: params.id,
        institution_id: {
          not: null
        },
        institution: {
          users: {
            some: {
              user_id: session.user.id,
              role: {
                in: ['ADMIN', 'INSTRUCTOR']
              }
            }
          }
        }
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found or access denied' }, { status: 404 });
    }

    // Delete the questions
    const deletedQuestions = await prisma.question.deleteMany({
      where: {
        id: {
          in: questionIds
        },
        question_bank_id: params.id
      }
    });

    return NextResponse.json({ 
      message: `Successfully deleted ${deletedQuestions.count} questions`,
      deletedCount: deletedQuestions.count
    });

  } catch (error) {
    console.error('Error deleting questions:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questionIds, updates } = await request.json();

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: 'Invalid question IDs' }, { status: 400 });
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'Invalid updates data' }, { status: 400 });
    }

    // Verify user has access to the question bank
    const questionBank = await prisma.questionBank.findFirst({
      where: {
        id: params.id,
        institution_id: {
          not: null
        },
        institution: {
          users: {
            some: {
              user_id: session.user.id,
              role: {
                in: ['ADMIN', 'INSTRUCTOR']
              }
            }
          }
        }
      }
    });

    if (!questionBank) {
      return NextResponse.json({ error: 'Question bank not found or access denied' }, { status: 404 });
    }

    // Prepare update data
    const updateData: unknown = {};
    
    if (updates.points !== undefined && updates.points !== '') {
      updateData.points = parseInt(updates.points);
    }
    
    if (updates.difficulty_level !== undefined && updates.difficulty_level !== '') {
      updateData.difficulty_level = updates.difficulty_level;
    }
    
    if (updates.tags !== undefined && updates.tags !== '') {
      updateData.tags = updates.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
    }
    
    if (updates.is_active !== undefined) {
      updateData.is_active = updates.is_active;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }

    // Update the questions
    const updatedQuestions = await prisma.question.updateMany({
      where: {
        id: {
          in: questionIds
        },
        question_bank_id: params.id
      },
      data: updateData
    });

    return NextResponse.json({ 
      message: `Successfully updated ${updatedQuestions.count} questions`,
      updatedCount: updatedQuestions.count
    });

  } catch (error) {
    console.error('Error updating questions:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 