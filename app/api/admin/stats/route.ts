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
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get admin statistics
    const [
      totalUsers,
      totalInstitutions,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      activeUsers,
      activeInstitutions,
      activeCourses
    ] = await Promise.all([
      prisma.user.count(),
      prisma.institution.count(),
      prisma.course.count(),
      prisma.studentCourseEnrollment.count(),
      prisma.payment.aggregate({
        _sum: {
          amount: true
        },
        where: {
          status: 'COMPLETED'
        }
      }),
      prisma.user.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      prisma.institution.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      prisma.course.count({
        where: {
          status: 'ACTIVE'
        }
      })
    ]);

    // Serialize the aggregation result to handle BigInt values
    const serializedRevenue = serializeAggregationResult(totalRevenue);

    const stats = {
      statistics: {
        totalUsers,
        totalInstitutions,
        totalCourses,
        totalEnrollments,
        totalRevenue: serializedRevenue._sum.amount || 0,
        totalCompletions: 0, // TODO: Add completion tracking
        totalCommission: 0, // TODO: Add commission tracking
        totalInstitutionRevenue: 0 // TODO: Add institution revenue tracking
      },
      recentEnrollments: [],
      recentUsers: [],
      timestamp: new Date()
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Admin Stats API - Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
} 