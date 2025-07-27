import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, amount, paymentMethod } = await request.json();

    // Get the enrollment
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        courseId,
        studentId: session.user.id,
        status: 'PENDING_PAYMENT',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            institutionId: true
          }
        }
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Get institution details
    const institution = await prisma.institution.findUnique({
      where: { id: enrollment.course.institutionId },
      select: { id: true, name: true }
    });

    // Get the booking
    const booking = await prisma.booking.findFirst({
      where: {
        courseId,
        studentId: session.user.id,
        status: 'PENDING',
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Get existing payment for this enrollment
    const existingPayment = await prisma.payment.findFirst({
      where: {
        enrollmentId: enrollment.id,
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Handle different payment methods
    if (paymentMethod === 'CREDIT_CARD') {
      // Create Stripe Payment Intent for credit card payments
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          enrollmentId: enrollment.id,
          studentId: session.user.id,
          courseId,
          institutionId: enrollment.course.institutionId,
          bookingId: booking.id,
          courseTitle: enrollment.course.title,
          institutionName: institution.name,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Update or create payment record
      const paymentData = {
        amount,
        paymentMethod,
        status: 'PENDING',
        currency: 'usd',
        commissionAmount: 0,
        institutionAmount: amount,
        metadata: {
          paymentMethod,
          bookingId: booking.id,
          stripePaymentIntentId: paymentIntent.id,
          createdAt: new Date().toISOString(),
          courseTitle: enrollment.course.title,
          institutionName: institution.name,
        },
      };

      let payment;
      if (existingPayment) {
        payment = await prisma.payment.update({
          where: { id: existingPayment.id },
          data: paymentData,
        });
      } else {
        payment = await prisma.payment.create({
          data: {
            enrollmentId: enrollment.id,
            institutionId: enrollment.course.institutionId,
            ...paymentData,
          },
        });
      }

      // Update booking status
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'PAYMENT_INITIATED',
          updatedAt: new Date(),
        },
      });

      // Update enrollment status
      await prisma.studentCourseEnrollment.update({
        where: { id: enrollment.id },
        data: {
          paymentStatus: 'PROCESSING',
          status: 'PENDING_PAYMENT',
        },
      });

      return NextResponse.json({
        success: true,
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        enrollmentStatus: 'PENDING_PAYMENT',
        bookingId: booking.id,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } else {
      // Handle other payment methods (BANK_TRANSFER, etc.)
      if (existingPayment) {
        const updatedPayment = await prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            amount,
            paymentMethod,
            status: 'PROCESSING',
            commissionAmount: 0,
            institutionAmount: amount,
            metadata: {
              paymentMethod,
              bookingId: booking.id,
              updatedAt: new Date().toISOString(),
            },
          },
        });

        return NextResponse.json({
          success: true,
          paymentId: updatedPayment.id,
          status: updatedPayment.status,
          amount: updatedPayment.amount,
          paymentMethod: updatedPayment.paymentMethod,
          enrollmentStatus: enrollment.status,
          bookingId: booking.id,
        });
      } else {
        // If no existing payment for non-credit card methods, create a new one
        const payment = await prisma.payment.create({
          data: {
            enrollmentId: enrollment.id,
            institutionId: enrollment.course.institutionId,
            amount: amount,
            status: 'PENDING',
            paymentMethod,
            currency: 'usd',
            commissionAmount: 0,
            institutionAmount: amount,
            metadata: {
              paymentMethod,
              bookingId: booking.id,
              createdAt: new Date().toISOString(),
              courseTitle: enrollment.course.title,
              institutionName: institution.name,
            },
          },
        });

        // Update booking status
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: 'PAYMENT_INITIATED',
            updatedAt: new Date(),
          },
        });

        // Update enrollment status
        await prisma.studentCourseEnrollment.update({
          where: { id: enrollment.id },
          data: {
            paymentStatus: 'PROCESSING',
            status: 'PENDING_PAYMENT',
          },
        });

        return NextResponse.json({
          success: true,
          paymentId: payment.id,
          status: payment.status,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          enrollmentStatus: 'PENDING_PAYMENT',
          bookingId: booking.id,
        });
      }
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
} 