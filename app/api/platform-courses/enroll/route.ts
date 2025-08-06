import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PlatformCourseGovernanceService } from '@/lib/platform-course-governance-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, enrollmentType = 'SUBSCRIPTION' } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const result = await PlatformCourseGovernanceService.enrollInPlatformCourse({
      userId: session.user.id,
      courseId,
      enrollmentType
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      enrollmentId: result.enrollmentId,
      message: 'Successfully enrolled in platform course'
    });

  } catch (error) {
    console.error('Error enrolling in platform course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (courseId) {
      // Check access for specific course
      const accessInfo = await PlatformCourseGovernanceService.checkPlatformCourseAccess(
        session.user.id,
        courseId
      );

      return NextResponse.json({
        success: true,
        accessInfo
      });
    } else {
      // Get all platform course enrollments
      const enrollments = await PlatformCourseGovernanceService.getUserPlatformCourseEnrollments(
        session.user.id
      );

      return NextResponse.json({
        success: true,
        enrollments
      });
    }

  } catch (error) {
    console.error('Error getting platform course access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 