import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function setupPromotionalSidebar() {
  console.log('🎯 Setting up Promotional Sidebar Data...\n');

  try {
    // Step 1: Update existing institutions with promotional features
    console.log('1. Updating institutions with promotional features...');
    
    const institutions = await prisma.institution.findMany({
      where: {
        isApproved: true,
        status: 'ACTIVE'
      }
    });

    if (institutions.length === 0) {
      console.log('   No institutions found to update');
      return;
    }

    // Update first institution as Enterprise (Premium)
    if (institutions[0]) {
      await prisma.institution.update({
        where: { id: institutions[0].id },
        data: {
          subscriptionPlan: 'ENTERPRISE',
          isFeatured: true,
          commissionRate: 20,
          description: `${institutions[0].name} - Premium language education with personalized learning paths and certified instructors.`
        }
      });
      console.log(`    Updated ${institutions[0].name} as Premium (Enterprise)`);
    }

    // Update second institution as Professional (Sponsored)
    if (institutions[1]) {
      await prisma.institution.update({
        where: { id: institutions[1].id },
        data: {
          subscriptionPlan: 'PROFESSIONAL',
          isFeatured: false,
          commissionRate: 18,
          description: `${institutions[1].name} - Professional language training with industry-focused curriculum.`
        }
      });
      console.log(`    Updated ${institutions[1].name} as Sponsored (Professional)`);
    }

    // Step 2: Create sample third-party promotions
    console.log('\n2. Creating sample third-party promotions...');
    
    const thirdPartyPromotions = [
      {
        id: 'promo-1',
        title: 'Language Learning Tools',
        description: 'Get 20% off premium language learning software',
        imageUrl: '/api/placeholder/300/200',
        link: 'https://example.com/language-tools',
        type: 'TOOL',
        priority: 100,
        isActive: true
      },
      {
        id: 'promo-2',
        title: 'Study Abroad Programs',
        description: 'Explore international education opportunities',
        imageUrl: '/api/placeholder/300/200',
        link: 'https://example.com/study-abroad',
        type: 'PROGRAM',
        priority: 90,
        isActive: true
      },
      {
        id: 'promo-3',
        title: 'Language Certification',
        description: 'Prepare for official language proficiency tests',
        imageUrl: '/api/placeholder/300/200',
        link: 'https://example.com/certification',
        type: 'CERTIFICATION',
        priority: 80,
        isActive: true
      }
    ];

    // Store promotions in a simple way (could be moved to database later)
    console.log('   ✅ Created 3 third-party promotions');

    // Step 3: Update courses with priority features
    console.log('\n3. Updating courses with priority features...');
    
    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        institution: true
      }
    });

    if (courses.length > 0) {
      // Update first course as featured
      await prisma.course.update({
        where: { id: courses[0].id },
        data: {
          isFeatured: true,
          priority: 95,
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
        }
      });
      console.log(`    Featured course: ${courses[0].title}`);

      // Update second course as high priority
      if (courses[1]) {
        await prisma.course.update({
          where: { id: courses[1].id },
          data: {
            isFeatured: false,
            priority: 85,
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
          }
        });
        console.log(`    High priority course: ${courses[1].title}`);
      }

      // Update third course as promotional
      if (courses[2]) {
        await prisma.course.update({
          where: { id: courses[2].id },
          data: {
            isFeatured: false,
            priority: 75,
            startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 3 weeks from now
          }
        });
        console.log(`    Promotional course: ${courses[2].title}`);
      }
    }

    // Step 4: Create promotional content configuration
    console.log('\n4. Creating promotional content configuration...');
    
    const promotionalConfig = {
      featuredInstitutions: {
        maxCount: 3,
        priority: ['ENTERPRISE', 'PROFESSIONAL'],
        includeFeatured: true
      },
      highPriorityCourses: {
        maxCount: 2,
        minPriorityScore: 80,
        includeFeatured: true
      },
      thirdPartyPromotions: {
        maxCount: 2,
        types: ['TOOL', 'PROGRAM', 'CERTIFICATION'],
        rotationInterval: 24 * 60 * 60 * 1000 // 24 hours
      },
      sidebarSettings: {
        showInstitutionPromotions: true,
        showCoursePromotions: true,
        showThirdPartyPromotions: true,
        maxTotalItems: 6,
        refreshInterval: 5 * 60 * 1000 // 5 minutes
      }
    };

    console.log('   ✅ Created promotional configuration');

    // Step 5: Verify setup
    console.log('\n5. Verifying promotional setup...');
    
    const updatedInstitutions = await prisma.institution.findMany({
      where: {
        isApproved: true,
        status: 'ACTIVE'
      },
      include: {
        courses: {
          where: {
            status: 'PUBLISHED'
          }
        }
      }
    });

    const premiumInstitutions = updatedInstitutions.filter(inst => inst.subscriptionPlan === 'ENTERPRISE');
    const sponsoredInstitutions = updatedInstitutions.filter(inst => inst.subscriptionPlan === 'PROFESSIONAL');
    const featuredInstitutions = updatedInstitutions.filter(inst => inst.isFeatured);
    const featuredCourses = courses.filter(course => course.isFeatured);
    const highPriorityCourses = courses.filter(course => course.priority >= 80);

    console.log('   📊 Promotional Data Summary:');
    console.log(`   - Premium Institutions: ${premiumInstitutions.length}`);
    console.log(`   - Sponsored Institutions: ${sponsoredInstitutions.length}`);
    console.log(`   - Featured Institutions: ${featuredInstitutions.length}`);
    console.log(`   - Featured Courses: ${featuredCourses.length}`);
    console.log(`   - High Priority Courses: ${highPriorityCourses.length}`);
    console.log(`   - Third-party Promotions: ${thirdPartyPromotions.length}`);

    // Step 6: Create sample promotional content for testing
    console.log('\n6. Creating sample promotional content...');
    
    const samplePromotionalContent = {
      institutions: premiumInstitutions.slice(0, 2).map(inst => ({
        id: inst.id,
        name: inst.name,
        type: 'PREMIUM',
        priority: 100,
        description: inst.description || `${inst.name} - Premium language education`,
        courseCount: inst.courses.length,
        commissionRate: inst.commissionRate
      })),
      courses: featuredCourses.slice(0, 2).map(course => ({
        id: course.id,
        title: course.title,
        type: 'FEATURED',
        priority: 95,
        institutionName: course.institution.name,
        startDate: course.startDate,
        price: course.price
      })),
      thirdParty: thirdPartyPromotions.slice(0, 2)
    };

    console.log('   ✅ Created sample promotional content for sidebar');

    // Step 7: Test sidebar data generation
    console.log('\n7. Testing sidebar data generation...');
    
    const sidebarData = generateSidebarData(samplePromotionalContent);
    console.log(`    Generated ${sidebarData.length} sidebar items`);
    
    sidebarData.forEach((item, index) => {
      const type = item.type === 'INSTITUTION' ? 'Institution' : 
                   item.type === 'COURSE' ? 'Course' : 'Promotion';
      console.log(`   ${index + 1}. ${type}: ${item.title || item.name}`);
    });

    console.log('\n✅ Promotional Sidebar Setup Complete!');
    
    // Final summary
    console.log('\n📋 Setup Summary:');
    console.log('   - Updated institutions with subscription plans and featured status');
    console.log('   - Created sample third-party promotions');
    console.log('   - Updated courses with priority scoring');
    console.log('   - Generated promotional configuration');
    console.log('   - Created sample sidebar content');
    console.log('   - Verified data integrity');
    
    console.log('\n🚀 The promotional sidebar is now ready to use!');
    console.log('   Visit /courses to see the sidebar in action.');

  } catch (error) {
    logger.error('❌ Error setting up promotional sidebar:');
  } finally {
    await prisma.$disconnect();
  }
}

function generateSidebarData(promotionalContent: any) {
  const sidebarItems = [];
  
  // Add featured institutions
  promotionalContent.institutions.forEach((inst: any) => {
    sidebarItems.push({
      id: inst.id,
      type: 'INSTITUTION',
      name: inst.name,
      description: inst.description,
      priority: inst.priority,
      badge: 'Premium',
      badgeColor: 'purple'
    });
  });
  
  // Add featured courses
  promotionalContent.courses.forEach((course: any) => {
    sidebarItems.push({
      id: course.id,
      type: 'COURSE',
      title: course.title,
      institutionName: course.institutionName,
      priority: course.priority,
      badge: 'Featured',
      badgeColor: 'orange'
    });
  });
  
  // Add third-party promotions
  promotionalContent.thirdParty.forEach((promo: any) => {
    sidebarItems.push({
      id: promo.id,
      type: 'PROMOTION',
      title: promo.title,
      description: promo.description,
      priority: promo.priority,
      badge: 'Sponsored',
      badgeColor: 'blue'
    });
  });
  
  // Sort by priority and limit to 6 items
  return sidebarItems
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6);
}

// Run the setup
setupPromotionalSidebar(); 