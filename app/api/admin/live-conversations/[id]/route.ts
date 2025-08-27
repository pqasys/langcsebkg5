import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Get conversation with all related data
    const conversation = await prisma.liveConversation.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true
          }
        },
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        reports: {
          include: {
            reporter: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Transform data for admin view
    const adminConversation = {
      id: conversation.id,
      title: conversation.title,
      description: conversation.description,
      conversationType: conversation.conversationType,
      language: conversation.language,
      level: conversation.level,
      startTime: conversation.startTime.toISOString(),
      endTime: conversation.endTime.toISOString(),
      duration: conversation.duration,
      maxParticipants: conversation.maxParticipants,
      currentParticipants: conversation.participants.length,
      price: conversation.price,
      isFree: conversation.isFree,
      status: conversation.status,
      isPublic: conversation.isPublic,
      hostId: conversation.hostId,
      hostName: conversation.host?.name || 'Unknown',
      hostEmail: conversation.host?.email || '',
      hostImage: conversation.host?.image || null,
      reportCount: conversation.reports.length,
      reports: conversation.reports.map(report => ({
        id: report.id,
        reason: report.reason,
        reporterName: report.reporter?.name || 'Anonymous',
        reporterEmail: report.reporter?.email || '',
        createdAt: report.createdAt.toISOString(),
        status: report.status
      })),
      participants: conversation.participants.map(participant => ({
        id: participant.id,
        userId: participant.userId,
        userName: participant.user?.name || 'Unknown',
        userEmail: participant.user?.email || '',
        userImage: participant.user?.image || null,
        status: participant.status,
        joinedAt: participant.createdAt.toISOString()
      })),
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      conversation: adminConversation
    })

  } catch (error) {
    console.error('Error fetching conversation details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation details' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = context.params.id
    const body = await request.json()
    const {
      title,
      description,
      conversationType,
      language,
      level,
      startTime,
      endTime,
      duration,
      maxParticipants,
      price,
      isPublic,
      isFree,
      topic,
    } = body

    const updated = await prisma.liveConversation.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(conversationType !== undefined ? { conversationType } : {}),
        ...(language !== undefined ? { language } : {}),
        ...(level !== undefined ? { level } : {}),
        ...(startTime !== undefined ? { startTime: new Date(startTime) } : {}),
        ...(endTime !== undefined ? { endTime: new Date(endTime) } : {}),
        ...(duration !== undefined ? { duration: Number(duration) } : {}),
        ...(maxParticipants !== undefined ? { maxParticipants: Number(maxParticipants) } : {}),
        ...(price !== undefined ? { price: Number(price) } : {}),
        ...(isPublic !== undefined ? { isPublic: !!isPublic } : {}),
        ...(isFree !== undefined ? { isFree: !!isFree } : {}),
        ...(topic !== undefined ? { topic } : {}),
      },
    })
    const dto = mapConversationRow(updated as any)
    return NextResponse.json({ success: true, conversation: dto })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 })
  }
}


