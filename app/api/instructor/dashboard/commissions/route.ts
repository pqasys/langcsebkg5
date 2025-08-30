import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Access denied. Instructor role required.' }, { status: 403 });
    }

    // Get instructor's commissions
    const commissions = await prisma.instructorCommission.findMany({
      where: { instructorId: session.user.id },
      include: {
        videoSession: true,
        tier: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform data for frontend
    const commissionData = commissions.map(commission => ({
      id: commission.id,
      classTitle: commission.videoSession.title,
      date: commission.createdAt,
      amount: commission.amount,
      status: commission.status,
      tier: commission.tier?.displayName || 'Bronze',
      commissionRate: commission.commissionRate
    }));

    return NextResponse.json({ commissions: commissionData });
  } catch (error) {
    console.error('Error fetching instructor commissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructor commissions' },
      { status: 500 }
    );
  }
}

