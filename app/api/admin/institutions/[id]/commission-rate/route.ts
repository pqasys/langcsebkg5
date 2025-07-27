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
    if (!session?.user || session.user.role !== 'ADMIN') {
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

    const institution = await prisma.institution.findUnique({
      where: { id: params.id }
    });

    if (!institution) {
      return NextResponse.json(
        { message: 'Institution not found' },
        { status: 404 }
      );
    }

    const previousRate = institution.commissionRate;

    // Update commission rate and create log in a transaction
    const [updatedInstitution, log] = await prisma.$transaction([
      prisma.institution.update({
        where: { id: params.id },
        data: { commissionRate: newRate },
        select: {
          id: true,
          name: true,
          commissionRate: true
        }
      }),
      prisma.commissionRateLog.create({
        data: {
          id: uuidv4(),
          institutionId: params.id,
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
      { message: 'Internal Server Error', error: error.message },
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
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const logs = await prisma.commissionRateLog.findMany({
      where: {
        institutionId: params.id
      },
      orderBy: {
        changedAt: 'desc'
      }
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching commission rate logs:');
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
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
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { newRate, reason } = body;

    if (!newRate || !reason) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      );
    }

    const institution = await prisma.institution.findUnique({
      where: { id: params.id }
    });

    if (!institution) {
      return new NextResponse(
        JSON.stringify({ error: 'Institution not found' }), 
        { status: 404 }
      );
    }

    const log = await prisma.commissionRateLog.create({
      data: {
        id: crypto.randomUUID(),
        institutionId: params.id,
        oldRate: institution.commissionRate,
        newRate,
        reason,
        changedAt: new Date(),
        changedBy: session.user.id
      }
    });

    await prisma.institution.update({
      where: { id: params.id },
      data: { commissionRate: newRate }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error('Error updating commission rate:');
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 