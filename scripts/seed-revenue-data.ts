import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function seedRevenueData() {
  console.log('🌱 Seeding revenue data...');

  try {
    // Create commission tiers
    const commissionTiers = await Promise.all([
      prisma.commissionTier.upsert({
        where: { planType: 'STARTER' },
        update: {},
        create: {
          id: uuidv4(),
          planType: 'STARTER',
          name: 'Starter Plan',
          description: 'Perfect for small language schools getting started',
          price: 99.00,
          currency: 'USD',
          billingCycle: 'MONTHLY',
          commissionRate: 10.0,
          features: {
            maxStudents: 50,
            maxCourses: 10,
            maxTeachers: 3,
            features: ['Basic Analytics', 'Email Support', 'Standard Templates']
          },
          maxStudents: 50,
          maxCourses: 10,
          maxTeachers: 3,
          isActive: true,
        },
      }),
      prisma.commissionTier.upsert({
        where: { planType: 'PROFESSIONAL' },
        update: {},
        create: {
          id: uuidv4(),
          planType: 'PROFESSIONAL',
          name: 'Professional Plan',
          description: 'Ideal for growing language institutions',
          price: 299.00,
          currency: 'USD',
          billingCycle: 'MONTHLY',
          commissionRate: 8.0,
          features: {
            maxStudents: 200,
            maxCourses: 25,
            maxTeachers: 8,
            features: ['Advanced Analytics', 'Priority Support', 'Custom Templates', 'API Access']
          },
          maxStudents: 200,
          maxCourses: 25,
          maxTeachers: 8,
          isActive: true,
        },
      }),
      prisma.commissionTier.upsert({
        where: { planType: 'ENTERPRISE' },
        update: {},
        create: {
          id: uuidv4(),
          planType: 'ENTERPRISE',
          name: 'Enterprise Plan',
          description: 'For large language institutions with complex needs',
          price: 799.00,
          currency: 'USD',
          billingCycle: 'MONTHLY',
          commissionRate: 5.0,
          features: {
            maxStudents: 1000,
            maxCourses: 100,
            maxTeachers: 25,
            features: ['Enterprise Analytics', '24/7 Support', 'Custom Development', 'White-label Options']
          },
          maxStudents: 1000,
          maxCourses: 100,
          maxTeachers: 25,
          isActive: true,
        },
      }),
    ]);

    console.log('✅ Commission tiers created');

    // Create student tiers
    const studentTiers = await Promise.all([
      prisma.studentTier.upsert({
        where: { planType: 'BASIC' },
        update: {},
        create: {
          id: uuidv4(),
          planType: 'BASIC',
          name: 'Basic Plan',
          description: 'Essential features for individual learners',
          price: 19.99,
          currency: 'USD',
          billingCycle: 'MONTHLY',
          features: {
            maxCourses: 3,
            maxLanguages: 2,
            features: ['Basic Progress Tracking', 'Standard Support']
          },
          maxCourses: 3,
          maxLanguages: 2,
          isActive: true,
        },
      }),
      prisma.studentTier.upsert({
        where: { planType: 'PREMIUM' },
        update: {},
        create: {
          id: uuidv4(),
          planType: 'PREMIUM',
          name: 'Premium Plan',
          description: 'Enhanced features for serious learners',
          price: 39.99,
          currency: 'USD',
          billingCycle: 'MONTHLY',
          features: {
            maxCourses: 10,
            maxLanguages: 5,
            features: ['Advanced Progress Tracking', 'Priority Support', 'Personalized Learning Paths']
          },
          maxCourses: 10,
          maxLanguages: 5,
          isActive: true,
        },
      }),
      prisma.studentTier.upsert({
        where: { planType: 'PRO' },
        update: {},
        create: {
          id: uuidv4(),
          planType: 'PRO',
          name: 'Pro Plan',
          description: 'Complete learning experience for professionals',
          price: 79.99,
          currency: 'USD',
          billingCycle: 'MONTHLY',
          features: {
            maxCourses: 25,
            maxLanguages: 10,
            features: ['Pro Progress Tracking', '24/7 Support', 'Custom Learning Plans', 'Certification']
          },
          maxCourses: 25,
          maxLanguages: 10,
          isActive: true,
        },
      }),
    ]);

    console.log('✅ Student tiers created');

    // Get existing institutions
    const institutions = await prisma.institution.findMany();
    console.log(`Found ${institutions.length} institutions`);

    // Create institution subscriptions
    for (const institution of institutions) {
      const tier = commissionTiers[Math.floor(Math.random() * commissionTiers.length)];
      
      await prisma.institutionSubscription.upsert({
        where: { institutionId: institution.id },
        update: {},
        create: {
          id: uuidv4(),
          institutionId: institution.id,
          commissionTierId: tier.id,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          autoRenew: true,
        },
      });

      // Create billing history for the subscription
      await prisma.institutionBillingHistory.create({
        data: {
          id: uuidv4(),
          subscriptionId: (await prisma.institutionSubscription.findUnique({
            where: { institutionId: institution.id }
          }))!.id,
          billingDate: new Date(),
          amount: tier.price,
          currency: 'USD',
          status: 'PAID',
          paymentMethod: 'CREDIT_CARD',
          transactionId: `txn_${uuidv4().replace(/-/g, '')}`,
          invoiceNumber: `INV-${Date.now()}`,
          description: `Monthly subscription for ${tier.name}`,
        },
      });
    }

    console.log('✅ Institution subscriptions created');

    // Get existing students
    const students = await prisma.student.findMany();
    console.log(`Found ${students.length} students`);

    // Create student subscriptions for some students
    for (let i = 0; i < Math.min(students.length, 10); i++) {
      const student = students[i];
      const tier = studentTiers[Math.floor(Math.random() * studentTiers.length)];
      
      // Create or update subscription for the student (one per student)
      const studentSubscription = await prisma.studentSubscription.upsert({
        where: { studentId: student.id },
        update: {
          studentTierId: tier.id,
          status: 'ACTIVE',
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          autoRenew: true,
        },
        create: {
          id: uuidv4(),
          studentId: student.id,
          studentTierId: tier.id,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          autoRenew: true,
        },
      });

      // Create billing history for the subscription
      await prisma.studentBillingHistory.create({
        data: {
          id: uuidv4(),
          subscriptionId: studentSubscription.id,
          billingDate: new Date(),
          amount: tier.price,
          currency: 'USD',
          status: 'PAID',
          paymentMethod: 'CREDIT_CARD',
          transactionId: `txn_${uuidv4().replace(/-/g, '')}`,
          invoiceNumber: `INV-${Date.now()}`,
          description: `Monthly subscription for ${tier.name}`,
        },
      });
    }

    console.log('✅ Student subscriptions created');

    // Update some payments to have commission amounts
    const payments = await prisma.payment.findMany({
      where: {
        commissionAmount: 0,
      },
      take: 20,
    });

    for (const payment of payments) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          commissionAmount: payment.amount * 0.1, // 10% commission
          institutionAmount: payment.amount * 0.9, // 90% to institution
        },
      });
    }

    console.log('✅ Payment commissions updated');

    console.log('🎉 Revenue data seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding revenue data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedRevenueData()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 