import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || userId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if user has hosted any conversations
    const hostedConversations = await prisma.liveConversation.findMany({
      where: { hostId: userId },
      include: {
        participants: true,
        hostCommissions: true
      },
      orderBy: { startTime: 'desc' }
    });

    // If user hasn't hosted any conversations, return null
    if (hostedConversations.length === 0) {
      return NextResponse.json(null);
    }

    // Get host tier assignment
    const tierAssignment = await prisma.hostCommissionTierAssignment.findFirst({
      where: { hostId: userId },
      include: {
        tier: true
      }
    });

    // Calculate statistics
    const totalConversations = hostedConversations.length;
    const totalEarnings = hostedConversations.reduce((sum, conversation) => {
      const conversationCommissions = conversation.hostCommissions.reduce((commissionSum, commission) => {
        return commissionSum + commission.amount;
      }, 0);
      return sum + conversationCommissions;
    }, 0);

    const totalParticipants = hostedConversations.reduce((sum, conversation) => {
      return sum + conversation.participants.length;
    }, 0);

    // Calculate average rating (placeholder - would need rating system)
    const averageRating = 4.3; // This would come from actual ratings

    // Get tier information
    const currentTier = tierAssignment?.tier || { displayName: 'Community', minConversations: 0, maxConversations: 5 };
    const nextTier = await prisma.hostCommissionTier.findFirst({
      where: {
        minConversations: { gt: currentTier.maxConversations },
        isActive: true
      },
      orderBy: { minConversations: 'asc' }
    });

    // Calculate tier progress
    const tierProgress = nextTier 
      ? Math.min(100, Math.round((totalConversations / nextTier.minConversations) * 100))
      : 100;

    const nextTierRequirements = nextTier 
      ? `Host ${nextTier.minConversations - totalConversations} more conversations to reach ${nextTier.displayName} tier`
      : 'You have reached the highest tier!';

    // Get tier benefits
    const tierBenefits = currentTier.benefits ? JSON.parse(currentTier.benefits) : [
      'Earn commissions from conversations',
      'Access to hosting tools',
      'Community recognition'
    ];

    // Get recent conversations
    const recentConversations = hostedConversations.slice(0, 5).map(conversation => ({
      id: conversation.id,
      title: conversation.title,
      date: conversation.startTime,
      participants: conversation.participants.length,
      earnings: conversation.hostCommissions.reduce((sum, commission) => sum + commission.amount, 0)
    }));

    const hostStats = {
      totalConversations,
      totalEarnings,
      averageRating,
      totalParticipants,
      currentTier: currentTier.displayName,
      tierProgress,
      nextTierRequirements,
      tierBenefits,
      recentConversations
    };

    return NextResponse.json(hostStats);
  } catch (error) {
    console.error('Error fetching host stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch host statistics' },
      { status: 500 }
    );
  }
}

