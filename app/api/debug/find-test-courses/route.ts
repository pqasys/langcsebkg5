import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Find courses with LIVE_ONLINE marketing type
    const liveOnlineCourses = await prisma.course.findMany({
      where: {
        marketingType: 'LIVE_ONLINE',
        status: 'PUBLISHED',
        maxStudents: { gt: 0 }
      },
      select: {
        id: true,
        title: true,
        marketingType: true,
        status: true,
        maxStudents: true,
        base_price: true,
        startDate: true,
        endDate: true,
        institutionId: true,
        requiresSubscription: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      take: 10
    });

    // Find any published courses (for comparison)
    const allPublishedCourses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        maxStudents: { gt: 0 }
      },
      select: {
        id: true,
        title: true,
        marketingType: true,
        status: true,
        maxStudents: true,
        base_price: true,
        requiresSubscription: true
      },
      take: 5
    });

    // Get course count by marketing type
    const courseCounts = await prisma.course.groupBy({
      by: ['marketingType', 'status'],
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      liveOnlineCourses,
      allPublishedCourses,
      courseCounts,
      summary: {
        totalLiveOnline: liveOnlineCourses.length,
        totalPublished: allPublishedCourses.length,
        testUrl: liveOnlineCourses.length > 0 
          ? `http://localhost:3000/courses/${liveOnlineCourses[0].id}`
          : null
      }
    });
  } catch (error) {
    console.error('Error finding test courses:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
