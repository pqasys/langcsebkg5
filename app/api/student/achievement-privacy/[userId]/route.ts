import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isBuildTime } from '@/lib/build-error-handler';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json({
        settings: {
          certificates: false,
          courseAchievements: false,
          connectionAchievements: false,
          quizAchievements: false,
          overallProfile: 'PRIVATE'
        }
      });
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only access their own privacy settings
    if (session.user.id !== params.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get user's profile to check overall visibility
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { social_visibility: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get privacy settings for different achievement types
    const [certificates, courseAchievements, connectionAchievements, quizAchievements] = await Promise.all([
      // Check if user has any public certificates
      prisma.certificate.findFirst({
        where: { 
          userId: params.userId,
          isPublic: true 
        }
      }).then(result => !!result),

      // Check if user has any public course achievements
      prisma.studentAchievement.findFirst({
        where: { 
          studentId: params.userId,
          isPublic: true 
        }
      }).then(result => !!result),

      // Check if user has any public connection achievements
      prisma.connectionAchievement.findFirst({
        where: { 
          userId: params.userId,
          isPublic: true 
        }
      }).then(result => !!result),

      // Check if user has any public quiz achievements (UserAchievement)
      prisma.userAchievement.findFirst({
        where: { 
          userId: params.userId,
          isPublic: true,
          type: { not: 'certificate' } // Exclude certificate-related achievements
        }
      }).then(result => !!result)
    ]);

    const settings = {
      certificates,
      courseAchievements,
      connectionAchievements,
      quizAchievements,
      overallProfile: user.social_visibility || 'PRIVATE'
    };

    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Error fetching achievement privacy settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch privacy settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only update their own privacy settings
    if (session.user.id !== params.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { certificates, courseAchievements, connectionAchievements, quizAchievements, overallProfile } = body;

    // Update overall profile visibility if provided
    if (overallProfile) {
      await prisma.user.update({
        where: { id: params.userId },
        data: { social_visibility: overallProfile }
      });
    }

    // Update certificate privacy settings
    if (typeof certificates === 'boolean') {
      await prisma.certificate.updateMany({
        where: { userId: params.userId },
        data: { isPublic: certificates }
      });
    }

    // Update course achievement privacy settings
    if (typeof courseAchievements === 'boolean') {
      await prisma.studentAchievement.updateMany({
        where: { studentId: params.userId },
        data: { isPublic: courseAchievements }
      });
    }

    // Update connection achievement privacy settings
    if (typeof connectionAchievements === 'boolean') {
      await prisma.connectionAchievement.updateMany({
        where: { userId: params.userId },
        data: { isPublic: connectionAchievements }
      });
    }

    // Update quiz achievement privacy settings
    if (typeof quizAchievements === 'boolean') {
      await prisma.userAchievement.updateMany({
        where: { 
          userId: params.userId,
          type: { not: 'certificate' } // Exclude certificate-related achievements
        },
        data: { isPublic: quizAchievements }
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Privacy settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating achievement privacy settings:', error);
    return NextResponse.json(
      { error: 'Failed to update privacy settings' },
      { status: 500 }
    );
  }
}
