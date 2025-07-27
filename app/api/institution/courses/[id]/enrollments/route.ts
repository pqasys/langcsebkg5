import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify the course belongs to the institution
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: session.user.institutionId
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get all enrollments for the course
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        courseId: params.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get student details separately
    const studentIds = [...new Set(enrollments.map(e => e.studentId))];
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
        phone: true,
        status: true,
        created_at: true
      }
    });

    // Get payment details separately
    const enrollmentIds = enrollments.map(e => e.id);
    const payments = await prisma.payment.findMany({
      where: {
        enrollmentId: {
          in: enrollmentIds
        }
      },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        paymentMethod: true,
        enrollmentId: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get course details separately
    const courseDetails = await prisma.course.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        status: true
      }
    });

    // Create lookup maps
    const studentMap = students.reduce((acc, student) => {
      acc[student.id] = student;
      return acc;
    }, {} as Record<string, typeof students[0]>);

    const paymentMap = payments.reduce((acc, payment) => {
      if (!acc[payment.enrollmentId]) {
        acc[payment.enrollmentId] = [];
      }
      acc[payment.enrollmentId].push(payment);
      return acc;
    }, {} as Record<string, typeof payments>);

    // Transform the data to match the frontend's expected format
    const transformedEnrollments = enrollments.map(enrollment => {
      const student = studentMap[enrollment.studentId];
      const enrollmentPayments = paymentMap[enrollment.id] || [];
      
      return {
        id: enrollment.id,
        enrolledAt: enrollment.createdAt,
        student: student ? {
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          status: student.status,
          createdAt: student.created_at,
          firstName: student.name.split(' ')[0] || '',
          lastName: student.name.split(' ').slice(1).join(' ') || ''
        } : {
          id: enrollment.studentId,
          name: 'Unknown Student',
          email: '',
          phone: '',
          status: 'UNKNOWN',
          createdAt: new Date(),
          firstName: 'Unknown',
          lastName: 'Student'
        },
        bookings: enrollmentPayments.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          createdAt: payment.createdAt,
          paymentMethod: payment.paymentMethod
        })),
        progress: [], // Empty array since progress tracking is not implemented yet
        completion: null, // Null since completion tracking is not implemented yet
        status: enrollment.status
      };
    });

    return NextResponse.json(transformedEnrollments);
  } catch (error) {
    console.error('Error fetching course enrollments:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 