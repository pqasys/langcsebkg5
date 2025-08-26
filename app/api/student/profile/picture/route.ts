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
    console.log('Profile picture upload started');
    
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log('No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      console.log('User role is not STUDENT:', session.user.role);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('Processing form data...');
    const formData = await req.formData();
    const file = formData.get('profilePicture') as File;

    if (!file) {
      console.log('No file provided in form data');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File received:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Additional validation: check file signature (magic bytes)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Check for common image file signatures
    const isJPEG = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    const isGIF = (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) || 
                  (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38);
    const isWebP = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
    
    if (!isJPEG && !isPNG && !isGIF && !isWebP) {
      console.log('Invalid file signature detected');
      return NextResponse.json({ error: 'Invalid image file. Please upload a valid JPG, PNG, GIF, or WebP image.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Ensure uploads directory exists and is writable
    console.log('Ensuring uploads directory exists:', uploadsDir);
    if (!existsSync(uploadsDir)) {
      console.log('Creating uploads directory...');
      mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Test write permissions by creating a temporary file
    try {
      const testFile = join(uploadsDir, '.test-write');
      await writeFile(testFile, 'test');
      await unlink(testFile);
      console.log('Uploads directory is writable');
    } catch (permissionError) {
      console.error('Uploads directory is not writable:', permissionError);
      return NextResponse.json({ error: 'Server configuration error: Upload directory is not writable' }, { status: 500 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // Validate file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      console.log('Invalid file extension:', fileExtension);
      return NextResponse.json({ error: 'Invalid file type. Please use JPG, PNG, GIF, or WebP format.' }, { status: 400 });
    }
    
    const filename = `${session.user.id}_${timestamp}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    console.log('Saving file to:', filepath);

    // File buffer is already created above for validation
    console.log('Writing file to disk...');
    try {
      await writeFile(filepath, buffer);
      console.log('File saved successfully');
    } catch (writeError) {
      console.error('Error writing file to disk:', writeError);
      throw new Error(`Failed to save file: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
    }

    // Get the public URL
    const publicUrl = `/uploads/profiles/${filename}`;

    console.log('Updating user record...');
    // Update user record with new image URL
    try {
      // First, let's check the current user record
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, image: true, updatedAt: true }
      });
      console.log('Current user record before update:', currentUser);
      
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { 
          image: publicUrl,
          updatedAt: new Date()
        }
      });
      console.log('User record updated successfully:', {
        userId: updatedUser.id,
        image: updatedUser.image,
        updatedAt: updatedUser.updatedAt
      });
      
      // Verify the update by fetching again
      const verifyUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, image: true, updatedAt: true }
      });
      console.log('User record after update (verification):', verifyUser);
    } catch (dbError) {
      console.error('Error updating user record:', dbError);
      // Try to clean up the uploaded file
      try {
        await unlink(filepath);
        console.log('Cleaned up uploaded file after database error');
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
      throw new Error(`Database error: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}`);
    }

    console.log('Updating student record...');
    // Also update student record if needed
    try {
      await prisma.student.update({
        where: { id: session.user.id },
        data: { 
          updated_at: new Date(),
          last_active: new Date()
        }
      });
      console.log('Student record updated successfully');
    } catch (dbError) {
      console.error('Error updating student record:', dbError);
      // Don't throw here as the main user record was updated successfully
    }

    console.log('Profile picture updated successfully:', {
      userId: session.user.id,
      imageUrl: publicUrl,
      filepath: filepath,
      fileExists: existsSync(filepath),
      fileSize: existsSync(filepath) ? require('fs').statSync(filepath).size : 'N/A'
    });

    return NextResponse.json({ 
      success: true, 
      imageUrl: publicUrl,
      message: 'Profile picture updated successfully' 
    });

  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture', details: error instanceof Error ? error.message : 'Unknown error' },
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