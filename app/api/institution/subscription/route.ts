import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });
    if (!user?.institution) {
      return NextResponse.json({ error: 'Institution account required' }, { status: 403 });
    }

    // Get the institution with subscription details
    const institution = await prisma.institution.findUnique({
      where: { id: user.institution.id },
      include: {
        subscription: {
          include: {
            commissionTier: true,
            billingHistory: {
              orderBy: { billingDate: 'desc' },
              take: 10
            }
          }
        }
      }
    });

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Get comprehensive subscription status
    const subscriptionStatus = await SubscriptionCommissionService.getSubscriptionStatus(user.institution.id);
    
    // Get subscription logs
    const logs = await SubscriptionCommissionService.getInstitutionSubscriptionLogs(user.institution.id, 10);

    // Format the response to match the frontend's SubscriptionData interface
    const subscriptionData = institution.subscription ? {
      id: institution.subscription.id,
      planType: institution.subscription.commissionTier?.planType as 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE',
      status: institution.subscription.status as 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE',
      startDate: institution.subscription.startDate.toISOString(),
      endDate: institution.subscription.endDate.toISOString(),
      billingCycle: institution.subscription.commissionTier?.billingCycle as 'MONTHLY' | 'ANNUAL',
      amount: institution.subscription.commissionTier?.price || 0,
      currency: institution.subscription.commissionTier?.currency || 'USD',
      features: institution.subscription.commissionTier?.features || {},
      effectiveCommissionRate: subscriptionStatus.commissionRate,
      institutionDefaultRate: institution.commissionRate,
      canUpgrade: subscriptionStatus.canUpgrade,
      canDowngrade: subscriptionStatus.canDowngrade,
      hasActiveSubscription: subscriptionStatus.hasActiveSubscription
    } : {
      // Return fallback data when no subscription exists
      id: null,
      planType: null,
      status: null,
      startDate: null,
      endDate: null,
      billingCycle: null,
      amount: 0,
      currency: 'USD',
      features: {},
      effectiveCommissionRate: subscriptionStatus.commissionRate,
      institutionDefaultRate: institution.commissionRate,
      canUpgrade: false,
      canDowngrade: false,
      hasActiveSubscription: false
    };

    return NextResponse.json({
      subscriptionStatus: subscriptionData,
      logs
    });
  } catch (error) {
    console.error('Error fetching institution subscription:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });
    if (!user?.institution) {
      return NextResponse.json({ error: 'Institution account required' }, { status: 403 });
    }
    
    const body = await request.json();
    const { planType, billingCycle = 'MONTHLY', amount, startTrial = false } = body;
    
    if (!planType || !['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Create subscription using the service with trial support
    const subscription = await SubscriptionCommissionService.createSubscription(
      user.institution.id,
      planType,
      billingCycle,
      session.user.id,
      startTrial,
      amount
    );

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription: {
        id: subscription.id,
        planType: subscription.planType,
        status: subscription.status,
        startDate: subscription.startDate.toISOString(),
        endDate: subscription.endDate.toISOString(),
        billingCycle: subscription.billingCycle,
        amount: subscription.amount,
        currency: subscription.currency,
        features: subscription.features,
        autoRenew: subscription.autoRenew
      }
    });
  } catch (error) {
    console.error('Error creating institution subscription:');
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });
    if (!user?.institution) {
      return NextResponse.json({ error: 'Institution account required' }, { status: 403 });
    }
    
    const body = await request.json();
    const { planType, billingCycle, action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    let subscription;

    switch (action) {
      case 'UPGRADE':
        if (!planType || !['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(planType)) {
          return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
        }
        subscription = await SubscriptionCommissionService.createSubscription(
          user.institution.id,
          planType,
          billingCycle || 'MONTHLY',
          session.user.id
        );
        break;

      case 'DOWNGRADE':
        if (!planType || !['STARTER', 'PROFESSIONAL'].includes(planType)) {
          return NextResponse.json({ error: 'Invalid plan type for downgrade' }, { status: 400 });
        }
        subscription = await SubscriptionCommissionService.downgradeSubscription(
          user.institution.id,
          planType,
          session.user.id,
          body.reason
        );
        break;

      case 'REACTIVATE':
        subscription = await SubscriptionCommissionService.reactivateSubscription(
          user.institution.id,
          session.user.id
        );
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      message: `Subscription ${action.toLowerCase()}d successfully`,
      subscription: {
        id: subscription.id,
        planType: subscription.planType,
        status: subscription.status,
        startDate: subscription.startDate.toISOString(),
        endDate: subscription.endDate.toISOString(),
        billingCycle: subscription.billingCycle,
        amount: subscription.amount,
        currency: subscription.currency,
        features: subscription.features,
        autoRenew: subscription.autoRenew
      }
    });
  } catch (error) {
    console.error('Error updating institution subscription:');
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });
    if (!user?.institution) {
      return NextResponse.json({ error: 'Institution account required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason') || 'Subscription cancelled by user';

    // Cancel subscription using the service
    const subscription = await SubscriptionCommissionService.cancelSubscription(
      user.institution.id,
      session.user.id,
      reason
    );

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      subscription: {
        id: subscription.id,
        planType: subscription.planType,
        status: subscription.status,
        cancelledAt: subscription.cancelledAt?.toISOString(),
        cancellationReason: subscription.cancellationReason
      }
    });
  } catch (error) {
    console.error('Error cancelling institution subscription:');
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 