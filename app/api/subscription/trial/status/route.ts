import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ eligible: false, active: false }, { status: 401 });
    }

    const userId = session.user.id;

    // Check existing subscription
    const sub = await prisma.studentSubscription.findUnique({
      where: { studentId: userId }
    });

    if (!sub) {
      // No subscription at all → eligible to start trial
      return NextResponse.json({ eligible: true, active: false, remainingDays: 7, remainingSeats: 1 });
    }

    // Has a subscription
    const isTrial = (sub.planType || '').toUpperCase() === 'TRIAL';
    const now = new Date();
    const active = isTrial && sub.status === 'ACTIVE' && sub.endDate > now;
    const remainingMs = sub.endDate ? Math.max(0, sub.endDate.getTime() - now.getTime()) : 0;
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

    // Eligible only if no subscription or cancelled/expired trial but no other plan.
    const eligible = !isTrial && sub.status !== 'ACTIVE';

    return NextResponse.json({
      eligible,
      active,
      endDate: sub.endDate,
      remainingDays: active ? remainingDays : 0,
      remainingSeats: active ? Math.max(0, sub.attendanceQuota || 0) : 0
    });
  } catch (error) {
    console.error('Trial status error:', error);
    return NextResponse.json({ error: 'Failed to fetch trial status' }, { status: 500 });
  }
}


