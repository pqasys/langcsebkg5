import { NextResponse } from 'next/server';
import { prisma, performWarmup } from '@/lib/server-warmup';
import { apiCache, APICache } from '@/lib/api-cache';
import { isBuildTime } from '@/lib/build-error-handler';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Helper function to get stats with retry logic
async function getStatsWithRetry(maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Ensure database is warmed up
      await performWarmup();

      // Get counts from database
      const [students, institutions, courses, languages] = await Promise.all([
        prisma.user.count({
          where: { 
            role: 'STUDENT',
            status: 'ACTIVE'
          }
        }),
        prisma.institution.count({
          where: { 
            isApproved: true,
            status: 'ACTIVE'
          }
        }),
        prisma.course.count({
          where: { 
            status: 'PUBLISHED'
          }
        }),
        // Count unique frameworks from courses (since there's no language field)
        prisma.course.groupBy({
          by: ['framework'],
          where: {
            status: 'published'
          }
        }).then(result => result.length)
      ]);

      return { students, institutions, courses, languages };
    } catch (error) {
      console.error(`Stats fetch attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json({
        students: 0,
        institutions: 0,
        courses: 0,
        languages: 0,
        _fallback: true,
        _buildTime: true
      });
    }

    // Check cache first
    const cacheKey = APICache.getStatsKey();
    const cachedStats = apiCache.get(cacheKey);
    
    if (cachedStats) {
      return NextResponse.json(cachedStats);
    }

    const stats = await getStatsWithRetry();
    
    // Cache the result for 5 minutes
    apiCache.set(cacheKey, stats, 5 * 60 * 1000);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats after retries:', error);
    
    // Return fallback values instead of error
    // This prevents the frontend from showing zeros and allows for graceful degradation
    return NextResponse.json({
      students: 0,
      institutions: 0,
      courses: 0,
      languages: 0,
      _fallback: true, // Flag to indicate this is fallback data
      _error: error instanceof Error ? error.message : 'Database connection failed'
    });
  }
} 