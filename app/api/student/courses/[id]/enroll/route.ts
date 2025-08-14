import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { notificationService } from '@/lib/notification';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';

// Ensure this is a dynamic route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Enrollment request received for course:', params.id);
  
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session?.user?.id);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // First check if course exists without status filter
    const courseCheck = await prisma.course.findUnique({
      where: { 
        id: params.id
      },
      select: {
        id: true,
        status: true,
        marketingType: true,
        requiresSubscription: true
      }
    });

    console.log('Initial course check:', courseCheck);

    if (!courseCheck) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (courseCheck.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Course is not available for enrollment' }, { status: 400 });
    }

    // Check if course requires subscription
    const requiresSubscription = courseCheck.requiresSubscription || 
      courseCheck.marketingType === 'LIVE_ONLINE' || 
      courseCheck.marketingType === 'BLENDED';

    let subscriptionStatus = null;
    if (requiresSubscription) {
      console.log('Course requires subscription, checking user subscription status...');
      console.log('User ID:', session.user.id);
      console.log('Course marketing type:', courseCheck.marketingType);
      
      try {
        // First, let's check the subscription directly in the database
        const directSubscription = await prisma.studentSubscription.findUnique({
          where: { studentId: session.user.id },
          include: { studentTier: true }
        });
        
        console.log('Direct subscription check:', {
          found: !!directSubscription,
          status: directSubscription?.status,
          tier: directSubscription?.studentTier?.planType,
          startDate: directSubscription?.startDate,
          endDate: directSubscription?.endDate
        });
        
        const userSubscriptionStatus = await SubscriptionCommissionService.getUserSubscriptionStatus(session.user.id);
        console.log('Service subscription status:', {
          hasActiveSubscription: userSubscriptionStatus.hasActiveSubscription,
          currentPlan: userSubscriptionStatus.currentPlan,
          subscriptionEndDate: userSubscriptionStatus.subscriptionEndDate
        });
        
        if (!userSubscriptionStatus.hasActiveSubscription) {
          console.log('User does not have active subscription for subscription-required course');
          return NextResponse.json({ 
            error: 'Subscription required',
            details: 'This course requires an active subscription to enroll.',
            redirectUrl: `/subscription-signup?courseId=${params.id}&fromEnrollment=true`,
            courseType: courseCheck.marketingType,
            requiresSubscription: true,
            debug: {
              directSubscription: !!directSubscription,
              directStatus: directSubscription?.status,
              serviceHasActive: userSubscriptionStatus.hasActiveSubscription
            }
          }, { status: 402 }); // 402 Payment Required
        }
        console.log('User has active subscription:', userSubscriptionStatus.currentPlan);
        subscriptionStatus = userSubscriptionStatus; // Store for later use
      } catch (subscriptionError) {
        console.error('Error checking subscription status:', subscriptionError);
        return NextResponse.json({ 
          error: 'Subscription verification failed',
          details: 'Unable to verify subscription status. Please try again or contact support.',
          redirectUrl: '/subscription-signup'
        }, { status: 500 });
      }
    }

    // Get course details with enrollment count
    const course = await prisma.course.findUnique({
      where: { 
        id: params.id,
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        status: true,
        institutionId: true,
        maxStudents: true,
        base_price: true,
        startDate: true,
        endDate: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    // Get institution details
    const institution = course ? await prisma.institution.findUnique({
      where: { id: course.institutionId },
      select: { id: true, name: true, email: true }
    }) : null;

    console.log('Full course details:', {
      id: course?.id,
      title: course?.title,
      status: course?.status,
      institution: institution?.name,
      maxStudents: course?.maxStudents,
      base_price: course?.base_price,
      startDate: course?.startDate,
      endDate: course?.endDate
    });

    if (!course?.maxStudents || !course?.base_price) {
      return NextResponse.json({ 
        error: 'Course configuration is incomplete. Please contact the institution.' 
      }, { status: 400 });
    }

    // Get student record and check status
    let student = await prisma.student.findUnique({
      where: { 
        id: session.user.id,
        status: 'active'
      }
    });

    if (!student) {
      // Auto-create student record if missing
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      student = await prisma.student.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          status: 'active',
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          last_active: new Date()
        }
      });
    }

    console.log('Student found:', student?.id);

    if (!student) {
      return NextResponse.json({ error: 'Student record not found or inactive' }, { status: 404 });
    }

    // Check if student is already enrolled
    const existingEnrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        studentId: session.user.id,
        courseId: params.id,
      },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        startDate: true,
        endDate: true,
      },
    });

    console.log('Existing enrollment check:', existingEnrollment);

    if (existingEnrollment) {
      let errorMessage = 'Already enrolled in this course';
      
      if (existingEnrollment.status === 'PENDING_PAYMENT') {
        errorMessage = 'You have a pending enrollment for this course. Please complete the payment to access the content.';
      } else if (existingEnrollment.status === 'ACTIVE') {
        errorMessage = 'You are already enrolled and have access to this course.';
      } else if (existingEnrollment.status === 'COMPLETED') {
        errorMessage = 'You have already completed this course.';
      }

      console.log('Student already enrolled in this course:', existingEnrollment.status);
      return NextResponse.json({ 
        error: errorMessage,
        enrollmentStatus: existingEnrollment.status,
        paymentStatus: existingEnrollment.paymentStatus,
        startDate: existingEnrollment.startDate,
        endDate: existingEnrollment.endDate
      }, { status: 400 });
    }

    // Check if course is full
    const enrolledCount = await prisma.studentCourseEnrollment.count({
      where: {
        courseId: params.id,
        status: 'IN_PROGRESS',
      },
    });

    console.log('Enrollment count:', {
      current: enrolledCount,
      maxStudents: course.maxStudents
    });

    if (enrolledCount >= course.maxStudents) {
      console.log('Course is full');
      return NextResponse.json({ error: 'Course is full' }, { status: 400 });
    }

    try {
      // Determine start date based on enrollment timing
      const currentDate = new Date();
      const startDate = currentDate > new Date(course.startDate) ? currentDate : new Date(course.startDate);
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      console.log('Creating enrollment with:', {
        studentId: session.user.id,
        courseId: params.id,
        startDate,
        endDate: course.endDate,
        price: course.base_price,
        institutionId: course.institutionId
      });

      // Determine if this is a subscription-based enrollment (no additional payment required)
      const isSubscriptionBasedEnrollment = requiresSubscription && subscriptionStatus?.hasActiveSubscription;
      
      console.log('🔍 Enrollment decision:', {
        requiresSubscription,
        subscriptionStatus: subscriptionStatus ? {
          hasActiveSubscription: subscriptionStatus.hasActiveSubscription,
          currentPlan: subscriptionStatus.currentPlan
        } : 'No subscription status',
        isSubscriptionBasedEnrollment
      });

      // Use a transaction to ensure both enrollment and payment are created atomically
      console.log('🔄 Starting enrollment transaction...');
      const result = await prisma.$transaction(async (tx) => {
        // Create enrollment with payment tracking
        const enrollment = await tx.studentCourseEnrollment.create({
          data: {
            studentId: session.user.id,
            courseId: params.id,
            status: isSubscriptionBasedEnrollment ? 'ENROLLED' : 'PENDING_PAYMENT',
            paymentStatus: isSubscriptionBasedEnrollment ? 'PAID' : 'PENDING',
            progress: 0,
            startDate,
            endDate: course.endDate,
            // For subscription-based enrollments, mark payment as completed
            ...(isSubscriptionBasedEnrollment && {
              paymentDate: new Date()
            })
          },
        });

        // Create payment record with appropriate status
        const payment = await tx.payment.create({
          data: {
            amount: course.base_price,
            status: isSubscriptionBasedEnrollment ? 'COMPLETED' : 'PENDING',
            institutionId: course.institutionId,
            enrollmentId: enrollment.id,
            commissionAmount: 0,
            institutionAmount: course.base_price,
            currency: 'USD',
            // For subscription-based payments, mark as paid immediately
            ...(isSubscriptionBasedEnrollment && {
              paidAt: new Date(),
              paymentMethod: 'SUBSCRIPTION',
              paymentId: `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }),
            metadata: {
              type: 'COURSE_ENROLLMENT',
              courseTitle: course.title,
              institutionName: institution.name,
              isSubscriptionBased: isSubscriptionBasedEnrollment,
              subscriptionPlan: subscriptionStatus?.currentPlan
            }
          }
        });

        // Enroll student in associated live classes for this course
        const associatedLiveClasses = await tx.videoSession.findMany({
          where: {
            courseId: course.id,
            status: 'SCHEDULED',
            startTime: { gt: new Date() } // Only future classes
          },
          select: {
            id: true,
            title: true,
            startTime: true
          }
        });
        
        console.log(`Found ${associatedLiveClasses.length} associated live classes`);
        
        // Create video session participants for each live class
        for (const liveClass of associatedLiveClasses) {
          await tx.videoSessionParticipant.upsert({
            where: {
              sessionId_userId: {
                sessionId: liveClass.id,
                userId: session.user.id
              }
            },
            update: {
              role: 'STUDENT',
              isActive: true,
              joinedAt: new Date(),
              updatedAt: new Date()
            },
            create: {
              sessionId: liveClass.id,
              userId: session.user.id,
              role: 'STUDENT',
              isActive: true,
              joinedAt: new Date(),
              updatedAt: new Date()
            }
          });
        }

        console.log('✅ Transaction completed successfully');
        return { enrollment, payment, liveClassesEnrolled: associatedLiveClasses.length };
      });

      // Send enrollment notification
      try {
        console.log('Sending enrollment notification...');
        
        // Calculate course duration
        const duration = Math.ceil((new Date(course.endDate).getTime() - new Date(course.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7)); // weeks
        
        await notificationService.sendNotificationWithTemplate(
          'course_enrollment',
          session.user.id,
          {
            name: student.name,
            courseName: course.title,
            institutionName: institution.name,
            duration: `${duration} weeks`,
            startDate: new Date(course.startDate).toLocaleDateString()
          },
          {
            enrollmentId: result.enrollment.id,
            courseId: course.id,
            institutionId: institution.id,
            paymentAmount: course.base_price
          },
          'SYSTEM'
        );
        
        console.log('✅ Enrollment notification sent successfully');
      } catch (notificationError) {
        console.error('❌ Failed to send enrollment notification:');
        // Don't fail the enrollment if notification fails
      }

      // Create notification preferences for student if they don't exist
      try {
        await prisma.studentNotificationPreferences.upsert({
          where: { student_id: session.user.id },
          update: {},
          create: {
            student_id: session.user.id,
            email_notifications: true,
            push_notifications: true,
            sms_notifications: false,
            course_updates: true,
            course_reminders: true,
            course_announcements: true,
            course_schedule: true,
            assignment_reminders: true,
            assignment_deadlines: true,
            assignment_feedback: true,
            assignment_grades: true,
            payment_reminders: true,
            payment_confirmation: true,
            payment_receipts: true,
            payment_failed: true,
            progress_updates: true,
            achievement_alerts: true,
            milestone_reached: true,
            instructor_messages: true,
            group_messages: true,
            system_announcements: true,
            notification_frequency: 'DAILY'
          }
        });
        console.log('✅ Notification preferences created/updated');
      } catch (prefError) {
        console.error('❌ Failed to create notification preferences:');
        // Don't fail the enrollment if preferences creation fails
      }

      // Revalidate relevant pages
      revalidatePath('/student/courses');
      revalidatePath('/institution/courses');

      // Return appropriate message based on enrollment type
      const message = isSubscriptionBasedEnrollment 
        ? 'Course enrollment successful! You have immediate access to the course content.'
        : 'Course enrollment successful. Payment required for content access.';

      return NextResponse.json({ 
        message,
        enrollment: {
          id: result.enrollment.id,
          status: result.enrollment.status,
          paymentStatus: result.enrollment.paymentStatus,
          startDate: result.enrollment.startDate,
          endDate: result.enrollment.endDate,
          isSubscriptionBased: isSubscriptionBasedEnrollment
        },
        payment: {
          id: result.payment.id,
          status: result.payment.status,
          amount: result.payment.amount
        },
        liveClassesEnrolled: result.liveClassesEnrolled
      });
    } catch (createError) {
      console.error('❌ Error in enrollment transaction:', createError);
      return NextResponse.json(
        { error: 'Failed to create enrollment. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in enrollment route:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 