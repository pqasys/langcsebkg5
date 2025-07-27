import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Ensure uploads directory exists
const uploadsDir = join(process.cwd(), 'public', 'uploads', 'profiles');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('profilePicture') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `${session.user.id}_${timestamp}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Get the public URL
    const publicUrl = `/uploads/profiles/${filename}`;

    // Update user record with new image URL
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        image: publicUrl,
        updatedAt: new Date()
      }
    });

    // Also update student record if needed
    await prisma.student.update({
      where: { id: session.user.id },
      data: { 
        updated_at: new Date(),
        last_active: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      imageUrl: publicUrl,
      message: 'Profile picture updated successfully' 
    });

  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get current user to check if they have a profile picture
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    });

    if (user?.image) {
      // Delete the file from filesystem
      const imagePath = user.image.replace('/uploads/profiles/', '');
      const filepath = join(uploadsDir, imagePath);
      
      try {
        await unlink(filepath);
      } catch (error) {
        console.warn('Could not delete file from filesystem:', error);
      }
    }

    // Update user record to remove image URL
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        image: null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Profile picture removed successfully' 
    });

  } catch (error) {
    console.error('Error removing profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to remove profile picture' },
      { status: 500 }
    );
  }
} 