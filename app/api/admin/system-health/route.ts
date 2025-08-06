import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UsageAnalyticsService } from '@/lib/usage-analytics-service';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get system health metrics
    const systemHealth = await UsageAnalyticsService.monitorSystemHealth();
    
    // Get platform usage stats
    const platformStats = await UsageAnalyticsService.getPlatformUsageStats();
    
    // Get users approaching limits
    const usersApproachingLimits = await UsageAnalyticsService.getUsersApproachingLimits();
    
    // Get subscription distribution
    const subscriptionDistribution = await prisma.studentSubscription.groupBy({
      by: ['planType'],
      where: { status: 'ACTIVE' },
      _count: {
        id: true
      }
    });

    // Get recent system issues
    const recentIssues = await prisma.auditLog.findMany({
      where: {
        action: {
          in: ['ERROR', 'WARNING', 'SYSTEM_ISSUE']
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    // Get governance metrics
    const governanceMetrics = await getGovernanceMetrics();

    return NextResponse.json({
      success: true,
      data: {
        systemHealth,
        platformStats,
        usersApproachingLimits: usersApproachingLimits.slice(0, 10), // Top 10
        subscriptionDistribution: subscriptionDistribution.reduce((acc, item) => {
          acc[item.planType] = item._count.id;
          return acc;
        }, {} as Record<string, number>),
        recentIssues,
        governanceMetrics
      }
    });

  } catch (error) {
    console.error('Error getting system health:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getGovernanceMetrics() {
  try {
    // Get enrollment governance metrics
    const enrollmentMetrics = await prisma.studentCourseEnrollment.groupBy({
      by: ['accessMethod'],
      where: {
        isActive: true,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      _count: {
        id: true
      }
    });

    // Get live class governance metrics
    const liveClassMetrics = await prisma.videoSession.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      _count: {
        id: true
      }
    });

    // Get subscription upgrade/downgrade metrics
    const subscriptionChanges = await prisma.subscriptionLog.groupBy({
      by: ['action'],
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      _count: {
        id: true
      }
    });

    // Get quota usage statistics
    const quotaUsage = await prisma.studentSubscription.aggregate({
      where: { status: 'ACTIVE' },
      _avg: {
        currentEnrollments: true,
        monthlyEnrollments: true,
        monthlyAttendance: true
      },
      _max: {
        currentEnrollments: true,
        monthlyEnrollments: true,
        monthlyAttendance: true
      }
    });

    return {
      enrollmentMetrics: enrollmentMetrics.reduce((acc, item) => {
        acc[item.accessMethod] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      liveClassMetrics: liveClassMetrics.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      subscriptionChanges: subscriptionChanges.reduce((acc, item) => {
        acc[item.action] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      quotaUsage: {
        average: {
          currentEnrollments: quotaUsage._avg.currentEnrollments || 0,
          monthlyEnrollments: quotaUsage._avg.monthlyEnrollments || 0,
          monthlyAttendance: quotaUsage._avg.monthlyAttendance || 0
        },
        maximum: {
          currentEnrollments: quotaUsage._max.currentEnrollments || 0,
          monthlyEnrollments: quotaUsage._max.monthlyEnrollments || 0,
          monthlyAttendance: quotaUsage._max.monthlyAttendance || 0
        }
      }
    };

  } catch (error) {
    console.error('Error getting governance metrics:', error);
    return {};
  }
} 