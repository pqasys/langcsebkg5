import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // // // // // // console.log('🔄 Admin triggered fallback plan processing...');

    const results = await SubscriptionCommissionService.processExpiredTrials();

    console.log('✅ Fallback processing completed:', results);

    return NextResponse.json({
      success: true,
      message: 'Fallback plans processed successfully',
      results
    });

  } catch (error) {
    console.error('❌ Error processing fallback plans:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 