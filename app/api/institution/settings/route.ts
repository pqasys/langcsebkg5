import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get institution ID from session
    const institutionId = session.user.institutionId;
    if (!institutionId) {
      return NextResponse.json({ error: 'No institution associated' }, { status: 400 });
    }

    // Get institution settings
    const settings = await prisma.institution.findUnique({
      where: { id: institutionId },
      select: {
        id: true,
        name: true,
        email: true,
        commissionRate: true,
        subscriptionPlan: true,
        isApproved: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!settings) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    return NextResponse.json(settings);

  } catch (error) {
    console.error('Error fetching institution settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institution settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { institutionId, defaultMaxStudents, currency, commissionRate, discountSettings } = body;

    if (!institutionId) {
      return new NextResponse('Institution ID is required', { status: 400 });
    }

    const institution = await prisma.institution.update({
      where: { id: institutionId },
      data: {
        defaultMaxStudents,
        currency,
        commissionRate,
        discountSettings
      }
    });

    return NextResponse.json(institution);
  } catch (error) {
    console.error('Error updating institution settings:');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 