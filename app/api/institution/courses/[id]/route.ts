import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
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
  tags: z.array(z.object({ id: z.string() })).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  institutionId: z.string().min(1, 'Institution ID is required').optional()
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log(`[Course Detail API] Fetching course with ID: ${params.id}`);
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.institutionId) {
      console.log('[Course Detail API] Unauthorized - No session or institution ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`[Course Detail API] User institution ID: ${session.user.institutionId}`);

    // Get the course
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        institutionId: session.user.institutionId,
      },
    });

    console.log(`[Course Detail API] Course found:`, course ? 'Yes' : 'No');

    if (!course) {
      // Let's check if the course exists at all
      const anyCourse = await prisma.course.findUnique({
        where: { id: params.id }
      });
      
      if (anyCourse) {
        console.log(`[Course Detail API] Course exists but belongs to institution: ${anyCourse.institutionId}`);
        console.log(`[Course Detail API] User institution: ${session.user.institutionId}`);
      } else {
        console.log(`[Course Detail API] Course with ID ${params.id} does not exist in database`);
      }
      
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get modules separately
    const modules = await prisma.modules.findMany({
      where: {
        course_id: course.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        order_index: true,
        level: true,
        estimated_duration: true,
        is_published: true,
        created_at: true,
        updated_at: true
      },
      orderBy: {
        order_index: 'asc'
      }
    });

    // Get course tags separately
    const courseTags = await prisma.courseTag.findMany({
      where: {
        courseId: course.id
      }
    });

    // Get tag details separately
    const tagIds = [...new Set(courseTags.map(ct => ct.tagId))];
    const tags = await prisma.tag.findMany({
      where: {
        id: {
          in: tagIds
        }
      },
      select: {
        id: true,
        name: true,
        color: true
      }
    });

    // Combine course tags with tag details
    const courseTagsWithDetails = courseTags.map(courseTag => {
      const tag = tags.find(t => t.id === courseTag.tagId);
      return {
        ...courseTag,
        tag: tag || null
      };
    });

    // Combine the data
    const courseWithRelations = {
      ...course,
      modules,
      courseTags: courseTagsWithDetails
    };

    return NextResponse.json(courseWithRelations);
  } catch (error) {
    console.error('Error fetching course:');
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT request received for course:', params.id);
    const session = await getServerSession(authOptions);
    if (!session?.user?.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    console.log('Update request data:', data);
    const { 
      title, 
      description, 
      base_price, 
      pricingPeriod, 
      duration, 
      level, 
      framework, 
      status, 
      categoryId, 
      startDate, 
      endDate, 
      maxStudents, 
      tags 
    } = data;

    console.log('Status from request:', status);

    // Validate the request body
    try {
      const validatedData = courseSchema.parse({
        ...data,
        maxStudents: parseInt(maxStudents),
        base_price: parseFloat(base_price),
        duration: parseInt(duration),
        tags: tags || []
      });
      console.log('Validated data:', validatedData);

      // Verify course belongs to institution
      const existingCourse = await prisma.course.findFirst({
        where: {
          id: params.id,
          institutionId: session.user.institutionId,
        },
      });

      if (!existingCourse) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      // Check if another course with the same title exists in the institution
      const duplicateCourse = await prisma.course.findFirst({
        where: {
          title,
          institutionId: session.user.institutionId,
          id: { not: params.id }
        },
      });

      if (duplicateCourse) {
        return NextResponse.json(
          { error: 'A course with this title already exists in your institution' },
          { status: 400 }
        );
      }

      // Validate framework and level
      if (!validateLevelForFramework(level, framework as Framework)) {
        return NextResponse.json({ error: 'Invalid level for selected framework' }, { status: 400 });
      }

      // Update the course
      const updatedCourse = await prisma.course.update({
        where: { id: params.id },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          base_price: validatedData.base_price,
          pricingPeriod: validatedData.pricingPeriod,
          duration: validatedData.duration,
          level: validatedData.level,
          framework: validatedData.framework,
          status: validatedData.status,
          categoryId: validatedData.categoryId,
          startDate: new Date(validatedData.startDate),
          endDate: new Date(validatedData.endDate),
          maxStudents: validatedData.maxStudents
        }
      });

      // Update course tags separately
      if (validatedData.tags) {
        // Delete existing tags
        await prisma.courseTag.deleteMany({
          where: { courseId: params.id }
        });

        // Create new tags
        if (validatedData.tags.length > 0) {
          await prisma.courseTag.createMany({
            data: validatedData.tags.map((tag: { id: string }) => ({
              courseId: params.id,
              tagId: tag.id
            }))
          });
        }
      }

      // Direct DB check after update
      const fresh = await prisma.course.findUnique({ where: { id: params.id } });
      console.log('Fresh DB value after update:', fresh.status);

      // Invalidate cache for this institution's courses
      const cacheKey = `institution_courses:${session.user.institutionId}`;
      await cache.delete(cacheKey);
      console.log('Invalidated courses cache after course update');

      console.log('Course updated successfully:', updatedCourse);
      return NextResponse.json(updatedCourse);
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
    console.error('Error updating course:');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update course' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    await prisma.course.delete({
      where: { id: params.id },
    });

    // Invalidate cache for this institution's courses
    const cacheKey = `institution_courses:${session.user.institutionId}`;
    await cache.delete(cacheKey);
    console.log('Invalidated courses cache after course deletion');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:');
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

function calculateWeeklyPrice(weekNumber: number, basePrice: number) {
  // Calculate total price for all weeks up to current week
  const totalPrice = basePrice * weekNumber;
  
  // Apply progressive discount (5% per month, capped at 50%)
  const discountRate = Math.min(Math.floor((weekNumber - 1) / 4) * 5 + 5, 50);
  const discount = totalPrice * (discountRate / 100);
  
  // Calculate final price
  const finalPrice = totalPrice - discount;
  
  // Round to nearest whole number
  return Math.round(finalPrice);
}

function calculateMonthlyPrice(monthNumber: number, basePrice: number) {
  // Calculate total price for all months up to current month
  const totalPrice = basePrice * monthNumber;
  
  // Apply progressive discount (5% per month, capped at 50%)
  const discountRate = Math.min(monthNumber * 5, 50);
  const discount = totalPrice * (discountRate / 100);
  
  // Calculate final price
  const finalPrice = totalPrice - discount;
  
  // Round to nearest whole number
  return Math.round(finalPrice);
} 