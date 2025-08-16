import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAccessControlFlaws() {
  console.log('🔧 Fixing Access Control Flaws\n');

  try {
    // 1. Fix orphaned courses (courses with no institution)
    console.log('1. Fixing Orphaned Courses...');
    
    const orphanedCourses = await prisma.course.findMany({
      where: { institutionId: null },
      include: { institution: true }
    });

    console.log(`   Found ${orphanedCourses.length} orphaned courses`);

    if (orphanedCourses.length > 0) {
      // Get an approved institution to assign orphaned courses to
      const approvedInstitution = await prisma.institution.findFirst({
        where: {
          isApproved: true,
          status: 'ACTIVE'
        }
      });

      if (approvedInstitution) {
        console.log(`   Assigning orphaned courses to: ${approvedInstitution.name}`);
        
        for (const course of orphanedCourses) {
          console.log(`   - Fixing course: ${course.title} (${course.id})`);
          
          // Update the course to assign it to the approved institution
          await prisma.course.update({
            where: { id: course.id },
            data: {
              institutionId: approvedInstitution.id,
              // If the course is published but from non-approved institution, set to DRAFT
              status: course.status === 'PUBLISHED' ? 'DRAFT' : course.status
            }
          });
          
          console.log(`     ✅ Assigned to ${approvedInstitution.name} and set status to DRAFT`);
        }
      } else {
        console.log('   ❌ No approved institution found - setting all orphaned courses to DRAFT');
        
        for (const course of orphanedCourses) {
          console.log(`   - Setting course to DRAFT: ${course.title} (${course.id})`);
          
          await prisma.course.update({
            where: { id: course.id },
            data: { status: 'DRAFT' }
          });
        }
      }
    } else {
      console.log('   ✅ No orphaned courses found');
    }

    // 2. Fix institution users with no institution association
    console.log('\n2. Fixing Institution Users with No Association...');
    
    const orphanedInstitutionUsers = await prisma.user.findMany({
      where: {
        role: 'INSTITUTION',
        institutionId: null
      }
    });

    console.log(`   Found ${orphanedInstitutionUsers.length} institution users with no association`);

    if (orphanedInstitutionUsers.length > 0) {
      for (const user of orphanedInstitutionUsers) {
        console.log(`   - Fixing user: ${user.email} (${user.id})`);
        
        // Change role to STUDENT since they have no institution
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'STUDENT' }
        });
        
        console.log(`     ✅ Changed role to STUDENT`);
      }
    } else {
      console.log('   ✅ No orphaned institution users found');
    }

    // 3. Suspend published courses from non-approved institutions
    console.log('\n3. Suspending Published Courses from Non-Approved Institutions...');
    
    const publishedCoursesFromNonApprovedInstitutions = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        institution: {
          OR: [
            { isApproved: false },
            { status: { not: 'ACTIVE' } }
          ]
        }
      },
      include: { institution: true }
    });

    console.log(`   Found ${publishedCoursesFromNonApprovedInstitutions.length} published courses from non-approved institutions`);

    if (publishedCoursesFromNonApprovedInstitutions.length > 0) {
      for (const course of publishedCoursesFromNonApprovedInstitutions) {
        console.log(`   - Suspending course: ${course.title} (${course.id})`);
        console.log(`     Institution: ${course.institution?.name || 'No Institution'} - Approved: ${course.institution?.isApproved}, Status: ${course.institution?.status}`);
        
        await prisma.course.update({
          where: { id: course.id },
          data: { status: 'DRAFT' }
        });
        
        console.log(`     ✅ Set status to DRAFT`);
      }
    } else {
      console.log('   ✅ No published courses from non-approved institutions found');
    }

    // 4. Disable permissions for non-approved institutions
    console.log('\n4. Disabling Permissions for Non-Approved Institutions...');
    
    const nonApprovedInstitutions = await prisma.institution.findMany({
      where: {
        OR: [
          { isApproved: false },
          { status: { not: 'ACTIVE' } }
        ]
      }
    });

    console.log(`   Found ${nonApprovedInstitutions.length} non-approved institutions`);

    for (const institution of nonApprovedInstitutions) {
      console.log(`   - Checking permissions for: ${institution.name} (${institution.id})`);
      
      try {
        const permissions = await prisma.institutionPermissions.findUnique({
          where: { institutionId: institution.id }
        });

        if (permissions) {
          // Disable all permissions for non-approved institutions
          const disabledPermissions = {
            canCreateCourses: false,
            canEditCourses: false,
            canDeleteCourses: false,
            canPublishCourses: false,
            canCreateContent: false,
            canEditContent: false,
            canDeleteContent: false,
            canUploadMedia: false,
            canCreateQuizzes: false,
            canEditQuizzes: false,
            canDeleteQuizzes: false,
            canViewQuizResults: false,
            canViewStudents: false,
            canManageStudents: false,
            canViewEnrollments: false,
            canViewPayments: false,
            canViewPayouts: false,
            canManagePricing: false,
            canViewAnalytics: false,
            canViewReports: false,
            canExportData: false,
            canEditProfile: false,
            canManageUsers: false,
            canViewSettings: false,
            canApprovePayments: false
          };

          await prisma.institutionPermissions.update({
            where: { institutionId: institution.id },
            data: disabledPermissions
          });

          console.log(`     ✅ Disabled all permissions`);
        } else {
          console.log(`     ℹ️  No permissions record found`);
        }
      } catch (error) {
        console.log(`     ❌ Error updating permissions: ${error}`);
      }
    }

    // 5. Verify fixes
    console.log('\n5. Verifying Fixes...');
    
    // Check for remaining orphaned courses
    const remainingOrphanedCourses = await prisma.course.findMany({
      where: { institutionId: null }
    });
    console.log(`   Remaining orphaned courses: ${remainingOrphanedCourses.length}`);

    // Check for remaining published courses from non-approved institutions
    const remainingPublishedFromNonApproved = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        institution: {
          OR: [
            { isApproved: false },
            { status: { not: 'ACTIVE' } }
          ]
        }
      }
    });
    console.log(`   Remaining published courses from non-approved institutions: ${remainingPublishedFromNonApproved.length}`);

    // Check for remaining orphaned institution users
    const remainingOrphanedUsers = await prisma.user.findMany({
      where: {
        role: 'INSTITUTION',
        institutionId: null
      }
    });
    console.log(`   Remaining orphaned institution users: ${remainingOrphanedUsers.length}`);

    // Summary
    console.log('\n6. Fix Summary...');
    
    if (remainingOrphanedCourses.length === 0 && 
        remainingPublishedFromNonApproved.length === 0 && 
        remainingOrphanedUsers.length === 0) {
      console.log('   ✅ All access control flaws have been fixed!');
    } else {
      console.log('   ⚠️  Some issues remain - manual intervention may be required');
    }

  } catch (error) {
    console.error('❌ Error fixing access control flaws:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixAccessControlFlaws();
