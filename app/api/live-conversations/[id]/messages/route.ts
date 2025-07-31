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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before'); // For pagination

    // Get the conversation
    const conversation = await prisma.liveConversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          where: {
            userId: session.user.id
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if user has access to view messages
    const hasAccess = await checkUserAccess(session.user.id, conversation);
    if (!hasAccess) {
      return NextResponse.json({ 
        error: 'You do not have access to view this conversation' 
      }, { status: 403 });
    }

    // Build where clause for messages
    const whereClause: any = {
      conversationId
    };

    if (before) {
      whereClause.timestamp = {
        lt: new Date(before)
      };
    }

    // Get messages
    const messages = await prisma.liveConversationMessage.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    });

    // Mark messages as read for the current user
    await prisma.liveConversationMessage.updateMany({
      where: {
        conversationId,
        recipientId: session.user.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    return NextResponse.json({
      success: true,
      messages: messages.reverse(), // Return in chronological order
      total: messages.length
    });

  } catch (error) {
    logger.error('Failed to get conversation messages:', error);
    return NextResponse.json(
      { error: 'Failed to get conversation messages' },
      { status: 500 }
    );
  }
}

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
    const body = await request.json();
    const { content, messageType, recipientId, language, isTranslation, originalMessageId } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Get the conversation
    const conversation = await prisma.liveConversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          where: {
            userId: session.user.id
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if user is a participant
    if (conversation.participants.length === 0) {
      return NextResponse.json({ 
        error: 'You must be a participant to send messages' 
      }, { status: 403 });
    }

    // Check if conversation is active
    if (conversation.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Conversation is not active' }, { status: 400 });
    }

    // Validate message type
    const validMessageTypes = ['TEXT', 'SYSTEM', 'PRIVATE', 'CORRECTION', 'TRANSLATION'];
    if (messageType && !validMessageTypes.includes(messageType)) {
      return NextResponse.json({ error: 'Invalid message type' }, { status: 400 });
    }

    // For private messages, validate recipient
    if (messageType === 'PRIVATE' && recipientId) {
      const recipientParticipant = await prisma.liveConversationParticipant.findFirst({
        where: {
          conversationId,
          userId: recipientId,
          status: 'JOINED'
        }
      });

      if (!recipientParticipant) {
        return NextResponse.json({ error: 'Recipient is not a participant in this conversation' }, { status: 400 });
      }
    }

    // Create message
    const message = await prisma.liveConversationMessage.create({
      data: {
        conversationId,
        senderId: session.user.id,
        recipientId: messageType === 'PRIVATE' ? recipientId : null,
        content: content.trim(),
        messageType: messageType || 'TEXT',
        language: language || 'en',
        isTranslation: isTranslation || false,
        originalMessage: originalMessageId || null,
        timestamp: new Date(),
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // Update participant message count
    await prisma.liveConversationParticipant.updateMany({
      where: {
        conversationId,
        userId: session.user.id
      },
      data: {
        messageCount: {
          increment: 1
        }
      }
    });

    logger.info(`User ${session.user.id} sent message in conversation ${conversationId}`);

    return NextResponse.json({
      success: true,
      message,
      messageId: message.id
    });

  } catch (error) {
    logger.error('Failed to send message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

async function checkUserAccess(userId: string, conversation: any): Promise<boolean> {
  try {
    // Host and instructor can always access messages
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