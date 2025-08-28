import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get instructor payouts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const instructorId = searchParams.get('instructorId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const where: any = {};
    if (instructorId) where.instructorId = instructorId;
    if (status) where.status = status;

    const payouts = await prisma.instructorPayout.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        commissions: {
          include: {
            session: {
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

    const total = await prisma.instructorPayout.count({ where });

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
    console.error('Error fetching instructor payouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}

// Create new instructor payout
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { instructorId, commissionIds, scheduledDate } = await request.json();

    if (!instructorId || !commissionIds || commissionIds.length === 0) {
      return NextResponse.json({ 
        error: 'Instructor ID and commission IDs are required' 
      }, { status: 400 });
    }

    // Get pending commissions for the instructor
    const pendingCommissions = await prisma.instructorCommission.findMany({
      where: {
        id: { in: commissionIds },
        instructorId: instructorId,
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
    const payout = await prisma.instructorPayout.create({
      data: {
        instructorId: instructorId,
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
    await prisma.instructorCommission.updateMany({
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
        instructorId: payout.instructorId,
        amount: payout.amount,
        status: payout.status,
        scheduledDate: payout.scheduledDate,
        commissionCount: pendingCommissions.length
      }
    });

  } catch (error) {
    console.error('Error creating instructor payout:', error);
    return NextResponse.json(
      { error: 'Failed to create payout' },
      { status: 500 }
    );
  }
}
