import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get host tier assignments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get('hostId');
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const where: any = {};
    if (hostId) where.hostId = hostId;
    if (isActive === 'true') where.endDate = null;
    if (isActive === 'false') where.endDate = { not: null };

    const assignments = await prisma.hostCommissionTierAssignment.findMany({
      where,
      include: {
        tier: true,
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { startDate: 'desc' },
      skip: offset,
      take: limit
    });

    const total = await prisma.hostCommissionTierAssignment.count({ where });

    return NextResponse.json({
      assignments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching host tier assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}
