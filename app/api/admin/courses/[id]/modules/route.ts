import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// GET modules for a course (Admin only)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized - Admin access required', { status: 401 });
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    const modules = await prisma.modules.findMany({
      where: {
        course_id: params.id
      },
      orderBy: {
        order_index: 'asc'
      },
      include: {
        contentItems: {
          select: {
            id: true,
            type: true,
            title: true,
            order_index: true
          },
          orderBy: {
            order_index: 'asc'
          }
        },
        exercises: {
          select: {
            id: true,
            type: true,
            question: true,
            order_index: true
          },
          orderBy: {
            order_index: 'asc'
          }
        },
        quizzes: {
          select: {
            id: true,
            title: true,
            description: true,
            passing_score: true,
            time_limit: true,
            quiz_type: true,
            difficulty: true
          }
        }
      }
    });

    // Get skills for each module
    const modulesWithSkills = await Promise.all(
      modules.map(async (module) => {
        const skills = await prisma.module_skills.findMany({
          where: { module_id: module.id }
        });
        return {
          ...module,
          skills: skills.map(s => s.skill)
        };
      })
    );

    return NextResponse.json(modulesWithSkills);
  } catch (error) {
    console.error('Error fetching modules:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// POST new module (Admin only)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
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

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const { title, description, level, order, skills = [] } = data;

    if (!title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    const moduleId = uuidv4();
    
    // Get the highest order number
    const lastModule = await prisma.modules.findFirst({
      where: { course_id: params.id },
      orderBy: { order_index: 'desc' }
    });
    
    const newOrder = order || (lastModule ? lastModule.order_index + 1 : 1);

    // Create the module
    const module = await prisma.modules.create({
      data: {
        id: moduleId,
        course_id: params.id,
        title,
        description: description || '',
        level: level || 'BEGINNER',
        order_index: newOrder,
        estimated_duration: 0,
        is_published: false
      }
    });

    // Add skills if provided
    if (skills.length > 0) {
      await prisma.module_skills.createMany({
        data: skills.map((skill: string) => ({
          module_id: moduleId,
          skill
        }))
      });
    }

    // Return the created module with skills
    const createdModule = await prisma.modules.findUnique({
      where: { id: moduleId },
      include: {
        contentItems: true,
        exercises: true,
        quizzes: true
      }
    });

    const moduleSkills = await prisma.module_skills.findMany({
      where: { module_id: moduleId }
    });

    return NextResponse.json({
      ...createdModule,
      skills: moduleSkills.map(s => s.skill)
    });
  } catch (error) {
    console.error('Error creating module:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 