import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = params.id;
    const body = await request.json();
    const {
      title,
      description,
      sessionType,
      language,
      level,
      maxParticipants,
      startTime,
      endTime,
      duration,
      price,
      isPublic,
      isRecorded,
      allowChat,
      allowScreenShare,
      allowRecording,
      courseId,
      moduleId
    } = body;

    // Get the video session
    const videoSession = await prisma.videoSession.findUnique({
      where: { id: sessionId },
      include: {
        instructor: true,
        host: true
      }
    });

    if (!videoSession) {
      return NextResponse.json({ error: 'Video session not found' }, { status: 404 });
    }

    // Check if user can manage this session
    const canManage = await checkUserCanManageSession(session.user.id, videoSession);
    if (!canManage) {
      return NextResponse.json({ error: 'You do not have permission to update this session' }, { status: 403 });
    }

    // Check if session has already started
    if (videoSession.status === 'ACTIVE' || videoSession.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Cannot update a session that has already started' }, { status: 400 });
    }

    // Validate required fields
    if (!title || !sessionType || !language || !level || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate time constraints
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    const now = new Date();

    if (startTimeDate <= now) {
      return NextResponse.json({ error: 'Start time must be in the future' }, { status: 400 });
    }

    if (endTimeDate <= startTimeDate) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
    }

    // Update the session
    const updatedSession = await prisma.videoSession.update({
      where: { id: sessionId },
      data: {
        title: title.trim(),
        description: description?.trim(),
        sessionType,
        language,
        level,
        maxParticipants: maxParticipants || 10,
        startTime: startTimeDate,
        endTime: endTimeDate,
        duration: duration || Math.floor((endTimeDate.getTime() - startTimeDate.getTime()) / (1000 * 60)),
        price: price || 0,
        isPublic: isPublic || false,
        isRecorded: isRecorded || false,
        allowChat: allowChat || true,
        allowScreenShare: allowScreenShare || true,
        allowRecording: allowRecording || false,
        courseId: courseId || null,
        moduleId: moduleId || null,
        updatedAt: new Date()
      },
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
        }
      }
    });

    logger.info(`User ${session.user.id} updated video session ${sessionId}`);

    return NextResponse.json({
      success: true,
      session: updatedSession,
      message: 'Video session updated successfully'
    });

  } catch (error) {
    logger.error('Failed to update video session:', error);
    return NextResponse.json(
      { error: 'Failed to update video session' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
        participants: true,
        bookings: true
      }
    });

    if (!videoSession) {
      return NextResponse.json({ error: 'Video session not found' }, { status: 404 });
    }

    // Check if user can manage this session
    const canManage = await checkUserCanManageSession(session.user.id, videoSession);
    if (!canManage) {
      return NextResponse.json({ error: 'You do not have permission to delete this session' }, { status: 403 });
    }

    // Check if session has already started
    if (videoSession.status === 'ACTIVE' || videoSession.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Cannot delete a session that has already started' }, { status: 400 });
    }

    // Check if there are active participants or bookings
    if (videoSession.participants.length > 0) {
      return NextResponse.json({ error: 'Cannot delete a session with active participants' }, { status: 400 });
    }

    if (videoSession.bookings.length > 0) {
      return NextResponse.json({ error: 'Cannot delete a session with active bookings' }, { status: 400 });
    }

    // Delete the session
    await prisma.videoSession.delete({
      where: { id: sessionId }
    });

    logger.info(`User ${session.user.id} deleted video session ${sessionId}`);

    return NextResponse.json({
      success: true,
      message: 'Video session deleted successfully'
    });

  } catch (error) {
    logger.error('Failed to delete video session:', error);
    return NextResponse.json(
      { error: 'Failed to delete video session' },
      { status: 500 }
    );
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