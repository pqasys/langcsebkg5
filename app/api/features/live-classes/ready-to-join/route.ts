import { NextRequest, NextResponse } from 'next/server';
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

    // Format the response to match the expected interface
    const formattedClasses = readyToJoinClasses.map(cls => ({
      id: cls.id,
      title: cls.title,
      startTime: cls.startTime,
      duration: cls.duration,
      language: cls.language,
      price: cls.price,
      currency: cls.currency,
      isRecorded: cls.isRecorded,
      allowChat: cls.allowChat,
      allowScreenShare: cls.allowScreenShare,
      course: cls.course ? {
        id: cls.course.id,
        title: cls.course.title,
        requiresSubscription: cls.course.requiresSubscription,
        subscriptionTier: cls.course.subscriptionTier,
        institutionId: cls.course.institutionId,
      } : undefined,
      features: Array.isArray((cls as any).features) ? (cls as any).features : undefined,
      instructor: cls.instructor ? {
        name: cls.instructor.name,
        avatar: undefined, // Not available in current schema
      } : undefined,
      meetingLink: cls.meetingUrl,
      isReady: true,
    }));

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