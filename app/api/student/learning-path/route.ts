import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId') || session.user.id;

    // Get student by ID
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    // Get student's active enrollments
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        studentId: student.id,
        status: {
          in: ['ACTIVE', 'IN_PROGRESS', 'ENROLLED']
        }
      },
      include: {
        course: {
          include: {
            institution: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    if (enrollments.length === 0) {
      return NextResponse.json({
        currentCourse: null,
        modules: [],
        nextRecommendations: [],
        learningGoals: []
      });
    }

    // Get the most recent active course as current course
    const currentEnrollment = enrollments[0];
    const currentCourse = currentEnrollment.course;

    // Get modules for the current course
    const courseModules = await prisma.modules.findMany({
      where: {
        course_id: currentCourse.id
      },
      orderBy: {
        order_index: 'asc'
      }
    });

    // Get module progress for the current course
    const moduleProgress = await prisma.moduleProgress.findMany({
      where: {
        studentId: student.id,
        moduleId: {
          in: courseModules.map(m => m.id)
        }
      }
    });

    // Create learning path modules with status and progress
    const learningPathModules = courseModules.map((module, index) => {
      const progress = moduleProgress.find(p => p.moduleId === module.id);
      
      let status: 'completed' | 'in_progress' | 'not_started' | 'locked' = 'not_started';
      let progressPercent = 0;
      let timeSpent = 0;
      let quizScore: number | undefined;

      if (progress) {
        timeSpent = progress.timeSpent || 0;
        quizScore = progress.quizScore || undefined;
        
        if (progress.contentCompleted && progress.exercisesCompleted && progress.quizCompleted) {
          status = 'completed';
          progressPercent = 100;
        } else if (progress.contentCompleted || progress.exercisesCompleted || progress.quizCompleted) {
          status = 'in_progress';
          // Calculate progress based on completed components
          const completedComponents = [
            progress.contentCompleted,
            progress.exercisesCompleted,
            progress.quizCompleted
          ].filter(Boolean).length;
          progressPercent = Math.round((completedComponents / 3) * 100);
        }
      }

      // Check if module is locked (previous module not completed)
      if (index > 0) {
        const previousModule = courseModules[index - 1];
        const previousProgress = moduleProgress.find(p => p.moduleId === previousModule.id);
        if (!previousProgress || !previousProgress.contentCompleted || !previousProgress.exercisesCompleted || !previousProgress.quizCompleted) {
          status = 'locked';
        }
      }

      return {
        id: `path-${module.id}`,
        moduleId: module.id,
        moduleTitle: module.title,
        courseTitle: currentCourse.title,
        courseId: currentCourse.id,
        order: index + 1,
        status,
        progress: progressPercent,
        timeSpent,
        quizScore,
        estimatedTime: module.estimated_duration || 30, // Default 30 minutes
        difficulty: module.level || 'beginner',
        prerequisites: [], // No prerequisites field in schema
        skills: [], // No skills field in schema
        lastAccessed: progress?.lastStudyDate?.toISOString() || progress?.lastAccessedAt?.toISOString()
      };
    });

    // Calculate course statistics
    const completedModules = learningPathModules.filter(m => m.status === 'completed').length;
    const overallProgress = Math.round((completedModules / learningPathModules.length) * 100);

    // Estimate completion date based on current progress and study patterns
    const remainingModules = learningPathModules.length - completedModules;
    const averageStudyTime = 30; // minutes per module
    const estimatedDays = Math.ceil((remainingModules * averageStudyTime) / 60); // Convert to hours, assume 1 hour per day
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + estimatedDays);

    // Get course recommendations based on current progress and interests
    const recommendations = await getCourseRecommendations(student.id, currentCourse.id);

    // Get learning goals (placeholder - would need a goals table)
    const learningGoals = await getLearningGoals(student.id);

    const learningPathData = {
      currentCourse: {
        id: currentCourse.id,
        title: currentCourse.title,
        description: currentCourse.description || 'Continue your learning journey',
        totalModules: learningPathModules.length,
        completedModules,
        overallProgress,
        estimatedCompletion: estimatedCompletion.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        institution: currentCourse.institution?.name || 'Unknown Institution'
      },
      modules: learningPathModules,
      nextRecommendations: recommendations,
      learningGoals
    };

    return NextResponse.json(learningPathData);
  } catch (error) {
    console.error('Error fetching learning path:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

async function getCourseRecommendations(studentId: string, currentCourseId: string) {
  try {
    // Get student's completed courses and interests
    const completedCourses = await prisma.studentCourseCompletion.findMany({
      where: { studentId },
      include: {
        course: {
          select: { id: true, title: true, categoryId: true }
        }
      }
    });

    // Get current course category
    const currentCourse = await prisma.course.findUnique({
      where: { id: currentCourseId },
      select: {
        categoryId: true
      }
    });

    // Find courses in similar categories
    const recommendedCourses = await prisma.course.findMany({
      where: {
        id: { not: currentCourseId },
        status: 'ACTIVE',
        categoryId: currentCourse?.categoryId
      },
      select: {
        id: true,
        title: true,
        description: true,
        categoryId: true
      },
      take: 3
    });

    return recommendedCourses.map(course => ({
      courseId: course.id,
      title: course.title,
      reason: `Similar to your current course`,
      matchScore: Math.floor(Math.random() * 30) + 70 // Random score between 70-100
    }));
  } catch (error) {
    console.error('Error getting recommendations:');
    return [];
  }
}

async function getLearningGoals(studentId: string) {
  try {
    // This would typically come from a learning_goals table
    // For now, return placeholder goals based on progress
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: { studentId },
      include: {
        course: {
          select: {
            title: true
          }
        }
      }
    });

    if (enrollments.length === 0) {
      return [];
    }

    // Create sample goals based on current enrollments
    const goals = [];
    const today = new Date();

    for (const enrollment of enrollments.slice(0, 2)) {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + 30); // 30 days from now

      goals.push({
        id: `goal-${enrollment.id}`,
        title: `Complete ${enrollment.course.title}`,
        targetDate: targetDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        progress: enrollment.progress || 0,
        status: enrollment.progress >= 50 ? 'on_track' : 'behind'
      });
    }

    return goals;
  } catch (error) {
    console.error('Error getting learning goals:');
    return [];
  }
} 