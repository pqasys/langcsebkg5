import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { subscriptionPlan, commissionRate, isFeatured } = body;

    // Validate input
    if (subscriptionPlan && !['BASIC', 'PROFESSIONAL', 'ENTERPRISE'].includes(subscriptionPlan)) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
      );
    }

    if (commissionRate !== undefined && (commissionRate < 0 || commissionRate > 100)) {
      return NextResponse.json(
        { error: 'Commission rate must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Update institution
    const updatedInstitution = await prisma.institution.update({
      where: { id },
      data: {
        ...(subscriptionPlan && { subscriptionPlan }),
        ...(commissionRate !== undefined && { commissionRate }),
        ...(isFeatured !== undefined && { isFeatured })
      }
    });

    return NextResponse.json({
      success: true,
      institution: updatedInstitution
    });

  } catch (error) {
    console.error('Error updating institution:');
    return NextResponse.json(
      { error: 'Failed to update institution' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 