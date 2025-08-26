import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { newRate, reason } = body;

    if (typeof newRate !== 'number' || newRate < 0 || newRate > 100) {
      return NextResponse.json(
        { message: 'Invalid commission rate' },
        { status: 400 }
      );
    }

    // Get the user with their institution
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

    const previousRate = user.institution.commissionRate;

    // Update commission rate and create log in a transaction
    const [updatedInstitution, log] = await prisma.$transaction([
      prisma.institution.update({
        where: { id: user.institution.id },
        data: { commissionRate: newRate },
        select: {
          id: true,
          name: true,
          commissionRate: true
        }
      }),
      prisma.commissionRateLog.create({
        data: {
          id: crypto.randomUUID(),
          institutionId: user.institution.id,
          previousRate,
          newRate,
          changedBy: session.user.id,
          reason
        }
      })
    ]);

    return NextResponse.json({
      institution: updatedInstitution,
      log
    });
  } catch (error) {
    console.error('Error updating commission rate:');
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function GET(request: Request) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user with their institution
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

    const logs = await prisma.commissionRateLog.findMany({
      where: { institutionId: user.institution.id },
      include: {
        changedByUser: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        changedAt: 'desc'
      }
    });

    // Format the response to match the expected interface
    const formattedLogs = logs.map(log => ({
      id: log.id,
      previousRate: log.previousRate,
      newRate: log.newRate,
      changedAt: log.changedAt,
      reason: log.reason,
      user: {
        name: log.changedByUser.name,
        email: log.changedByUser.email
      }
    }));

    return NextResponse.json(formattedLogs);
  } catch (error) {
    console.error('Error fetching commission rate logs:');
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 