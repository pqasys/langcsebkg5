import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            courseTags: true
          }
        }
      }
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error fetching tag:');
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, parentId, color, icon, featured, priority } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id: params.id }
    });

    if (!existingTag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Check if another tag with the same name exists
    const duplicateTag = await prisma.tag.findFirst({
      where: {
        name: { contains: name },
        id: { not: params.id }
      }
    });

    if (duplicateTag) {
      return NextResponse.json(
        { error: 'A tag with this name already exists' },
        { status: 400 }
      );
    }

    // If parentId is provided, verify it exists and check for circular references
    if (parentId) {
      if (parentId === params.id) {
        return NextResponse.json(
          { error: 'A tag cannot be its own parent' },
          { status: 400 }
        );
      }

      const parentTag = await prisma.tag.findUnique({
        where: { id: parentId }
      });

      if (!parentTag) {
        return NextResponse.json(
          { error: 'Parent tag not found' },
          { status: 400 }
        );
      }

      // Check for circular references
      let currentParentId = parentId;
      while (currentParentId) {
        const parent = await prisma.tag.findUnique({
          where: { id: currentParentId },
          select: { parentId: true }
        });
        
        if (!parent) break;
        if (parent.parentId === params.id) {
          return NextResponse.json(
            { error: 'Circular reference detected in tag hierarchy' },
            { status: 400 }
          );
        }
        currentParentId = parent.parentId;
      }
    }

    const updatedTag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        name,
        description,
        parentId,
        color,
        icon,
        featured,
        priority,
        slug: slugify(name, { lower: true, strict: true }),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:');
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if tag exists and has no children
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            children: true,
            courseTags: true
          }
        }
      }
    });

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    if (tag._count?.children > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tag with child tags. Please delete or reassign child tags first.' },
        { status: 400 }
      );
    }

    if (tag._count?.courseTags > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tag that is used by courses. Please remove the tag from all courses first.' },
        { status: 400 }
      );
    }

    // Delete tag relationships first
    await prisma.tagrelation.deleteMany({
      where: {
        OR: [
          { tagId: params.id },
          { relatedId: params.id }
        ]
      }
    });

    // Delete the tag
    await prisma.tag.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:');
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 