import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['PENDING', 'ACTIVE', 'SUSPENDED', 'APPROVED', 'REJECTED'];

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Get the institution admin user first
    const institutionAdmin = await prisma.user.findFirst({
      where: {
        institutionId: params.id,
        role: 'INSTITUTION'
      },
      select: {
        email: true
      }
    });

    // Update the institution status
    const updatedInstitution = await prisma.institution.update({
      where: { id: params.id },
      data: { 
        status,
        // If status is APPROVED or ACTIVE, also set isApproved to true
        isApproved: status === 'APPROVED' || status === 'ACTIVE' ? true : undefined
      }
    });

    return NextResponse.json({
      id: updatedInstitution.id,
      name: updatedInstitution.name,
      email: institutionAdmin?.email,
      status: updatedInstitution.status,
      isApproved: updatedInstitution.isApproved,
    });
  } catch (error) {
    console.error('Error updating institution status:');
    return NextResponse.json(
      { error: 'Failed to update institution status' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 