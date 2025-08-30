import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if we're viewing our own achievements or someone else's
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId') || session.user.id;
    const isOwnProfile = targetUserId === session.user.id;

    // Get all types of achievements for the user
    const [studentAchievements, connectionAchievements, userAchievements] = await Promise.all([
      // Student achievements (course-based)
      prisma.studentAchievement.findMany({
        where: { 
          studentId: targetUserId,
          ...(isOwnProfile ? {} : { isPublic: true }) // Only show public achievements for others
        },
        orderBy: { earnedAt: 'desc' },
        take: 10
      }).catch(() => []), // Handle if table doesn't exist

      // Connection achievements (social-based)
      prisma.connectionAchievement.findMany({
        where: { 
          userId: targetUserId,
          ...(isOwnProfile ? {} : { isPublic: true }) // Only show public achievements for others
        },
        orderBy: { earnedAt: 'desc' },
        take: 10
      }).catch(() => []), // Handle if table doesn't exist

      // User achievements (certificate-based)
      prisma.userAchievement.findMany({
        where: { 
          userId: targetUserId,
          ...(isOwnProfile ? {} : { isPublic: true }) // Only show public achievements for others
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }).catch(() => []) // Handle if table doesn't exist
    ]);

    // Combine and format all achievements
    const allAchievements = [
      ...studentAchievements.map(achievement => ({
        id: achievement.id,
        title: achievement.achievement || 'Course Achievement',
        description: achievement.metadata?.description || 'Achievement earned through course completion',
        icon: achievement.metadata?.icon || '🎓',
        unlockedAt: achievement.earnedAt,
        achievementType: 'course',
        source: 'StudentAchievement',
        isPublic: achievement.isPublic || false
      })),
      ...connectionAchievements.map(achievement => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description || 'Achievement earned through social connections',
        icon: achievement.icon || '🤝',
        unlockedAt: achievement.earnedAt,
        achievementType: 'connection',
        source: 'ConnectionAchievement',
        isPublic: achievement.isPublic || false
      })),
      ...userAchievements.map(achievement => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description || 'Achievement earned through certificates',
        icon: achievement.icon || '🏆',
        unlockedAt: achievement.createdAt,
        achievementType: 'certificate',
        source: 'UserAchievement',
        isPublic: achievement.isPublic || false
      }))
    ];

    // Sort by unlock date (most recent first)
    allAchievements.sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());

    // Return top 10 achievements
    return NextResponse.json(allAchievements.slice(0, 10));
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 