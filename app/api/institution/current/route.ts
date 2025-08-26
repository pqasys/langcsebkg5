import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get institution ID from session
    const institutionId = session.user.institutionId;
    if (!institutionId) {
      return NextResponse.json({ error: 'No institution associated' }, { status: 400 });
    }

    // Get current institution data
    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
      select: {
        id: true,
        name: true,
        email: true,
        description: true,
        country: true,
        city: true,
        logoUrl: true,
        mainImageUrl: true,
        isApproved: true,
        status: true,
        commissionRate: true,
        subscriptionPlan: true,
        isFeatured: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    return NextResponse.json(institution);

  } catch (error) {
    console.error('Error fetching institution data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institution data' },
      { status: 500 }
    );
  }
} 