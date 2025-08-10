import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { EnrollmentStateManager, ENROLLMENT_STATES, BOOKING_STATES } from '@/lib/enrollment/state-manager';
import { notificationService } from '@/lib/notification';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, endDate, calculatedPrice } = await request.json();
    const courseId = params.id;

    // Get course details with subscription requirements
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        status: true,
        institutionId: true,
        maxStudents: true,
        base_price: true,
        startDate: true,
        endDate: true,
        marketingType: true,
        requiresSubscription: true
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if course requires subscription
    const requiresSubscription = course.requiresSubscription || 
      course.marketingType === 'LIVE_ONLINE' || 
      course.marketingType === 'BLENDED';

    let subscriptionStatus = null;
    if (requiresSubscription) {
      console.log('Course requires subscription, checking user subscription status...');
      
      try {
        // Get user's subscription status
        subscriptionStatus = await SubscriptionCommissionService.getUserSubscriptionStatus(session.user.id);
        
        if (!subscriptionStatus.hasActiveSubscription) {
          console.log('User does not have active subscription for subscription-required course');
          return NextResponse.json({ 
            error: 'Subscription required',
            details: 'This course requires an active subscription to enroll.',
            redirectUrl: '/subscription-signup',
            courseType: course.marketingType,
            requiresSubscription: true
          }, { status: 402 }); // 402 Payment Required
        }

        console.log('User has active subscription:', subscriptionStatus.currentPlan);
      } catch (subscriptionError) {
        console.error('Error checking subscription status:', subscriptionError);
        return NextResponse.json({ 
          error: 'Subscription verification failed',
          details: 'Unable to verify subscription status. Please try again or contact support.',
          redirectUrl: '/subscription-signup'
        }, { status: 500 });
      }
    }

    // Get institution details
    const institution = await prisma.institution.findUnique({
      where: { id: course.institutionId },
      select: { id: true, name: true }
    });

    // Validate dates
    const start = new Date(startDate || new Date().toISOString());
    const end = new Date(endDate || course.endDate);
    
    if (start >= end) {
      console.error('Invalid date range:');
      return NextResponse.json(
        { 
          error: 'Invalid date range',
          details: 'Start date must be before end date',
          receivedDates: { start, end }
        },
        { status: 400 }
      );
    }

    // Generate a unique idempotency key for this enrollment attempt
    const idempotencyKey = uuidv4();

    // Determine if this is a subscription-based enrollment (no additional payment required)
    const isSubscriptionBasedEnrollment = requiresSubscription && subscriptionStatus?.hasActiveSubscription;

    // Use a transaction to ensure all operations are atomic
    const result = await prisma.$transaction(async (tx) => {
      // Check for existing enrollment
      const existingEnrollment = await tx.studentCourseEnrollment.findFirst({
        where: {
          studentId: session.user.id,
          courseId,
        },
      });

      if (existingEnrollment) {
        throw new Error(`Already enrolled - Context: throw new Error('Already enrolled');...`);
      }

      // Check for existing booking
      const existingBooking = await tx.booking.findFirst({
        where: {
          studentId: session.user.id,
          courseId,
          status: BOOKING_STATES.PENDING,
        },
      });

      if (existingBooking) {
        throw new Error(`Booking already exists - Context: },...`);
      }

      // Create enrollment record with appropriate status
      const enrollment = await tx.studentCourseEnrollment.create({
        data: {
          studentId: session.user.id,
          courseId,
          status: isSubscriptionBasedEnrollment ? ENROLLMENT_STATES.ENROLLED : ENROLLMENT_STATES.PENDING_PAYMENT,
          paymentStatus: isSubscriptionBasedEnrollment ? 'PAID' : 'PENDING',
          progress: 0,
          startDate: new Date(startDate || new Date().toISOString()),
          endDate: new Date(endDate || course.endDate),
          // For subscription-based enrollments, mark payment as completed
          ...(isSubscriptionBasedEnrollment && {
            paymentDate: new Date(),
            paymentMethod: 'SUBSCRIPTION',
            paymentId: `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          })
        },
      });

      // Create booking record with appropriate status
      const booking = await tx.booking.create({
        data: {
          courseId: courseId,
          studentId: session.user.id,
          userId: session.user.id,
          institutionId: course.institutionId,
          amount: calculatedPrice,
          status: isSubscriptionBasedEnrollment ? BOOKING_STATES.COMPLETED : BOOKING_STATES.PENDING,
          updatedAt: new Date(),
        },
      });

      // Create payment record with appropriate status
      const payment = await tx.payment.create({
        data: {
          amount: calculatedPrice,
          status: isSubscriptionBasedEnrollment ? 'COMPLETED' : 'PENDING',
          institutionId: course.institutionId,
          enrollmentId: enrollment.id,
          commissionAmount: 0,
          institutionAmount: calculatedPrice,
          currency: 'USD',
          idempotencyKey,
          // For subscription-based payments, mark as paid immediately
          ...(isSubscriptionBasedEnrollment && {
            paidAt: new Date(),
            paymentMethod: 'SUBSCRIPTION',
            paymentId: `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }),
          metadata: {
            type: 'COURSE_ENROLLMENT',
            bookingId: booking.id,
            courseTitle: course.title,
            institutionName: institution.name,
            isSubscriptionBased: isSubscriptionBasedEnrollment,
            subscriptionPlan: subscriptionStatus?.currentPlan
          }
        }
      });

      return { enrollment, booking, payment };
    });

    // Send enrollment notification
    try {
      const student = await prisma.student.findUnique({
        where: { id: session.user.id }
      });

      if (student) {
        await notificationService.sendCourseEnrollmentNotification(
          student.id,
          result.enrollment.id,
          {
            courseName: course.title,
            institutionName: institution.name,
            amount: calculatedPrice,
            startDate: result.enrollment.startDate,
            endDate: result.enrollment.endDate,
            studentName: student.name,
            isSubscriptionBased: isSubscriptionBasedEnrollment
          }
        );
      }
    } catch (error) {
      console.error('Failed to send enrollment notification:', error);
      // Don't fail the enrollment if notification fails
    }

    // Revalidate relevant pages
    revalidatePath('/student/courses');
    revalidatePath('/institution/courses');

    // Return appropriate message based on enrollment type
    const message = isSubscriptionBasedEnrollment 
      ? 'Course enrollment successful! You have immediate access to the course content.'
      : 'Course enrollment successful. Payment required for content access.';

    return NextResponse.json({ 
      message,
      enrollment: {
        id: result.enrollment.id,
        status: result.enrollment.status,
        paymentStatus: result.enrollment.paymentStatus,
        isSubscriptionBased: isSubscriptionBasedEnrollment
      },
      booking: {
        id: result.booking.id,
        status: result.booking.status,
        amount: result.booking.amount
      },
      payment: {
        id: result.payment.id,
        status: result.payment.status,
        amount: result.payment.amount
      }
    });

  } catch (error) {
    console.error('Error in enrollment process:');
    
    // Handle specific error cases
    if (error.message === 'Already enrolled') {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 });
    }
    if (error.message === 'Booking already exists') {
      return NextResponse.json({ error: 'Booking already exists' }, { status: 400 });
    }

    return NextResponse.json(
      { 
        error: error.message || 'Failed to enroll in course',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: error.message === 'Already enrolled' || error.message === 'Booking already exists' ? 400 : 500 }
    );
  }
} 