import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/student/live-classes - Get available live classes for the student
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const language = searchParams.get('language');
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    const type = searchParams.get('type'); // 'available', 'enrolled', 'completed'

    const skip = (page - 1) * limit;

    // Get student's subscription and institution enrollment
    const [studentSubscription, institutionEnrollment] = await Promise.all([
      prisma.studentSubscription.findUnique({
        where: { studentId: session.user.id },
        include: { studentTier: true },
      }),
      prisma.studentInstitution.findFirst({
        where: { 
          student_id: session.user.id,
          status: 'ENROLLED',
        },
      }),
    ]);

    const hasSubscription = studentSubscription?.status === 'ACTIVE';
    const institutionId = institutionEnrollment?.institution_id;

    // Build where clause based on student's access
    const where: any = {
      status: 'SCHEDULED',
      startTime: { gt: new Date() }, // Only future classes
    };

    if (status) where.status = status;
    if (language) where.language = language;
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter based on access level
    if (hasSubscription && institutionId) {
      // Student has both subscription and institution enrollment
      where.OR = [
        { institutionId: null }, // Platform-wide classes
        { institutionId: institutionId }, // Institution classes
      ];
    } else if (hasSubscription) {
      // Student has only subscription - platform-wide classes only
      where.institutionId = null;
    } else if (institutionId) {
      // Student has only institution enrollment - institution classes only
      where.institutionId = institutionId;
    } else {
      // Student has no access - return empty result
      return NextResponse.json({
        liveClasses: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
        accessLevel: 'none',
      });
    }

    // Get total count
    const total = await prisma.videoSession.count({ where });

    // Get live classes
    const liveClasses = await prisma.videoSession.findMany({
      where,
      orderBy: { startTime: 'asc' },
      skip,
      take: limit,
    });

    // Get enrollment status for each class
    const liveClassesWithEnrollment = await Promise.all(
      liveClasses.map(async (liveClass) => {
        const [instructor, course, enrollment] = await Promise.all([
          prisma.user.findUnique({
            where: { id: liveClass.instructorId },
            select: { id: true, name: true, email: true },
          }),
          liveClass.courseId ? prisma.course.findUnique({
            where: { id: liveClass.courseId },
            select: { id: true, title: true },
          }) : null,
          prisma.videoSessionParticipant.findUnique({
            where: {
              sessionId_userId: {
                sessionId: liveClass.id,
                userId: session.user.id,
              },
            },
          }),
        ]);

        return {
          ...liveClass,
          instructor,
          course,
          isEnrolled: !!enrollment,
          enrollment,
        };
      })
    );

    // Filter based on type if specified
    let filteredClasses = liveClassesWithEnrollment;
    if (type === 'enrolled') {
      filteredClasses = liveClassesWithEnrollment.filter(c => c.isEnrolled);
    } else if (type === 'available') {
      filteredClasses = liveClassesWithEnrollment.filter(c => !c.isEnrolled);
    }

    return NextResponse.json({
      liveClasses: filteredClasses,
      pagination: {
        page,
        limit,
        total: filteredClasses.length,
        pages: Math.ceil(filteredClasses.length / limit),
      },
      accessLevel: {
        hasSubscription,
        hasInstitutionAccess: !!institutionId,
        institutionId,
      },
    });
  } catch (error) {
    console.error('Error fetching live classes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 