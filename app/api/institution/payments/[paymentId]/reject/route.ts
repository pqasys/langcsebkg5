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
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update the payment status
    const updatedPayment = await prisma.payment.update({
      where: {
        id: params.paymentId,
      },
      data: {
        status: 'FAILED',
      },
    });

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Error rejecting payment:');
    return NextResponse.json(
      { error: 'Failed to reject payment' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 