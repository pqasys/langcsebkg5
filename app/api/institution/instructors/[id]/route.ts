import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT - Update institution instructor
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'INSTITUTION') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();
    const { name, email } = data;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if instructor exists and belongs to this institution
    const existingInstructor = await prisma.user.findUnique({
      where: { 
        id, 
        role: 'INSTRUCTOR',
        institutionId: session.user.institutionId
      }
    });

    if (!existingInstructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
        id: { not: id }
      }
    });

    if (emailExists) {
      return NextResponse.json(
        { error: 'Email is already taken by another user' },
        { status: 400 }
      );
    }

    // Update instructor
    const updatedInstructor = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Instructor updated successfully',
      instructor: {
        id: updatedInstructor.id,
        name: updatedInstructor.name,
        email: updatedInstructor.email,
        status: updatedInstructor.status
      }
    });
  } catch (error) {
    console.error('Error updating instructor:', error);
    return NextResponse.json(
      { error: 'Failed to update instructor' },
      { status: 500 }
    );
  }
}

// DELETE - Delete institution instructor
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'INSTITUTION') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if instructor exists and belongs to this institution
    const existingInstructor = await prisma.user.findUnique({
      where: { 
        id, 
        role: 'INSTRUCTOR',
        institutionId: session.user.institutionId
      }
    });

    if (!existingInstructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    // Check if instructor has any active sessions
    const activeSessions = await prisma.videoSession.findMany({
      where: {
        instructorId: id,
        startTime: { gte: new Date() }
      }
    });

    if (activeSessions.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete instructor with active future sessions' },
        { status: 400 }
      );
    }

    // Delete instructor
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Instructor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    return NextResponse.json(
      { error: 'Failed to delete instructor' },
      { status: 500 }
    );
  }
} 