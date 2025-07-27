import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Since user ID and student ID are the same, use the user ID directly
    const studentId = session.user.id;

    // Get comprehensive subscription status
    const subscriptionStatus = await SubscriptionCommissionService.getStudentSubscriptionStatus(studentId);
    
    // Get subscription logs
    const logs = await SubscriptionCommissionService.getStudentSubscriptionLogs(studentId, 10);

    return NextResponse.json({
      subscriptionStatus,
      logs
    });
  } catch (error) {
    console.error('Error fetching student subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;
    const body = await request.json();
    const { planType, billingCycle = 'MONTHLY', amount, startTrial = false } = body;

    if (!planType || !['BASIC', 'PREMIUM', 'PRO'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Check if student already has a subscription
    const existingSubscription = await prisma.studentSubscription.findUnique({
      where: { studentId }
    });

    if (existingSubscription && ['ACTIVE', 'PAST_DUE', 'TRIAL'].includes(existingSubscription.status)) {
      return NextResponse.json({ error: 'Active subscription already exists' }, { status: 400 });
    }

    // Create subscription using new service method
    const subscription = await SubscriptionCommissionService.createStudentSubscription(
      studentId,
      planType,
      billingCycle,
      session.user.id,
      startTrial,
      amount
    );

    // Get the subscription with tier details for response
    const subscriptionWithTier = await prisma.studentSubscription.findUnique({
      where: { id: subscription.id },
      include: { studentTier: true }
    });

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription: {
        id: subscription.id,
        planType: subscriptionWithTier?.studentTier?.planType,
        status: subscription.status,
        startDate: subscription.startDate.toISOString(),
        endDate: subscription.endDate.toISOString(),
        billingCycle: subscriptionWithTier?.studentTier?.billingCycle,
        amount: subscriptionWithTier?.studentTier?.price,
        currency: subscriptionWithTier?.studentTier?.currency,
        features: subscriptionWithTier?.studentTier?.features,
        autoRenew: subscription.autoRenew
      }
    });
  } catch (error) {
    console.error('Error creating student subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;
    const body = await request.json();
    const { planType, billingCycle, action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    // Get current subscription
    const currentSubscription = await prisma.studentSubscription.findUnique({
      where: { studentId },
      include: { studentTier: true }
    });

    if (!currentSubscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    let subscription;

    switch (action) {
      case 'UPGRADE':
        if (!planType || !['BASIC', 'PREMIUM', 'PRO'].includes(planType)) {
          return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
        }
        
        // Validate upgrade
        const planHierarchy = { BASIC: 1, PREMIUM: 2, PRO: 3 };
        const currentLevel = planHierarchy[currentSubscription.studentTier?.planType as keyof typeof planHierarchy];
        const newLevel = planHierarchy[planType as keyof typeof planHierarchy];
        
        if (newLevel <= currentLevel) {
          return NextResponse.json({ error: 'Can only upgrade to a higher tier plan' }, { status: 400 });
        }

        // Use the new service method for upgrade
        subscription = await SubscriptionCommissionService.createStudentSubscription(
          studentId,
          planType,
          billingCycle || currentSubscription.studentTier?.billingCycle || 'MONTHLY',
          session.user.id
        );
        break;

      case 'DOWNGRADE':
        if (!planType || !['BASIC', 'PREMIUM'].includes(planType)) {
          return NextResponse.json({ error: 'Invalid plan type for downgrade' }, { status: 400 });
        }
        
        // Validate downgrade
        if (currentSubscription.studentTier?.planType === 'BASIC') {
          return NextResponse.json({ error: 'Cannot downgrade from BASIC plan' }, { status: 400 });
        }

        // Use the new service method for downgrade
        subscription = await SubscriptionCommissionService.createStudentSubscription(
          studentId,
          planType,
          billingCycle || currentSubscription.studentTier?.billingCycle || 'MONTHLY',
          session.user.id
        );
        break;

      case 'REACTIVATE':
        if (currentSubscription.status !== 'CANCELLED') {
          return NextResponse.json({ error: 'Subscription is not cancelled' }, { status: 400 });
        }

        const newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + (currentSubscription.studentTier?.billingCycle === 'ANNUAL' ? 12 : 1));

        subscription = await prisma.studentSubscription.update({
          where: { id: currentSubscription.id },
          data: {
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: newEndDate,
            autoRenew: true,
            cancellationReason: null,
            cancelledAt: null,
            updatedAt: new Date()
          }
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get the subscription with tier details for response
    const subscriptionWithTier = await prisma.studentSubscription.findUnique({
      where: { id: subscription.id },
      include: { studentTier: true }
    });

    return NextResponse.json({
      message: `Subscription ${action.toLowerCase()}d successfully`,
      subscription: {
        id: subscription.id,
        planType: subscriptionWithTier?.studentTier?.planType,
        status: subscription.status,
        startDate: subscription.startDate.toISOString(),
        endDate: subscription.endDate.toISOString(),
        billingCycle: subscriptionWithTier?.studentTier?.billingCycle,
        amount: subscriptionWithTier?.studentTier?.price,
        currency: subscriptionWithTier?.studentTier?.currency,
        autoRenew: subscription.autoRenew
      }
    });

  } catch (error) {
    console.error('Error updating student subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;

    // Get current subscription
    const subscription = await prisma.studentSubscription.findUnique({
      where: { studentId },
      include: { studentTier: true }
    });

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason') || 'Subscription cancelled by user';

    // Cancel subscription
    const cancelledSubscription = await prisma.studentSubscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
        cancelledAt: new Date(),
        autoRenew: false,
        updatedAt: new Date()
      }
    });

    // Log the cancellation
    await prisma.subscriptionLog.create({
      data: {
        subscriptionId: cancelledSubscription.id,
        action: 'CANCEL',
        oldPlan: subscription.studentTier?.planType,
        oldAmount: subscription.studentTier?.price,
        oldBillingCycle: subscription.studentTier?.billingCycle,
        userId: session.user.id,
        reason
      }
    });

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      subscription: {
        id: cancelledSubscription.id,
        planType: subscription.studentTier?.planType,
        status: cancelledSubscription.status,
        cancelledAt: cancelledSubscription.cancelledAt?.toISOString(),
        cancellationReason: cancelledSubscription.cancellationReason
      }
    });

  } catch (error) {
    console.error('Error cancelling student subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 