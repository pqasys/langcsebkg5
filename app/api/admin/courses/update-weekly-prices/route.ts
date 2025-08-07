import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role?.toUpperCase() === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, year } = await req.json();
    const nextYear = year + 1;

    // First, get the prices from next year
    const nextYearPrices = await prisma.course_weekly_prices.findMany({
      where: {
        courseId,
        year: nextYear
      },
      orderBy: {
        weekNumber: 'asc'
      }
    });

    if (nextYearPrices.length === 0) {
      return NextResponse.json({ error: 'No prices found for next year' }, { status: 404 });
    }

    // Delete any existing prices for current year
          await prisma.course_weekly_prices.deleteMany({
      where: {
        courseId,
        year: year
      }
    });

    // Create new prices for current year based on next year's prices
    const currentYearPrices = await Promise.all(
      nextYearPrices.map(price => 
        prisma.course_weekly_prices.create({
          data: {
            courseId,
            year: year,
            weekNumber: price.weekNumber,
            price: price.price
          }
        })
      )
    );

    // Fetch the updated course with weekly prices
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        weeklyPrices: {
          where: {
            year: year
          },
          orderBy: {
            weekNumber: 'asc'
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      updatedPrices: currentYearPrices,
      course 
    });
  } catch (error) {
    console.error('Error updating weekly prices:');
    return NextResponse.json({ error: 'Failed to update weekly prices' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 