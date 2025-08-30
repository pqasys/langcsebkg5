import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import PaymentService from '@/lib/payment-service';
import { isBuildTime } from '@/lib/build-error-handler';
import { SubscriptionPaymentService } from '@/lib/subscription-payment-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(`STRIPE_SECRET_KEY is not set - Context: throw new Error('STRIPE_SECRET_KEY is not set');...`);
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle subscription payments
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { type } = paymentIntent.metadata;
      
      if (type === 'institution_subscription' || type === 'student_subscription') {
        await SubscriptionPaymentService.handleSubscriptionPaymentSuccess(paymentIntent);
      } else {
        // Handle regular course enrollment payments
        await PaymentService.handleWebhook(event);
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { type } = paymentIntent.metadata;
      
      if (type === 'institution_subscription' || type === 'student_subscription') {
        await SubscriptionPaymentService.handleSubscriptionPaymentFailure(paymentIntent);
      } else {
        // Handle regular course enrollment payment failures
        await PaymentService.handleWebhook(event);
      }
    } else {
      // Handle other webhook events
      await PaymentService.handleWebhook(event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:');
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
} 