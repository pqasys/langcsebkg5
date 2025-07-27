import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testUpdatedPriorityAlgorithm() {
  console.log('🧪 Testing Updated Priority Placement Algorithm...\n');

  try {
    // Test 1: Check course prioritization with new unified architecture
    console.log('1. Testing Course Prioritization with Unified Architecture...');
    
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
      
      // Featured institution bonus
      if (course.institution.isFeatured) {
        priorityScore += 1000;
      }
      
      // Commission rate bonus
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

    // Test 2: Check commission rate band distribution
    console.log('\n2. Testing Commission Rate Band Distribution...');
    
    const bandStats = coursesWithPriority.reduce((acc, course) => {
      acc[course.commissionBand] = (acc[course.commissionBand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('   Commission rate band distribution:');
    Object.entries(bandStats).forEach(([band, count]) => {
      const description = band === 'VERY_HIGH' ? 'Very High (≥25%)' :
                         band === 'HIGH' ? 'High (≥20%)' :
                         band === 'MEDIUM' ? 'Medium (≥15%)' : 'Low (<15%)';
      console.log(`   - ${description}: ${count} courses`);
    });

    // Test 3: Check institutions without subscriptions
    console.log('\n3. Testing Institutions Without Subscriptions...');
    
    const institutionsWithoutSubs = coursesWithPriority.filter(course => !course.hasActiveSubscription);
    console.log(`   Found ${institutionsWithoutSubs.length} courses from institutions without active subscriptions`);
    
    if (institutionsWithoutSubs.length > 0) {
      console.log('   Top courses from non-subscribed institutions:');
      institutionsWithoutSubs.slice(0, 3).forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.title} (${course.institution}) - Score: ${course.priorityScore}`);
        console.log(`      Commission: ${course.commissionRate}% (${course.commissionBand}), Featured: ${course.isFeatured}`);
      });
    }

    // Test 4: Check subscription tier distribution
    console.log('\n4. Testing Subscription Tier Distribution...');
    
    const tierStats = coursesWithPriority.reduce((acc, course) => {
      acc[course.subscriptionTier] = (acc[course.subscriptionTier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('   Subscription tier distribution:');
    Object.entries(tierStats).forEach(([tier, count]) => {
      console.log(`   - ${tier}: ${count} courses`);
    });

    // Test 5: Check priority score breakdown
    console.log('\n5. Testing Priority Score Breakdown...');
    
    const scoreBreakdown = coursesWithPriority.map(course => {
      const commissionPoints = (course.commissionRate || 0) * 10;
      const featuredPoints = course.isFeatured ? 1000 : 0;
      
      const planBonus = {
        'STARTER': 25,
        'BASIC': 0,
        'PROFESSIONAL': 50,
        'ENTERPRISE': 100
      };
      const planPoints = planBonus[course.subscriptionPlan as keyof typeof planBonus] || 0;
      
      return {
        title: course.title,
        institution: course.institution,
        totalScore: course.priorityScore,
        commissionPoints,
        featuredPoints,
        planPoints,
        otherPoints: course.priorityScore - commissionPoints - featuredPoints - planPoints
      };
    });

    console.log('   Priority score breakdown (top 3):');
    scoreBreakdown.slice(0, 3).forEach((breakdown, index) => {
      console.log(`   ${index + 1}. ${breakdown.title} (${breakdown.institution})`);
      console.log(`      Total: ${breakdown.totalScore} | Commission: ${breakdown.commissionPoints} | Featured: ${breakdown.featuredPoints} | Plan: ${breakdown.planPoints} | Other: ${breakdown.otherPoints}`);
    });

    // Test 6: Verify API endpoint
    console.log('\n6. Testing API Endpoint...');
    
    try {
      const response = await fetch('http://localhost:3000/api/courses/public');
      if (response.ok) {
        const apiCourses = await response.json();
        console.log(`    API returned ${apiCourses.length} courses`);
        
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

    console.log('\n✅ Updated Priority Algorithm Test Complete!');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`   - Total courses tested: ${courses.length}`);
    console.log(`   - Courses with active subscriptions: ${coursesWithPriority.filter(c => c.hasActiveSubscription).length}`);
    console.log(`   - Courses from non-subscribed institutions: ${institutionsWithoutSubs.length}`);
    console.log(`   - Very high commission courses (≥25%): ${bandStats['VERY_HIGH'] || 0}`);
    console.log(`   - High commission courses (≥20%): ${bandStats['HIGH'] || 0}`);
    console.log(`   - Featured institutions: ${coursesWithPriority.filter(c => c.isFeatured).length}`);

  } catch (error) {
    logger.error('❌ Error testing updated priority algorithm:');
  } finally {
    await prisma.$disconnect();
  }
}

testUpdatedPriorityAlgorithm(); 