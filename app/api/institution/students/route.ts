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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'INSTITUTION') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get the institution ID for the current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { institutionId: true }
    });

    if (!user?.institutionId) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }

    // Get course IDs for this institution first
    const courses = await prisma.course.findMany({
      where: { institutionId: user.institutionId },
      select: { id: true }
    });

    const courseIds = courses.map(c => c.id);

    // Get enrollments for these courses
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        courseId: {
          in: courseIds
        }
      },
      select: {
        studentId: true,
        status: true
      }
    });

    // Get unique student IDs
    const studentIds = [...new Set(enrollments.map(e => e.studentId))];

    // Fetch all students for this institution
    const students = await prisma.student.findMany({
      where: {
        id: {
          in: studentIds
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        last_active: true,
        created_at: true
      }
    });

    // Get additional enrollment and completion data for each student
    const studentsWithDetails = await Promise.all(
      students.map(async (student) => {
        const [studentEnrollments, studentCompletions] = await Promise.all([
          prisma.studentCourseEnrollment.findMany({
            where: {
              studentId: student.id,
              courseId: {
                in: courseIds
              },
              status: {
                in: ['IN_PROGRESS', 'ENROLLED', 'ACTIVE']
              }
            }
          }),
          prisma.studentCourseCompletion.findMany({
            where: {
              studentId: student.id,
              courseId: {
                in: courseIds
              }
            }
          })
        ]);

        return {
          ...student,
          enrollments: studentEnrollments,
          completions: studentCompletions
        };
      })
    );

    // Calculate statistics
    const stats = {
      totalStudents: students.length,
      activeStudents: studentsWithDetails.filter(student => student.enrollments && student.enrollments.length > 0).length,
      inactiveStudents: studentsWithDetails.filter(student => !student.enrollments || student.enrollments.length === 0).length,
      averageEnrollment: studentsWithDetails.reduce((acc, student) => 
        acc + (student.enrollments?.length || 0), 0) / (students.length || 1)
    };

    // Format the response
    const formattedStudents = studentsWithDetails.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      status: student.status?.toLowerCase() || 'active',
      enrolledCourses: student.enrollments?.length || 0,
      completedCourses: student.completions?.length || 0,
      lastActive: student.last_active,
      joinDate: student.created_at
    }));

    return NextResponse.json({
      students: formattedStudents,
      stats
    });
  } catch (error) {
    console.error('Error fetching students:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 