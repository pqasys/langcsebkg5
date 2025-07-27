import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.institutionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the student and verify they are enrolled in a course from this institution
    const student = await prisma.student.findFirst({
      where: {
        id: params.id,
        enrollments: {
          some: {
            course: {
              institutionId: session.user.institutionId,
            },
          },
        },
      },
      include: {
        enrollments: {
          where: {
            course: {
              institutionId: session.user.institutionId,
            },
          },
          include: {
            course: {
              select: {
                id: true,
                title: true,
                startDate: true,
                endDate: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get course completions for this student
    const completions = await prisma.studentCourseCompletion.findMany({
      where: {
        studentId: params.id,
        course: {
          institutionId: session.user.institutionId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Format the response with all available student information
    const studentDetails = {
      ...student,
      joinDate: student.created_at ? new Date(student.created_at).toISOString() : null,
      lastActive: student.last_active ? new Date(student.last_active).toISOString() : null,
      enrolledCourses: student.enrollments.map(enrollment => ({
        id: enrollment.id,
        name: enrollment.course.title,
        start_date: enrollment.startDate ? new Date(enrollment.startDate).toISOString() : null,
        end_date: enrollment.endDate ? new Date(enrollment.endDate).toISOString() : null,
        status: enrollment.status.toLowerCase(),
        progress: enrollment.progress || 0,
      })),
      completedCourses: completions.map(completion => ({
        id: completion.id,
        name: completion.course.title,
        completionDate: completion.createdAt ? new Date(completion.createdAt).toISOString() : null,
        status: completion.status,
      })),
      // Include all additional student information
      bio: student.bio,
      native_language: student.native_language,
      spoken_languages: student.spoken_languages,
      learning_goals: student.learning_goals,
      interests: student.interests,
      social_visibility: student.social_visibility,
      timezone: student.timezone,
      date_of_birth: student.date_of_birth ? new Date(student.date_of_birth).toISOString() : null,
      gender: student.gender,
      location: student.location,
      website: student.website,
      social_links: student.social_links,
    };

    return NextResponse.json(studentDetails);
  } catch (error) {
    console.error('Error fetching student details:');
    return NextResponse.json(
      { error: 'Failed to fetch student details' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
} 