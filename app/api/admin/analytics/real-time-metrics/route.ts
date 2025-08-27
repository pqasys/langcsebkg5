import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AnalyticsService } from '@/lib/analytics-service';
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

    logger.info('Getting real-time threshold metrics', {
      requestedBy: session.user.email
    });

    const metrics = await AnalyticsService.getRealTimeThresholdMetrics();

    return NextResponse.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    logger.error('Error getting real-time threshold metrics', { error });
    return NextResponse.json(
      { error: 'Failed to get real-time metrics' },
      { status: 500 }
    );
  }
}
