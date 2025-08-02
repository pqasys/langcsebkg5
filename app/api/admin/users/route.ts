import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const institutionId = searchParams.get('institutionId');
    const courseId = searchParams.get('courseId');

    // Build where clause
    const whereClause: any = {};
    if (role) {
      whereClause.role = role;
    }

    // For instructors, add institution filtering logic
    if (role === 'INSTRUCTOR') {
      if (institutionId && institutionId !== 'none') {
        // If institution is selected, show instructors from that institution
        whereClause.institutionId = institutionId;
      } else if (courseId && courseId !== 'none') {
        // If course is selected, show instructors based on course's institution
        const course = await prisma.course.findUnique({
          where: { id: courseId },
          select: { institutionId: true }
        });
        
        if (course?.institutionId) {
          // Course belongs to an institution, show instructors from that institution
          whereClause.institutionId = course.institutionId;
        } else {
          // Platform-wide course, show platform-wide instructors (no institution)
          whereClause.institutionId = null;
        }
      } else {
        // No institution or course selected, show all instructors
        // (both platform-wide and institution-specific)
      }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        image: true,
        status: true,
        institutionId: true,
        updatedAt: true,
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error fetching users' },
      { status: 500 }
    );
  }
} 