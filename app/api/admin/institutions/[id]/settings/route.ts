import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VALID_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    // // // // // // // // // console.log('Session in PUT:', session); // Debug log
    
    if (!session?.user) {
      console.log('No session found in PUT');
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Case-insensitive role check
    if (!session.user.role || session.user.role !== 'ADMIN') {
      console.log('User is not admin in PUT:', session.user.role);
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { currency, commissionRate } = body;

    // Validate currency
    if (!currency || !VALID_CURRENCIES.includes(currency)) {
      return NextResponse.json(
        { message: 'Invalid currency code' },
        { status: 400 }
      );
    }

    // Validate commission rate range
    if (typeof commissionRate !== 'number' || commissionRate < 0 || commissionRate > 100) {
      return NextResponse.json(
        { message: 'Commission rate must be between 0 and 100' },
        { status: 400 }
      );
    }

    const updatedInstitution = await prisma.institution.update({
      where: {
        id: params.id,
      },
      data: {
        currency,
        commissionRate,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        currency: true,
        commissionRate: true,
      },
    });

    // Log the commission rate change if it was modified
    const currentInstitution = await prisma.institution.findUnique({
      where: { id: params.id },
      select: { commissionRate: true }
    });

    if (currentInstitution && currentInstitution.commissionRate !== commissionRate) {
      await prisma.commissionRateLog.create({
        data: {
          id: crypto.randomUUID(),
          institutionId: params.id,
          previousRate: currentInstitution.commissionRate,
          newRate: commissionRate,
          changedBy: session.user.id,
          reason: body.reason || 'Updated by admin',
          changedAt: new Date()
        }
      });
    }

    return NextResponse.json(updatedInstitution);
  } catch (error) {
    console.error('Error updating institution settings:');
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 