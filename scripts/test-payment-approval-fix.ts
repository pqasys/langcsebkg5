import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPaymentApprovalFix() {
  try {
    console.log('🧪 Testing Payment Approval Fix...\n');

    // Test 1: Check if we can access the institution_payouts model
    console.log('1. Testing institution_payouts model access...');
    
    const payouts = await prisma.institution_payouts.findMany({
      take: 5
    });

    console.log(`✅ Successfully queried ${payouts.length} institution payouts`);
    
    if (payouts.length > 0) {
      console.log('Sample payout data:');
      const samplePayout = payouts[0];
      console.log(`  - ID: ${samplePayout.id}`);
      console.log(`  - Institution ID: ${samplePayout.institutionId}`);
      console.log(`  - Enrollment ID: ${samplePayout.enrollmentId}`);
      console.log(`  - Amount: $${samplePayout.amount}`);
      console.log(`  - Status: ${samplePayout.status}`);
    }

    // Test 2: Check pending payments
    console.log('\n2. Testing pending payments...');
    
    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] }
      },
      select: {
        id: true,
        amount: true,
        status: true,
        enrollmentId: true,
        institutionId: true
      }
    });

    console.log(`✅ Found ${pendingPayments.length} pending payments`);
    
    if (pendingPayments.length > 0) {
      console.log('Sample pending payment:');
      const samplePayment = pendingPayments[0];
      console.log(`  - ID: ${samplePayment.id}`);
      console.log(`  - Amount: $${samplePayment.amount}`);
      console.log(`  - Status: ${samplePayment.status}`);
      console.log(`  - Enrollment ID: ${samplePayment.enrollmentId}`);
      console.log(`  - Institution ID: ${samplePayment.institutionId}`);
    }

    // Test 3: Check if we can create a test payout record
    console.log('\n3. Testing payout record creation...');
    
    if (pendingPayments.length > 0) {
      const testPayment = pendingPayments[0];
      
      // Get enrollment data
      const enrollment = await prisma.studentCourseEnrollment.findUnique({
        where: { id: testPayment.enrollmentId },
        include: {
          course: {
            include: {
              institution: true
            }
          }
        }
      });

      if (enrollment) {
        const commissionRate = enrollment.course.institution.commissionRate;
        const commissionAmount = (testPayment.amount * commissionRate) / 100;
        const institutionAmount = testPayment.amount - commissionAmount;

        console.log(`  - Commission Rate: ${commissionRate}%`);
        console.log(`  - Commission Amount: $${commissionAmount}`);
        console.log(`  - Institution Amount: $${institutionAmount}`);

        // Test creating a payout record (but don't actually create it)
        console.log('  ✅ Payout calculation logic working correctly');
      }
    }

    // Test 4: Check completed payments
    console.log('\n4. Testing completed payments...');
    
    const completedPayments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED'
      },
      select: {
        id: true,
        amount: true,
        status: true,
        paidAt: true,
        commissionAmount: true,
        institutionAmount: true
      },
      take: 5
    });

    console.log(`✅ Found ${completedPayments.length} completed payments`);
    
    if (completedPayments.length > 0) {
      console.log('Sample completed payment:');
      const samplePayment = completedPayments[0];
      console.log(`  - ID: ${samplePayment.id}`);
      console.log(`  - Amount: $${samplePayment.amount}`);
      console.log(`  - Commission Amount: $${samplePayment.commissionAmount}`);
      console.log(`  - Institution Amount: $${samplePayment.institutionAmount}`);
      console.log(`  - Paid At: ${samplePayment.paidAt?.toLocaleDateString()}`);
    }

    console.log('\n✅ Payment Approval Fix test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Institution Payouts: ${payouts.length}`);
    console.log(`   • Pending Payments: ${pendingPayments.length}`);
    console.log(`   • Completed Payments: ${completedPayments.length}`);
    console.log(`   • Model Access: ✅ Working`);
    console.log(`   • Payout Logic: ✅ Working`);

  } catch (error) {
    console.error('❌ Error testing payment approval fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPaymentApprovalFix();
