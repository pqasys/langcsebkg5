import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// GET exercises for a module
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

    // Verify the module belongs to the course
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id
      }
    });

    if (!module) {
      return new NextResponse('Module not found', { status: 404 });
    }

    // Get exercises for the module
    const exercises = await prisma.exercises.findMany({
      where: {
        module_id: params.moduleId
      },
      orderBy: {
        order_index: 'asc'
      }
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// POST new exercise
export async function POST(
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

    // Verify the module belongs to the course
    const module = await prisma.modules.findFirst({
      where: {
        id: params.moduleId,
        course_id: params.id
      }
    });

    if (!module) {
      return new NextResponse('Module not found', { status: 404 });
    }

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const { type, question, options, answer, order_index } = data;

    if (!type || !question || !answer) {
      return new NextResponse('Type, question, and answer are required', { status: 400 });
    }

    // Get the highest order number
    const lastExercise = await prisma.exercises.findFirst({
      where: { module_id: params.moduleId },
      orderBy: { order_index: 'desc' }
    });
    
    const newOrder = order_index || (lastExercise ? lastExercise.order_index + 1 : 1);

    // Create the exercise
    const exercise = await prisma.exercises.create({
      data: {
        id: uuidv4(),
        module_id: params.moduleId,
        type,
        question,
        options: options || null,
        answer,
        order_index: newOrder
      }
    });

    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Error creating exercise:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 