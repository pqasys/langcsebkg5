import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get student information by email
    const student = await prisma.student.findUnique({
      where: { email: session.user.email }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get student's enrolled courses with progress
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        studentId: student.id
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            institutionId: true
          }
        }
      }
    });

    // Get institution data for all courses
    const institutionIds = [...new Set(enrollments.map(e => e.course.institutionId).filter(Boolean))];
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

    // Get modules for all courses
    const courseIds = enrollments.map(e => e.course.id);
    const modules = await prisma.modules.findMany({
      where: {
        course_id: {
          in: courseIds
        }
      },
      select: {
        id: true,
        title: true,
        course_id: true,
        order_index: true
      },
      orderBy: {
        order_index: 'asc'
      }
    });

    // Get student progress for all modules
    const moduleIds = modules.map(m => m.id);
    const studentProgress = await prisma.student_progress.findMany({
      where: {
        student_id: session.user.id,
        module_id: {
          in: moduleIds
        }
      },
      select: {
        module_id: true,
        content_completed: true,
        exercises_completed: true,
        quiz_completed: true,
        quiz_score: true,
        started_at: true,
        completed_at: true
      }
    });

    // Calculate progress statistics
    const courses = enrollments.map(enrollment => {
      const courseModules = modules.filter(m => m.course_id === enrollment.course.id);
      const moduleProgress = courseModules.map(module => {
        const progress = studentProgress.find(p => p.module_id === module.id);
        return {
          id: module.id,
          title: module.title,
          orderIndex: module.order_index,
          progress: progress ? {
            content_completed: progress.content_completed,
            exercises_completed: progress.exercises_completed,
            quiz_completed: progress.quiz_completed,
            quiz_score: progress.quiz_score,
            started_at: progress.started_at,
            completed_at: progress.completed_at
          } : null
        };
      });

      const completedModules = moduleProgress.filter(m => 
        m.progress?.content_completed && 
        m.progress?.exercises_completed && 
        m.progress?.quiz_completed
      ).length;

      // Calculate assignments completed (exercises + quizzes)
      const assignmentsCompleted = moduleProgress.filter(m => 
        m.progress?.exercises_completed && m.progress?.quiz_completed
      ).length;
      
      const totalAssignments = courseModules.length * 2; // Each module has exercises and quiz

      return {
        id: enrollment.id,
        courseId: enrollment.course.id,
        title: enrollment.course.title,
        institution: institutions.find(i => i.id === enrollment.course.institutionId)?.name,
        progress: enrollment.progress,
        status: enrollment.status,
        startDate: enrollment.startDate,
        endDate: enrollment.endDate,
        modulesCompleted: completedModules,
        totalModules: courseModules.length,
        assignmentsCompleted: assignmentsCompleted,
        totalAssignments: totalAssignments,
        modules: moduleProgress
      };
    });

    // Calculate overall statistics
    const stats = {
      totalCourses: courses.length,
      completedCourses: courses.filter(c => c.status === 'COMPLETED').length,
      inProgressCourses: courses.filter(c => c.status === 'IN_PROGRESS').length,
      averageProgress: Math.round(
        courses.reduce((acc, course) => acc + course.progress, 0) / courses.length || 0
      ),
      totalHoursSpent: Math.round(courses.length * 20), // Placeholder: 20 hours per course
      certificatesEarned: courses.filter(c => c.status === 'COMPLETED').length,
    };

    return NextResponse.json({ courses, stats });
  } catch (error) {
    console.error('Error fetching progress:');
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
} 