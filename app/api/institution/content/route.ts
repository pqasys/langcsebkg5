import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'User not associated with an institution' }, { status: 403 });
    }

    // Get all content items from the institution's courses
    const contentItems = await prisma.content_items.findMany({
      where: {
        module: {
          course: {
            institutionId: user.institution.id
          }
        }
      },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true
              }
            }
          }
        }
      },
      orderBy: {
        updated_at: 'desc'
      }
    });

    // Transform the data to match the expected interface
    const transformedContent = contentItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.content.substring(0, 100) + (item.content.length > 100 ? '...' : ''),
      type: 'lesson' as const, // Map content_items to lesson type
      status: 'published' as const, // Default to published since content_items doesn't have status
      courseId: item.module.course.id,
      courseTitle: item.module.course.title,
      createdAt: item.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: item.updated_at?.toISOString() || new Date().toISOString(),
      blocks: [], // content_items doesn't have blocks structure
      tags: [], // content_items doesn't have tags
      content: item.content,
      moduleId: item.module_id,
      moduleTitle: item.module.title,
      orderIndex: item.order_index,
      contentType: item.type
    }));

    return NextResponse.json(transformedContent);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, courseId, moduleId, content, type = 'TEXT' } = body;

    // Validate required fields
    if (!title || !courseId || !moduleId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the module belongs to the user's institution
    const module = await prisma.modules.findFirst({
      where: {
        id: moduleId,
        course: {
          institutionId: {
            equals: (await prisma.user.findUnique({
              where: { id: session.user.id },
              include: { institution: true }
            }))?.institution?.id
          }
        }
      }
    });

    if (!module) {
      return NextResponse.json({ error: 'Module not found or access denied' }, { status: 404 });
    }

    // Get the next order index for this module
    const maxOrderIndex = await prisma.content_items.aggregate({
      where: { module_id: moduleId },
      _max: { order_index: true }
    });

    const nextOrderIndex = (maxOrderIndex._max.order_index || 0) + 1;

    // Create the content item
    const newContent = await prisma.content_items.create({
      data: {
        id: crypto.randomUUID(),
        module_id: moduleId,
        type: type as any, // Cast to content_items_type enum
        title,
        content,
        order_index: nextOrderIndex,
        created_at: new Date(),
        updated_at: new Date()
      },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    // Transform the response to match expected interface
    const transformedContent = {
      id: newContent.id,
      title: newContent.title,
      description: newContent.content.substring(0, 100) + (newContent.content.length > 100 ? '...' : ''),
      type: 'lesson' as const,
      status: 'published' as const,
      courseId: newContent.module.course.id,
      courseTitle: newContent.module.course.title,
      createdAt: newContent.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: newContent.updated_at?.toISOString() || new Date().toISOString(),
      blocks: [],
      tags: [],
      content: newContent.content,
      moduleId: newContent.module_id,
      moduleTitle: newContent.module.title,
      orderIndex: newContent.order_index,
      contentType: newContent.type
    };

    return NextResponse.json(transformedContent, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 