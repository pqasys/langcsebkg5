import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role?.toUpperCase() !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const id = (await params).id;
    const { isApproved } = await request.json();

    if (typeof isApproved !== 'boolean') {
      return new NextResponse('Invalid approval status', { status: 400 });
    }

    // Get the institution
    const institution = await prisma.institution.findUnique({
      where: { id }
    });

    if (!institution) {
      return new NextResponse('Institution not found', { status: 404 });
    }

    // Get the institution admin user
    const institutionAdmin = await prisma.user.findFirst({
      where: {
        institutionId: id,
        role: 'INSTITUTION'
      },
      select: {
        email: true
      }
    });

    // Update the institution approval status
    const updatedInstitution = await prisma.institution.update({
      where: { id },
      data: { 
        isApproved,
        status: isApproved ? 'APPROVED' : 'PENDING'
      }
    });

    return NextResponse.json({
      id: updatedInstitution.id,
      name: updatedInstitution.name,
      email: institutionAdmin?.email,
      description: updatedInstitution.description,
      country: updatedInstitution.country,
      city: updatedInstitution.city,
      address: updatedInstitution.address,
      logoUrl: updatedInstitution.logoUrl,
      facilities: updatedInstitution.facilities,
      isApproved: updatedInstitution.isApproved,
      status: updatedInstitution.status,
      createdAt: updatedInstitution.createdAt,
    });
  } catch (error) {
    console.error('Error updating institution approval:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 