import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// GET modules for a course
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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

    return NextResponse.json(modules);
  } catch (error) {
    console.error('Error fetching modules:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// POST new module
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
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

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const { title, description, level, order, skills = [] } = data;

    const moduleId = uuidv4();
    // Get the highest order number
    const lastModule = await prisma.modules.findFirst({
      where: { course_id: params.id },
      orderBy: { order_index: 'desc' }
    });
    const newOrder = order || (lastModule ? lastModule.order_index + 1 : 1);

    // Create module and skills in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const module = await tx.modules.create({
        data: {
          id: moduleId,
          title,
          description,
          level: level || 'CEFR_A1',
          order_index: newOrder,
          course_id: params.id,
          estimated_duration: 0,
          is_published: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      if (Array.isArray(skills) && skills.length > 0) {
        await Promise.all(
          skills.map((skill: string) =>
            tx.module_skills.create({
              data: { module_id: moduleId, skill }
            })
          )
        );
      }
      return module;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating module:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 