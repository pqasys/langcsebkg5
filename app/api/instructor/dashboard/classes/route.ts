import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Access denied. Instructor role required.' }, { status: 403 });
    }

    // Get instructor's live classes
    const liveClasses = await prisma.videoSession.findMany({
      where: { instructorId: session.user.id },
      include: {
        participants: true,
        instructorCommissions: true
      },
      orderBy: { startTime: 'desc' }
    });

    // Transform data for frontend
    const classes = liveClasses.map(classItem => ({
      id: classItem.id,
      title: classItem.title,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      status: classItem.status,
      enrolledStudents: classItem.participants.length,
      maxStudents: classItem.maxParticipants,
      price: classItem.price,
      commission: classItem.instructorCommissions.reduce((sum, commission) => sum + commission.amount, 0)
    }));

    return NextResponse.json({ classes });
  } catch (error) {
    console.error('Error fetching instructor classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructor classes' },
      { status: 500 }
    );
  }
}

