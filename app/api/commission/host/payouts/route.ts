import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get host payouts
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const where: any = {};
    if (hostId) where.hostId = hostId;
    if (status) where.status = status;

    const payouts = await prisma.hostPayout.findMany({
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
        commissions: {
          include: {
            conversation: {
              select: {
                id: true,
                title: true,
                startTime: true,
                endTime: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    });

    const total = await prisma.hostPayout.count({ where });

    return NextResponse.json({
      payouts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching host payouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}

// Create new host payout
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { hostId, commissionIds, scheduledDate } = await request.json();

    if (!hostId || !commissionIds || commissionIds.length === 0) {
      return NextResponse.json({ 
        error: 'Host ID and commission IDs are required' 
      }, { status: 400 });
    }

    // Get pending commissions for the host
    const pendingCommissions = await prisma.hostCommission.findMany({
      where: {
        id: { in: commissionIds },
        hostId: hostId,
        status: 'PENDING'
      }
    });

    if (pendingCommissions.length === 0) {
      return NextResponse.json({ 
        error: 'No pending commissions found' 
      }, { status: 400 });
    }

    // Calculate total payout amount
    const totalAmount = pendingCommissions.reduce(
      (sum, commission) => sum + commission.commissionAmount, 
      0
    );

    // Create payout record
    const payout = await prisma.hostPayout.create({
      data: {
        hostId: hostId,
        amount: totalAmount,
        status: 'PENDING',
        scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
        payoutMethod: 'STRIPE',
        metadata: {
          commissionCount: pendingCommissions.length,
          commissionIds: pendingCommissions.map(c => c.id),
          createdBy: session.user.id,
          createdAt: new Date().toISOString()
        }
      }
    });

    // Update commission records to link to payout
    await prisma.hostCommission.updateMany({
      where: {
        id: { in: commissionIds }
      },
      data: {
        payoutId: payout.id,
        status: 'PROCESSED'
      }
    });

    return NextResponse.json({
      message: 'Payout created successfully',
      payout: {
        id: payout.id,
        hostId: payout.hostId,
        amount: payout.amount,
        status: payout.status,
        scheduledDate: payout.scheduledDate,
        commissionCount: pendingCommissions.length
      }
    });

  } catch (error) {
    console.error('Error creating host payout:', error);
    return NextResponse.json(
      { error: 'Failed to create payout' },
      { status: 500 }
    );
  }
}
