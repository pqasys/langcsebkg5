import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/student/live-classes/enroll - Enroll in a live class
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

    // Check if class is available for enrollment
    if (liveClass.status !== 'SCHEDULED') {
      return NextResponse.json(
        { error: 'Live class is not available for enrollment' },
        { status: 400 }
      );
    }

    // Check if class is in the future
    if (new Date(liveClass.startTime) <= new Date()) {
      return NextResponse.json(
        { error: 'Cannot enroll in a live class that has already started' },
        { status: 400 }
      );
    }

    // Check if student is already enrolled
    const existingEnrollment = await prisma.videoSessionParticipant.findUnique({
      where: {
        sessionId_userId: {
          sessionId: liveClassId,
          userId: session.user.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'You are already enrolled in this live class' },
        { status: 400 }
      );
    }

    // Check if class is at capacity
    const currentParticipants = await prisma.videoSessionParticipant.count({
      where: { sessionId: liveClassId },
    });

    if (currentParticipants >= liveClass.maxParticipants) {
      return NextResponse.json(
        { error: 'Live class is at maximum capacity' },
        { status: 400 }
      );
    }

    // Check student's access based on subscription and institution enrollment
    const [studentSubscription, user] = await Promise.all([
      prisma.studentSubscription.findUnique({
        where: { studentId: session.user.id },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { institutionId: true },
      }),
    ]);

    // Determine access level
    const hasSubscription = studentSubscription?.status === 'ACTIVE';
    const hasInstitutionAccess = user?.institutionId && liveClass.institutionId === user.institutionId;

    // Check if student has access to this live class
    if (!hasSubscription && !hasInstitutionAccess) {
      return NextResponse.json(
        { error: 'You need a subscription or institution enrollment to enroll in this live class' },
        { status: 403 }
      );
    }

    // If it's an institution class, verify the student is enrolled in that institution
    if (liveClass.institutionId && !hasInstitutionAccess) {
      return NextResponse.json(
        { error: 'You must be enrolled in this institution to join their live classes' },
        { status: 403 }
      );
    }

    // Enroll the student
    const enrollment = await prisma.videoSessionParticipant.create({
      data: {
        sessionId: liveClassId,
        userId: session.user.id,
        role: 'PARTICIPANT',
        isActive: false, // Will be set to true when they join
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Successfully enrolled in live class',
      enrollment,
    }, { status: 201 });
  } catch (error) {
    console.error('Error enrolling in live class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/student/live-classes/enroll - Unenroll from a live class
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const liveClassId = searchParams.get('liveClassId');

    if (!liveClassId) {
      return NextResponse.json(
        { error: 'Live class ID is required' },
        { status: 400 }
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
        { status: 404 }
      );
    }

    // Get the live class to check if it's too late to unenroll
    const liveClass = await prisma.videoSession.findUnique({
      where: { id: liveClassId },
    });

    if (liveClass && new Date(liveClass.startTime) <= new Date()) {
      return NextResponse.json(
        { error: 'Cannot unenroll from a live class that has already started' },
        { status: 400 }
      );
    }

    // Remove the enrollment
    await prisma.videoSessionParticipant.delete({
      where: {
        sessionId_userId: {
          sessionId: liveClassId,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({
      message: 'Successfully unenrolled from live class',
    });
  } catch (error) {
    console.error('Error unenrolling from live class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 