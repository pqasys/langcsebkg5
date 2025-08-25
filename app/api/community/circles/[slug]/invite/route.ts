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

    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Check if circle exists
    const circle = await prisma.communityCircle.findUnique({
      where: { slug: slug }
    })

    if (!circle) {
      return NextResponse.json(
        { error: 'Circle not found' },
        { status: 404 }
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
        { error: 'You must be a member to invite others to this circle' },
        { status: 403 }
      )
    }

    // Find user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!invitedUser) {
      return NextResponse.json(
        { error: 'User with this email address not found' },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existingMembership = await prisma.communityCircleMembership.findUnique({
              where: {
          circleId_userId: {
            circleId: circle.id,
            userId: invitedUser.id
          }
        }
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User is already a member of this circle' },
        { status: 400 }
      )
    }

    // Check if circle has reached max members
    if (circle.maxMembers) {
      const currentMemberCount = await prisma.communityCircleMembership.count({
        where: { circleId: circle.id }
      })

      if (currentMemberCount >= circle.maxMembers) {
        return NextResponse.json(
          { error: 'Circle has reached maximum member limit' },
          { status: 400 }
        )
      }
    }

    // Add user to circle
    await prisma.communityCircleMembership.create({
      data: {
        userId: invitedUser.id,
        circleId: circle.id,
        role: 'MEMBER',
        joinedAt: new Date()
      }
    })

    // TODO: Send notification email to invited user
    // TODO: Create notification record

    return NextResponse.json({
      success: true,
      message: `Successfully invited ${invitedUser.name} to the circle`
    })

  } catch (error) {
    console.error('Error inviting member:', error)
    return NextResponse.json(
      { error: 'Failed to invite member' },
      { status: 500 }
    )
  }
}
