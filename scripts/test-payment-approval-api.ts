import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPaymentApprovalAPI() {
  try {
    console.log('🧪 Testing Payment Approval Settings API...\n');

    // Test 1: Check if we can query payments without errors
    console.log('1. Testing payment query without enrollment relation...');
    
    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] }
      },
      select: {
        id: true,
        amount: true,
        status: true,
        paymentMethod: true,
        enrollmentId: true,
        institutionId: true
      }
    });

    console.log(`✅ Successfully queried ${pendingPayments.length} pending payments`);
    
    if (pendingPayments.length > 0) {
      console.log('Sample payment data:');
      const samplePayment = pendingPayments[0];
      console.log(`  - ID: ${samplePayment.id}`);
      console.log(`  - Amount: $${samplePayment.amount}`);
      console.log(`  - Status: ${samplePayment.status}`);
      console.log(`  - Payment Method: ${samplePayment.paymentMethod || 'Not specified'}`);
      console.log(`  - Enrollment ID: ${samplePayment.enrollmentId}`);
      console.log(`  - Institution ID: ${samplePayment.institutionId}`);
    }

    // Test 2: Check if we can query enrollments separately
    console.log('\n2. Testing enrollment query...');
    
    let enrollments: any[] = [];
    if (pendingPayments.length > 0) {
      const enrollmentIds = pendingPayments.map(p => p.enrollmentId);
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

    // Test 3: Check admin settings
    console.log('\n3. Testing admin settings query...');
    
    const adminSettings = await prisma.adminSettings.findFirst({
      where: { id: '1' }
    });

    if (adminSettings) {
      console.log('✅ Admin settings found:');
      console.log(`  - Allow Institution Payment Approval: ${adminSettings.allowInstitutionPaymentApproval}`);
      console.log(`  - Show Institution Approval Buttons: ${adminSettings.showInstitutionApprovalButtons}`);
      console.log(`  - Default Payment Status: ${adminSettings.defaultPaymentStatus}`);
      console.log(`  - Institution Approvable Methods: ${adminSettings.institutionApprovableMethods.join(', ')}`);
      console.log(`  - Admin Only Methods: ${adminSettings.adminOnlyMethods.join(', ')}`);
      console.log(`  - Exempted Institutions: ${adminSettings.institutionPaymentApprovalExemptions.length}`);
    } else {
      console.log('⚠️  No admin settings found - will be created on first access');
    }

    // Test 4: Simulate the payment approval logic
    console.log('\n4. Testing payment approval logic...');
    
    if (pendingPayments.length > 0 && enrollments.length > 0) {
      const enrollmentMap = new Map(enrollments.map(e => [e.id, e]));
      
      let approvableCount = 0;
      let adminOnlyCount = 0;
      
      for (const payment of pendingPayments) {
        const enrollment = enrollmentMap.get(payment.enrollmentId);
        if (enrollment) {
          const institution = enrollment.course.institution;
          const isExempted = adminSettings?.institutionPaymentApprovalExemptions.includes(institution.id) || false;
          const canApprove = adminSettings?.allowInstitutionPaymentApproval && 
                            !isExempted && 
                            (!payment.paymentMethod || 
                             adminSettings.institutionApprovableMethods.includes(payment.paymentMethod));
          
          if (canApprove) {
            approvableCount++;
          } else {
            adminOnlyCount++;
          }
        }
      }
      
      console.log(`✅ Payment approval analysis completed:`);
      console.log(`  - Institution Approvable: ${approvableCount}`);
      console.log(`  - Admin Only: ${adminOnlyCount}`);
    }

    console.log('\n✅ Payment Approval Settings API test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Pending Payments: ${pendingPayments.length}`);
    console.log(`   • Enrollments Found: ${enrollments.length}`);
    console.log(`   • Admin Settings: ${adminSettings ? 'Found' : 'Not found'}`);

  } catch (error) {
    console.error('❌ Error testing payment approval API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPaymentApprovalAPI();
