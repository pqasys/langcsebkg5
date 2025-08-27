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

    if (!language) {
      return NextResponse.json(
        { error: 'Language parameter is required' },
        { status: 400 }
      );
    }

    const alertRules = await MonitoringService.getAlertRules(language);

    return NextResponse.json({
      success: true,
      data: alertRules
    });

  } catch (error) {
    logger.error('Error getting alert rules', { error });
    return NextResponse.json(
      { error: 'Failed to get alert rules' },
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

    const body = await request.json();
    const {
      name,
      description,
      language,
      country,
      region,
      metric,
      operator,
      threshold,
      timeWindow,
      severity,
      enabled,
      notificationChannels
    } = body;

    // Validate required fields
    if (!name || !language || !metric || !operator || threshold === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate metric
    const validMetrics = ['CANCELLATION_RATE', 'PROFIT_MARGIN', 'ATTENDANCE_THRESHOLD', 'REVENUE_DROP'];
    if (!validMetrics.includes(metric)) {
      return NextResponse.json(
        { error: 'Invalid metric value' },
        { status: 400 }
      );
    }

    // Validate operator
    const validOperators = ['GREATER_THAN', 'LESS_THAN', 'EQUALS', 'NOT_EQUALS'];
    if (!validOperators.includes(operator)) {
      return NextResponse.json(
        { error: 'Invalid operator value' },
        { status: 400 }
      );
    }

    // Validate severity
    const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        { error: 'Invalid severity value' },
        { status: 400 }
      );
    }

    const alertRule = await MonitoringService.createAlertRule({
      name,
      description,
      language,
      country,
      region,
      metric,
      operator,
      threshold,
      timeWindow: timeWindow || 60,
      severity: severity || 'MEDIUM',
      enabled: enabled !== false,
      notificationChannels: notificationChannels || ['email'],
      createdBy: session.user.id
    });

    logger.info('Alert rule created successfully', {
      ruleId: alertRule.id,
      name: alertRule.name,
      language: alertRule.language,
      createdBy: session.user.email
    });

    return NextResponse.json({
      success: true,
      data: alertRule
    });

  } catch (error) {
    logger.error('Error creating alert rule', { error });
    return NextResponse.json(
      { error: 'Failed to create alert rule' },
      { status: 500 }
    );
  }
}
