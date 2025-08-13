import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('🔍 Checking enrollment eligibility for course:', params.id);
  
  try {
    const session = await getServerSession(authOptions);
    console.log('👤 Session user:', session?.user?.id, 'Role:', session?.user?.role);

    if (!session?.user) {
      console.log('❌ No session found');
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: 'Please sign in to check enrollment eligibility'
      }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      console.log('❌ User is not a student:', session.user.role);
      return NextResponse.json({ 
        error: 'Forbidden',
        details: 'Only students can enroll in courses'
      }, { status: 403 });
    }

    // Get course details
    console.log('📚 Fetching course details...');
    const course = await prisma.course.findUnique({
      where: { 
        id: params.id
      },
      select: {
        id: true,
        title: true,
        status: true,
        marketingType: true,
        requiresSubscription: true,
        subscriptionTier: true,
        maxStudents: true,
        base_price: true,
        startDate: true,
        endDate: true
      }
    });

    console.log('📋 Course details:', {
      ...course,
      subscriptionTier: course.subscriptionTier || 'None specified'
    });

    if (!course) {
      console.log('❌ Course not found');
      return NextResponse.json({ 
        error: 'Course not found',
        details: 'The course you are trying to enroll in does not exist'
      }, { status: 404 });
    }

    console.log('📊 Course status check:', course.status);
    if (course.status !== 'PUBLISHED') {
      console.log('❌ Course not published, status:', course.status);
      return NextResponse.json({ 
        error: 'Course not available',
        details: 'This course is not available for enrollment'
      }, { status: 400 });
    }

    // Check if course requires subscription
    const requiresSubscription = course.requiresSubscription || 
      course.marketingType === 'LIVE_ONLINE' || 
      course.marketingType === 'BLENDED';

    console.log('🔐 Subscription check:', {
      requiresSubscription,
      courseRequiresSubscription: course.requiresSubscription,
      marketingType: course.marketingType
    });

    if (requiresSubscription) {
      console.log('🔑 Course requires subscription, checking user subscription status...');
      
      try {
        // Get user's subscription status
        const subscriptionStatus = await SubscriptionCommissionService.getUserSubscriptionStatus(session.user.id);
        console.log('💳 Subscription status:', subscriptionStatus);
        
        // Debug: Check raw subscription data
        const rawSubscription = await prisma.studentSubscription.findUnique({
          where: { studentId: session.user.id }
        });
        console.log('🔍 Raw subscription data:', rawSubscription);
        
        if (!subscriptionStatus.hasActiveSubscription) {
          console.log('❌ User does not have active subscription for subscription-required course');
          return NextResponse.json({ 
            error: 'Subscription required',
            details: 'This course requires an active subscription to enroll.',
            redirectUrl: '/subscription-signup',
            courseType: course.marketingType,
            requiresSubscription: true,
            courseTitle: course.title
          }, { status: 402 }); // 402 Payment Required
        }

        // Check if user's subscription tier meets the course requirement
        if (course.subscriptionTier && subscriptionStatus.currentPlan) {
          const tierHierarchy = {
            'BASIC': 1,
            'PREMIUM': 2,
            'PRO': 3
          };
          
          const userTierLevel = tierHierarchy[subscriptionStatus.currentPlan as keyof typeof tierHierarchy] || 0;
          const requiredTierLevel = tierHierarchy[course.subscriptionTier as keyof typeof tierHierarchy] || 0;
          
          console.log('🔍 Tier check:', {
            userTier: subscriptionStatus.currentPlan,
            userTierLevel,
            requiredTier: course.subscriptionTier,
            requiredTierLevel,
            hasAccess: userTierLevel >= requiredTierLevel
          });
          
          if (userTierLevel < requiredTierLevel) {
            console.log('❌ User subscription tier does not meet course requirement');
            return NextResponse.json({ 
              error: 'Subscription tier required',
              details: `This course requires a ${course.subscriptionTier} subscription or higher. Your current plan is ${subscriptionStatus.currentPlan}.`,
              redirectUrl: '/subscription-signup',
              courseType: course.marketingType,
              requiresSubscription: true,
              courseTitle: course.title,
              requiredTier: course.subscriptionTier,
              currentTier: subscriptionStatus.currentPlan
            }, { status: 402 }); // 402 Payment Required
          }
        }

        console.log('✅ User has active subscription:', subscriptionStatus.currentPlan);
      } catch (subscriptionError) {
        console.error('❌ Error checking subscription status:', subscriptionError);
        return NextResponse.json({ 
          error: 'Subscription verification failed',
          details: 'Unable to verify subscription status. Please try again or contact support.',
          redirectUrl: '/subscription-signup'
        }, { status: 500 });
      }
    }

    // Check if student is already enrolled
    console.log('🎓 Checking existing enrollment...');
    const existingEnrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        studentId: session.user.id,
        courseId: params.id,
      },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
      },
    });

    console.log('📝 Existing enrollment:', existingEnrollment);

    if (existingEnrollment) {
      let errorMessage = 'Already enrolled in this course';
      
      if (existingEnrollment.status === 'PENDING_PAYMENT') {
        errorMessage = 'You have a pending enrollment for this course. Please complete the payment to access the content.';
      } else if (existingEnrollment.status === 'ACTIVE' || existingEnrollment.status === 'ENROLLED') {
        errorMessage = 'You are already enrolled and have access to this course.';
      } else if (existingEnrollment.status === 'COMPLETED') {
        errorMessage = 'You have already completed this course.';
      } else if (existingEnrollment.status === 'IN_PROGRESS') {
        errorMessage = 'You are currently enrolled and making progress in this course.';
      }

      console.log('❌ User already enrolled, status:', existingEnrollment.status);
      return NextResponse.json({ 
        error: 'Already enrolled',
        details: errorMessage,
        enrollmentStatus: existingEnrollment.status,
        paymentStatus: existingEnrollment.paymentStatus
      }, { status: 400 });
    }

    // Check if course is full
    console.log('👥 Checking course capacity...');
    const enrolledCount = await prisma.studentCourseEnrollment.count({
      where: {
        courseId: params.id,
        status: {
          in: ['PENDING_PAYMENT', 'ACTIVE', 'IN_PROGRESS', 'ENROLLED']
        },
      },
    });

    console.log('📊 Enrollment count:', enrolledCount, 'Max students:', course.maxStudents);

    if (enrolledCount >= course.maxStudents) {
      console.log('❌ Course is full');
      return NextResponse.json({ 
        error: 'Course full',
        details: 'This course has reached its maximum enrollment capacity'
      }, { status: 400 });
    }

    console.log('✅ All checks passed - user is eligible to enroll');
    // All checks passed - user is eligible to enroll
    return NextResponse.json({
      eligible: true,
      course: {
        id: course.id,
        title: course.title,
        marketingType: course.marketingType,
        requiresSubscription: requiresSubscription,
        maxStudents: course.maxStudents,
        base_price: course.base_price,
        startDate: course.startDate,
        endDate: course.endDate
      },
      message: 'You are eligible to enroll in this course'
    });

  } catch (error) {
    console.error('❌ Error checking enrollment eligibility:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: 'Failed to check enrollment eligibility. Please try again.'
      },
      { status: 500 }
    );
  }
}
