import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/student/live-classes/[id] - Get a specific live class
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const liveClassId = params.id;

    // Get the live class with instructor details
    const liveClass = await prisma.videoSession.findUnique({
      where: { id: liveClassId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
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

    // Format the response
    const formattedLiveClass = {
      id: liveClass.id,
      title: liveClass.title,
      description: liveClass.description,
      sessionType: liveClass.sessionType,
      language: liveClass.language,
      level: liveClass.level,
      startTime: liveClass.startTime,
      endTime: liveClass.endTime,
      duration: liveClass.duration,
      maxParticipants: liveClass.maxParticipants,
      price: liveClass.price,
      currency: liveClass.currency,
      status: liveClass.status,
      sessionUrl: `/student/live-classes/session/${liveClass.id}`,
      instructor: liveClass.instructor,
      isEnrolled: !!enrollment,
      enrollment: enrollment ? {
        id: enrollment.id,
        role: enrollment.role,
        joinedAt: enrollment.joinedAt,
        isActive: enrollment.isActive,
      } : undefined,
    };

    return NextResponse.json({
      liveClass: formattedLiveClass,
    });
  } catch (error) {
    console.error('Error fetching live class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 