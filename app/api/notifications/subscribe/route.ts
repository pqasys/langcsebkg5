import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';
// import webpush from 'web-push';
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

    const { endpoint, keys, userId } = await request.json();

    if (!endpoint || !keys) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Store or update subscription in database
    const subscription = await prisma.pushSubscription.upsert({
      where: {
        endpoint: endpoint
      },
      update: {
        keys: keys,
        userId: session.user.id,
        updatedAt: new Date()
      },
      create: {
        endpoint: endpoint,
        keys: keys,
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Send test notification to verify subscription
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
        JSON.stringify({
          title: 'Welcome to Fluentish!',
          body: 'You will now receive notifications about your learning progress.',
                  icon: '/icon.svg',
        badge: '/icon.svg',
          data: {
            type: 'subscription_confirmation',
            timestamp: new Date().toISOString()
          }
        })
      );
    } catch (error) {
      console.error('Failed to send test notification:');
      // Don't fail the subscription if test notification fails
    }

    return NextResponse.json({ 
      success: true, 
      subscription: {
        id: subscription.id,
        endpoint: subscription.endpoint
      }
    });

  } catch (error) {
    console.error('Push subscription error:');
    return NextResponse.json(
      { error: 'Failed to subscribe to push notifications' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscriptions
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        endpoint: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ subscriptions });

  } catch (error) {
    console.error('Get subscriptions error:');
    return NextResponse.json(
      { error: 'Failed to get subscriptions' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 