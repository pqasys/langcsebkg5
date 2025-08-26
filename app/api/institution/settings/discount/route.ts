import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!session.user.role || session.user.role !== 'INSTITUTION') {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json(
        { message: 'Institution not found' },
        { status: 404 }
      );
    }

    const institution = await prisma.institution.findUnique({
      where: {
        id: user.institution.id,
      },
      select: {
        id: true,
        discountSettings: true,
      },
    });

    if (!institution) {
      return NextResponse.json(
        { message: 'Institution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(institution.discountSettings);
  } catch (error) {
    console.error('Error fetching discount settings:');
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!session.user.role || session.user.role !== 'INSTITUTION') {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { enabled, startingRate, incrementRate, incrementPeriodWeeks, maxDiscountCap } = body;

    // Validate the input
    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { message: 'Enabled must be a boolean' },
        { status: 400 }
      );
    }

    if (typeof startingRate !== 'number' || startingRate < 0 || startingRate > 100) {
      return NextResponse.json(
        { message: 'Starting rate must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    if (typeof incrementRate !== 'number' || incrementRate < 0 || incrementRate > 100) {
      return NextResponse.json(
        { message: 'Increment rate must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    if (typeof incrementPeriodWeeks !== 'number' || incrementPeriodWeeks < 1) {
      return NextResponse.json(
        { message: 'Increment period must be a positive number' },
        { status: 400 }
      );
    }

    if (typeof maxDiscountCap !== 'number' || maxDiscountCap < 0 || maxDiscountCap > 100) {
      return NextResponse.json(
        { message: 'Maximum discount cap must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json(
        { message: 'Institution not found' },
        { status: 404 }
      );
    }

    const updatedInstitution = await prisma.institution.update({
      where: {
        id: user.institution.id,
      },
      data: {
        discountSettings: {
          enabled,
          startingRate,
          incrementRate,
          incrementPeriodWeeks,
          maxDiscountCap,
        },
      },
      select: {
        id: true,
        discountSettings: true,
      },
    });

    return NextResponse.json(updatedInstitution.discountSettings);
  } catch (error) {
    console.error('Error updating discount settings:');
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 