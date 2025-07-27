import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseFacilities } from '@/lib/utils';
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
  const filename = `${timestamp}-${file.name}`;
  const filepath = join(uploadDir, filename);

  // Write file to disk
  await writeFile(filepath, buffer);

  // Return the public URL
  return `/uploads/institutions/${institutionId}/${filename}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session data:', {
      hasSession: !!session,
      userRole: session?.user?.role,
      isInstitution: session?.user?.role === 'INSTITUTION',
      institutionData: session?.user?.institution,
      isApproved: session?.user?.institution?.status === 'APPROVED'
    });

    // Check if user is authenticated and has access to this institution
    const isInstitutionUser = session?.user?.role === 'INSTITUTION' && 
                             session?.user?.institutionId === params.id;
    const isAdmin = session?.user?.role === 'ADMIN';

    const institution = await prisma.institution.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: {
            email: true,
            role: true,
            name: true
          }
        },
        courses: {
          where: {
            // Only show published courses to public, all courses to institution users and admins
            ...(isInstitutionUser || isAdmin ? {} : { status: 'PUBLISHED' })
          },
          select: {
            id: true,
            title: true,
            description: true,
            base_price: true,
            duration: true,
            level: true,
            status: true
          }
        }
      },
    });

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // For public access, only show approved and active institutions
    if (!isInstitutionUser && !isAdmin) {
      if (!institution.isApproved || institution.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Institution not available' }, { status: 404 });
      }
    }

    // Log the institution data being returned
    console.log('Returning institution data:', {
      id: institution.id,
      name: institution.name,
      hasLogo: !!institution.logoUrl,
      coursesCount: institution.courses?.length || 0,
      courses: institution.courses?.map(c => ({ id: c.id, title: c.title, status: c.status })) || []
    });

    return NextResponse.json({
      id: institution.id,
      name: institution.name,
      email: institution.users[0]?.email,
      description: institution.description,
      country: institution.country,
      city: institution.city,
      state: institution.state,
      postcode: institution.postcode,
      address: institution.address,
      website: institution.website,
      institutionEmail: institution.institutionEmail,
      telephone: institution.telephone,
      contactName: institution.contactName,
      contactJobTitle: institution.contactJobTitle,
      contactPhone: institution.contactPhone,
      contactEmail: institution.contactEmail,
      logo: institution.logoUrl,
      mainImage: institution.mainImageUrl,
      phone: institution.telephone,
      courses: institution.courses || [],
      facilities: parseFacilities(institution.facilities),
      status: institution.status,
      isApproved: institution.isApproved,
      createdAt: institution.createdAt
    });
  } catch (error) {
    console.error('Error fetching institution:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch institution',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        institution: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Allow admin users to update any institution
    if (user.role !== 'ADMIN') {
      // For non-admin users, check if they are associated with the institution
      if (user.institution?.id !== params.id) {
        return NextResponse.json(
          { error: 'Not authorized to update this institution' },
          { status: 403 }
        );
      }
    }

    let data: unknown;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
      
      // Handle file uploads
      const logoFile = formData.get('logo') as File | null;
      if (logoFile) {
        data.logoUrl = await uploadFile(logoFile, params.id);
      }

      const mainImageFile = formData.get('mainImage') as File | null;
      if (mainImageFile) {
        data.mainImageUrl = await uploadFile(mainImageFile, params.id);
      }

      // Handle facility images
      const facilityFiles = Array.from(formData.entries())
        .filter(([key]) => key.startsWith('facility_'))
        .map(([_, value]) => value as File);

      if (facilityFiles.length > 0) {
        const uploadedFacilities = await Promise.all(
          facilityFiles.map(file => uploadFile(file, params.id))
        );
        data.facilities = [...parseFacilities(data.facilities), ...uploadedFacilities];
      }
    } else {
      data = await request.json();
    }

    // Parse facilities using utility function
    data.facilities = parseFacilities(data.facilities);

    // Ensure facilities is an array and limit to 5
    if (Array.isArray(data.facilities)) {
      data.facilities = data.facilities.slice(0, 5);
    } else {
      data.facilities = [];
    }

    // Update institution
    const updatedInstitution = await prisma.institution.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,
        postcode: data.postcode,
        email: data.email,
        website: data.website,
        institutionEmail: data.institutionEmail,
        telephone: data.telephone,
        contactName: data.contactName,
        contactJobTitle: data.contactJobTitle,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        logoUrl: data.logoUrl,
        mainImageUrl: data.mainImageUrl,
        facilities: JSON.stringify(data.facilities),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      ...updatedInstitution,
      facilities: data.facilities
    });
  } catch (error) {
    console.error('Error updating institution:');
    return NextResponse.json(
      { 
        error: 'Failed to update institution',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
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
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.institution.delete({
      where: { id: params.id },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting institution:');
    return NextResponse.json(
      { 
        error: 'Failed to delete institution',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}
