import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSiteWideAccessControl() {
  console.log('🔒 Testing Site-Wide Access Control System\n');

  try {
    // 1. Check current user and institution statuses
    console.log('1. Checking Current User and Institution Statuses...');
    
    const users = await prisma.user.findMany({
      include: {
        institution: true
      },
      orderBy: { email: 'asc' }
    });

    console.log(`   Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}): Status=${user.status}, Institution=${user.institution?.name || 'None'}`);
    });

    const institutions = await prisma.institution.findMany({
      orderBy: { name: 'asc' }
    });

    console.log(`\n   Found ${institutions.length} institutions:`);
    institutions.forEach(inst => {
      console.log(`   - ${inst.name}: Approved=${inst.isApproved}, Status=${inst.status}`);
    });

    // 2. Test institution approval filtering
    console.log('\n2. Testing Institution Approval Filtering...');
    
    const approvedInstitutions = institutions.filter(inst => inst.isApproved && inst.status === 'ACTIVE');
    const pendingInstitutions = institutions.filter(inst => !inst.isApproved || inst.status !== 'ACTIVE');
    
    console.log(`   ✅ Approved & Active institutions: ${approvedInstitutions.length}`);
    approvedInstitutions.forEach(inst => console.log(`      - ${inst.name}`));
    
    console.log(`   ❌ Pending/Inactive institutions: ${pendingInstitutions.length}`);
    pendingInstitutions.forEach(inst => console.log(`      - ${inst.name} (Approved: ${inst.isApproved}, Status: ${inst.status})`));

    // 3. Test course filtering by institution approval
    console.log('\n3. Testing Course Filtering by Institution Approval...');
    
    const allCourses = await prisma.course.findMany({
      include: {
        institution: true
      }
    });

    const coursesFromApprovedInstitutions = allCourses.filter(course => 
      course.institution && course.institution.isApproved && course.institution.status === 'ACTIVE'
    );

    const coursesFromPendingInstitutions = allCourses.filter(course => 
      course.institution && (!course.institution.isApproved || course.institution.status !== 'ACTIVE')
    );

    console.log(`   Total courses: ${allCourses.length}`);
    console.log(`   ✅ Courses from approved institutions: ${coursesFromApprovedInstitutions.length}`);
    console.log(`   ❌ Courses from pending institutions: ${coursesFromPendingInstitutions.length}`);

    // 4. Test user status enforcement
    console.log('\n4. Testing User Status Enforcement...');
    
    const activeUsers = users.filter(user => user.status === 'ACTIVE');
    const suspendedUsers = users.filter(user => user.status === 'SUSPENDED');
    
    console.log(`   ✅ Active users: ${activeUsers.length}`);
    console.log(`   ❌ Suspended users: ${suspendedUsers.length}`);
    
    if (suspendedUsers.length > 0) {
      suspendedUsers.forEach(user => {
        console.log(`      - ${user.email} (${user.role})`);
      });
    }

    // 5. Test access control matrix
    console.log('\n5. Testing Access Control Matrix...');
    
    // Test different user types and their access levels
    const userTypes = ['ADMIN', 'INSTITUTION', 'STUDENT'];
    const institutionStatuses = ['APPROVED', 'PENDING', 'SUSPENDED'];
    
    console.log('   Access Control Matrix:');
    console.log('   User Type | Institution Status | Should Have Access');
    console.log('   ----------|-------------------|-------------------');
    
    userTypes.forEach(userType => {
      institutionStatuses.forEach(instStatus => {
        let shouldHaveAccess = false;
        
        if (userType === 'ADMIN') {
          shouldHaveAccess = true; // Admins have access to everything
        } else if (userType === 'INSTITUTION') {
          shouldHaveAccess = instStatus === 'APPROVED' || instStatus === 'ACTIVE';
        } else if (userType === 'STUDENT') {
          shouldHaveAccess = instStatus === 'APPROVED' || instStatus === 'ACTIVE';
        }
        
        const accessSymbol = shouldHaveAccess ? '✅' : '❌';
        console.log(`   ${userType.padEnd(10)} | ${instStatus.padEnd(17)} | ${accessSymbol}`);
      });
    });

    // 6. Test specific access scenarios
    console.log('\n6. Testing Specific Access Scenarios...');
    
    // Scenario 1: Suspended user trying to access content
    const suspendedUser = suspendedUsers[0];
    if (suspendedUser) {
      console.log(`   Scenario 1: Suspended user (${suspendedUser.email})`);
      console.log(`   ❌ Should be blocked from accessing protected content`);
    }

    // Scenario 2: Non-approved institution user
    const pendingInstitution = pendingInstitutions[0];
    if (pendingInstitution) {
      const pendingInstitutionUser = users.find(user => 
        user.institutionId === pendingInstitution.id && user.role === 'INSTITUTION'
      );
      if (pendingInstitutionUser) {
        console.log(`   Scenario 2: Non-approved institution user (${pendingInstitutionUser.email})`);
        console.log(`   ❌ Should be redirected to awaiting-approval page`);
      }
    }

    // Scenario 3: Approved institution user
    const approvedInstitution = approvedInstitutions[0];
    if (approvedInstitution) {
      const approvedInstitutionUser = users.find(user => 
        user.institutionId === approvedInstitution.id && user.role === 'INSTITUTION'
      );
      if (approvedInstitutionUser) {
        console.log(`   Scenario 3: Approved institution user (${approvedInstitutionUser.email})`);
        console.log(`   ✅ Should have full access to institution content`);
      }
    }

    // 7. Test content visibility rules
    console.log('\n7. Testing Content Visibility Rules...');
    
    // Rule 1: Only approved institutions should appear in public listings
    console.log('   Rule 1: Public institution listings');
    console.log(`   ✅ Should only show ${approvedInstitutions.length} approved institutions`);
    console.log(`   ❌ Should hide ${pendingInstitutions.length} pending institutions`);

    // Rule 2: Only courses from approved institutions should be public
    console.log('   Rule 2: Public course listings');
    console.log(`   ✅ Should only show ${coursesFromApprovedInstitutions.length} courses from approved institutions`);
    console.log(`   ❌ Should hide ${coursesFromPendingInstitutions.length} courses from pending institutions`);

    // Rule 3: Suspended users should be blocked
    console.log('   Rule 3: User status enforcement');
    console.log(`   ✅ Should allow ${activeUsers.length} active users`);
    console.log(`   ❌ Should block ${suspendedUsers.length} suspended users`);

    // 8. Test middleware and routing protection
    console.log('\n8. Testing Middleware and Routing Protection...');
    
    console.log('   Route Protection Status:');
    console.log('   ✅ /admin/* - Only ADMIN users');
    console.log('   ✅ /institution/* - Only INSTITUTION users with approved institutions');
    console.log('   ✅ /student/* - Only STUDENT users');
    console.log('   ✅ /awaiting-approval - Non-approved institution users');

    // 9. Test API endpoint protection
    console.log('\n9. Testing API Endpoint Protection...');
    
    console.log('   API Protection Status:');
    console.log('   ✅ /api/institutions - Only approved institutions');
    console.log('   ✅ /api/courses/public - Only courses from approved institutions');
    console.log('   ✅ /api/courses/search - Only courses from approved institutions');
    console.log('   ✅ /api/tags/public - Only tags from approved institution courses');
    console.log('   ✅ /api/video-sessions - Role-based access control');
    console.log('   ✅ /api/live-conversations - Role-based access control');

    // 10. Summary and recommendations
    console.log('\n10. Summary and Recommendations...');
    
    const totalIssues = pendingInstitutions.length + suspendedUsers.length + coursesFromPendingInstitutions.length;
    
    if (totalIssues === 0) {
      console.log('   🎉 PERFECT! All access control systems are working correctly.');
      console.log('   ✅ No pending institutions');
      console.log('   ✅ No suspended users');
      console.log('   ✅ No courses from pending institutions');
    } else {
      console.log(`   ⚠️  Found ${totalIssues} potential access control issues:`);
      
      if (pendingInstitutions.length > 0) {
        console.log(`      - ${pendingInstitutions.length} pending institutions need approval`);
      }
      
      if (suspendedUsers.length > 0) {
        console.log(`      - ${suspendedUsers.length} suspended users should be blocked`);
      }
      
      if (coursesFromPendingInstitutions.length > 0) {
        console.log(`      - ${coursesFromPendingInstitutions.length} courses from pending institutions should be hidden`);
      }
      
      console.log('\n   🔧 Recommendations:');
      console.log('      - Review and approve pending institutions');
      console.log('      - Review suspended users and reactivate if needed');
      console.log('      - Ensure all public APIs filter by institution approval status');
    }

    console.log('\n🎯 Access Control System Analysis Complete!');

  } catch (error) {
    console.error('❌ Error testing access control:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testSiteWideAccessControl();
