import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const institutionId = session.user.institutionId;
    const body = await request.json();
    const { planType } = body;

    if (!planType || !['PROFESSIONAL', 'ENTERPRISE'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Check current subscription
    const currentSubscription = await prisma.institutionSubscription.findUnique({
      where: { institutionId }
    });

    if (!currentSubscription || currentSubscription.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Validate upgrade path
    if (currentSubscription.planType === 'STARTER' && planType !== 'PROFESSIONAL') {
      return NextResponse.json(
        { error: 'STARTER plan can only upgrade to PROFESSIONAL' },
        { status: 400 }
      );
    }

    if (currentSubscription.planType === 'PROFESSIONAL' && planType !== 'ENTERPRISE') {
      return NextResponse.json(
        { error: 'PROFESSIONAL plan can only upgrade to ENTERPRISE' },
        { status: 400 }
      );
    }

    // Get plan details
    const planDetails = {
      PROFESSIONAL: { monthlyPrice: 299, annualPrice: 2990 },
      ENTERPRISE: { monthlyPrice: 999, annualPrice: 9990 }
    };

    const plan = planDetails[planType as keyof typeof planDetails];
    const amount = currentSubscription.billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice;

    // Update subscription
    const updatedSubscription = await prisma.institutionSubscription.update({
      where: { institutionId },
      data: {
        planType,
        amount,
        updatedAt: new Date()
      }
    });

    // Update institution's commission rate
    const commissionTier = await prisma.commissionTier.findUnique({
      where: { planType }
    });

    if (commissionTier) {
      await prisma.institution.update({
        where: { id: institutionId },
        data: { commissionRate: commissionTier.commissionRate }
      });
    }

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      newCommissionRate: commissionTier?.commissionRate
    });
  } catch (error) {
    console.error('Error upgrading subscription:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 