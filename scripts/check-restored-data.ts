import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function checkRestoredData() {
  try {
    console.log('🔍 Checking restored database...\n');

    // Check users
    const userCount = await prisma.user.count();
    console.log(`� Users: ${userCount}`);
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        institutionId: true
      },
      take: 5
    });
    
    console.log('Sample users:');
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.status}`);
    });

    // Check institutions
    const institutionCount = await prisma.institution.count();
    console.log(`\n� Institutions: ${institutionCount}`);

    // Check institution subscriptions
    const institutionSubscriptionCount = await prisma.institutionSubscription.count();
    console.log(` Institution Subscriptions: ${institutionSubscriptionCount}`);

    if (institutionSubscriptionCount > 0) {
      const subscriptions = await prisma.institutionSubscription.findMany({
        include: {
          institution: {
            select: { name: true, email: true }
          }
        },
        take: 3
      });

      console.log('Sample institution subscriptions:');
      subscriptions.forEach(sub => {
        console.log(`  - ${sub.institution.name}: ${sub.planType} (${sub.status}) - $${sub.amount}`);
      });
    }

    // Check billing history
    const billingHistoryCount = await prisma.institutionBillingHistory.count();
    console.log(`\n� Institution Billing History: ${billingHistoryCount}`);

    // Check subscription logs
    const subscriptionLogsCount = await prisma.institutionSubscriptionLog.count();
    console.log(` Institution Subscription Logs: ${subscriptionLogsCount}`);

    // Check students
    const studentCount = await prisma.student.count();
    console.log(`\n� Students: ${studentCount}`);

    // Check student subscriptions
    const studentSubscriptionCount = await prisma.studentSubscription.count();
    console.log(`� Student Subscriptions: ${studentSubscriptionCount}`);

    if (studentSubscriptionCount > 0) {
      const studentSubscriptions = await prisma.studentSubscription.findMany({
        include: {
          student: {
            select: { name: true, email: true }
          }
        },
        take: 3
      });

      console.log('Sample student subscriptions:');
      studentSubscriptions.forEach(sub => {
        console.log(`  - ${sub.student.name}: ${sub.planType} (${sub.status}) - $${sub.amount}`);
      });
    }

    // Check student billing history
    const studentBillingHistoryCount = await prisma.studentBillingHistory.count();
    console.log(`\n� Student Billing History: ${studentBillingHistoryCount}`);

    // Check student subscription logs
    const studentSubscriptionLogsCount = await prisma.subscriptionLog.count();
    console.log(`� Student Subscription Logs: ${studentSubscriptionLogsCount}`);

    // Check commission tiers
    const commissionTierCount = await prisma.commissionTier.count();
    console.log(`\n⚖️ Commission Tiers: ${commissionTierCount}`);

    if (commissionTierCount > 0) {
      const tiers = await prisma.commissionTier.findMany();
      console.log('Commission tiers:');
      tiers.forEach(tier => {
        console.log(`  - ${tier.planType}: ${tier.commissionRate}%`);
      });
    }

    // Check if we need to create commission tiers
    if (commissionTierCount === 0) {
      console.log('\n⚠️ No commission tiers found. Creating default tiers...');
      
      const defaultTiers = [
        { planType: 'STARTER', commissionRate: 25.0 },
        { planType: 'PROFESSIONAL', commissionRate: 15.0 },
        { planType: 'ENTERPRISE', commissionRate: 10.0 }
      ];

      for (const tier of defaultTiers) {
        await prisma.commissionTier.create({
          data: {
            planType: tier.planType,
            commissionRate: tier.commissionRate,
            features: {},
            isActive: true
          }
        });
      }
      console.log('✅ Default commission tiers created');
    }

    console.log('\n🎉 Database check completed!');
    console.log('\nThe enhanced subscription management system is ready to use.');
    console.log('You can now test:');
    console.log('- Subscription upgrades/downgrades');
    console.log('- Cancellation workflows');
    console.log('- Billing history viewing');
    console.log('- Activity logs');
    console.log('- Enhanced UI components');

  } catch (error) {
    logger.error('Error checking restored data:');
  } finally {
    await prisma.$disconnect();
  }
}

checkRestoredData(); 