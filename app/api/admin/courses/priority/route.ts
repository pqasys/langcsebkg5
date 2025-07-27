import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const priorityUpdateSchema = z.object({
  courseId: z.string().uuid(),
  priority: z.number().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isSponsored: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = priorityUpdateSchema.parse(body);

    // Update course priority settings
    const updatedCourse = await prisma.course.update({
      where: { id: validatedData.courseId },
      data: {
        ...(validatedData.priority !== undefined && { priority: validatedData.priority }),
        ...(validatedData.isFeatured !== undefined && { isFeatured: validatedData.isFeatured }),
        ...(validatedData.isSponsored !== undefined && { isSponsored: validatedData.isSponsored }),
        updatedAt: new Date(),
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            isFeatured: true,
            commissionRate: true,
            subscriptionPlan: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Calculate new priority score based on updated values
    let priorityScore = 0;

    // Featured institution bonus (highest priority)
    if (updatedCourse.institution.isFeatured) {
      priorityScore += 1000;
    }

    // Manual priority bonus
    priorityScore += updatedCourse.priority || 0;

    // Commission rate bonus (0-50 points based on rate)
    priorityScore += (updatedCourse.institution.commissionRate || 0) * 10;

    // Subscription plan bonus
    const planBonus = {
      'BASIC': 0,
      'PROFESSIONAL': 50,
      'ENTERPRISE': 100
    };
    priorityScore += planBonus[updatedCourse.institution.subscriptionPlan] || 0;

    // Featured course bonus
    if (updatedCourse.isFeatured) {
      priorityScore += 500;
    }

    // Sponsored course bonus
    if (updatedCourse.isSponsored) {
      priorityScore += 300;
    }

    // Recency bonus (newer courses get slight boost)
    const daysSinceCreation = Math.floor((Date.now() - new Date(updatedCourse.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    priorityScore += Math.max(0, 30 - daysSinceCreation);

    // Start date proximity bonus (sooner courses get boost)
    const daysUntilStart = Math.floor((new Date(updatedCourse.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    priorityScore += Math.max(0, 30 - daysUntilStart);

    // Update the calculated priority score
    await prisma.course.update({
      where: { id: validatedData.courseId },
      data: {
        priorityScore: priorityScore,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Course priority updated successfully',
      data: {
        ...updatedCourse,
        priorityScore: priorityScore,
      },
    });

  } catch (error) {
    console.error('Error updating course priority:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update course priority',
    }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({
        success: false,
        error: 'Course ID is required',
      }, { status: 400 });
    }

    // Get course priority information
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        priority: true,
        priorityScore: true,
        isFeatured: true,
        isSponsored: true,
        createdAt: true,
        startDate: true,
        institution: {
          select: {
            id: true,
            name: true,
            isFeatured: true,
            commissionRate: true,
            subscriptionPlan: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({
        success: false,
        error: 'Course not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: course,
    });

  } catch (error) {
    console.error('Error fetching course priority:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch course priority',
    }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 