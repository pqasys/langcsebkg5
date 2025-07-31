import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(
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
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          },
          orderBy: {
            joinedAt: 'asc'
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if user has access to view participants
    const hasAccess = await checkUserAccess(session.user.id, conversation);
    if (!hasAccess) {
      return NextResponse.json({ 
        error: 'You do not have access to view this conversation' 
      }, { status: 403 });
    }

    // Filter participants based on user's access level
    let participants = conversation.participants;

    // If user is not a participant, only show basic info
    const isParticipant = conversation.participants.some(p => p.userId === session.user.id);
    if (!isParticipant) {
      participants = participants.map(p => ({
        ...p,
        user: {
          id: p.user.id,
          name: p.user.name,
          image: p.user.image
          // Don't include email for non-participants
        }
      }));
    }

    return NextResponse.json({
      success: true,
      participants,
      total: participants.length,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        status: conversation.status,
        currentParticipants: conversation.currentParticipants,
        maxParticipants: conversation.maxParticipants
      }
    });

  } catch (error) {
    logger.error('Failed to get conversation participants:', error);
    return NextResponse.json(
      { error: 'Failed to get conversation participants' },
      { status: 500 }
    );
  }
}

async function checkUserAccess(userId: string, conversation: any): Promise<boolean> {
  try {
    // Host and instructor can always view participants
    if (conversation.hostId === userId || conversation.instructorId === userId) {
      return true;
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(p => p.userId === userId);
    if (isParticipant) {
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { institutionId: true }
    });
    const enrollment = user?.institutionId ? { institution_id: user.institutionId } : null;

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
    logger.error('Error checking user access:', error);
    return false;
  }
} 