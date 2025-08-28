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

    const { conversationId } = await request.json();

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    // Get the live conversation with participant data
    const liveConversation = await prisma.liveConversation.findUnique({
      where: { id: conversationId },
      include: {
        host: true,
        participants: {
          where: { status: 'JOINED' },
          include: { user: true }
        },
        bookings: {
          where: { status: 'CONFIRMED' },
          include: { conversation: true }
        }
      }
    });

    if (!liveConversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Calculate commission based on unified model
    const participantCount = liveConversation.participants.length;
    const bookingCount = liveConversation.bookings.length;
    
    // Use credit-based pricing if enabled
    const isCreditBased = liveConversation.isCreditBased;
    const creditPrice = liveConversation.creditPrice || 25;
    const commissionRate = liveConversation.hostCommissionRate || 70.0;

    let totalRevenue = 0;
    let hostCommission = 0;

    if (isCreditBased) {
      // Credit-based calculation
      totalRevenue = participantCount * creditPrice; // 1 credit = $1
      hostCommission = (totalRevenue * commissionRate) / 100;
    } else {
      // Traditional pricing (fallback)
      totalRevenue = liveConversation.price * bookingCount;
      hostCommission = (totalRevenue * commissionRate) / 100;
    }

    // Check if commission already exists
    const existingCommission = await prisma.hostCommission.findFirst({
      where: {
        conversationId: conversationId,
        hostId: liveConversation.hostId
      }
    });

    if (existingCommission) {
      return NextResponse.json({
        message: 'Commission already calculated',
        commission: existingCommission
      });
    }

    // Create commission record
    const commission = await prisma.hostCommission.create({
      data: {
        hostId: liveConversation.hostId,
        conversationId: conversationId,
        sessionPrice: liveConversation.price,
        creditPrice: creditPrice,
        commissionAmount: hostCommission,
        commissionRate: commissionRate,
        status: 'PENDING',
        metadata: {
          participantCount,
          bookingCount,
          isCreditBased,
          calculatedAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      message: 'Commission calculated successfully',
      commission: {
        id: commission.id,
        hostId: commission.hostId,
        conversationId: commission.conversationId,
        commissionAmount: commission.commissionAmount,
        commissionRate: commission.commissionRate,
        status: commission.status,
        metadata: commission.metadata
      },
      calculation: {
        totalRevenue,
        hostCommission,
        participantCount,
        bookingCount,
        isCreditBased,
        creditPrice
      }
    });

  } catch (error) {
    console.error('Error calculating host commission:', error);
    return NextResponse.json(
      { error: 'Failed to calculate commission' },
      { status: 500 }
    );
  }
}
