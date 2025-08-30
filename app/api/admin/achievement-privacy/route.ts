import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isBuildTime } from '@/lib/build-error-handler';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Get users with their achievement privacy statistics
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      where: {
        role: 'STUDENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        social_visibility: true,
        createdAt: true,
        _count: {
          select: {
            certificates: true,
            studentAchievements: true,
            connectionAchievements: true,
            userAchievements: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get privacy statistics for each user
    const usersWithPrivacyStats = await Promise.all(
      users.map(async (user) => {
        const [publicCertificates, publicCourseAchievements, publicConnectionAchievements, publicQuizAchievements] = await Promise.all([
          prisma.certificate.count({
            where: { userId: user.id, isPublic: true }
          }),
          prisma.studentAchievement.count({
            where: { studentId: user.id, isPublic: true }
          }),
          prisma.connectionAchievement.count({
            where: { userId: user.id, isPublic: true }
          }),
          prisma.userAchievement.count({
            where: { 
              userId: user.id, 
              isPublic: true,
              type: { not: 'certificate' }
            }
          })
        ]);

        return {
          ...user,
          privacyStats: {
            publicCertificates,
            publicCourseAchievements,
            publicConnectionAchievements,
            publicQuizAchievements,
            totalCertificates: user._count.certificates,
            totalCourseAchievements: user._count.studentAchievements,
            totalConnectionAchievements: user._count.connectionAchievements,
            totalQuizAchievements: user._count.userAchievements
          }
        };
      })
    );

    // Get total count for pagination
    const total = await prisma.user.count({
      where: { role: 'STUDENT' }
    });

    return NextResponse.json({
      success: true,
      users: usersWithPrivacyStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching achievement privacy data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievement privacy data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action, achievementType } = body;

    if (!userId || !action || !achievementType) {
      return NextResponse.json({ 
        error: 'User ID, action, and achievement type are required' 
      }, { status: 400 });
    }

    let isPublic = false;
    if (action === 'make_public') {
      isPublic = true;
    } else if (action === 'make_private') {
      isPublic = false;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update privacy settings based on achievement type
    switch (achievementType) {
      case 'certificates':
        await prisma.certificate.updateMany({
          where: { userId },
          data: { isPublic }
        });
        break;
      case 'course_achievements':
        await prisma.studentAchievement.updateMany({
          where: { studentId: userId },
          data: { isPublic }
        });
        break;
      case 'connection_achievements':
        await prisma.connectionAchievement.updateMany({
          where: { userId },
          data: { isPublic }
        });
        break;
      case 'quiz_achievements':
        await prisma.userAchievement.updateMany({
          where: { 
            userId,
            type: { not: 'certificate' }
          },
          data: { isPublic }
        });
        break;
      case 'all':
        await Promise.all([
          prisma.certificate.updateMany({
            where: { userId },
            data: { isPublic }
          }),
          prisma.studentAchievement.updateMany({
            where: { studentId: userId },
            data: { isPublic }
          }),
          prisma.connectionAchievement.updateMany({
            where: { userId },
            data: { isPublic }
          }),
          prisma.userAchievement.updateMany({
            where: { userId },
            data: { isPublic }
          })
        ]);
        break;
      default:
        return NextResponse.json({ error: 'Invalid achievement type' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true,
      message: `Successfully ${action === 'make_public' ? 'made public' : 'made private'} ${achievementType} for user`
    });

  } catch (error) {
    console.error('Error updating achievement privacy:', error);
    return NextResponse.json(
      { error: 'Failed to update achievement privacy' },
      { status: 500 }
    );
  }
}
