import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's host commissions
    const commissions = await prisma.hostCommission.findMany({
      where: { hostId: session.user.id },
      include: {
        liveConversation: true,
        tier: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform data for frontend
    const commissionData = commissions.map(commission => ({
      id: commission.id,
      conversationTitle: commission.liveConversation.title,
      date: commission.createdAt,
      amount: commission.amount,
      status: commission.status,
      tier: commission.tier?.displayName || 'Community',
      commissionRate: commission.commissionRate
    }));

    return NextResponse.json({ commissions: commissionData });
  } catch (error) {
    console.error('Error fetching host commissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch host commissions' },
      { status: 500 }
    );
  }
}

