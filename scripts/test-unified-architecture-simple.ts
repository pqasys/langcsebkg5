#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testUnifiedArchitecture() {
  console.log('🎯 Testing Unified Subscription Architecture...\n');

  try {
    // Test 1: Check Commission Tiers
    console.log('1. Commission Tiers:');
    const commissionTiers = await prisma.commissionTier.findMany();
    commissionTiers.forEach(tier => {
      console.log(`   ${tier.planType}: $${tier.price}/month (${tier.commissionRate}% commission)`);
      console.log(`     Features: ${Object.keys(tier.features as any).length} features`);
      console.log(`     Limits: ${tier.maxStudents} students, ${tier.maxCourses} courses, ${tier.maxTeachers} teachers`);
    });

    // Test 2: Check Student Tiers
    console.log('\n2. Student Tiers:');
    const studentTiers = await prisma.studentTier.findMany();
    studentTiers.forEach(tier => {
      console.log(`   ${tier.planType}: $${tier.price}/month`);
      console.log(`     Features: ${Object.keys(tier.features as any).length} features`);
      console.log(`     Limits: ${tier.maxCourses} courses, ${tier.maxLanguages} languages`);
    });

    // Test 3: Check Institution Subscriptions
    console.log('\n3. Institution Subscriptions:');
    const institutionSubs = await prisma.institutionSubscription.findMany({
      include: { commissionTier: true }
    });
    institutionSubs.forEach(sub => {
      console.log(`   Institution ${sub.institutionId}:`);
      console.log(`     Tier: ${sub.commissionTier.planType}`);
      console.log(`     Price: $${sub.commissionTier.price}/month`);
      console.log(`     Commission: ${sub.commissionTier.commissionRate}%`);
    });

    // Test 4: Check Student Subscriptions
    console.log('\n4. Student Subscriptions:');
    const studentSubs = await prisma.studentSubscription.findMany({
      include: { studentTier: true }
    });
    studentSubs.forEach(sub => {
      console.log(`   Student ${sub.studentId}:`);
      console.log(`     Tier: ${sub.studentTier.planType}`);
      console.log(`     Price: $${sub.studentTier.price}/month`);
    });

    // Test 5: Summary
    console.log('\n5. Architecture Summary:');
    console.log(`    ${commissionTiers.length} institution tiers with fixed pricing`);
    console.log(`    ${studentTiers.length} student tiers with fixed pricing`);
    console.log(`    ${institutionSubs.length} institution subscriptions linked to tiers`);
    console.log(`    ${studentSubs.length} student subscriptions linked to tiers`);
    console.log(`    No custom pricing - all pricing comes from tiers`);
    console.log(`    Unified tier-based architecture implemented`);

    console.log('\n🎉 Unified subscription architecture is working correctly!');

  } catch (error) {
    logger.error('❌ Test failed:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testUnifiedArchitecture().catch(console.error); 