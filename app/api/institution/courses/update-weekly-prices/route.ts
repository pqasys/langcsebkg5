import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await req.json();

    // Update weekly prices year to 2024
    const updatedPrices = await prisma.course_weekly_prices.updateMany({
      where: {
        courseId,
        year: 2025
      },
      data: {
        year: 2024
      }
    });

    // Fetch the updated course with weekly prices
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        weeklyPrices: {
          where: {
            year: 2024
          },
          orderBy: {
            weekNumber: 'asc'
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      updatedPrices,
      course 
    });
  } catch (error) {
    console.error('Error updating weekly prices:');
    return NextResponse.json({ error: 'Failed to update weekly prices' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 