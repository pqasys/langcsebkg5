import { prisma } from '../lib/prisma';

async function debugStudentCountDiscrepancy() {
  try {
    console.log('Debugging student count discrepancy for XYZ Language School...');
    
    // Find the specific institution
    const institution = await prisma.institution.findFirst({
      where: {
        name: 'XYZ Language School'
      },
      include: {
        courses: {
          include: {
            enrollments: {
              include: {
                student: true
              }
            }
          }
        },
        users: {
          where: {
            role: 'STUDENT'
          }
        }
      }
    });

    if (!institution) {
      console.log('XYZ Language School not found');
      return;
    }

    console.log(`\nInstitution: ${institution.name} (${institution.id})`);
    console.log(`Total Courses: ${institution.courses.length}`);

    // Method 1: Analytics calculation (institution.users)
    console.log(`\n=== ANALYTICS CALCULATION ===`);
    console.log(`Institution users with role 'STUDENT': ${institution.users.length}`);
    institution.users.forEach((user, index) => {
      console.log(`  User ${index + 1}: ${user.email || user.name || user.id}`);
    });

    // Method 2: Students page calculation (enrollments)
    console.log(`\n=== STUDENTS PAGE CALCULATION ===`);
    
    // Get course IDs
    const courseIds = institution.courses.map(c => c.id);
    console.log(`Course IDs: [${courseIds.join(', ')}]`);

    // Get enrollments for these courses
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        courseId: {
          in: courseIds
        }
      },
      include: {
        student: true,
        course: true
      }
    });

    console.log(`Total enrollments: ${enrollments.length}`);
    
    // Get unique student IDs
    const studentIds = [...new Set(enrollments.map(e => e.studentId))];
    console.log(`Unique student IDs: [${studentIds.join(', ')}]`);
    console.log(`Unique students count: ${studentIds.length}`);

    // Show enrollment details
    enrollments.forEach((enrollment, index) => {
      console.log(`  Enrollment ${index + 1}:`);
      console.log(`    Student: ${enrollment.student.name || enrollment.student.email || enrollment.student.id}`);
      console.log(`    Course: ${enrollment.course.title}`);
      console.log(`    Status: ${enrollment.status}`);
    });

    // Method 3: Check if there are any students who are institution users but haven't enrolled
    console.log(`\n=== COMPARISON ===`);
    
    const institutionUserIds = institution.users.map(u => u.id);
    const enrolledStudentIds = studentIds;
    
    const usersNotEnrolled = institutionUserIds.filter(id => !enrolledStudentIds.includes(id));
    const enrolledNotUsers = enrolledStudentIds.filter(id => !institutionUserIds.includes(id));
    
    console.log(`Users who haven't enrolled: ${usersNotEnrolled.length}`);
    if (usersNotEnrolled.length > 0) {
      usersNotEnrolled.forEach(id => {
        const user = institution.users.find(u => u.id === id);
        console.log(`  - ${user?.email || user?.name || id}`);
      });
    }
    
    console.log(`Enrolled students not in institution users: ${enrolledNotUsers.length}`);
    if (enrolledNotUsers.length > 0) {
      enrolledNotUsers.forEach(id => {
        const enrollment = enrollments.find(e => e.studentId === id);
        console.log(`  - ${enrollment?.student.name || enrollment?.student.email || id}`);
      });
    }

    // Summary
    console.log(`\n=== SUMMARY ===`);
    console.log(`Analytics API count (institution.users): ${institution.users.length}`);
    console.log(`Students API count (enrolled students): ${studentIds.length}`);
    console.log(`Difference: ${institution.users.length - studentIds.length}`);

    if (institution.users.length === studentIds.length) {
      console.log(`✅ Both APIs should show the same count`);
    } else {
      console.log(`❌ Discrepancy found!`);
      console.log(`   Analytics shows: ${institution.users.length}`);
      console.log(`   Students page shows: ${studentIds.length}`);
    }

  } catch (error) {
    console.error('Error debugging student count discrepancy:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugStudentCountDiscrepancy(); 