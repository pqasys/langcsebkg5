import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const language = searchParams.get('language');
    const level = searchParams.get('level');
    const sessionType = searchParams.get('sessionType');
    const institutionId = searchParams.get('institutionId');

    const offset = (page - 1) * limit;

    // Determine user access level
    const userAccess = await getUserAccessLevel(session.user.id);
    
    // Build where clause based on user access
    const whereClause: any = {};

    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }

    // Filter by language if provided
    if (language) {
      whereClause.language = language;
    }

    // Filter by level if provided
    if (level) {
      whereClause.level = level;
    }

    // Filter by session type if provided
    if (sessionType) {
      whereClause.sessionType = sessionType;
    }

    // Apply access control based on user type
    if (userAccess.userType === 'FREE') {
      // FREE users cannot access video sessions
      return NextResponse.json({
        success: true,
        sessions: [],
        total: 0,
        page,
        limit,
        message: 'Upgrade to access live classes'
      });
    } else if (userAccess.userType === 'SUBSCRIBER') {
      // SUBSCRIBER users can access platform sessions only
      whereClause.institutionId = null;
    } else if (userAccess.userType === 'INSTITUTION_STUDENT') {
      // INSTITUTION_STUDENT users can access their institution's sessions
      whereClause.institutionId = userAccess.institutionId;
    } else if (userAccess.userType === 'HYBRID') {
      // HYBRID users can access both platform and their institution's sessions
      whereClause.OR = [
        { institutionId: null },
        { institutionId: userAccess.institutionId }
      ];
    } else if (userAccess.userType === 'INSTITUTION_STAFF') {
      // INSTITUTION_STAFF users can access their institution's sessions
      whereClause.institutionId = userAccess.institutionId;
    }

    // Get total count
    const total = await prisma.videoSession.count({
      where: whereClause
    });

    // Get sessions
    const sessions = await prisma.videoSession.findMany({
      where: whereClause,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            participants: true
          }
        }
      },
      orderBy: [
        { startTime: 'asc' },
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit
    });

    // Add user-specific data to each session
    const sessionsWithUserData = sessions.map(session => ({
      ...session,
      isUserParticipant: session.participants.some(p => p.userId === session.user.id),
      canJoin: canUserJoinSession(session, userAccess),
      canManage: canUserManageSession(session, userAccess)
    }));

    return NextResponse.json({
      success: true,
      sessions: sessionsWithUserData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      userAccess: {
        userType: userAccess.userType,
        canCreateSessions: userAccess.userType === 'INSTITUTION_STAFF'
      }
    });

  } catch (error) {
    logger.error('Failed to get video sessions:', error);
    return NextResponse.json(
      { error: 'Failed to get video sessions' },
      { status: 500 }
    );
  }
}

async function getUserAccessLevel(userId: string) {
  try {
    // Check if user is institution staff
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user?.role === 'INSTITUTION') {
      return {
        userType: 'INSTITUTION_STAFF',
        institutionId: user.institutionId
      };
    }

    // Check subscription status
    const subscription = await prisma.studentSubscription.findFirst({
      where: {
        studentId: userId,
        status: 'ACTIVE'
      }
    });

    // Check institution enrollment (using user.institutionId)
    const userWithInstitution = await prisma.user.findUnique({
      where: { id: userId },
      select: { institutionId: true }
    });

    const hasInstitutionEnrollment = !!userWithInstitution?.institutionId;

    if (subscription && hasInstitutionEnrollment) {
      return {
        userType: 'HYBRID',
        institutionId: userWithInstitution.institutionId
      };
    } else if (subscription) {
      return {
        userType: 'SUBSCRIBER'
      };
    } else if (hasInstitutionEnrollment) {
      return {
        userType: 'INSTITUTION_STUDENT',
        institutionId: userWithInstitution.institutionId
      };
    } else {
      return {
        userType: 'FREE'
      };
    }
  } catch (error) {
    logger.error('Error getting user access level:', error);
    return {
      userType: 'FREE'
    };
  }
}

function canUserJoinSession(session: any, userAccess: any): boolean {
  // Check if session is active and not full
  const currentParticipants = session.participants?.length || 0;
  if (session.status !== 'ACTIVE' || currentParticipants >= session.maxParticipants) {
    return false;
  }

  // Check if user is already a participant
  if (session.participants.some((p: any) => p.userId === userAccess.userId)) {
    return false;
  }

  // Check access based on user type
  if (userAccess.userType === 'FREE') {
    return false;
  }

  if (userAccess.userType === 'SUBSCRIBER') {
    return session.institutionId === null;
  }

  if (userAccess.userType === 'INSTITUTION_STUDENT') {
    return session.institutionId === userAccess.institutionId;
  }

  if (userAccess.userType === 'HYBRID') {
    return session.institutionId === null || session.institutionId === userAccess.institutionId;
  }

  if (userAccess.userType === 'INSTITUTION_STAFF') {
    return session.institutionId === userAccess.institutionId;
  }

  return false;
}

function canUserManageSession(session: any, userAccess: any): boolean {
  // Only institution staff can manage sessions
  if (userAccess.userType !== 'INSTITUTION_STAFF') {
    return false;
  }

  // Staff can only manage their institution's sessions
  return session.institutionId === userAccess.institutionId;
} 