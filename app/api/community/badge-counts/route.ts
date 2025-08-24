import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Thresholds for when to show real data vs fallback
const THRESHOLDS = {
  MIN_CIRCLES: 5,
  MIN_CLUBS: 3
};

// Fallback values when thresholds aren't met (role-specific)
const FALLBACK_COUNTS = {
  STUDENT: { circles: 12, clubs: 5 },
  INSTITUTION: { circles: 8, clubs: 3 },
  ADMIN: { circles: 25, clubs: 15 },
  GUEST: { circles: 18, clubs: 7 }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'GUEST';

    // Fetch real counts from database
    const [circlesCount, clubsCount] = await Promise.all([
      // Count active study circles/groups
      prisma.studyGroup?.count({
        where: {
          status: 'ACTIVE',
          isPublic: true
        }
      }).catch(() => 0), // Fallback to 0 if table doesn't exist
      
      // Count active clubs/events
      prisma.event?.count({
        where: {
          status: 'ACTIVE',
          startDate: {
            gte: new Date()
          }
        }
      }).catch(() => 0) // Fallback to 0 if table doesn't exist
    ]);

    // Determine which counts to use based on thresholds
    const useRealCounts = {
      circles: circlesCount >= THRESHOLDS.MIN_CIRCLES,
      clubs: clubsCount >= THRESHOLDS.MIN_CLUBS
    };

    // Get fallback counts for the specific role
    const fallbackCounts = FALLBACK_COUNTS[role as keyof typeof FALLBACK_COUNTS] || FALLBACK_COUNTS.GUEST;

    // Return counts with fallback logic
    const counts = {
      circles: useRealCounts.circles ? circlesCount : fallbackCounts.circles,
      clubs: useRealCounts.clubs ? clubsCount : fallbackCounts.clubs,
      // Include metadata about which counts are real vs fallback
      metadata: {
        role,
        thresholds: THRESHOLDS,
        realCounts: {
          circles: circlesCount,
          clubs: clubsCount
        },
        useRealCounts,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      data: counts
    });

  } catch (error) {
    console.error('Error fetching community badge counts:', error);
    
    // Return fallback counts on error
    const role = new URL(request.url).searchParams.get('role') || 'GUEST';
    const fallbackCounts = FALLBACK_COUNTS[role as keyof typeof FALLBACK_COUNTS] || FALLBACK_COUNTS.GUEST;
    
    return NextResponse.json({
      success: true,
      data: {
        ...fallbackCounts,
        metadata: {
          error: true,
          message: 'Using fallback counts due to database error',
          timestamp: new Date().toISOString()
        }
      }
    });
  }
}
