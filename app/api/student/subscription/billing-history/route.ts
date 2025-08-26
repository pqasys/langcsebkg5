import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a student
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { student: true }
    });

    if (!user?.student) {
      return NextResponse.json({ error: 'Student account required' }, { status: 403 });
    }

    // Get subscription
    const subscription = await prisma.studentSubscription.findUnique({
      where: { 
        studentId: user.student.id
      }
    });

    if (!subscription) {
      return NextResponse.json({ billingHistory: [] });
    }

    // Get billing history with pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const [billingHistory, totalCount] = await Promise.all([
      prisma.studentBillingHistory.findMany({
        where: { subscriptionId: subscription.id },
        orderBy: { billingDate: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.studentBillingHistory.count({
        where: { subscriptionId: subscription.id }
      })
    ]);

    return NextResponse.json({
      billingHistory: billingHistory.map(item => ({
        id: item.id,
        billingDate: item.billingDate.toISOString(),
        amount: item.amount,
        currency: item.currency,
        status: item.status,
        paymentMethod: item.paymentMethod,
        transactionId: item.transactionId,
        invoiceNumber: item.invoiceNumber,
        description: item.description,
        createdAt: item.createdAt.toISOString()
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching student billing history:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 