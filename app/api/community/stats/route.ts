import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Thresholds for when to show real data vs fallback
const THRESHOLDS = {
  MIN_MEMBERS: 50,
  MIN_CERTIFICATES: 100, // Using test attempts as proxy
  MIN_ACHIEVEMENTS: 75,
  MIN_ACTIVE_TODAY: 10
};

// Fallback values when thresholds aren't met
const FALLBACK_STATS = {
  totalMembers: 1247,
  totalCertificates: 3421, // Using test attempts as proxy
  totalAchievements: 1893,
  activeToday: 156
};

export async function GET() {
  try {
    // Get current date for "active today" calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch real statistics from database with error handling
    let totalMembers = 0;
    let totalCertificates = 0;
    let totalAchievements = 0;
    let activeToday = 0;

    try {
      // Total active community members (students + institutions)
      totalMembers = await prisma.user.count({
        where: {
          OR: [
            { role: 'STUDENT', status: 'ACTIVE' },
            { role: 'INSTITUTION', status: 'ACTIVE', isApproved: true }
          ]
        }
      });
    } catch (error) {
      console.error('Error fetching total members:', error);
    }

    try {
      // Total certificates earned
      totalCertificates = await prisma.certificate.count({
        where: {
          isPublic: true
        }
      });
    } catch (error) {
      console.error('Error fetching total certificates:', error);
    }

    try {
      // Total achievements unlocked (combine both achievement types)
      const [studentAchievements, userAchievements] = await Promise.all([
        prisma.studentAchievement.count(),
        prisma.userAchievement.count()
      ]);
      totalAchievements = studentAchievements + userAchievements;
    } catch (error) {
      console.error('Error fetching total achievements:', error);
    }

    try {
      // Users active today (based on last login or activity)
      activeToday = await prisma.user.count({
        where: {
          OR: [
            { role: 'STUDENT', status: 'ACTIVE' },
            { role: 'INSTITUTION', status: 'ACTIVE', isApproved: true }
          ],
          lastLoginAt: {
            gte: today
          }
        }
      });
    } catch (error) {
      console.error('Error fetching active today:', error);
    }

    // Determine which stats to use based on thresholds
    const useRealStats = {
      totalMembers: totalMembers >= THRESHOLDS.MIN_MEMBERS,
      totalCertificates: totalCertificates >= THRESHOLDS.MIN_CERTIFICATES,
      totalAchievements: totalAchievements >= THRESHOLDS.MIN_ACHIEVEMENTS,
      activeToday: activeToday >= THRESHOLDS.MIN_ACTIVE_TODAY
    };

    // Return stats with fallback logic
    const stats = {
      totalMembers: useRealStats.totalMembers ? totalMembers : FALLBACK_STATS.totalMembers,
      totalCertificates: useRealStats.totalCertificates ? totalCertificates : FALLBACK_STATS.totalCertificates,
      totalAchievements: useRealStats.totalAchievements ? totalAchievements : FALLBACK_STATS.totalAchievements,
      activeToday: useRealStats.activeToday ? activeToday : FALLBACK_STATS.activeToday,
      // Include metadata about which stats are real vs fallback
      metadata: {
        thresholds: THRESHOLDS,
        realStats: {
          totalMembers,
          totalCertificates,
          totalAchievements,
          activeToday
        },
        useRealStats,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching community stats:', error);
    
    // Return fallback stats on error
    return NextResponse.json({
      success: true,
      data: FALLBACK_STATS,
      metadata: {
        error: true,
        message: 'Using fallback stats due to database error',
        timestamp: new Date().toISOString()
      }
    });
  }
}
