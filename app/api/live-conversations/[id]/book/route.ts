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

    const { id: conversationId } = params;
    const body = await request.json();
    const { paymentMethod, transactionId } = body;

    // Get conversation
    const conversation = await prisma.liveConversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        bookings: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Check if conversation is still available
    if (conversation.status !== 'SCHEDULED') {
      return NextResponse.json(
        { error: 'Conversation is not available for booking' },
        { status: 400 }
      );
    }

    // Check if user is already booked
    if (conversation.bookings.length > 0) {
      return NextResponse.json(
        { error: 'You are already booked for this conversation' },
        { status: 400 }
      );
    }

    // Check if conversation is full
    if (conversation.currentParticipants >= conversation.maxParticipants) {
      return NextResponse.json(
        { error: 'Conversation is full' },
        { status: 400 }
      );
    }

    // Check if user is the host
    if (conversation.hostId === session.user.id) {
      return NextResponse.json(
        { error: 'Host cannot book their own conversation' },
        { status: 400 }
      );
    }

    // Check if user is the instructor
    if (conversation.instructorId === session.user.id) {
      return NextResponse.json(
        { error: 'Instructor cannot book their own conversation' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.liveConversationBooking.create({
      data: {
        conversationId,
        userId: session.user.id,
        status: 'CONFIRMED',
        paymentStatus: conversation.isFree ? 'PAID' : 'PAID',
        amount: conversation.price,
        currency: 'USD',
        paymentMethod: paymentMethod || 'FREE',
        transactionId: transactionId || null,
      },
      include: {
        conversation: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update conversation participant count
    await prisma.liveConversation.update({
      where: { id: conversationId },
      data: {
        currentParticipants: {
          increment: 1,
        },
      },
    });

    logger.info(`Live conversation booked: ${conversationId} by user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    logger.error('Error booking live conversation:', error);
    return NextResponse.json(
      { error: 'Failed to book conversation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = params;

    // Get booking
    const booking = await prisma.liveConversationBooking.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
      include: {
        conversation: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if conversation has started
    if (booking.conversation.startTime <= new Date()) {
      return NextResponse.json(
        { error: 'Cannot cancel booking for a conversation that has started' },
        { status: 400 }
      );
    }

    // Cancel booking
    await prisma.liveConversationBooking.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    // Update conversation participant count
    await prisma.liveConversation.update({
      where: { id: conversationId },
      data: {
        currentParticipants: {
          decrement: 1,
        },
      },
    });

    logger.info(`Live conversation booking cancelled: ${conversationId} by user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    logger.error('Error cancelling live conversation booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
} 