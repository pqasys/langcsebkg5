import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAnnualTiers() {
  try {
    console.log('Creating annual student tiers...');
    
    const annualTiers = [
      {
        planType: 'BASIC',
        name: 'Basic Plan (Annual)',
        description: 'Perfect for beginners starting their language journey - Annual billing',
        price: 124.99, // ~2 months free compared to monthly
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
        name: 'Premium Plan (Annual)',
        description: 'Most popular choice for serious language learners - Annual billing',
        price: 239.99, // ~2 months free compared to monthly
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
        name: 'Pro Plan (Annual)',
        description: 'Complete language learning experience with personal tutoring - Annual billing',
        price: 479.99, // ~2 months free compared to monthly
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

    for (const tier of annualTiers) {
      const existingTier = await prisma.studentTier.findFirst({
        where: {
          planType: tier.planType,
          billingCycle: tier.billingCycle
        }
      });

      if (!existingTier) {
        const createdTier = await prisma.studentTier.create({
          data: tier
        });
        console.log(`✅ Created: ${createdTier.name} (${createdTier.planType} - ${createdTier.billingCycle})`);
      } else {
        console.log(`⏭️  Skipped: ${tier.name} already exists`);
      }
    }

    console.log('🎉 Annual tiers setup complete!');
    
    // Show all current tiers
    console.log('\nCurrent student tiers:');
    const allTiers = await prisma.studentTier.findMany({
      orderBy: [
        { planType: 'asc' },
        { billingCycle: 'asc' }
      ]
    });
    
    allTiers.forEach(tier => {
      console.log(`- ${tier.planType}: ${tier.name} (${tier.billingCycle}) - $${tier.price}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating annual tiers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAnnualTiers(); 