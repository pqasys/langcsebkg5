import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Get subscription status
    const subscriptionStatus = await SubscriptionCommissionService.getSubscriptionStatus(user.institution.id);
    
    // Get available plans
    const availablePlans = SubscriptionCommissionService.getSubscriptionPlans();
    
    // Get usage stats
    const usageStats = await SubscriptionCommissionService.getUsageStats(user.institution.id);

    return NextResponse.json({
      subscriptionStatus,
      availablePlans,
      usageStats
    });
  } catch (error) {
    console.error('Error getting subscription info:');
    return NextResponse.json(
      { error: 'Failed to get subscription information' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType, billingCycle } = await request.json();

    if (!planType || !['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    if (!billingCycle || !['MONTHLY', 'ANNUAL'].includes(billingCycle)) {
      return NextResponse.json({ error: 'Invalid billing cycle' }, { status: 400 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Create or update subscription
    const subscription = await SubscriptionCommissionService.createSubscription(
      user.institution.id,
      planType,
      billingCycle
    );

    // // // console.log('Subscription created successfully');
    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    console.error('Error creating subscription:');
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 