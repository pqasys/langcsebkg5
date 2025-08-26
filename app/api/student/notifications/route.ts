import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Enhanced validation schema for notification preferences
const notificationPreferencesSchema = z.object({
  // General notification channels
  email_notifications: z.boolean().optional(),
  push_notifications: z.boolean().optional(),
  sms_notifications: z.boolean().optional(),
  
  // Course-related notifications
  course_updates: z.boolean().optional(),
  course_reminders: z.boolean().optional(),
  course_announcements: z.boolean().optional(),
  course_schedule: z.boolean().optional(),
  
  // Assignment-related notifications
  assignment_reminders: z.boolean().optional(),
  assignment_deadlines: z.boolean().optional(),
  assignment_feedback: z.boolean().optional(),
  assignment_grades: z.boolean().optional(),
  
  // Payment-related notifications
  payment_reminders: z.boolean().optional(),
  payment_confirmation: z.boolean().optional(),
  payment_receipts: z.boolean().optional(),
  payment_failed: z.boolean().optional(),
  
  // Progress-related notifications
  progress_updates: z.boolean().optional(),
  achievement_alerts: z.boolean().optional(),
  milestone_reached: z.boolean().optional(),
  
  // Communication preferences
  instructor_messages: z.boolean().optional(),
  group_messages: z.boolean().optional(),
  system_announcements: z.boolean().optional(),
  
  // Frequency preferences
  notification_frequency: z.enum(['DAILY', 'WEEKLY', 'INSTANT']).optional(),
}).refine((data) => {
  // Ensure at least one notification channel is enabled
  return data.email_notifications || data.push_notifications || data.sms_notifications;
}, {
  message: "At least one notification channel must be enabled",
  path: ["email_notifications"]
}).refine((data) => {
  // If SMS notifications are enabled, ensure email notifications are also enabled
  if (data.sms_notifications) {
    return data.email_notifications === true;
  }
  return true;
}, {
  message: "Email notifications must be enabled when SMS notifications are enabled",
  path: ["sms_notifications"]
});

// Error handling middleware
const handleError = (error: unknown) => {
  console.error('API Error:');

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation Error',
        details: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
  );
};

// GET /api/student/notifications
export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // First check if the student exists
    const student = await prisma.student.findUnique({
      where: { id: session.user.id },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Then get their notification preferences
    const preferences = await prisma.studentNotificationPreferences.findUnique({
      where: {
        student_id: session.user.id,
      },
    });

    if (!preferences) {
      // If no preferences exist, create default preferences
      const defaultPreferences = await prisma.studentNotificationPreferences.create({
        data: {
          student_id: session.user.id,
          // All other fields will use their default values from the schema
        },
      });
      return NextResponse.json(defaultPreferences);
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error occurred:', error);
    return handleError(error);
  }
}

// POST /api/student/notifications
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = notificationPreferencesSchema.parse(body);

    // Check if preferences already exist
    const existingPreferences = await prisma.studentNotificationPreferences.findUnique({
      where: {
        student_id: session.user.id,
      },
    });

    if (existingPreferences) {
      return NextResponse.json(
        { error: 'Preferences already exist. Use PATCH to update.' },
        { status: 400 }
      );
    }

    const preferences = await prisma.studentNotificationPreferences.create({
      data: {
        student_id: session.user.id,
        ...validatedData,
      },
    });

    return NextResponse.json(preferences, { status: 201 });
  } catch (error) {
    console.error('Error occurred:', error);
    return handleError(error);
  }
}

// PATCH /api/student/notifications
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = notificationPreferencesSchema.parse(body);

    // Additional validation for PATCH requests
    if (Object.keys(validatedData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const preferences = await prisma.studentNotificationPreferences.upsert({
      where: {
        student_id: session.user.id,
      },
      update: validatedData,
      create: {
        student_id: session.user.id,
        ...validatedData,
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error occurred:', error);
    return handleError(error);
  }
} 