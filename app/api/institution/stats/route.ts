import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'INSTITUTION') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const institutionId = session.user.institutionId;

    if (!institutionId) {
      return NextResponse.json(
        { error: 'Institution ID not found' },
        { status: 400 }
      );
    }

    // Fetch all stats in parallel
    const [
      totalCourses,
      totalStudents,
      upcomingClasses,
      totalRevenue,
      recentEnrollments
    ] = await Promise.all([
      // Total courses
      prisma.course.count({
        where: { institutionId }
      }),
      // Total students (unique students who have enrolled in courses)
      prisma.course.findMany({
        where: { institutionId },
        select: { id: true }
      }).then(courses => {
        const courseIds = courses.map(c => c.id);
        return prisma.studentCourseEnrollment.groupBy({
          by: ['studentId'],
          where: {
            courseId: {
              in: courseIds
            }
          }
        }).then(results => results.length);
      }),
      // Upcoming classes (courses starting in the next 7 days)
      prisma.course.count({
        where: {
          institutionId,
          startDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Total revenue from completed payments (institution amount after commission)
      prisma.payment.aggregate({
        where: {
          institutionId,
          status: 'COMPLETED'
        },
        _sum: {
          institutionAmount: true
        }
      }).then(result => result._sum.institutionAmount || 0),
      // Recent enrollments (last 10)
      prisma.course.findMany({
        where: { institutionId },
        select: { id: true }
      }).then(courses => {
        const courseIds = courses.map(c => c.id);
        return prisma.studentCourseEnrollment.findMany({
          where: {
            courseId: {
              in: courseIds
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            createdAt: true,
            status: true,
            paymentStatus: true,
            courseId: true,
            studentId: true
          }
        });
      })
    ]);

    // Get additional data for recent enrollments
    const recentEnrollmentsWithDetails = await Promise.all(
      recentEnrollments.map(async (enrollment) => {
        const [student, course, payments] = await Promise.all([
          prisma.student.findUnique({
            where: { id: enrollment.studentId },
            select: {
              name: true,
              email: true
            }
          }),
          prisma.course.findUnique({
            where: { id: enrollment.courseId },
            select: {
              title: true,
              base_price: true
            }
          }),
          prisma.payment.findMany({
            where: {
              enrollmentId: enrollment.id,
              status: 'COMPLETED'
            },
            select: {
              amount: true,
              institutionAmount: true,
              commissionAmount: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          })
        ]);

        return {
          ...enrollment,
          student,
          course,
          payments
        };
      })
    );

    return NextResponse.json({
      totalCourses,
      totalStudents,
      upcomingClasses,
      totalRevenue,
      recentEnrollments: recentEnrollmentsWithDetails.map(enrollment => ({
        id: enrollment.id,
        student: enrollment.student,
        course: enrollment.course,
        enrollmentDate: enrollment.createdAt,
        status: enrollment.status,
        paymentStatus: enrollment.paymentStatus,
        paymentAmount: enrollment.payments[0]?.institutionAmount || 0,
        totalAmount: enrollment.payments[0]?.amount || 0,
        commissionAmount: enrollment.payments[0]?.commissionAmount || 0
      }))
    });
  } catch (error) {
    console.error('Error fetching stats:');
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 