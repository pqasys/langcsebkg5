import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = params.id;

    // Find the participant
    const participant = await prisma.videoSessionParticipant.findFirst({
      where: {
        sessionId,
        userId: session.user.id,
        status: 'JOINED'
      },
      include: {
        session: true
      }
    });

    if (!participant) {
      return NextResponse.json({ error: 'You are not a participant in this session' }, { status: 404 });
    }

    // Check if session is active
    if (participant.session.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Session is not active' }, { status: 400 });
    }

    // Calculate duration in session
    const joinedAt = participant.joinedAt;
    const leftAt = new Date();
    const duration = Math.floor((leftAt.getTime() - joinedAt.getTime()) / 1000); // in seconds

    // Update participant status
    await prisma.videoSessionParticipant.update({
      where: { id: participant.id },
      data: {
        leftAt,
        duration,
        status: 'LEFT'
      }
    });

    // Note: currentParticipants is calculated dynamically from participants array
    // No need to update it manually

    logger.info(`User ${session.user.id} left video session ${sessionId} after ${duration} seconds`);

    return NextResponse.json({
      success: true,
      message: 'Successfully left video session',
      duration
    });

  } catch (error) {
    logger.error('Failed to leave video session:', error);
    return NextResponse.json(
      { error: 'Failed to leave video session' },
      { status: 500 }
    );
  }
} 