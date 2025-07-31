import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/live-classes/[id] - Get a specific live class
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const liveClass = await prisma.videoSession.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
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
    });

    if (!liveClass) {
      return NextResponse.json(
        { error: 'Live class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error('Error fetching live class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/live-classes/[id] - Update a live class
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Check if live class exists
    const existingLiveClass = await prisma.videoSession.findUnique({
      where: { id },
    });

    if (!existingLiveClass) {
      return NextResponse.json(
        { error: 'Live class not found' },
        { status: 404 }
      );
    }

    // Validate instructor if provided
    if (body.instructorId) {
      const instructor = await prisma.user.findUnique({
        where: { id: body.instructorId },
      });

      if (!instructor) {
        return NextResponse.json(
          { error: 'Instructor not found' },
          { status: 404 }
        );
      }
    }

    // Validate institution if provided
    if (body.institutionId) {
      const institution = await prisma.institution.findUnique({
        where: { id: body.institutionId },
      });

      if (!institution) {
        return NextResponse.json(
          { error: 'Institution not found' },
          { status: 404 }
        );
      }
    }

    // Validate course if provided
    if (body.courseId) {
      const course = await prisma.course.findUnique({
        where: { id: body.courseId },
      });

      if (!course) {
        return NextResponse.json(
          { error: 'Course not found' },
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
        institutionId: body.institutionId,
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
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(updatedLiveClass);
  } catch (error) {
    console.error('Error updating live class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/live-classes/[id] - Delete a live class
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if live class exists
    const existingLiveClass = await prisma.videoSession.findUnique({
      where: { id },
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