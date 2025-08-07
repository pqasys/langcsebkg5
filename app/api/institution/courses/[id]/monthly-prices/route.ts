import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prices, year } = await request.json();
    // // // // // // console.log('Updating monthly prices for course:', params.id, 'year:', year);

    // Verify the course belongs to the institution
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: session.user.institutionId
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing prices for the year
      await tx.course_monthly_price.deleteMany({
        where: {
          courseId: params.id,
          year: year
        }
      });

      // Create new prices
      const monthlyPrices = await tx.course_monthly_price.createMany({
        data: prices.map((price: unknown) => ({
          id: uuidv4(),
          courseId: params.id,
          monthNumber: price.monthNumber,
          year: price.year,
          price: price.price,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      });

      return monthlyPrices;
    });

    // Fetch the updated prices
    const updatedPrices = await prisma.course_monthly_price.findMany({
      where: {
        courseId: params.id,
        year: year
      },
      orderBy: {
        monthNumber: 'asc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      count: result.count,
      prices: updatedPrices 
    });
  } catch (error) {
    console.error('Error updating monthly prices:');
    return NextResponse.json(
      { 
        error: 'Failed to update monthly prices',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    console.log('Fetching monthly prices for course:', params.id, 'year:', year);

    // Verify the course exists and user has access
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        // For institution users, check institutionId
        // For admin users, allow access to all courses
        ...(session.user.role === 'INSTITUTION' ? { institutionId: session.user.institutionId } : {})
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Fetch monthly prices for the course and year
    const monthlyPrices = await prisma.course_monthly_price.findMany({
      where: {
        courseId: params.id,
        year: year
      },
      orderBy: {
        monthNumber: 'asc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      prices: monthlyPrices 
    });
  } catch (error) {
    console.error('Error fetching monthly prices:');
    return NextResponse.json(
      { 
        error: 'Failed to fetch monthly prices',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 