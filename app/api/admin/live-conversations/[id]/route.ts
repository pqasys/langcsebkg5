import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { mapConversationRow } from '@/lib/live-conversations'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = context.params.id
    const conv = await prisma.liveConversation.findUnique({ where: { id } })
    if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const dto = mapConversationRow(conv as any)
    return NextResponse.json({ success: true, conversation: dto })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 })
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


