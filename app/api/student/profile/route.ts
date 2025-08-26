import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get student basic info
    const student = await prisma.student.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        bio: true,
        status: true,
        created_at: true,
        updated_at: true,
        last_active: true,
        native_language: true,
        spoken_languages: true,
        learning_goals: true,
        interests: true,
        social_visibility: true,
        timezone: true,
        date_of_birth: true,
        gender: true,
        location: true,
        website: true,
        social_links: true,
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get student notification preferences separately
    let preferences = null;
    try {
      preferences = await prisma.studentNotificationPreferences.findUnique({
        where: {
          student_id: session.user.id
        },
        select: {
          email_notifications: true,
          push_notifications: true,
          sms_notifications: true,
          course_updates: true,
          assignment_reminders: true,
          payment_reminders: true,
        }
      });
    } catch (error) {
    console.error('Error occurred:', error);
      // // // // // // // // // console.log('Student notification preferences not found, using defaults');
    }

    // Get student enrollments separately
    let enrollments = [];
    try {
      enrollments = await prisma.studentCourseEnrollment.findMany({
        where: {
          studentId: session.user.id
        },
        include: {
          course: {
            select: {
              title: true,
              institution: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
    console.error('Error occurred:', error);
      console.log('Student enrollments not found');
    }

    // Format preferences
    const formattedPreferences = preferences ? {
      emailNotifications: preferences.email_notifications,
      pushNotifications: preferences.push_notifications,
      smsNotifications: preferences.sms_notifications,
      courseUpdates: preferences.course_updates,
      assignmentReminders: preferences.assignment_reminders,
      paymentReminders: preferences.payment_reminders,
    } : {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      courseUpdates: true,
      assignmentReminders: true,
      paymentReminders: true,
    };

    // Get user image from user table
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    });

    const profile = {
      ...student,
      profilePicture: user?.image,
      preferences: formattedPreferences,
      enrollments,
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching student profile:');
    return NextResponse.json(
      { error: 'Failed to fetch student profile' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();
    const { 
      name, 
      email, 
      phone, 
      address, 
      bio, 
      preferences,
      native_language,
      spoken_languages,
      learning_goals,
      interests,
      social_visibility,
      timezone,
      date_of_birth,
      gender,
      location,
      website,
      social_links
    } = data;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: session.user.id }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already taken' },
        { status: 400 }
      );
    }

    // Update both user and student records in a transaction
    const [updatedUser, updatedStudent] = await prisma.$transaction([
      // Update user record
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          name,
          email,
          updatedAt: new Date()
        }
      }),
      // Update student record
      prisma.student.update({
        where: { id: session.user.id },
        data: {
          name,
          email,
          phone,
          address,
          bio,
          native_language,
          spoken_languages,
          learning_goals,
          interests,
          social_visibility,
          timezone,
          date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
          gender,
          location,
          website,
          social_links,
          updated_at: new Date(),
          last_active: new Date(),
        }
      })
    ]);

    // Update or create notification preferences
    if (preferences) {
      await prisma.studentNotificationPreferences.upsert({
        where: {
          student_id: session.user.id
        },
        create: {
          student_id: session.user.id,
          email_notifications: preferences.emailNotifications ?? true,
          push_notifications: preferences.pushNotifications ?? true,
          sms_notifications: preferences.smsNotifications ?? false,
          course_updates: preferences.courseUpdates ?? true,
          assignment_reminders: preferences.assignmentReminders ?? true,
          payment_reminders: preferences.paymentReminders ?? true,
        },
        update: {
          email_notifications: preferences.emailNotifications,
          push_notifications: preferences.pushNotifications,
          sms_notifications: preferences.smsNotifications,
          course_updates: preferences.courseUpdates,
          assignment_reminders: preferences.assignmentReminders,
          payment_reminders: preferences.paymentReminders,
        }
      });
    }

    console.log('Profile updated successfully');
    return NextResponse.json({ 
      message: 'Profile updated successfully',
      student: updatedStudent 
    });
  } catch (error) {
    console.error('Error updating student profile:');
    return NextResponse.json(
      { error: 'Failed to update student profile' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 