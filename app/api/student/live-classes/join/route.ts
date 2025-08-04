import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/student/live-classes/join - Join a live class session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { liveClassId } = body;

    if (!liveClassId) {
      return NextResponse.json(
        { error: 'Live class ID is required' },
        { status: 400 }
      );
    }

    // Get the live class
    const liveClass = await prisma.videoSession.findUnique({
      where: { id: liveClassId },
    });

    if (!liveClass) {
      return NextResponse.json(
        { error: 'Live class not found' },
        { status: 404 }
      );
    }

    // Check if student is enrolled
    const enrollment = await prisma.videoSessionParticipant.findUnique({
      where: {
        sessionId_userId: {
          sessionId: liveClassId,
          userId: session.user.id,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this live class' },
        { status: 403 }
      );
    }

    // Check if class is currently active (including early access)
    const now = new Date();
    const startTime = new Date(liveClass.startTime);
    const endTime = new Date(liveClass.endTime);
    const earlyAccessTime = new Date(startTime.getTime() - 30 * 60 * 1000); // 30 minutes before

    if (now < earlyAccessTime) {
      return NextResponse.json(
        { error: 'This class has not started yet. Early access is available 30 minutes before the scheduled start time.' },
        { status: 400 }
      );
    }

    if (now > endTime) {
      return NextResponse.json(
        { error: 'This class has already ended' },
        { status: 400 }
      );
    }

    // Check if this is early access
    const isEarlyAccess = now >= earlyAccessTime && now < startTime;

    // Update the enrollment to mark student as active
    const updatedEnrollment = await prisma.videoSessionParticipant.update({
      where: {
        sessionId_userId: {
          sessionId: liveClassId,
          userId: session.user.id,
        },
      },
      data: {
        isActive: true,
        joinedAt: now,
        lastSeen: now,
        updatedAt: now,
      },
    });

    // Log the join action (optional)
    const joinMessage = isEarlyAccess 
      ? `${session.user.name} joined early (30 min before class starts)`
      : `${session.user.name} joined the session`;
      
    await prisma.videoSessionMessage.create({
      data: {
        sessionId: liveClassId,
        userId: session.user.id,
        messageType: 'SYSTEM',
        content: joinMessage,
        timestamp: now,
        isPrivate: false,
      },
    });

    return NextResponse.json({
      message: 'Successfully joined live class',
      enrollment: updatedEnrollment,
      sessionUrl: `/student/live-classes/session/${liveClassId}`,
    });
  } catch (error) {
    console.error('Error joining live class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 