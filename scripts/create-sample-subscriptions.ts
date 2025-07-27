import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function createSampleSubscriptions() {
  try {
    console.log('Creating sample subscription data...');

    // Get the institution user
    const institutionUser = await prisma.user.findUnique({
      where: { email: 'institution@example.com' },
      include: { institution: true }
    });

    if (!institutionUser?.institution) {
      console.log('Institution user not found, creating one...');
      return;
    }

    // Create commission tiers
    const commissionTiers = [
      { planType: 'STARTER', commissionRate: 25.0 },
      { planType: 'PROFESSIONAL', commissionRate: 15.0 },
      { planType: 'ENTERPRISE', commissionRate: 10.0 }
    ];

    for (const tier of commissionTiers) {
      await prisma.commissionTier.upsert({
        where: { planType: tier.planType },
        update: { commissionRate: tier.commissionRate },
        create: {
          planType: tier.planType,
          commissionRate: tier.commissionRate,
          features: {},
          isActive: true
        }
      });
    }

    console.log('✅ Commission tiers created');

    // Create institution subscription
    const institutionSubscription = await prisma.institutionSubscription.upsert({
      where: { institutionId: institutionUser.institution.id },
      update: {},
      create: {
        institutionId: institutionUser.institution.id,
        planType: 'PROFESSIONAL',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        billingCycle: 'MONTHLY',
        amount: 399,
        currency: 'USD',
        features: {
          maxStudents: 500,
          maxCourses: 50,
          commissionRate: 15,
          analytics: 'advanced',
          support: 'priority',
          customBranding: true
        },
        autoRenew: true
      }
    });

    console.log('✅ Institution subscription created');

    // Create billing history for institution
    await prisma.institutionBillingHistory.createMany({
      data: [
        {
          subscriptionId: institutionSubscription.id,
          billingDate: new Date(),
          amount: 399,
          currency: 'USD',
          status: 'PAID',
          paymentMethod: 'STRIPE',
          transactionId: 'txn_123456789',
          invoiceNumber: 'INV-001',
          description: 'Initial payment for Professional plan'
        },
        {
          subscriptionId: institutionSubscription.id,
          billingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          amount: 399,
          currency: 'USD',
          status: 'PAID',
          paymentMethod: 'STRIPE',
          transactionId: 'txn_123456788',
          invoiceNumber: 'INV-002',
          description: 'Monthly payment for Professional plan'
        }
      ]
    });

    console.log('✅ Institution billing history created');

    // Create subscription logs for institution
    await prisma.institutionSubscriptionLog.createMany({
      data: [
        {
          subscriptionId: institutionSubscription.id,
          action: 'CREATE',
          newPlan: 'PROFESSIONAL',
          newAmount: 399,
          newBillingCycle: 'MONTHLY',
          userId: institutionUser.id,
          reason: 'Initial subscription setup'
        },
        {
          subscriptionId: institutionSubscription.id,
          action: 'UPGRADE',
          oldPlan: 'STARTER',
          newPlan: 'PROFESSIONAL',
          oldAmount: 129,
          newAmount: 399,
          oldBillingCycle: 'MONTHLY',
          newBillingCycle: 'MONTHLY',
          userId: institutionUser.id,
          reason: 'Upgraded for better features'
        }
      ]
    });

    console.log('✅ Institution subscription logs created');

    // Get the student user
    const studentUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (studentUser) {
      // Create student
      const student = await prisma.student.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
          name: 'Test Student',
          email: 'test@example.com',
          status: 'active'
        }
      });

      // Create student subscription
      const studentSubscription = await prisma.studentSubscription.create({
        data: {
          studentId: student.id,
          planType: 'PREMIUM',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          billingCycle: 'MONTHLY',
          amount: 24.99,
          currency: 'USD',
          features: {
            maxCourses: 20,
            practiceTests: 50,
            progressTracking: true,
            support: 'priority',
            offlineAccess: true,
            certificateDownload: true
          },
          autoRenew: true
        }
      });

      console.log('✅ Student subscription created');

      // Create student billing history
      await prisma.studentBillingHistory.createMany({
        data: [
          {
            subscriptionId: studentSubscription.id,
            billingDate: new Date(),
            amount: 24.99,
            currency: 'USD',
            status: 'PAID',
            paymentMethod: 'STRIPE',
            transactionId: 'stu_txn_123456789',
            invoiceNumber: 'STU-INV-001',
            description: 'Initial payment for Premium plan'
          }
        ]
      });

      console.log('✅ Student billing history created');

      // Create student subscription logs
      await prisma.subscriptionLog.createMany({
        data: [
          {
            subscriptionId: studentSubscription.id,
            action: 'CREATE',
            newPlan: 'PREMIUM',
            newAmount: 24.99,
            newBillingCycle: 'MONTHLY',
            userId: studentUser.id,
            reason: 'Initial subscription setup'
          }
        ]
      });

      console.log('✅ Student subscription logs created');
    }

    console.log('\n🎉 Sample subscription data created successfully!');
    console.log('\nTest Credentials:');
    console.log('Institution: institution@example.com / password123');
    console.log('Student: test@example.com / password123');
    console.log('Admin: admin@example.com / password123');

  } catch (error) {
    logger.error('Error creating sample subscriptions:');
  } finally {
    await prisma.$disconnect();
  }
}

createSampleSubscriptions(); 