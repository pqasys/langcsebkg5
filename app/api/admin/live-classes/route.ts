import { NextRequest, NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/live-classes - List all live classes with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const language = searchParams.get('language');
    const level = searchParams.get('level');
    const institutionId = searchParams.get('institutionId');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (status) where.status = status;
    if (language) where.language = language;
    if (level) where.level = level;
    if (institutionId) where.institutionId = institutionId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.videoSession.count({ where });

    // Get live classes with basic details first
    const liveClasses = await prisma.videoSession.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        participants: {
          select: {
            id: true,
            userId: true,
            role: true,
            joinedAt: true,
            leftAt: true,
            isActive: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
      skip,
      take: limit,
    });

    // Fetch instructor and institution details separately
    const instructorIds = [...new Set(liveClasses.map(session => session.instructorId))];
    const institutionIds = [...new Set(liveClasses.map(session => session.institutionId).filter(Boolean))];

    const [instructors, institutions] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: instructorIds } },
        select: { id: true, name: true, email: true },
      }),
      institutionIds.length > 0 ? prisma.institution.findMany({
        where: { id: { in: institutionIds } },
        select: { id: true, name: true },
      }) : []
    ]);

    // Create lookup maps
    const instructorMap = new Map(instructors.map(instructor => [instructor.id, instructor]));
    const institutionMap = new Map(institutions.map(institution => [institution.id, institution]));

    // Combine the data
    const liveClassesWithDetails = liveClasses.map(session => ({
      ...session,
      instructor: instructorMap.get(session.instructorId),
      institution: session.institutionId ? institutionMap.get(session.institutionId) : null,
    }));

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

// POST /api/admin/live-classes - Create a new live class
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
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
      institutionId,
      courseId,
      moduleId,
      features,
      tags,
      materials,
      rating,
      reviews,
    } = body;

    // Validate required fields
    if (!title || !sessionType || !language || !level || !startTime || !endTime || !instructorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate instructor exists
    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    // Validate institution if provided
    if (institutionId) {
      const institution = await prisma.institution.findUnique({
        where: { id: institutionId },
      });

      if (!institution) {
        return NextResponse.json(
          { error: 'Institution not found' },
          { status: 404 }
        );
      }
    }

    // Enforce: All sessions must be linked to a course (directly or via module)
    if (!courseId && !moduleId) {
      return NextResponse.json(
        { error: 'A courseId or moduleId is required to create a live class' },
        { status: 400 }
      );
    }

    // Validate course if provided
    if (courseId) {
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) {
        return NextResponse.json(
          { error: 'Course not found' },
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
        institutionId,
        courseId,
        moduleId,
        features: features ? JSON.parse(JSON.stringify(features)) : null,
        tags: tags ? JSON.parse(JSON.stringify(tags)) : null,
        materials: materials ? JSON.parse(JSON.stringify(materials)) : null,
        rating: typeof rating === 'number' ? rating : null,
        reviews: typeof reviews === 'number' ? reviews : 0,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Fetch instructor and institution details separately
    const [instructorDetails, institutionDetails] = await Promise.all([
      prisma.user.findUnique({
        where: { id: instructorId },
        select: { id: true, name: true, email: true },
      }),
      institutionId ? prisma.institution.findUnique({
        where: { id: institutionId },
        select: { id: true, name: true },
      }) : null
    ]);

    // Combine the data
    const liveClassWithDetails = {
      ...liveClass,
      instructor: instructorDetails,
      institution: institutionDetails,
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