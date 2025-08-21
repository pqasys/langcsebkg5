import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversation = await prisma.liveConversation.findUnique({
      where: { id: params.id },
      include: {
        host: true,
        instructor: true,
        _count: {
          select: { participants: true, bookings: true }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, conversation })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load conversation' }, { status: 500 })
  }
}


