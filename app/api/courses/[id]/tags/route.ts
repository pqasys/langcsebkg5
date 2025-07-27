import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// GET /api/courses/[id]/tags - Get tags for a course
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tags = await prisma.courseTag.findMany({
      where: {
        courseId: params.id,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(tags.map(t => t.tag));
  } catch (error) {
    console.error('Error fetching course tags:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

// POST /api/courses/[id]/tags - Add a tag to a course
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tagId } = await request.json();

    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    // Check if the tag already exists for this course
    const existingTag = await prisma.courseTag.findFirst({
      where: {
        courseId: params.id,
        tagId: tagId,
      },
      include: {
        tag: true
      }
    });

    if (existingTag) {
      // Return the existing tag instead of an error
      return NextResponse.json(existingTag.tag);
    }

    // Create the course-tag relationship
    const courseTag = await prisma.courseTag.create({
      data: {
        id: uuidv4(),
        courseId: params.id,
        tagId: tagId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(courseTag.tag);
  } catch (error) {
    console.error('Error adding tag to course:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

// DELETE /api/courses/[id]/tags - Remove a tag from a course
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');

    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    // Delete the course-tag relationship
    await prisma.courseTag.deleteMany({
      where: {
        courseId: params.id,
        tagId: tagId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing tag from course:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 