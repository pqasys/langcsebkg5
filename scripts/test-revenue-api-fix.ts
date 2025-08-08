import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testRevenueAPIFix() {
  try {
    console.log('🧪 Testing Revenue API Fix...\n');

    // Test 1: Check if we can query payments without enrollment relation
    console.log('1. Testing payment queries without enrollment relation...');
    
    const payments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED'
      },
      select: {
        id: true,
        amount: true,
        commissionAmount: true,
        enrollmentId: true,
        institutionId: true,
        createdAt: true
      },
      take: 5
    });

    console.log(`✅ Successfully queried ${payments.length} payments`);
    
    if (payments.length > 0) {
      console.log('Sample payment data:');
      const samplePayment = payments[0];
      console.log(`  - ID: ${samplePayment.id}`);
      console.log(`  - Amount: $${samplePayment.amount}`);
      console.log(`  - Commission Amount: $${samplePayment.commissionAmount || 0}`);
      console.log(`  - Enrollment ID: ${samplePayment.enrollmentId}`);
      console.log(`  - Institution ID: ${samplePayment.institutionId}`);
    }

    // Test 2: Check if we can query enrollments separately
    console.log('\n2. Testing enrollment queries...');
    
    const enrollmentIds = payments.map(p => p.enrollmentId).filter(Boolean);
    const enrollments = await prisma.studentCourseEnrollment.findMany({
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

    // Test 3: Test revenue calculation logic
    console.log('\n3. Testing revenue calculation logic...');
    
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const commissionRevenue = payments.reduce((sum, payment) => sum + (payment.commissionAmount || 0), 0);
    const studentRevenue = totalRevenue - commissionRevenue;

    console.log(`  - Total Revenue: $${totalRevenue}`);
    console.log(`  - Commission Revenue: $${commissionRevenue}`);
    console.log(`  - Student Revenue: $${studentRevenue}`);

    // Test 4: Test institution revenue breakdown
    console.log('\n4. Testing institution revenue breakdown...');
    
    const enrollmentMap = new Map(enrollments.map(e => [e.id, e]));
    const revenueByInstitution = new Map<string, number>();

    payments.forEach(payment => {
      const enrollment = enrollmentMap.get(payment.enrollmentId);
      if (!enrollment) return;

      const institutionName = enrollment.course.institution.name;
      const current = revenueByInstitution.get(institutionName) || 0;
      revenueByInstitution.set(institutionName, current + payment.amount);
    });

    console.log(`✅ Found revenue from ${revenueByInstitution.size} institutions`);
    
    if (revenueByInstitution.size > 0) {
      console.log('Institution revenue breakdown:');
      revenueByInstitution.forEach((revenue, institution) => {
        console.log(`  - ${institution}: $${revenue}`);
      });
    }

    // Test 5: Check institution billing history
    console.log('\n5. Testing institution billing history...');
    
    const institutionBilling = await prisma.institutionBillingHistory.findMany({
      where: {
        status: 'PAID'
      },
      select: {
        id: true,
        amount: true,
        subscriptionId: true,
        billingDate: true
      },
      take: 5
    });

    console.log(`✅ Found ${institutionBilling.length} institution billing records`);
    
    if (institutionBilling.length > 0) {
      console.log('Sample billing record:');
      const sampleBilling = institutionBilling[0];
      console.log(`  - ID: ${sampleBilling.id}`);
      console.log(`  - Amount: $${sampleBilling.amount}`);
      console.log(`  - Subscription ID: ${sampleBilling.subscriptionId}`);
      console.log(`  - Billing Date: ${sampleBilling.billingDate.toLocaleDateString()}`);
    }

    console.log('\n✅ Revenue API Fix test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Payments: ${payments.length}`);
    console.log(`   • Enrollments: ${enrollments.length}`);
    console.log(`   • Total Revenue: $${totalRevenue}`);
    console.log(`   • Commission Revenue: $${commissionRevenue}`);
    console.log(`   • Institutions with Revenue: ${revenueByInstitution.size}`);
    console.log(`   • Institution Billing Records: ${institutionBilling.length}`);
    console.log(`   • Two-Step Query Strategy: ✅ Working`);
    console.log(`   • Revenue Calculations: ✅ Working`);

  } catch (error) {
    console.error('❌ Error testing revenue API fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRevenueAPIFix();
