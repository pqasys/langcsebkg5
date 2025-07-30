import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversationId = params.id;

    // Find the participant
    const participant = await prisma.liveConversationParticipant.findFirst({
      where: {
        conversationId,
        userId: session.user.id,
        status: 'JOINED'
      },
      include: {
        conversation: true
      }
    });

    if (!participant) {
      return NextResponse.json({ error: 'You are not a participant in this conversation' }, { status: 404 });
    }

    // Check if conversation is active
    if (participant.conversation.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Conversation is not active' }, { status: 400 });
    }

    // Calculate duration in conversation
    const joinedAt = participant.joinedAt;
    const leftAt = new Date();
    const duration = Math.floor((leftAt.getTime() - joinedAt.getTime()) / 1000); // in seconds

    // Update participant status
    await prisma.liveConversationParticipant.update({
      where: { id: participant.id },
      data: {
        leftAt,
        duration,
        status: 'LEFT'
      }
    });

    // Update conversation participant count
    await prisma.liveConversation.update({
      where: { id: conversationId },
      data: {
        currentParticipants: {
          decrement: 1
        }
      }
    });

    logger.info(`User ${session.user.id} left conversation ${conversationId} after ${duration} seconds`);

    return NextResponse.json({
      success: true,
      message: 'Successfully left conversation',
      duration
    });

  } catch (error) {
    logger.error('Failed to leave conversation:', error);
    return NextResponse.json(
      { error: 'Failed to leave conversation' },
      { status: 500 }
    );
  }
} 