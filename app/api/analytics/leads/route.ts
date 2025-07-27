import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      institutionId, 
      eventType, 
      timestamp, 
      userAgent, 
      referrer, 
      sessionId,
      contactType,
      contactValue 
    } = body;

    // Store lead event in database
    const leadEvent = await prisma.leadEvent.create({
      data: {
        id: body.id || crypto.randomUUID(),
        institutionId,
        eventType,
        timestamp: new Date(timestamp),
        userAgent,
        referrer,
        sessionId,
        contactType,
        contactValue,
        metadata: {
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent,
          referrer
        }
      }
    });

    return NextResponse.json({ success: true, eventId: leadEvent.id });
  } catch (error) {
    console.error('Error tracking lead event:');
    return NextResponse.json(
      { error: 'Failed to track lead event' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');
    
    if (!institutionId) {
      return NextResponse.json(
        { error: 'Institution ID is required' },
        { status: 400 }
      );
    }

    // Get lead events for the institution
    const events = await prisma.leadEvent.findMany({
      where: {
        institutionId,
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    // Calculate analytics
    const totalViews = events.filter(e => e.eventType === 'view').length;
    const totalContacts = events.filter(e => e.eventType === 'contact').length;
    const totalWebsiteClicks = events.filter(e => e.eventType === 'website_click').length;
    const totalCourseClicks = events.filter(e => e.eventType === 'course_click').length;
    const conversionRate = totalViews > 0 ? totalContacts / totalViews : 0;

    // Daily stats for last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEvents = events.filter(e => 
        e.timestamp.toISOString().split('T')[0] === dateStr
      );
      
      dailyStats.push({
        date: dateStr,
        views: dayEvents.filter(e => e.eventType === 'view').length,
        contacts: dayEvents.filter(e => e.eventType === 'contact').length
      });
    }

    // Top referrers
    const referrerCounts: Record<string, number> = {};
    events.forEach(event => {
      if (event.referrer) {
        const domain = new URL(event.referrer).hostname;
        referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
      }
    });

    const topReferrers = Object.entries(referrerCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const analytics = {
      totalViews,
      totalContacts,
      totalWebsiteClicks,
      totalCourseClicks,
      conversionRate,
      dailyStats,
      topReferrers
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching lead analytics:');
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 