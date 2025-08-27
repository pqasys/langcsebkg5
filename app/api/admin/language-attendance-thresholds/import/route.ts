import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LanguageAttendanceThresholdService } from '@/lib/language-attendance-threshold-service';

export const dynamic = 'force-dynamic';

// POST /api/admin/language-attendance-thresholds/import - Import threshold configurations
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { configs } = body;

    if (!Array.isArray(configs)) {
      return NextResponse.json(
        { error: 'Configs must be an array' },
        { status: 400 }
      );
    }

    const result = await LanguageAttendanceThresholdService.importThresholdConfigs(
      configs,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error importing language attendance thresholds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
