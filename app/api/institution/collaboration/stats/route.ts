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

    // Get collaboration statistics for the user's institution
    const institutionId = session.user.institutionId;
    if (!institutionId) {
      return NextResponse.json({ error: 'No institution associated' }, { status: 400 });
    }

    const stats = await prisma.institution.findUnique({
      where: { id: institutionId },
      select: {
        id: true,
        name: true,
        courses: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            title: true,
            enrollments: {
              select: { id: true }
            }
          }
        },
        users: {
          where: { role: 'STUDENT' },
          select: { id: true }
        }
      }
    });

    if (!stats) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Mock collaboration data for now - in a real implementation, this would come from actual collaboration tables
    const collaborationStats = {
      totalShared: 0,
      totalReceived: 0,
      totalCopied: 0,
      totalCopiedByOthers: 0,
      averageRating: 0,
      totalRatings: 0,
      topInstitutions: [],
      recentActivity: [],
      monthlyStats: [
        { month: 'Jan', shared: 0, received: 0, copied: 0 },
        { month: 'Feb', shared: 0, received: 0, copied: 0 },
        { month: 'Mar', shared: 0, received: 0, copied: 0 },
        { month: 'Apr', shared: 0, received: 0, copied: 0 },
        { month: 'May', shared: 0, received: 0, copied: 0 },
        { month: 'Jun', shared: 0, received: 0, copied: 0 }
      ]
    };

    return NextResponse.json(collaborationStats);

  } catch (error) {
    console.error('Error fetching collaboration stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collaboration stats' },
      { status: 500 }
    );
  }
} 