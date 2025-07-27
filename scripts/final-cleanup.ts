import { prisma } from '../lib/prisma';

async function finalCleanup() {
  try {
    console.log('Performing final cleanup...');
    
    // 1. Clean up orphaned enrollments (handle null references)
    console.log('\n=== 1. CLEANING UP ORPHANED ENROLLMENTS ===');
    
    // Find enrollments with null student or course references
    const allEnrollments = await prisma.studentCourseEnrollment.findMany({
      select: {
        id: true,
        studentId: true,
        courseId: true
      }
    });
    
    console.log(`Total enrollments: ${allEnrollments.length}`);
    
    // Check which enrollments have invalid references
    const orphanedEnrollments = [];
    
    for (const enrollment of allEnrollments) {
      // Check if student exists
      const student = await prisma.student.findUnique({
        where: { id: enrollment.studentId },
        select: { id: true }
      });
      
      // Check if course exists
      const course = await prisma.course.findUnique({
        where: { id: enrollment.courseId },
        select: { id: true }
      });
      
      if (!student || !course) {
        orphanedEnrollments.push(enrollment);
      }
    }
    
    console.log(`Found ${orphanedEnrollments.length} orphaned enrollments`);
    
    if (orphanedEnrollments.length > 0) {
      const orphanedIds = orphanedEnrollments.map(e => e.id);
      await prisma.studentCourseEnrollment.deleteMany({
        where: {
          id: { in: orphanedIds }
        }
      });
      console.log(`  Deleted ${orphanedEnrollments.length} orphaned enrollments`);
    } else {
      console.log('  No orphaned enrollments found');
    }
    
    // 2. Verify final state
    console.log('\n=== 2. VERIFYING FINAL STATE ===');
    
    const finalInstitutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        courses: {
          select: {
            id: true,
            title: true,
            enrollments: {
              select: { id: true }
            }
          }
        }
      }
    });
    
    console.log(`Final institution count: ${finalInstitutions.length}`);
    finalInstitutions.forEach(inst => {
      const totalEnrollments = inst.courses.reduce((sum, course) => sum + course.enrollments.length, 0);
      console.log(`  ${inst.name} (${inst.id}):`);
      console.log(`    Courses: ${inst.courses.length}`);
      console.log(`    Enrollments: ${totalEnrollments}`);
      inst.courses.forEach(course => {
        console.log(`      - ${course.title}: ${course.enrollments.length} enrollments`);
      });
    });
    
    // 3. Check user-student synchronization
    console.log('\n=== 3. USER-STUDENT SYNCHRONIZATION ===');
    
    const studentUsers = await prisma.user.count({ where: { role: 'STUDENT' } });
    const studentRecords = await prisma.student.count();
    
    console.log(`Student users: ${studentUsers}`);
    console.log(`Student records: ${studentRecords}`);
    
    if (studentUsers === studentRecords) {
      console.log('✅ User-student synchronization is correct');
    } else {
      console.log('❌ User-student count mismatch');
    }
    
    // 4. Test student access
    console.log('\n=== 4. TESTING STUDENT ACCESS ===');
    
    const testStudentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    
    // Find which institution this student is enrolled in
    const studentEnrollments = await prisma.studentCourseEnrollment.findMany({
      where: { studentId: testStudentId },
      include: {
        course: {
          include: {
            institution: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });
    
    if (studentEnrollments.length > 0) {
      const institutions = new Set();
      studentEnrollments.forEach(e => {
        if (e.course && e.course.institution) {
          institutions.add(`${e.course.institution.name} (${e.course.institution.id})`);
        }
      });
      
      console.log(`Student ${testStudentId} is enrolled in:`);
      institutions.forEach(inst => console.log(`  - ${inst}`));
      
      // Get the primary institution (first one)
      const primaryInstitution = studentEnrollments[0]?.course?.institution;
      if (primaryInstitution) {
        console.log(`\nPrimary institution for testing: ${primaryInstitution.name} (${primaryInstitution.id})`);
        console.log('✅ You can now log in as this institution to access the student details page');
      }
    } else {
      console.log('❌ Student has no enrollments');
    }
    
    console.log('\n✅ Final cleanup completed successfully!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Test the application - the student details page should now work');
    console.log('2. Log in as the correct institution user');
    console.log('3. Navigate to the student details page');
    console.log('4. Verify that all data is consistent');
    
  } catch (error) {
    console.error('Error during final cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalCleanup(); 