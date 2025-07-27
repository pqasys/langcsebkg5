import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
// import { toast } from 'sonner';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(`STRIPE_SECRET_KEY is not set - Context: throw new Error('STRIPE_SECRET_KEY is not set');...`);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export type PaymentMethod = 'STRIPE' | 'MANUAL' | 'BANK_TRANSFER' | 'CASH';

export interface PaymentIntentData {
  amount: number;
  currency: string;
  metadata: {
    enrollmentId: string;
    studentId: string;
    courseId: string;
  };
}

export class PaymentService {
  static async createPaymentIntent(data: PaymentIntentData) {
    try {
      const enrollment = await prisma.studentCourseEnrollment.findUnique({
        where: { id: data.metadata.enrollmentId },
        include: {
          course: {
            include: {
              institution: true,
            },
          },
        },
      });

      if (!enrollment) {
        throw new Error(`Enrollment not found - Context: },...`);
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        metadata: {
          ...data.metadata,
          institutionId: enrollment.course.institutionId,
          commissionRate: enrollment.course.institution.commissionRate.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  static async markAsPaid(
    enrollmentId: string,
    paymentMethod: PaymentMethod,
    metadata: {
      processedBy?: string;
      referenceNumber?: string;
      notes?: string;
    } = {}
  ) {
    try {
      const enrollment = await prisma.studentCourseEnrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          course: {
            include: {
              institution: true,
            },
          },
        },
      });

      if (!enrollment) {
        throw new Error(`Enrollment not found - Context: },...`);
      }

      // Get the booking to get the calculated price
      const booking = await prisma.booking.findFirst({
        where: {
          courseId: enrollment.courseId,
          studentId: enrollment.studentId,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Use booking amount if available, otherwise fallback to course base price
      const amount = booking?.amount || enrollment.course.base_price;
      
      // Get commission rate from institution
      const commissionRate = enrollment.course.institution.commissionRate;
      const commissionAmount = (amount * commissionRate) / 100;
      const institutionAmount = amount - commissionAmount;

      await prisma.$transaction(async (tx) => {
        // Update enrollment status
        await tx.studentCourseEnrollment.update({
          where: { id: enrollmentId },
          data: {
            status: 'ENROLLED',
            paymentStatus: 'PAID',
            paymentDate: new Date(),
            paymentMethod,
            paymentId: metadata.referenceNumber || `MANUAL_${Date.now()}`,
          },
        });

        // Create payment record
        await tx.payment.create({
          data: {
            enrollmentId,
            amount,
            currency: 'usd', // TODO: Make this configurable via institution or course settings. See roadmap item: 'Multi-currency support'.
            status: 'COMPLETED',
            paymentMethod,
            paymentId: metadata.referenceNumber || `MANUAL_${Date.now()}`,
            metadata: {
              processedBy: metadata.processedBy,
              notes: metadata.notes,
              commissionRate,
              commissionAmount,
              institutionAmount,
            },
          },
        });

        // Create institution payout record
        await tx.institutionPayout.create({
          data: {
            institutionId: enrollment.course.institutionId,
            enrollmentId,
            amount: institutionAmount,
            status: 'PENDING',
            metadata: {
              paymentId: metadata.referenceNumber || `MANUAL_${Date.now()}`,
              paymentMethod,
            },
          },
        });
      });

      return { success: true };
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      throw error;
    }
  }

  static async handleWebhook(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
        case 'charge.refunded':
          await this.handleRefund(event.data.object as Stripe.Charge);
          break;
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  private static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const { enrollmentId, institutionId, commissionRate } = paymentIntent.metadata;
    const amount = paymentIntent.amount / 100; // Convert from cents
    const commissionAmount = (amount * Number(commissionRate)) / 100;
    const institutionAmount = amount - commissionAmount;
    
    await prisma.$transaction(async (tx) => {
      // Update enrollment status
      await tx.studentCourseEnrollment.update({
        where: { id: enrollmentId },
        data: {
          status: 'ENROLLED',
          paymentStatus: 'PAID',
          paymentDate: new Date(),
          paymentMethod: 'STRIPE',
          paymentId: paymentIntent.id,
        },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          enrollmentId,
          amount,
          currency: paymentIntent.currency,
          status: 'COMPLETED',
          paymentMethod: 'STRIPE',
          paymentId: paymentIntent.id,
          metadata: {
            commissionRate: Number(commissionRate),
            commissionAmount,
            institutionAmount,
          },
        },
      });

      // Create institution payout record
      await tx.institutionPayout.create({
        data: {
          institutionId,
          enrollmentId,
          amount: institutionAmount,
          status: 'PENDING',
          metadata: {
            paymentId: paymentIntent.id,
            paymentMethod: 'STRIPE',
          },
        },
      });
    });
  }

  private static async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const { enrollmentId } = paymentIntent.metadata;
    
    await prisma.studentCourseEnrollment.update({
      where: { id: enrollmentId },
      data: {
        paymentStatus: 'FAILED',
        paymentError: paymentIntent.last_payment_error?.message || 'Payment failed',
      },
    });
  }

  private static async handleRefund(charge: Stripe.Charge) {
    const payment = await prisma.payment.findFirst({
      where: { paymentId: charge.payment_intent as string },
      include: {
        enrollment: {
          include: {
            course: {
              include: {
                institution: true,
              },
            },
          },
        },
      },
    });

    if (payment) {
      const refundAmount = charge.amount_refunded / 100;
      const commissionRate = payment.enrollment.course.institution.commissionRate;
      const commissionAmount = (refundAmount * commissionRate) / 100;
      const institutionRefundAmount = refundAmount - commissionAmount;

      await prisma.$transaction(async (tx) => {
        // Update payment status
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'REFUNDED',
            refundedAt: new Date(),
            refundAmount,
            metadata: {
              ...payment.metadata,
              refundCommissionAmount: commissionAmount,
              refundInstitutionAmount: institutionRefundAmount,
            },
          },
        });

        // Update enrollment status
        await tx.studentCourseEnrollment.update({
          where: { id: payment.enrollmentId },
          data: {
            paymentStatus: 'REFUNDED',
          },
        });

        // Create institution payout adjustment
        await tx.institutionPayout.create({
          data: {
            institutionId: payment.enrollment.course.institutionId,
            enrollmentId: payment.enrollmentId,
            amount: -institutionRefundAmount, // Negative amount for refund
            status: 'PENDING',
            metadata: {
              type: 'REFUND',
              paymentId: charge.payment_intent,
              refundAmount: institutionRefundAmount,
            },
          },
        });
      });
    }
  }
} 