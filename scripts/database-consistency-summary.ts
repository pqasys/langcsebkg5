import { prisma } from '../lib/prisma';
import { validateUserStudentConsistency } from '../lib/user-student-sync';

async function databaseConsistencySummary() {
  try {
    console.log('=== DATABASE CONSISTENCY SUMMARY ===');
    console.log('Date:', new Date().toISOString());
    console.log('');
    
    // 1. Current Institution State
    console.log('1. INSTITUTION DUPLICATES');
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        courses: {
          select: {
            id: true,
            enrollments: {
              select: { id: true }
            }
          }
        }
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
    
    let hasDuplicates = false;
    institutionGroups.forEach((group, name) => {
      if (group.length > 1) {
        hasDuplicates = true;
        console.log(`❌ "${name}": ${group.length} instances`);
        group.forEach((inst, index) => {
          const enrollments = inst.courses.reduce((sum, course) => sum + course.enrollments.length, 0);
          console.log(`   ${index + 1}. ${inst.id} (${inst.courses.length} courses, ${enrollments} enrollments)`);
        });
      } else {
        console.log(`✅ "${name}": 1 instance`);
      }
    });
    
    if (!hasDuplicates) {
      console.log('✅ No institution duplicates found');
    }
    
    // 2. User-Student Synchronization State
    console.log('\n2. USER-STUDENT SYNCHRONIZATION');
    const validation = await validateUserStudentConsistency();
    
    if (validation.valid) {
      console.log('✅ User-student synchronization is valid');
    } else {
      console.log('❌ User-student synchronization issues found:');
      validation.issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    }
    
    console.log(`   Summary: ${validation.summary.totalUsers} users, ${validation.summary.totalStudents} students`);
    console.log(`   Mismatched: ${validation.summary.mismatched}, Orphaned: ${validation.summary.orphanedUsers + validation.summary.orphanedStudents}`);
    
    // 3. Student Enrollment State
    console.log('\n3. STUDENT ENROLLMENTS');
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      include: {
        student: {
          select: { id: true, name: true }
        },
        course: {
          include: {
            institution: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });
    
    console.log(`Total enrollments: ${enrollments.length}`);
    
    const orphanedEnrollments = enrollments.filter(e => !e.student || !e.course);
    if (orphanedEnrollments.length > 0) {
      console.log(`❌ Orphaned enrollments: ${orphanedEnrollments.length}`);
    } else {
      console.log('✅ No orphaned enrollments found');
    }
    
    // Group enrollments by institution
    const enrollmentByInstitution = new Map();
    enrollments.forEach(enrollment => {
      if (enrollment.course && enrollment.course.institution) {
        const instId = enrollment.course.institution.id;
        if (!enrollmentByInstitution.has(instId)) {
          enrollmentByInstitution.set(instId, {
            name: enrollment.course.institution.name,
            enrollments: []
          });
        }
        enrollmentByInstitution.get(instId).enrollments.push(enrollment);
      }
    });
    
    console.log('\nEnrollments by institution:');
    enrollmentByInstitution.forEach((data, instId) => {
      const uniqueStudents = new Set(data.enrollments.map(e => e.studentId));
      console.log(`   ${data.name}: ${data.enrollments.length} enrollments, ${uniqueStudents.size} students`);
    });
    
    // 4. Recommendations
    console.log('\n4. RECOMMENDATIONS');
    
    if (hasDuplicates || !validation.valid || orphanedEnrollments.length > 0) {
      console.log('🔧 IMMEDIATE ACTION REQUIRED:');
      
      if (hasDuplicates) {
        console.log('   1. Run institution cleanup: npx tsx scripts/cleanup-database-inconsistencies.ts');
      }
      
      if (!validation.valid) {
        console.log('   2. Fix user-student synchronization issues');
      }
      
      if (orphanedEnrollments.length > 0) {
        console.log('   3. Clean up orphaned enrollments');
      }
      
      console.log('\n📋 LONG-TERM PREVENTION:');
      console.log('   1. Add database constraints to prevent duplicates');
      console.log('   2. Implement automatic user-student synchronization');
      console.log('   3. Add data validation in application code');
      console.log('   4. Set up regular consistency checks');
      
    } else {
      console.log('✅ Database is in good condition');
      console.log('📋 MAINTENANCE:');
      console.log('   1. Run regular consistency checks');
      console.log('   2. Monitor for new inconsistencies');
      console.log('   3. Update application code to use synchronization functions');
    }
    
    // 5. Next Steps
    console.log('\n5. NEXT STEPS');
    console.log('   1. Review the analysis above');
    console.log('   2. Run cleanup scripts if needed');
    console.log('   3. Update application code to prevent future issues');
    console.log('   4. Implement monitoring and alerting');
    console.log('   5. Document any hardcoded institution IDs that need updating');
    
    console.log('\n✅ Database consistency summary completed!');
    
  } catch (error) {
    console.error('Error generating database consistency summary:', error);
  } finally {
    await prisma.$disconnect();
  }
}

databaseConsistencySummary(); 