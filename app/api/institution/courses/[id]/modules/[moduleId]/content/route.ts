import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

// Helper function to create directory if it doesn't exist
async function ensureDirectoryExists(path: string) {
  try {
    await mkdir(path, { recursive: true });
  } catch (error) {
    console.error('Error occurred:', error);
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

// Helper function to get content type directory
function getContentTypeDirectory(type: string): string {
  switch (type) {
    case 'VIDEO':
      return 'videos';
    case 'AUDIO':
      return 'audio';
    case 'IMAGE':
      return 'images';
    case 'DOCUMENT':
      return 'documents';
    default:
      return 'other';
  }
}

// POST create new content
export async function POST(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'INSTITUTION') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // First get the user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return new NextResponse('Institution not found', { status: 404 });
    }

    // Verify the course belongs to the institution
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: user.institution.id
      }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Get the module
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
    const type = formData.get('type') as 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT' | 'QUIZ' | 'EXERCISE';
    const file = formData.get('file') as File;
    const url = formData.get('url') as string;
    const order_index = parseInt(formData.get('order_index') as string);

    if (!title || !type) {
      console.error('[DEBUG] Missing required fields:');
      return new NextResponse('Missing required fields', { status: 400 });
    }

    let fileUrl = url;

    // Before handling file upload:
    const SETTINGS_PATH = join(process.cwd(), 'prisma', 'admin_settings.json');
    let maxFileSizeMB = 10;
    try {
      const settingsRaw = await fs.readFile(SETTINGS_PATH, 'utf-8');
      const settings = JSON.parse(settingsRaw);
      if (settings.fileUploadMaxSizeMB) maxFileSizeMB = settings.fileUploadMaxSizeMB;
    } catch {}

    // Handle file upload
    if (file) {
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        return new NextResponse(`File size exceeds ${maxFileSizeMB}MB limit`, { status: 400 });
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      // Create directory structure: /uploads/[institutionId]/[courseId]/[contentType]/
      const contentTypeDir = getContentTypeDirectory(type);
      const uploadPath = join(
        process.cwd(),
        'public',
        'uploads',
        user.institution.id,
        params.id,
        contentTypeDir
      );

      // Ensure directory exists
      await ensureDirectoryExists(uploadPath);

      // Save file
      await writeFile(join(uploadPath, fileName), buffer);

      // Set the file URL with the new path structure
      fileUrl = `/uploads/${user.institution.id}/${params.id}/${contentTypeDir}/${fileName}`;
    }

    // Create the content item
    const contentItem = await prisma.content_items.create({
      data: {
        id: uuidv4(),
        title,
        type,
        order_index,
        module_id: params.moduleId,
        content: fileUrl,
      },
    });

    // // // console.log('Content item created successfully');
    return NextResponse.json(contentItem);
  } catch (error) {
    console.error('Error in POST /api/institution/courses/[id]/modules/[moduleId]/content:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// GET all content items for a module
export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'INSTITUTION') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // First get the user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return new NextResponse('Institution not found', { status: 404 });
    }

    // Verify the course belongs to the institution
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: user.institution.id
      }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Get the module
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id
      }
    });

    if (!module) {
      return new NextResponse('Module not found', { status: 404 });
    }

    // Get all content items for the module
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
    console.error('Error in GET /api/institution/courses/[id]/modules/[moduleId]/content:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 