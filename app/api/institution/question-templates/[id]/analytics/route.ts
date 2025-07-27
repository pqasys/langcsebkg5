import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TemplateAnalyticsService } from '@/lib/template-analytics';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templateId = params.id;
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Get comprehensive analytics
    const analytics = await TemplateAnalyticsService.getTemplateAnalytics(templateId);
    const trends = await TemplateAnalyticsService.getUsageTrends(templateId, days);

    return NextResponse.json({
      ...analytics,
      trends,
    });
  } catch (error) {
    console.error('Error fetching template analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templateId = params.id;
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'generate_suggestions':
        const suggestions = await TemplateAnalyticsService.generateSuggestions(templateId);
        return NextResponse.json({ suggestions });

      case 'track_usage':
        const usageData = body.usageData;
        const usage = await TemplateAnalyticsService.trackUsage({
          templateId,
          usedBy: session.user.id,
          institutionId: session.user.institutionId,
          ...usageData,
        });
        return NextResponse.json({ usage });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in template analytics action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 