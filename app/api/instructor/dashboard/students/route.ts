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

    // Get instructor's live classes with participants
    const liveClasses = await prisma.videoSession.findMany({
      where: { instructorId: session.user.id },
      include: {
        participants: {
          include: {
            user: true
          }
        }
      }
    });

    // Aggregate student data
    const studentMap = new Map();

    liveClasses.forEach(classItem => {
      classItem.participants.forEach(participant => {
        const studentId = participant.userId;
        const studentName = participant.user.name;
        const studentEmail = participant.user.email;

        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            id: studentId,
            name: studentName,
            email: studentEmail,
            totalClasses: 0,
            averageRating: 0,
            lastActive: participant.user.updatedAt
          });
        }

        const student = studentMap.get(studentId);
        student.totalClasses += 1;
        
        // Update last active date
        if (new Date(participant.user.updatedAt) > new Date(student.lastActive)) {
          student.lastActive = participant.user.updatedAt;
        }
      });
    });

    // Convert map to array and sort by total classes
    const students = Array.from(studentMap.values())
      .sort((a, b) => b.totalClasses - a.totalClasses);

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error fetching instructor students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructor students' },
      { status: 500 }
    );
  }
}

