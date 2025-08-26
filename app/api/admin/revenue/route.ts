import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { RevenueTrackingService } from '@/lib/revenue-tracking-service';

export async function GET(request: Request) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const reportType = searchParams.get('type') || 'metrics';

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: startDate, endDate' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    switch (reportType) {
      case 'metrics':
        const metrics = await RevenueTrackingService.getRevenueMetrics(start, end);
        return NextResponse.json(metrics);
      
      case 'breakdown':
        const breakdown = await RevenueTrackingService.getRevenueBreakdown(start, end);
        return NextResponse.json(breakdown);
      
      case 'projection':
        const projection = await RevenueTrackingService.getRevenueProjection();
        return NextResponse.json(projection);
      
      case 'report':
        const report = await RevenueTrackingService.generateRevenueReport(start, end);
        return NextResponse.json(report);
      
      default:
        return NextResponse.json(
          { error: 'Invalid report type. Use: metrics, breakdown, projection, or report' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error getting revenue data:');
    return NextResponse.json(
      { error: 'Failed to get revenue data' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, endDate, format = 'json' } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: startDate, endDate' },
        { status: 400 }
      );
    }

    const report = await RevenueTrackingService.generateRevenueReport(
      new Date(startDate),
      new Date(endDate),
      format as 'json' | 'csv'
    );

    // // // console.log('Revenue report generated successfully.');
    return NextResponse.json({
      success: true,
      report,
      format
    });
  } catch (error) {
    console.error('Error generating revenue report:');
    return NextResponse.json(
      { error: 'Failed to generate revenue report' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 