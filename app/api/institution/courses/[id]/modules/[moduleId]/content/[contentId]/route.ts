import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string; contentId: string } }
) {
  try {
    // // // // // // // // // // // // // // // // // // console.log('API GET request params:', params); // Debug log
    
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log('No session found'); // Debug log
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('User session:', session.user.id); // Debug log

    // Check if user has access to this course/module
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institution: {
          users: {
            some: {
              id: session.user.id
            }
          }
        }
      }
    });

    console.log('Course found:', !!course); // Debug log

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Fetch the content item
    const content = await prisma.content_items.findFirst({
      where: {
        id: params.contentId,
        module_id: params.moduleId
      }
    });

    console.log('Content found:', !!content); // Debug log
    console.log('Content data:', content); // Debug log

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; moduleId: string; contentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access to this course/module
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institution: {
          users: {
            some: {
              id: session.user.id
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, type, url, order_index } = body;

    // Validate required fields
    if (!title || !type) {
      return NextResponse.json({ error: 'Title and type are required' }, { status: 400 });
    }

    // Update the content item
    const updatedContent = await prisma.content_items.update({
      where: {
        id: params.contentId,
        module_id: params.moduleId
      },
      data: {
        title,
        content: url || '', // Save URL to content field
        type,
        order_index: order_index || 0,
        updated_at: new Date()
      }
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string; contentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access to this course/module
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institution: {
          users: {
            some: {
              id: session.user.id
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Delete the content item
    await prisma.content_items.delete({
      where: {
        id: params.contentId,
        module_id: params.moduleId
      }
    });

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 