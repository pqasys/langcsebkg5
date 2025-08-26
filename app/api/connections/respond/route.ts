import { NextRequest, NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
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
    const { requestId, action } = body; // action: 'accept' or 'decline'

    if (!requestId || !action) {
      return NextResponse.json(
        { error: 'Request ID and action are required' },
        { status: 400 }
      );
    }

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "accept" or "decline"' },
        { status: 400 }
      );
    }

    // Get the connection request
    const connectionRequest = await prisma.connectionRequest.findUnique({
      where: { id: requestId },
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

    if (!connectionRequest) {
      return NextResponse.json(
        { error: 'Connection request not found' },
        { status: 404 }
      );
    }

    // Verify the current user is the receiver
    if (connectionRequest.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only respond to connection requests sent to you' },
        { status: 403 }
      );
    }

    // Check if request is still pending
    if (connectionRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Connection request has already been responded to' },
        { status: 400 }
      );
    }

    const newStatus = action === 'accept' ? 'ACCEPTED' : 'DECLINED';

    // Update the connection request
    const updatedRequest = await prisma.connectionRequest.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        respondedAt: new Date()
      }
    });

    // If accepted, create the connection
    if (action === 'accept') {
      await prisma.userConnection.create({
        data: {
          user1Id: connectionRequest.senderId,
          user2Id: connectionRequest.receiverId
        }
      });

      // Award points for accepting connection request
      try {
        await ConnectionIncentivesService.awardPoints(
          session.user.id,
          'acceptConnectionRequest',
          `Accepted connection request from ${connectionRequest.sender.name}`
        )
      } catch (error) {
        console.error('Error awarding points for accepting connection:', error)
      }

      // Send notification to sender about acceptance
      try {
        await notificationService.sendNotificationWithTemplate(
          'connection_request_accepted',
          connectionRequest.senderId,
          {
            senderName: connectionRequest.sender.name,
            receiverName: connectionRequest.receiver.name,
            receiverProfileUrl: `${process.env.NEXTAUTH_URL}/profile/${connectionRequest.receiverId}`
          },
          {
            connectionRequestId: connectionRequest.id,
            receiverId: session.user.id
          },
          session.user.id
        );
      } catch (notificationError) {
        console.error('Failed to send acceptance notification:', notificationError);
      }

      // Send system notification to both users
      try {
        await notificationService.sendNotificationWithTemplate(
          'new_connection_notification',
          connectionRequest.senderId,
          {
            connectionName: connectionRequest.receiver.name,
            connectionProfileUrl: `${process.env.NEXTAUTH_URL}/profile/${connectionRequest.receiverId}`
          },
          {
            connectionRequestId: connectionRequest.id,
            connectedUserId: connectionRequest.receiverId
          },
          session.user.id
        );

        await notificationService.sendNotificationWithTemplate(
          'new_connection_notification',
          connectionRequest.receiverId,
          {
            connectionName: connectionRequest.sender.name,
            connectionProfileUrl: `${process.env.NEXTAUTH_URL}/profile/${connectionRequest.senderId}`
          },
          {
            connectionRequestId: connectionRequest.id,
            connectedUserId: connectionRequest.senderId
          },
          session.user.id
        );
      } catch (notificationError) {
        console.error('Failed to send new connection notifications:', notificationError);
      }
    } else {
      // Send notification to sender about decline
      try {
        await notificationService.sendNotificationWithTemplate(
          'connection_request_declined',
          connectionRequest.senderId,
          {
            senderName: connectionRequest.sender.name,
            receiverName: connectionRequest.receiver.name
          },
          {
            connectionRequestId: connectionRequest.id,
            receiverId: session.user.id
          },
          session.user.id
        );
      } catch (notificationError) {
        console.error('Failed to send decline notification:', notificationError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        requestId: updatedRequest.id,
        status: updatedRequest.status,
        action,
        respondedAt: updatedRequest.respondedAt
      }
    });

  } catch (error) {
    console.error('Error responding to connection request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
