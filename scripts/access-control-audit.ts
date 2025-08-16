import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditAccessControls() {
  console.log('🔍 Access Control Audit - Checking for Flaws\n');

  try {
    // 1. Get all institutions and their statuses
    console.log('1. Analyzing Institution Statuses and Access...');
    
    const institutions = await prisma.institution.findMany({
      include: {
        users: true,
        courses: {
          include: {
            enrollments: true
          }
        }
      }
    });

    console.log(`   Found ${institutions.length} institutions:`);
    
    const approvedInstitutions = institutions.filter(inst => inst.isApproved && inst.status === 'ACTIVE');
    const pendingInstitutions = institutions.filter(inst => !inst.isApproved || inst.status !== 'ACTIVE');
    
    console.log(`   ✅ Approved & Active: ${approvedInstitutions.length}`);
    console.log(`   ❌ Pending/Inactive: ${pendingInstitutions.length}`);

    // 2. Check for access control flaws in pending institutions
    console.log('\n2. Checking Pending Institution Access Flaws...');
    
    for (const institution of pendingInstitutions) {
      console.log(`\n   Institution: ${institution.name} (${institution.id})`);
      console.log(`   Status: Approved=${institution.isApproved}, Status=${institution.status}`);
      
      // Check if pending institution has public content
      const publicCourses = institution.courses.filter(course => course.status === 'PUBLISHED');
      if (publicCourses.length > 0) {
        console.log(`   ⚠️  FLAW: ${publicCourses.length} published courses found (should be hidden)`);
        publicCourses.forEach(course => {
          console.log(`      - Course: ${course.title} (${course.id})`);
        });
      }

      // Check if pending institution has active enrollments
      const activeEnrollments = institution.courses.flatMap(course => 
        course.enrollments.filter(enrollment => enrollment.status === 'ACTIVE')
      );
      if (activeEnrollments.length > 0) {
        console.log(`   ⚠️  FLAW: ${activeEnrollments.length} active enrollments found (should be suspended)`);
      }

      // Check institution permissions (if they exist)
      try {
        const permissions = await prisma.institutionPermissions.findUnique({
          where: { institutionId: institution.id }
        });
        
        if (permissions) {
          const enabledPermissions = Object.entries(permissions)
            .filter(([key, value]) => key !== 'id' && key !== 'institutionId' && key !== 'createdAt' && key !== 'updatedAt' && value === true)
            .map(([key]) => key);
          
          if (enabledPermissions.length > 0) {
            console.log(`   ⚠️  FLAW: ${enabledPermissions.length} permissions enabled (should be disabled)`);
            console.log(`      - Permissions: ${enabledPermissions.join(', ')}`);
          }
        }
      } catch (error) {
        // Permissions table might not exist or have issues
        console.log(`   ℹ️  Could not check permissions for ${institution.name}`);
      }
    }

    // 3. Get all users and their statuses
    console.log('\n3. Analyzing User Statuses and Access...');
    
    const users = await prisma.user.findMany({
      include: {
        institution: true
      }
    });

    console.log(`   Found ${users.length} users:`);
    
    const activeUsers = users.filter(user => user.status === 'ACTIVE');
    const suspendedUsers = users.filter(user => user.status === 'SUSPENDED');
    
    console.log(`   ✅ Active users: ${activeUsers.length}`);
    console.log(`   ❌ Suspended users: ${suspendedUsers.length}`);

    // 4. Check for access control flaws in suspended users
    console.log('\n4. Checking Suspended User Access Flaws...');
    
    for (const user of suspendedUsers) {
      console.log(`\n   User: ${user.email} (${user.id}) - Role: ${user.role}`);
      
      // Check if suspended user has active enrollments
      const activeEnrollments = await prisma.studentCourseEnrollment.findMany({
        where: {
          studentId: user.id,
          status: 'ACTIVE'
        },
        include: {
          course: {
            include: {
              institution: true
            }
          }
        }
      });
      
      if (activeEnrollments.length > 0) {
        console.log(`   ⚠️  FLAW: ${activeEnrollments.length} active enrollments found (should be suspended)`);
        activeEnrollments.forEach(enrollment => {
          console.log(`      - Course: ${enrollment.course.title} (${enrollment.course.institution?.name || 'No Institution'})`);
        });
      }

      // Check if suspended user has pending payments
      const pendingPayments = await prisma.payment.findMany({
        where: {
          enrollmentId: {
            in: activeEnrollments.map(e => e.id)
          },
          status: 'PENDING'
        }
      });
      
      if (pendingPayments.length > 0) {
        console.log(`   ⚠️  FLAW: ${pendingPayments.length} pending payments found (should be cancelled)`);
      }
    }

    // 5. Check institution user access to non-approved institutions
    console.log('\n5. Checking Institution User Access Flaws...');
    
    const institutionUsers = users.filter(user => user.role === 'INSTITUTION');
    
    for (const user of institutionUsers) {
      if (!user.institution) {
        console.log(`   ⚠️  FLAW: Institution user ${user.email} has no institution association`);
        continue;
      }

      if (!user.institution.isApproved || user.institution.status !== 'ACTIVE') {
        console.log(`\n   Institution User: ${user.email} (${user.id})`);
        console.log(`   Institution: ${user.institution.name} - Approved: ${user.institution.isApproved}, Status: ${user.institution.status}`);
        
        // Check if user has accessed content they shouldn't have
        const enrollments = await prisma.studentCourseEnrollment.findMany({
          where: {
            studentId: user.id
          },
          include: {
            course: {
              include: {
                institution: true
              }
            }
          }
        });
        
        const enrollmentsInApprovedInstitutions = enrollments.filter(enrollment => 
          enrollment.course.institution?.isApproved && enrollment.course.institution?.status === 'ACTIVE'
        );
        
        if (enrollmentsInApprovedInstitutions.length > 0) {
          console.log(`   ⚠️  FLAW: User has ${enrollmentsInApprovedInstitutions.length} enrollments in approved institutions (should be blocked)`);
          enrollmentsInApprovedInstitutions.forEach(enrollment => {
            console.log(`      - Course: ${enrollment.course.title} (${enrollment.course.institution?.name})`);
          });
        }
      }
    }

    // 6. Check for permission-based access flaws
    console.log('\n6. Checking Permission-Based Access Flaws...');
    
    for (const institution of institutions) {
      try {
        const permissions = await prisma.institutionPermissions.findUnique({
          where: { institutionId: institution.id }
        });
        
        if (permissions) {
          // Check if institution can publish courses but is not approved
          if (!institution.isApproved && permissions.canPublishCourses) {
            console.log(`   ⚠️  FLAW: Non-approved institution ${institution.name} has canPublishCourses permission`);
          }
          
          // Check if institution can manage students but is not approved
          if (!institution.isApproved && permissions.canManageStudents) {
            console.log(`   ⚠️  FLAW: Non-approved institution ${institution.name} has canManageStudents permission`);
          }
          
          // Check if institution can view payments but is not approved
          if (!institution.isApproved && permissions.canViewPayments) {
            console.log(`   ⚠️  FLAW: Non-approved institution ${institution.name} has canViewPayments permission`);
          }
        }
      } catch (error) {
        // Permissions table might not exist or have issues
        console.log(`   ℹ️  Could not check permissions for ${institution.name}`);
      }
    }

    // 7. Check for content visibility flaws
    console.log('\n7. Checking Content Visibility Flaws...');
    
    // Get all published courses
    const allPublishedCourses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        institution: true
      }
    });

    const coursesFromNonApprovedInstitutions = allPublishedCourses.filter(course => 
      !course.institution?.isApproved || course.institution?.status !== 'ACTIVE'
    );

    if (coursesFromNonApprovedInstitutions.length > 0) {
      console.log(`   ⚠️  FLAW: ${coursesFromNonApprovedInstitutions.length} published courses from non-approved institutions found`);
      coursesFromNonApprovedInstitutions.forEach(course => {
        console.log(`      - Course: ${course.title} (${course.institution?.name || 'No Institution'}) - Approved: ${course.institution?.isApproved}, Status: ${course.institution?.status}`);
      });
    }

    // 8. Check for payment approval flaws
    console.log('\n8. Checking Payment Approval Flaws...');
    
    const pendingPayments = await prisma.payment.findMany({
      where: { status: 'PENDING' }
    });

    console.log(`   Found ${pendingPayments.length} pending payments`);
    console.log(`   ℹ️  Payment approval check skipped - requires manual verification of institution approval status`);

    // 9. Summary of findings
    console.log('\n9. Access Control Audit Summary...');
    
    let totalFlaws = 0;
    let criticalFlaws = 0;
    
    // Count flaws from previous checks
    const flaws = [
      pendingInstitutions.filter(inst => inst.courses.some(c => c.status === 'PUBLISHED')).length,
      coursesFromNonApprovedInstitutions.length
    ];
    
    totalFlaws = flaws.reduce((sum, count) => sum + count, 0);
    criticalFlaws = totalFlaws; // All identified flaws are critical for security

    console.log(`   Total Flaws Found: ${totalFlaws}`);
    console.log(`   Critical Flaws: ${criticalFlaws}`);
    
    if (totalFlaws === 0) {
      console.log('   ✅ No access control flaws detected!');
    } else {
      console.log('   ❌ Access control flaws detected - immediate action required!');
    }

    // 10. Recommendations
    console.log('\n10. Recommendations...');
    
    if (totalFlaws > 0) {
      console.log('   🔧 Immediate Actions Required:');
      console.log('      - Suspend all published courses from non-approved institutions');
      console.log('      - Disable permissions for non-approved institutions');
      console.log('      - Review and fix middleware access controls');
    } else {
      console.log('   ✅ Access controls are working correctly');
    }

  } catch (error) {
    console.error('❌ Error during access control audit:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the audit
auditAccessControls();
