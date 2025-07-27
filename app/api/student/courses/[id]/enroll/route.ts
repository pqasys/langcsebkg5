import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { notificationService } from '@/lib/notification';

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
        status: true
      }
    });

    console.log('Initial course check:', courseCheck);

    if (!courseCheck) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (courseCheck.status !== 'published') {
      return NextResponse.json({ error: 'Course is not available for enrollment' }, { status: 400 });
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

      // Use a transaction to ensure both enrollment and payment are created atomically
      const result = await prisma.$transaction(async (tx) => {
        // Create enrollment with payment tracking
        const enrollment = await tx.studentCourseEnrollment.create({
          data: {
            studentId: session.user.id,
            courseId: params.id,
            status: 'PENDING_PAYMENT',
            startDate,
            endDate: new Date(course.endDate),
            paymentStatus: 'PENDING',
            progress: 0,
          }
        });

        console.log('Enrollment created:', enrollment.id);

        // Create payment record
        const calculatedPrice = course.base_price;
        const idempotencyKey = `course-enrollment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const payment = await tx.payment.create({
          data: {
            amount: calculatedPrice,
            status: 'PENDING',
            institutionId: course.institutionId,
            enrollmentId: enrollment.id,
            commissionAmount: 0,
            institutionAmount: calculatedPrice,
            currency: 'usd',
            idempotencyKey,
            metadata: {
              type: 'COURSE_ENROLLMENT',
              courseTitle: course.title,
              institutionName: institution.name
            }
          }
        });

        console.log('Payment record created:', payment.id);

        return { enrollment, payment };
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
            paymentAmount: calculatedPrice
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

      return NextResponse.json({ 
        message: 'Course enrollment successful. Payment required for content access.',
        enrollment: {
          id: result.enrollment.id,
          status: result.enrollment.status,
          paymentStatus: result.enrollment.paymentStatus,
          startDate: result.enrollment.startDate,
          endDate: result.enrollment.endDate,
          paymentDetails: {
            amount: calculatedPrice,
            invoiceNumber,
            institutionName: institution.name,
            courseTitle: course.title,
            contentAccess: 'Restricted until payment is completed'
          }
        }
      });
    } catch (createError) {
      console.error('Error in enrollment transaction:');
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