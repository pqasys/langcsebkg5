import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get instructor tiers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const tiers = await prisma.instructorCommissionTier.findMany({
      where,
      orderBy: [
        { commissionRate: 'desc' },
        { effectiveDate: 'desc' }
      ]
    });

    return NextResponse.json({ tiers });

  } catch (error) {
    console.error('Error fetching instructor tiers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tiers' },
      { status: 500 }
    );
  }
}

// Create new instructor tier
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      tierName,
      displayName,
      commissionRate,
      minSessions,
      maxSessions,
      requirements,
      benefits,
      color
    } = await request.json();

    if (!tierName || !displayName || !commissionRate) {
      return NextResponse.json({ 
        error: 'Tier name, display name, and commission rate are required' 
      }, { status: 400 });
    }

    // Check if tier name already exists
    const existingTier = await prisma.instructorCommissionTier.findFirst({
      where: { tierName }
    });

    if (existingTier) {
      return NextResponse.json({ 
        error: 'Tier name already exists' 
      }, { status: 400 });
    }

    const tier = await prisma.instructorCommissionTier.create({
      data: {
        tierName,
        displayName,
        commissionRate: parseFloat(commissionRate),
        minSessions: minSessions ? parseInt(minSessions) : 0,
        maxSessions: maxSessions ? parseInt(maxSessions) : null,
        requirements: requirements || '',
        benefits: benefits || [],
        color: color || '#6B7280',
        effectiveDate: new Date(),
        isActive: true,
        metadata: {
          createdBy: session.user.id,
          createdAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      message: 'Tier created successfully',
      tier
    });

  } catch (error) {
    console.error('Error creating instructor tier:', error);
    return NextResponse.json(
      { error: 'Failed to create tier' },
      { status: 500 }
    );
  }
}
