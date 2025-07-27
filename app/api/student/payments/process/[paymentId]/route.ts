import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EnrollmentStateManager, ENROLLMENT_STATES, BOOKING_STATES, PAYMENT_STATES } from '@/lib/enrollment/state-manager';
import { BookingPaymentValidator } from '@/lib/validation/booking-payment-validator';

export async function POST(
  request: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, paymentDetails } = await request.json();
    const { paymentId } = params;

    // Get the payment with related data
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        enrollment: {
          include: {
            course: true,
            student: true
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Validate payment ownership
    if (payment.enrollment.studentId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Process the payment update in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update payment status
      const updatedPayment = await EnrollmentStateManager.updatePaymentState(
        paymentId,
        status === 'SUCCESS' ? PAYMENT_STATES.PAID : PAYMENT_STATES.FAILED,
        {
          paidAt: status === 'SUCCESS' ? new Date() : null,
          metadata: {
            ...payment.metadata,
            paymentDetails: {
              method: paymentDetails.method,
              reference: paymentDetails.reference,
              timestamp: paymentDetails.timestamp,
              status: status === 'SUCCESS' ? 'COMPLETED' : 'FAILED',
              completedAt: new Date().toISOString(),
            }
          }
        }
      );

      // Get the booking - be more flexible with status matching
      const booking = await tx.booking.findFirst({
        where: {
          courseId: payment.enrollment.courseId,
          studentId: payment.enrollment.studentId,
          // Look for bookings that are not already completed or failed
          status: {
            notIn: [BOOKING_STATES.COMPLETED, BOOKING_STATES.FAILED]
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (status === 'SUCCESS') {
        // Update enrollment status
        const updatedEnrollment = await EnrollmentStateManager.updateEnrollmentState(
          payment.enrollmentId,
          ENROLLMENT_STATES.ENROLLED,
          {
            paymentStatus: 'PAID',
            paymentDate: new Date(),
            paymentMethod: paymentDetails.method,
            paymentId: paymentDetails.reference,
          }
        );

        // Update booking status - ensure it's marked as COMPLETED
        if (booking) {
          await EnrollmentStateManager.updateBookingState(
            booking.id,
            BOOKING_STATES.COMPLETED,
            {
              updatedAt: new Date(),
            }
          );
        } else {
          // // // // // // // // // console.warn(`No booking found for payment ${paymentId} - enrollment ${payment.enrollmentId}`);
        }

        // Create institution payout record
        await tx.institutionPayout.create({
          data: {
            institutionId: payment.enrollment.course.institutionId,
            enrollmentId: payment.enrollmentId,
            amount: payment.metadata?.institutionAmount || (payment.amount - (payment.amount * payment.enrollment.course.institution.commissionRate / 100)),
            status: 'PENDING',
            metadata: {
              paymentId: paymentDetails.reference,
              paymentMethod: paymentDetails.method,
              processedAt: new Date().toISOString(),
            },
          },
        });

        return { payment: updatedPayment, enrollment: updatedEnrollment, booking };
      }

      // If payment failed, update enrollment and booking status
      if (status === 'FAILED') {
        const updatedEnrollment = await EnrollmentStateManager.updateEnrollmentState(
          payment.enrollmentId,
          ENROLLMENT_STATES.FAILED,
          {
            paymentStatus: 'FAILED',
          }
        );

        if (booking) {
          await EnrollmentStateManager.updateBookingState(
            booking.id,
            BOOKING_STATES.FAILED,
            {
              updatedAt: new Date(),
            }
          );
        } else {
          console.warn(`No booking found for failed payment ${paymentId} - enrollment ${payment.enrollmentId}`);
        }

        return { payment: updatedPayment, enrollment: updatedEnrollment, booking };
      }

      return { payment: updatedPayment, enrollment: payment.enrollment, booking };
    });

    // Validate the result to ensure consistency
    if (result.booking) {
      const validation = await BookingPaymentValidator.validateBooking(result.booking.id);
      if (!validation.isValid) {
        console.warn(`Booking-payment inconsistency detected after processing:`, validation.issues);
      }
    }

    return NextResponse.json({
      status: 'success',
      message: status === 'SUCCESS' ? 'Payment completed successfully' : 'Payment failed',
      payment: {
        id: result.payment.id,
        status: result.payment.status,
        amount: result.payment.amount,
        paidAt: result.payment.paidAt,
      },
      enrollment: {
        id: result.enrollment.id,
        status: result.enrollment.status,
        paymentStatus: result.enrollment.paymentStatus,
        paymentDate: result.enrollment.paymentDate,
      },
      booking: result.booking ? {
        id: result.booking.id,
        status: result.booking.status,
        updatedAt: result.booking.updatedAt,
      } : null,
    });
  } catch (error) {
    console.error('Error processing payment:');
    return NextResponse.json(
      { 
        error: 'Failed to process payment',
        details: error.message || 'An unexpected error occurred',
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 