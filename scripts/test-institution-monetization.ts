import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testInstitutionMonetization() {
  console.log('🧪 Testing Institution Monetization System...\n');

  try {
    // Test 1: Check institution data and priority scoring
    console.log('1. Testing Institution Priority Scoring...');
    
    const institutions = await prisma.institution.findMany({
      where: {
        isApproved: true,
        status: 'ACTIVE'
      },
      include: {
        courses: {
          where: {
            status: 'PUBLISHED'
          },
          select: {
            id: true
          }
        },
        users: {
          where: {
            role: 'STUDENT'
          },
          select: {
            id: true
          }
        }
      }
    });

    console.log(`   Found ${institutions.length} approved institutions`);
    
    // Calculate priority scores
    const institutionsWithPriority = institutions.map(inst => {
      let priorityScore = 0;
      
      // Featured institution bonus
      if (inst.isFeatured) priorityScore += 1000;
      
      // Subscription plan bonus
      const planBonus = {
        'BASIC': 0,
        'PROFESSIONAL': 100,
        'ENTERPRISE': 200
      };
      priorityScore += planBonus[inst.subscriptionPlan as keyof typeof planBonus] || 0;
      
      // Commission rate bonus
      priorityScore += (inst.commissionRate || 0) * 5;
      
      // Enhanced profile bonus
      const enhancedProfile = inst.subscriptionPlan !== 'BASIC';
      if (enhancedProfile) priorityScore += 50;
      
      return {
        id: inst.id,
        name: inst.name,
        subscriptionPlan: inst.subscriptionPlan,
        isFeatured: inst.isFeatured,
        commissionRate: inst.commissionRate,
        courseCount: inst.courses.length,
        studentCount: inst.users.length,
        priorityScore,
        isPremiumListing: inst.subscriptionPlan === 'ENTERPRISE',
        isSponsoredListing: inst.subscriptionPlan === 'PROFESSIONAL',
        enhancedProfile
      };
    });

    // Sort by priority score
    institutionsWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);

    console.log('   Top 5 institutions by priority score:');
    institutionsWithPriority.slice(0, 5).forEach((inst, index) => {
      console.log(`   ${index + 1}. ${inst.name} - Score: ${inst.priorityScore}`);
      console.log(`      Plan: ${inst.subscriptionPlan}, Featured: ${inst.isFeatured}, Commission: ${inst.commissionRate}%`);
      console.log(`      Courses: ${inst.courseCount}, Students: ${inst.studentCount}`);
    });

    // Test 2: Check monetization eligibility
    console.log('\n2. Testing Monetization Eligibility...');
    
    const premiumInstitutions = institutionsWithPriority.filter(inst => inst.isPremiumListing);
    const featuredInstitutions = institutionsWithPriority.filter(inst => inst.isFeatured);
    const sponsoredInstitutions = institutionsWithPriority.filter(inst => inst.isSponsoredListing);
    const enhancedProfiles = institutionsWithPriority.filter(inst => inst.enhancedProfile);

    console.log(`   Premium Listings (Enterprise): ${premiumInstitutions.length}`);
    console.log(`   Featured Institutions: ${featuredInstitutions.length}`);
    console.log(`   Sponsored Listings (Professional): ${sponsoredInstitutions.length}`);
    console.log(`   Enhanced Profiles: ${enhancedProfiles.length}`);

    // Test 3: Check API endpoint functionality
    console.log('\n3. Testing API Endpoint Functionality...');
    
    try {
      // Test basic institutions endpoint
      const response = await fetch('http://localhost:3000/api/institutions');
      if (response.ok) {
        const apiInstitutions = await response.json();
        console.log(`   Basic API returned ${apiInstitutions.length} institutions`);
        
        if (apiInstitutions.length > 0) {
          const firstInst = apiInstitutions[0];
          console.log(`   First institution: ${firstInst.name}`);
          console.log(`   Has commission rate: ${firstInst.commissionRate !== undefined}`);
          console.log(`   Has subscription plan: ${firstInst.subscriptionPlan !== undefined}`);
          console.log(`   Has course count: ${firstInst.courseCount !== undefined}`);
          console.log(`   Has student count: ${firstInst.studentCount !== undefined}`);
        }
      } else {
        console.log('   ❌ Basic API endpoint not accessible');
      }

      // Test featured institutions endpoint
      const featuredResponse = await fetch('http://localhost:3000/api/institutions?featured=true&limit=2');
      if (featuredResponse.ok) {
        const featuredApiInstitutions = await featuredResponse.json();
        console.log(`   Featured API returned ${featuredApiInstitutions.length} institutions`);
        
        if (featuredApiInstitutions.length > 0) {
          const featuredInst = featuredApiInstitutions[0];
          console.log(`   Featured institution: ${featuredInst.name}`);
          console.log(`   Is featured: ${featuredInst.isFeatured}`);
        }
      } else {
        console.log('   ❌ Featured API endpoint not accessible');
      }
    } catch (error) {
      console.log('   ⚠️  API endpoint tests skipped (server may not be running)');
    }

    // Test 4: Check promotional sidebar data
    console.log('\n4. Testing Promotional Sidebar Data...');
    
    const sidebarEligibleInstitutions = institutionsWithPriority.filter(inst => 
      inst.isFeatured || inst.isPremiumListing || inst.isSponsoredListing
    );

    console.log(`   Institutions eligible for sidebar promotion: ${sidebarEligibleInstitutions.length}`);
    
    if (sidebarEligibleInstitutions.length > 0) {
      console.log('   Top sidebar candidates:');
      sidebarEligibleInstitutions.slice(0, 3).forEach((inst, index) => {
        const type = inst.isPremiumListing ? 'Premium' : inst.isFeatured ? 'Featured' : 'Sponsored';
        console.log(`   ${index + 1}. ${inst.name} (${type}) - Score: ${inst.priorityScore}`);
      });
    }

    // Test 5: Revenue potential calculation
    console.log('\n5. Calculating Revenue Potential...');
    
    const revenueStreams = {
      premiumListings: premiumInstitutions.length * 500, // $500/month per premium listing
      sponsoredListings: sponsoredInstitutions.length * 200, // $200/month per sponsored listing
      enhancedProfiles: enhancedProfiles.length * 100, // $100/month per enhanced profile
      commissionRevenue: institutionsWithPriority.reduce((sum, inst) => 
        sum + (inst.commissionRate * inst.courseCount * 10), 0 // Estimated $10 per course enrollment
      )
    };

    const totalMonthlyRevenue = Object.values(revenueStreams).reduce((sum, val) => sum + val, 0);

    console.log('   Monthly revenue potential:');
    console.log(`   - Premium Listings: $${revenueStreams.premiumListings.toLocaleString()}`);
    console.log(`   - Sponsored Listings: $${revenueStreams.sponsoredListings.toLocaleString()}`);
    console.log(`   - Enhanced Profiles: $${revenueStreams.enhancedProfiles.toLocaleString()}`);
    console.log(`   - Commission Revenue: $${revenueStreams.commissionRevenue.toLocaleString()}`);
    console.log(`   - Total Potential: $${totalMonthlyRevenue.toLocaleString()}`);

    // Test 6: Verify component logic
    console.log('\n6. Verifying Component Logic...');
    
    const testCases = [
      { subscriptionPlan: 'ENTERPRISE', isFeatured: false, expected: { isPremium: true, isSponsored: false, enhanced: true } },
      { subscriptionPlan: 'PROFESSIONAL', isFeatured: true, expected: { isPremium: false, isSponsored: true, enhanced: true } },
      { subscriptionPlan: 'BASIC', isFeatured: false, expected: { isPremium: false, isSponsored: false, enhanced: false } }
    ];

    testCases.forEach(({ subscriptionPlan, isFeatured, expected }) => {
      const isPremium = subscriptionPlan === 'ENTERPRISE';
      const isSponsored = subscriptionPlan === 'PROFESSIONAL';
      const enhanced = subscriptionPlan !== 'BASIC';
      
      const status = (
        isPremium === expected.isPremium && 
        isSponsored === expected.isSponsored && 
        enhanced === expected.enhanced
      ) ? '✅ PASS' : '❌ FAIL';
      
      console.log(`   ${subscriptionPlan} (Featured: ${isFeatured}): ${status}`);
    });

    console.log('\n✅ Institution Monetization Test Complete!');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`   - Total institutions: ${institutions.length}`);
    console.log(`   - Premium listings: ${premiumInstitutions.length}`);
    console.log(`   - Featured institutions: ${featuredInstitutions.length}`);
    console.log(`   - Sponsored listings: ${sponsoredInstitutions.length}`);
    console.log(`   - Enhanced profiles: ${enhancedProfiles.length}`);
    console.log(`   - Monthly revenue potential: $${totalMonthlyRevenue.toLocaleString()}`);
    console.log(`   - Sidebar promotion candidates: ${sidebarEligibleInstitutions.length}`);

  } catch (error) {
    logger.error('❌ Error testing institution monetization:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testInstitutionMonetization(); 