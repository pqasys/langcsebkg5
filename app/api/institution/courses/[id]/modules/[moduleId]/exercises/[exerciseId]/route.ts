import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET specific exercise
export async function GET(
  request: Request,
  { params }: { params: { id: string; moduleId: string; exerciseId: string } }
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

    // Get the specific exercise
    const exercise = await prisma.exercises.findFirst({
      where: {
        id: params.exerciseId,
        module_id: params.moduleId
      }
    });

    if (!exercise) {
      return new NextResponse('Exercise not found', { status: 404 });
    }

    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Error fetching exercise:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// PUT update exercise
export async function PUT(
  request: Request,
  { params }: { params: { id: string; moduleId: string; exerciseId: string } }
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

    // Verify the exercise exists and belongs to the module
    const existingExercise = await prisma.exercises.findFirst({
      where: {
        id: params.exerciseId,
        module_id: params.moduleId
      }
    });

    if (!existingExercise) {
      return new NextResponse('Exercise not found', { status: 404 });
    }

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const { type, question, options, answer, order_index } = data;

    if (!type || !question || !answer) {
      return new NextResponse('Type, question, and answer are required', { status: 400 });
    }

    // Update the exercise
    const exercise = await prisma.exercises.update({
      where: {
        id: params.exerciseId
      },
      data: {
        type,
        question,
        options: options || null,
        answer,
        order_index: order_index || existingExercise.order_index,
        updated_at: new Date()
      }
    });

    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Error updating exercise:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// DELETE exercise
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; moduleId: string; exerciseId: string } }
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

    // Verify the exercise exists and belongs to the module
    const existingExercise = await prisma.exercises.findFirst({
      where: {
        id: params.exerciseId,
        module_id: params.moduleId
      }
    });

    if (!existingExercise) {
      return new NextResponse('Exercise not found', { status: 404 });
    }

    // Delete the exercise
    await prisma.exercises.delete({
      where: {
        id: params.exerciseId
      }
    });

    return new NextResponse('Exercise deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting exercise:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 