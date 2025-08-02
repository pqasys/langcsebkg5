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

    // Get the conversation
    const conversation = await prisma.liveConversation.findUnique({
      where: { id: conversationId },
      include: {
        host: true,
        instructor: true,
        participants: {
          include: {
            user: true
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if conversation is active
    if (conversation.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Conversation is not active' }, { status: 400 });
    }

    // Check if user is already a participant
    const existingParticipant = conversation.participants.find(
      p => p.userId === session.user.id
    );

    if (existingParticipant) {
      // Update participant status to joined
      await prisma.liveConversationParticipant.update({
        where: { id: existingParticipant.id },
        data: {
          joinedAt: new Date(),
          status: 'JOINED'
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Rejoined conversation',
        participant: existingParticipant
      });
    }

    // Check if conversation is full
    if (conversation.currentParticipants >= conversation.maxParticipants) {
      return NextResponse.json({ error: 'Conversation is full' }, { status: 400 });
    }

    // Check if user has access to join conversations
    const hasAccess = await checkUserJoinAccess(session.user.id, conversation);
    if (!hasAccess) {
      return NextResponse.json({ 
        error: 'You need a subscription or institution enrollment to join conversations' 
      }, { status: 403 });
    }

    // Create participant
    const participant = await prisma.liveConversationParticipant.create({
      data: {
        conversationId,
        userId: session.user.id,
        joinedAt: new Date(),
        status: 'JOINED',
        isHost: conversation.hostId === session.user.id,
        isInstructor: conversation.instructorId === session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Update conversation participant count
    await prisma.liveConversation.update({
      where: { id: conversationId },
      data: {
        currentParticipants: {
          increment: 1
        }
      }
    });

    logger.info(`User ${session.user.id} joined conversation ${conversationId}`);

    return NextResponse.json({
      success: true,
      participant,
      message: 'Successfully joined conversation'
    });

  } catch (error) {
    logger.error('Failed to join conversation:', error);
    return NextResponse.json(
      { error: 'Failed to join conversation' },
      { status: 500 }
    );
  }
}

async function checkUserJoinAccess(userId: string, conversation: any): Promise<boolean> {
  try {
    // Host and instructor can always join
    if (conversation.hostId === userId || conversation.instructorId === userId) {
      return true;
    }

    // Check if user has active subscription
    const subscription = await prisma.studentSubscription.findFirst({
      where: {
        studentId: userId,
        status: 'ACTIVE'
      }
    });

    if (subscription) {
      return true;
    }

    // Check if user has institution enrollment
    const userWithInstitution = await prisma.user.findUnique({
      where: { id: userId },
      select: { institutionId: true }
    });
    const enrollment = userWithInstitution?.institutionId ? { institution_id: userWithInstitution.institutionId } : null;

    if (enrollment) {
      return true;
    }

    // Check if user is institution staff
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user?.role === 'INSTITUTION') {
      return true;
    }

    // Check if user has a booking for this conversation
    const booking = await prisma.liveConversationBooking.findFirst({
      where: {
        conversationId: conversation.id,
        studentId: userId,
        status: { not: 'CANCELLED' }
      }
    });

    if (booking) {
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Error checking user join access:', error);
    return false;
  }
} 