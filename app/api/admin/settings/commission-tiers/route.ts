import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const commissionTiers = await prisma.commissionTier.findMany({
      orderBy: { commissionRate: 'asc' }
    });

    return NextResponse.json(commissionTiers);
  } catch (error) {
    console.error('Error fetching commission tiers:');
    return NextResponse.json(
      { error: 'Failed to fetch commission tiers' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planType, commissionRate, features, isActive } = body;

    const commissionTier = await prisma.commissionTier.create({
      data: {
        planType,
        commissionRate,
        features,
        isActive
      }
    });

    return NextResponse.json(commissionTier);
  } catch (error) {
    console.error('Error creating commission tier:');
    return NextResponse.json(
      { error: 'Failed to create commission tier' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, planType, commissionRate, features, isActive } = body;

    const commissionTier = await prisma.commissionTier.update({
      where: { id },
      data: {
        planType,
        commissionRate,
        features,
        isActive
      }
    });

    return NextResponse.json(commissionTier);
  } catch (error) {
    console.error('Error updating commission tier:');
    return NextResponse.json(
      { error: 'Failed to update commission tier' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 