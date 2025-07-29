import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTITUTION' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify the course belongs to the institution
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: session.user.institutionId || undefined,
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Verify the module exists and belongs to the course
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id,
      },
    });

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Get video sessions for this module
    const sessions = await prisma.videoSession.findMany({
      where: {
        moduleId: params.moduleId,
        institutionId: session.user.institutionId || undefined,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Failed to fetch module video sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video sessions' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTITUTION' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify the course belongs to the institution
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: session.user.institutionId || undefined,
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Verify the module exists and belongs to the course
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id,
      },
    });

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      description,
      sessionType,
      language,
      level,
      startTime,
      endTime,
      duration,
      maxParticipants,
      price,
      isPublic,
      isRecorded,
      instructorId,
    } = body;

    // Validate required fields
    if (!title || !sessionType || !language || !level || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create video session
    const videoSession = await prisma.videoSession.create({
      data: {
        title,
        description,
        sessionType,
        language,
        level,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: duration || 60,
        maxParticipants: maxParticipants || 10,
        price: price || 0,
        isPublic: isPublic || false,
        isRecorded: isRecorded || false,
        status: 'SCHEDULED',
        instructorId: instructorId || session.user.id,
        moduleId: params.moduleId,
        courseId: params.id,
        institutionId: session.user.institutionId || undefined,
      },
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

    return NextResponse.json({
      success: true,
      session: videoSession,
    });
  } catch (error) {
    console.error('Failed to create module video session:', error);
    return NextResponse.json(
      { error: 'Failed to create video session' },
      { status: 500 }
    );
  }
} 