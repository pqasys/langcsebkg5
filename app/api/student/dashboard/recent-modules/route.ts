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

    // Get student by ID
    const student = await prisma.student.findUnique({
      where: { id: session.user.id }
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    // Get recent module progress
    const recentModules = await prisma.moduleProgress.findMany({
      where: { 
        studentId: student.id,
        lastAccessedAt: {
          not: null
        }
      },
      orderBy: { lastAccessedAt: 'desc' },
      take: 10 // Limit to 10 most recent modules
    });

    // Get module information for progress
    const moduleIds = recentModules.map(p => p.moduleId);
    const modules = await prisma.modules.findMany({
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

    // Get course information for modules
    const courseIds = [...new Set(modules.map(m => m.course_id))];
    const courses = await prisma.course.findMany({
      where: {
        id: {
          in: courseIds
        }
      },
      select: {
        id: true,
        title: true
      }
    });

    // Transform the data for the frontend
    const transformedModules = recentModules.map(progress => {
      const module = modules.find(m => m.id === progress.moduleId);
      const course = module ? courses.find(c => c.id === module.course_id) : null;
      
      return {
        id: progress.id,
        moduleId: progress.moduleId,
        moduleTitle: module?.title || 'Unknown Module',
        courseTitle: course?.title || 'Unknown Course',
        contentCompleted: progress.contentCompleted,
        exercisesCompleted: progress.exercisesCompleted,
        quizCompleted: progress.quizCompleted,
        timeSpent: progress.timeSpent,
        quizScore: progress.quizScore,
        bestQuizScore: progress.bestQuizScore,
        learningStreak: progress.learningStreak,
        lastStudyDate: progress.lastStudyDate?.toISOString() || progress.lastAccessedAt?.toISOString() || '',
        retryAttempts: progress.retryAttempts,
        achievementUnlocked: progress.achievementUnlocked
      };
    });

    return NextResponse.json(transformedModules);
  } catch (error) {
    console.error('Error fetching recent modules:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 