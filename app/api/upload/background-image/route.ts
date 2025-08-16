import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Helper function to determine folder name based on user type and context
function getUploadFolderName(session: any, institutionId?: string): string {
  if (institutionId && institutionId !== 'default' && institutionId !== '') {
    // Institution user - use institution ID
    return `institution_${institutionId}`;
  } else if (session.user.role === 'ADMIN') {
    // Admin user - use admin ID
    return `admin_${session.user.id}`;
  } else {
    // Other users (course creators, third-party, etc.) - use user ID
    return `user_${session.user.id}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to upload images
    const userRole = session.user.role;
    if (userRole !== 'ADMIN' && userRole !== 'INSTITUTION') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const institutionId = formData.get('institutionId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // Create folder based on user type and ID
    const folderName = getUploadFolderName(session, institutionId);
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'backgrounds', folderName);
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `bg_${timestamp}_${randomString}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/backgrounds/${folderName}/${fileName}`;

    console.log(`✅ Background image uploaded:`, {
      url: publicUrl,
      fileName: fileName,
      folder: folderName,
      userRole: session.user.role,
      userId: session.user.id,
      institutionId: institutionId || 'none',
      fileSize: formatFileSize(file.size),
      fileType: file.type
    });

    // Helper function to format file size
    function formatFileSize(bytes: number): string {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Error uploading background image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
