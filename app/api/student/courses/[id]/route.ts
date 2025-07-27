import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { 
        id: params.id,
        status: 'PUBLISHED'
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get institution information
    const institution = await prisma.institution.findUnique({
      where: { id: course.institutionId },
      select: {
        id: true,
        name: true,
      }
    });

    // Get modules for the course
    const modules = await prisma.modules.findMany({
      where: { course_id: course.id },
      orderBy: { order_index: 'asc' }
    });

    // Get content items, exercises, and quizzes for all modules
    const moduleIds = modules.map(m => m.id);
    const [contentItems, exercises, quizzes] = await Promise.all([
      prisma.content_items.findMany({
        where: { module_id: { in: moduleIds } }
      }),
      prisma.exercises.findMany({
        where: { module_id: { in: moduleIds } }
      }),
      prisma.quizzes.findMany({
        where: { module_id: { in: moduleIds } }
      })
    ]);

    // Get module progress for the student
    const moduleProgress = await prisma.moduleProgress.findMany({
      where: {
        moduleId: { in: moduleIds },
        studentId: session.user.id
      }
    });

    // Get enrollments for the student
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        courseId: course.id,
        studentId: session.user.id
      },
      select: {
        status: true,
        startDate: true,
        endDate: true
      }
    });

    // Calculate overall progress
    const totalModules = modules.length;
    const completedModules = moduleProgress.filter(progress => {
      return progress.contentCompleted && 
             progress.exercisesCompleted && 
             progress.quizCompleted;
    }).length;
    const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

    // Transform the data to match the frontend's expected format
    const transformedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      institution: institution,
      status: enrollments[0]?.status || 'ACTIVE',
      progress,
      startDate: enrollments[0]?.startDate || course.startDate,
      endDate: enrollments[0]?.endDate || course.endDate,
      pricingPeriod: course.pricingPeriod,
      base_price: course.base_price,
      modules: modules.map(module => {
        const moduleContentItems = contentItems.filter(item => item.module_id === module.id);
        const moduleExercises = exercises.filter(exercise => exercise.module_id === module.id);
        const moduleQuizzes = quizzes.filter(quiz => quiz.module_id === module.id);
        const moduleProgressData = moduleProgress.filter(p => p.moduleId === module.id);

        return {
          id: module.id,
          title: module.title,
          description: module.description,
          order_index: module.order_index,
          level: module.level,
          estimated_duration: module.estimated_duration,
          content_items: moduleContentItems,
          exercises: moduleExercises,
          quizzes: moduleQuizzes,
          progress: moduleProgressData.map(p => ({
            contentCompleted: p.contentCompleted,
            exercisesCompleted: p.exercisesCompleted,
            quizCompleted: p.quizCompleted,
            timeSpent: p.timeSpent,
            quizScore: p.quizScore,
            notes: p.notes,
            difficultyRating: p.difficultyRating,
            feedback: p.feedback,
            lastAccessedAt: p.lastAccessedAt
          }))
        };
      })
    };

    return NextResponse.json(transformedCourse, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching course details:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 