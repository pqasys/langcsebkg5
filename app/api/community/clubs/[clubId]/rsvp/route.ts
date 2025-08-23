import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { clubId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clubId = params.clubId;

    // Check if video session exists and is public
    const videoSession = await prisma.videoSession.findUnique({
      where: { id: clubId },
      include: {
        participants: true
      }
    });

    if (!videoSession) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    if (!videoSession.isPublic) {
      return NextResponse.json({ error: 'This club is not public' }, { status: 403 });
    }

    // Check if session is in the future
    if (new Date(videoSession.startTime) <= new Date()) {
      return NextResponse.json({ error: 'Cannot RSVP to past sessions' }, { status: 400 });
    }

    // Check if user is already a participant
    const existingParticipation = videoSession.participants.find(
      p => p.userId === session.user.id
    );

    if (existingParticipation) {
      return NextResponse.json({ error: 'Already RSVPed to this club' }, { status: 400 });
    }

    // Check capacity
    if (videoSession.participants.length >= videoSession.maxParticipants) {
      return NextResponse.json({ error: 'Club is at full capacity' }, { status: 400 });
    }

    // Add user as participant
    await prisma.videoSessionParticipant.create({
      data: {
        sessionId: clubId,
        userId: session.user.id,
        role: 'PARTICIPANT',
        status: 'CONFIRMED'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully RSVPed to club'
    });

  } catch (error) {
    console.error('Error RSVPing to club:', error);
    return NextResponse.json(
      { error: 'Failed to RSVP to club' },
      { status: 500 }
    );
  }
}


