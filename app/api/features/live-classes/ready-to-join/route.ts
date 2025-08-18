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