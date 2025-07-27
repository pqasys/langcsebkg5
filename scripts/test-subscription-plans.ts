import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/langcsebkg4a'
    }
  }
});

async function testSubscriptionPlans() {
  console.log('🧪 Testing Subscription Plans Admin Functionality...\n');

  try {
    // Test database connection first
    console.log('0. Testing database connection...');
    await prisma.$connect();
    console.log('   Database connection successful');

    // Test 1: Check if subscription plans exist
    console.log('\n1. Checking existing subscription plans...');
    const plans = await prisma.subscriptionPlan.findMany();
    console.log(`   Found ${plans.length} subscription plans`);
    
    if (plans.length > 0) {
      plans.forEach(plan => {
        console.log(`   - ${plan.name}: $${plan.price} ${plan.currency} (${plan.billingCycle})`);
        console.log(`     Features: ${plan.features.length} items`);
        console.log(`     Limits: ${plan.maxStudents} students, ${plan.maxCourses} courses, ${plan.maxTeachers} teachers`);
        console.log(`     Status: ${plan.isActive ? 'Active' : 'Inactive'}`);
      });
    }

    // Test 2: Create a test subscription plan
    console.log('\n2. Creating test subscription plan...');
    const testPlan = await prisma.subscriptionPlan.create({
      data: {
        name: 'Test Plan',
        description: 'A test subscription plan for testing purposes',
        price: 149.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: [
          'Test feature 1',
          'Test feature 2',
          'Test feature 3'
        ],
        maxStudents: 200,
        maxCourses: 20,
        maxTeachers: 3,
        isActive: true,
      }
    });
    console.log(`   Created test plan: ${testPlan.name} (ID: ${testPlan.id})`);

    // Test 3: Update the test plan
    console.log('\n3. Updating test subscription plan...');
    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { id: testPlan.id },
      data: {
        name: 'Updated Test Plan',
        price: 199.99,
        maxStudents: 300,
        features: [
          'Updated test feature 1',
          'Updated test feature 2',
          'Updated test feature 3',
          'New test feature 4'
        ]
      }
    });
    console.log(`   Updated plan: ${updatedPlan.name} - New price: $${updatedPlan.price}`);

    // Test 4: Toggle plan status
    console.log('\n4. Testing plan status toggle...');
    const deactivatedPlan = await prisma.subscriptionPlan.update({
      where: { id: testPlan.id },
      data: { isActive: false }
    });
    console.log(`   Plan status: ${deactivatedPlan.isActive ? 'Active' : 'Inactive'}`);

    const reactivatedPlan = await prisma.subscriptionPlan.update({
      where: { id: testPlan.id },
      data: { isActive: true }
    });
    console.log(`   Plan status: ${reactivatedPlan.isActive ? 'Active' : 'Inactive'}`);

    // Test 5: Check institution subscriptions
    console.log('\n5. Checking institution subscriptions...');
    const institutionSubscriptions = await prisma.institutionSubscription.findMany({
      include: {
        institution: {
          select: { name: true }
        },
        subscriptionPlan: {
          select: { name: true, price: true }
        }
      }
    });

    console.log(`   Found ${institutionSubscriptions.length} institution subscriptions`);
    institutionSubscriptions.forEach(sub => {
      console.log(`   - ${sub.institution.name}: ${sub.subscriptionPlan?.name || sub.planType} ($${sub.subscriptionPlan?.price || sub.amount})`);
      console.log(`     Status: ${sub.status}, Start: ${sub.startDate.toLocaleDateString()}`);
      if (!sub.subscriptionPlan) {
        console.log(`     Note: No subscription plan linked (using planType: ${sub.planType})`);
      }
    });

    // Test 6: Clean up test data
    console.log('\n6. Cleaning up test data...');
    await prisma.subscriptionPlan.delete({
      where: { id: testPlan.id }
    });
    console.log('   Test plan deleted successfully');

    console.log('\n✅ All subscription plans tests passed!');
    console.log('\n📊 Summary:');
    console.log(`   - Total subscription plans: ${plans.length}`);
    console.log(`   - Total institution subscriptions: ${institutionSubscriptions.length}`);
    console.log('   - CRUD operations: Working');
    console.log('   - Status toggle: Working');
    console.log('   - Database integration: Working');

  } catch (error) {
    logger.error('❌ Test failed:');
    
    if (error instanceof Error) {
      logger.error('Error details:');
      
      // Check if it's a database connection issue
      if (error.message.includes('Unknown database') || error.message.includes('ECONNREFUSED')) {
        console.log('\n💡 Tip: Make sure your database is running and the DATABASE_URL is correct');
        console.log('   You can check your .env file or run: npx prisma db push');
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testSubscriptionPlans(); 