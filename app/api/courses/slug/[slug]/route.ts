import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session data:', {
      hasSession: !!session,
      userRole: session?.user?.role,
      isInstitution: session?.user?.role === 'INSTITUTION_STAFF',
      institutionData: session?.user?.institutionId,
      isApproved: session?.user?.institutionApproved
    });

    // Find course by slug
    const course = await prisma.course.findUnique({
      where: {
        slug: params.slug
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            isApproved: true,
            status: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        courseTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
                icon: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if course is publicly accessible
    const isPubliclyAccessible = course.status === 'PUBLISHED' || course.status === 'ACTIVE';
    
    if (!isPubliclyAccessible) {
      // Check if user has access to non-public courses
      const hasAccess = session && (
        session.user.role === 'ADMIN' ||
        (session.user.role === 'INSTITUTION_STAFF' && session.user.institutionId === course.institutionId)
      );
      
      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }
    }

    // Check if institution is approved and active (for public access)
    if (!session && course.institution && (!course.institution.isApproved || course.institution.status !== 'ACTIVE')) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const courseData = {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      duration: course.duration,
      level: course.level,
      status: course.status,
      startDate: course.startDate,
      endDate: course.endDate,
      maxStudents: course.maxStudents,
      base_price: course.base_price,
      pricingPeriod: course.pricingPeriod,
      framework: course.framework,
      isFeatured: course.isFeatured,
      isSponsored: course.isSponsored,
      priority: course.priority,
      hasLiveClasses: course.hasLiveClasses,
      liveClassType: course.liveClassType,
      liveClassFrequency: course.liveClassFrequency,
      liveClassSchedule: course.liveClassSchedule,
      isPlatformCourse: course.isPlatformCourse,
      requiresSubscription: course.requiresSubscription,
      subscriptionTier: course.subscriptionTier,
      marketingType: course.marketingType,
      marketingDescription: course.marketingDescription,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      institution: course.institution,
      category: course.category,
      tags: course.courseTags.map(ct => ct.tag)
    };

    console.log('Course data being returned:', {
      id: courseData.id,
      title: courseData.title,
      slug: courseData.slug,
      status: courseData.status,
      institutionName: courseData.institution?.name,
      categoryName: courseData.category?.name
    });

    return NextResponse.json(courseData);
  } catch (error) {
    console.error('Error fetching course by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
