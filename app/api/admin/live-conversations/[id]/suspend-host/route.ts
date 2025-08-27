import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { reason, durationDays = 7 } = await request.json()

    // Verify conversation exists and get host info
    const conversation = await prisma.liveConversation.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (!conversation.host) {
      return NextResponse.json({ error: 'Host not found' }, { status: 404 })
    }

    // Check if user is already suspended
    const existingSuspension = await prisma.userSuspension.findFirst({
      where: {
        userId: conversation.host.id,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (existingSuspension) {
      return NextResponse.json(
        { error: 'User is already suspended' },
        { status: 400 }
      )
    }

    // Create suspension
    const suspension = await prisma.userSuspension.create({
      data: {
        userId: conversation.host.id,
        adminId: session.user.id,
        reason: reason || 'Admin moderation',
        durationDays: parseInt(durationDays),
        expiresAt: new Date(Date.now() + parseInt(durationDays) * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        metadata: {
          conversationId: id,
          conversationTitle: conversation.title,
          suspendedAt: new Date().toISOString()
        }
      }
    })

    // Cancel all future conversations by this host
    const cancelledConversations = await prisma.liveConversation.updateMany({
      where: {
        hostId: conversation.host.id,
        status: 'SCHEDULED',
        startTime: {
          gt: new Date()
        }
      },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date()
      }
    })

    // Log the moderation action
    await prisma.adminActionLog.create({
      data: {
        adminId: session.user.id,
        action: 'SUSPEND_HOST',
        targetType: 'USER',
        targetId: conversation.host.id,
        reason: reason || 'Admin moderation',
        metadata: {
          conversationId: id,
          conversationTitle: conversation.title,
          hostName: conversation.host.name,
          hostEmail: conversation.host.email,
          suspensionDuration: durationDays,
          cancelledConversationsCount: cancelledConversations.count,
          suspendedAt: new Date().toISOString()
        }
      }
    })

    // TODO: Send notification to suspended user
    // TODO: Send email notification about suspension

    return NextResponse.json({
      success: true,
      message: 'Host suspended successfully',
      suspension: {
        id: suspension.id,
        userId: suspension.userId,
        durationDays: suspension.durationDays,
        expiresAt: suspension.expiresAt,
        reason: suspension.reason
      },
      cancelledConversations: cancelledConversations.count
    })

  } catch (error) {
    console.error('Error suspending host:', error)
    return NextResponse.json(
      { error: 'Failed to suspend host' },
      { status: 500 }
    )
  }
}
