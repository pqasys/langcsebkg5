import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET module by ID (Admin only)
export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized - Admin access required', { status: 401 });
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    // Get the module with its related content
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id
      },
      include: {
        contentItems: {
          orderBy: {
            order_index: 'asc'
          }
        },
        exercises: {
          orderBy: {
            order_index: 'asc'
          }
        },
        quizzes: {
          include: {
            quiz_questions: {
              orderBy: {
                order_index: 'asc'
              }
            }
          }
        }
      }
    });

    if (!module) {
      return new NextResponse('Module not found', { status: 404 });
    }

    // Fetch skills
    const skills = await prisma.module_skills.findMany({ 
      where: { module_id: params.moduleId } 
    });
    
    return NextResponse.json({ 
      ...module, 
      skills: skills.map(s => s.skill) 
    });
  } catch (error) {
    console.error('Error fetching module:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// PATCH update module (Admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized - Admin access required', { status: 401 });
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id }
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

    // Update the module
    const updatedModule = await prisma.modules.update({
      where: { id: params.moduleId },
      data: {
        title: data.title,
        description: data.description || '',
        level: data.level || existingModule.level,
        estimated_duration: data.estimated_duration || 0,
        vocabulary_list: data.vocabulary_list || '',
        grammar_points: data.grammar_points || '',
        cultural_notes: data.cultural_notes || '',
        is_published: data.is_published !== undefined ? data.is_published : existingModule.is_published
      }
    });

    // Update skills if provided
    if (data.skills) {
      // Delete existing skills
      await prisma.module_skills.deleteMany({
        where: { module_id: params.moduleId }
      });

      // Add new skills
      if (data.skills.length > 0) {
        await prisma.module_skills.createMany({
          data: data.skills.map((skill: string) => ({
            module_id: params.moduleId,
            skill
          }))
        });
      }
    }

    // Return updated module with skills
    const moduleWithSkills = await prisma.modules.findUnique({
      where: { id: params.moduleId },
      include: {
        contentItems: true,
        exercises: true,
        quizzes: true
      }
    });

    const skills = await prisma.module_skills.findMany({
      where: { module_id: params.moduleId }
    });

    return NextResponse.json({
      ...moduleWithSkills,
      skills: skills.map(s => s.skill)
    });
  } catch (error) {
    console.error('Error updating module:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// DELETE module (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized - Admin access required', { status: 401 });
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id }
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

    // Delete the module (this will cascade delete related content, exercises, quizzes, and skills)
    await prisma.modules.delete({
      where: { id: params.moduleId }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting module:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 