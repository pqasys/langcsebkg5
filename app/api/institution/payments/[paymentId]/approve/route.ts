import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canInstitutionApprovePayment } from '@/lib/constants/payment-config';

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

    // Get the institution user
    const institutionUser = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        role: 'INSTITUTION'
      },
    });

    if (!institutionUser) {
      return NextResponse.json(
        { error: 'Not an institution user' },
        { status: 403 }
      );
    }

    // Get the payment and verify it belongs to the institution
    const payment = await prisma.payment.findFirst({
      where: {
        id: params.paymentId,
        institutionId: institutionUser.institutionId!,
      },
      include: {
        enrollment: {
          include: {
            course: {
              include: {
                institution: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Check if institutions are allowed to approve payments
    const canApprove = await canInstitutionApprovePayment(
      payment.paymentMethod, 
      institutionUser.institutionId!
    );
    
    if (!canApprove) {
      return NextResponse.json(
        { error: 'Institution payment approval is currently disabled or this payment method requires administrator approval. Please contact an administrator.' },
        { status: 403 }
      );
    }

    // Calculate commission and institution amount
    const commissionRate = payment.enrollment.course.institution.commissionRate;
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
          approvedByInstitution: true,
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
        paymentMethod: 'MANUAL',
        paymentId: `MANUAL_${Date.now()}`,
      },
    });

    // Create institution payout record
    await prisma.institutionPayout.create({
      data: {
        institutionId: payment.enrollment.course.institutionId,
        enrollmentId: payment.enrollmentId,
        amount: institutionAmount,
        status: 'PENDING',
        metadata: {
          paymentId: `MANUAL_${Date.now()}`,
          paymentMethod: 'MANUAL',
          approvedBy: session.user.id,
          approvedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Error approving payment:');
    return NextResponse.json(
      { error: 'Failed to approve payment' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 