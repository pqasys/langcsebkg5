import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: Request,
  { params }: { params: { id: string; moduleId: string; quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'STUDENT') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { attemptId, answers, timeSpent } = await request.json();

    // Verify attempt exists and belongs to the student
    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        id: attemptId,
        quiz_id: params.quizId,
        student_id: session.user.id,
        status: 'IN_PROGRESS'
      }
    });

    if (!attempt) {
      return new NextResponse('Invalid attempt', { status: 404 });
    }

    // Get quiz with questions
    const quiz = await prisma.quizzes.findFirst({
      where: {
        id: params.quizId,
        module_id: params.moduleId
      },
      include: {
        quiz_questions: {
          orderBy: {
            order_index: 'asc'
          }
        }
      }
    });

    if (!quiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Verify student enrollment
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        studentId: session.user.id,
        courseId: params.id,
        OR: [
          { status: 'ACTIVE' },
          { status: 'COMPLETED' },
          { status: 'IN_PROGRESS' },
          { status: 'PENDING_PAYMENT' },
          { status: 'ENROLLED' }
        ]
      }
    });

    if (!enrollment) {
      return new NextResponse('Not enrolled in this course', { status: 403 });
    }

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    const responses = [];

    for (const question of quiz.quiz_questions) {
      maxScore += question.points;
      const studentAnswer = answers[question.id];
      let isCorrect = false;
      let pointsEarned = 0;

      // Check answer based on question type
      switch (question.type) {
        case 'MULTIPLE_CHOICE':
        case 'TRUE_FALSE':
          isCorrect = studentAnswer === question.correct_answer;
          break;
        case 'FILL_IN_BLANK':
          isCorrect = studentAnswer?.toLowerCase().trim() === question.correct_answer?.toLowerCase().trim();
          break;
        case 'MATCHING':
          // For matching, check if all pairs are correct
          if (studentAnswer && question.correct_answer) {
            const studentPairs = Object.entries(studentAnswer);
            const correctPairs = JSON.parse(question.correct_answer);
            isCorrect = studentPairs.every(([index, answer]) => 
              correctPairs[index] === answer
            );
          }
          break;
        case 'ESSAY':
        case 'SHORT_ANSWER':
          // For essay/short answer, we'll need manual grading
          // For now, mark as not automatically graded
          isCorrect = null;
          break;
        default:
          isCorrect = false;
      }

      if (isCorrect === true) {
        pointsEarned = question.points;
        totalScore += question.points;
      }

      // Create quiz response record
      const response = await prisma.quizResponse.create({
        data: {
          attemptId: attemptId,
          questionId: question.id,
          studentId: session.user.id,
          answer: typeof studentAnswer === 'object' ? JSON.stringify(studentAnswer) : studentAnswer,
          isCorrect: isCorrect,
          pointsEarned: pointsEarned,
          timeSpent: 0, // Could track per question time if needed
          answeredAt: new Date()
        }
      });

      responses.push(response);
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentage >= quiz.passing_score;

    // Update attempt with results
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        completed_at: new Date(),
        score: totalScore,
        total_points: maxScore,
        percentage: percentage,
        time_spent: timeSpent,
        status: 'COMPLETED'
      }
    });

    // Update student progress for this module
    const studentProgress = await prisma.student_progress.findFirst({
      where: {
        student_id: session.user.id,
        module_id: params.moduleId
      }
    });

    if (studentProgress) {
      await prisma.student_progress.update({
        where: { id: studentProgress.id },
        data: {
          quiz_completed: true
        }
      });
    } else {
      await prisma.student_progress.create({
        data: {
          id: uuidv4(),
          student_id: session.user.id,
          module_id: params.moduleId,
          quiz_completed: true,
          content_completed: false,
          exercises_completed: false
        }
      });
    }

    return NextResponse.json({
      attempt: updatedAttempt,
      score: totalScore,
      maxScore: maxScore,
      percentage: percentage,
      passed: passed,
      responses: responses
    });
  } catch (error) {
    console.error('Error submitting quiz:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 