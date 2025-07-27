import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get student by email
    const student = await prisma.student.findUnique({
      where: { email: session.user.email }
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    // Get enrollments separately
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: { studentId: student.id }
    });

    // Get courses and modules separately
    const enrollmentsWithData = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await prisma.course.findUnique({
          where: { id: enrollment.courseId }
        });

        if (!course) return null;

        const modules = await prisma.modules.findMany({
          where: { course_id: course.id },
          orderBy: { order_index: 'asc' }
        });

        return {
          ...enrollment,
          course: {
            ...course,
            modules
          }
        };
      })
    );

    // Filter out null enrollments
    const validEnrollments = enrollmentsWithData.filter(enrollment => enrollment !== null);

    // Get module counts separately
    const moduleCounts = await Promise.all(
      validEnrollments.map(enrollment => 
        enrollment.course.modules.map(async (module) => {
          const [contentCount, exerciseCount, quizCount] = await Promise.all([
            prisma.content_items.count({ where: { module_id: module.id } }),
            prisma.exercises.count({ where: { module_id: module.id } }),
            prisma.quizzes.count({ where: { module_id: module.id } })
          ]);

          return {
            moduleId: module.id,
            _count: {
              content_items: contentCount,
              exercises: exerciseCount,
              quizzes: quizCount
            }
          };
        })
      )
    );

    // Add counts to modules
    const studentWithCounts = {
      ...student,
      enrollments: validEnrollments.map(enrollment => ({
        ...enrollment,
        course: {
          ...enrollment.course,
          modules: enrollment.course.modules.map(module => {
            const countData = moduleCounts.find(count => count.moduleId === module.id);
            return {
              ...module,
              _count: countData?._count || { content_items: 0, exercises: 0, quizzes: 0 }
            };
          })
        }
      }))
    };

    // Get module progress for all enrolled courses
    const moduleProgress = await prisma.moduleProgress.findMany({
      where: {
        studentId: student.id
      }
    });

    // Fetch module and course data separately for progress
    const moduleProgressWithData = await Promise.all(
      moduleProgress.map(async (progress) => {
        const module = await prisma.modules.findUnique({
          where: { id: progress.moduleId }
        });

        if (!module) return null;

        const course = await prisma.course.findUnique({
          where: { id: module.course_id }
        });

        return {
          ...progress,
          module: {
            ...module,
            course
          }
        };
      })
    );

    // Filter out null progress entries
    const validModuleProgress = moduleProgressWithData.filter(progress => progress !== null);

    // Calculate course progress
    const courseProgressMap = new Map();

    // Initialize course data
    studentWithCounts.enrollments.forEach(enrollment => {
      if (enrollment.status === 'ACTIVE') {
        courseProgressMap.set(enrollment.course.id, {
          id: enrollment.course.id,
          title: enrollment.course.title,
          progress: 0,
          totalModules: enrollment.course.modules.length,
          completedModules: 0,
          timeSpent: 0,
          lastAccessed: enrollment.startDate.toISOString(),
          enrollmentDate: enrollment.startDate.toISOString()
        });
      }
    });

    // Calculate progress for each course
    validModuleProgress.forEach(progress => {
      const courseId = progress.module.course.id;
      const courseData = courseProgressMap.get(courseId);
      
      if (courseData) {
        // Count completed modules
        if (progress.contentCompleted && progress.exercisesCompleted && progress.quizCompleted) {
          courseData.completedModules++;
        }
        
        // Add time spent
        courseData.timeSpent += progress.timeSpent;
        
        // Update last accessed date
        if (progress.lastAccessedAt && new Date(progress.lastAccessedAt) > new Date(courseData.lastAccessed)) {
          courseData.lastAccessed = progress.lastAccessedAt.toISOString();
        }
      }
    });

    // Calculate progress percentages
    courseProgressMap.forEach(courseData => {
      courseData.progress = courseData.totalModules > 0 
        ? Math.round((courseData.completedModules / courseData.totalModules) * 100)
        : 0;
    });

    const courses = Array.from(courseProgressMap.values());

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching course progress:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 