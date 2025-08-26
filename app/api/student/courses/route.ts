import { NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all published courses
    const publishedCourses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        base_price: true,
        pricingPeriod: true,
        institutionId: true,
        duration: true,
        level: true,
        framework: true,
        marketingType: true,
        hasLiveClasses: true,
        startDate: true,
        endDate: true
      }
    });

    // Get institution data separately
    const institutionIds = [...new Set(publishedCourses.map(course => course.institutionId).filter(Boolean))];
    const institutions = await prisma.institution.findMany({
      where: {
        id: { in: institutionIds }
      },
      select: {
        id: true,
        name: true
      }
    });

    const institutionsMap = institutions.reduce((acc, institution) => {
      acc[institution.id] = institution;
      return acc;
    }, {} as Record<string, typeof institutions[0]>);

    // Add institution data to courses
    const coursesWithInstitutions = publishedCourses.map(course => ({
      ...course,
      institution: institutionsMap[course.institutionId]
    }));

    // Get student's enrollments
    const studentEnrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        studentId: session.user.id
      }
    });

    console.log('📚 Student enrollments found:', studentEnrollments.length);
    studentEnrollments.forEach(enrollment => {
      console.log('  - Course ID:', enrollment.courseId, 'Status:', enrollment.status);
    });

    // Get payments separately
    const enrollmentIds = studentEnrollments.map(enrollment => enrollment.id);
    const payments = await prisma.payment.findMany({
      where: {
        enrollmentId: { in: enrollmentIds },
        status: { in: ['PENDING', 'PROCESSING', 'INITIATED', 'COMPLETED'] }
      },
      select: {
        id: true,
        status: true,
        amount: true,
        enrollmentId: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Get bookings separately
    const bookings = await prisma.booking.findMany({
      where: {
        studentId: session.user.id,
        status: 'PENDING'
      },
      select: {
        id: true,
        courseId: true,
        amount: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const paymentsMap = payments.reduce((acc, payment) => {
      if (!acc[payment.enrollmentId]) {
        acc[payment.enrollmentId] = [];
      }
      acc[payment.enrollmentId].push(payment);
      return acc;
    }, {} as Record<string, typeof payments>);

    const bookingsMap = bookings.reduce((acc, booking) => {
      acc[booking.courseId] = booking;
      return acc;
    }, {} as Record<string, typeof bookings[0]>);

    // Combine the data
    const courses = coursesWithInstitutions.map(course => ({
      ...course,
      enrollments: studentEnrollments.filter(e => e.courseId === course.id)
    }));

    // Transform the data to include payment information
    const transformedCourses = courses.map(course => {
      const enrollment = course.enrollments[0];
      const payment = paymentsMap[enrollment?.id];
      const booking = bookingsMap[course.id];
      
      console.log(`🔍 Course ${course.id} (${course.title}):`, {
        hasEnrollment: !!enrollment,
        enrollmentStatus: enrollment?.status,
        enrollmentId: enrollment?.id,
        hasPayment: !!payment,
        paymentStatus: payment?.[0]?.status
      });
      
      const transformedCourse = {
        ...course,
        status: enrollment ? enrollment.status : 'AVAILABLE',
        progress: enrollment?.progress || 0,
        // Prefer enrollment dates if present; otherwise fall back to course dates
        startDate: enrollment?.startDate ?? (course as any).startDate,
        endDate: enrollment?.endDate ?? (course as any).endDate,
        hasOutstandingPayment: !!payment && payment.some(p => p.status === 'PENDING' || p.status === 'PROCESSING'),
        payment: payment && payment.length > 0 ? {
          id: payment[0].id,
          status: payment[0].status,
          amount: payment[0].amount,
          createdAt: payment[0].createdAt,
          updatedAt: payment[0].updatedAt
        } : undefined,
        enrollmentDetails: enrollment ? {
          price: booking?.amount || payment?.[0]?.amount || course.base_price,
          startDate: enrollment.startDate,
          endDate: enrollment.endDate,
          weeks: enrollment.weeks,
          months: enrollment.months,
          pricingPeriod: course.pricingPeriod
        } : undefined
      };

      console.log('Transformed course:', {
        id: course.id,
        title: course.title,
        enrollmentStatus: enrollment?.status,
        finalStatus: transformedCourse.status,
        hasOutstandingPayment: transformedCourse.hasOutstandingPayment
      });
      
      return transformedCourse;
    });

    return NextResponse.json(transformedCourses);
  } catch (error) {
    console.error('Error fetching courses:');
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 