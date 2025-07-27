import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function setupSubscriptionCommissionSystem() {
  console.log('🚀 Setting up subscription-based commission system...');

  try {
    // 1. Create default commission tiers
    console.log('📊 Creating default commission tiers...');
    
    const commissionTiers = [
      {
        planType: 'STARTER',
        commissionRate: 25.0, // 25% commission for basic plan
        features: {
          maxStudents: 100,
          maxCourses: 10,
          basicAnalytics: true,
          emailSupport: true,
          customBranding: false,
          apiAccess: false,
          whiteLabel: false,
          prioritySupport: false,
          advancedAnalytics: false,
          marketingTools: false
        },
        isActive: true
      },
      {
        planType: 'PROFESSIONAL',
        commissionRate: 15.0, // 15% commission for professional plan
        features: {
          maxStudents: 500,
          maxCourses: 50,
          basicAnalytics: true,
          emailSupport: true,
          customBranding: true,
          apiAccess: false,
          whiteLabel: false,
          prioritySupport: true,
          advancedAnalytics: true,
          marketingTools: true
        },
        isActive: true
      },
      {
        planType: 'ENTERPRISE',
        commissionRate: 10.0, // 10% commission for enterprise plan
        features: {
          maxStudents: -1, // Unlimited
          maxCourses: -1, // Unlimited
          basicAnalytics: true,
          emailSupport: true,
          customBranding: true,
          apiAccess: true,
          whiteLabel: true,
          prioritySupport: true,
          advancedAnalytics: true,
          marketingTools: true,
          dedicatedAccountManager: true,
          customIntegrations: true,
          advancedSecurity: true,
          multiLocationSupport: true,
          customReporting: true
        },
        isActive: true
      }
    ];

    for (const tier of commissionTiers) {
      await prisma.commissionTier.upsert({
        where: { planType: tier.planType },
        update: {
          commissionRate: tier.commissionRate,
          features: tier.features,
          isActive: tier.isActive,
          updatedAt: new Date()
        },
        create: {
          planType: tier.planType,
          commissionRate: tier.commissionRate,
          features: tier.features,
          isActive: tier.isActive
        }
      });
      console.log(` Created/updated ${tier.planType} tier with ${tier.commissionRate}% commission`);
    }

    // 2. Create default subscription plans pricing
    console.log('💰 Setting up default subscription pricing...');
    
    const subscriptionPlans = [
      {
        planType: 'STARTER',
        monthlyPrice: 99,
        annualPrice: 990, // 10% discount
        features: {
          maxStudents: 100,
          maxCourses: 10,
          basicAnalytics: true,
          emailSupport: true,
          customBranding: false,
          apiAccess: false,
          whiteLabel: false,
          prioritySupport: false,
          advancedAnalytics: false,
          marketingTools: false
        }
      },
      {
        planType: 'PROFESSIONAL',
        monthlyPrice: 299,
        annualPrice: 2990, // 10% discount
        features: {
          maxStudents: 500,
          maxCourses: 50,
          basicAnalytics: true,
          emailSupport: true,
          customBranding: true,
          apiAccess: false,
          whiteLabel: false,
          prioritySupport: true,
          advancedAnalytics: true,
          marketingTools: true
        }
      },
      {
        planType: 'ENTERPRISE',
        monthlyPrice: 999,
        annualPrice: 9990, // 10% discount
        features: {
          maxStudents: -1, // Unlimited
          maxCourses: -1, // Unlimited
          basicAnalytics: true,
          emailSupport: true,
          customBranding: true,
          apiAccess: true,
          whiteLabel: true,
          prioritySupport: true,
          advancedAnalytics: true,
          marketingTools: true,
          dedicatedAccountManager: true,
          customIntegrations: true,
          advancedSecurity: true,
          multiLocationSupport: true,
          customReporting: true
        }
      }
    ];

    // Store subscription plans in a configuration table or environment
    console.log('📋 Subscription plans configured:');
    subscriptionPlans.forEach(plan => {
      console.log(`  ${plan.planType}: $${plan.monthlyPrice}/month or $${plan.annualPrice}/year`);
    });

    // 3. Update existing institutions to have default subscription
    console.log('🏢 Updating existing institutions...');
    
    const institutions = await prisma.institution.findMany({
      where: {
        subscription: null
      }
    });

    console.log(`Found ${institutions.length} institutions without subscriptions`);

    for (const institution of institutions) {
      // Create default STARTER subscription for existing institutions
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from now

      await prisma.institutionSubscription.create({
        data: {
          institutionId: institution.id,
          planType: 'STARTER',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: endDate,
          billingCycle: 'MONTHLY',
          amount: 99,
          currency: 'USD',
          features: subscriptionPlans[0].features,
          metadata: {
            autoCreated: true,
            originalCommissionRate: institution.commissionRate
          }
        }
      });

      // Update institution's commission rate to match subscription tier
      const starterTier = await prisma.commissionTier.findUnique({
        where: { planType: 'STARTER' }
      });

      if (starterTier) {
        await prisma.institution.update({
          where: { id: institution.id },
          data: { commissionRate: starterTier.commissionRate }
        });
      }

      console.log(` Created STARTER subscription for ${institution.name}`);
    }

    // 4. Create commission records for institutions that don't have them
    console.log('💳 Creating commission records...');
    
    const institutionsWithoutCommission = await prisma.institution.findMany({
      where: {
        commission: null
      }
    });

    for (const institution of institutionsWithoutCommission) {
      await prisma.institutionCommission.create({
        data: {
          institutionId: institution.id,
          rate: institution.commissionRate,
          isActive: true
        }
      });
      console.log(` Created commission record for ${institution.name}`);
    }

    console.log('🎉 Subscription-based commission system setup complete!');
    console.log('\n📊 Summary:');
    console.log(`- Created ${commissionTiers.length} commission tiers`);
    console.log(`- Updated ${institutions.length} institutions with default subscriptions`);
    console.log(`- Created ${institutionsWithoutCommission.length} commission records`);

  } catch (error) {
    logger.error('❌ Error setting up subscription commission system:');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
if (require.main === module) {
  setupSubscriptionCommissionSystem()
    .then(() => {
      console.log('✅ Setup completed successfully');
      process.exit(0);
    })
    .catch(() => {
      logger.error('❌ Setup failed:');
      process.exit(1);
    });
}

export { setupSubscriptionCommissionSystem }; 