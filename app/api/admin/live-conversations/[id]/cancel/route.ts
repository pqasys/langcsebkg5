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
    const { reason } = await request.json()

    // Verify conversation exists
    const conversation = await prisma.liveConversation.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Only allow cancellation of scheduled conversations
    if (conversation.status !== 'SCHEDULED') {
      return NextResponse.json(
        { error: 'Can only cancel scheduled conversations' },
        { status: 400 }
      )
    }

    // Cancel the conversation
    const updatedConversation = await prisma.liveConversation.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date()
      }
    })

    // Log the moderation action
    await prisma.adminActionLog.create({
      data: {
        adminId: session.user.id,
        action: 'CANCEL_CONVERSATION',
        targetType: 'LIVE_CONVERSATION',
        targetId: id,
        reason: reason || 'Admin moderation',
        metadata: {
          conversationTitle: conversation.title,
          hostName: conversation.host?.name,
          hostEmail: conversation.host?.email,
          originalStatus: conversation.status,
          cancelledAt: new Date().toISOString()
        }
      }
    })

    // TODO: Send notification to host and participants about cancellation
    // TODO: Send email notification to host

    return NextResponse.json({
      success: true,
      message: 'Conversation cancelled successfully',
      conversation: updatedConversation
    })

  } catch (error) {
    console.error('Error cancelling conversation:', error)
    return NextResponse.json(
      { error: 'Failed to cancel conversation' },
      { status: 500 }
    )
  }
}


