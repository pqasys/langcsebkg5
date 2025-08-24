import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notificationService } from '@/lib/notification';
import { ConnectionIncentivesService } from '@/lib/connection-incentives-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { receiverId, message } = body;

    if (!receiverId) {
      return NextResponse.json(
        { error: 'Receiver ID is required' },
        { status: 400 }
      );
    }

    // Check if receiver exists and has public profile
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: {
        id: true,
        name: true,
        email: true,
        profileVisibility: true,
        status: true
      }
    });

    if (!receiver) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (receiver.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'User account is not active' },
        { status: 400 }
      );
    }

    if (receiver.profileVisibility === 'PRIVATE') {
      return NextResponse.json(
        { error: 'Cannot send connection request to private profile' },
        { status: 403 }
      );
    }

    // Check if sender and receiver are the same
    if (session.user.id === receiverId) {
      return NextResponse.json(
        { error: 'Cannot send connection request to yourself' },
        { status: 400 }
      );
    }

    // Check if connection request already exists
    const existingRequest = await prisma.connectionRequest.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId },
          { senderId: receiverId, receiverId: session.user.id }
        ]
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Connection request already exists' },
        { status: 409 }
      );
    }

    // Check if users are already connected
    const existingConnection = await prisma.userConnection.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, user2Id: receiverId },
          { user1Id: receiverId, user2Id: session.user.id }
        ]
      }
    });

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Users are already connected' },
        { status: 409 }
      );
    }

    // Create connection request
    const connectionRequest = await prisma.connectionRequest.create({
      data: {
        senderId: session.user.id,
        receiverId,
        message: message || null
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Award points for sending connection request
    try {
      await ConnectionIncentivesService.awardPoints(
        session.user.id,
        'sendConnectionRequest',
        `Sent connection request to ${connectionRequest.receiver.name}`
      )
    } catch (error) {
      console.error('Error awarding points for connection request:', error)
    }

    // Send notification to receiver
    try {
      await notificationService.sendNotificationWithTemplate(
        'connection_request_received',
        receiverId,
        {
          senderName: connectionRequest.sender.name,
          receiverName: connectionRequest.receiver.name,
          message: message || 'Would like to connect with you',
          connectionRequestUrl: `${process.env.NEXTAUTH_URL}/connections/requests`
        },
        {
          connectionRequestId: connectionRequest.id,
          senderId: session.user.id
        },
        session.user.id
      );
    } catch (notificationError) {
      console.error('Failed to send connection request notification:', notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: connectionRequest.id,
        status: connectionRequest.status,
        createdAt: connectionRequest.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating connection request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
