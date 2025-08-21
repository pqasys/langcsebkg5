import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/features/live-classes/upcoming - Get upcoming classes
export async function GET(request: NextRequest) {
  try {
    const now = new Date();

    // Get upcoming classes (future classes and currently active ones)
    const upcomingClasses = await prisma.videoSession.findMany({
      where: {
        OR: [
          {
            status: 'SCHEDULED',
            startTime: { gte: now },
          },
          {
            status: 'ACTIVE',
            endTime: { gt: now },
          }
        ],
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
        // include raw features/tags/materials for display parity
        
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 10, // Limit to 10 upcoming classes
    });

    // Session is optional; when present we can compute likedByMe
    const session = await getServerSession(authOptions).catch(() => null as any);
    const userId = session?.user?.id as string | undefined;

    const formattedClasses = await Promise.all(
      upcomingClasses.map(async (cls) => {
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
          isReady: false,
          likesCount,
          likedByMe,
        };
      })
    );

    // Ensure diversity by course: return unique by courseId first
    const byCourse = new Map<string, any[]>();
    for (const c of formattedClasses) {
      const key = c?.course?.id || `__no_course__:${c.id}`;
      if (!byCourse.has(key)) byCourse.set(key, []);
      byCourse.get(key)!.push(c);
    }
    const diversified: any[] = [];
    // Round-robin across courses to avoid dominance
    let index = 0;
    while (diversified.length < Math.min(10, formattedClasses.length)) {
      let added = false;
      for (const arr of byCourse.values()) {
        if (arr[index]) {
          diversified.push(arr[index]);
          if (diversified.length >= 10) break;
          added = true;
        }
      }
      if (!added) break;
      index++;
    }

    return NextResponse.json({
      upcomingClasses: diversified.slice(0, 10),
    });
  } catch (error) {
    console.error('Error fetching upcoming classes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 