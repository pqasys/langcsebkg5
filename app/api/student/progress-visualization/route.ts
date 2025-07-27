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
    const timeRange = searchParams.get('timeRange') || '30d';

    // Get student by ID
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    // Calculate date range based on timeRange parameter
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get module progress data
    const moduleProgress = await prisma.moduleProgress.findMany({
      where: {
        studentId: student.id,
        lastStudyDate: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Get module details for the progress records
    const moduleIds = [...new Set(moduleProgress.map(p => p.moduleId))];
    const modules = await prisma.modules.findMany({
      where: {
        id: {
          in: moduleIds
        }
      },
      include: {
        // Include course information through a separate query
      }
    });

    // Get course information for the modules
    const courseIds = [...new Set(modules.map(m => m.course_id))];
    const courses = await prisma.course.findMany({
      where: {
        id: {
          in: courseIds
        }
      },
      select: {
        id: true,
        title: true,
        categoryId: true
      }
    });

    // Combine the data
    const enrichedModuleProgress = moduleProgress.map(progress => {
      const module = modules.find(m => m.id === progress.moduleId);
      const course = courses.find(c => c.id === module?.course_id);
      return {
        ...progress,
        module: module ? {
          ...module,
          course: course || null
        } : null
      };
    });

    // Get quiz attempts data
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        student_id: student.id,
        completed_at: {
          gte: startDate,
          lte: endDate
        },
        status: 'COMPLETED'
      }
    });

    // Generate daily progress data
    const dailyProgress = generateDailyProgress(startDate, endDate, enrichedModuleProgress, quizAttempts);

    // Generate weekly stats
    const weeklyStats = generateWeeklyStats(startDate, endDate, enrichedModuleProgress, quizAttempts);

    // Generate subject breakdown
    const subjectBreakdown = generateSubjectBreakdown(enrichedModuleProgress);

    // Generate milestones
    const milestones = generateMilestones(student.id, enrichedModuleProgress, quizAttempts);

    const progressData = {
      dailyProgress,
      weeklyStats,
      subjectBreakdown,
      milestones
    };

    return NextResponse.json(progressData);
  } catch (error) {
    console.error('Error fetching progress visualization:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

function generateDailyProgress(startDate: Date, endDate: Date, moduleProgress: unknown[], quizAttempts: unknown[]) {
  const dailyData = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Get data for this specific date
    const dayProgress = moduleProgress.filter(p => {
      const progressDate = new Date(p.lastStudyDate || p.lastAccessedAt);
      return progressDate.toISOString().split('T')[0] === dateString;
    });

    const dayQuizzes = quizAttempts.filter(q => {
      const quizDate = new Date(q.completed_at);
      return quizDate.toISOString().split('T')[0] === dateString;
    });

    const timeSpent = dayProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const modulesCompleted = dayProgress.filter(p => 
      p.contentCompleted && p.exercisesCompleted && p.quizCompleted
    ).length;
    const quizzesTaken = dayQuizzes.length;
    const averageScore = dayQuizzes.length > 0 
      ? Math.round(dayQuizzes.reduce((sum, q) => sum + (q.percentage || 0), 0) / dayQuizzes.length)
      : 0;

    dailyData.push({
      date: dateString,
      timeSpent,
      modulesCompleted,
      quizzesTaken,
      score: averageScore
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dailyData;
}

function generateWeeklyStats(startDate: Date, endDate: Date, moduleProgress: unknown[], quizAttempts: unknown[]) {
  const weeklyData = [];
  const currentDate = new Date(startDate);
  let weekNumber = 1;

  while (currentDate <= endDate) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Get data for this week
    const weekProgress = moduleProgress.filter(p => {
      const progressDate = new Date(p.lastStudyDate || p.lastAccessedAt);
      return progressDate >= weekStart && progressDate <= weekEnd;
    });

    const weekQuizzes = quizAttempts.filter(q => {
      const quizDate = new Date(q.completed_at);
      return quizDate >= weekStart && quizDate <= weekEnd;
    });

    const totalTime = weekProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const averageScore = weekQuizzes.length > 0 
      ? Math.round(weekQuizzes.reduce((sum, q) => sum + (q.percentage || 0), 0) / weekQuizzes.length)
      : 0;

    // Calculate streak for this week
    const studyDates = new Set();
    weekProgress.forEach(p => {
      if (p.lastStudyDate) {
        studyDates.add(new Date(p.lastStudyDate).toDateString());
      }
    });

    let streak = 0;
    const checkDate = new Date(weekEnd);
    for (let i = 0; i < 7; i++) {
      const dateString = checkDate.toDateString();
      if (studyDates.has(dateString)) {
        streak++;
      } else {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    weeklyData.push({
      week: weekNumber.toString(),
      totalTime,
      averageScore,
      streak
    });

    currentDate.setDate(currentDate.getDate() + 7);
    weekNumber++;
  }

  return weeklyData;
}

function generateSubjectBreakdown(moduleProgress: unknown[]) {
  const subjectMap = new Map();

  moduleProgress.forEach(progress => {
    const courseTitle = progress.module?.course?.title || 'Unknown Course';
    
    if (!subjectMap.has(courseTitle)) {
      subjectMap.set(courseTitle, {
        subject: courseTitle,
        progress: 0,
        timeSpent: 0,
        modulesCompleted: 0,
        totalModules: 0
      });
    }

    const subject = subjectMap.get(courseTitle);
    subject.timeSpent += progress.timeSpent || 0;
    subject.totalModules++;

    if (progress.contentCompleted && progress.exercisesCompleted && progress.quizCompleted) {
      subject.modulesCompleted++;
    }
  });

  // Calculate progress percentage for each subject
  const subjects = Array.from(subjectMap.values()).map(subject => ({
    ...subject,
    progress: subject.totalModules > 0 ? Math.round((subject.modulesCompleted / subject.totalModules) * 100) : 0
  }));

  return subjects;
}

async function generateMilestones(studentId: string, moduleProgress: unknown[], quizAttempts: unknown[]) {
  const milestones = [];

  // Calculate total time spent
  const totalTimeSpent = moduleProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  const totalModules = moduleProgress.length;
  const completedModules = moduleProgress.filter(p => 
    p.contentCompleted && p.exercisesCompleted && p.quizCompleted
  ).length;
  const averageScore = quizAttempts.length > 0 
    ? Math.round(quizAttempts.reduce((sum, q) => sum + (q.percentage || 0), 0) / quizAttempts.length)
    : 0;

  // Calculate current streak
  const studyDates = new Set();
  moduleProgress.forEach(p => {
    if (p.lastStudyDate) {
      studyDates.add(new Date(p.lastStudyDate).toDateString());
    }
  });

  const sortedDates = Array.from(studyDates).sort().reverse();
  let currentStreak = 0;
  const checkDate = new Date();
  
  for (let i = 0; i < 365; i++) {
    const dateString = checkDate.toDateString();
    if (studyDates.has(dateString)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Define milestones
  const timeMilestones = [
    { target: 60, title: 'First Hour', description: 'Complete your first hour of study' },
    { target: 300, title: '5 Hours', description: 'Complete 5 hours of study' },
    { target: 600, title: '10 Hours', description: 'Complete 10 hours of study' },
    { target: 1200, title: '20 Hours', description: 'Complete 20 hours of study' }
  ];

  const moduleMilestones = [
    { target: 1, title: 'First Module', description: 'Complete your first module' },
    { target: 5, title: '5 Modules', description: 'Complete 5 modules' },
    { target: 10, title: '10 Modules', description: 'Complete 10 modules' },
    { target: 25, title: '25 Modules', description: 'Complete 25 modules' }
  ];

  const scoreMilestones = [
    { target: 70, title: 'Passing Grade', description: 'Achieve a 70% average score' },
    { target: 80, title: 'Good Score', description: 'Achieve an 80% average score' },
    { target: 90, title: 'Excellent Score', description: 'Achieve a 90% average score' },
    { target: 95, title: 'Outstanding Score', description: 'Achieve a 95% average score' }
  ];

  const streakMilestones = [
    { target: 3, title: '3-Day Streak', description: 'Study for 3 consecutive days' },
    { target: 7, title: 'Week Warrior', description: 'Study for 7 consecutive days' },
    { target: 14, title: 'Fortnight Focus', description: 'Study for 14 consecutive days' },
    { target: 30, title: 'Monthly Master', description: 'Study for 30 consecutive days' }
  ];

  // Add time milestones
  timeMilestones.forEach(milestone => {
    milestones.push({
      id: `time-${milestone.target}`,
      title: milestone.title,
      description: milestone.description,
      achieved: totalTimeSpent >= milestone.target,
      achievedAt: totalTimeSpent >= milestone.target ? new Date().toISOString() : undefined,
      target: milestone.target,
      current: totalTimeSpent,
      type: 'time' as const
    });
  });

  // Add module milestones
  moduleMilestones.forEach(milestone => {
    milestones.push({
      id: `modules-${milestone.target}`,
      title: milestone.title,
      description: milestone.description,
      achieved: completedModules >= milestone.target,
      achievedAt: completedModules >= milestone.target ? new Date().toISOString() : undefined,
      target: milestone.target,
      current: completedModules,
      type: 'modules' as const
    });
  });

  // Add score milestones
  scoreMilestones.forEach(milestone => {
    milestones.push({
      id: `score-${milestone.target}`,
      title: milestone.title,
      description: milestone.description,
      achieved: averageScore >= milestone.target,
      achievedAt: averageScore >= milestone.target ? new Date().toISOString() : undefined,
      target: milestone.target,
      current: averageScore,
      type: 'score' as const
    });
  });

  // Add streak milestones
  streakMilestones.forEach(milestone => {
    milestones.push({
      id: `streak-${milestone.target}`,
      title: milestone.title,
      description: milestone.description,
      achieved: currentStreak >= milestone.target,
      achievedAt: currentStreak >= milestone.target ? new Date().toISOString() : undefined,
      target: milestone.target,
      current: currentStreak,
      type: 'streak' as const
    });
  });

  return milestones;
} 