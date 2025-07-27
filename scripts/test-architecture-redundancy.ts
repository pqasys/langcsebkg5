#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testArchitectureRedundancy() {
  console.log('🔍 Testing Architecture Redundancy Analysis...\n');

  try {
    // 1. Analyze CommissionTier structure
    console.log('1. CommissionTier Table Analysis:');
    const commissionTiers = await prisma.commissionTier.findMany({
      orderBy: { planType: 'asc' }
    });

    commissionTiers.forEach(tier => {
      console.log(`  - ${tier.planType}:`);
      console.log(`    Commission Rate: ${tier.commissionRate}%`);
      console.log(`    Features: ${Object.keys(tier.features || {}).filter(key => tier.features[key] === true).join(', ')}`);
      console.log(`    Has Pricing:  (No price field)`);
      console.log(`    Has Billing Cycle:  (No billingCycle field)`);
      console.log(`    Has Name/Description:  (No name/description fields)`);
    });

    // 2. Analyze SubscriptionPlan structure
    console.log('\n2. SubscriptionPlan Table Analysis:');
    const subscriptionPlans = await prisma.subscriptionPlan.findMany({
      orderBy: { name: 'asc' }
    });

    subscriptionPlans.forEach(plan => {
      console.log(`  - ${plan.name}:`);
      console.log(`    Price: $${plan.price} ${plan.currency}`);
      console.log(`    Billing Cycle: ${plan.billingCycle}`);
      console.log(`    Features: ${Array.isArray(plan.features) ? plan.features.join(', ') : 'Not array format'}`);
      console.log(`    Has Commission Rate:  (No commissionRate field)`);
      console.log(`    Has Plan Type:  (No planType field)`);
    });

    // 3. Analyze InstitutionSubscription confusion
    console.log('\n3. InstitutionSubscription Confusion Analysis:');
    const institutionSubscriptions = await prisma.institutionSubscription.findMany({
      include: {
        subscriptionPlan: true
      },
      take: 3
    });

    institutionSubscriptions.forEach(sub => {
      console.log(`  - Institution Subscription:`);
      console.log(`    Plan Type: ${sub.planType} (from CommissionTier concept)`);
      console.log(`    Subscription Plan: ${sub.subscriptionPlan?.name || 'None'} (from SubscriptionPlan table)`);
      console.log(`    Amount: $${sub.amount} ${sub.currency}`);
      console.log(`    Billing Cycle: ${sub.billingCycle}`);
      console.log(`     CONFUSION: References both planType AND subscriptionPlanId`);
    });

    // 4. Feature Redundancy Analysis
    console.log('\n4. Feature Redundancy Analysis:');
    
    const starterTier = commissionTiers.find(t => t.planType === 'STARTER');
    const professionalTier = commissionTiers.find(t => t.planType === 'PROFESSIONAL');
    const enterpriseTier = commissionTiers.find(t => t.planType === 'ENTERPRISE');

    console.log('  CommissionTier Features:');
    if (starterTier) {
      const starterFeatures = Object.keys(starterTier.features || {}).filter(key => starterTier.features[key] === true);
      console.log(`    STARTER: ${starterFeatures.join(', ')}`);
    }
    if (professionalTier) {
      const professionalFeatures = Object.keys(professionalTier.features || {}).filter(key => professionalTier.features[key] === true);
      console.log(`    PROFESSIONAL: ${professionalFeatures.join(', ')}`);
    }
    if (enterpriseTier) {
      const enterpriseFeatures = Object.keys(enterpriseTier.features || {}).filter(key => enterpriseTier.features[key] === true);
      console.log(`    ENTERPRISE: ${enterpriseFeatures.join(', ')}`);
    }

    console.log('  SubscriptionPlan Features:');
    subscriptionPlans.forEach(plan => {
      console.log(`    ${plan.name}: ${Array.isArray(plan.features) ? plan.features.join(', ') : 'Invalid format'}`);
    });

    // 5. Summary of Problems
    console.log('\n5. Architecture Problems Summary:');
    console.log('  ❌ REDUNDANCY:');
    console.log('    - CommissionTier defines features but NO pricing');
    console.log('    - SubscriptionPlan defines pricing AND features (duplicate)');
    console.log('    - Features are stored in both tables');
    console.log('    - InstitutionSubscription references both concepts');
    
    console.log('\n  ❌ CONFUSION:');
    console.log('    - What is the difference between planType and subscriptionPlan?');
    console.log('    - Which table is the source of truth for features?');
    console.log('    - How do pricing and commission rates relate?');
    console.log('    - Why do we need both tables?');

    console.log('\n  ✅ RECOMMENDED SOLUTION:');
    console.log('    - Merge into single CommissionTier table with pricing');
    console.log('    - Remove SubscriptionPlan table entirely');
    console.log('    - Simplify InstitutionSubscription to reference CommissionTier only');
    console.log('    - Single source of truth for plan definitions');

    console.log('\n📊 Current Table Counts:');
    console.log(`  - CommissionTiers: ${commissionTiers.length}`);
    console.log(`  - SubscriptionPlans: ${subscriptionPlans.length}`);
    console.log(`  - InstitutionSubscriptions: ${institutionSubscriptions.length}`);

  } catch (error) {
    logger.error('❌ Test failed:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testArchitectureRedundancy().catch(console.error); 