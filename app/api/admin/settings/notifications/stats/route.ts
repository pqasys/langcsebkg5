import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get overall statistics
    const [
      totalNotifications,
      sentNotifications,
      failedNotifications,
      pendingNotifications,
      totalTemplates,
      activeTemplates,
      totalSystemNotifications,
      activeSystemNotifications
    ] = await Promise.all([
      prisma.notificationLog.count(),
      prisma.notificationLog.count({ where: { status: 'sent' } }),
      prisma.notificationLog.count({ where: { status: 'failed' } }),
      prisma.notificationLog.count({ where: { status: 'pending' } }),
      prisma.notificationTemplate.count(),
      prisma.notificationTemplate.count({ where: { isActive: true } }),
      prisma.systemNotification.count(),
      prisma.systemNotification.count({ where: { isActive: true } })
    ]);

    // Get notifications by type
    const notificationsByType = await prisma.notificationLog.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });

    // Get notifications by status
    const notificationsByStatus = await prisma.notificationLog.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Get notifications by category (from templates)
    const notificationsByCategory = await prisma.notificationLog.groupBy({
      by: ['templateId'],
      _count: {
        templateId: true
      }
    });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await prisma.notificationLog.groupBy({
      by: ['createdAt'],
      _count: {
        createdAt: true
      },
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get top recipients
    const topRecipients = await prisma.notificationLog.groupBy({
      by: ['recipientEmail'],
      _count: {
        recipientEmail: true
      },
      orderBy: {
        _count: {
          recipientEmail: 'desc'
        }
      },
      take: 10
    });

    // Calculate success rate
    const successRate = totalNotifications > 0 ? (sentNotifications / totalNotifications) * 100 : 0;

    return NextResponse.json({
      overview: {
        total: totalNotifications,
        sent: sentNotifications,
        failed: failedNotifications,
        pending: pendingNotifications,
        successRate: Math.round(successRate * 100) / 100
      },
      templates: {
        total: totalTemplates,
        active: activeTemplates
      },
      systemNotifications: {
        total: totalSystemNotifications,
        active: activeSystemNotifications
      },
      byType: notificationsByType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {} as Record<string, number>),
      byStatus: notificationsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      recentActivity: recentActivity.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        count: item._count.createdAt
      })),
      topRecipients: topRecipients.map(item => ({
        email: item.recipientEmail,
        count: item._count.recipientEmail
      }))
    });
  } catch (error) {
    console.error('Error fetching notification statistics:');
    return NextResponse.json(
      { message: 'Failed to fetch notification statistics' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 