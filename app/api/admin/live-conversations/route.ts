import { NextRequest, NextResponse } from 'next/server'
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { mapConversationRow } from '@/lib/live-conversations'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json({ conversations: [], stats: {} });
    }

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
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const whereClause: any = {}
    if (language && language !== 'all') whereClause.language = language
    if (level && level !== 'all') whereClause.level = level
    if (type && type !== 'all') whereClause.conversationType = type
    if (status && status !== 'all') whereClause.status = status
    if (visibility === 'public') whereClause.isPublic = true
    if (visibility === 'private') whereClause.isPublic = false

    // Get conversations with enhanced data
    const [conversations, total] = await Promise.all([
      prisma.liveConversation.findMany({
        where: whereClause,
        orderBy: [
          { startTime: 'asc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
        include: {
          host: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          }
        }
      }),
      prisma.liveConversation.count({ where: whereClause }),
    ])

    const conversationIds = conversations.map((c) => c.id)

    // Get participant counts
    const participantRows = await prisma.liveConversationParticipant.findMany({
      where: { conversationId: { in: conversationIds } },
    })
    const participantsCounts = await prisma.liveConversationParticipant.groupBy({
      by: ['conversationId'],
      where: { conversationId: { in: conversationIds } },
      _count: { id: true },
    })
    const participantsCountByConv = new Map(participantsCounts.map((r) => [r.conversationId, r._count.id]))

    // Get booking counts
    const bookingsCounts = await prisma.liveConversationBooking.groupBy({
      by: ['conversationId'],
      where: { conversationId: { in: conversationIds } },
      _count: { id: true },
    })
    const bookingsCountByConv = new Map(bookingsCounts.map((r) => [r.conversationId, r._count.id]))

    // Get report counts (simulated - you'll need to implement a reporting system)
    const reportCounts = await prisma.liveConversationReport.groupBy({
      by: ['conversationId'],
      where: { conversationId: { in: conversationIds } },
      _count: { id: true },
    })
    const reportCountByConv = new Map(reportCounts.map((r) => [r.conversationId, r._count.id]))

    // Transform conversations for admin view
    const adminConversations = conversations.map((conversation) => {
      const participantCount = participantsCountByConv.get(conversation.id) || 0
      const bookingCount = bookingsCountByConv.get(conversation.id) || 0
      const reportCount = reportCountByConv.get(conversation.id) || 0

      return {
        id: conversation.id,
        title: conversation.title,
        conversationType: conversation.conversationType,
        language: conversation.language,
        level: conversation.level,
        startTime: conversation.startTime.toISOString(),
        duration: conversation.duration,
        maxParticipants: conversation.maxParticipants,
        currentParticipants: participantCount,
        price: conversation.price,
        isFree: conversation.isFree,
        status: conversation.status,
        hostId: conversation.hostId,
        hostName: conversation.host?.name || 'Unknown',
        hostEmail: conversation.host?.email || '',
        isPublic: conversation.isPublic,
        reportCount: reportCount,
        createdAt: conversation.createdAt.toISOString(),
        updatedAt: conversation.updatedAt.toISOString(),
      }
    })

    // Calculate statistics
    const stats = {
      total: await prisma.liveConversation.count(),
      active: await prisma.liveConversation.count({ where: { status: 'SCHEDULED' } }),
      completed: await prisma.liveConversation.count({ where: { status: 'COMPLETED' } }),
      cancelled: await prisma.liveConversation.count({ where: { status: 'CANCELLED' } }),
      reported: await prisma.liveConversationReport.groupBy({
        by: ['conversationId'],
        _count: { id: true },
      }).then(reports => reports.length),
      flagged: await prisma.liveConversationReport.groupBy({
        by: ['conversationId'],
        _count: { id: true },
      }).then(reports => reports.filter(r => r._count.id >= 3).length),
    }

    return NextResponse.json({
      success: true,
      conversations: adminConversations,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching admin live conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}


