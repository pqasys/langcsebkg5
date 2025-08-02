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
    const body = await request.json();
    const { notes } = body;

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
        },
        bookings: {
          where: {
            studentId: session.user.id,
            status: { not: 'CANCELLED' }
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if conversation is still available
    if (conversation.status !== 'SCHEDULED') {
      return NextResponse.json({ error: 'Conversation is not available for booking' }, { status: 400 });
    }

    // Check if user is already booked
    if (conversation.bookings.length > 0) {
      return NextResponse.json({ error: 'You are already booked for this conversation' }, { status: 400 });
    }

    // Check if conversation is full
    if (conversation.currentParticipants >= conversation.maxParticipants) {
      return NextResponse.json({ error: 'Conversation is full' }, { status: 400 });
    }

    // Check if user has access to book conversations
    // This would typically check subscription status or institution enrollment
    const hasAccess = await checkUserBookingAccess(session.user.id);
    if (!hasAccess) {
      return NextResponse.json({ 
        error: 'You need a subscription or institution enrollment to book conversations' 
      }, { status: 403 });
    }

    // Create booking
    const booking = await prisma.liveConversationBooking.create({
      data: {
        conversationId,
        studentId: session.user.id,
        instructorId: conversation.instructorId || conversation.hostId,
        scheduledAt: conversation.startTime,
        duration: conversation.duration,
        status: 'PENDING',
        price: conversation.price,
        currency: 'USD',
        paymentStatus: conversation.isFree ? 'PAID' : 'PENDING',
        notes: notes || null
      },
      include: {
        conversation: {
          include: {
            host: true,
            instructor: true
          }
        },
        student: true,
        instructor: true
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

    // Add user as participant
    await prisma.liveConversationParticipant.create({
      data: {
        conversationId,
        userId: session.user.id,
        status: 'JOINED',
        isHost: false,
        isInstructor: false
      }
    });

    logger.info(`User ${session.user.id} booked conversation ${conversationId}`);

    return NextResponse.json({
      success: true,
      booking,
      message: 'Successfully booked conversation'
    });

  } catch (error) {
    logger.error('Failed to book conversation:', error);
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

    const conversationId = params.id;

    // Find the booking
    const booking = await prisma.liveConversationBooking.findFirst({
      where: {
        conversationId,
        studentId: session.user.id,
        status: { not: 'CANCELLED' }
      },
      include: {
        conversation: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if conversation is too close to start time (e.g., within 24 hours)
    const now = new Date();
    const timeUntilStart = booking.conversation.startTime.getTime() - now.getTime();
    const hoursUntilStart = timeUntilStart / (1000 * 60 * 60);

    if (hoursUntilStart < 24) {
      return NextResponse.json({ 
        error: 'Cannot cancel booking within 24 hours of conversation start time' 
      }, { status: 400 });
    }

    // Cancel the booking
    await prisma.liveConversationBooking.update({
      where: { id: booking.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy: session.user.id
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

    // Remove user from participants
    await prisma.liveConversationParticipant.deleteMany({
      where: {
        conversationId,
        userId: session.user.id
      }
    });

    logger.info(`User ${session.user.id} cancelled booking for conversation ${conversationId}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully cancelled booking'
    });

  } catch (error) {
    logger.error('Failed to cancel booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}

async function checkUserBookingAccess(userId: string): Promise<boolean> {
  try {
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

    return false;
  } catch (error) {
    logger.error('Error checking user booking access:', error);
    return false;
  }
} 