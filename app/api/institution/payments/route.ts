import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
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

    // Get all payments for the institution's courses
    const payments = await prisma.payment.findMany({
      where: {
        institutionId: institutionUser.institutionId!,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get enrollment IDs from payments
    const enrollmentIds = [...new Set(payments.map(p => p.enrollmentId))];

    // Fetch enrollments with course data (no student relation exists)
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        id: {
          in: enrollmentIds
        }
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            institution: {
              select: {
                commissionRate: true
              }
            }
          },
        },
      },
    });

    // Get student IDs from enrollments
    const studentIds = [...new Set(enrollments.map(e => e.studentId))];

    // Fetch students separately
    const students = await prisma.student.findMany({
      where: {
        id: {
          in: studentIds
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Create maps for quick lookup
    const enrollmentMap = enrollments.reduce((acc, enrollment) => {
      acc[enrollment.id] = enrollment;
      return acc;
    }, {} as Record<string, typeof enrollments[0]>);

    const studentMap = students.reduce((acc, student) => {
      acc[student.id] = student;
      return acc;
    }, {} as Record<string, typeof students[0]>);

    // Transform the data to match the frontend interface
    const transformedPayments = payments.map(payment => {
      const enrollment = enrollmentMap[payment.enrollmentId];
      
      if (!enrollment) {
        // // // // // // console.warn(`Enrollment not found for payment ${payment.id}`);
        return null;
      }

      const student = studentMap[enrollment.studentId];
      if (!student) {
        console.warn(`Student not found for enrollment ${enrollment.id}`);
        return null;
      }

      const commissionRate = enrollment.course.institution.commissionRate;
      const commissionAmount = (payment.amount * commissionRate) / 100;
      const institutionAmount = payment.amount - commissionAmount;
      
      // Get booking ID from metadata if available
      const bookingId = (payment.metadata as any)?.bookingId;
      
      return {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        referenceNumber: payment.referenceNumber,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        commissionAmount,
        institutionAmount,
        student: student,
        course: enrollment.course,
        enrollment: {
          id: enrollment.id,
          startDate: enrollment.startDate,
          endDate: enrollment.endDate,
        },
        bookingId: bookingId || null,
      };
    }).filter(Boolean); // Remove null entries

    return NextResponse.json(transformedPayments);
  } catch (error) {
    console.error('Error fetching payments:');
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 