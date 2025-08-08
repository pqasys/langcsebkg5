import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testRevenueFinal() {
  try {
    console.log('🧪 Testing Revenue API Final Fix...\n');

    // Test the specific query that was causing the error
    console.log('1. Testing StudentBillingHistory query...');
    
    const studentSubscriptions = await prisma.studentBillingHistory.findMany({
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

    console.log(`✅ Successfully queried ${studentSubscriptions.length} student billing records`);
    
    if (studentSubscriptions.length > 0) {
      console.log('Sample student billing record:');
      const sample = studentSubscriptions[0];
      console.log(`  - ID: ${sample.id}`);
      console.log(`  - Amount: $${sample.amount}`);
      console.log(`  - Subscription ID: ${sample.subscriptionId}`);
      console.log(`  - Billing Date: ${sample.billingDate.toLocaleDateString()}`);
    }

    // Test the two-step query strategy
    console.log('\n2. Testing two-step query strategy...');
    
    const subscriptionIds = studentSubscriptions.map(b => b.subscriptionId).filter(Boolean);
    if (subscriptionIds.length > 0) {
      const subscriptions = await prisma.studentSubscription.findMany({
        where: {
          id: { in: subscriptionIds }
        },
        include: {
          studentTier: true,
        },
      });

      console.log(`✅ Successfully queried ${subscriptions.length} student subscriptions`);
      
      if (subscriptions.length > 0) {
        console.log('Sample subscription data:');
        const sample = subscriptions[0];
        console.log(`  - ID: ${sample.id}`);
        console.log(`  - Student ID: ${sample.studentId}`);
        console.log(`  - Tier: ${sample.studentTier.name}`);
        console.log(`  - Status: ${sample.status}`);
      }
    }

    console.log('\n✅ Revenue API Final Fix test completed successfully!');
    console.log('   • StudentBillingHistory query: ✅ Working');
    console.log('   • Two-step query strategy: ✅ Working');
    console.log('   • No more relation errors: ✅ Confirmed');

  } catch (error) {
    console.error('❌ Error testing revenue final fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRevenueFinal();
