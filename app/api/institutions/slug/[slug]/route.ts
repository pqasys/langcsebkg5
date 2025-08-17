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

    // Find institution by slug
    const institution = await prisma.institution.findUnique({
      where: {
        slug: params.slug
      },
      include: {
        courses: {
          where: {
            status: {
              in: ['ACTIVE', 'PUBLISHED']
            }
          },
          select: {
            id: true,
            title: true,
            description: true,
            base_price: true,
            duration: true,
            level: true,
            status: true
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

    // Check if institution is approved and active for public access
    if (!institution.isApproved || institution.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }

    // Determine course visibility based on user session
    let visibleCourses = institution.courses;
    
    if (!session) {
      // Public access - only show published courses
      visibleCourses = institution.courses.filter(course => course.status === 'PUBLISHED');
    } else if (session.user.role === 'ADMIN') {
      // Admin can see all courses
      visibleCourses = institution.courses;
    } else if (session.user.role === 'INSTITUTION_STAFF' && session.user.institutionId === institution.id) {
      // Institution staff can see all their courses
      visibleCourses = institution.courses;
    } else {
      // Other authenticated users see published courses
      visibleCourses = institution.courses.filter(course => course.status === 'PUBLISHED');
    }

    const institutionData = {
      id: institution.id,
      name: institution.name,
      slug: institution.slug,
      description: institution.description,
      address: institution.address,
      city: institution.city,
      state: institution.state,
      country: institution.country,
      postcode: institution.postcode,
      email: institution.email,
      website: institution.website,
      telephone: institution.telephone,
      contactName: institution.contactName,
      contactJobTitle: institution.contactJobTitle,
      contactPhone: institution.contactPhone,
      contactEmail: institution.contactEmail,
      logoUrl: institution.logoUrl,
      mainImageUrl: institution.mainImageUrl,
      facilities: institution.facilities,
      status: institution.status,
      isApproved: institution.isApproved,
      isFeatured: institution.isFeatured,
      subscriptionPlan: institution.subscriptionPlan,
      courses: visibleCourses,
      coursesCount: visibleCourses.length
    };

    console.log('Institution data being returned:', {
      id: institutionData.id,
      name: institutionData.name,
      slug: institutionData.slug,
      isApproved: institutionData.isApproved,
      status: institutionData.status,
      coursesCount: institutionData.coursesCount
    });

    return NextResponse.json(institutionData);
  } catch (error) {
    console.error('Error fetching institution by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
