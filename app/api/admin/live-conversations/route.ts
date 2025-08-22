import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { mapConversationRow } from '@/lib/live-conversations'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language')
    const level = searchParams.get('level')
    const type = searchParams.get('type')
    const status = searchParams.get('status') || undefined
    const visibility = searchParams.get('visibility') // 'public' | 'private' | undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const whereClause: any = {}
    if (language && language !== 'all') whereClause.language = language
    if (level && level !== 'all') whereClause.level = level
    if (type && type !== 'all') whereClause.conversationType = type
    if (status && status !== 'all') whereClause.status = status
    if (visibility === 'public') whereClause.isPublic = true
    if (visibility === 'private') whereClause.isPublic = false

    const [conversations, total] = await Promise.all([
      prisma.liveConversation.findMany({
        where: whereClause,
        orderBy: [
          { startTime: 'asc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.liveConversation.count({ where: whereClause }),
    ])

    const conversationIds = conversations.map((c) => c.id)
    const hostIds = conversations.map((c) => c.hostId)
    const instructorIds = conversations
      .map((c) => c.instructorId)
      .filter((id): id is string => !!id)

    const participantRows = await prisma.liveConversationParticipant.findMany({
      where: { conversationId: { in: conversationIds } },
    })
    const participantUserIds = Array.from(new Set(participantRows.map((p) => p.userId)))

    const userIds = Array.from(new Set([...hostIds, ...instructorIds, ...participantUserIds]))
    const users = userIds.length
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true, image: true },
        })
      : []
    const userById = new Map(users.map((u) => [u.id, u]))

    const [participantsCounts, bookingsCounts] = await Promise.all([
      prisma.liveConversationParticipant.groupBy({
        by: ['conversationId'],
        where: { conversationId: { in: conversationIds } },
        _count: { id: true },
      }),
      prisma.liveConversationBooking.groupBy({
        by: ['conversationId'],
        where: { conversationId: { in: conversationIds } },
        _count: { id: true },
      }),
    ])
    const participantsCountByConv = new Map(participantsCounts.map((r) => [r.conversationId, r._count.id]))
    const bookingsCountByConv = new Map(bookingsCounts.map((r) => [r.conversationId, r._count.id]))

    const items = conversations.map((conversation) => {
      const dto = mapConversationRow(conversation as any)
      const instructor = conversation.instructorId ? userById.get(conversation.instructorId) || null : null
      const host = userById.get(conversation.hostId) || null
      const participantsForConversation = participantRows
        .filter((p) => p.conversationId === conversation.id)
        .map((p) => ({
          id: p.id,
          user: userById.get(p.userId)
            ? {
                id: userById.get(p.userId)!.id,
                name: userById.get(p.userId)!.name,
                image: userById.get(p.userId)!.image,
              }
            : null,
          isInstructor: p.isInstructor,
          isHost: p.isHost,
          status: p.status,
        }))

      return {
        ...dto,
        isPublic: conversation.isPublic,
        instructor,
        host,
        participants: participantsForConversation,
        _count: {
          participants: participantsCountByConv.get(conversation.id) || 0,
          bookings: bookingsCountByConv.get(conversation.id) || 0,
        },
      }
    })

    return NextResponse.json({
      success: true,
      conversations: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching admin live conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}


