import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all enrollments for a course (Admin only)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized - Admin access required', { status: 401 });
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause - remove the invalid isNot: null filter
    const where: unknown = {
      courseId: params.id
    };

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    // Get enrollments with student and payment details
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
            created_at: true,
            last_active: true
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
            paymentMethod: true,
            currency: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Filter out enrollments with null students (orphaned enrollments)
    const validEnrollments = enrollments.filter(enrollment => enrollment.student !== null);

    // Get total count of valid enrollments
    const total = validEnrollments.length;

    // Apply pagination to valid enrollments
    const paginatedEnrollments = validEnrollments.slice(skip, skip + limit);

    // Filter by search term if provided
    let filteredEnrollments = paginatedEnrollments;
    if (search) {
      filteredEnrollments = paginatedEnrollments.filter(enrollment =>
        enrollment.student!.name.toLowerCase().includes(search.toLowerCase()) ||
        enrollment.student!.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Calculate additional data for each enrollment
    const enrollmentsWithDetails = filteredEnrollments.map(enrollment => {
      const totalPaid = enrollment.payments
        .filter(payment => payment.status === 'COMPLETED')
        .reduce((sum, payment) => sum + payment.amount, 0);

      const latestPayment = enrollment.payments[0];
      
      return {
        ...enrollment,
        totalPaid,
        latestPayment,
        daysSinceEnrollment: Math.floor(
          (Date.now() - new Date(enrollment.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        )
      };
    });

    return NextResponse.json({
      enrollments: enrollmentsWithDetails,
      course,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// PATCH to update enrollment status (Admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized - Admin access required', { status: 401 });
    }

    const { enrollmentId, status, paymentStatus, notes } = await request.json();

    if (!enrollmentId) {
      return new NextResponse('Enrollment ID is required', { status: 400 });
    }

    // Verify the enrollment exists and belongs to the course
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        id: enrollmentId,
        courseId: params.id
      }
    });

    if (!enrollment) {
      return new NextResponse('Enrollment not found', { status: 404 });
    }

    // Update the enrollment
    const updatedEnrollment = await prisma.studentCourseEnrollment.update({
      where: { id: enrollmentId },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(paymentStatus === 'COMPLETED' && { paymentDate: new Date() }),
        updatedAt: new Date()
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    // Log the admin action
    await prisma.auditLog.create({
      data: {
        action: 'ENROLLMENT_STATUS_UPDATE',
        userId: session.user.id,
        targetType: 'ENROLLMENT',
        targetId: enrollmentId,
        details: {
          courseId: params.id,
          oldStatus: enrollment.status,
          newStatus: status,
          oldPaymentStatus: enrollment.paymentStatus,
          newPaymentStatus: paymentStatus,
          notes
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
      }
    });

    return NextResponse.json(updatedEnrollment);
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 