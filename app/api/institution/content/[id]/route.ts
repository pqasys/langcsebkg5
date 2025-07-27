import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'User not associated with an institution' }, { status: 403 });
    }

    // Get the content item and verify it belongs to the user's institution
    const contentItem = await prisma.content_items.findFirst({
      where: {
        id,
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
      }
    });

    if (!contentItem) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Transform the response to match expected interface
    const transformedContent = {
      id: contentItem.id,
      title: contentItem.title,
      description: contentItem.content.substring(0, 100) + (contentItem.content.length > 100 ? '...' : ''),
      type: 'lesson' as const,
      status: 'published' as const,
      courseId: contentItem.module.course.id,
      courseTitle: contentItem.module.course.title,
      createdAt: contentItem.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: contentItem.updated_at?.toISOString() || new Date().toISOString(),
      blocks: [],
      tags: [],
      content: contentItem.content,
      moduleId: contentItem.module_id,
      moduleTitle: contentItem.module.title,
      orderIndex: contentItem.order_index,
      contentType: contentItem.type
    };

    return NextResponse.json(transformedContent);
  } catch (error) {
    console.error('Error fetching content item:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { title, description, content, type } = body;

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'User not associated with an institution' }, { status: 403 });
    }

    // Verify the content item belongs to the user's institution
    const existingContent = await prisma.content_items.findFirst({
      where: {
        id,
        module: {
          course: {
            institutionId: user.institution.id
          }
        }
      }
    });

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found or access denied' }, { status: 404 });
    }

    // Update the content item
    const updatedContent = await prisma.content_items.update({
      where: { id },
      data: {
        title: title || existingContent.title,
        content: content || existingContent.content,
        type: type || existingContent.type,
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
      id: updatedContent.id,
      title: updatedContent.title,
      description: updatedContent.content.substring(0, 100) + (updatedContent.content.length > 100 ? '...' : ''),
      type: 'lesson' as const,
      status: 'published' as const,
      courseId: updatedContent.module.course.id,
      courseTitle: updatedContent.module.course.title,
      createdAt: updatedContent.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: updatedContent.updated_at?.toISOString() || new Date().toISOString(),
      blocks: [],
      tags: [],
      content: updatedContent.content,
      moduleId: updatedContent.module_id,
      moduleTitle: updatedContent.module.title,
      orderIndex: updatedContent.order_index,
      contentType: updatedContent.type
    };

    return NextResponse.json(transformedContent);
  } catch (error) {
    console.error('Error updating content item:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'User not associated with an institution' }, { status: 403 });
    }

    // Verify the content item belongs to the user's institution
    const existingContent = await prisma.content_items.findFirst({
      where: {
        id,
        module: {
          course: {
            institutionId: user.institution.id
          }
        }
      }
    });

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found or access denied' }, { status: 404 });
    }

    // Delete the content item
    await prisma.content_items.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content item:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 