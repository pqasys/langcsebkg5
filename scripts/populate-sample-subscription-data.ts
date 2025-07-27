import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function populateSampleData() {
  try {
    console.log('🚀 Populating sample subscription data...\n');

    // Get existing institutions and students
    const institutions = await prisma.institution.findMany();
    const students = await prisma.student.findMany();

    if (institutions.length === 0) {
      console.log('⚠️ No institutions found. Skipping institution subscription data.');
    } else {
      console.log(`� Found ${institutions.length} institutions. Adding sample data...`);
      
      for (const institution of institutions) {
        // Add billing history for existing subscriptions
        const subscription = await prisma.institutionSubscription.findFirst({
          where: { institutionId: institution.id }
        });

        if (subscription) {
          // Add billing history
          await prisma.institutionBillingHistory.createMany({
            data: [
              {
                subscriptionId: subscription.id,
                amount: subscription.amount,
                currency: 'USD',
                status: 'PAID',
                billingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                paymentMethod: 'CREDIT_CARD',
                transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                description: `Monthly subscription payment for ${subscription.planType} plan`
              },
              {
                subscriptionId: subscription.id,
                amount: subscription.amount,
                currency: 'USD',
                status: 'PAID',
                billingDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
                paymentMethod: 'CREDIT_CARD',
                transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                description: `Monthly subscription payment for ${subscription.planType} plan`
              }
            ]
          });

          // Add subscription logs
          await prisma.institutionSubscriptionLog.createMany({
            data: [
              {
                subscriptionId: subscription.id,
                action: 'SUBSCRIPTION_CREATED',
                oldPlan: null,
                newPlan: subscription.planType,
                oldAmount: null,
                newAmount: subscription.amount,
                userId: 'SYSTEM',
                reason: `Initial subscription created with ${subscription.planType} plan`
              },
              {
                subscriptionId: subscription.id,
                action: 'PAYMENT_PROCESSED',
                oldPlan: subscription.planType,
                newPlan: subscription.planType,
                oldAmount: subscription.amount,
                newAmount: subscription.amount,
                userId: 'SYSTEM',
                reason: `Payment processed for ${subscription.amount} USD`
              }
            ]
          });

          console.log(`   Added billing history and logs for ${institution.name}`);
        }
      }
    }

    if (students.length === 0) {
      console.log('⚠️ No students found. Skipping student subscription data.');
    } else {
      console.log(`� Found ${students.length} students. Adding sample data...`);
      
      for (const student of students) {
        // Create sample student subscriptions
        const subscription = await prisma.studentSubscription.create({
          data: {
            studentId: student.id,
            planType: 'BASIC',
            status: 'ACTIVE',
            amount: 12.99,
            currency: 'USD',
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            autoRenew: true
          }
        });

        // Add billing history
        await prisma.studentBillingHistory.create({
          data: {
            subscriptionId: subscription.id,
            amount: subscription.amount,
            currency: 'USD',
            status: 'PAID',
            billingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            paymentMethod: 'CREDIT_CARD',
            transactionId: `STU_TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            description: `Monthly subscription payment for ${subscription.planType} plan`
          }
        });

        // Add subscription logs
        await prisma.subscriptionLog.create({
          data: {
            subscriptionId: subscription.id,
            action: 'SUBSCRIPTION_CREATED',
            oldPlan: null,
            newPlan: subscription.planType,
            oldAmount: null,
            newAmount: subscription.amount,
            userId: 'SYSTEM',
            reason: `Student subscription created with ${subscription.planType} plan`
          }
        });

        console.log(`   Created subscription for ${student.name} (${subscription.planType})`);
      }
    }

    console.log('\n🎉 Sample data population completed!');
    console.log('\nYou can now test:');
    console.log('- View billing history in subscription cards');
    console.log('- See activity logs');
    console.log('- Test upgrade/downgrade flows');
    console.log('- Test cancellation workflows');

  } catch (error) {
    logger.error('Error populating sample data:');
  } finally {
    await prisma.$disconnect();
  }
}

populateSampleData(); 