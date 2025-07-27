import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Fetch course without invalid includes
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Only show published courses to public
    if (course.status !== 'PUBLISHED') {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
    }

    // Fetch related data separately
    const [category, institution, courseTags] = await Promise.all([
      prisma.category.findUnique({
        where: { id: course.categoryId }
      }),
      prisma.institution.findUnique({
        where: { id: course.institutionId }
      }),
      prisma.courseTag.findMany({
        where: { courseId: courseId },
        include: {
          tag: true
        }
      })
    ]);

    // Combine the data
    const courseWithData = {
      ...course,
      category,
      institution,
      courseTags
    };

    return NextResponse.json(courseWithData);
  } catch (error) {
    console.error('Error fetching course:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseId = params.id;
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const {
      title,
      description,
      base_price,
      duration,
      level,
      framework,
      status,
      categoryId,
      startDate,
      endDate,
      maxStudents,
      tags,
      pricingPeriod,
      institutionId
    } = body;

    // Validate required fields
    if (!title || !description || !categoryId || !institutionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        base_price: parseFloat(base_price),
        duration: parseInt(duration),
        level,
        framework,
        status: status.toUpperCase(),
        categoryId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxStudents: parseInt(maxStudents),
        pricingPeriod,
        institutionId
      }
    });

    // Delete existing course tags
    await prisma.courseTag.deleteMany({
      where: { courseId }
    });

    // Create new course tags
    if (tags && tags.length > 0) {
      await prisma.courseTag.createMany({
        data: tags.map((tag: { id: string }) => ({
          courseId: courseId,
          tagId: tag.id
        }))
      });
    }

    // Fetch related data separately
    const [category, institution, courseTags] = await Promise.all([
      prisma.category.findUnique({
        where: { id: updatedCourse.categoryId }
      }),
      prisma.institution.findUnique({
        where: { id: updatedCourse.institutionId }
      }),
      prisma.courseTag.findMany({
        where: { courseId: courseId },
        include: {
          tag: true
        }
      })
    ]);

    // Combine the data
    const courseWithData = {
      ...updatedCourse,
      category,
      institution,
      courseTags
    };

    return NextResponse.json(courseWithData);
  } catch (error) {
    console.error('Error updating course:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseId = params.id;
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Delete course tags first
    await prisma.courseTag.deleteMany({
      where: { courseId }
    });

    // Delete the course
    await prisma.course.delete({
      where: { id: courseId }
    });

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 