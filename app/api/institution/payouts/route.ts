import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const institutionAdmin = await prisma.institutionAdmin.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!institutionAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payouts = await prisma.institutionPayout.findMany({
      where: {
        institutionId: institutionAdmin.institutionId,
      },
      include: {
        enrollment: {
          include: {
            course: true,
            student: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(payouts);
  } catch (error) {
    console.error('Error fetching payouts:');
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const institutionAdmin = await prisma.institutionAdmin.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!institutionAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payoutId, status, notes } = await request.json();

    if (!payoutId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const payout = await prisma.institutionPayout.findFirst({
      where: {
        id: payoutId,
        institutionId: institutionAdmin.institutionId,
      },
    });

    if (!payout) {
      return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
    }

    if (payout.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Payout is not in pending status' },
        { status: 400 }
      );
    }

    const updatedPayout = await prisma.institutionPayout.update({
      where: {
        id: payoutId,
      },
      data: {
        status,
        metadata: {
          ...payout.metadata,
          notes,
          processedAt: new Date().toISOString(),
          processedBy: session.user.id,
        },
      },
    });

    return NextResponse.json(updatedPayout);
  } catch (error) {
    console.error('Error updating payout:');
    return NextResponse.json(
      { error: 'Failed to update payout' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 