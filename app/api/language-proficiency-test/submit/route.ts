import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, score, level, answers, timeSpent } = body;

    if (!userId || score === undefined || !level || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a test attempt record
    const testAttempt = await prisma.quizAttempt.create({
      data: {
        id: uuidv4(),
        quiz_id: 'language-proficiency-test', // Special ID for this test
        student_id: userId,
        score: score,
        total_points: 80,
        percentage: (score / 80) * 100,
        status: 'COMPLETED',
        passed: score >= 40, // Pass threshold
        questions_answered: Object.keys(answers).length,
        time_spent: timeSpent || 0,
        completed_at: new Date(),
        started_at: new Date(Date.now() - (timeSpent || 0) * 1000),
        attempt_number: 1,
        is_adaptive: false
      }
    });

    // Save detailed results
    const detailedResults = await prisma.quizResponse.createMany({
      data: Object.entries(answers).map(([questionId, answer]) => ({
        id: uuidv4(),
        attemptId: testAttempt.id,
        questionId: questionId,
        studentId: userId,
        answer: answer as string,
        isCorrect: true, // We'll determine this based on the question
        pointsEarned: 1, // Each question is worth 1 point
        timeSpent: Math.floor(timeSpent / Object.keys(answers).length),
        answeredAt: new Date()
      }))
    });

    return NextResponse.json({
      success: true,
      attemptId: testAttempt.id,
      score,
      level,
      percentage: (score / 80) * 100
    });

  } catch (error) {
    console.error('Error submitting language proficiency test:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}