import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/institution/live-classes/[id] - Get a specific live class for the institution
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'INSTITUTION_STAFF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const liveClass = await prisma.videoSession.findFirst({
      where: { 
        id,
        institutionId: session.user.institutionId, // Ensure it belongs to this institution
      },
    });

    if (!liveClass) {
      return NextResponse.json(
        { error: 'Live class not found' },
        { status: 404 }
      );
    }

    // Get instructor and course details
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
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    const liveClassWithDetails = {
      ...liveClass,
      instructor,
      course,
      participants,
    };

    return NextResponse.json(liveClassWithDetails);
  } catch (error) {
    console.error('Error fetching live class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/institution/live-classes/[id] - Update a live class for the institution
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'INSTITUTION_STAFF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Check if live class exists and belongs to this institution
    const existingLiveClass = await prisma.videoSession.findFirst({
      where: { 
        id,
        institutionId: session.user.institutionId,
      },
    });

    if (!existingLiveClass) {
      return NextResponse.json(
        { error: 'Live class not found' },
        { status: 404 }
      );
    }

    // Validate instructor if provided (must belong to this institution)
    if (body.instructorId) {
      const instructor = await prisma.user.findFirst({
        where: {
          id: body.instructorId,
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
    }

    // Validate course if provided (must belong to this institution)
    if (body.courseId) {
      const course = await prisma.course.findFirst({
        where: {
          id: body.courseId,
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

    // Update the live class
    const updatedLiveClass = await prisma.videoSession.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        sessionType: body.sessionType,
        language: body.language,
        level: body.level,
        maxParticipants: body.maxParticipants,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        duration: body.duration,
        price: body.price,
        currency: body.currency,
        isPublic: body.isPublic,
        isRecorded: body.isRecorded,
        allowChat: body.allowChat,
        allowScreenShare: body.allowScreenShare,
        allowRecording: body.allowRecording,
        instructorId: body.instructorId,
        courseId: body.courseId,
        moduleId: body.moduleId,
        features: body.features ? JSON.parse(JSON.stringify(body.features)) : undefined,
        tags: body.tags ? JSON.parse(JSON.stringify(body.tags)) : undefined,
        materials: body.materials ? JSON.parse(JSON.stringify(body.materials)) : undefined,
        rating: body.rating,
        reviews: body.reviews,
        isBooked: body.isBooked,
        isCompleted: body.isCompleted,
        isCancelled: body.isCancelled,
      },
    });

    // Get instructor and course details
    const [instructor, course] = await Promise.all([
      prisma.user.findUnique({
        where: { id: updatedLiveClass.instructorId },
        select: { id: true, name: true, email: true },
      }),
      updatedLiveClass.courseId ? prisma.course.findUnique({
        where: { id: updatedLiveClass.courseId },
        select: { id: true, title: true },
      }) : null,
    ]);

    const updatedLiveClassWithDetails = {
      ...updatedLiveClass,
      instructor,
      course,
    };

    return NextResponse.json(updatedLiveClassWithDetails);
  } catch (error) {
    console.error('Error updating live class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/institution/live-classes/[id] - Delete a live class for the institution
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'INSTITUTION_STAFF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if live class exists and belongs to this institution
    const existingLiveClass = await prisma.videoSession.findFirst({
      where: { 
        id,
        institutionId: session.user.institutionId,
      },
      include: {
        participants: true,
      },
    });

    if (!existingLiveClass) {
      return NextResponse.json(
        { error: 'Live class not found' },
        { status: 404 }
      );
    }

    // Check if there are participants (prevent deletion if class has participants)
    if (existingLiveClass.participants.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete live class with participants. Please cancel the class instead.' },
        { status: 400 }
      );
    }

    // Delete the live class
    await prisma.videoSession.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Live class deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting live class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 