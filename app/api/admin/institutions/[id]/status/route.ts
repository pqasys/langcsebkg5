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
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const updatedInstitution = await prisma.institution.update({
      where: { id: params.id },
      data: {
        status
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({
      id: updatedInstitution.id,
      name: updatedInstitution.name,
      email: updatedInstitution.user[0].email,
      description: updatedInstitution.description,
      country: updatedInstitution.country,
      city: updatedInstitution.city,
      address: updatedInstitution.address,
      logoUrl: updatedInstitution.logoUrl,
      facilities: updatedInstitution.facilities,
      status: updatedInstitution.status,
      createdAt: updatedInstitution.createdAt,
    });
  } catch (error) {
    console.error('Error updating institution status:');
    return NextResponse.json(
      { error: 'Failed to update institution status' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 