import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Add detailed debugging for production troubleshooting
    console.log('🔍 StudentDashboard API Debug:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '[SET]' : '[NOT SET]');
    console.log('- NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '[NOT SET]');
    console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '[SET]' : '[NOT SET]');

    console.log('StudentDashboard API: Starting request processing');

    // Check if authOptions is properly configured
    if (!authOptions || !authOptions.secret) {
      console.error('StudentDashboard API: Auth configuration missing');
      return NextResponse.json(
        { error: 'Authentication configuration error' },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    console.log('StudentDashboard API: Session data:', {
      hasSession: !!session,
      userId: session?.user?.id,
      userRole: session?.user?.role,
      userEmail: session?.user?.email
    });

    if (!session?.user?.id) {
      console.log('StudentDashboard API: No session or user ID found - returning 401');
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
          }
        }
      );
    }

    if (session.user.role !== 'STUDENT') {
      console.log('StudentDashboard API: User is not a student:', session.user.role);
      return NextResponse.json(
        { error: 'Access denied. Student role required.' }, 
        { 
          status: 403,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
          }
        }
      );
    }

    console.log('StudentDashboard API: Looking up student for email:', session.user.email);

    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('StudentDashboard API: Database connection successful');
    } catch (dbError) {
      console.error('StudentDashboard API: Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    // Get student information by email (since user and student tables are separate)
    let student = await prisma.student.findUnique({
      where: { email: session.user.email }
    });

    // If student record doesn't exist, try to create it
    if (!student) {
      console.log('StudentDashboard API: Student record not found, attempting to create one');
      try {
        student = await prisma.student.create({
          data: {
            email: session.user.email,
            name: session.user.name || 'Student',
            status: 'active',
            created_at: new Date(),
            updated_at: new Date(),
            last_active: new Date()
          }
        });
        console.log('StudentDashboard API: Successfully created student record:', student.id);
      } catch (createError) {
        console.error('StudentDashboard API: Failed to create student record:', createError);
        return NextResponse.json({ 
          error: 'Student profile not found and could not be created',
          details: 'Please contact support to set up your student profile'
        }, { status: 404 });
      }
    }

    console.log('StudentDashboard API: Student found, ID:', student.id);

    // Get enrollments with course information
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: { studentId: student.id },
      select: {
        id: true,
        status: true,
        courseId: true,
        createdAt: true,
        progress: true,
        startDate: true,
        endDate: true
      }
    });

    console.log('StudentDashboard API: Found enrollments:', enrollments.length);

    // Get course information for enrollments
    const courseIds = enrollments.map(e => e.courseId);
    const courses = courseIds.length > 0 ? await prisma.course.findMany({
      where: {
        id: {
          in: courseIds
        }
      },
      select: {
        id: true,
        title: true,
        endDate: true,
        institutionId: true
      }
    }) : [];

    console.log('StudentDashboard API: Found courses:', courses.length);

    // Get institution information for courses
    const institutionIds = [...new Set(courses.map(c => c.institutionId).filter(Boolean))];
    const institutions = institutionIds.length > 0 ? await prisma.institution.findMany({
      where: {
        id: {
          in: institutionIds
        }
      },
      select: {
        id: true,
        name: true
      }
    }) : [];

    console.log('StudentDashboard API: Found institutions:', institutions.length);

    // Get completions with course information
    const completions = await prisma.studentCourseCompletion.findMany({
      where: { studentId: student.id },
      select: {
        id: true,
        courseId: true,
        createdAt: true,
        status: true
      }
    });

    console.log('StudentDashboard API: Found completions:', completions.length);

    // Get course information for completions
    const completionCourseIds = completions.map(c => c.courseId);
    const completionCourses = completionCourseIds.length > 0 ? await prisma.course.findMany({
      where: {
        id: {
          in: completionCourseIds
        }
      },
      select: {
        id: true,
        title: true
      }
    }) : [];

    // Calculate statistics
    const totalEnrolled = enrollments.length;
    const totalCompleted = completions.length;
    // Treat ENROLLED, IN_PROGRESS, and ACTIVE as active statuses
    const activeStatuses = ['IN_PROGRESS', 'ENROLLED', 'ACTIVE'];
    const inProgress = enrollments.filter(e => activeStatuses.includes(e.status)).length;
    const averageProgress = enrollments.length > 0 
      ? enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length 
      : 0;

    console.log('StudentDashboard API: Calculated stats:', {
      totalEnrolled,
      totalCompleted,
      inProgress,
      averageProgress
    });

    // Get recent activity with error handling
    let recentActivity = [];
    try {
      recentActivity = await prisma.student_progress.findMany({
        where: { student_id: student.id },
        orderBy: { completed_at: 'desc' },
        take: 5
      });
      console.log('StudentDashboard API: Found recent activity:', recentActivity.length);
    } catch (activityError) {
      console.warn('StudentDashboard API: Could not fetch recent activity:', activityError);
      // Continue without recent activity
    }

    // Get module information for recent activity
    const moduleIds = recentActivity.map(activity => activity.module_id);
    let modules = [];
    if (moduleIds.length > 0) {
      try {
        modules = await prisma.modules.findMany({
          where: {
            id: {
              in: moduleIds
            }
          },
          select: {
            id: true,
            title: true,
            course_id: true
          }
        });
      } catch (moduleError) {
        console.warn('StudentDashboard API: Could not fetch modules:', moduleError);
      }
    }

    // Get course information for modules
    const moduleCourseIds = [...new Set(modules.map(m => m.course_id))];
    let moduleCourses = [];
    if (moduleCourseIds.length > 0) {
      try {
        moduleCourses = await prisma.course.findMany({
          where: {
            id: {
              in: moduleCourseIds
            }
          },
          select: {
            id: true,
            title: true
          }
        });
      } catch (moduleCourseError) {
        console.warn('StudentDashboard API: Could not fetch module courses:', moduleCourseError);
      }
    }

    // Transform recent activity to include module and course information
    const transformedActivity = recentActivity.map(activity => {
      const module = modules.find(m => m.id === activity.module_id);
      const course = module ? moduleCourses.find(c => c.id === module.course_id) : null;

      return {
        id: activity.id,
        moduleId: activity.module_id,
        moduleTitle: module?.title || 'Unknown Module',
        courseTitle: course?.title || 'Unknown Course',
        contentCompleted: activity.content_completed,
        exercisesCompleted: activity.exercises_completed,
        quizCompleted: activity.quiz_completed,
        quizScore: activity.quiz_score,
        startedAt: activity.started_at,
        completedAt: activity.completed_at
      };
    });

    const responseData = {
      stats: {
        totalCourses: totalEnrolled || 0,
        completedCourses: totalCompleted || 0,
        inProgressCourses: inProgress || 0,
        averageProgress: Math.round((averageProgress || 0) * 100),
        activeCourses: enrollments.filter(e => activeStatuses.includes(e.status)).length || 0
      },
      recentActivity: transformedActivity,
      courses: enrollments.map(e => {
        const course = courses.find(c => c.id === e.courseId);
        return {
          id: e.id,
          courseId: e.courseId,
          title: course?.title || 'Unknown Course',
          progress: e.progress || 0,
          status: e.status.toUpperCase(),
          startDate: e.startDate || e.createdAt,
          endDate: e.endDate || course?.endDate || new Date().toISOString(),
          institution: {
            name: institutions.find(i => i.id === course?.institutionId)?.name || 'Unknown Institution'
          }
        };
      }),
      completions: completions.map(c => {
        const course = completionCourses.find(cc => cc.id === c.courseId);
        return {
          id: c.id,
          courseId: c.courseId,
          title: course?.title || 'Unknown Course',
          status: c.status.toUpperCase(),
          completedAt: c.createdAt
        };
      })
    };

    console.log('StudentDashboard API: Successfully prepared response data');
    return NextResponse.json(
      responseData,
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );

  } catch (error) {
    console.error('StudentDashboard API: Error fetching dashboard data:', error);
    
    // Log additional error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('StudentDashboard API: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
    
    // Return a more user-friendly error response
    return NextResponse.json(
      { 
        error: 'Failed to load dashboard data',
        message: 'Please try refreshing the page or contact support if the problem persists.',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { 
        status: 500, 
        statusText: 'Internal Server Error',
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  }
} 