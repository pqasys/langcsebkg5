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

    // Get the payment with basic data
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        amount: true,
        status: true,
        enrollmentId: true,
        metadata: true
      }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Get enrollment data separately
    const enrollment = await prisma.studentCourseEnrollment.findUnique({
      where: { id: payment.enrollmentId },
      include: {
        course: true,
        student: true
      }
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Validate payment ownership
    if (enrollment.studentId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get booking data if it exists
    const bookingId = (payment.metadata as any)?.bookingId;
    let booking = null;
    if (bookingId) {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId }
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update payment status
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: status === 'SUCCESS' ? 'COMPLETED' : 'FAILED',
          paidAt: status === 'SUCCESS' ? new Date() : null,
          metadata: {
            ...payment.metadata,
            paymentDetails,
            processedAt: new Date().toISOString(),
          },
        },
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
        await tx.institution_payouts.create({
          data: {
            id: `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            institutionId: enrollment.course.institutionId,
            enrollmentId: payment.enrollmentId,
            amount: payment.metadata?.institutionAmount || (payment.amount - (payment.amount * enrollment.course.institution.commissionRate / 100)),
            status: 'PENDING',
            updatedAt: new Date(),
            metadata: {
              paymentId: paymentDetails.reference,
              paymentMethod: paymentDetails.method,
              processedAt: new Date().toISOString(),
            },
          },
        });

        return { payment: updatedPayment, enrollment: updatedEnrollment, booking };
      }

      return { payment: updatedPayment, enrollment, booking };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
} 