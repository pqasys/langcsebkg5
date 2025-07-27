import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const { startDate, endDate } = data;

    // Validate dates
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (start >= end) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Get the enrollment and verify it belongs to the institution's course
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        id: params.id,
        course: {
          institutionId: session.user.institutionId,
        },
      },
      include: {
        course: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Validate enrollment dates against course dates
    const courseStart = new Date(enrollment.course.startDate);
    const courseEnd = new Date(enrollment.course.endDate);

    // Ensure start date is not before course start date
    if (start < courseStart) {
      return NextResponse.json(
        { error: 'Start date cannot be before course start date' },
        { status: 400 }
      );
    }

    // Ensure start date is not after course end date
    if (start > courseEnd) {
      return NextResponse.json(
        { error: 'Start date cannot be after course end date' },
        { status: 400 }
      );
    }

    // Ensure end date is not after course end date
    if (end > courseEnd) {
      return NextResponse.json(
        { error: 'End date cannot be after course end date' },
        { status: 400 }
      );
    }

    // Update enrollment dates
    const updatedEnrollment = await prisma.studentCourseEnrollment.update({
      where: { id: params.id },
      data: {
        startDate: start,
        endDate: end,
        updatedAt: new Date(),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            institution: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Revalidate the relevant pages
    try {
      const revalidatePaths = [
        '/institution/courses',
        '/institution/students',
        `/institution/courses/${enrollment.courseId}`,
        `/institution/students/${enrollment.studentId}`,
      ];

      await Promise.all(
        revalidatePaths.map(path =>
          fetch(`${process.env.NEXTAUTH_URL}/api/revalidate?path=${path}`, {
            method: 'GET',
          })
        )
      );
    } catch (error) {
    console.error('Error occurred:', error);
      // // // console.warn('Error revalidating pages:', error);
    }

    return NextResponse.json(updatedEnrollment);
  } catch (error) {
    console.error('Error updating enrollment dates:');
    return NextResponse.json(
      { error: 'Failed to update enrollment dates' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 