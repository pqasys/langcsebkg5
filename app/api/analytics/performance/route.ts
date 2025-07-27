import { NextRequest, NextResponse } from 'next/server';
import { simpleCache } from '@/lib/simple-cache';

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    
    // Store performance event in database
    await prisma.auditLog.create({
      data: {
        action: 'PERFORMANCE_EVENT',
        resource: 'ANALYTICS',
        details: {
          type: event.type,
          data: event.data,
          userId: event.userId,
          sessionId: event.sessionId,
          timestamp: event.timestamp
        },
        severity: 'INFO',
        category: 'PERFORMANCE',
        metadata: {
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || request.ip,
        }
      }
    });

    // Cache performance metrics for real-time monitoring
    const cacheKey = `performance:${event.type}:${event.sessionId}`;
    await simpleCache.set(cacheKey, event, 300); // Cache for 5 minutes

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing performance event:', error);
    return NextResponse.json(
      { error: 'Failed to store performance event' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get performance events from database
    const events = await prisma.auditLog.findMany({
      where: {
        action: 'PERFORMANCE_EVENT',
        ...(type && {
          details: {
            path: ['type'],
            equals: type
          }
        }),
        ...(sessionId && {
          details: {
            path: ['sessionId'],
            equals: sessionId
          }
        })
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    });

    // Get cache statistics
    const cacheStats = await simpleCache.getStats();

    // Calculate performance metrics
    const performanceEvents = events
      .filter(e => e.details && typeof e.details === 'object')
      .map(e => e.details as any);

    const metrics = {
      totalEvents: performanceEvents.length,
      averageAPITime: calculateAverageAPITime(performanceEvents),
      cacheHitRate: cacheStats.hitRate,
      isRedisAvailable: cacheStats.isRedisAvailable,
      recentEvents: performanceEvents.slice(0, 10)
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error retrieving performance data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve performance data' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

function calculateAverageAPITime(events: unknown[]): number {
  const apiEvents = events.filter(e => e.type === 'apiCall');
  if (apiEvents.length === 0) return 0;
  
  const totalTime = apiEvents.reduce((sum, event) => sum + (event.data?.responseTime || 0), 0);
  return Math.round(totalTime / apiEvents.length);
} 