import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { slug } = params

    // Find circle by slug
    const circle = await prisma.communityCircle.findUnique({
      where: { slug: slug },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    if (!circle) {
      return NextResponse.json(
        { error: 'Circle not found' },
        { status: 404 }
      )
    }

    // Get members
    const members = await prisma.communityCircleMembership.findMany({
      where: { circleId: circle.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        }
      },
      orderBy: { joinedAt: 'asc' }
    })

    // Get posts
    const posts = await prisma.communityCirclePost.findMany({
      where: { circleId: circle.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Get events
    const events = await prisma.communityCircleEvent.findMany({
      where: { circleId: circle.id },
      orderBy: { date: 'asc' },
      take: 5
    })

    // Check if current user is a member
    let userMembership = null
    if (session?.user?.id) {
      userMembership = await prisma.communityCircleMembership.findUnique({
        where: {
          circleId_userId: {
            circleId: circle.id,
            userId: session.user.id
          }
        }
      })
    }

    return NextResponse.json({
      circle: {
        id: circle.id,
        name: circle.name,
        description: circle.description,
        slug: circle.slug,
        language: circle.language || 'en',
        level: circle.level || 'All Levels',
        membersCount: members.length,
        maxMembers: circle.maxMembers,
        isPublic: !circle.isPrivate,
        createdAt: circle.createdAt.toISOString(),
        owner: circle.owner,
        isMember: !!userMembership,
        isOwner: circle.ownerId === session?.user?.id,
        isModerator: userMembership?.role === 'MODERATOR'
      },
      members: members.map(member => ({
        id: member.user.id,
        name: member.user.name,
        image: member.user.image,
        email: member.user.email,
        role: member.role.toLowerCase(),
        joinedAt: member.joinedAt.toISOString(),
        isOnline: false,
        lastActive: new Date().toISOString()
      })),
      posts: posts.map(post => ({
        id: post.id,
        content: post.content,
        author: {
          id: post.author.id,
          name: post.author.name,
          image: post.author.image
        },
        createdAt: post.createdAt.toISOString(),
        likes: 0,
        comments: 0
      })),
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date.toISOString().split('T')[0],
        time: event.time,
        duration: event.duration,
        type: event.type.toLowerCase(),
        attendees: 0,
        maxAttendees: event.maxAttendees
      })),
      userMembership: userMembership ? {
        role: userMembership.role,
        joinedAt: userMembership.joinedAt.toISOString()
      } : null
    })

  } catch (error) {
    console.error('Error fetching circle details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch circle details' },
      { status: 500 }
    )
  }
}
