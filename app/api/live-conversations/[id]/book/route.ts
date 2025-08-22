import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import {
  getStudentLiveConversationEntitlements,
  getInstitutionLiveConversationDefaults,
  mergeLiveConversationEntitlements,
  type LiveConversationsEntitlements,
} from '@/lib/subscription-pricing';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';

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
    const body = await request.json().catch(() => ({}));
    const { notes } = body || {};

    // Get the conversation (base row)
    const conversation = await prisma.liveConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check if conversation is still available
    if (conversation.status !== 'SCHEDULED') {
      return NextResponse.json({ error: 'Conversation is not available for booking' }, { status: 400 });
    }

    // Check if user is already booked
    const existingBooking = await prisma.liveConversationBooking.findFirst({
      where: { conversationId, userId: session.user.id, status: { not: 'CANCELLED' } },
    });
    if (existingBooking) {
      return NextResponse.json({ error: 'You are already booked for this conversation' }, { status: 400 });
    }

    // Check if conversation is full
    if (conversation.currentParticipants >= conversation.maxParticipants) {
      return NextResponse.json({ error: 'Conversation is full' }, { status: 400 });
    }

    // Enforce entitlements based on subscription/institution
    const entitlementResult = await checkEntitlementsForBooking(session.user.id, conversation);
    if (!entitlementResult.allowed) {
      return NextResponse.json(
        {
          error: entitlementResult.reason || 'Booking not allowed under your plan',
          redirectUrl: entitlementResult.redirectUrl,
          details: entitlementResult.details,
        },
        { status: entitlementResult.statusCode || 402 }
      );
    }

    // Create booking
    const booking = await prisma.liveConversationBooking.create({
      data: {
        conversationId,
        userId: session.user.id,
        status: conversation.isFree ? 'CONFIRMED' : 'PENDING',
        bookedAt: new Date(),
        paymentStatus: conversation.isFree ? 'PAID' : 'PENDING',
        amount: Number(conversation.price || 0),
        currency: 'USD',
        metadata: notes ? { notes } : undefined,
      },
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
        isInstructor: false,
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
        userId: session.user.id,
        status: { not: 'CANCELLED' },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if conversation is too close to start time (e.g., within 24 hours)
    const now = new Date();
    const convo = await prisma.liveConversation.findUnique({ where: { id: conversationId } });
    if (!convo) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    const timeUntilStart = convo.startTime.getTime() - now.getTime();
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
      },
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

/**
 * Check Live Conversations entitlements for a booking attempt.
 * Applies student subscription tier and institution defaults, then enforces caps.
 */
async function checkEntitlementsForBooking(
  userId: string,
  conversation: any
): Promise<{
  allowed: boolean;
  reason?: string;
  redirectUrl?: string;
  statusCode?: number;
  details?: Record<string, any>;
}> {
  try {
    // 0) Per-session gating overrides
    if (conversation?.requiresSubscription) {
      const subscription = await prisma.studentSubscription.findUnique({ where: { studentId: userId } })
      const planType = subscription?.planType || null
      if (!planType) {
        return { allowed: false, reason: 'Subscription required to book this session', redirectUrl: '/subscription-signup', statusCode: 402 }
      }
      if (Array.isArray(conversation.allowedStudentTiers) && conversation.allowedStudentTiers.length > 0) {
        if (!conversation.allowedStudentTiers.includes(planType)) {
          return { allowed: false, reason: 'Your plan does not include access to this session', redirectUrl: '/subscription-signup', statusCode: 402, details: { allowed: conversation.allowedStudentTiers } }
        }
      }
      // Institution gating
      if (Array.isArray(conversation.allowedInstitutionTiers) && conversation.allowedInstitutionTiers.length > 0) {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { institutionId: true } })
        if (user?.institutionId) {
          try {
            const instStatus = await SubscriptionCommissionService.getSubscriptionStatus(user.institutionId)
            const instPlan = instStatus.currentPlan as string | undefined
            if (!instPlan || !conversation.allowedInstitutionTiers.includes(instPlan)) {
              return { allowed: false, reason: 'Your institution plan does not allow this session', redirectUrl: '/subscription-signup', statusCode: 402, details: { allowed: conversation.allowedInstitutionTiers } }
            }
          } catch {}
        } else {
          // Not institution-linked but session expects institution tiers
          return { allowed: false, reason: 'Institution plan required to access this session', redirectUrl: '/subscription-signup', statusCode: 402 }
        }
      }
    }

    // 1) Resolve student subscription plan type (if any)
    const subscription = await prisma.studentSubscription.findUnique({
      where: { studentId: userId },
    });
    const studentPlanType = subscription?.planType || 'BASIC';
    const studentEnt = getStudentLiveConversationEntitlements(studentPlanType);

    // 2) Resolve institution tier defaults (if enrolled)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { institutionId: true },
    });
    let instEnt: LiveConversationsEntitlements = {
      groupSessionsPerMonth: 0,
      oneToOneSessionsPerMonth: 0,
      fairUseMinutesPerMonth: 0,
      recordingRetentionDays: 0,
      bookingHorizonDays: 0,
    };
    if (user?.institutionId) {
      try {
        const instStatus = await SubscriptionCommissionService.getSubscriptionStatus(user.institutionId);
        const instPlan = instStatus.currentPlan as string | undefined;
        if (instPlan) {
          instEnt = getInstitutionLiveConversationDefaults(instPlan);
        }
      } catch (e) {
        logger.warn?.('Failed to fetch institution status for entitlements; defaulting to none');
      }
    }

    // 3) Merge entitlements (take max per field)
    const ent = mergeLiveConversationEntitlements(studentEnt, instEnt);

    // 4) Enforce booking horizon
    if (ent.bookingHorizonDays > 0) {
      const now = new Date();
      const msAhead = conversation.startTime.getTime() - now.getTime();
      const daysAhead = msAhead / (1000 * 60 * 60 * 24);
      if (daysAhead > ent.bookingHorizonDays) {
        return {
          allowed: false,
          reason: `Bookings allowed up to ${ent.bookingHorizonDays} days in advance for your plan`,
          redirectUrl: '/subscription-signup',
          statusCode: 403,
          details: { bookingHorizonDays: ent.bookingHorizonDays }
        };
      }
    }

    // 5) Determine session type (group vs 1:1)
    const isOneToOne = (conversation.maxParticipants ?? 0) <= 2 || conversation.conversationType === 'PRIVATE';

    // 6) Compute current cycle usage (calendar month)
    const cycleStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const cycleEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);

    const bookings = await prisma.liveConversationBooking.findMany({
      where: {
        userId,
        status: { not: 'CANCELLED' },
        bookedAt: { gte: cycleStart, lte: cycleEnd },
      },
      select: { conversationId: true },
    });

    const bookedConversationIds = Array.from(new Set(bookings.map((b) => b.conversationId)));
    const bookedConversations = bookedConversationIds.length
      ? await prisma.liveConversation.findMany({ where: { id: { in: bookedConversationIds } } })
      : [];

    let groupCount = 0;
    let oneToOneCount = 0;
    let minutesConsumed = 0;
    for (const conv of bookedConversations) {
      const bIsOneToOne = (conv.maxParticipants ?? 0) <= 2 || conv.conversationType === 'PRIVATE';
      if (bIsOneToOne) {
        oneToOneCount += 1;
      } else {
        groupCount += 1;
      }
      minutesConsumed += conv.duration || 0;
    }

    // 7) Enforce caps
    if (isOneToOne) {
      if (ent.oneToOneSessionsPerMonth >= 0 && oneToOneCount >= ent.oneToOneSessionsPerMonth) {
        return {
          allowed: false,
          reason: 'Monthly 1:1 session limit reached for your plan',
          redirectUrl: '/subscription-signup',
          statusCode: 402,
          details: { used: oneToOneCount, cap: ent.oneToOneSessionsPerMonth }
        };
      }
    } else {
      if (ent.groupSessionsPerMonth >= 0 && groupCount >= ent.groupSessionsPerMonth) {
        return {
          allowed: false,
          reason: 'Monthly group session limit reached for your plan',
          redirectUrl: '/subscription-signup',
          statusCode: 402,
          details: { used: groupCount, cap: ent.groupSessionsPerMonth }
        };
      }
    }

    if (ent.fairUseMinutesPerMonth > 0 && minutesConsumed >= ent.fairUseMinutesPerMonth) {
      return {
        allowed: false,
        reason: 'Monthly fair-use minutes limit reached for your plan',
        redirectUrl: '/subscription-signup',
        statusCode: 402,
        details: { used: minutesConsumed, cap: ent.fairUseMinutesPerMonth }
      };
    }

    // BASIC plan with no institution: allow exactly if entitlements non-zero, otherwise suggest trial
    const hasAnyAllowance =
      (isOneToOne ? (ent.oneToOneSessionsPerMonth !== 0) : (ent.groupSessionsPerMonth !== 0)) ||
      ent.fairUseMinutesPerMonth > 0;
    if (!hasAnyAllowance) {
      return {
        allowed: false,
        reason: 'Your current plan does not include Live Conversations booking',
        redirectUrl: '/subscription/trial',
        statusCode: 402
      };
    }

    return { allowed: true };
  } catch (error) {
    logger.error?.('Entitlement check failed:', error);
    return {
      allowed: false,
      reason: 'Failed to verify entitlements',
      statusCode: 500
    };
  }
}