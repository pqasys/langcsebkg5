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

    // If a subscription exists and active, return conflict or existing if trial
    const existing = await prisma.studentSubscription.findUnique({ where: { studentId: userId } });
    const now = new Date();

    if (existing) {
      const isTrial = (existing.planType || '').toUpperCase() === 'TRIAL';
      const isActive = existing.status === 'ACTIVE' && existing.endDate > now;
      if (isTrial && isActive) {
        return NextResponse.json({ success: true, subscription: existing });
      }
      if (existing.status === 'ACTIVE' && !isTrial) {
        return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
      }
    }

    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const trial = await prisma.studentSubscription.upsert({
      where: { studentId: userId },
      update: {
        status: 'ACTIVE',
        startDate: now,
        endDate,
        autoRenew: false,
        canAccessLiveClasses: true,
        attendanceQuota: 1,
        planType: 'TRIAL'
      },
      create: {
        studentId: userId,
        status: 'ACTIVE',
        startDate: now,
        endDate,
        autoRenew: false,
        canAccessLiveClasses: true,
        attendanceQuota: 1,
        studentTierId: (await prisma.studentTier.findFirst({ where: { planType: 'BASIC' }, select: { id: true } }))?.id || (await prisma.studentTier.create({ data: { planType: 'BASIC', name: 'Basic', description: 'Basic tier', price: 0, features: { } as any } })).id,
        planType: 'TRIAL'
      }
    });

    return NextResponse.json({ success: true, subscription: trial });
  } catch (error) {
    console.error('Trial start error:', error);
    return NextResponse.json({ error: 'Failed to start trial' }, { status: 500 });
  }
}


