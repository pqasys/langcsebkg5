import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MonitoringService } from '@/lib/monitoring-service';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { action } = body;

    let alert;

    switch (action) {
      case 'acknowledge':
        alert = await MonitoringService.acknowledgeAlert(id, session.user.id);
        break;
      case 'resolve':
        alert = await MonitoringService.resolveAlert(id);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "acknowledge" or "resolve"' },
          { status: 400 }
        );
    }

    logger.info('Alert action performed', {
      alertId: id,
      action,
      performedBy: session.user.email
    });

    return NextResponse.json({
      success: true,
      data: alert
    });

  } catch (error) {
    logger.error('Error performing alert action', { error });
    return NextResponse.json(
      { error: 'Failed to perform alert action' },
      { status: 500 }
    );
  }
}
