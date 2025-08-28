import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's hosted conversations
    const conversations = await prisma.liveConversation.findMany({
      where: { hostId: session.user.id },
      include: {
        participants: true,
        hostCommissions: true
      },
      orderBy: { startTime: 'desc' }
    });

    // Transform data for frontend
    const conversationData = conversations.map(conversation => ({
      id: conversation.id,
      title: conversation.title,
      startTime: conversation.startTime,
      endTime: conversation.endTime,
      status: conversation.status,
      participants: conversation.participants.length,
      maxParticipants: conversation.maxParticipants,
      earnings: conversation.hostCommissions.reduce((sum, commission) => sum + commission.amount, 0),
      rating: 4.3 // Placeholder - would come from actual rating system
    }));

    return NextResponse.json({ conversations: conversationData });
  } catch (error) {
    console.error('Error fetching host conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch host conversations' },
      { status: 500 }
    );
  }
}

