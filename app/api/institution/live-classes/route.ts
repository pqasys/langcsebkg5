import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/institution/live-classes - List live classes for the institution
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'INSTITUTION_STAFF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const language = searchParams.get('language');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause - only show classes for this institution
    const where: any = {
      institutionId: session.user.institutionId,
    };
    
    if (status) where.status = status;
    if (language) where.language = language;
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.videoSession.count({ where });

    // Get live classes
    const liveClasses = await prisma.videoSession.findMany({
      where,
      orderBy: { startTime: 'desc' },
      skip,
      take: limit,
    });

    // Get instructor and course details separately
    const liveClassesWithDetails = await Promise.all(
      liveClasses.map(async (liveClass) => {
        const [instructor, course, participants] = await Promise.all([
          prisma.user.findUnique({
            where: { id: liveClass.instructorId },
            select: { id: true, name: true, email: true },
          }),
          liveClass.courseId ? prisma.course.findUnique({
            where: { id: liveClass.courseId },
            select: { id: true, title: true },
          }) : null,
          prisma.videoSessionParticipant.findMany({
            where: { sessionId: liveClass.id },
            select: { id: true, userId: true, role: true, joinedAt: true, leftAt: true, isActive: true },
          }),
        ]);

        return {
          ...liveClass,
          instructor,
          course,
          participants,
        };
      })
    );

    return NextResponse.json({
      liveClasses: liveClassesWithDetails,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching live classes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { LiveClassGovernanceService } from '@/lib/live-class-governance-service';

// POST /api/institution/live-classes - Create a new live class for the institution
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'INSTITUTION_STAFF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      currency,
      isPublic,
      isRecorded,
      allowChat,
      allowScreenShare,
      allowRecording,
      instructorId,
      courseId,
      moduleId,
      features,
      tags,
      materials,
    } = body;

    // Enforce: All sessions must be linked to a course (directly or via module)
    if (!courseId && !moduleId) {
      return NextResponse.json(
        { error: 'A courseId or moduleId is required to create a live class' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!title || !sessionType || !language || !level || !startTime || !endTime || !instructorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use governance service to create live class
    const sessionData = {
      title,
      description,
      sessionType,
      language,
      level,
      maxParticipants: maxParticipants || 10,
      startTime,
      endTime,
      duration: duration || Math.ceil((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)),
      price: price || 0,
      currency: currency || 'USD',
      isPublic: isPublic || false,
      isRecorded: isRecorded || false,
      allowChat: allowChat !== false,
      allowScreenShare: allowScreenShare !== false,
      allowRecording: allowRecording || false,
      instructorId,
      institutionId: session.user.institutionId,
      courseId,
      moduleId,
      features: features ? JSON.parse(JSON.stringify(features)) : null,
      tags: tags ? JSON.parse(JSON.stringify(tags)) : null,
      materials: materials ? JSON.parse(JSON.stringify(materials)) : null,
    };

    const result = await LiveClassGovernanceService.createLiveClassWithGovernance(sessionData);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Live class creation failed',
          details: result.errors
        },
        { status: 400 }
      );
    }

    // Get the created live class with details
    const liveClass = await prisma.videoSession.findUnique({
      where: { id: result.sessionId },
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        },
        course: {
          select: { id: true, title: true }
        }
      }
    });

    const response: any = { ...liveClass };
    
    if (result.warnings) {
      response.warnings = result.warnings;
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating live class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 