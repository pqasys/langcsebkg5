import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(_req: NextRequest, { params }: { params: { clubId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const sessionObj = await prisma.videoSession.findUnique({ where: { id: params.clubId } })
    if (!sessionObj || sessionObj.status !== 'SCHEDULED') return NextResponse.json({ error: 'Club not found' }, { status: 404 })

    // Upsert participant RSVP
    await prisma.videoSessionParticipant.upsert({
      where: { sessionId_userId: { sessionId: params.clubId, userId: session.user.id } },
      update: { isActive: true },
      create: { sessionId: params.clubId, userId: session.user.id, role: 'PARTICIPANT', isActive: true },
    })

    return NextResponse.redirect(new URL('/community/clubs', process.env.NEXTAUTH_URL || 'http://localhost:3000'))
  } catch (e) {
    return NextResponse.json({ error: 'Failed to RSVP' }, { status: 500 })
  }
}


