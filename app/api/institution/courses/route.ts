import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { assignTagsToCourse } from '@/lib/tag-utils';
import { validateLevelForFramework, type Framework } from '@/lib/framework-utils';
import { z } from 'zod';
import { cache } from '@/lib/cache';

// Define the course schema
const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  framework: z.enum(['CEFR', 'IELTS', 'TOEFL', 'TOEIC', 'CAMBRIDGE']),
  level: z.string().min(1, 'Level is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  maxStudents: z.number().min(1, 'Maximum students must be at least 1'),
  base_price: z.number().min(0, 'Base price cannot be negative'),
  pricingPeriod: z.enum(['FULL_COURSE', 'WEEKLY', 'MONTHLY']),
  duration: z.number().min(1, 'Duration must be at least 1'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  institutionId: z.string().min(1, 'Institution ID is required')
});

// GET all courses for the institution
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get cached data first with longer cache duration
    const cacheKey = `institution_courses:${session.user.institutionId}`;
    const cachedData = await cache.get(cacheKey);
    
    if (cachedData) {
      console.log('Returning cached courses data');
      return NextResponse.json(cachedData);
    }

    console.log('Fetching fresh courses data from database...');
    const startTime = Date.now();

    // Optimized single query with all necessary includes
    const coursesWithData = await prisma.course.findMany({
      where: {
        institutionId: session.user.institutionId,
      },
      include: {
        videoSessions: {
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true
          }
        },
        _count: {
          select: {
            videoSessions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match expected format
    const transformedCourses = coursesWithData.map(course => ({
      ...course,
      modules: [], // No modules relation in schema
      _count: {
        bookings: 0, // No bookings relation in schema
        modules: 0, // No modules relation in schema
        videoSessions: course._count.videoSessions
      }
    }));

    const result = { courses: transformedCourses };
    const endTime = Date.now();
    
    console.log(`Fetched courses in ${endTime - startTime}ms:`, transformedCourses.map(course => ({
      id: course.id,
      title: course.title,
      videoSessionCount: course._count.videoSessions
    })));

    // Cache the result for 10 minutes (increased from 5 minutes)
    await cache.set(cacheKey, result, 10 * 60 * 1000);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Institution Courses API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST new course
export async function POST(req: Request) {
  try {
    console.log('POST /api/institution/courses - Starting request processing');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.institutionId) {
      console.log('Authentication failed - No session or user institution ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Received request body:', body);

    // Ensure the institution ID matches the user's institution
    if (body.institutionId !== session.user.institutionId) {
      console.log('Institution ID mismatch:', {
        provided: body.institutionId,
        user: session.user.institutionId
      });
      return NextResponse.json(
        { error: 'You can only create courses for your own institution' },
        { status: 403 }
      );
    }

    // Validate the request body
    try {
      // Transform tags from array of objects to array of strings
      const transformedBody = {
        ...body,
        maxStudents: parseInt(body.maxStudents),
        base_price: parseFloat(body.base_price),
        duration: parseInt(body.duration),
        tags: body.tags ? body.tags.map((tag: any) => tag.id) : []
      };
      
      const validatedData = courseSchema.parse(transformedBody);
      console.log('Validated data:', validatedData);

      // Check for duplicate course title within the same institution
      const existingCourse = await prisma.course.findFirst({
        where: {
          title: validatedData.title,
          institutionId: session.user.institutionId
        }
      });

      if (existingCourse) {
        return NextResponse.json(
          { error: 'A course with this title already exists in your institution' },
          { status: 400 }
        );
      }

      // Create the course
      const course = await prisma.course.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          categoryId: validatedData.categoryId,
          framework: validatedData.framework,
          level: validatedData.level,
          startDate: new Date(validatedData.startDate),
          endDate: new Date(validatedData.endDate),
          maxStudents: validatedData.maxStudents,
          base_price: validatedData.base_price,
          pricingPeriod: validatedData.pricingPeriod,
          duration: validatedData.duration,
          status: validatedData.status || 'DRAFT',
          institutionId: validatedData.institutionId
        }
      });

      // Create course tags separately if tags are provided
      if (validatedData.tags.length > 0) {
        await prisma.courseTag.createMany({
          data: validatedData.tags.map((tagId: string) => ({
            courseId: course.id,
            tagId: tagId
          }))
        });
      }

      // Fetch the created course with tags
      const courseWithTags = await prisma.course.findUnique({
        where: { id: course.id },
        include: {
          category: true
        }
      });

      // Invalidate cache for this institution's courses
      const cacheKey = `institution_courses:${session.user.institutionId}`;
      await cache.delete(cacheKey);
      console.log('Invalidated courses cache after course creation');

      console.log('Course created successfully:', courseWithTags);
      return NextResponse.json(courseWithTags);
    } catch (validationError) {
      console.error('Validation error:');
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error in POST /api/institution/courses:');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate weekly prices
function calculateWeeklyPrice(weekNumber: number, basePrice: number) {
  // Simple linear increase: 5% increase per week
  const weeklyIncrease = 0.05;
  return Math.round(basePrice * (1 + (weekNumber - 1) * weeklyIncrease) * 100) / 100;
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { id, title, description, base_price, pricingPeriod, duration, level, framework, status, categoryId, startDate, endDate, maxStudents, tags } = data;

    // Validate framework and level
    if (!validateLevelForFramework(level, framework as Framework)) {
      return NextResponse.json({ error: 'Invalid level for selected framework' }, { status: 400 });
    }

    // Update weekly prices year to 2024 if they exist
    await prisma.courseWeeklyPrice.updateMany({
      where: {
        courseId: id,
        year: 2025
      },
      data: {
        year: 2024
      }
    });

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        base_price: parseFloat(base_price),
        pricingPeriod,
        duration: parseInt(duration),
        level,
        framework,
        status,
        categoryId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxStudents: parseInt(maxStudents)
      },
      include: {
        weeklyPrices: {
          where: {
            year: 2024
          },
          orderBy: {
            weekNumber: 'asc'
          }
        }
      }
    });

    // Update course tags separately
    if (tags) {
      // Delete existing tags
      await prisma.courseTag.deleteMany({
        where: { courseId: id }
      });

      // Create new tags - handle both array of objects and array of strings
      if (tags.length > 0) {
        const tagIds = tags.map((tag: any) => typeof tag === 'string' ? tag : tag.id);
        await prisma.courseTag.createMany({
          data: tagIds.map((tagId: string) => ({
            courseId: id,
            tagId: tagId
          }))
        });
      }
    }

    // Invalidate cache for this institution's courses
    const cacheKey = `institution_courses:${session.user.institutionId}`;
    await cache.delete(cacheKey);

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error in PUT /api/institution/courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 