import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';
import { serializeAggregationResult } from '@/lib/bigint-serializer';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get institution ID from session
    const institutionId = session.user.institutionId;
    if (!institutionId) {
      return NextResponse.json({ error: 'No institution associated' }, { status: 400 });
    }

    // Get analytics statistics
    const [
      totalCourses,
      totalEnrollments,
      totalRevenue,
      activeStudents,
      completedCourses
    ] = await Promise.all([
      prisma.course.count({
        where: { institutionId, status: 'ACTIVE' }
      }),
      prisma.studentCourseEnrollment.count({
        where: { 
          course: { institutionId }
        }
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'COMPLETED',
          enrollment: {
            course: { institutionId }
          }
        }
      }),
      prisma.user.count({
        where: {
          role: 'STUDENT',
          institutionId,
          status: 'ACTIVE'
        }
      }),
      prisma.studentCourseCompletion.count({
        where: {
          course: { institutionId }
        }
      })
    ]);

    // Serialize the aggregation result to handle BigInt values
    const serializedRevenue = serializeAggregationResult(totalRevenue);

    const stats = {
      institutionId,
      totalCourses,
      totalEnrollments,
      totalRevenue: serializedRevenue._sum.amount || 0,
      activeStudents,
      completedCourses,
      completionRate: totalEnrollments > 0 ? (completedCourses / totalEnrollments) * 100 : 0,
      averageRevenuePerCourse: totalCourses > 0 ? (serializedRevenue._sum.amount || 0) / totalCourses : 0,
      timestamp: new Date()
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching institution stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institution stats' },
      { status: 500 }
    );
  }
} 