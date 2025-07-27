import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
// import webpush from 'web-push';
import { NotificationType, NotificationPriority } from '@/lib/push-notifications';
// Configure web-push with VAPID keys
// webpush.setVapidDetails(
//   process.env.VAPID_SUBJECT || 'mailto:admin@fluentish.com',
//   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
//   process.env.VAPID_PRIVATE_KEY || ''
// );

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      userIds,
      title,
      body,
      type = NotificationType.SYSTEM_UPDATE,
      priority = NotificationPriority.NORMAL,
      data = {},
      icon,
      badge,
      image,
      actions = [],
      scheduledFor
    } = await request.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get subscriptions for the specified users
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId: {
          in: userIds || [session.user.id] // If no userIds specified, send to current user
        }
      }
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No active subscriptions found',
        sentCount: 0
      });
    }

    // Prepare notification payload
    const notificationPayload = {
      title,
      body,
              icon: icon || '/icon.svg',
        badge: badge || '/icon.svg',
      image,
      data: {
        type,
        priority,
        timestamp: new Date().toISOString(),
        ...data
      },
      actions: actions.map((action: unknown) => ({
        action: action.action,
        title: action.title,
        icon: action.icon
      }))
    };

    // Send notifications
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          // Dynamic import to avoid SSR issues
          const webpush = await import('web-push');
          
          // Configure web-push with VAPID keys
          webpush.default.setVapidDetails(
            process.env.VAPID_SUBJECT || 'mailto:admin@fluentish.com',
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
            process.env.VAPID_PRIVATE_KEY || ''
          );
          
          await webpush.default.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: subscription.keys as any
            },
            JSON.stringify(notificationPayload)
          );

          // Log successful notification
          await prisma.notificationLog.create({
            data: {
              userId: subscription.userId,
              type,
              title,
              body,
              priority,
              data: notificationPayload.data,
              sentAt: new Date(),
              status: 'SENT'
            }
          });

          return { success: true, subscriptionId: subscription.id };
        } catch (error) {
          console.error('Failed to send notification to ${subscription.endpoint}:');
          
          // Log failed notification
          await prisma.notificationLog.create({
            data: {
              userId: subscription.userId,
              type,
              title,
              body,
              priority,
              data: notificationPayload.data,
              sentAt: new Date(),
              status: 'FAILED',
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          });

          // If subscription is invalid, remove it
          if (error instanceof Error && error.message.includes('410')) {
            await prisma.pushSubscription.delete({
              where: { id: subscription.id }
            });
          }

          return { success: false, subscriptionId: subscription.id, error };
        }
      })
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;

    const failed = results.length - successful;

    return NextResponse.json({
      success: true,
      message: `Notifications sent: ${successful} successful, ${failed} failed`,
      sentCount: successful,
      failedCount: failed,
      totalCount: results.length
    });

  } catch (error) {
    console.error('Send notification error:');
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

// Get notification history for a user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: unknown = {
      userId: session.user.id
    };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const notifications = await prisma.notificationLog.findMany({
      where,
      orderBy: {
        sentAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        priority: true,
        data: true,
        sentAt: true,
        status: true,
        error: true
      }
    });

    const total = await prisma.notificationLog.count({ where });

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get notification history error:');
    return NextResponse.json(
      { error: 'Failed to get notification history' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 