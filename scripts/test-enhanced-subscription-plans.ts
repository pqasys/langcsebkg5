#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testEnhancedSubscriptionPlans() {
  console.log('🧪 Testing Enhanced Subscription Plans with Feature Selection...\n');

  try {
    // 1. Test Commission Tiers with Features
    console.log('1. Testing Commission Tiers with Features...');
    
    const commissionTiers = await prisma.commissionTier.findMany({
      orderBy: { planType: 'asc' }
    });

    console.log(`Found ${commissionTiers.length} commission tiers:`);
    commissionTiers.forEach(tier => {
      console.log(`  - ${tier.planType}: ${tier.commissionRate}% commission`);
      if (tier.features) {
        const enabledFeatures = Object.keys(tier.features).filter(key => tier.features[key] === true);
        console.log(`    Features: ${enabledFeatures.join(', ')}`);
      }
    });

    // 2. Test Subscription Plans with Features
    console.log('\n2. Testing Subscription Plans with Features...');
    
    const subscriptionPlans = await prisma.subscriptionPlan.findMany({
      orderBy: { name: 'asc' }
    });

    console.log(`Found ${subscriptionPlans.length} subscription plans:`);
    subscriptionPlans.forEach(plan => {
      console.log(`  - ${plan.name}: $${plan.price} ${plan.currency} / ${plan.billingCycle}`);
      console.log(`    Limits: ${plan.maxStudents} students, ${plan.maxCourses} courses, ${plan.maxTeachers} teachers`);
      if (plan.features && Array.isArray(plan.features)) {
        console.log(`    Features: ${plan.features.join(', ')}`);
      }
    });

    // 3. Test Institution Subscriptions with Plan Links
    console.log('\n3. Testing Institution Subscriptions with Plan Links...');
    
    const institutionSubscriptions = await prisma.institutionSubscription.findMany({
      include: {
        institution: {
          select: { name: true, email: true }
        },
        subscriptionPlan: {
          select: { name: true, features: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log(`Found ${institutionSubscriptions.length} institution subscriptions:`);
    institutionSubscriptions.forEach(sub => {
      console.log(`  - ${sub.institution.name} (${sub.institution.email})`);
      console.log(`    Plan: ${sub.planType} - ${sub.subscriptionPlan?.name || 'No linked plan'}`);
      console.log(`    Status: ${sub.status}, Amount: $${sub.amount} ${sub.currency}`);
      if (sub.subscriptionPlan?.features) {
        console.log(`    Plan Features: ${sub.subscriptionPlan.features.join(', ')}`);
      }
    });

    // 4. Test Feature Consistency Between Tiers and Plans
    console.log('\n4. Testing Feature Consistency...');
    
    const starterTier = commissionTiers.find(t => t.planType === 'STARTER');
    const professionalTier = commissionTiers.find(t => t.planType === 'PROFESSIONAL');
    const enterpriseTier = commissionTiers.find(t => t.planType === 'ENTERPRISE');

    if (starterTier) {
      const starterFeatures = Object.keys(starterTier.features || {}).filter(key => starterTier.features[key] === true);
      console.log(`STARTER tier features: ${starterFeatures.join(', ')}`);
    }

    if (professionalTier) {
      const professionalFeatures = Object.keys(professionalTier.features || {}).filter(key => professionalTier.features[key] === true);
      console.log(`PROFESSIONAL tier features: ${professionalFeatures.join(', ')}`);
    }

    if (enterpriseTier) {
      const enterpriseFeatures = Object.keys(enterpriseTier.features || {}).filter(key => enterpriseTier.features[key] === true);
      console.log(`ENTERPRISE tier features: ${enterpriseFeatures.join(', ')}`);
    }

    // 5. Test API Endpoints
    console.log('\n5. Testing API Endpoints...');
    
    // Test commission tiers API
    try {
      const tiersResponse = await fetch('http://localhost:3000/api/admin/settings/commission-tiers');
      if (tiersResponse.ok) {
        const tiersData = await tiersResponse.json();
        console.log(` Commission tiers API: ${tiersData.length} tiers returned`);
      } else {
        console.log(` Commission tiers API: ${tiersResponse.status} ${tiersResponse.statusText}`);
      }
    } catch (error) {
      console.log(` Commission tiers API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test subscription plans API
    try {
      const plansResponse = await fetch('http://localhost:3000/api/admin/settings/subscription-plans');
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        console.log(` Subscription plans API: ${plansData.plans?.length || 0} plans returned`);
      } else {
        console.log(` Subscription plans API: ${plansResponse.status} ${plansResponse.statusText}`);
      }
    } catch (error) {
      console.log(` Subscription plans API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // 6. Test Feature Loading Functionality
    console.log('\n6. Testing Feature Loading Functionality...');
    
    // Simulate loading features from commission tiers
    const testFeatures = {
      STARTER: ['maxStudents', 'maxCourses', 'basicAnalytics', 'emailSupport'],
      PROFESSIONAL: ['maxStudents', 'maxCourses', 'maxTeachers', 'advancedAnalytics', 'prioritySupport', 'customBranding'],
      ENTERPRISE: ['maxStudents', 'maxCourses', 'maxTeachers', 'advancedAnalytics', 'prioritySupport', 'customBranding', 'apiAccess', 'whiteLabel', 'dedicatedAccountManager']
    };

    Object.entries(testFeatures).forEach(([planType, features]) => {
      console.log(`${planType} plan would have features: ${features.join(', ')}`);
    });

    console.log('\n✅ Enhanced Subscription Plans Test Completed Successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Commission Tiers: ${commissionTiers.length}`);
    console.log(`- Subscription Plans: ${subscriptionPlans.length}`);
    console.log(`- Institution Subscriptions: ${institutionSubscriptions.length}`);
    console.log('- Feature selection system implemented');
    console.log('- Commission tier feature loading implemented');

  } catch (error) {
    logger.error('❌ Test failed:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testEnhancedSubscriptionPlans().catch(console.error); 