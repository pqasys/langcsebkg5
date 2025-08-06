import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SubscriptionManagementService } from '@/lib/subscription-management-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { newTierId, reason, immediateUpgrade = true } = body;

    if (!newTierId) {
      return NextResponse.json(
        { error: 'New tier ID is required' },
        { status: 400 }
      );
    }

    const result = await SubscriptionManagementService.upgradeSubscription({
      userId: session.user.id,
      newTierId,
      reason,
      immediateUpgrade
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Upgrade failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      subscription: result.subscription,
      proratedAmount: result.proratedAmount
    });

  } catch (error) {
    console.error('Error upgrading subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 