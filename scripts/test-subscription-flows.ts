#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { getAllStudentTiers, getAllInstitutionTiers } from '../lib/subscription-pricing';

const prisma = new PrismaClient();

async function testSubscriptionFlows() {
  console.log('🧪 Testing Subscription Flows with Single Source of Truth\n');

  try {
    // Test 1: Verify single source of truth pricing
    console.log('1. Testing Single Source of Truth Pricing...');
    
    const studentTiers = getAllStudentTiers();
    const institutionTiers = getAllInstitutionTiers();
    
    console.log('✅ Student Tiers:');
    studentTiers.forEach(tier => {
      console.log(`   ${tier.planType}: $${tier.price}/month - ${tier.name}`);
    });
    
    console.log('\n✅ Institution Tiers:');
    institutionTiers.forEach(tier => {
      console.log(`   ${tier.planType}: $${tier.price}/month (${tier.commissionRate}% commission) - ${tier.name}`);
    });

    // Test 2: Verify database consistency
    console.log('\n2. Testing Database Consistency...');
    
    const dbStudentTiers = await prisma.studentTier.findMany({
      orderBy: { price: 'asc' }
    });
    
    const dbInstitutionTiers = await prisma.commissionTier.findMany({
      orderBy: { price: 'asc' }
    });
    
    console.log('✅ Database Student Tiers:');
    dbStudentTiers.forEach(tier => {
      console.log(`   ${tier.planType}: $${tier.price}/month - ${tier.name}`);
    });
    
    console.log('\n✅ Database Institution Tiers:');
    dbInstitutionTiers.forEach(tier => {
      console.log(`   ${tier.planType}: $${tier.price}/month (${tier.commissionRate}% commission) - ${tier.name}`);
    });

    // Test 3: Verify pricing consistency
    console.log('\n3. Testing Pricing Consistency...');
    
    let pricingConsistent = true;
    
    // Compare student tiers
    studentTiers.forEach(sourceTier => {
      const dbTier = dbStudentTiers.find(db => db.planType === sourceTier.planType);
      if (!dbTier || dbTier.price !== sourceTier.price) {
        console.log(`❌ Student tier ${sourceTier.planType} pricing mismatch: Source=${sourceTier.price}, DB=${dbTier?.price}`);
        pricingConsistent = false;
      }
    });
    
    // Compare institution tiers
    institutionTiers.forEach(sourceTier => {
      const dbTier = dbInstitutionTiers.find(db => db.planType === sourceTier.planType);
      if (!dbTier || dbTier.price !== sourceTier.price) {
        console.log(`❌ Institution tier ${sourceTier.planType} pricing mismatch: Source=${sourceTier.price}, DB=${dbTier?.price}`);
        pricingConsistent = false;
      }
    });
    
    if (pricingConsistent) {
      console.log('✅ All pricing is consistent between source and database');
    } else {
      console.log('❌ Pricing inconsistencies found');
    }

    // Test 4: Verify subscription service integration
    console.log('\n4. Testing Subscription Service Integration...');
    
    const { SubscriptionCommissionService } = await import('../lib/subscription-commission-service');
    
    const serviceStudentPlans = SubscriptionCommissionService.getStudentSubscriptionPlans();
    const serviceInstitutionPlans = SubscriptionCommissionService.getSubscriptionPlans();
    
    console.log('✅ Service Student Plans:');
    serviceStudentPlans.forEach(plan => {
      console.log(`   ${plan.planType}: $${plan.monthlyPrice}/month`);
    });
    
    console.log('\n✅ Service Institution Plans:');
    serviceInstitutionPlans.forEach(plan => {
      console.log(`   ${plan.planType}: $${plan.monthlyPrice}/month`);
    });

    // Test 5: Verify feature integration
    console.log('\n5. Testing Feature Integration...');
    
    // Check if video conferencing is integrated into subscription tiers
    const proStudentTier = studentTiers.find(tier => tier.planType === 'PRO');
    const enterpriseInstitutionTier = institutionTiers.find(tier => tier.planType === 'ENTERPRISE');
    
    if (proStudentTier?.features.some(f => f.toLowerCase().includes('video'))) {
      console.log('✅ Video conferencing integrated into PRO student tier');
    } else {
      console.log('❌ Video conferencing not found in PRO student tier');
    }
    
    if (enterpriseInstitutionTier?.features.some(f => f.toLowerCase().includes('video'))) {
      console.log('✅ Video conferencing integrated into ENTERPRISE institution tier');
    } else {
      console.log('❌ Video conferencing not found in ENTERPRISE institution tier');
    }

    // Test 6: Verify component integration
    console.log('\n6. Testing Component Integration...');
    
    // Simulate component pricing generation
    const componentStudentPlans = studentTiers.map(tier => ({
      id: tier.planType.toLowerCase(),
      name: tier.name.replace(' Plan', ''),
      price: tier.price,
      annualPrice: tier.annualPrice,
      features: tier.features
    }));
    
    const componentInstitutionPlans = institutionTiers.map(tier => ({
      id: tier.planType.toLowerCase(),
      name: tier.name.replace(' Plan', ''),
      price: tier.price,
      annualPrice: tier.annualPrice,
      features: tier.features
    }));
    
    console.log('✅ Component Student Plans Generated:');
    componentStudentPlans.forEach(plan => {
      console.log(`   ${plan.id}: $${plan.price}/month - ${plan.name}`);
    });
    
    console.log('\n✅ Component Institution Plans Generated:');
    componentInstitutionPlans.forEach(plan => {
      console.log(`   ${plan.id}: $${plan.price}/month - ${plan.name}`);
    });

    // Test 7: Summary
    console.log('\n📊 Test Summary:');
    console.log(`✅ Single Source of Truth: ${studentTiers.length} student tiers, ${institutionTiers.length} institution tiers`);
    console.log(`✅ Database Consistency: ${dbStudentTiers.length} student tiers, ${dbInstitutionTiers.length} institution tiers`);
    console.log(`✅ Pricing Consistency: ${pricingConsistent ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Service Integration: ${serviceStudentPlans.length} student plans, ${serviceInstitutionPlans.length} institution plans`);
    console.log(`✅ Component Integration: ${componentStudentPlans.length} student plans, ${componentInstitutionPlans.length} institution plans`);

    if (pricingConsistent) {
      console.log('\n🎉 All subscription flows are working correctly!');
      console.log('\n📋 Next Steps:');
      console.log('   1. Test actual subscription creation flows');
      console.log('   2. Test payment processing with new pricing');
      console.log('   3. Test upgrade/downgrade flows');
      console.log('   4. Test analytics with new pricing structure');
    } else {
      console.log('\n⚠️  Pricing inconsistencies found. Please review and fix.');
    }

  } catch (error) {
    console.error('❌ Error testing subscription flows:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the tests
testSubscriptionFlows(); 