import { prisma } from '../lib/prisma';

async function analyzeDatabaseInconsistencies() {
  try {
    console.log('Analyzing database inconsistencies and synchronization issues...');
    
    // 1. Analyze Institution Duplicates
    console.log('\n=== 1. INSTITUTION DUPLICATES ===');
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        courses: {
          select: {
            id: true,
            title: true,
            enrollments: {
              select: {
                id: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    const institutionGroups = new Map();
    institutions.forEach(inst => {
      const key = inst.name.toLowerCase().trim();
      if (!institutionGroups.has(key)) {
        institutionGroups.set(key, []);
      }
      institutionGroups.get(key).push(inst);
    });
    
    console.log('Institutions with potential duplicates:');
    institutionGroups.forEach((group, name) => {
      if (group.length > 1) {
        console.log(`\n🏫 "${name}" (${group.length} instances):`);
        group.forEach((inst, index) => {
          const totalCourses = inst.courses.length;
          const totalEnrollments = inst.courses.reduce((sum, course) => sum + course.enrollments.length, 0);
          console.log(`  ${index + 1}. ID: ${inst.id}`);
          console.log(`     Email: ${inst.email}`);
          console.log(`     Created: ${inst.createdAt}`);
          console.log(`     Courses: ${totalCourses}, Enrollments: ${totalEnrollments}`);
        });
      }
    });
    
    // 2. Analyze User-Student Synchronization
    console.log('\n=== 2. USER-STUDENT SYNCHRONIZATION ===');
    
    // Get all users with STUDENT role
    const studentUsers = await prisma.user.findMany({
      where: {
        role: 'STUDENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true
      }
    });
    
    // Get all student records
    const studentRecords = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        updated_at: true
      }
    });
    
    console.log(`Total users with STUDENT role: ${studentUsers.length}`);
    console.log(`Total student records: ${studentRecords.length}`);
    
    // Check for mismatches
    const userMap = new Map(studentUsers.map(u => [u.id, u]));
    const studentMap = new Map(studentRecords.map(s => [s.id, s]));
    
    const userOnly = studentUsers.filter(u => !studentMap.has(u.id));
    const studentOnly = studentRecords.filter(s => !userMap.has(s.id));
    const bothExist = studentUsers.filter(u => studentMap.has(u.id));
    
    console.log(`\nUsers without student records: ${userOnly.length}`);
    userOnly.forEach(u => {
      console.log(`  - ${u.name} (${u.email}) - ID: ${u.id}`);
    });
    
    console.log(`\nStudent records without users: ${studentOnly.length}`);
    studentOnly.forEach(s => {
      console.log(`  - ${s.name} (${s.email}) - ID: ${s.id}`);
    });
    
    console.log(`\nUsers with matching student records: ${bothExist.length}`);
    
    // Check for data inconsistencies in matching records
    const inconsistencies = [];
    bothExist.forEach(user => {
      const student = studentMap.get(user.id);
      if (user.name !== student.name || user.email !== student.email) {
        inconsistencies.push({
          id: user.id,
          user: { name: user.name, email: user.email, updatedAt: user.updatedAt },
          student: { name: student.name, email: student.email, updated_at: student.updated_at }
        });
      }
    });
    
    console.log(`\nData inconsistencies between user and student records: ${inconsistencies.length}`);
    inconsistencies.forEach(inc => {
      console.log(`\n  ID: ${inc.id}`);
      console.log(`    User: "${inc.user.name}" (${inc.user.email}) - Updated: ${inc.user.updatedAt}`);
      console.log(`    Student: "${inc.student.name}" (${inc.student.email}) - Updated: ${inc.student.updated_at}`);
    });
    
    // 3. Analyze Enrollment Issues
    console.log('\n=== 3. ENROLLMENT ISSUES ===');
    
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      include: {
        student: true,
        course: {
          include: {
            institution: true
          }
        }
      }
    });
    
    console.log(`Total enrollments: ${enrollments.length}`);
    
    // Check for orphaned enrollments
    const orphanedEnrollments = enrollments.filter(e => !e.student || !e.course);
    console.log(`Orphaned enrollments: ${orphanedEnrollments.length}`);
    
    // Check for enrollments with mismatched student IDs
    const mismatchedEnrollments = enrollments.filter(e => {
      return e.student && e.student.id !== e.studentId;
    });
    console.log(`Enrollments with mismatched student IDs: ${mismatchedEnrollments.length}`);
    
    // 4. Recommendations
    console.log('\n=== 4. RECOMMENDATIONS ===');
    console.log('\n🔧 IMMEDIATE ACTIONS NEEDED:');
    
    if (institutionGroups.size > 0) {
      console.log('1. CONSOLIDATE DUPLICATE INSTITUTIONS:');
      institutionGroups.forEach((group, name) => {
        if (group.length > 1) {
          console.log(`   - Merge "${name}" institutions (${group.length} instances)`);
          console.log(`   - Choose primary institution and migrate all data`);
        }
      });
    }
    
    if (userOnly.length > 0 || studentOnly.length > 0) {
      console.log('2. FIX USER-STUDENT MISMATCHES:');
      console.log(`   - Create missing student records: ${userOnly.length}`);
      console.log(`   - Create missing user records: ${studentOnly.length}`);
    }
    
    if (inconsistencies.length > 0) {
      console.log('3. SYNCHRONIZE USER-STUDENT DATA:');
      console.log(`   - Fix ${inconsistencies.length} data inconsistencies`);
      console.log(`   - Decide on single source of truth (user or student table)`);
    }
    
    console.log('\n📋 LONG-TERM SOLUTIONS:');
    console.log('1. Implement database constraints to prevent future duplicates');
    console.log('2. Create triggers or application logic to keep user/student in sync');
    console.log('3. Establish clear data ownership rules');
    console.log('4. Implement data validation and cleanup procedures');
    
    console.log('\n✅ Database analysis completed!');
    
  } catch (error) {
    console.error('Error analyzing database inconsistencies:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeDatabaseInconsistencies(); 