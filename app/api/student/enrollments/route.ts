import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: 'Please sign in to enroll in courses'
      }, { status: 401 });
    }

    const { courseId, startDate, endDate } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { 
          error: 'Missing required information',
          details: 'Course ID is required'
        },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json(
        { 
          error: 'Course not found',
          details: 'The course you are trying to enroll in does not exist'
        },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        studentId: session.user.id,
        courseId: courseId,
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { 
          error: 'Already enrolled',
          details: 'You are already enrolled in this course'
        },
        { status: 400 }
      );
    }

    // Get the session cookie from the request
    const cookies = request.headers.get('cookie') || '';

    // Calculate the price based on enrollment period
    const priceResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/student/enrollments/calculate-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies, // Pass the session cookie
      },
      body: JSON.stringify({
        courseId,
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    });

    if (!priceResponse.ok) {
      const error = await priceResponse.json();
      return NextResponse.json(
        { 
          error: 'Failed to calculate course price',
          details: error.details || 'Could not calculate the course price'
        },
        { status: priceResponse.status }
      );
    }

    const priceData = await priceResponse.json();

    // Create enrollment with PENDING_PAYMENT status
    const enrollment = await prisma.studentCourseEnrollment.create({
      data: {
        studentId: session.user.id,
        courseId: courseId,
        status: 'PENDING_PAYMENT',
        paymentStatus: 'UNPAID',
        startDate: new Date(startDate || new Date().toISOString()),
        endDate: new Date(endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),
        progress: 0,
      }
    });

    // Fetch course and institution data separately
    const courseData = await prisma.course.findUnique({
      where: { id: courseId }
    });

    const institutionData = await prisma.institution.findUnique({
      where: { id: course.institutionId }
    });

    // Create a pending payment record
    const payment = await prisma.payment.create({
      data: {
        amount: priceData.price,
        status: 'PENDING',
        institutionId: course.institutionId,
        enrollmentId: enrollment.id,
        commissionAmount: 0, // Will be calculated when payment is made
        institutionAmount: priceData.price, // Will be calculated when payment is made
        currency: 'usd', // Add missing currency field
        metadata: {
          type: 'COURSE_ENROLLMENT',
          courseTitle: course.title,
          institutionName: institutionData.name
        }
      },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Successfully enrolled in course. Please complete the payment to access course content.',
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        paymentStatus: enrollment.paymentStatus,
        startDate: enrollment.startDate,
        endDate: enrollment.endDate,
        progress: enrollment.progress,
        price: payment.amount,
        course: {
          id: courseData.id,
          title: courseData.title,
          price: payment.amount,
          institution: {
            id: institutionData.id,
            name: institutionData.name,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error enrolling in course:');
    return NextResponse.json(
      { 
        error: 'Failed to enroll in course',
        details: 'An unexpected error occurred. Please try again later.',
        technicalDetails: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 