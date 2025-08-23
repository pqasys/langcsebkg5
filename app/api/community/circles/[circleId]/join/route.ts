import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(_req: NextRequest, { params }: { params: { circleId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const circle = await prisma.communityCircle.findUnique({ where: { id: params.circleId } })
    if (!circle || !circle.isActive) return NextResponse.json({ error: 'Circle not found' }, { status: 404 })

    await prisma.communityCircleMembership.upsert({
      where: { circleId_userId: { circleId: params.circleId, userId: session.user.id } },
      update: {},
      create: { circleId: params.circleId, userId: session.user.id, role: 'MEMBER' },
    })

    return NextResponse.redirect(new URL('/community/circles', process.env.NEXTAUTH_URL || 'http://localhost:3000'))
  } catch (e) {
    return NextResponse.json({ error: 'Failed to join circle' }, { status: 500 })
  }
}


