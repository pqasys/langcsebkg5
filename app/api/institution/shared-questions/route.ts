import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return NextResponse.json({ error: 'User not associated with an institution' }, { status: 403 });
    }

    // First get all courses from other institutions
    const otherInstitutionCourses = await prisma.course.findMany({
      where: {
        institutionId: {
          not: user.institution.id
        }
      },
      select: {
        id: true,
        title: true,
        institution: {
          select: {
            id: true,
            name: true,
            country: true
          }
        }
      }
    });

    const otherCourseIds = otherInstitutionCourses.map(c => c.id);

    // Then get all modules for these courses
    const modules = await prisma.modules.findMany({
      where: {
        course_id: {
          in: otherCourseIds
        }
      },
      select: {
        id: true,
        title: true,
        course_id: true
      }
    });

    const moduleIds = modules.map(m => m.id);

    // Then get all quizzes for these modules
    const quizzes = await prisma.quizzes.findMany({
      where: {
        module_id: {
          in: moduleIds
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        module_id: true
      }
    });

    const quizIds = quizzes.map(q => q.id);

    // Finally get all questions for these quizzes
    const sharedQuestions = await prisma.quiz_questions.findMany({
      where: {
        quiz_id: {
          in: quizIds
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 50 // Limit to 50 most recent questions
    });

    // Create lookup maps for efficient data access
    const courseMap = new Map(otherInstitutionCourses.map(c => [c.id, c]));
    const moduleMap = new Map(modules.map(m => [m.id, m]));
    const quizMap = new Map(quizzes.map(q => [q.id, q]));

    // Transform the data to match expected format
    const transformedQuestions = sharedQuestions.map(question => {
      const quiz = quizMap.get(question.quiz_id);
      const module = quiz ? moduleMap.get(quiz.module_id) : null;
      const course = module ? courseMap.get(module.course_id) : null;

      return {
        id: question.id,
        question_text: question.question,
        question_type: question.type,
        options: question.options,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
        difficulty: question.difficulty,
        category: question.category,
        tags: question.tags,
        points: question.points,
        created_at: question.created_at,
        updated_at: question.updated_at,
        is_shared: true,
        shared_with: ['PUBLIC', 'INSTITUTION'],
        sharing_permissions: {
          allowCopy: true,
          allowModify: false
        },
        shared_message: 'Shared by institution',
        shared_by: course?.institution?.name || 'Unknown Institution',
        shared_at: question.created_at,
        questionBank: {
          id: quiz?.id || '',
          name: quiz?.title || 'Quiz Question',
          description: quiz?.description || '',
          category: question.category || ''
        },
        creator: {
          id: course?.institution?.id || '',
          name: course?.institution?.name || 'Unknown',
          email: 'institution@example.com'
        },
        institution: {
          id: course?.institution?.id || '',
          name: course?.institution?.name || 'Unknown Institution',
          country: course?.institution?.country || ''
        },
        usage_count: question.times_asked || 0,
        rating: question.success_rate || 0
      };
    });

    return NextResponse.json(transformedQuestions);
  } catch (error) {
    console.error('Error fetching shared questions:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 