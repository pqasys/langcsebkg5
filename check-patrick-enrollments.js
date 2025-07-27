const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.findUnique({
    where: { email: 'patrickmorgan001@gmail.com' },
    select: { id: true, name: true, email: true }
  });
  if (!student) {
    console.log('No student found for patrickmorgan001@gmail.com');
    return;
  }
  console.log(`Student: ${student.name} (${student.email}) - ID: ${student.id}`);

  const enrollments = await prisma.studentCourseEnrollment.findMany({
    where: { studentId: student.id },
    include: {
      course: { select: { title: true, status: true } }
    }
  });
  if (enrollments.length === 0) {
    console.log('No enrollments found for this student.');
    return;
  }
  console.log(`\nEnrollments:`);
  enrollments.forEach(e => {
    console.log(`- Course: ${e.course?.title || 'Unknown'} | Enrollment Status: ${e.status} | Course Status: ${e.course?.status}`);
  });
}

main().finally(() => prisma.$disconnect()); 