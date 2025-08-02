import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = params.id;

    // Get the video session
    const videoSession = await prisma.videoSession.findUnique({
      where: { id: sessionId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          },
          orderBy: {
            joinedAt: 'asc'
          }
        }
      }
    });

    if (!videoSession) {
      return NextResponse.json({ error: 'Video session not found' }, { status: 404 });
    }

    // Check if user has access to view participants
    const hasAccess = await checkUserAccess(session.user.id, videoSession);
    if (!hasAccess) {
      return NextResponse.json({ 
        error: 'You do not have access to view this video session' 
      }, { status: 403 });
    }

    // Filter participants based on user's access level
    let participants = videoSession.participants;

    // If user is not a participant, only show basic info
    const isParticipant = videoSession.participants.some(p => p.userId === session.user.id);
    const canManage = await checkUserCanManageSession(session.user.id, videoSession);
    
    if (!isParticipant && !canManage) {
      participants = participants.map(p => ({
        ...p,
        user: {
          id: p.user.id,
          name: p.user.name,
          image: p.user.image
          // Don't include email for non-participants
        }
      }));
    }

    return NextResponse.json({
      success: true,
      participants,
      total: participants.length,
      session: {
        id: videoSession.id,
        title: videoSession.title,
        status: videoSession.status,
        currentParticipants: videoSession.participants?.length || 0,
        maxParticipants: videoSession.maxParticipants,
        startTime: videoSession.startTime,
        endTime: videoSession.endTime
      }
    });

  } catch (error) {
    logger.error('Failed to get video session participants:', error);
    return NextResponse.json(
      { error: 'Failed to get video session participants' },
      { status: 500 }
    );
  }
}

async function checkUserAccess(userId: string, videoSession: any): Promise<boolean> {
  try {
    // Host and instructor can always view participants
    if (videoSession.hostId === userId || videoSession.instructorId === userId) {
      return true;
    }

    // Check if user is a participant
    const isParticipant = videoSession.participants.some(p => p.userId === userId);
    if (isParticipant) {
      return true;
    }

    // Check if user has active subscription
    const subscription = await prisma.studentSubscription.findFirst({
      where: {
        studentId: userId,
        status: 'ACTIVE'
      }
    });

    if (subscription) {
      return true;
    }

    // Check if user has institution enrollment
    const userWithInstitution = await prisma.user.findUnique({
      where: { id: userId },
      select: { institutionId: true }
    });
    const enrollment = userWithInstitution?.institutionId ? { institution_id: userWithInstitution.institutionId } : null;

    if (enrollment) {
      return true;
    }

    // Check if user is institution staff
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user?.role === 'INSTITUTION') {
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Error checking user access:', error);
    return false;
  }
}

async function checkUserCanManageSession(userId: string, videoSession: any): Promise<boolean> {
  try {
    // Check if user is the host or instructor
    if (videoSession.hostId === userId || videoSession.instructorId === userId) {
      return true;
    }

    // Check if user is institution staff for this institution
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user?.role === 'INSTITUTION' && user.institutionId === videoSession.institutionId) {
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Error checking user can manage session:', error);
    return false;
  }
} 