import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'INSTITUTION') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      email,
      description,
      country,
      state,
      city,
      postcode,
      address,
      telephone,
      contactName,
      contactJobTitle,
      contactPhone,
      contactEmail,
    } = await request.json();

    // Validate required fields
    if (!name || !email || !description || !country || !city || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true },
    });

    if (!user || !user.institution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }

    // Update the institution
    const updatedInstitution = await prisma.institution.update({
      where: { id: user.institution.id },
      data: {
        name,
        email,
        description,
        country,
        state,
        city,
        postcode,
        address,
        telephone,
        contactName,
        contactJobTitle,
        contactPhone,
        contactEmail,
        isApproved: false, // Reset approval status since details have changed
        status: 'PENDING', // Set status to PENDING when details are updated
      },
    });

    return NextResponse.json(updatedInstitution);
  } catch (error) {
    console.error('Error updating institution:');
    return NextResponse.json(
      { error: 'Failed to update institution' },
      { status: 500 }
    );
  }
} 