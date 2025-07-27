import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planType, billingCycle } = body;

    if (!planType || !['BASIC', 'PREMIUM', 'PRO'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Check if user is a student
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { student: true }
    });

    if (!user?.student) {
      return NextResponse.json({ error: 'Student account required' }, { status: 403 });
    }

    // Get current subscription
    const currentSubscription = await prisma.studentSubscription.findUnique({
      where: { 
        studentId: user.student.id
      }
    });

    if (!currentSubscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    // Check if upgrade is valid
    const planHierarchy = { BASIC: 1, PREMIUM: 2, PRO: 3 };
    const currentPlanLevel = planHierarchy[currentSubscription.planType as keyof typeof planHierarchy];
    const newPlanLevel = planHierarchy[planType as keyof typeof planHierarchy];

    if (newPlanLevel <= currentPlanLevel) {
      return NextResponse.json({ error: 'Can only upgrade to a higher tier plan' }, { status: 400 });
    }

    // Calculate new amount based on billing cycle
    const newAmount = billingCycle === 'ANNUAL' ? 
      (planType === 'BASIC' ? 124.99 : planType === 'PREMIUM' ? 239.99 : 479.99) :
      (planType === 'BASIC' ? 12.99 : planType === 'PREMIUM' ? 24.99 : 49.99);

    // Update existing subscription
    const updatedSubscription = await prisma.studentSubscription.update({
      where: { id: currentSubscription.id },
      data: {
        planType,
        billingCycle: billingCycle || currentSubscription.billingCycle,
        amount: newAmount,
        updatedAt: new Date()
      }
    });

    // Log the upgrade
    await prisma.subscriptionLog.create({
      data: {
        subscriptionId: updatedSubscription.id,
        action: 'UPGRADE',
        oldPlan: currentSubscription.planType,
        newPlan: planType,
        oldAmount: currentSubscription.amount,
        newAmount: newAmount,
        userId: session.user.id
      }
    });

    return NextResponse.json({
      id: updatedSubscription.id,
      planType: updatedSubscription.planType,
      status: updatedSubscription.status,
      startDate: updatedSubscription.startDate.toISOString(),
      endDate: updatedSubscription.endDate.toISOString(),
      billingCycle: updatedSubscription.billingCycle,
      amount: updatedSubscription.amount,
      currency: 'USD',
      autoRenew: updatedSubscription.autoRenew
    });

  } catch (error) {
    console.error('Error upgrading student subscription:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 