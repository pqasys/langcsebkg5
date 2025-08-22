import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/live-conversations/[id]/join
// Ensures a booking exists, checks time window, creates/loads a VideoSession, and returns a session id to open
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversationId = params.id

    const conversation = await prisma.liveConversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Ensure booking exists (idempotent)
    let booking = await prisma.liveConversationBooking.findFirst({
      where: { conversationId, userId: session.user.id, status: { not: 'CANCELLED' } },
    })

    if (!booking) {
      // Minimal capacity check before auto-booking
      if (conversation.currentParticipants >= conversation.maxParticipants) {
        return NextResponse.json({ error: 'Conversation is full' }, { status: 400 })
      }

      booking = await prisma.liveConversationBooking.create({
        data: {
          conversationId,
          userId: session.user.id,
          status: conversation.isFree ? 'CONFIRMED' : 'PENDING',
          bookedAt: new Date(),
          paymentStatus: conversation.isFree ? 'PAID' : 'PENDING',
          amount: Number(conversation.price || 0),
          currency: 'USD',
        },
      })

      // Increment participants count
      await prisma.liveConversation.update({
        where: { id: conversationId },
        data: { currentParticipants: { increment: 1 } },
      })
    }

    // Time gating: allow join within 15 minutes before start until end
    const now = new Date()
    const joinOpensAt = new Date(conversation.startTime)
    joinOpensAt.setMinutes(joinOpensAt.getMinutes() - 15)
    const joinClosesAt = new Date(conversation.endTime)

    if (now < joinOpensAt) {
      return NextResponse.json({ error: 'Session not started yet. Please return closer to the start time.' }, { status: 403 })
    }
    if (now > joinClosesAt) {
      return NextResponse.json({ error: 'Session has ended.' }, { status: 410 })
    }

    // Ensure a VideoSession exists for this conversation
    let video = await prisma.videoSession.findFirst({ where: { meetingId: conversationId } })
    if (!video) {
      video = await prisma.videoSession.create({
        data: {
          title: conversation.title,
          description: conversation.description || undefined,
          sessionType: 'LIVE_CONVERSATION',
          language: conversation.language,
          level: conversation.level,
          startTime: conversation.startTime,
          endTime: conversation.endTime,
          duration: conversation.duration,
          status: 'SCHEDULED',
          instructorId: conversation.instructorId || conversation.hostId,
          meetingId: conversationId,
          isPublic: false,
        },
      })
    }

    // Ensure participant record exists for this user in the video session
    await prisma.videoSessionParticipant.upsert({
      where: {
        sessionId_userId: { sessionId: video.id, userId: session.user.id },
      },
      update: { isActive: false },
      create: {
        sessionId: video.id,
        userId: session.user.id,
        role: 'PARTICIPANT',
        isActive: false,
      },
    })

    return NextResponse.json({ success: true, videoSessionId: video.id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join session' }, { status: 500 })
  }
}

