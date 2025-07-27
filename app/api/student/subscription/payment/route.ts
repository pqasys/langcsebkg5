import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SubscriptionPaymentService } from '@/lib/subscription-payment-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { student: true }
    });
    if (!user?.student) {
      return NextResponse.json({ error: 'Student account required' }, { status: 403 });
    }
    
    const body = await request.json();
    const { planType, billingCycle = 'MONTHLY', startTrial = false } = body;
    
    if (!planType || !['BASIC', 'PREMIUM', 'PRO'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Get plan details and calculate amount
    const subscriptionPlans = await import('@/lib/subscription-commission-service');
    const plans = subscriptionPlans.SubscriptionCommissionService.getStudentSubscriptionPlans();
    const plan = plans.find(p => p.planType === planType);
    
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    const amount = billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice;

    // Create payment intent
    const paymentResult = await SubscriptionPaymentService.createStudentSubscriptionPayment({
      studentId: user.student.id,
      userId: session.user.id,
      planType,
      billingCycle,
      amount,
      currency: 'USD',
      startTrial,
      metadata: {
        userId: session.user.id,
        userEmail: user.email
      }
    });

    return NextResponse.json({
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
      customerId: paymentResult.customerId
    });
  } catch (error) {
    console.error('Error creating student subscription payment:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 