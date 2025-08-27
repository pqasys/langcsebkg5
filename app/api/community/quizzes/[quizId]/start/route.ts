import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CommunityQuizAccessService } from '@/lib/community-quiz-access';

export async function POST(
  request: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check quiz access
    const accessStatus = await CommunityQuizAccessService.checkQuizAccess(
      session.user.id,
      params.quizId
    );

    if (!accessStatus.hasAccess) {
      return NextResponse.json(
        { 
          error: accessStatus.reason,
          upgradePrompt: accessStatus.upgradePrompt,
          requiresUpgrade: true
        },
        { status: 403 }
      );
    }

    // Verify quiz exists and is published
    const quiz = await prisma.quizzes.findFirst({
      where: {
        id: params.quizId,
        is_published: true
      },
      include: {
        quiz_questions: {
          orderBy: { order_index: 'asc' }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found or not available' },
        { status: 404 }
      );
    }

    // Check if user already has an in-progress attempt
    const existingAttempt = await prisma.communityQuizAttempt.findFirst({
      where: {
        userId: session.user.id,
        quizId: params.quizId,
        status: 'IN_PROGRESS'
      }
    });

    if (existingAttempt) {
      return NextResponse.json(existingAttempt);
    }

    // Get next attempt number
    const previousAttempts = await prisma.communityQuizAttempt.findMany({
      where: {
        userId: session.user.id,
        quizId: params.quizId
      },
      orderBy: { attemptNumber: 'desc' }
    });

    const nextAttemptNumber = previousAttempts.length > 0 
      ? previousAttempts[0].attemptNumber + 1 
      : 1;

    // Create new quiz attempt
    const attempt = await prisma.communityQuizAttempt.create({
      data: {
        userId: session.user.id,
        quizId: params.quizId,
        attemptNumber: nextAttemptNumber,
        score: 0,
        percentage: 0,
        passed: false,
        questionsAnswered: 0,
        timeSpent: 0,
        status: 'IN_PROGRESS'
      }
    });

    // Update monthly usage for free users
    if (accessStatus.restrictions) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { monthlyQuizUsage: { increment: 1 } }
      });
    }

    // Prepare questions based on restrictions
    let questions = quiz.quiz_questions;
    if (accessStatus.restrictions) {
      // Limit questions for free users
      questions = questions.slice(0, accessStatus.restrictions.maxQuestions);
    }

    return NextResponse.json({ 
      attempt, 
      restrictions: accessStatus.restrictions,
      questions: questions.map(q => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options,
        order_index: q.order_index,
        points: q.points
      }))
    });
  } catch (error) {
    console.error('Error starting community quiz:', error);
    return NextResponse.json(
      { error: 'Failed to start quiz' },
      { status: 500 }
    );
  }
}
