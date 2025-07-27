import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, parentId } = await request.json();

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        description,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:');
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First, check if the category has any sub-categories
    const subCategories = await prisma.category.findMany({
      where: { parentId: params.id },
    });

    if (subCategories.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with sub-categories' },
        { status: 400 }
      );
    }

    // Check if the category is being used by any courses
    const courses = await prisma.course.findMany({
      where: { categoryId: params.id },
    });

    if (courses.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category that is being used by courses' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:');
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 