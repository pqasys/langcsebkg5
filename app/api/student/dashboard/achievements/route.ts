import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get student by ID
    const student = await prisma.student.findUnique({
      where: { id: session.user.id }
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    // Get student achievements
    let achievements: unknown[] = [];
    try {
      achievements = await prisma.studentAchievement.findMany({
        where: { studentId: student.id },
        orderBy: { earnedAt: 'desc' },
        take: 10 // Limit to 10 most recent achievements
      });
    } catch (error) {
    console.error('Error occurred:', error);
      // Student achievements table might not exist, continue without it
      // // // console.log('Student achievements not available:', error);
    }

    // If no achievements exist, we could create some default ones based on progress
    // For now, return empty array if no achievements
    if (achievements.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 