import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/features/live-classes/ready-to-join - Get classes ready to join
export async function GET(request: NextRequest) {
  try {
    const now = new Date();

    // Get classes that are ready to join (within 15 minutes of start, or currently ACTIVE)
    const readyToJoinClasses = await prisma.videoSession.findMany({
      where: {
        OR: [
          {
            status: 'SCHEDULED',
            startTime: {
              gte: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
              lte: new Date(now.getTime() + 15 * 60 * 1000), // 15 minutes from now
            },
            endTime: { gt: now },
          },
          {
            status: 'ACTIVE',
            endTime: { gt: now },
          }
        ]
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            requiresSubscription: true,
            subscriptionTier: true,
            institutionId: true,
          }
        },
        
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Session is optional; when present we can compute likedByMe
    const session = await getServerSession(authOptions).catch(() => null as any);
    const userId = session?.user?.id as string | undefined;

    // Format with likes info
    const formattedClasses = await Promise.all(
      readyToJoinClasses.map(async (cls) => {
        const [likesCount, likedByMe, ratingStats] = await Promise.all([
          prisma.videoSessionLike.count({ where: { sessionId: cls.id } }),
          userId
            ? prisma.videoSessionLike
                .findUnique({ where: { sessionId_userId: { sessionId: cls.id, userId } } })
                .then(Boolean)
            : Promise.resolve(false),
          prisma.rating.aggregate({
            where: { targetType: 'CONTENT' as any, targetId: cls.id },
            _avg: { rating: true },
            _count: { rating: true },
          }),
        ]);

        return {
          id: cls.id,
          title: cls.title,
          startTime: cls.startTime,
          duration: cls.duration,
          language: cls.language,
          price: cls.price,
          currency: cls.currency,
          rating: ratingStats._avg.rating ?? null,
          reviews: ratingStats._count.rating ?? 0,
          isRecorded: cls.isRecorded,
          allowChat: cls.allowChat,
          allowScreenShare: cls.allowScreenShare,
          course: cls.course
            ? {
                id: cls.course.id,
                title: cls.course.title,
                requiresSubscription: cls.course.requiresSubscription,
                subscriptionTier: cls.course.subscriptionTier,
                institutionId: cls.course.institutionId,
              }
            : undefined,
          features: Array.isArray((cls as any).features) ? ((cls as any).features as string[]) : undefined,
          instructor: cls.instructor
            ? {
                name: cls.instructor.name,
                avatar: undefined as any, // Not available in current schema
              }
            : undefined,
          meetingLink: cls.meetingUrl,
          isReady: true,
          likesCount,
          likedByMe,
        };
      })
    );

    return NextResponse.json({
      readyToJoinClasses: formattedClasses,
    });
  } catch (error) {
    console.error('Error fetching ready to join classes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 