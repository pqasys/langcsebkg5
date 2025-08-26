import { NextRequest, NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    // Check if we're in a build context (no headers available)
    if (!request.headers.get('authorization') && !request.headers.get('cookie')) {
      // During static generation, return empty data instead of error
      return NextResponse.json({
        success: true,
        sessions: []
      });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTITUTION' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get video sessions for the institution
    const sessions = await prisma.videoSession.findMany({
      where: {
        institutionId: session.user.institutionId || undefined,
        ...(session.user.role === 'ADMIN' ? {} : { instructorId: session.user.id })
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('Failed to fetch institution video sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video sessions' },
      { status: 500 }
    );
  }
} 