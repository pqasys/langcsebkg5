import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Fetching course details for ID:', params.id);
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('No session or user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (case-insensitive)
    if (session.user.role !== 'ADMIN') {
      console.log('User is not admin:', session.user.role);
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    console.log('Fetching course from database...');
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        },
        category: true,
        courseTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
                icon: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      console.log('Course not found');
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    // Get counts separately
    const [enrollments, completions, courseTags, weeklyPrices, pricingRules] = await Promise.all([
      prisma.studentCourseEnrollment.count({ where: { courseId: course.id } }),
      prisma.studentCourseCompletion.count({ where: { courseId: course.id } }),
      prisma.courseTag.count({ where: { courseId: course.id } }),
      prisma.courseWeeklyPrice.count({ where: { courseId: course.id } }),
      prisma.coursePricingRule.count({ where: { courseId: course.id } })
    ]);

    const courseWithCounts = {
      ...course,
      _count: {
        enrollments,
        completions,
        courseTags,
        weeklyPrices,
        pricingRules,
      },
    };

    console.log('Course found:', {
      id: courseWithCounts.id,
      title: courseWithCounts.title,
      weeklyPricesCount: courseWithCounts.weeklyPrices?.length,
      _count: courseWithCounts._count
    });

    return NextResponse.json(courseWithCounts);
  } catch (error) {
    console.error('Error fetching course:');
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseId = params.id;
    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    console.log('PUT request received for course:', courseId);
    console.log('Session validated:', session);

    // Validate required fields
    const requiredFields = ['title', 'categoryId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Ensure base_price is a number
    const base_price = parseFloat(data.base_price) || 0;

    // Update the course
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: data.title,
        description: data.description,
        base_price: base_price,
        duration: parseInt(data.duration) || 0,
        level: data.level,
        framework: data.framework,
        status: data.status,
        institution: data.institutionId ? {
          connect: { id: data.institutionId }
        } : undefined,
        category: {
          connect: { id: data.categoryId }
        },
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        maxStudents: parseInt(data.maxStudents) || 0,
        pricingPeriod: data.pricingPeriod || 'FULL_COURSE',
        // Update tags
        courseTags: {
          deleteMany: {},
          create: data.tags.map((tag: unknown) => ({
            tag: {
              connect: {
                id: tag.id
              }
            }
          }))
        }
      },
      include: {
        courseTags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:');
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseId = params.id;

    // Delete the course
    await prisma.course.delete({
      where: { id: courseId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:');
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 