import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndSeedStudentTiers() {
  try {
    console.log('Checking student tiers...');
    
    // Check existing tiers
    const existingTiers = await prisma.studentTier.findMany();
    console.log(`Found ${existingTiers.length} existing student tiers:`);
    existingTiers.forEach(tier => {
      console.log(`- ${tier.planType}: ${tier.name} (${tier.billingCycle})`);
    });

    // Define the tiers we need
    const requiredTiers = [
      {
        planType: 'BASIC',
        name: 'Basic Plan',
        description: 'Perfect for beginners starting their language journey',
        price: 12.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: {
          maxCourses: 5,
          maxLanguages: 5,
          practiceTests: 10,
          progressTracking: true,
          support: 'email',
          basicAccess: true
        },
        maxCourses: 5,
        maxLanguages: 5,
        isActive: true
      },
      {
        planType: 'BASIC',
        name: 'Basic Plan (Annual)',
        description: 'Perfect for beginners starting their language journey',
        price: 124.99,
        currency: 'USD',
        billingCycle: 'ANNUAL',
        features: {
          maxCourses: 5,
          maxLanguages: 5,
          practiceTests: 10,
          progressTracking: true,
          support: 'email',
          basicAccess: true
        },
        maxCourses: 5,
        maxLanguages: 5,
        isActive: true
      },
      {
        planType: 'PREMIUM',
        name: 'Premium Plan',
        description: 'Most popular choice for serious language learners',
        price: 24.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: {
          maxCourses: 20,
          maxLanguages: -1, // Unlimited
          practiceTests: 50,
          progressTracking: true,
          support: 'priority',
          offlineAccess: true,
          certificateDownload: true,
          liveConversations: true,
          aiLearning: true
        },
        maxCourses: 20,
        maxLanguages: -1,
        isActive: true
      },
      {
        planType: 'PREMIUM',
        name: 'Premium Plan (Annual)',
        description: 'Most popular choice for serious language learners',
        price: 239.99,
        currency: 'USD',
        billingCycle: 'ANNUAL',
        features: {
          maxCourses: 20,
          maxLanguages: -1, // Unlimited
          practiceTests: 50,
          progressTracking: true,
          support: 'priority',
          offlineAccess: true,
          certificateDownload: true,
          liveConversations: true,
          aiLearning: true
        },
        maxCourses: 20,
        maxLanguages: -1,
        isActive: true
      },
      {
        planType: 'PRO',
        name: 'Pro Plan',
        description: 'Complete language learning experience with personal tutoring',
        price: 49.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: {
          maxCourses: -1, // Unlimited
          maxLanguages: -1, // Unlimited
          practiceTests: -1, // Unlimited
          progressTracking: true,
          support: 'dedicated',
          offlineAccess: true,
          certificateDownload: true,
          liveConversations: true,
          aiLearning: true,
          oneOnOneTutoring: true,
          personalizedLearning: true,
          groupSessions: true
        },
        maxCourses: -1,
        maxLanguages: -1,
        isActive: true
      },
      {
        planType: 'PRO',
        name: 'Pro Plan (Annual)',
        description: 'Complete language learning experience with personal tutoring',
        price: 479.99,
        currency: 'USD',
        billingCycle: 'ANNUAL',
        features: {
          maxCourses: -1, // Unlimited
          maxLanguages: -1, // Unlimited
          practiceTests: -1, // Unlimited
          progressTracking: true,
          support: 'dedicated',
          offlineAccess: true,
          certificateDownload: true,
          liveConversations: true,
          aiLearning: true,
          oneOnOneTutoring: true,
          personalizedLearning: true,
          groupSessions: true
        },
        maxCourses: -1,
        maxLanguages: -1,
        isActive: true
      }
    ];

    // Check which tiers are missing
    const missingTiers = [];
    for (const requiredTier of requiredTiers) {
      const exists = existingTiers.some(tier => 
        tier.planType === requiredTier.planType && 
        tier.billingCycle === requiredTier.billingCycle
      );
      if (!exists) {
        missingTiers.push(requiredTier);
      }
    }

    if (missingTiers.length === 0) {
      console.log('✅ All required student tiers already exist!');
      return;
    }

    console.log(`\nCreating ${missingTiers.length} missing student tiers...`);

    // Create missing tiers
    for (const tier of missingTiers) {
      const createdTier = await prisma.studentTier.create({
        data: tier
      });
      console.log(`✅ Created: ${createdTier.name} (${createdTier.planType} - ${createdTier.billingCycle})`);
    }

    console.log('\n🎉 Student tiers setup complete!');

  } catch (error) {
    console.error('❌ Error checking/creating student tiers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSeedStudentTiers(); 