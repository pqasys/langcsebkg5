import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { EnrollmentStateManager, ENROLLMENT_STATES, BOOKING_STATES } from '@/lib/enrollment/state-manager';
import { notificationService } from '@/lib/notification';
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

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
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

      // Create enrollment record
      const enrollment = await tx.studentCourseEnrollment.create({
        data: {
          studentId: session.user.id,
          courseId,
          status: ENROLLMENT_STATES.PENDING_PAYMENT,
          paymentStatus: 'PENDING',
          progress: 0,
          startDate: new Date(startDate || new Date().toISOString()),
          endDate: new Date(endDate || course.endDate),
        },
      });

      // Create booking record
      const booking = await tx.booking.create({
        data: {
          courseId: courseId,
          studentId: session.user.id,
          userId: session.user.id,
          institutionId: course.institutionId,
          amount: calculatedPrice,
          status: BOOKING_STATES.PENDING,
          updatedAt: new Date(),
        },
      });

      // Create initial payment record
      const payment = await tx.payment.create({
        data: {
          amount: calculatedPrice,
          status: 'PENDING',
          institutionId: course.institutionId,
          enrollmentId: enrollment.id,
          commissionAmount: 0,
          institutionAmount: calculatedPrice,
          currency: 'USD',
          idempotencyKey,
          metadata: {
            type: 'COURSE_ENROLLMENT',
            bookingId: booking.id,
            courseTitle: course.title,
            institutionName: institution.name
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
            studentName: student.name
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

    // // // console.log('Course enrollment successful. Payment required for content access.');
    return NextResponse.json({ 
      message: 'Course enrollment successful. Payment required for content access.',
      enrollment: {
        id: result.enrollment.id,
        status: result.enrollment.status,
        paymentStatus: result.enrollment.paymentStatus
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