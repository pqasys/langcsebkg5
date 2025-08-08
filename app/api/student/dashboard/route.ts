import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session data:', {
      hasSession: !!session,
      userId: session?.user?.id,
      userRole: session?.user?.role
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get student information by email (since user and student tables are separate)
    const student = await prisma.student.findUnique({
      where: { email: session.user.email }
    });

    if (!student) {
      console.log('Student not found for email:', session.user.email);
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

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

    // Get course information for enrollments
    const courseIds = enrollments.map(e => e.courseId);
    const courses = await prisma.course.findMany({
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
    });

    // Get institution information for courses
    const institutionIds = [...new Set(courses.map(c => c.institutionId).filter(Boolean))];
    const institutions = await prisma.institution.findMany({
      where: {
        id: {
          in: institutionIds
        }
      },
      select: {
        id: true,
        name: true
      }
    });

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

    // Get course information for completions
    const completionCourseIds = completions.map(c => c.courseId);
    const completionCourses = await prisma.course.findMany({
      where: {
        id: {
          in: completionCourseIds
        }
      },
      select: {
        id: true,
        title: true
      }
    });

    // Calculate statistics
    const totalEnrolled = enrollments.length;
    const totalCompleted = completions.length;
    // Treat ENROLLED, IN_PROGRESS, and ACTIVE as active statuses
    const activeStatuses = ['IN_PROGRESS', 'ENROLLED', 'ACTIVE'];
    const inProgress = enrollments.filter(e => activeStatuses.includes(e.status)).length;
    const averageProgress = enrollments.length > 0 
      ? enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length 
      : 0;

    // Get recent activity
    const recentActivity = await prisma.student_progress.findMany({
      where: { student_id: student.id },
      orderBy: { completed_at: 'desc' },
      take: 5
    });

    // Get module information for recent activity
    const moduleIds = recentActivity.map(activity => activity.module_id);
    let modules = [];
    if (moduleIds.length > 0) {
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
    }

    // Get course information for modules
    const moduleCourseIds = [...new Set(modules.map(m => m.course_id))];
    let moduleCourses = [];
    if (moduleCourseIds.length > 0) {
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

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Error fetching dashboard data:');
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 