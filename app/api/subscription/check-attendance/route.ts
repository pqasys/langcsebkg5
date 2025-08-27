import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LiveClassSubscriptionService } from '@/lib/live-class-subscription-service';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const result = await LiveClassSubscriptionService.canUserAttendSession(
      session.user.id,
      sessionId
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking attendance eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to check attendance eligibility' },
      { status: 500 }
    );
  }
}
