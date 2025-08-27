import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LanguageAttendanceThresholdService } from '@/lib/language-attendance-threshold-service';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/admin/language-attendance-thresholds/[id] - Get specific threshold configuration
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await prisma.languageAttendanceThreshold.findUnique({
      where: { id: params.id },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        updatedByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error getting language attendance threshold:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/language-attendance-thresholds/[id] - Update threshold configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
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

    // Validate that configuration exists
    const existing = await prisma.languageAttendanceThreshold.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    const updatedConfig = await LanguageAttendanceThresholdService.updateThresholdConfig(
      params.id,
      {
        minAttendanceThreshold,
        profitMarginThreshold,
        instructorHourlyRate,
        platformRevenuePerStudent,
        autoCancelIfBelowThreshold,
        cancellationDeadlineHours,
        isActive,
        priority,
        notes
      },
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: updatedConfig
    });
  } catch (error) {
    console.error('Error updating language attendance threshold:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/language-attendance-thresholds/[id] - Delete threshold configuration
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate that configuration exists
    const existing = await prisma.languageAttendanceThreshold.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    await LanguageAttendanceThresholdService.deleteThresholdConfig(params.id);

    return NextResponse.json({
      success: true,
      message: 'Configuration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting language attendance threshold:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
