import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LiveClassSubscriptionService } from '@/lib/live-class-subscription-service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const usage = await LiveClassSubscriptionService.getUserSubscriptionUsage(session.user.id);
    
    return NextResponse.json(usage);
  } catch (error) {
    console.error('Error getting subscription usage:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription usage' },
      { status: 500 }
    );
  }
} 