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

    const { content } = await request.json()

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Post content is required' },
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
        { error: 'You must be a member to post in this circle' },
        { status: 403 }
      )
    }

    // Create the post
    const post = await prisma.communityCirclePost.create({
      data: {
        content: content.trim(),
        authorId: session.user.id,
        circleId: circle.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      post: {
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
      }
    })

  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
