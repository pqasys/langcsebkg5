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

    // Validate required fields
    if (!title || !sessionType || !language || !level || !startTime || !endTime || !instructorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate instructor exists and belongs to this institution
    const instructor = await prisma.user.findFirst({
      where: {
        id: instructorId,
        institutionId: session.user.institutionId,
        role: 'INSTRUCTOR',
      },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found or not associated with this institution' },
        { status: 404 }
      );
    }

    // Validate course if provided (must belong to this institution)
    if (courseId) {
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          institutionId: session.user.institutionId,
        },
      });

      if (!course) {
        return NextResponse.json(
          { error: 'Course not found or not associated with this institution' },
          { status: 404 }
        );
      }
    }

    // Create the live class
    const liveClass = await prisma.videoSession.create({
      data: {
        title,
        description,
        sessionType,
        language,
        level,
        maxParticipants: maxParticipants || 10,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: duration || Math.ceil((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)),
        price: price || 0,
        currency: currency || 'USD',
        isPublic: isPublic || false,
        isRecorded: isRecorded || false,
        allowChat: allowChat !== false,
        allowScreenShare: allowScreenShare !== false,
        allowRecording: allowRecording || false,
        instructorId,
        institutionId: session.user.institutionId, // Always set to current institution
        courseId,
        moduleId,
        features: features ? JSON.parse(JSON.stringify(features)) : null,
        tags: tags ? JSON.parse(JSON.stringify(tags)) : null,
        materials: materials ? JSON.parse(JSON.stringify(materials)) : null,
      },
    });

    // Get instructor and course details
    const [instructorDetails, courseDetails] = await Promise.all([
      prisma.user.findUnique({
        where: { id: liveClass.instructorId },
        select: { id: true, name: true, email: true },
      }),
      liveClass.courseId ? prisma.course.findUnique({
        where: { id: liveClass.courseId },
        select: { id: true, title: true },
      }) : null,
    ]);

    const liveClassWithDetails = {
      ...liveClass,
      instructor: instructorDetails,
      course: courseDetails,
    };

    return NextResponse.json(liveClassWithDetails, { status: 201 });
  } catch (error) {
    console.error('Error creating live class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 