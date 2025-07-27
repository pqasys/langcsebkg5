import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

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

    const formData = await request.formData();
    const facilities = formData.getAll('facilities') as File[];

    if (!facilities.length) {
      return NextResponse.json({ error: 'No facility files provided' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'facilities');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Process each facility file
    const facilityUrls = await Promise.all(
      facilities.map(async (facility) => {
        const timestamp = Date.now();
        const filename = `${params.id}-${timestamp}-${facility.name}`;
        const filepath = join(uploadDir, filename);

        // Convert File to Buffer and save
        const bytes = await facility.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        return `/uploads/facilities/${filename}`;
      })
    );

    // Get existing facilities
    const institution = await prisma.institution.findUnique({
      where: { id: params.id },
      select: { facilities: true },
    });

    // Combine existing and new facilities
    const existingFacilities = institution?.facilities ? JSON.parse(institution.facilities as string) : [];
    const updatedFacilities = [...existingFacilities, ...facilityUrls];

    // Update institution with new facilities
    await prisma.institution.update({
      where: { id: params.id },
      data: { facilities: JSON.stringify(updatedFacilities) },
    });

    // // // console.log('Facilities uploaded successfully');
    return NextResponse.json({ 
      message: 'Facilities uploaded successfully',
      facilityUrls 
    });
  } catch (error) {
    console.error('Error uploading facilities:');
    return NextResponse.json(
      { error: 'Failed to upload facilities' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 