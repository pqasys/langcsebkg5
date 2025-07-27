import { PrismaClient } from '@prisma/client';
import { SubscriptionCommissionService } from '../lib/subscription-commission-service';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testFallbackSystem() {
  try {
    console.log('🧪 Testing Fallback Subscription System...\n');

    // 1. Test fallback plan definitions
    console.log('1. Testing fallback plan definitions...');
    
    const studentFallback = SubscriptionCommissionService.getStudentFallbackPlan();
    console.log('Student Fallback Plan:', {
      planType: studentFallback.planType,
      price: studentFallback.monthlyPrice,
      features: studentFallback.features
    });

    const institutionFallback = SubscriptionCommissionService.getInstitutionFallbackPlan();
    console.log('Institution Fallback Plan:', {
      planType: institutionFallback.planType,
      price: institutionFallback.monthlyPrice,
      features: institutionFallback.features
    });

    // 2. Create test expired trials
    console.log('\n2. Creating test expired trials...');
    
    // Find a student to create expired trial for
    const testStudent = await prisma.student.findFirst({
      include: { subscriptions: true }
    });

    if (testStudent) {
      // Create an expired trial subscription
      const expiredTrial = await prisma.studentSubscription.create({
        data: {
          studentId: testStudent.id,
          planType: 'PREMIUM',
          status: 'TRIAL',
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (expired)
          billingCycle: 'MONTHLY',
          amount: 24.99,
          currency: 'USD',
          features: {
            maxCourses: 20,
            practiceTests: 50,
            progressTracking: true,
            support: 'priority'
          },
          autoRenew: true,
          metadata: { isTrial: true, trialEndDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
        }
      });
      console.log(` Created expired trial for student: ${testStudent.name} (${expiredTrial.id})`);
    }

    // Find an institution to create expired trial for
    const testInstitution = await prisma.institution.findFirst({
      include: { subscription: true }
    });

    if (testInstitution) {
      // Create an expired trial subscription
      const expiredTrial = await prisma.institutionSubscription.create({
        data: {
          institutionId: testInstitution.id,
          planType: 'PROFESSIONAL',
          status: 'TRIAL',
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (expired)
          billingCycle: 'MONTHLY',
          amount: 299,
          currency: 'USD',
          features: {
            maxStudents: 500,
            maxCourses: 50,
            commissionRate: 15,
            analytics: 'advanced',
            support: 'priority'
          },
          autoRenew: true,
          metadata: { isTrial: true, trialEndDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
        }
      });
      console.log(` Created expired trial for institution: ${testInstitution.name} (${expiredTrial.id})`);
    }

    // 3. Test fallback processing
    console.log('\n3. Testing fallback processing...');
    
    const results = await SubscriptionCommissionService.processExpiredTrials();
    console.log('Fallback processing results:', results);

    // 4. Verify fallback subscriptions were created
    console.log('\n4. Verifying fallback subscriptions...');
    
    if (testStudent) {
      const studentSubscriptions = await prisma.studentSubscription.findMany({
        where: { studentId: testStudent.id },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log(`Student subscriptions for ${testStudent.name}:`);
      studentSubscriptions.forEach(sub => {
        console.log(`  - ${sub.planType} (${sub.status}): $${sub.amount} - ${sub.metadata?.isFallback ? 'FALLBACK' : 'REGULAR'}`);
      });
    }

    if (testInstitution) {
      const institutionSubscriptions = await prisma.institutionSubscription.findMany({
        where: { institutionId: testInstitution.id },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log(`Institution subscriptions for ${testInstitution.name}:`);
      institutionSubscriptions.forEach(sub => {
        console.log(`  - ${sub.planType} (${sub.status}): $${sub.amount} - ${sub.metadata?.isFallback ? 'FALLBACK' : 'REGULAR'}`);
      });

      // Check commission rate
      const updatedInstitution = await prisma.institution.findUnique({
        where: { id: testInstitution.id }
      });
      console.log(`Updated commission rate: ${updatedInstitution?.commissionRate}%`);
    }

    // 5. Test subscription status methods
    console.log('\n5. Testing subscription status methods...');
    
    if (testStudent) {
      const studentStatus = await SubscriptionCommissionService.getStudentSubscriptionStatus(testStudent.id);
      console.log('Student subscription status:', {
        hasActiveSubscription: studentStatus.hasActiveSubscription,
        currentPlan: studentStatus.currentPlan,
        isFallback: studentStatus.isFallback,
        canUpgrade: studentStatus.canUpgrade,
        canDowngrade: studentStatus.canDowngrade,
        canCancel: studentStatus.canCancel
      });
    }

    if (testInstitution) {
      const institutionStatus = await SubscriptionCommissionService.getSubscriptionStatus(testInstitution.id);
      console.log('Institution subscription status:', {
        hasActiveSubscription: institutionStatus.hasActiveSubscription,
        currentPlan: institutionStatus.currentPlan,
        commissionRate: institutionStatus.commissionRate,
        isFallback: institutionStatus.isFallback,
        canUpgrade: institutionStatus.canUpgrade,
        canDowngrade: institutionStatus.canDowngrade,
        canCancel: institutionStatus.canCancel
      });
    }

    // 6. Check subscription logs
    console.log('\n6. Checking subscription logs...');
    
    const recentLogs = await prisma.subscriptionLog.findMany({
      where: { action: 'FALLBACK_CREATED' },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`Found ${recentLogs.length} fallback creation logs:`);
    recentLogs.forEach(log => {
      console.log(`  - ${log.oldPlan} → ${log.newPlan}: ${log.reason}`);
    });

    const institutionLogs = await prisma.institutionSubscriptionLog.findMany({
      where: { action: 'FALLBACK_CREATED' },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`Found ${institutionLogs.length} institution fallback creation logs:`);
    institutionLogs.forEach(log => {
      console.log(`  - ${log.oldPlan} → ${log.newPlan}: ${log.reason}`);
    });

    console.log('\n✅ Fallback system test completed successfully!');

  } catch (error) {
    logger.error('❌ Error testing fallback system:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testFallbackSystem(); 