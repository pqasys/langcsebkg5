import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LanguageAttendanceThresholdService } from '@/lib/language-attendance-threshold-service';

export const dynamic = 'force-dynamic';

// GET /api/admin/language-attendance-thresholds/metadata - Get available languages, countries, regions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');

    const [languages, countries, regions] = await Promise.all([
      LanguageAttendanceThresholdService.getAvailableLanguages(),
      language ? LanguageAttendanceThresholdService.getAvailableCountries(language) : Promise.resolve([]),
      language ? LanguageAttendanceThresholdService.getAvailableRegions(language) : Promise.resolve([])
    ]);

    return NextResponse.json({
      success: true,
      data: {
        languages,
        countries,
        regions
      }
    });
  } catch (error) {
    console.error('Error getting language attendance threshold metadata:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
