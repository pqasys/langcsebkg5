import { NextRequest, NextResponse } from 'next/server';
import { LiveClassAttendanceService } from '@/lib/live-class-attendance-service';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

// POST /api/cron/check-attendance-thresholds - Cron job to check attendance thresholds
export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (optional security check)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Starting attendance threshold check cron job');

    // Run the automatic cancellation process
    const result = await LiveClassAttendanceService.autoCancelBelowThresholdSessions();

    logger.info('Attendance threshold check completed', {
      cancelled: result.cancelled.length,
      warnings: result.warnings.length,
      errors: result.errors.length
    });

    return NextResponse.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        summary: {
          totalProcessed: result.cancelled.length + result.warnings.length + result.errors.length,
          cancelled: result.cancelled.length,
          warnings: result.warnings.length,
          errors: result.errors.length
        },
        details: {
          cancelled: result.cancelled,
          warnings: result.warnings,
          errors: result.errors
        }
      }
    });
  } catch (error) {
    logger.error('Error in attendance threshold cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/cron/check-attendance-thresholds - Manual trigger for testing
export async function GET(request: NextRequest) {
  try {
    // Only allow in development or with proper authentication
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization');
      const expectedToken = process.env.CRON_SECRET_TOKEN;
      
      if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    logger.info('Manual attendance threshold check triggered');

    // Run the automatic cancellation process
    const result = await LiveClassAttendanceService.autoCancelBelowThresholdSessions();

    return NextResponse.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        summary: {
          totalProcessed: result.cancelled.length + result.warnings.length + result.errors.length,
          cancelled: result.cancelled.length,
          warnings: result.warnings.length,
          errors: result.errors.length
        },
        details: {
          cancelled: result.cancelled,
          warnings: result.warnings,
          errors: result.errors
        }
      }
    });
  } catch (error) {
    logger.error('Error in manual attendance threshold check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
