import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Fetch featured live conversations
    const featuredConversations = await prisma.liveConversation.findMany({
      where: {
        status: 'SCHEDULED',
        startTime: {
          gte: new Date(), // Only future sessions
        },
        isPublic: true,
      },
      take: 6, // Limit to 6 featured sessions
      orderBy: {
        startTime: 'asc', // Show earliest sessions first
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            participants: true,
            bookings: true,
          },
        },
      },
    });

    // Transform the data for frontend consumption
    const transformedConversations = featuredConversations.map(conversation => ({
      id: conversation.id,
      title: conversation.title,
      description: conversation.description,
      language: conversation.language,
      level: conversation.level,
      startTime: conversation.startTime,
      endTime: conversation.endTime,
      duration: conversation.duration,
      maxParticipants: conversation.maxParticipants,
      currentParticipants: conversation._count.participants,
      price: conversation.price,
      isFree: conversation.isFree,
      topic: conversation.topic,
      host: conversation.host,
      participantCount: conversation._count.participants,
      bookingCount: conversation._count.bookings,
    }));

    return NextResponse.json({
      featuredConversations: transformedConversations,
    });
  } catch (error) {
    console.error('Error fetching featured conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured conversations' },
      { status: 500 }
    );
  }
}
