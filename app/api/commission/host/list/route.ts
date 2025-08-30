import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get('hostId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const where: any = {};
    if (hostId) where.hostId = hostId;
    if (status) where.status = status;

    const commissions = await prisma.hostCommission.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        conversation: {
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true,
            language: true,
            level: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    });

    const total = await prisma.hostCommission.count({ where });

    // Get payouts for the same host
    const payouts = await prisma.hostPayout.findMany({
      where: hostId ? { hostId } : {},
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      commissions,
      payouts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching host commissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commissions' },
      { status: 500 }
    );
  }
}
