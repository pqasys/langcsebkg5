import { NextRequest, NextResponse } from 'next/server';
import { MonitoringService } from '@/lib/monitoring-service';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Verify cron job secret if needed
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logger.info('Starting automated alert rules check');

    const triggeredAlerts = await MonitoringService.checkAlertRules();

    logger.info('Automated alert rules check completed', {
      triggeredAlerts: triggeredAlerts.length
    });

    return NextResponse.json({
      success: true,
      data: {
        triggeredAlerts,
        message: `Alert check completed. ${triggeredAlerts.length} new alerts triggered.`
      }
    });

  } catch (error) {
    logger.error('Error in automated alert rules check', { error });
    return NextResponse.json(
      { error: 'Failed to check alert rules' },
      { status: 500 }
    );
  }
}
