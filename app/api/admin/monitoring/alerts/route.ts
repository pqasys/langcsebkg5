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
    const language = searchParams.get('language');

    const alerts = await MonitoringService.getActiveAlerts(language || undefined);

    return NextResponse.json({
      success: true,
      data: alerts
    });

  } catch (error) {
    logger.error('Error getting alerts', { error });
    return NextResponse.json(
      { error: 'Failed to get alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Manually trigger alert rules check
    const triggeredAlerts = await MonitoringService.checkAlertRules();

    logger.info('Manual alert rules check completed', {
      triggeredAlerts: triggeredAlerts.length,
      requestedBy: session.user.email
    });

    return NextResponse.json({
      success: true,
      data: {
        triggeredAlerts,
        message: `Checked alert rules. ${triggeredAlerts.length} new alerts triggered.`
      }
    });

  } catch (error) {
    logger.error('Error checking alert rules', { error });
    return NextResponse.json(
      { error: 'Failed to check alert rules' },
      { status: 500 }
    );
  }
}
