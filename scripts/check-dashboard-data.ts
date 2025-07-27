import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

async function checkDashboardData() {
  try {
    console.log('🔍 Checking Dashboard Data...\n');

    // Check for pending payments
    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING', 'INITIATED'] }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    console.log(` Pending Payments: ${pendingPayments.length}`);
    
    // Get enrollment data for payments
    const enrollmentIds = [...new Set(pendingPayments.map(p => p.enrollmentId))];
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        id: { in: enrollmentIds }
      },
      include: {
        course: {
          include: {
            institution: true
          }
        }
      }
    });

    // Get studentIds for enrollments
    const studentIds = [...new Set(enrollments.map(e => e.studentId))];
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } }
    });
    const studentMap = students.reduce((acc, student) => {
      acc[student.id] = student;
      return acc;
    }, {} as Record<string, typeof students[0]>);

    // Get user data for the studentIds
    const users = await prisma.user.findMany({
      where: { id: { in: studentIds } }
    });
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as Record<string, typeof users[0]>);

    const enrollmentMap = enrollments.reduce((acc, enrollment) => {
      acc[enrollment.id] = enrollment;
      return acc;
    }, {} as Record<string, typeof enrollments[0]>);

    pendingPayments.forEach(payment => {
      const enrollment = enrollmentMap[payment.enrollmentId];
      const student = enrollment ? studentMap[enrollment.studentId] : undefined;
      const user = enrollment ? userMap[enrollment.studentId] : undefined;
      console.log(`  - Payment ID: ${payment.id}`);
      console.log(`    Amount: $${payment.amount}`);
      console.log(`    Status: ${payment.status}`);
      console.log(`    Course: ${enrollment?.course?.title || 'Unknown'}`);
      console.log(`    Student ID: ${enrollment?.studentId || 'Unknown'}`);
      console.log(`    Student Record: ${student ? 'EXISTS' : 'MISSING'}`);
      console.log(`    User Record: ${user ? 'EXISTS' : 'MISSING'}`);
      console.log(`    Student Name: ${student?.name || user?.name || 'Unknown'}`);
      console.log(`    Institution: ${enrollment?.course?.institution?.name || 'Unknown'}`);
      console.log(`    Created: ${payment.createdAt.toISOString()}`);
      console.log('');
    });

    // Check for recent enrollments
    const recentEnrollments = await prisma.studentCourseEnrollment.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      include: {
        course: {
          include: {
            institution: true
          }
        }
      }
    });
    const recentStudentIds = [...new Set(recentEnrollments.map(e => e.studentId))];
    const recentStudents = await prisma.student.findMany({
      where: { id: { in: recentStudentIds } }
    });
    const recentStudentMap = recentStudents.reduce((acc, student) => {
      acc[student.id] = student;
      return acc;
    }, {} as Record<string, typeof recentStudents[0]>);

    const recentUsers = await prisma.user.findMany({
      where: { id: { in: recentStudentIds } }
    });
    const recentUserMap = recentUsers.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as Record<string, typeof recentUsers[0]>);

    console.log(`� Recent Enrollments: ${recentEnrollments.length}`);
    recentEnrollments.forEach(enrollment => {
      const student = recentStudentMap[enrollment.studentId];
      const user = recentUserMap[enrollment.studentId];
      console.log(`  - Enrollment ID: ${enrollment.id}`);
      console.log(`    Course: ${enrollment.course?.title || 'Unknown'}`);
      console.log(`    Student ID: ${enrollment.studentId}`);
      console.log(`    Student Record: ${student ? 'EXISTS' : 'MISSING'}`);
      console.log(`    User Record: ${user ? 'EXISTS' : 'MISSING'}`);
      console.log(`    Student Name: ${student?.name || user?.name || 'Unknown'} (${student?.email || user?.email || 'No email'})`);
      console.log(`    Status: ${enrollment.status}`);
      console.log(`    Payment Status: ${enrollment.paymentStatus}`);
      console.log(`    Institution: ${enrollment.course?.institution?.name || 'Unknown'}`);
      console.log(`    Created: ${enrollment.createdAt.toISOString()}`);
      console.log('');
    });

    // Check for recent students
    const recentStudentsList = await prisma.student.findMany({
      orderBy: {
        created_at: 'desc'
      },
      take: 10
    });

    console.log(`� Recent Students: ${recentStudentsList.length}`);
    recentStudentsList.forEach(student => {
      console.log(`  - Student ID: ${student.id}`);
      console.log(`    Name: ${student.name}`);
      console.log(`    Email: ${student.email}`);
      console.log(`    Status: ${student.status}`);
      console.log(`    Created: ${student.created_at.toISOString()}`);
      console.log('');
    });

    // Check for users with STUDENT role
    const studentUsers = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    console.log(`� Student Users: ${studentUsers.length}`);
    studentUsers.forEach(user => {
      console.log(`  - User ID: ${user.id}`);
      console.log(`    Name: ${user.name}`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Role: ${user.role}`);
      console.log(`    Status: ${user.status}`);
      console.log(`    Created: ${user.createdAt.toISOString()}`);
      console.log('');
    });

    // Check for institutions
    const institutions = await prisma.institution.findMany({
      take: 5
    });

    console.log(`� Institutions: ${institutions.length}`);
    institutions.forEach(institution => {
      console.log(`  - Institution ID: ${institution.id}`);
      console.log(`    Name: ${institution.name}`);
      console.log(`    Commission Rate: ${institution.commissionRate}%`);
      console.log('');
    });

    // Check for courses
    const courses = await prisma.course.findMany({
      take: 5,
      include: {
        institution: true
      }
    });

    console.log(`� Courses: ${courses.length}`);
    courses.forEach(course => {
      console.log(`  - Course ID: ${course.id}`);
      console.log(`    Title: ${course.title}`);
      console.log(`    Institution: ${course.institution?.name || 'Unknown'}`);
      console.log(`    Base Price: $${course.base_price || 0}`);
      console.log('');
    });

  } catch (error) {
    logger.error('❌ Error checking dashboard data:');
  } finally {
    await prisma.$disconnect();
  }
}

checkDashboardData(); 