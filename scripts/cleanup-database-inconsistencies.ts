import { prisma } from '../lib/prisma';

async function cleanupDatabaseInconsistencies() {
  try {
    console.log('Starting database cleanup and consolidation...');
    
    // 1. CONSOLIDATE DUPLICATE INSTITUTIONS
    console.log('\n=== 1. CONSOLIDATING DUPLICATE INSTITUTIONS ===');
    
    // Find all institutions
    const institutions = await prisma.institution.findMany({
      include: {
        courses: {
          include: {
            enrollments: {
              select: {
                id: true
              }
            }
          }
        }
      }
    });
    
    // Group by name
    const institutionGroups = new Map();
    institutions.forEach(inst => {
      const key = inst.name.toLowerCase().trim();
      if (!institutionGroups.has(key)) {
        institutionGroups.set(key, []);
      }
      institutionGroups.get(key).push(inst);
    });
    
    // Process each group with duplicates
    for (const [name, group] of institutionGroups) {
      if (group.length > 1) {
        console.log(`\n🏫 Processing "${name}" (${group.length} instances):`);
        
        // Sort by creation date and activity (most courses/enrollments first)
        group.sort((a, b) => {
          const aActivity = a.courses.reduce((sum, course) => sum + course.enrollments.length, 0);
          const bActivity = b.courses.reduce((sum, course) => sum + course.enrollments.length, 0);
          if (aActivity !== bActivity) return bActivity - aActivity;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        
        const primary = group[0];
        const duplicates = group.slice(1);
        
        console.log(`  Primary: ${primary.name} (${primary.id})`);
        console.log(`  Duplicates: ${duplicates.length}`);
        
        // Migrate data from duplicates to primary
        for (const duplicate of duplicates) {
          console.log(`  Migrating data from ${duplicate.id} to ${primary.id}...`);
          
          // Update courses
          const updatedCourses = await prisma.course.updateMany({
            where: { institutionId: duplicate.id },
            data: { institutionId: primary.id }
          });
          console.log(`    Moved ${updatedCourses.count} courses`);
          
          // Update institution users
          const updatedUsers = await prisma.user.updateMany({
            where: { institutionId: duplicate.id },
            data: { institutionId: primary.id }
          });
          console.log(`    Moved ${updatedUsers.count} users`);
          
          // Delete the duplicate institution
          await prisma.institution.delete({
            where: { id: duplicate.id }
          });
          console.log(`    Deleted duplicate institution ${duplicate.id}`);
        }
      }
    }
    
    // 2. FIX USER-STUDENT SYNCHRONIZATION
    console.log('\n=== 2. FIXING USER-STUDENT SYNCHRONIZATION ===');
    
    // Get all users with STUDENT role
    const studentUsers = await prisma.user.findMany({
      where: { role: 'STUDENT' },
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
    
    const userMap = new Map(studentUsers.map(u => [u.id, u]));
    const studentMap = new Map(studentRecords.map(s => [s.id, s]));
    
    // Create missing student records for users
    const userOnly = studentUsers.filter(u => !studentMap.has(u.id));
    console.log(`Creating ${userOnly.length} missing student records...`);
    
    for (const user of userOnly) {
      await prisma.student.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
          last_active: new Date()
        }
      });
      console.log(`  Created student record for ${user.name} (${user.email})`);
    }
    
    // Create missing user records for students
    const studentOnly = studentRecords.filter(s => !userMap.has(s.id));
    console.log(`Creating ${studentOnly.length} missing user records...`);
    
    for (const student of studentOnly) {
      // Generate a simple password hash (you might want to use proper hashing)
      const passwordHash = '$2a$10$placeholder.hash.for.' + student.id;
      
      await prisma.user.create({
        data: {
          id: student.id,
          name: student.name,
          email: student.email,
          password: passwordHash,
          role: 'STUDENT',
          status: 'ACTIVE'
        }
      });
      console.log(`  Created user record for ${student.name} (${student.email})`);
    }
    
    // Synchronize data inconsistencies
    const bothExist = studentUsers.filter(u => studentMap.has(u.id));
    console.log(`Synchronizing ${bothExist.length} existing user-student pairs...`);
    
    for (const user of bothExist) {
      const student = studentMap.get(user.id);
      if (user.name !== student.name || user.email !== student.email) {
        // Use user data as source of truth (more recent)
        await prisma.student.update({
          where: { id: user.id },
          data: {
            name: user.name,
            email: user.email,
            updated_at: new Date()
          }
        });
        console.log(`  Synchronized ${user.name} (${user.email})`);
      }
    }
    
    // 3. CLEAN UP ORPHANED ENROLLMENTS
    console.log('\n=== 3. CLEANING UP ORPHANED ENROLLMENTS ===');
    
    // Find enrollments with missing students or courses
    const enrollments = await prisma.studentCourseEnrollment.findMany({
      include: {
        student: {
          select: { id: true }
        },
        course: {
          select: { id: true }
        }
      }
    });
    
    const orphanedEnrollments = enrollments.filter(e => !e.student || !e.course);
    console.log(`Found ${orphanedEnrollments.length} orphaned enrollments`);
    
    if (orphanedEnrollments.length > 0) {
      const orphanedIds = orphanedEnrollments.map(e => e.id);
      await prisma.studentCourseEnrollment.deleteMany({
        where: {
          id: { in: orphanedIds }
        }
      });
      console.log(`  Deleted ${orphanedEnrollments.length} orphaned enrollments`);
    }
    
    // 4. VERIFY CLEANUP RESULTS
    console.log('\n=== 4. VERIFYING CLEANUP RESULTS ===');
    
    const finalInstitutions = await prisma.institution.findMany({
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
    
    console.log(`Final institution count: ${finalInstitutions.length}`);
    finalInstitutions.forEach(inst => {
      const totalEnrollments = inst.courses.reduce((sum, course) => sum + course.enrollments.length, 0);
      console.log(`  ${inst.name}: ${inst.courses.length} courses, ${totalEnrollments} enrollments`);
    });
    
    const finalStudentUsers = await prisma.user.count({ where: { role: 'STUDENT' } });
    const finalStudentRecords = await prisma.student.count();
    console.log(`Final student users: ${finalStudentUsers}, student records: ${finalStudentRecords}`);
    
    console.log('\n✅ Database cleanup completed successfully!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Test the application to ensure everything works correctly');
    console.log('2. Update any hardcoded institution IDs in your code');
    console.log('3. Implement data validation to prevent future inconsistencies');
    console.log('4. Consider implementing database triggers for user-student synchronization');
    
  } catch (error) {
    console.error('Error during database cleanup:', error);
    console.log('\n❌ Cleanup failed. Please check the error and try again.');
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDatabaseInconsistencies(); 