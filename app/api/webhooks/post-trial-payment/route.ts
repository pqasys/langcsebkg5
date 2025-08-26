import { NextRequest, NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { stripe } from '@/lib/stripe';
import { PostTrialPaymentService } from '@/lib/post-trial-payment-service';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object);
        break;
      
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    // Check if this is a post-trial payment
    if (paymentIntent.metadata?.type === 'post_trial_payment') {
      await PostTrialPaymentService.handlePostTrialPaymentSuccess(paymentIntent.id);
      logger.info(`Post-trial payment succeeded: ${paymentIntent.id}`);
    }
  } catch (error) {
    logger.error('Error handling payment intent succeeded:', error);
    throw error;
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    // Check if this is a post-trial payment
    if (paymentIntent.metadata?.type === 'post_trial_payment') {
      const { subscriptionId, userType } = paymentIntent.metadata;
      const errorMessage = paymentIntent.last_payment_error?.message || 'Payment failed';
      
      await PostTrialPaymentService.handlePostTrialPaymentFailure(
        subscriptionId,
        userType,
        errorMessage
      );
      
      logger.info(`Post-trial payment failed: ${paymentIntent.id}, error: ${errorMessage}`);
    }
  } catch (error) {
    logger.error('Error handling payment intent failed:', error);
    throw error;
  }
}

async function handlePaymentIntentCanceled(paymentIntent: any) {
  try {
    // Check if this is a post-trial payment
    if (paymentIntent.metadata?.type === 'post_trial_payment') {
      const { subscriptionId, userType } = paymentIntent.metadata;
      
      await PostTrialPaymentService.handlePostTrialPaymentFailure(
        subscriptionId,
        userType,
        'Payment was canceled'
      );
      
      logger.info(`Post-trial payment canceled: ${paymentIntent.id}`);
    }
  } catch (error) {
    logger.error('Error handling payment intent canceled:', error);
    throw error;
  }
}
