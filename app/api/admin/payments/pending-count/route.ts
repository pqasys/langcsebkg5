import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isBuildTime } from '@/lib/build-error-handler';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json({ count: 0 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can access this endpoint' },
        { status: 403 }
      );
    }

    // Count payments that are awaiting approval (PENDING, PROCESSING, or INITIATED)
    const pendingCount = await prisma.payment.count({
      where: {
        status: {
          in: ['PENDING', 'PROCESSING', 'INITIATED']
        }
      }
    });

    return NextResponse.json({
      count: pendingCount
    });
  } catch (error) {
    console.error('Error fetching pending payments count:');
    return NextResponse.json(
      { error: 'Failed to fetch pending payments count' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 