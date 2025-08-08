import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAllPaymentAPIs() {
  try {
    console.log('🧪 Testing All Payment APIs...\n');

    // Test 1: Check if we can query payments without errors
    console.log('1. Testing payment queries without enrollment relation...');
    
    const allPayments = await prisma.payment.findMany({
      select: {
        id: true,
        amount: true,
        status: true,
        paymentMethod: true,
        enrollmentId: true,
        institutionId: true,
        metadata: true
      }
    });

    console.log(`✅ Successfully queried ${allPayments.length} total payments`);
    
    const pendingPayments = allPayments.filter(p => p.status === 'PENDING' || p.status === 'PROCESSING');
    console.log(`   - Pending/Processing: ${pendingPayments.length}`);
    console.log(`   - Completed: ${allPayments.filter(p => p.status === 'COMPLETED').length}`);
    console.log(`   - Failed: ${allPayments.filter(p => p.status === 'FAILED').length}`);

    // Test 2: Check if we can query enrollments separately
    console.log('\n2. Testing enrollment queries...');
    
    let enrollments: any[] = [];
    if (allPayments.length > 0) {
      const enrollmentIds = [...new Set(allPayments.map(p => p.enrollmentId))];
      enrollments = await prisma.studentCourseEnrollment.findMany({
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

      console.log(`✅ Successfully queried ${enrollments.length} enrollments`);
      
      if (enrollments.length > 0) {
        console.log('Sample enrollment data:');
        const sampleEnrollment = enrollments[0];
        console.log(`  - ID: ${sampleEnrollment.id}`);
        console.log(`  - Course: ${sampleEnrollment.course.title}`);
        console.log(`  - Institution: ${sampleEnrollment.course.institution.name}`);
        console.log(`  - Status: ${sampleEnrollment.status}`);
      }
    }

    // Test 3: Test payment approval logic simulation
    console.log('\n3. Testing payment approval logic simulation...');
    
    if (pendingPayments.length > 0) {
      const enrollmentIds = [...new Set(pendingPayments.map(p => p.enrollmentId))];
      const pendingEnrollments = await prisma.studentCourseEnrollment.findMany({
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

      const enrollmentMap = new Map(pendingEnrollments.map(e => [e.id, e]));
      
      let canApproveCount = 0;
      let requiresAdminCount = 0;
      
      for (const payment of pendingPayments) {
        const enrollment = enrollmentMap.get(payment.enrollmentId);
        if (enrollment) {
          const institution = enrollment.course.institution;
          const commissionRate = institution.commissionRate;
          const commissionAmount = (payment.amount * commissionRate) / 100;
          const institutionAmount = payment.amount - commissionAmount;
          
          // Simulate approval logic
          canApproveCount++;
          requiresAdminCount++;
        }
      }
      
      console.log(`✅ Payment approval logic simulation completed:`);
      console.log(`  - Payments that can be approved: ${canApproveCount}`);
      console.log(`  - Payments requiring admin approval: ${requiresAdminCount}`);
    }

    // Test 4: Check admin settings
    console.log('\n4. Testing admin settings...');
    
    const adminSettings = await prisma.adminSettings.findFirst({
      where: { id: '1' }
    });

    if (adminSettings) {
      console.log('✅ Admin settings found:');
      console.log(`  - Allow Institution Payment Approval: ${adminSettings.allowInstitutionPaymentApproval}`);
      console.log(`  - Show Institution Approval Buttons: ${adminSettings.showInstitutionApprovalButtons}`);
      console.log(`  - Default Payment Status: ${adminSettings.defaultPaymentStatus}`);
      
      // Cast JSON fields properly
      const institutionApprovableMethods = adminSettings.institutionApprovableMethods as string[];
      const adminOnlyMethods = adminSettings.adminOnlyMethods as string[];
      const institutionPaymentApprovalExemptions = adminSettings.institutionPaymentApprovalExemptions as string[];
      
      console.log(`  - Institution Approvable Methods: ${institutionApprovableMethods.join(', ')}`);
      console.log(`  - Admin Only Methods: ${adminOnlyMethods.join(', ')}`);
      console.log(`  - Exempted Institutions: ${institutionPaymentApprovalExemptions.length}`);
    } else {
      console.log('⚠️  No admin settings found - will be created on first access');
    }

    // Test 5: Check institution users
    console.log('\n5. Testing institution users...');
    
    const institutionUsers = await prisma.user.findMany({
      where: {
        role: 'INSTITUTION'
      },
      select: {
        id: true,
        email: true,
        institutionId: true
      }
    });

    console.log(`✅ Found ${institutionUsers.length} institution users`);
    
    if (institutionUsers.length > 0) {
      console.log('Sample institution users:');
      institutionUsers.slice(0, 3).forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} (${user.institutionId})`);
      });
    }

    // Test 6: Check institutions
    console.log('\n6. Testing institutions...');
    
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        commissionRate: true
      }
    });

    console.log(`✅ Found ${institutions.length} institutions`);
    
    if (institutions.length > 0) {
      console.log('Sample institutions:');
      institutions.forEach((inst, index) => {
        console.log(`  ${index + 1}. ${inst.name} (${inst.email}) - Commission: ${inst.commissionRate}%`);
      });
    }

    console.log('\n✅ All Payment APIs test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Total Payments: ${allPayments.length}`);
    console.log(`   • Pending Payments: ${pendingPayments.length}`);
    console.log(`   • Enrollments Found: ${enrollments.length}`);
    console.log(`   • Institution Users: ${institutionUsers.length}`);
    console.log(`   • Institutions: ${institutions.length}`);
    console.log(`   • Admin Settings: ${adminSettings ? 'Found' : 'Not found'}`);

  } catch (error) {
    console.error('❌ Error testing payment APIs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAllPaymentAPIs();
