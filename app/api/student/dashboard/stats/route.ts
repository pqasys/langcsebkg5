import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


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

    // Get all module progress for the student
    const moduleProgress = await prisma.moduleProgress.findMany({
      where: { studentId: student.id }
    });

    // Get learning sessions for the student (if they exist)
    let learningSessions: unknown[] = [];
    try {
      learningSessions = await prisma.learningSession.findMany({
        where: {
          moduleProgressId: {
            in: moduleProgress.map(p => p.id)
          }
        }
      });
    } catch (error) {
    console.error('Error occurred:', error);
      // Learning sessions table might not exist, continue without it
      // // // console.log('Learning sessions not available:', error);
    }

    // Calculate total time spent
    const totalTimeSpent = moduleProgress.reduce((total, progress) => total + progress.timeSpent, 0);

    // Calculate session statistics
    const totalSessions = learningSessions.length;
    
    const averageSessionTime = totalSessions > 0 
      ? Math.round(learningSessions.reduce((total, session) => total + session.duration, 0) / totalSessions)
      : 0;

    // Calculate this week's sessions
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeekSessions = learningSessions.filter(session => 
      new Date(session.startedAt) >= oneWeekAgo
    ).length;

    // Calculate learning streaks
    const studyDates = new Set();
    moduleProgress.forEach(progress => {
      if (progress.lastStudyDate) {
        studyDates.add(new Date(progress.lastStudyDate).toDateString());
      }
    });

    const sortedDates = Array.from(studyDates).sort().reverse();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const nextDate = i < sortedDates.length - 1 ? new Date(sortedDates[i + 1]) : null;
      
      if (nextDate) {
        const diffDays = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 0;
        }
      } else {
        tempStreak++;
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    // Calculate current streak (consecutive days from today)
    const today = new Date().toDateString();
    let consecutiveDays = 0;
    const checkDate = new Date();
    
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const dateString = checkDate.toDateString();
      if (studyDates.has(dateString)) {
        consecutiveDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    currentStreak = consecutiveDays;

    // Calculate average score from quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        student_id: student.id,
        status: 'COMPLETED'
      },
      select: {
        percentage: true
      }
    });

    const averageScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / quizAttempts.length)
      : 0;

    const stats = {
      totalTimeSpent,
      averageSessionTime,
      currentStreak,
      longestStreak,
      totalSessions,
      thisWeekSessions,
      averageScore
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching learning stats:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 