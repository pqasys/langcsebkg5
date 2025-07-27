import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { existsSync, statSync } from 'fs';

const prisma = new PrismaClient();

async function ensureDirectoryExists(path: string) {
  try {
    if (existsSync(path)) {
      const stats = statSync(path);
      if (!stats.isDirectory()) {
        // If it's a file, remove it and create directory
        await rm(path);
        await mkdir(path, { recursive: true });
      }
    } else {
      await mkdir(path, { recursive: true });
    }
  } catch (error) {
    console.error('Error ensuring directory exists at ${path}:');
    throw error;
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if institution exists
    const institution = await prisma.institution.findUnique({
      where: { id: params.id },
    });

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const logo = formData.get('logo') as File;

    if (!logo) {
      return NextResponse.json({ error: 'No logo file provided' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const logosDir = join(uploadDir, 'logos');
    const institutionLogosDir = join(logosDir, params.id);
    
    // Ensure all required directories exist
    await ensureDirectoryExists(uploadDir);
    await ensureDirectoryExists(logosDir);
    await ensureDirectoryExists(institutionLogosDir);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${logo.name}`;
    const filepath = join(institutionLogosDir, filename);

    // Convert File to Buffer and save
    const bytes = await logo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Update institution with logo URL
    const logoUrl = `/uploads/logos/${params.id}/${filename}`;
    const updatedInstitution = await prisma.institution.update({
      where: { id: params.id },
      data: { logoUrl },
    });

    // // // console.log('Logo uploaded successfully');
    return NextResponse.json({ 
      message: 'Logo uploaded successfully', 
      logoUrl: updatedInstitution.logoUrl 
    });
  } catch (error) {
    console.error('Error uploading logo:');
    return NextResponse.json(
      { error: 'Failed to upload logo' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 