import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const subscription = await prisma.institutionSubscription.findUnique({
      where: { id: params.id },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            email: true,
            logoUrl: true
          }
        }
      }
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { planType, status, billingCycle, amount, startDate, endDate } = body;

    // Validate required fields
    if (!planType || !status || !billingCycle || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedSubscription = await prisma.institutionSubscription.update({
      where: { id: params.id },
      data: {
        planType,
        status,
        billingCycle,
        amount: parseFloat(amount),
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        updatedAt: new Date()
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            email: true,
            logoUrl: true
          }
        }
      }
    });

    // // // console.log('Subscription updated successfully');
    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error('Error updating subscription:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 