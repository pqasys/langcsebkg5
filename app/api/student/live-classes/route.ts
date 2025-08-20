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
    const courseId = searchParams.get('courseId');

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
        details: process.env.NODE_ENV === 'development' ? (dbError as any).message : undefined
      }, { status: 500 });
    }

    const hasSubscription = studentSubscription?.status; // original behavior (truthy when any status exists)
    const institutionId = user?.institutionId;

    // Build where clause based on student's access
    const now = new Date();
    const where: any = {
      status: 'SCHEDULED',
      OR: [
        { startTime: { gt: now } }, // upcoming
        { AND: [{ startTime: { lte: now } }, { endTime: { gt: now } }] } // in progress
      ],
    };

    if (status) where.status = status;
    if (language) where.language = language;
    if (level) where.level = level;
    if (courseId) where.courseId = courseId;
    if (search) {
      // Combine text search with time/status OR using AND
      const textOR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: textOR }];
        delete where.OR;
      } else {
        where.OR = textOR;
      }
    }

    // Filter based on access level (eligibility-based)
    if (hasSubscription && institutionId) {
      // Student has both subscription and institution enrollment
      // Create a new OR condition that combines search OR with institution access
      const institutionAccess = [
        { institutionId: null }, // Platform-wide classes
        { institutionId: institutionId }, // Institution classes
      ];
      
      if (where.OR) {
        // If there's already an OR for search, we need to combine them
        where.AND = [{ OR: where.OR }, { OR: institutionAccess }];
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
      // Student has no access - return empty result (original behavior)
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
        details: process.env.NODE_ENV === 'development' ? (dbError as any).message : undefined
      }, { status: 500 });
    }

    // Get enrollment status for each class
    let liveClassesWithEnrollment;
    
    try {
      liveClassesWithEnrollment = await Promise.all(
        liveClasses.map(async (liveClass) => {
          const [instructor, course, enrollment, likesCount, likedByMe, ratingStats] = await Promise.all([
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
            prisma.videoSessionLike.count({ where: { sessionId: liveClass.id } }),
            prisma.videoSessionLike.findUnique({
              where: { sessionId_userId: { sessionId: liveClass.id, userId: session.user.id } },
            }).then(Boolean),
            prisma.rating.aggregate({
              where: { targetType: 'CONTENT' as any, targetId: liveClass.id },
              _avg: { rating: true },
              _count: { rating: true },
            }),
          ]);

          return {
            ...liveClass,
            instructor,
            course,
            isEnrolled: !!enrollment,
            enrollment,
            likesCount,
            likedByMe,
            rating: ratingStats._avg.rating ?? null,
            reviews: ratingStats._count.rating ?? 0,
          };
        })
      );
    } catch (dbError) {
      console.error('Database query error for enrollment status:', dbError);
      return NextResponse.json({ 
        error: 'Database connection error',
        details: process.env.NODE_ENV === 'development' ? (dbError as any).message : undefined
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
        details: process.env.NODE_ENV === 'development' ? (error as any).message : undefined
      },
      { status: 500 }
    );
  }
} 