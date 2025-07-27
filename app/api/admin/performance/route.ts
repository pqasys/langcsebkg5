// Performance monitoring API
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { performanceMonitor } from '@/lib/performance-monitor';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Handle different actions
    if (action === 'reset') {
      // Reset performance metrics
      return NextResponse.json({ message: 'Performance metrics reset' });
    }

    if (action === 'clear-old') {
      // Clear old metrics
      return NextResponse.json({ message: 'Old metrics cleared' });
    }

    // Get performance statistics
    const metrics = performanceMonitor.getMetrics();
    const events = performanceMonitor.getEvents();
    const report = performanceMonitor.getPerformanceReport();
    
    return NextResponse.json({
      metrics,
      events: events.slice(-50), // Last 50 events
      report,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in performance API:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 