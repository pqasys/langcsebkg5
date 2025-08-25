import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { slug } = params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if circle exists
    const circle = await prisma.communityCircle.findUnique({
      where: { slug: slug },
      include: { owner: true }
    })

    if (!circle) {
      return NextResponse.json(
        { error: 'Circle not found' },
        { status: 404 }
      )
    }

    // Check if user is the owner
    if (circle.ownerId === session.user.id) {
      return NextResponse.json(
        { error: 'Circle owner cannot leave. Transfer ownership or delete the circle instead.' },
        { status: 400 }
      )
    }

    // Check if user is a member
    const membership = await prisma.communityCircleMembership.findUnique({
      where: {
        circleId_userId: {
          circleId: circle.id,
          userId: session.user.id
        }
      }
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this circle' },
        { status: 400 }
      )
    }

    // Remove membership
    await prisma.communityCircleMembership.delete({
      where: {
        circleId_userId: {
          circleId: circle.id,
          userId: session.user.id
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully left the circle'
    })

  } catch (error) {
    console.error('Error leaving circle:', error)
    return NextResponse.json(
      { error: 'Failed to leave circle' },
      { status: 500 }
    )
  }
}
