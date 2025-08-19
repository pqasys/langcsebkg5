import { NextRequest, NextResponse } from 'next/server';
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

    // Format the response to match the expected interface
    const formattedClasses = upcomingClasses.map(cls => ({
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
      isReady: false,
    }));

    return NextResponse.json({
      upcomingClasses: formattedClasses,
    });
  } catch (error) {
    console.error('Error fetching upcoming classes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 