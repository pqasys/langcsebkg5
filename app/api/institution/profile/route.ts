import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadFile } from '@/lib/upload';
import { parseFacilities } from '@/lib/utils';
import { rename, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    // Get institution
    const institution = await prisma.institution.findUnique({
      where: {
        id: user.institutionId
      },
      select: {
        id: true,
        name: true,
        email: true,
        description: true,
        address: true,
        city: true,
        state: true,
        country: true,
        postcode: true,
        website: true,
        institutionEmail: true,
        telephone: true,
        contactName: true,
        contactJobTitle: true,
        contactPhone: true,
        contactEmail: true,
        logoUrl: true,
        mainImageUrl: true,
        facilities: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ institution });

  } catch (error) {
    console.error('Error fetching institution profile:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

async function movePreviewToPermanent(previewUrl: string, institutionId: string): Promise<string> {
  const filename = previewUrl.split('/').pop();
  if (!filename) throw new Error(`Invalid preview URL - Context: if (!filename) throw new Error('Invalid preview UR...`);

  const tempPath = join(process.cwd(), 'public', 'temp', filename);
  const institutionDir = join(process.cwd(), 'public', 'uploads', institutionId);
  const permanentPath = join(institutionDir, filename);

  try {
    // Ensure institution directory exists
    if (!existsSync(institutionDir)) {
      await mkdir(institutionDir, { recursive: true });
    }
    
    await rename(tempPath, permanentPath);
    return `/uploads/${institutionId}/${filename}`;
  } catch (error) {
    console.error('Error moving preview to permanent:');
    throw error;
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('Institution profile PUT - No session or user email');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTITUTION') {
      console.log('Institution profile PUT - User role is not INSTITUTION:', session.user.role);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get user to find their institutionId
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If user is not an admin, check if they are associated with an institution
    if (user.role !== 'ADMIN' && !user.institutionId) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Get form data or JSON data
    let data;
    const contentType = request.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        data = {
          name: formData.get('name'),
          description: formData.get('description'),
          address: formData.get('address'),
          city: formData.get('city'),
          state: formData.get('state'),
          country: formData.get('country'),
          postcode: formData.get('postcode'),
          website: formData.get('website'),
          institutionEmail: formData.get('institutionEmail'),
          telephone: formData.get('telephone'),
          contactName: formData.get('contactName'),
          contactJobTitle: formData.get('contactJobTitle'),
          contactPhone: formData.get('contactPhone'),
          contactEmail: formData.get('contactEmail'),
          logoUrl: formData.get('logoUrl'),
          mainImageUrl: formData.get('mainImageUrl'),
          facilities: formData.get('facilities'),
          institutionId: formData.get('institutionId')
        };
      } else {
        data = await request.json();
      }
    } catch (error) {
      console.error('Error parsing request data:');
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Determine which institution to update
    const institutionId = user.role === 'ADMIN' ? data.institutionId : user.institutionId;

    if (!institutionId) {
      console.error('Missing institutionId:');
      return NextResponse.json({ error: 'Institution ID is required' }, { status: 400 });
    }

    const institution = await prisma.institution.findUnique({
      where: { id: institutionId }
    });

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Get all form fields
    const name = data.name;
    const description = data.description;
    const address = data.address;
    const city = data.city;
    const state = data.state;
    const country = data.country;
    const postcode = data.postcode;
    const website = data.website;
    const institutionEmail = data.institutionEmail;
    const telephone = data.telephone;
    const contactName = data.contactName;
    const contactJobTitle = data.contactJobTitle;
    const contactPhone = data.contactPhone;
    const contactEmail = data.contactEmail;
    const logoUrl = data.logoUrl;
    const mainImageUrl = data.mainImageUrl;
    const facilities = data.facilities;

    // Get current facilities first
    const currentInstitution = await prisma.institution.findUnique({
      where: { id: institutionId },
      select: { facilities: true }
    });

    // Parse current facilities
    let currentFacilities: string[] = [];
    if (currentInstitution?.facilities) {
      try {
        if (typeof currentInstitution.facilities === 'string') {
          currentFacilities = parseFacilities(currentInstitution.facilities);
        } else if (Array.isArray(currentInstitution.facilities)) {
          currentFacilities = currentInstitution.facilities;
        }
      } catch (error) {
        console.error('Error parsing current facilities:', error);
        currentFacilities = [];
      }
    }

    // Parse facilities if they exist in the form data
    let updatedFacilities = currentFacilities; // Default to current facilities
    try {
      if (facilities) {
        if (typeof facilities === 'string') {
          // Handle string input
          if (facilities.startsWith('[')) {
            // If it's a JSON string array
            updatedFacilities = parseFacilities(facilities);
          } else {
            // If it's a single URL
            updatedFacilities = [facilities];
          }
        } else if (Array.isArray(facilities)) {
          // If it's already an array
          updatedFacilities = facilities;
        }
      }
      // If facilities is not provided, keep the current facilities
    } catch (error) {
      console.error('Error parsing facilities from form data:', error);
      // Keep current facilities if parsing fails
      updatedFacilities = currentFacilities;
    }

    const updatedInstitution = await prisma.institution.update({
      where: { id: institution.id },
      data: {
        name,
        description,
        address,
        city,
        state,
        country,
        postcode,
        website,
        institutionEmail,
        telephone,
        contactName,
        contactJobTitle,
        contactPhone,
        contactEmail,
        logoUrl,
        mainImageUrl,
        facilities: JSON.stringify(updatedFacilities),
      },
    });

    // Parse facilities for the response
    const responseFacilities = updatedFacilities;

    return NextResponse.json({ 
      ...updatedInstitution,
      facilities: responseFacilities
    });

  } catch (error) {
    console.error('Error updating institution:');
    return NextResponse.json(
      { 
        error: 'Failed to update institution',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 