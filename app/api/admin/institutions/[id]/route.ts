import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { parseFacilities } from '@/lib/utils';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Case-insensitive role check
    if (!session.user.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const institution = await prisma.institution.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: {
            email: true,
            role: true,
            name: true
          }
        }
      },
    });

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: institution.id,
      name: institution.name,
      email: institution.users[0]?.email,
      institutionEmail: institution.institutionEmail,
      description: institution.description,
      country: institution.country,
      city: institution.city,
      state: institution.state,
      postcode: institution.postcode,
      address: institution.address,
      website: institution.website,
      telephone: institution.telephone,
      contactName: institution.contactName,
      contactJobTitle: institution.contactJobTitle,
      contactPhone: institution.contactPhone,
      contactEmail: institution.contactEmail,
      logoUrl: institution.logoUrl,
      mainImageUrl: institution.mainImageUrl,
      facilities: parseFacilities(institution.facilities),
      status: institution.status,
      isApproved: institution.isApproved,
      createdAt: institution.createdAt,
      _count: {
        courses: await prisma.course.count({
          where: { institutionId: institution.id }
        })
      }
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
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    // // // // // // // // // // // // // // // // // // console.log('Request body:', body);

    const { 
      name, 
      email, 
      institutionEmail,
      website,
      description, 
      country, 
      city, 
      address, 
      telephone, 
      contactName, 
      contactJobTitle, 
      contactPhone, 
      contactEmail, 
      facilities,
      state,
      postcode
    } = body;

    // Validate required fields
    if (!country || !state || !city) {
      return NextResponse.json(
        { error: 'Country, state, and city are required' },
        { status: 400 }
      );
    }

    // First get the institution to find its admin user
    const currentInstitution = await prisma.institution.findUnique({
      where: { id: params.id },
      include: {
        users: {
          where: {
            role: 'INSTITUTION'
          },
          select: {
            id: true,
            email: true,
            role: true
          },
          take: 1
        },
      },
    });

    console.log('Current institution:', currentInstitution);

    if (!currentInstitution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    const institutionAdmin = currentInstitution.users[0];
    console.log('Institution admin:', institutionAdmin);

    try {
      // Update both institution and user in a transaction
      const institution = await prisma.$transaction(async (tx) => {
        // Update the institution
        const updatedInstitution = await tx.institution.update({
          where: { id: params.id },
          data: {
            name,
            description,
            facilities: facilities ? JSON.stringify(facilities) : null,
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
            website,
            institutionEmail,
            logoUrl: body.logoUrl,
            mainImageUrl: body.mainImageUrl,
          },
          include: {
            users: {
              where: {
                role: 'INSTITUTION'
              },
              select: {
                email: true,
                role: true
              },
              take: 1
            },
          },
        });

        console.log('Updated institution:', updatedInstitution);

        // Update the user's email if it has changed
        if (institutionAdmin && email !== institutionAdmin.email) {
          const updatedUser = await tx.user.update({
            where: { id: institutionAdmin.id },
            data: { email },
          });
          console.log('Updated user:', updatedUser);
        }

        return updatedInstitution;
      });

      const updatedAdmin = institution.users[0];
      console.log('Updated admin:', updatedAdmin);

      return NextResponse.json({
        id: institution.id,
        name: institution.name,
        email: updatedAdmin?.email,
        institutionEmail: institution.institutionEmail,
        website: institution.website,
        description: institution.description,
        country: institution.country,
        city: institution.city,
        state: institution.state,
        postcode: institution.postcode,
        address: institution.address,
        telephone: institution.telephone,
        contactName: institution.contactName,
        contactJobTitle: institution.contactJobTitle,
        contactPhone: institution.contactPhone,
        contactEmail: institution.contactEmail,
        logoUrl: institution.logoUrl,
        mainImageUrl: institution.mainImageUrl,
        facilities: parseFacilities(institution.facilities),
        createdAt: institution.createdAt,
        userRole: updatedAdmin?.role
      });
    } catch (transactionError) {
      console.error('Transaction error:');
      throw transactionError;
    }
  } catch (error) {
    console.error('Error updating institution:');
    return NextResponse.json(
      { 
        error: 'Failed to update institution',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 