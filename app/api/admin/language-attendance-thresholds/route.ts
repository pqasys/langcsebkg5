import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LanguageAttendanceThresholdService } from '@/lib/language-attendance-threshold-service';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/admin/language-attendance-thresholds - Get all threshold configurations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const country = searchParams.get('country');
    const region = searchParams.get('region');

    let configs;
    if (language) {
      configs = await LanguageAttendanceThresholdService.getThresholdConfigsByLanguage(language);
    } else {
      configs = await LanguageAttendanceThresholdService.getAllThresholdConfigs();
    }

    // Filter by country/region if provided
    if (country || region) {
      configs = configs.filter(config => {
        if (country && config.country !== country) return false;
        if (region && config.region !== region) return false;
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      data: configs
    });
  } catch (error) {
    console.error('Error getting language attendance thresholds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/language-attendance-thresholds - Create new threshold configuration
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      language,
      country,
      region,
      minAttendanceThreshold,
      profitMarginThreshold,
      instructorHourlyRate,
      platformRevenuePerStudent,
      autoCancelIfBelowThreshold,
      cancellationDeadlineHours,
      isActive,
      priority,
      notes
    } = body;

    // Validate required fields
    if (!language || !minAttendanceThreshold || !profitMarginThreshold || !instructorHourlyRate || !platformRevenuePerStudent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newConfig = await LanguageAttendanceThresholdService.createThresholdConfig(
      {
        language,
        country,
        region,
        minAttendanceThreshold,
        profitMarginThreshold,
        instructorHourlyRate,
        platformRevenuePerStudent,
        autoCancelIfBelowThreshold: autoCancelIfBelowThreshold ?? true,
        cancellationDeadlineHours: cancellationDeadlineHours ?? 24,
        isActive: isActive ?? true,
        priority: priority ?? 0,
        notes
      },
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: newConfig
    });
  } catch (error) {
    console.error('Error creating language attendance threshold:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/language-attendance-thresholds - Bulk update threshold configurations
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates must be an array' },
        { status: 400 }
      );
    }

    const results = await LanguageAttendanceThresholdService.bulkUpdateThresholdConfigs(
      updates,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error bulk updating language attendance thresholds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
