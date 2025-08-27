import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ABTestingService } from '@/lib/ab-testing-service';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(
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
    const results = await ABTestingService.calculateABTestResults(id);

    if (!results) {
      return NextResponse.json(
        { error: 'A/B test not found' },
        { status: 404 }
      );
    }

    logger.info('A/B test results retrieved', {
      testId: id,
      requestedBy: session.user.email
    });

    return NextResponse.json({
      success: true,
      data: results
    });

  } catch (error) {
    logger.error('Error getting A/B test results', { error });
    return NextResponse.json(
      { error: 'Failed to get A/B test results' },
      { status: 500 }
    );
  }
}
