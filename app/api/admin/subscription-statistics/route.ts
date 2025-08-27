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

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Optional: YYYY-MM format

    const statistics = await LiveClassSubscriptionService.getSubscriptionStatistics(month);
    
    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error getting subscription statistics:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription statistics' },
      { status: 500 }
    );
  }
}
