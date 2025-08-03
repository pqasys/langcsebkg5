import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/student/live-classes - Get available live classes for the student
export async function GET(request: NextRequest) {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      console.error('Prisma client is undefined');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

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
    let studentSubscription, user;
    
    try {
      [studentSubscription, user] = await Promise.all([
        prisma.studentSubscription.findUnique({
          where: { studentId: session.user.id },
        }),
        prisma.user.findUnique({
          where: { id: session.user.id },
          select: { institutionId: true },
        }),
      ]);
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection error',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 500 });
    }

    const hasSubscription = studentSubscription?.status === 'ACTIVE';
    const institutionId = user?.institutionId;

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
      // Create a new OR condition that combines search OR with institution access
      const institutionAccess = [
        { institutionId: null }, // Platform-wide classes
        { institutionId: institutionId }, // Institution classes
      ];
      
      if (where.OR) {
        // If there's already an OR for search, we need to combine them
        where.AND = [
          { OR: where.OR }, // Search conditions
          { OR: institutionAccess } // Institution access conditions
        ];
        delete where.OR;
      } else {
        where.OR = institutionAccess;
      }
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

    // Get total count and live classes
    let total, liveClasses;
    
    try {
      // Debug: Log the where clause in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Where clause for video sessions:', JSON.stringify(where, null, 2));
      }
      
      [total, liveClasses] = await Promise.all([
        prisma.videoSession.count({ where }),
        prisma.videoSession.findMany({
          where,
          orderBy: { startTime: 'asc' },
          skip,
          take: limit,
        })
      ]);
    } catch (dbError) {
      console.error('Database query error for video sessions:', dbError);
      if (process.env.NODE_ENV === 'development') {
        console.error('Where clause that caused error:', JSON.stringify(where, null, 2));
      }
      return NextResponse.json({ 
        error: 'Database connection error',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 500 });
    }

    // Get enrollment status for each class
    let liveClassesWithEnrollment;
    
    try {
      liveClassesWithEnrollment = await Promise.all(
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
    } catch (dbError) {
      console.error('Database query error for enrollment status:', dbError);
      return NextResponse.json({ 
        error: 'Database connection error',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 500 });
    }

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
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 