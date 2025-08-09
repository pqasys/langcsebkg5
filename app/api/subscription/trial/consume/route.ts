import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const sub = await prisma.studentSubscription.findUnique({ where: { studentId: userId } });
    if (!sub || (sub.planType || '').toUpperCase() !== 'TRIAL' || sub.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'No active trial' }, { status: 400 });
    }

    if ((sub.attendanceQuota || 0) <= 0) {
      return NextResponse.json({ error: 'Trial quota exhausted' }, { status: 400 });
    }

    const updated = await prisma.studentSubscription.update({
      where: { studentId: userId },
      data: {
        attendanceQuota: Math.max(0, (sub.attendanceQuota || 0) - 1),
        ...(Math.max(0, (sub.attendanceQuota || 0) - 1) === 0 ? { status: 'CANCELLED' } : {})
      }
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    console.error('Trial consume error:', error);
    return NextResponse.json({ error: 'Failed to consume trial' }, { status: 500 });
  }
}


