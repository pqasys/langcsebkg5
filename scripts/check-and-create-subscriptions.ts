import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function checkAndCreateSubscriptions() {
  try {
    console.log('🔍 Checking existing institutions and subscriptions...');

    // Get all institutions
    const institutions = await prisma.institution.findMany({
      include: {
        subscription: true,
        users: {
          take: 1
        }
      }
    });

    console.log(`Found ${institutions.length} institutions`);

    for (const institution of institutions) {
      console.log(`\n� Institution: ${institution.name} (${institution.id})`);
      
      if (institution.subscription) {
        console.log(`   Has subscription: ${institution.subscription.planType} - ${institution.subscription.amount}/${institution.subscription.billingCycle.toLowerCase()}`);
        console.log(`  � Expires: ${institution.subscription.endDate.toLocaleDateString()}`);
        console.log(`  � Commission rate: ${institution.commissionRate}%`);
      } else {
        console.log(`   No subscription found`);
        
        // Create default STARTER subscription
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from now

        const subscription = await prisma.institutionSubscription.create({
          data: {
            institutionId: institution.id,
            planType: 'STARTER',
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: endDate,
            billingCycle: 'MONTHLY',
            amount: 99,
            currency: 'USD',
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
            metadata: {
              autoCreated: true,
              originalCommissionRate: institution.commissionRate
            }
          }
        });

        console.log(`   Created STARTER subscription: ${subscription.amount}/month`);
        console.log(`  � Expires: ${subscription.endDate.toLocaleDateString()}`);
      }
    }

    // Check commission tiers
    console.log('\n⚖️ Checking commission tiers...');
    const commissionTiers = await prisma.commissionTier.findMany();
    console.log(`Found ${commissionTiers.length} commission tiers:`);
    
    for (const tier of commissionTiers) {
      console.log(`  ${tier.planType}: ${tier.commissionRate}% commission`);
    }

    console.log('\n✅ Check completed successfully');
  } catch (error) {
    logger.error('❌ Error:');
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateSubscriptions(); 