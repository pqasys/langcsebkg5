import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MonitoringService } from '@/lib/monitoring-service';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const statistics = await MonitoringService.getAlertStatistics(days);

    return NextResponse.json({
      success: true,
      data: statistics
    });

  } catch (error) {
    logger.error('Error getting monitoring statistics', { error });
    return NextResponse.json(
      { error: 'Failed to get monitoring statistics' },
      { status: 500 }
    );
  }
}
