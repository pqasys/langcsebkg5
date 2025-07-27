import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('=== Facilities API Debug ===');
    console.log('1. Starting facilities upload');
    
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log('2. Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTITUTION') {
      console.log('2. Forbidden - not institution role');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('3. User authenticated:', session.user.email);

    // Get user to find their institutionId
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { institutionId: true }
    });

    if (!user?.institutionId) {
      console.log('4. Institution not found for user');
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    console.log('5. Found institution ID:', user.institutionId);

    const formData = await request.formData();
    const files = formData.getAll('facilities') as File[];

    console.log('6. Files received:', files.length);

    if (!files || files.length === 0) {
      console.log('7. No files provided');
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Create institution facilities directory
    const institutionDir = join(process.cwd(), 'public', 'uploads', 'facilities', user.institutionId);
    console.log('8. Institution directory:', institutionDir);
    
    if (!existsSync(institutionDir)) {
      console.log('9. Creating directory');
      await mkdir(institutionDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    // Upload each file
    for (const file of files) {
      console.log('10. Processing file:', file.name, file.type, file.size);
      
      if (!file.type.startsWith('image/')) {
        console.log('11. Skipping non-image file:', file.name);
        continue; // Skip non-image files
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomString}.${extension}`;
      const filepath = join(institutionDir, filename);

      console.log('12. Writing file:', filepath);

      // Write file
      await writeFile(filepath, buffer);

      // Generate URL
      const url = `/uploads/facilities/${user.institutionId}/${filename}`;
      uploadedUrls.push(url);
      console.log('13. File uploaded:', url);
    }

    console.log('14. Total files uploaded:', uploadedUrls.length);

    if (uploadedUrls.length === 0) {
      console.log('15. No valid image files uploaded');
      return NextResponse.json({ error: 'No valid image files uploaded' }, { status: 400 });
    }

    // Get current facilities
    const institution = await prisma.institution.findUnique({
      where: { id: user.institutionId },
      select: { facilities: true }
    });

    console.log('16. Current facilities in DB:', institution?.facilities);

    // Parse existing facilities
    let currentFacilities: string[] = [];
    if (institution?.facilities) {
      try {
        if (typeof institution.facilities === 'string') {
          currentFacilities = JSON.parse(institution.facilities);
          console.log('17. Parsed existing facilities:', currentFacilities);
        } else if (Array.isArray(institution.facilities)) {
          currentFacilities = institution.facilities;
          console.log('17. Existing facilities is array:', currentFacilities);
        }
      } catch (error) {
        console.error('18. Error parsing existing facilities:', error);
        currentFacilities = [];
      }
    }

    // Add new facilities
    const updatedFacilities = [...currentFacilities, ...uploadedUrls];
    console.log('19. Updated facilities:', updatedFacilities);

    // Update institution
    const updatedInstitution = await prisma.institution.update({
      where: { id: user.institutionId },
      data: {
        facilities: JSON.stringify(updatedFacilities)
      }
    });

    console.log('20. Database updated successfully');
    console.log('21. New facilities value:', updatedInstitution.facilities);

    return NextResponse.json({ 
      success: true, 
      uploadedUrls,
      message: `${uploadedUrls.length} facility image(s) uploaded successfully` 
    });

  } catch (error) {
    console.error('22. Error in facilities API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTITUTION') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get user to find their institutionId
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { institutionId: true }
    });

    if (!user?.institutionId) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Get current facilities
    const institution = await prisma.institution.findUnique({
      where: { id: user.institutionId },
      select: { facilities: true }
    });

    if (!institution?.facilities) {
      return NextResponse.json({ error: 'No facilities found' }, { status: 404 });
    }

    // Parse existing facilities
    let currentFacilities: string[] = [];
    try {
      if (typeof institution.facilities === 'string') {
        currentFacilities = JSON.parse(institution.facilities);
      } else if (Array.isArray(institution.facilities)) {
        currentFacilities = institution.facilities;
      }
    } catch (error) {
      console.error('Error parsing existing facilities:', error);
      return NextResponse.json({ error: 'Invalid facilities data' }, { status: 400 });
    }

    // Remove the image URL from facilities
    const updatedFacilities = currentFacilities.filter(url => url !== imageUrl);

    // Update institution
    await prisma.institution.update({
      where: { id: user.institutionId },
      data: {
        facilities: JSON.stringify(updatedFacilities)
      }
    });

    // Delete the physical file
    try {
      const filepath = join(process.cwd(), 'public', imageUrl);
      if (existsSync(filepath)) {
        await unlink(filepath);
      }
    } catch (error) {
      console.error('Error deleting physical file:', error);
      // Don't fail the request if file deletion fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Facility image deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting facility:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 