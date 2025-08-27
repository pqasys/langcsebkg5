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
    const abTest = await ABTestingService.getABTest(id);

    if (!abTest) {
      return NextResponse.json(
        { error: 'A/B test not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: abTest
    });

  } catch (error) {
    logger.error('Error getting A/B test', { error });
    return NextResponse.json(
      { error: 'Failed to get A/B test' },
      { status: 500 }
    );
  }
}

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
    const { status } = body;

    if (!status || !['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const abTest = await ABTestingService.updateABTestStatus(id, status);

    logger.info('A/B test status updated', {
      testId: id,
      newStatus: status,
      updatedBy: session.user.email
    });

    return NextResponse.json({
      success: true,
      data: abTest
    });

  } catch (error) {
    logger.error('Error updating A/B test status', { error });
    return NextResponse.json(
      { error: 'Failed to update A/B test status' },
      { status: 500 }
    );
  }
}
