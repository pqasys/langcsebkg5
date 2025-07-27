const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkEnrollments() {
  try {
    console.log('Checking database enrollments...\n');

    // Check all students
    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true
      }
    });
    console.log('Students found:', students.length);
    students.forEach(student => {
      console.log(`- ${student.name} (${student.email}) - ID: ${student.id}`);
    });

    // Check all enrollments
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      select: {
        id: true,
        studentId: true,
        courseId: true,
        status: true,
        progress: true
      }
    });
    console.log('\nEnrollments found:', enrollments.length);
    enrollments.forEach(enrollment => {
      console.log(`- Enrollment ID: ${enrollment.id} - Student ID: ${enrollment.studentId} - Course ID: ${enrollment.courseId} - Status: ${enrollment.status} - Progress: ${enrollment.progress || 0}%`);
    });

    // Check all courses
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        institution: {
          select: {
            name: true
          }
        },
        status: true
      }
    });
    console.log('\nCourses found:', courses.length);
    courses.forEach(course => {
      console.log(`- "${course.title}" (${course.institution.name}) - Status: ${course.status}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnrollments(); 