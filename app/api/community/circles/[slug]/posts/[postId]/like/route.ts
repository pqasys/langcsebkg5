import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Like/unlike a discussion post
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string; postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, slug } = params;

    // Get circle details
    const circle = await prisma.communityCircle.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId: session.user.id }
        }
      }
    });

    if (!circle) {
      return NextResponse.json({ error: 'Circle not found' }, { status: 404 });
    }

    // Check if user is a member
    if (circle.members.length === 0) {
      return NextResponse.json({ error: 'Not a member of this circle' }, { status: 403 });
    }

    // Check if post exists and belongs to this circle
    const post = await prisma.communityCirclePost.findUnique({
      where: { id: postId },
      include: {
        likes: {
          where: { userId: session.user.id }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.circleId !== circle.id) {
      return NextResponse.json({ error: 'Post does not belong to this circle' }, { status: 400 });
    }

    // Check if user already liked the post
    const existingLike = post.likes[0];

    if (existingLike) {
      // Unlike the post
      await prisma.communityCirclePostLike.delete({
        where: { id: existingLike.id }
      });

      return NextResponse.json({
        success: true,
        liked: false,
        likeCount: post._count.likes - 1
      });
    } else {
      // Like the post
      await prisma.communityCirclePostLike.create({
        data: {
          postId: postId,
          userId: session.user.id
        }
      });

      return NextResponse.json({
        success: true,
        liked: true,
        likeCount: post._count.likes + 1
      });
    }

  } catch (error) {
    console.error('Error toggling post like:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
