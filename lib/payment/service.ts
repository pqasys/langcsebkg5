import { prisma } from '@/lib/prisma';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { getPaymentGatewayConfig } from './config';
import Stripe from 'stripe';
import { ManualPaymentService } from './manual-payment';

export class PaymentService {
  private stripe: Stripe;

  constructor() {
    const stripeConfig = getPaymentGatewayConfig(PaymentMethod.CREDIT_CARD);
    this.stripe = new Stripe(stripeConfig?.config.secretKey || '', {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(
    enrollmentId: string,
    amount: number,
    currency: string,
    method: PaymentMethod
  ) {
    // Create enrollment record first
    const enrollment = await prisma.studentCourseEnrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true },
    });

    if (!enrollment) {
      throw new Error(`Enrollment not found - Context: throw new Error('Enrollment not found');...`);
    }

    // Handle different payment methods
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
        return this.handleStripePayment(enrollmentId, amount, currency);
      case PaymentMethod.PAYPAL:
        return this.handlePayPalPayment(enrollmentId, amount, currency);
      case PaymentMethod.OFFLINE:
        return ManualPaymentService.createOfflinePayment(enrollmentId, amount, currency);
      case PaymentMethod.BANK_TRANSFER:
        return ManualPaymentService.createBankTransferPayment(enrollmentId, amount, currency);
      case PaymentMethod.TEST_MODE:
        return this.handleTestPayment(enrollmentId, amount, currency);
      case PaymentMethod.BYPASS:
        return this.handleBypassPayment(enrollmentId, amount, currency);
      default:
        throw new Error(`Unsupported payment method - Context: return this.handleBypassPayment(enrollmentId, amou...`);
    }
  }

  private async handleStripePayment(
    enrollmentId: string,
    amount: number,
    currency: string
  ) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        enrollmentId,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        enrollmentId,
        amount,
        currency,
        method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.PENDING,
        transactionId: paymentIntent.id,
        paymentDetails: paymentIntent,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  private async handlePayPalPayment(
    enrollmentId: string,
    amount: number,
    currency: string
  ) {
    // Implement PayPal payment creation
    // This would use PayPal's SDK to create an order
    throw new Error(`PayPal integration not implemented yet - Context: currency: string...`);
  }

  private async handleTestPayment(
    enrollmentId: string,
    amount: number,
    currency: string
  ) {
    // Create test payment record
    const payment = await prisma.payment.create({
      data: {
        enrollmentId,
        amount,
        currency,
        method: PaymentMethod.TEST_MODE,
        status: PaymentStatus.COMPLETED,
        paymentDetails: {
          testMode: true,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Update enrollment status
    await prisma.studentCourseEnrollment.update({
      where: { id: enrollmentId },
      data: { status: 'IN_PROGRESS' },
    });

    return {
      paymentId: payment.id,
      status: payment.status,
    };
  }

  private async handleBypassPayment(
    enrollmentId: string,
    amount: number,
    currency: string
  ) {
    // Create bypass payment record
    const payment = await prisma.payment.create({
      data: {
        enrollmentId,
        amount,
        currency,
        method: PaymentMethod.BYPASS,
        status: PaymentStatus.COMPLETED,
        paymentDetails: {
          bypass: true,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Update enrollment status
    await prisma.studentCourseEnrollment.update({
      where: { id: enrollmentId },
      data: { status: 'IN_PROGRESS' },
    });

    return {
      paymentId: payment.id,
      status: payment.status,
    };
  }

  async handleWebhook(event: unknown) {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const enrollmentId = paymentIntent.metadata.enrollmentId;

      // Update payment status
      await prisma.payment.updateMany({
        where: {
          transactionId: paymentIntent.id,
        },
        data: {
          status: PaymentStatus.COMPLETED,
        },
      });

      // Update enrollment status
      await prisma.studentCourseEnrollment.update({
        where: { id: enrollmentId },
        data: { status: 'IN_PROGRESS' },
      });
    }
  }
} 