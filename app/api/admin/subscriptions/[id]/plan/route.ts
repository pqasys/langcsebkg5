import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SubscriptionPlanManager } from '@/lib/subscription-plan-manager';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType, billingCycle, reason, effectiveDate } = await request.json();

    if (!planType || !['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    if (!billingCycle || !['MONTHLY', 'ANNUAL'].includes(billingCycle)) {
      return NextResponse.json({ error: 'Invalid billing cycle' }, { status: 400 });
    }

    const result = await SubscriptionPlanManager.changePlan({
      institutionId: params.id,
      newPlanType: planType,
      newBillingCycle: billingCycle,
      effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
      reason
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error changing subscription plan:');
    return NextResponse.json(
      { error: 'Failed to change subscription plan' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 