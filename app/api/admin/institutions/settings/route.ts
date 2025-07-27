import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get institution settings
    const settings = await prisma.institution.findMany({
      where: {
        isApproved: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        isApproved: true,
        commissionRate: true,
        subscriptionPlan: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(settings);

  } catch (error) {
    console.error('Error fetching institution settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institution settings' },
      { status: 500 }
    );
  }
} 