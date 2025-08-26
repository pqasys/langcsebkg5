import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSafeServerSession, isBuildTime } from '@/lib/auth-utils';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    // Check if we're in a build context
    if (isBuildTime(request)) {
      // During static generation, return empty data instead of error
      return NextResponse.json({
        totalSessions: 0,
        activeSessions: 0,
        completedSessions: 0,
        totalParticipants: 0,
        totalRevenue: 0,
        averageSessionDuration: 0,
        topLanguages: [],
        topInstructors: [],
        revenueByDay: [],
        participantGrowth: []
      });
    }

    const session = await getSafeServerSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow institutions and admins to access analytics
    if (session.user.role !== 'INSTITUTION' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y
    const institutionId = session.user.role === 'ADMIN' ? searchParams.get('institutionId') : session.user.institutionId;

    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get video session analytics
    const whereClause = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(institutionId ? { institutionId } : {}),
    };

    const [
      totalSessions,
      activeSessions,
      completedSessions,
      totalParticipants,
      totalRevenue,
      averageSessionDuration,
      topLanguages,
      topInstructors,
      revenueByDay,
      participantGrowth
    ] = await Promise.all([
      // Total sessions created
      prisma.videoSession.count({ where: whereClause }),
      
      // Active sessions (scheduled or in progress)
      prisma.videoSession.count({ 
        where: { 
          ...whereClause,
          status: { in: ['SCHEDULED', 'ACTIVE'] }
        }
      }),
      
      // Completed sessions
      prisma.videoSession.count({ 
        where: { 
          ...whereClause,
          status: 'COMPLETED'
        }
      }),
      
      // Total participants
      prisma.videoSessionParticipant.count({ 
        where: {
          session: whereClause
        }
      }),
      
      // Total revenue from paid sessions
      prisma.videoSession.aggregate({
        where: {
          ...whereClause,
          price: { gt: 0 }
        },
        _sum: {
          price: true
        }
      }),
      
      // Average session duration
      prisma.videoSession.aggregate({
        where: {
          ...whereClause,
          duration: { not: null }
        },
        _avg: {
          duration: true
        }
      }),
      
      // Top languages
      prisma.videoSession.groupBy({
        by: ['language'],
        where: whereClause,
        _count: {
          language: true
        },
        orderBy: {
          _count: {
            language: 'desc'
          }
        },
        take: 5
      }),
      
      // Top instructors
      prisma.videoSession.groupBy({
        by: ['instructorId'],
        where: whereClause,
        _count: {
          instructorId: true
        },
        _sum: {
          price: true
        },
        orderBy: {
          _count: {
            instructorId: 'desc'
          }
        },
        take: 5
      }),
      
      // Revenue by day
      prisma.videoSession.groupBy({
        by: ['createdAt'],
        where: {
          ...whereClause,
          price: { gt: 0 }
        },
        _sum: {
          price: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }),
      
      // Participant growth
      prisma.videoSessionParticipant.groupBy({
        by: ['createdAt'],
        where: {
          session: whereClause
        },
        _count: {
          id: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
    ]);

    // Get instructor details for top instructors
    const topInstructorsWithDetails = await Promise.all(
      topInstructors.map(async (instructor) => {
        const instructorDetails = await prisma.user.findUnique({
          where: { id: instructor.instructorId },
          select: { name: true, email: true }
        });
        return {
          instructorId: instructor.instructorId,
          name: instructorDetails?.name || 'Unknown',
          email: instructorDetails?.email || '',
          sessionCount: instructor._count.instructorId,
          totalRevenue: instructor._sum.price || 0
        };
      })
    );

    // Calculate conversion rates
    const conversionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    const averageRevenuePerSession = totalSessions > 0 ? (totalRevenue._sum.price || 0) / totalSessions : 0;
    const averageParticipantsPerSession = totalSessions > 0 ? totalParticipants / totalSessions : 0;

    // Calculate growth metrics
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const previousPeriodEnd = new Date(startDate);
    
    const previousPeriodSessions = await prisma.videoSession.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lte: previousPeriodEnd,
        },
        ...(institutionId ? { institutionId } : {}),
      }
    });

    const sessionGrowth = previousPeriodSessions > 0 
      ? ((totalSessions - previousPeriodSessions) / previousPeriodSessions) * 100 
      : 0;

    return NextResponse.json({
      success: true,
      analytics: {
        period,
        dateRange: {
          start: startDate,
          end: endDate
        },
        overview: {
          totalSessions,
          activeSessions,
          completedSessions,
          totalParticipants,
          totalRevenue: totalRevenue._sum.price || 0,
          averageSessionDuration: averageSessionDuration._avg.duration || 0,
          conversionRate,
          averageRevenuePerSession,
          averageParticipantsPerSession,
          sessionGrowth
        },
        topLanguages: topLanguages.map(lang => ({
          language: lang.language,
          sessionCount: lang._count.language
        })),
        topInstructors: topInstructorsWithDetails,
        revenueByDay: revenueByDay.map(day => ({
          date: day.createdAt,
          revenue: day._sum.price || 0
        })),
        participantGrowth: participantGrowth.map(day => ({
          date: day.createdAt,
          participants: day._count.id
        }))
      }
    });
  } catch (error) {
    console.error('Failed to fetch video session analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 