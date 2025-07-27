import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testPrioritizationSystem() {
  console.log('🧪 Testing Course Prioritization and Advertising System...\n');

  try {
    // Test 1: Check if priority scoring is working
    console.log('1. Testing Priority Score Calculation...');
    
    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        institution: {
          isApproved: true,
          status: 'ACTIVE'
        }
      },
      include: {
        institution: {
          select: {
            name: true,
            commissionRate: true,
            subscriptionPlan: true, // Legacy field
            isFeatured: true,
            subscription: {
              include: {
                commissionTier: true
              }
            }
          }
        }
      },
      take: 10
    });

    console.log(`   Found ${courses.length} published courses`);
    
    // Calculate priority scores manually to verify
    const coursesWithPriority = courses.map(course => {
      let priorityScore = 0;
      
      if (course.institution.isFeatured) {
        priorityScore += 1000;
      }
      
      priorityScore += (course.institution.commissionRate || 0) * 10;
      
      // Subscription plan bonus - use new unified architecture when available
      let subscriptionPlan = 'BASIC'; // Default fallback
      
      if (course.institution.subscription?.status === 'ACTIVE' && course.institution.subscription.commissionTier) {
        // Use new unified architecture
        subscriptionPlan = course.institution.subscription.commissionTier.planType;
      } else if (course.institution.subscriptionPlan) {
        // Fallback to legacy field for backward compatibility
        subscriptionPlan = course.institution.subscriptionPlan;
      }
      
      const planBonus = {
        'STARTER': 25,
        'BASIC': 0,
        'PROFESSIONAL': 50,
        'ENTERPRISE': 100
      };
      priorityScore += planBonus[subscriptionPlan as keyof typeof planBonus] || 0;
      
      const daysSinceCreation = Math.floor((Date.now() - new Date(course.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      priorityScore += Math.max(0, 30 - daysSinceCreation);
      
      if (course.startDate) {
        const daysUntilStart = Math.floor((new Date(course.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        priorityScore += Math.max(0, 30 - daysUntilStart);
      }
      
      // Commission rate band categorization
      const commissionRate = course.institution.commissionRate || 0;
      const commissionBand = commissionRate >= 25 ? 'VERY_HIGH' : 
                            commissionRate >= 20 ? 'HIGH' : 
                            commissionRate >= 15 ? 'MEDIUM' : 'LOW';
      
      return {
        id: course.id,
        title: course.title,
        institution: course.institution.name,
        priorityScore,
        isFeatured: course.institution.isFeatured,
        subscriptionPlan: subscriptionPlan,
        commissionRate: course.institution.commissionRate,
        commissionBand,
        hasActiveSubscription: !!course.institution.subscription?.status === 'ACTIVE',
        subscriptionTier: course.institution.subscription?.commissionTier?.planType || 'NONE'
      };
    });

    // Sort by priority score
    coursesWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);
    
    console.log('   Top 5 courses by priority score:');
    coursesWithPriority.slice(0, 5).forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.title} (${course.institution}) - Score: ${course.priorityScore}`);
      console.log(`      Featured: ${course.isFeatured}, Plan: ${course.subscriptionPlan}, Commission: ${course.commissionRate}% (${course.commissionBand})`);
      console.log(`      Has Active Subscription: ${course.hasActiveSubscription}, Tier: ${course.subscriptionTier}`);
    });

    // Test 2: Check advertising eligibility
    console.log('\n2. Testing Advertising Eligibility...');
    
    const advertisingEligible = coursesWithPriority.filter(course => {
      const isPremiumPlacement = course.subscriptionPlan === 'ENTERPRISE';
      const isFeaturedPlacement = course.isFeatured;
      const isHighCommission = (course.commissionRate || 0) >= 20;
      const isVeryHighCommission = (course.commissionRate || 0) >= 25;
      
      return isPremiumPlacement || isFeaturedPlacement || isHighCommission;
    });

    console.log(`   Found ${advertisingEligible.length} courses eligible for advertising placement`);
    
    const premiumCount = advertisingEligible.filter(c => c.subscriptionPlan === 'ENTERPRISE').length;
    const featuredCount = advertisingEligible.filter(c => c.isFeatured).length;
    const highCommissionCount = advertisingEligible.filter(c => (c.commissionRate || 0) >= 20).length;
    const veryHighCommissionCount = advertisingEligible.filter(c => (c.commissionRate || 0) >= 25).length;
    
    console.log(`   - Premium (Enterprise): ${premiumCount}`);
    console.log(`   - Featured: ${featuredCount}`);
    console.log(`   - High Commission (≥20%): ${highCommissionCount}`);
    console.log(`   - Very High Commission (≥25%): ${veryHighCommissionCount}`);

    // Test 3: Check revenue optimization potential
    console.log('\n3. Testing Revenue Optimization Potential...');
    
    // Total revenue: sum of booking.amount for completed bookings
    const totalRevenue = await prisma.booking.aggregate({
      where: {
        status: 'COMPLETED',
      },
      _sum: {
        amount: true
      }
    });

    // Commission revenue: sum of commissionAmount for completed payments
    const commissionRevenue = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
      },
      _sum: {
        commissionAmount: true
      }
    });

    const totalRev = totalRevenue._sum.amount || 0;
    const commissionRev = commissionRevenue._sum.commissionAmount || 0;
    const commissionPercentage = totalRev > 0 ? (commissionRev / totalRev * 100) : 0;

    console.log(`   Total Revenue: $${totalRev.toLocaleString()}`);
    console.log(`   Commission Revenue: $${commissionRev.toLocaleString()}`);
    console.log(`   Commission Percentage: ${commissionPercentage.toFixed(1)}%`);

    // Test 4: Check institution distribution
    console.log('\n4. Testing Institution Distribution...');
    
    const institutionStats = await prisma.institution.groupBy({
      by: ['subscriptionPlan', 'isFeatured'],
      where: {
        isApproved: true,
        status: 'ACTIVE'
      },
      _count: {
        id: true
      }
    });

    console.log('   Institution distribution:');
    institutionStats.forEach(stat => {
      const plan = stat.subscriptionPlan || 'BASIC';
      const featured = stat.isFeatured ? ' (Featured)' : '';
      console.log(`   - ${plan}${featured}: ${stat._count.id} institutions`);
    });

    // Test 5: Check commission rate distribution
    console.log('\n5. Testing Commission Rate Distribution...');
    
    const commissionStats = await prisma.institution.groupBy({
      by: ['commissionRate'],
      where: {
        isApproved: true,
        status: 'ACTIVE'
      },
      _count: {
        id: true
      },
      orderBy: {
        commissionRate: 'asc'
      }
    });

    console.log('   Commission rate distribution:');
    commissionStats.forEach(stat => {
      const rate = stat.commissionRate || 0;
      const count = stat._count.id;
      const category = rate >= 25 ? 'Very High' : rate >= 20 ? 'High' : rate >= 15 ? 'Medium' : 'Low';
      console.log(`   - ${rate}%: ${count} institutions (${category})`);
    });

    // Test 6: Simulate revenue impact
    console.log('\n6. Simulating Revenue Impact...');
    
    const featuredInstitutions = await prisma.institution.count({
      where: {
        isFeatured: true,
        isApproved: true,
        status: 'ACTIVE'
      }
    });

    const premiumInstitutions = await prisma.institution.count({
      where: {
        subscriptionPlan: 'ENTERPRISE',
        isApproved: true,
        status: 'ACTIVE'
      }
    });

    const highCommissionInstitutions = await prisma.institution.count({
      where: {
        commissionRate: {
          gte: 20
        },
        isApproved: true,
        status: 'ACTIVE'
      }
    });

    const veryHighCommissionInstitutions = await prisma.institution.count({
      where: {
        commissionRate: {
          gte: 25
        },
        isApproved: true,
        status: 'ACTIVE'
      }
    });

    // Simulate potential revenue impact
    const featuredRevenueImpact = featuredInstitutions * 500; // $500 per featured institution
    const premiumRevenueImpact = premiumInstitutions * 1000; // $1000 per premium institution
    const commissionOptimizationImpact = (veryHighCommissionInstitutions * 300) + (highCommissionInstitutions * 150);

    console.log(`   Featured institutions: ${featuredInstitutions} ($${featuredRevenueImpact.toLocaleString()} potential)`);
    console.log(`   Premium institutions: ${premiumInstitutions} ($${premiumRevenueImpact.toLocaleString()} potential)`);
    console.log(`   High commission institutions (≥20%): ${highCommissionInstitutions} ($${(highCommissionInstitutions * 150).toLocaleString()} potential)`);
    console.log(`   Very high commission institutions (≥25%): ${veryHighCommissionInstitutions} ($${(veryHighCommissionInstitutions * 300).toLocaleString()} potential)`);

    // Test 7: Test API endpoint
    console.log('\n7. Testing API Endpoint...');
    
    try {
      const response = await fetch('http://localhost:3000/api/courses/public');
      if (response.ok) {
        const apiCourses = await response.json();
        console.log(`   API returned ${apiCourses.length} courses`);
        
        if (apiCourses.length > 0) {
          const firstCourse = apiCourses[0];
          console.log(`   First course: ${firstCourse.title}`);
          console.log(`   Priority score: ${firstCourse.priorityScore || 'N/A'}`);
          console.log(`   Commission band: ${firstCourse.commissionRateBand?.band || 'N/A'}`);
          console.log(`   Effective subscription plan: ${firstCourse.effectiveSubscriptionPlan || 'N/A'}`);
        }
      } else {
        console.log('   ❌ API endpoint not accessible');
      }
    } catch (error) {
      console.log('   ⚠️  API endpoint test skipped (server may not be running)');
    }

    console.log('\n✅ Prioritization System Test Complete!');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`   - Total courses tested: ${courses.length}`);
    console.log(`   - Advertising eligible: ${advertisingEligible.length}`);
    console.log(`   - Featured institutions: ${featuredInstitutions}`);
    console.log(`   - Premium institutions: ${premiumInstitutions}`);
    console.log(`   - High commission institutions (≥20%): ${highCommissionInstitutions}`);
    console.log(`   - Very high commission institutions (≥25%): ${veryHighCommissionInstitutions}`);
    console.log(`   - Current commission revenue: $${commissionRev.toLocaleString()}`);
    console.log(`   - Potential additional revenue: $${(featuredRevenueImpact + premiumRevenueImpact + commissionOptimizationImpact).toLocaleString()}`);

  } catch (error) {
    logger.error('❌ Error testing prioritization system:');
  } finally {
    await prisma.$disconnect();
  }
}

testPrioritizationSystem(); 