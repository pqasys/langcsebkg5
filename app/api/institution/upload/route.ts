import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadFile, deleteFile } from '@/lib/upload';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const isPreview = formData.get('preview') === 'true';
    const formInstitutionId = formData.get('institutionId') as string;

    if (!file || !type) {
      return NextResponse.json(
        { error: 'File and type are required' },
        { status: 400 }
      );
    }

    // Before handling file upload:
    const SETTINGS_PATH = path.join(process.cwd(), 'prisma', 'admin_settings.json');
    let maxFileSizeMB = 10;
    try {
      const settingsRaw = await fs.readFile(SETTINGS_PATH, 'utf-8');
      const settings = JSON.parse(settingsRaw);
      if (settings.fileUploadMaxSizeMB) maxFileSizeMB = settings.fileUploadMaxSizeMB;
    } catch {}

    if (file && file.size > maxFileSizeMB * 1024 * 1024) {
      return NextResponse.json({ error: `File size exceeds ${maxFileSizeMB}MB limit` }, { status: 400 });
    }

    // Determine which institution to use
    let targetInstitutionId: string;
    if (session.user.role === 'ADMIN') {
      if (!formInstitutionId) {
        return NextResponse.json(
          { error: 'Institution ID is required for admin users' },
          { status: 400 }
        );
      }
      targetInstitutionId = formInstitutionId;
    } else {
      if (!session.user.institutionId) {
        return NextResponse.json(
          { error: 'User is not associated with any institution' },
          { status: 400 }
        );
      }
      targetInstitutionId = session.user.institutionId;
    }

    // Verify that the institution exists
    const institution = await prisma.institution.findUnique({
      where: { id: targetInstitutionId }
    });

    if (!institution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }

    // Upload the file
    const imageUrl = await uploadFile(file, type, targetInstitutionId);

    // Update database with the new image
    if (type === 'logo') {
      // Delete old logo if exists
      if (institution.logoUrl) {
        await deleteFile(institution.logoUrl);
      }
      
      await prisma.institution.update({
        where: { id: targetInstitutionId },
        data: { logoUrl: imageUrl },
      });
    } else if (type === 'mainImage') {
      // Delete old main image if exists
      if (institution.mainImageUrl) {
        await deleteFile(institution.mainImageUrl);
      }
      
      await prisma.institution.update({
        where: { id: targetInstitutionId },
        data: { mainImageUrl: imageUrl },
      });
    } else if (type === 'facility') {
      const currentFacilities = institution.facilities ? JSON.parse(institution.facilities as string) : [];
      if (!currentFacilities.includes(imageUrl)) {
        currentFacilities.push(imageUrl);
        await prisma.institution.update({
          where: { id: targetInstitutionId },
          data: {
            facilities: JSON.stringify(currentFacilities),
          },
        });
      }
    }

    return NextResponse.json({ 
      url: imageUrl,
      isPreview: false
    });
  } catch (error) {
    console.error('Error uploading file:');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Delete the file
    await deleteFile(imageUrl);

    // Update database
    const institution = await prisma.institution.findUnique({
      where: { id: session.user.institutionId },
      select: { facilities: true, logoUrl: true, mainImageUrl: true }
    });

    if (!institution) {
      throw new Error(`Institution not found - Context: throw new Error('Institution not found');...`);
    }

    // If it's the logo, clear the logoUrl
    if (institution.logoUrl === imageUrl) {
      await prisma.institution.update({
        where: { id: session.user.institutionId },
        data: { logoUrl: null },
      });
    } else if (institution.mainImageUrl === imageUrl) {
      // If it's the main image, clear the mainImageUrl
      await prisma.institution.update({
        where: { id: session.user.institutionId },
        data: { mainImageUrl: null },
      });
    } else {
      // If it's a facility image, remove it from the facilities array
      const currentFacilities = institution.facilities ? JSON.parse(institution.facilities as string) : [];
      const updatedFacilities = currentFacilities.filter((url: string) => url !== imageUrl);

      await prisma.institution.update({
        where: { id: session.user.institutionId },
        data: {
          facilities: JSON.stringify(updatedFacilities),
        },
      });
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete file' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 