import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ABTestingService } from '@/lib/ab-testing-service';
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

    const abTests = await ABTestingService.getABTestsByLanguage(language);

    return NextResponse.json({
      success: true,
      data: abTests
    });

  } catch (error) {
    logger.error('Error getting A/B tests', { error });
    return NextResponse.json(
      { error: 'Failed to get A/B tests' },
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
      variantA,
      variantB,
      trafficSplit,
      startDate,
      endDate,
      status
    } = body;

    // Validate required fields
    if (!name || !language || !variantA || !variantB || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate traffic split
    if (trafficSplit < 0 || trafficSplit > 100) {
      return NextResponse.json(
        { error: 'Traffic split must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    const abTest = await ABTestingService.createABTest({
      name,
      description,
      language,
      country,
      region,
      variantA,
      variantB,
      trafficSplit,
      startDate: start,
      endDate: end,
      status: status || 'DRAFT',
      createdBy: session.user.id
    });

    logger.info('A/B test created successfully', {
      testId: abTest.id,
      name: abTest.name,
      language: abTest.language,
      createdBy: session.user.email
    });

    return NextResponse.json({
      success: true,
      data: abTest
    });

  } catch (error) {
    logger.error('Error creating A/B test', { error });
    return NextResponse.json(
      { error: 'Failed to create A/B test' },
      { status: 500 }
    );
  }
}
