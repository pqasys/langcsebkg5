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

    // Verify course belongs to institution
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: session.user.institutionId,
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if there are any active enrollments
    const activeEnrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        courseId: params.id,
        status: 'IN_PROGRESS',
      },
    });

    if (activeEnrollments.length > 0) {
      // If there are active enrollments, update their end dates as well
      await prisma.studentCourseEnrollment.updateMany({
        where: {
          courseId: params.id,
          status: 'IN_PROGRESS',
        },
        data: {
          endDate: end,
        },
      });
    }

    // Update course dates
    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: {
        startDate: start,
        endDate: end,
        updatedAt: new Date(),
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Revalidate the courses page
    try {
      const revalidateResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/revalidate?path=/institution/courses`, {
        method: 'GET',
      });
      
      if (!revalidateResponse.ok) {
        // // // // // // console.warn('Failed to revalidate courses page:', await revalidateResponse.text());
      }
    } catch (error) {
    console.error('Error occurred:', error);
      console.warn('Error revalidating courses page:', error);
    }

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course dates:');
    return NextResponse.json(
      { error: 'Failed to update course dates' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 