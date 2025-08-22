import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });

    // Get student record
    const student = await prisma.student.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, status: true }
    });

    // Get subscription directly from database
    const subscription = await prisma.studentSubscription.findUnique({
      where: { studentId: userId },
      include: {
        studentTier: true
      }
    });

    // Get subscription status using the service
    const subscriptionStatus = await SubscriptionCommissionService.getUserSubscriptionStatus(userId);

    // Get all subscriptions for this user (in case there are multiple)
    const allSubscriptions = await prisma.studentSubscription.findMany({
      where: { studentId: userId },
      include: {
        studentTier: true
      }
    });

    return NextResponse.json({
      user,
      student,
      subscription,
      subscriptionStatus,
      allSubscriptions,
      debug: {
        userId,
        hasSubscription: !!subscription,
        subscriptionCount: allSubscriptions.length,
        subscriptionStatus: subscription?.status,
        tierType: subscription?.studentTier?.planType
      }
    });
  } catch (error) {
    console.error('Error in subscription status debug:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
