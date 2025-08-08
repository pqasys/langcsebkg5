import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admin can approve payments
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can approve payments' },
        { status: 403 }
      );
    }

    // Get the payment and verify it exists
    const payment = await prisma.payment.findFirst({
      where: {
        id: params.paymentId,
      },
      select: {
        id: true,
        amount: true,
        status: true,
        paymentMethod: true,
        enrollmentId: true,
        institutionId: true,
        metadata: true
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment is already completed' },
        { status: 400 }
      );
    }

    // Get enrollment data separately
    const enrollment = await prisma.studentCourseEnrollment.findUnique({
      where: {
        id: payment.enrollmentId
      },
      include: {
        course: {
          include: {
            institution: true
          }
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Calculate commission and institution amount
    const commissionRate = enrollment.course.institution.commissionRate;
    const commissionAmount = (payment.amount * commissionRate) / 100;
    const institutionAmount = payment.amount - commissionAmount;

    // Update the payment status
    const updatedPayment = await prisma.payment.update({
      where: {
        id: params.paymentId,
      },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
        commissionAmount,
        institutionAmount,
        metadata: {
          ...payment.metadata,
          commissionRate,
          commissionAmount,
          institutionAmount,
          approvedBy: session.user.id,
          approvedAt: new Date().toISOString(),
          approvedByAdmin: true,
        },
      },
    });

    // Update the enrollment status
    await prisma.studentCourseEnrollment.update({
      where: {
        id: payment.enrollmentId,
      },
      data: {
        status: 'ENROLLED',
        paymentStatus: 'PAID',
        paymentDate: new Date(),
      },
    });

    // Update the booking status if it exists
    const bookingId = (payment.metadata as any)?.bookingId;
    if (bookingId) {
      await prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status: 'COMPLETED',
          updatedAt: new Date(),
        },
      });
    }

    // Create institution payout record
    await prisma.institution_payouts.create({
      data: {
        id: `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        institutionId: enrollment.course.institutionId,
        enrollmentId: payment.enrollmentId,
        amount: institutionAmount,
        status: 'PENDING',
        updatedAt: new Date(),
        metadata: {
          paymentId: `ADMIN_${Date.now()}`,
          paymentMethod: 'ADMIN_APPROVED',
          approvedBy: session.user.id,
          approvedAt: new Date().toISOString(),
        },
      },
    });

    // // // console.log('Payment approved successfully by administrator');
    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: 'Payment approved successfully by administrator',
      pendingCountUpdated: true
    });
  } catch (error) {
    console.error('Error approving payment:', error);
    return NextResponse.json(
      { error: 'Failed to approve payment' },
      { status: 500 }
    );
  }
} 