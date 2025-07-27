import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testSubscriptionFlow() {
  try {
    console.log('🧪 Testing subscription flow...\n');

    // 1. Check commission tiers
    console.log('1. Checking commission tiers...');
    const commissionTiers = await prisma.commissionTier.findMany();
    console.log(`Found ${commissionTiers.length} commission tiers:`);
    commissionTiers.forEach(tier => {
      console.log(`  - ${tier.planType}: ${tier.commissionRate}%`);
    });

    // 2. Check existing subscriptions
    console.log('\n2. Checking existing subscriptions...');
    const institutionSubscriptions = await prisma.institutionSubscription.findMany({
      include: { institution: true }
    });
    console.log(`Found ${institutionSubscriptions.length} institution subscriptions:`);
    institutionSubscriptions.forEach(sub => {
      console.log(`  - ${sub.institution.name}: ${sub.planType} (${sub.status}) - $${sub.amount}/${sub.billingCycle.toLowerCase()}`);
    });

    const studentSubscriptions = await prisma.studentSubscription.findMany({
      include: { student: true }
    });
    console.log(`Found ${studentSubscriptions.length} student subscriptions:`);
    studentSubscriptions.forEach(sub => {
      console.log(`  - ${sub.student.userId}: ${sub.planType} (${sub.status}) - $${sub.amount}/${sub.billingCycle.toLowerCase()}`);
    });

    // 3. Check billing history
    console.log('\n3. Checking billing history...');
    const institutionBilling = await prisma.institutionBillingHistory.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log(`Found ${institutionBilling.length} recent institution billing records:`);
    institutionBilling.forEach(bill => {
      console.log(`  - ${bill.invoiceNumber}: $${bill.amount} (${bill.status}) - ${bill.description}`);
    });

    const studentBilling = await prisma.studentBillingHistory.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log(`Found ${studentBilling.length} recent student billing records:`);
    studentBilling.forEach(bill => {
      console.log(`  - ${bill.invoiceNumber}: $${bill.amount} (${bill.status}) - ${bill.description}`);
    });

    // 4. Check subscription logs
    console.log('\n4. Checking subscription logs...');
    const institutionLogs = await prisma.institutionSubscriptionLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log(`Found ${institutionLogs.length} recent institution subscription logs:`);
    institutionLogs.forEach(log => {
      console.log(`  - ${log.action}: ${log.oldPlan || 'N/A'} → ${log.newPlan || 'N/A'} (${log.reason})`);
    });

    const studentLogs = await prisma.subscriptionLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log(`Found ${studentLogs.length} recent student subscription logs:`);
    studentLogs.forEach(log => {
      console.log(`  - ${log.action}: ${log.oldPlan || 'N/A'} → ${log.newPlan || 'N/A'} (${log.reason})`);
    });

    // 5. Test trial expiration logic
    console.log('\n5. Testing trial expiration logic...');
    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(trialEndDate.getDate() + 14);

    console.log(`Current time: ${now.toISOString()}`);
    console.log(`Trial end date: ${trialEndDate.toISOString()}`);
    console.log(`Trial expired: ${trialEndDate <= now}`);

    // 6. Check institutions without subscriptions
    console.log('\n6. Checking institutions without subscriptions...');
    const institutionsWithoutSubs = await prisma.institution.findMany({
      where: {
        subscription: null
      },
      select: {
        id: true,
        name: true,
        createdAt: true
      }
    });
    console.log(`Found ${institutionsWithoutSubs.length} institutions without subscriptions:`);
    institutionsWithoutSubs.forEach(inst => {
      console.log(`  - ${inst.name} (${inst.id}) - Created: ${inst.createdAt.toISOString()}`);
    });

    // 7. Check students without subscriptions
    console.log('\n7. Checking students without subscriptions...');
    const studentsWithoutSubs = await prisma.student.findMany({
      where: {
        subscriptions: {
          none: {}
        }
      },
      select: {
        id: true,
        userId: true,
        created_at: true
      }
    });
    console.log(`Found ${studentsWithoutSubs.length} students without subscriptions:`);
    studentsWithoutSubs.forEach(student => {
      console.log(`  - ${student.userId} (${student.id}) - Created: ${student.created_at?.toISOString() || 'N/A'}`);
    });

    console.log('\n✅ Subscription flow test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Commission tiers: ${commissionTiers.length}`);
    console.log(`- Institution subscriptions: ${institutionSubscriptions.length}`);
    console.log(`- Student subscriptions: ${studentSubscriptions.length}`);
    console.log(`- Institutions without subs: ${institutionsWithoutSubs.length}`);
    console.log(`- Students without subs: ${studentsWithoutSubs.length}`);

  } catch (error) {
    logger.error('❌ Error testing subscription flow:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testSubscriptionFlow(); 