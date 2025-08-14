import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PostTrialPaymentService } from '@/lib/post-trial-payment-service';

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
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // Verify the subscription belongs to the institution and is in payment required state
    const subscription = await prisma.institutionSubscription.findFirst({
      where: {
        id: subscriptionId,
        institutionId: user.institution.id,
        status: 'PAYMENT_REQUIRED'
      }
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found or not in payment required state' }, { status: 404 });
    }

    // Create payment intent for post-trial payment
    const paymentResult = await PostTrialPaymentService.createPostTrialPaymentIntent({
      subscriptionId,
      userId: session.user.id,
      userType: 'INSTITUTION',
      planType: subscription.planType,
      billingCycle: subscription.billingCycle,
      amount: subscription.amount,
      currency: subscription.currency
    });

    if (!paymentResult.success) {
      return NextResponse.json({ 
        error: 'Failed to create payment intent',
        details: paymentResult.error 
      }, { status: 400 });
    }

    return NextResponse.json({
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
      requiresAction: paymentResult.requiresAction
    });

  } catch (error) {
    console.error('Error creating post-trial payment intent:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    // Get subscriptions that require payment
    const subscriptions = await prisma.institutionSubscription.findMany({
      where: {
        institutionId: user.institution.id,
        status: 'PAYMENT_REQUIRED'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        planType: sub.planType,
        amount: sub.amount,
        currency: sub.currency,
        billingCycle: sub.billingCycle,
        endDate: sub.endDate,
        metadata: sub.metadata
      }))
    });

  } catch (error) {
    console.error('Error getting post-trial payment subscriptions:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
