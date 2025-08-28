import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Get the video session with attendance data
    const videoSession = await prisma.videoSession.findUnique({
      where: { id: sessionId },
      include: {
        instructor: true,
        attendances: {
          where: { attended: true },
          include: { user: true }
        },
        participants: {
          where: { isActive: true },
          include: { user: true }
        }
      }
    });

    if (!videoSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Calculate commission based on unified model
    const attendanceCount = videoSession.attendances.length;
    const participantCount = videoSession.participants.length;
    
    // Use credit-based pricing if enabled
    const isCreditBased = videoSession.isCreditBased;
    const creditPrice = videoSession.creditPrice || 30;
    const commissionRate = videoSession.instructorCommissionRate || 70.0;

    let totalRevenue = 0;
    let instructorCommission = 0;

    if (isCreditBased) {
      // Credit-based calculation
      totalRevenue = participantCount * creditPrice; // 1 credit = $1
      instructorCommission = (totalRevenue * commissionRate) / 100;
    } else {
      // Traditional pricing (fallback)
      totalRevenue = videoSession.price * participantCount;
      instructorCommission = (totalRevenue * commissionRate) / 100;
    }

    // Check if commission already exists
    const existingCommission = await prisma.instructorCommission.findFirst({
      where: {
        sessionId: sessionId,
        instructorId: videoSession.instructorId
      }
    });

    if (existingCommission) {
      return NextResponse.json({
        message: 'Commission already calculated',
        commission: existingCommission
      });
    }

    // Create commission record
    const commission = await prisma.instructorCommission.create({
      data: {
        instructorId: videoSession.instructorId,
        sessionId: sessionId,
        sessionPrice: videoSession.price,
        creditPrice: creditPrice,
        commissionAmount: instructorCommission,
        commissionRate: commissionRate,
        status: 'PENDING',
        sessionType: 'LIVE_CLASS',
        metadata: {
          attendanceCount,
          participantCount,
          isCreditBased,
          calculatedAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      message: 'Commission calculated successfully',
      commission: {
        id: commission.id,
        instructorId: commission.instructorId,
        sessionId: commission.sessionId,
        commissionAmount: commission.commissionAmount,
        commissionRate: commission.commissionRate,
        status: commission.status,
        sessionType: commission.sessionType,
        metadata: commission.metadata
      },
      calculation: {
        totalRevenue,
        instructorCommission,
        attendanceCount,
        participantCount,
        isCreditBased,
        creditPrice
      }
    });

  } catch (error) {
    console.error('Error calculating instructor commission:', error);
    return NextResponse.json(
      { error: 'Failed to calculate commission' },
      { status: 500 }
    );
  }
}
