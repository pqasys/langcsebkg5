import { prisma } from '@/lib/prisma';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { emailService } from '@/lib/email';
import { notificationService } from '@/lib/notification';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';
import Stripe from 'stripe';
import { logger } from './logger';

class PaymentService {
  private static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const { enrollmentId, institutionId } = paymentIntent.metadata;
    const amount = paymentIntent.amount / 100; // Convert from cents
    
    // Get commission rate from subscription-based system
    const commissionRate = await SubscriptionCommissionService.getCommissionRate(institutionId);
    const commissionAmount = (amount * commissionRate) / 100;
    const institutionAmount = amount - commissionAmount;
    
    const enrollment = await prisma.studentCourseEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        student: true,
        course: {
          include: {
            institution: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new Error(`Enrollment not found - Context: Enrollment not found - Context: where: { id: enrollmentId }`);
    }
    
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

    // Send payment confirmation notification
    await notificationService.sendPaymentConfirmationNotification(
      enrollment.student.userId,
      enrollment.id,
      {
        amount,
        referenceNumber: paymentIntent.id,
        paidAt: new Date(),
        courseName: enrollment.course.title,
        studentName: enrollment.student.name,
        institutionName: enrollment.course.institution.name
      }
    );
  }

  private static async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const { enrollmentId } = paymentIntent.metadata;
    
    const enrollment = await prisma.studentCourseEnrollment.findUnique({
      where: { id: enrollmentId }
    });

    if (!enrollment) {
      throw new Error(`Enrollment not found - Context: notes?: string;...`);
    }

    // Fetch related data separately
    const [student, course] = await Promise.all([
      prisma.student.findUnique({
        where: { id: enrollment.studentId }
      }),
      prisma.course.findUnique({
        where: { id: enrollment.courseId }
      })
    ]);

    if (!student || !course) {
      throw new Error(`Related data not found - Context: where: { id: enrollment.courseId }...`);
    }

    await prisma.studentCourseEnrollment.update({
      where: { id: enrollmentId },
      data: {
        paymentStatus: 'FAILED',
        paymentError: paymentIntent.last_payment_error?.message || 'Payment failed',
      },
    });

    // Send payment failure notification
    await notificationService.sendPaymentFailureNotification(
      enrollment.student.userId,
      enrollment.id,
      {
        amount: paymentIntent.amount / 100,
        referenceNumber: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message || 'Payment failed',
        courseName: enrollment.course.title,
        studentName: enrollment.student.name
      }
    );
  }

  private static async handleRefund(charge: Stripe.Charge) {
    const payment = await prisma.payment.findFirst({
      where: { paymentId: charge.payment_intent as string }
    });

    if (payment) {
      // Fetch related data separately
      const [enrollment, course, institution, student] = await Promise.all([
        prisma.studentCourseEnrollment.findUnique({
          where: { id: payment.enrollmentId }
        }),
        prisma.course.findUnique({
          where: { id: enrollment?.courseId }
        }),
        prisma.institution.findUnique({
          where: { id: course?.institutionId }
        }),
        prisma.student.findUnique({
          where: { id: enrollment?.studentId }
        })
      ]);

      if (!enrollment || !course || !institution || !student) {
        throw new Error(`Related data not found - Context: prisma.student.findUnique({...`);
      }

      const refundAmount = charge.amount_refunded / 100;
      const commissionRate = await SubscriptionCommissionService.getCommissionRate(institution.id);
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
            institutionId: institution.id,
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

      // Send refund confirmation notification
      await notificationService.sendRefundConfirmationNotification(
        student.userId,
        payment.enrollmentId,
        {
          originalAmount: payment.amount,
          refundAmount,
          referenceNumber: charge.payment_intent,
          refundedAt: new Date(),
          courseName: course?.title,
          studentName: student.name
        }
      );
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
        where: { id: enrollmentId }
      });

      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      // Fetch related data separately
      const [student, course, institution] = await Promise.all([
        prisma.student.findUnique({
          where: { id: enrollment.studentId }
        }),
        prisma.course.findUnique({
          where: { id: enrollment.courseId }
        }),
        prisma.institution.findUnique({
          where: { id: course?.institutionId }
        })
      ]);

      if (!student || !course || !institution) {
        throw new Error(`Related data not found - Context: where: { id: enrollment.courseId }...`);
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
      
      // Get commission rate from subscription-based system
      const commissionRate = await SubscriptionCommissionService.getCommissionRate(institution.id);
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
        const payment = await tx.payment.create({
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
              bookingId: booking?.id, // Store booking ID in payment metadata
            },
          },
        });

        // Update booking status to COMPLETED if it exists
        if (booking) {
          await tx.booking.update({
            where: { id: booking.id },
            data: {
              status: 'COMPLETED',
              updatedAt: new Date(),
              version: { increment: 1 },
              stateVersion: { increment: 1 }
            }
          });
        }

        // Create institution payout record
        await tx.institutionPayout.create({
          data: {
            institutionId: institution.id,
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

      // Send payment confirmation email
      await emailService.sendPaymentConfirmationEmail(
        student.email,
        student.name,
        {
          amount,
          referenceNumber: metadata.referenceNumber || `MANUAL_${Date.now()}`,
          paidAt: new Date(),
          courseName: course?.title,
        }
      );

      // Send payment confirmation notification
      try {
        // // // // // // console.log('Sending payment confirmation notification...');
        
        await notificationService.sendNotificationWithTemplate(
          'payment_confirmation',
          student.id,
          {
            name: student.name,
            amount: `$${amount.toFixed(2)}`,
            referenceNumber: metadata.referenceNumber || `MANUAL_${Date.now()}`,
            date: new Date().toLocaleDateString(),
            courseName: course.title
          },
          {
            enrollmentId,
            courseId: course.id,
            institutionId: institution.id,
            paymentMethod,
            processedBy: metadata.processedBy
          },
          metadata.processedBy || 'SYSTEM'
        );
        
        console.log('✅ Payment confirmation notification sent successfully');
      } catch (notificationError) {
        logger.error('❌ Failed to send payment confirmation notification:');
        // Don't fail the payment if notification fails
      }

      return { success: true };
    } catch (error) {
      logger.error('Error marking payment as paid:');
      throw error;
    }
  }
}

export default PaymentService; 