import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id) {
      return NextResponse.json({ error: 'Institution ID is required' }, { status: 400 });
    }

    // First verify the current state
    const currentInstitution = await prisma.institution.findUnique({
      where: { id },
      select: { isApproved: true }
    });

    if (!currentInstitution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Update the institution
    const updatedInstitution = await prisma.institution.update({
      where: { id },
      data: {
        isApproved: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        description: true,
        country: true,
        city: true,
        state: true,
        postcode: true,
        address: true,
        telephone: true,
        contactName: true,
        contactJobTitle: true,
        contactPhone: true,
        contactEmail: true,
        logoUrl: true,
        facilities: true,
        status: true,
        isApproved: true,
        createdAt: true
      },
    });

    // Get course count separately
    const courseCount = await prisma.course.count({
      where: { institutionId: id }
    });

    const institutionWithCount = {
      ...updatedInstitution,
      _count: {
        courses: courseCount
      }
    };

    // Verify the update was successful
    const verifiedInstitution = await prisma.institution.findUnique({
      where: { id },
      select: { isApproved: true }
    });

    if (!verifiedInstitution?.isApproved) {
      throw new Error(`Failed to verify institution approval - Context: throw new Error('Failed to verify institution appr...`);
    }

    // Create a response with cache control headers
    const response = NextResponse.json(institutionWithCount);
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error approving institution:');
    return NextResponse.json(
      { error: 'Failed to approve institution' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 