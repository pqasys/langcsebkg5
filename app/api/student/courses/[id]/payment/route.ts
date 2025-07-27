import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PaymentService from '@/lib/payment-service';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the enrollment
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        studentId: session.user.id,
        courseId: params.id,
      },
      include: {
        course: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    if (enrollment.paymentStatus === 'PAID') {
      return NextResponse.json(
        { error: 'Payment already completed' },
        { status: 400 }
      );
    }

    // Get the booking to get the calculated price
    const booking = await prisma.booking.findFirst({
      where: {
        courseId: params.id,
        studentId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Use booking amount if available, otherwise fallback to course base price
    const amount = booking?.amount || enrollment.course.base_price;

    // Create payment intent
    const paymentIntent = await PaymentService.createPaymentIntent({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd', // TODO: Make this configurable via institution or course settings. See roadmap item: 'Multi-currency support'.
      metadata: {
        enrollmentId: enrollment.id,
        studentId: session.user.id,
        courseId: params.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment:');
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 