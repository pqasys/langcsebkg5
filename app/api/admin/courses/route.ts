import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  const requestId = uuidv4();
  const startTime = Date.now();

  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: unknown = {};
    
    if (institutionId) {
      where.institutionId = institutionId;
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (status) {
      where.status = status.toUpperCase();
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    // Get total count for pagination - optimized with proper indexing
    const total = await prisma.course.count({ where });

    // Single optimized query with all includes and proper pagination
    const courses = await prisma.course.findMany({
      where,
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
            commissionRate: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        courseTags: {
          select: {
            id: true,
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
                icon: true
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true,
            completions: true,
            courseTags: true,
            bookings: true,
            modules: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const duration = Date.now() - startTime;
    const result = {
      courses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      performance: {
        queryTime: duration,
        cacheHit: false,
        optimized: true
      }
    };



    // Record performance metric
    // performanceMonitor.recordMetric({
    //   endpoint: '/api/admin/courses',
    //   method: 'GET',
    //   duration,
    //   status: 200,
    //   cacheHit: false
    // });

    return NextResponse.json(result, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300'
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Error in admin courses API:');
    
    // Record error metric
    // performanceMonitor.recordMetric({
    //   endpoint: '/api/admin/courses',
    //   method: 'GET',
    //   duration,
    //   status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error',
    //   cacheHit: false
    // });

    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { 
        status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=300'
        }
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      base_price,
      pricingPeriod,
      institutionId,
      categoryId,
      framework,
      level,
      tags,
      weeklyPrices,
      monthlyPrices,
      duration,
      status,
      startDate,
      endDate,
      maxStudents
    } = body;

    // Validate required fields
    if (!title || !institutionId || !categoryId) {
      // // // // // // // // // // // // console.log('Missing required fields:', { title, institutionId, categoryId });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate base_price is a number (can be 0)
    if (base_price === undefined || base_price === null || isNaN(Number(base_price))) {
      console.log('Invalid base_price:', base_price);
      return NextResponse.json(
        { error: 'Base price must be a valid number' },
        { status: 400 }
      );
    }

    console.log('Creating course with data:', {
      title,
      base_price,
      pricingPeriod,
      institutionId,
      categoryId,
      tags: tags?.length,
      weeklyPrices: weeklyPrices?.length,
      monthlyPrices: monthlyPrices?.length
    });

    // Create the course
    const course = await prisma.course.create({
      data: {
        id: uuidv4(),
        title,
        description,
        base_price: parseFloat(base_price),
        pricingPeriod: pricingPeriod || 'WEEKLY',
        institutionId,
        categoryId,
        framework: framework || 'GENERAL',
        level: level || 'BEGINNER',
        duration: parseInt(duration) || 0,
        status: status || 'draft',
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        maxStudents: parseInt(maxStudents) || 30,
        courseTags: {
          create: tags?.map((tag: { id: string }) => ({
            tagId: tag.id
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

    console.log('Course created successfully:', course);
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:');
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 
