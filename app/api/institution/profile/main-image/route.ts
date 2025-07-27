import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Helper function to handle file uploads
async function uploadFile(file: File, institutionId: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create uploads directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'institutions', institutionId);
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const filename = `main-image-${timestamp}-${file.name}`;
  const filepath = join(uploadDir, filename);

  // Write file to disk
  await writeFile(filepath, buffer);

  // Return the public URL
  return `/uploads/institutions/${institutionId}/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'INSTITUTION') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the institution ID from the session
    const institutionId = session.user.institutionId;
    if (!institutionId) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const mainImageFile = formData.get('mainImage') as File | null;

    if (!mainImageFile) {
      return NextResponse.json({ error: 'No main image file provided' }, { status: 400 });
    }

    // Validate file type
    if (!mainImageFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (mainImageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Upload the file
    const mainImageUrl = await uploadFile(mainImageFile, institutionId);

    // Update the institution record
    await prisma.institution.update({
      where: { id: institutionId },
      data: { mainImageUrl }
    });

    // // // console.log('Main image uploaded successfully');
    return NextResponse.json({ 
      success: true, 
      mainImageUrl,
      message: 'Main image uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading main image:', error);
    return NextResponse.json(
      { error: 'Failed to upload main image' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 