import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/features/live-classes/upcoming - Get upcoming classes
export async function GET(request: NextRequest) {
  try {
    const now = new Date();

    // Get upcoming classes (future classes not ready yet)
    const upcomingClasses = await prisma.videoSession.findMany({
      where: {
        status: 'SCHEDULED',
        startTime: {
          gt: new Date(now.getTime() + 15 * 60 * 1000), // More than 15 minutes from now
        },
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
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
      instructor: {
        name: cls.instructor.name,
        avatar: undefined, // Not available in current schema
      },
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