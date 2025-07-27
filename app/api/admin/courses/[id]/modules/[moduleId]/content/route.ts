import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// GET content for a module (Admin only)
export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized - Admin access required', { status: 401 });
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Verify the module exists and belongs to the course
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id
      }
    });

    if (!module) {
      return new NextResponse('Module not found', { status: 404 });
    }

    // Get content items for the module
    const contentItems = await prisma.content_items.findMany({
      where: {
        module_id: params.moduleId
      },
      orderBy: {
        order_index: 'asc'
      }
    });

    return NextResponse.json(contentItems);
  } catch (error) {
    console.error('Error fetching content:');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST create new content (Admin only)
export async function POST(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized - Admin access required', { status: 401 });
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Verify the module exists and belongs to the course
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id
      }
    });

    if (!module) {
      return new NextResponse('Module not found', { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT';
    const file = formData.get('file') as File;
    const url = formData.get('url') as string;
    const order_index = parseInt(formData.get('order_index') as string) || 0;

    if (!title || !type) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    let content = url || '';

    // Handle file upload if provided
    if (file && file.size > 0) {
      // For now, we'll store the file path as content
      // In a real implementation, you'd upload to a file storage service
      content = `/uploads/${file.name}`;
    }

    // Get the highest order number
    const lastContent = await prisma.content_items.findFirst({
      where: { module_id: params.moduleId },
      orderBy: { order_index: 'desc' }
    });

    const newOrder = order_index || (lastContent ? lastContent.order_index + 1 : 1);

    // Create the content item
    const contentItem = await prisma.content_items.create({
      data: {
        id: uuidv4(),
        module_id: params.moduleId,
        type,
        title,
        content,
        order_index: newOrder
      }
    });

    return NextResponse.json(contentItem);
  } catch (error) {
    console.error('Error creating content:');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 