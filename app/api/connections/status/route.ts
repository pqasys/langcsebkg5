import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Target user ID is required' },
        { status: 400 }
      );
    }

    // Check if users are already connected
    const existingConnection = await prisma.userConnection.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, user2Id: targetUserId },
          { user1Id: targetUserId, user2Id: session.user.id }
        ]
      }
    });

    if (existingConnection) {
      return NextResponse.json({
        success: true,
        status: 'CONNECTED',
        data: {
          connectionId: existingConnection.id,
          connectedAt: existingConnection.createdAt
        }
      });
    }

    // Check for pending connection requests
    const pendingRequest = await prisma.connectionRequest.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: targetUserId, status: 'PENDING' },
          { senderId: targetUserId, receiverId: session.user.id, status: 'PENDING' }
        ]
      }
    });

    if (pendingRequest) {
      const isSender = pendingRequest.senderId === session.user.id;
      return NextResponse.json({
        success: true,
        status: isSender ? 'REQUEST_SENT' : 'REQUEST_RECEIVED',
        data: {
          requestId: pendingRequest.id,
          isSender,
          message: pendingRequest.message,
          createdAt: pendingRequest.createdAt
        }
      });
    }

    // Check for declined/blocked requests
    const declinedRequest = await prisma.connectionRequest.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: targetUserId, status: 'DECLINED' },
          { senderId: targetUserId, receiverId: session.user.id, status: 'DECLINED' }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    if (declinedRequest) {
      const isSender = declinedRequest.senderId === session.user.id;
      return NextResponse.json({
        success: true,
        status: isSender ? 'REQUEST_DECLINED' : 'DECLINED_REQUEST',
        data: {
          requestId: declinedRequest.id,
          isSender,
          declinedAt: declinedRequest.respondedAt
        }
      });
    }

    // Check if target user exists and is connectable
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        profileVisibility: true,
        status: true
      }
    });

    if (!targetUser) {
      return NextResponse.json({
        success: true,
        status: 'USER_NOT_FOUND'
      });
    }

    if (targetUser.status !== 'ACTIVE') {
      return NextResponse.json({
        success: true,
        status: 'USER_INACTIVE'
      });
    }

    if (targetUser.profileVisibility === 'PRIVATE') {
      return NextResponse.json({
        success: true,
        status: 'PROFILE_PRIVATE'
      });
    }

    // Can connect
    return NextResponse.json({
      success: true,
      status: 'CAN_CONNECT',
      data: {
        targetUserId: targetUser.id,
        targetUserName: targetUser.name
      }
    });

  } catch (error) {
    console.error('Error checking connection status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
