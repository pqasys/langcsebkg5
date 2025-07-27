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

    // Get institution info with basic stats
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
        courses: {
          where: { status: 'ACTIVE' },
          select: { id: true }
        },
        users: {
          where: { role: 'STUDENT' },
          select: { id: true }
        }
      }
    });

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    const institutionInfo = {
      ...institution,
      courseCount: institution.courses.length,
      studentCount: institution.users.length,
      courses: undefined, // Remove from response
      users: undefined // Remove from response
    };

    return NextResponse.json(institutionInfo);

  } catch (error) {
    console.error('Error fetching institution info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institution info' },
      { status: 500 }
    );
  }
} 