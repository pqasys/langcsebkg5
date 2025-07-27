import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const skip = (page - 1) * limit;

    // Create cache key based on parameters
    const cacheKey = `notifications:${session.user.id}:${page}:${limit}:${status || 'all'}:${type || 'all'}`;
    
    // Try to get cached data first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached notifications data');
      return NextResponse.json(cachedData);
    }

    console.log('Fetching fresh notifications data from database...');
    const startTime = Date.now();

    // Build where clause
    const where: unknown = {
      recipientId: session.user.id
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    // Optimized single query for notifications with pagination
    const notifications = await prisma.notificationLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        readAt: true,
        metadata: true
      }
    });

    // Get total count for pagination
    const total = await prisma.notificationLog.count({ where });

    // Get notification statistics - only if not filtering by status
    let notificationStats = {
      total: total,
      read: 0,
      unread: 0,
      sent: 0,
      failed: 0
    };

    // Only fetch stats if we're not filtering by status (to avoid redundant queries)
    if (!status) {
      const stats = await prisma.notificationLog.groupBy({
        by: ['status'],
        where: { recipientId: session.user.id },
        _count: {
          status: true
        }
      });

      notificationStats = {
        total: stats.reduce((acc, stat) => acc + stat._count.status, 0),
        read: stats.find(s => s.status === 'READ')?._count.status || 0,
        unread: stats.find(s => s.status === 'UNREAD')?._count.status || 0,
        sent: stats.find(s => s.status === 'SENT')?._count.status || 0,
        failed: stats.find(s => s.status === 'FAILED')?._count.status || 0
      };
    } else {
      // If filtering by status, adjust stats accordingly
      notificationStats = {
        total: total,
        read: status === 'READ' ? total : 0,
        unread: status === 'UNREAD' ? total : 0,
        sent: status === 'SENT' ? total : 0,
        failed: status === 'FAILED' ? total : 0
      };
    }

    const result = {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: notificationStats
    };

    const endTime = Date.now();
    console.log(`Fetched notifications in ${endTime - startTime}ms`);

    // Cache the result for 2 minutes (notifications can change frequently)
    await cache.set(cacheKey, result, 2 * 60 * 1000);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationIds, action } = await request.json();

    if (!notificationIds || !Array.isArray(notificationIds) || !action) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    let updateData: unknown = {};

    switch (action) {
      case 'mark_read':
        updateData = { status: 'READ', readAt: new Date() };
        break;
      case 'mark_unread':
        updateData = { status: 'UNREAD', readAt: null };
        break;
      case 'delete':
        // Soft delete by marking as deleted
        updateData = { status: 'DELETED', deletedAt: new Date() };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const result = await prisma.notificationLog.updateMany({
      where: {
        id: { in: notificationIds },
        recipientId: session.user.id
      },
      data: updateData
    });

    // Invalidate cache for this user's notifications
    // Note: In a production environment, you might want to implement pattern-based cache invalidation
    // For now, we'll rely on the cache TTL to expire naturally

    return NextResponse.json({
      message: `Successfully updated ${result.count} notifications`,
      updatedCount: result.count
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
} 