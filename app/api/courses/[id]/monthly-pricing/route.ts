import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // Get monthly prices for the course
    const monthlyPrices = await prisma.courseMonthlyPrice.findMany({
      where: {
        courseId: params.id,
        year: year
      },
      orderBy: {
        monthNumber: 'asc'
      }
    });

    return NextResponse.json({ prices: monthlyPrices });
  } catch (error) {
    console.error('Error fetching monthly prices:');
    return NextResponse.json(
      { error: 'Failed to fetch monthly prices' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prices, year } = body;

    if (!Array.isArray(prices)) {
      return NextResponse.json(
        { error: 'Invalid prices data' },
        { status: 400 }
      );
    }

    // Delete existing prices for the year
    await prisma.courseMonthlyPrice.deleteMany({
      where: {
        courseId: params.id,
        year: year
      }
    });

    // Create new prices
    const createdPrices = await prisma.courseMonthlyPrice.createMany({
      data: prices.map((price: unknown) => ({
        courseId: params.id,
        monthNumber: price.monthNumber,
        year: year,
        price: price.price
      }))
    });

    // // // console.log('Monthly prices saved successfully');
    return NextResponse.json({ 
      message: 'Monthly prices saved successfully',
      count: createdPrices.count
    });
  } catch (error) {
    console.error('Error saving monthly prices:');
    return NextResponse.json(
      { error: 'Failed to save monthly prices' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 