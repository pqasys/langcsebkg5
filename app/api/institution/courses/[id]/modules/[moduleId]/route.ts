import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET module by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'INSTITUTION') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // First get the user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return new NextResponse('Institution not found', { status: 404 });
    }

    // Verify the course belongs to the institution
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: user.institution.id
      }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Get the module
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id
      }
    });

    if (!module) {
      return new NextResponse('Module not found', { status: 404 });
    }

    // Get content items separately
    const contentItems = await prisma.content_items.findMany({
      where: {
        module_id: params.moduleId
      },
      orderBy: {
        order_index: 'asc'
      }
    });

    // Get exercises separately
    const exercises = await prisma.exercises.findMany({
      where: {
        module_id: params.moduleId
      },
      orderBy: {
        order_index: 'asc'
      }
    });

    // Get quizzes separately
    const quizzes = await prisma.quizzes.findMany({
      where: {
        module_id: params.moduleId
      }
    });

    // Get quiz questions for each quiz
    const quizIds = quizzes.map(q => q.id);
    const quizQuestions = await prisma.quiz_questions.findMany({
      where: {
        quiz_id: {
          in: quizIds
        }
      },
      orderBy: {
        order_index: 'asc'
      }
    });

    // Group quiz questions by quiz
    const quizzesWithQuestions = quizzes.map(quiz => ({
      ...quiz,
      quiz_questions: quizQuestions.filter(qq => qq.quiz_id === quiz.id)
    }));

    // Fetch skills
    const skills = await prisma.module_skills.findMany({ where: { module_id: params.moduleId } });
    
    // Combine all data
    const moduleWithContent = {
      ...module,
      content_items: contentItems,
      exercises: exercises,
      quizzes: quizzesWithQuestions,
      skills: skills.map(s => s.skill)
    };

    return NextResponse.json(moduleWithContent);
  } catch (error) {
    console.error('Error in GET /api/institution/courses/[id]/modules/[moduleId]:');
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
    }
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// PATCH update module
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'INSTITUTION') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // First get the user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return new NextResponse('Institution not found', { status: 404 });
    }

    // Verify the course belongs to the institution
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: user.institution.id
      }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Verify the module exists and belongs to the course
    const existingModule = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id
      }
    });

    if (!existingModule) {
      return new NextResponse('Module not found', { status: 404 });
    }

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;

    // Validate required fields
    if (!data.title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    // Update the module and its skills in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedModule = await tx.modules.update({
        where: { id: params.moduleId },
        data: {
          title: data.title,
          description: data.description || null,
          level: data.level,
          estimated_duration: data.estimated_duration || 0,
          vocabulary_list: data.vocabulary_list || null,
          grammar_points: data.grammar_points || null,
          cultural_notes: data.cultural_notes || null,
          is_published: data.is_published || false,
          updated_at: new Date()
        }
      });
      if (Array.isArray(data.skills)) {
        // Remove all existing skills
        await tx.module_skills.deleteMany({ where: { module_id: params.moduleId } });
        // Add new skills
        await Promise.all(
          data.skills.map((skill: string) =>
            tx.module_skills.create({ data: { module_id: params.moduleId, skill } })
          )
        );
      }
      return updatedModule;
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in PATCH /api/institution/courses/[id]/modules/[moduleId]:');
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
    }
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// DELETE module
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'INSTITUTION') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // First get the user's institution
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { institution: true }
    });

    if (!user?.institution) {
      return new NextResponse('Institution not found', { status: 404 });
    }

    // Verify the course belongs to the institution
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: user.institution.id
      }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Delete the module
    await prisma.modules.delete({
      where: {
        id: params.moduleId
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/institution/courses/[id]/modules/[moduleId]:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 