import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
    }

    // Remove subscription from database
    const deletedSubscription = await prisma.pushSubscription.deleteMany({
      where: {
        endpoint: endpoint,
        userId: session.user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully unsubscribed from push notifications',
      deletedCount: deletedSubscription.count
    });

  } catch (error) {
    console.error('Push unsubscription error:');
    return NextResponse.json(
      { error: 'Failed to unsubscribe from push notifications' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 