import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const institution = await prisma.institution.findUnique({
      where: { id: params.id },
      include: {
        courses: {
          include: {
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
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!institution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }

    // Get booking counts separately for each course
    const coursesWithCounts = await Promise.all(
      institution.courses.map(async (course) => {
        const bookingCount = await prisma.booking.count({
          where: { courseId: course.id }
        });

        return {
          ...course,
          _count: {
            bookings: bookingCount
          }
        };
      })
    );

    const institutionWithCounts = {
      ...institution,
      courses: coursesWithCounts
    };

    return NextResponse.json(institutionWithCounts);
  } catch (error) {
    console.error('[Institution Courses API] Error:');
    return NextResponse.json(
      { error: 'Failed to fetch institution courses' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (case-insensitive)
    if (session.user.role !== 'ADMIN') {
      // // // console.log('User role:', session.user.role);
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      price,
      duration,
      level,
      status,
      categoryId,
      startDate,
      endDate,
      maxStudents,
      tags
    } = body;

    if (!categoryId) {
      return NextResponse.json(
        { message: 'Category is required' },
        { status: 400 }
      );
    }

    // Verify the category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Invalid category' },
        { status: 400 }
      );
    }

    // Verify the institution exists
    const institution = await prisma.institution.findUnique({
      where: { id: params.id }
    });

    if (!institution) {
      return NextResponse.json(
        { message: 'Invalid institution' },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        id: uuidv4(),
        title,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        level,
        status: status.toUpperCase(),
        categoryId,
        institutionId: params.id,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        maxStudents: parseInt(maxStudents) || 30,
        updatedAt: new Date()
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Get booking count separately
    const bookingCount = await prisma.booking.count({
      where: { courseId: course.id }
    });

    const courseWithCount = {
      ...course,
      _count: {
        bookings: bookingCount
      }
    };

    return NextResponse.json(courseWithCount);
  } catch (error) {
    console.error('Error creating course:');
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 