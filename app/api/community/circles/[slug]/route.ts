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

    // Get all posts for this circle
    const allPosts = await prisma.communityCirclePost.findMany({
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
      orderBy: { createdAt: 'asc' }
    })

    // Get like counts using raw query to avoid Prisma issues
    const postIds = allPosts.map(p => p.id);
    let likeCounts: any[] = [];
    let userLikes: string[] = [];

    if (postIds.length > 0) {
      // Get like counts
      likeCounts = await prisma.$queryRaw`
        SELECT postId, COUNT(*) as count 
        FROM community_circle_post_likes 
        WHERE postId IN (${postIds.join(',')})
        GROUP BY postId
      `;

      // Get user's likes
      if (session?.user?.id) {
        const userLikePosts = await prisma.$queryRaw`
          SELECT postId 
          FROM community_circle_post_likes 
          WHERE userId = ${session.user.id} AND postId IN (${postIds.join(',')})
        `;
        userLikes = (userLikePosts as any[]).map(like => like.postId);
      }
    }

    // Create like count lookup map
    const likeCountMap = new Map((likeCounts as any[]).map(l => [l.postId, l.count]));

    // Organize posts into threaded structure
    const organizePosts = (posts: any[]) => {
      const postMap = new Map();
      const rootPosts: any[] = [];

      // First pass: create a map of all posts with empty replies array
      posts.forEach(post => {
        postMap.set(post.id, {
          ...post,
          replies: []
        });
      });

      // Second pass: organize into hierarchy
      posts.forEach(post => {
        if (post.parentId) {
          const parent = postMap.get(post.parentId);
          if (parent) {
            parent.replies.push(postMap.get(post.id));
          }
        } else {
          rootPosts.push(postMap.get(post.id));
        }
      });

      return rootPosts;
    };

    const organizedPosts = organizePosts(allPosts);

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

    // Helper function to map posts with replies
    const mapPost = (post: any) => ({
      id: post.id,
      content: post.content,
      author: {
        id: post.author.id,
        name: post.author.name,
        image: post.author.image
      },
      createdAt: post.createdAt.toISOString(),
      likes: likeCountMap.get(post.id) || 0,
      isLiked: userLikes.includes(post.id),
      level: post.level || 0,
      parentId: post.parentId,
      replyCount: post.replies ? post.replies.length : 0,
      replies: post.replies ? post.replies.map(mapPost) : []
    });

    return NextResponse.json({
      circle: {
        id: circle.id,
        name: circle.name,
        description: circle.description,
        slug: circle.slug,
        language: circle.language || 'en',
        level: circle.level || 'All Levels',
        membersCount: members.length,
        maxMembers: undefined,
        isPublic: circle.isPublic,
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
      posts: organizedPosts.map(mapPost),
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
