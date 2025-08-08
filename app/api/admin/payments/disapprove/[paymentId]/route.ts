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

    // Only admin can disapprove payments
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can disapprove payments' },
        { status: 403 }
      );
    }

    const { reason } = await request.json();

    // Get the payment and verify it exists
    const payment = await prisma.payment.findFirst({
      where: {
        id: params.paymentId,
      },
      select: {
        id: true,
        status: true,
        metadata: true
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status === 'FAILED') {
      return NextResponse.json(
        { error: 'Payment is already failed' },
        { status: 400 }
      );
    }

    // Update the payment status
    const updatedPayment = await prisma.payment.update({
      where: {
        id: params.paymentId,
      },
      data: {
        status: 'FAILED',
        metadata: {
          ...payment.metadata,
          disapprovedBy: session.user.id,
          disapprovedAt: new Date().toISOString(),
          disapprovalReason: reason || 'Disapproved by administrator',
          approvedByAdmin: false,
        },
      },
    });

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: 'Payment disapproved successfully by administrator'
    });
  } catch (error) {
    console.error('Error disapproving payment:', error);
    return NextResponse.json(
      { error: 'Failed to disapprove payment' },
      { status: 500 }
    );
  }
} 