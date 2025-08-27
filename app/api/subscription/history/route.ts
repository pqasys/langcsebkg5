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

    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '6');

    const history = await LiveClassSubscriptionService.getUserSubscriptionHistory(
      session.user.id,
      months
    );
    
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error getting subscription history:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription history' },
      { status: 500 }
    );
  }
}
