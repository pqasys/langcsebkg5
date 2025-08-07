import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prices, year } = await request.json();
    const courseId = params.id;

    console.log('Received pricing data:', {
      prices,
      year,
      courseId
    });

    // First get the course to verify ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        institution: true
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user has permission to modify this course
    if (session.user.role !== 'ADMIN' && course.institution.id !== session.user.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete existing prices for the course and year
          await prisma.course_weekly_prices.deleteMany({
      where: {
        courseId,
        year
      }
    });

    // Create new prices
    const now = new Date();
          const weeklyPrices = await prisma.course_weekly_prices.createMany({
      data: prices.map((price: unknown, index: number) => ({
        courseId,
        weekNumber: index + 1,
        year: year,
        price: price.price,
        createdAt: now,
        updatedAt: now
      }))
    });

    console.log('Successfully saved weekly prices:', weeklyPrices);
    return NextResponse.json({ success: true, data: weeklyPrices });
  } catch (error) {
    console.error('Error saving weekly prices:', error);
    return NextResponse.json(
      { error: 'Failed to save weekly prices' },
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
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseId = params.id;
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // First get the course to verify ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        institution: true
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user has permission to view this course
    if (session.user.role !== 'ADMIN' && course.institution.id !== session.user.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const prices = await prisma.course_weekly_prices.findMany({
      where: {
        courseId,
        year
      },
      orderBy: {
        weekNumber: 'asc'
      }
    });

    console.log('Successfully fetched weekly prices:', prices);
    return NextResponse.json({ success: true, data: prices });
  } catch (error) {
    console.error('Error fetching weekly prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly prices' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 