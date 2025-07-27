import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file || !type) {
      return NextResponse.json(
        { error: 'File and type are required' },
        { status: 400 }
      );
    }

    if (!['logo', 'facility'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type value' },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const typeDir = join(UPLOAD_DIR, type);
    const institutionDir = join(typeDir, params.id);
    const filePath = join(institutionDir, fileName);
    const relativePath = `/uploads/${type}/${params.id}/${fileName}`;

    // Create directories if they don't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(typeDir)) {
      await mkdir(typeDir, { recursive: true });
    }
    if (!existsSync(institutionDir)) {
      await mkdir(institutionDir, { recursive: true });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to disk
    await writeFile(filePath, buffer);

    if (type === 'logo') {
      await prisma.institution.update({
        where: { id: params.id },
        data: { logoUrl: relativePath },
      });
    } else {
      // Get current facilities array
      const institution = await prisma.institution.findUnique({
        where: { id: params.id },
        select: { facilities: true }
      });

      if (!institution) {
        throw new Error(`Institution not found - Context: Institution not found - Context: select: { facilities: true }`);
      }

      // Initialize or update facilities array
      const currentFacilities = institution.facilities ? JSON.parse(institution.facilities as string) : [];
      currentFacilities.push(relativePath);

      await prisma.institution.update({
        where: { id: params.id },
        data: {
          facilities: JSON.stringify(currentFacilities),
        },
      });
    }

    return NextResponse.json({ url: relativePath });
  } catch (error) {
    console.error('Error uploading file:');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
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

    // Convert URL to file path
    const filePath = join(process.cwd(), 'public', imageUrl);

    // Check if file exists before trying to delete
    if (!existsSync(filePath)) {
      // // // console.warn(`File not found: ${filePath}`);
    } else {
      // Delete file from disk
      await unlink(filePath);
    }

    const institution = await prisma.institution.findUnique({
      where: { id: params.id },
      select: { facilities: true }
    });

    if (!institution) {
      throw new Error('Institution not found');
    }

    if (institution.facilities) {
      const currentFacilities = JSON.parse(institution.facilities as string);
      const updatedFacilities = currentFacilities.filter((url: string) => url !== imageUrl);

      await prisma.institution.update({
        where: { id: params.id },
        data: {
          facilities: JSON.stringify(updatedFacilities),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete file' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 