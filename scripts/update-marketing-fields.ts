import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateMarketingFields() {
  try {
    console.log('🎨 Updating Marketing Fields for Courses...\n');

    // Get all courses
    const allCourses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        hasLiveClasses: true,
        liveClassType: true,
        isPlatformCourse: true,
        requiresSubscription: true,
        subscriptionTier: true,
        marketingType: true,
        marketingDescription: true
      }
    });

    console.log(`📚 Found ${allCourses.length} courses to update`);

    for (const course of allCourses) {
      console.log(`\n🔄 Processing: ${course.title}`);
      
      // Determine marketing type based on simplified classification
      let marketingType = 'SELF_PACED';
      let marketingDescription = course.title;

      if (course.hasLiveClasses) {
        if (course.isPlatformCourse) {
          marketingType = 'LIVE_ONLINE';
          marketingDescription = `${course.title} - Live interactive sessions with global participants`;
        } else {
          // Institution course with live classes
          if (course.liveClassType === 'CONVERSATION') {
            marketingType = 'LIVE_ONLINE';
            marketingDescription = `${course.title} - Interactive live conversation practice`;
          } else {
            marketingType = 'BLENDED';
            marketingDescription = `${course.title} - Combination of self-paced learning and live sessions`;
          }
        }
      } else if (course.isPlatformCourse) {
        marketingType = 'SELF_PACED';
        marketingDescription = `${course.title} - Self-paced learning with platform resources`;
      } else {
        marketingType = 'SELF_PACED';
        marketingDescription = `${course.title} - Self-paced learning`;
      }

      // Update course with marketing fields
      await prisma.course.update({
        where: { id: course.id },
        data: {
          marketingType: marketingType,
          marketingDescription: marketingDescription
        }
      });

      console.log(`   ✅ Updated: ${course.title}`);
      console.log(`      • Marketing Type: ${marketingType}`);
      console.log(`      • Marketing Description: ${marketingDescription}`);
      console.log(`      • Has Live Classes: ${course.hasLiveClasses}`);
      console.log(`      • Platform Course: ${course.isPlatformCourse}`);
      console.log(`      • Requires Subscription: ${course.requiresSubscription}`);
    }

    // Show summary of updated courses
    console.log('\n📊 Marketing Fields Update Summary:');
    
    const marketingTypes = await prisma.course.groupBy({
      by: ['marketingType'],
      _count: {
        marketingType: true
      }
    });

    marketingTypes.forEach(type => {
      console.log(`   • ${type.marketingType}: ${type._count.marketingType} courses`);
    });

    // Show live class courses specifically
    console.log('\n🎥 Live Class Courses with Marketing Fields:');
    
    const liveClassCourses = await prisma.course.findMany({
      where: { hasLiveClasses: true },
      select: {
        id: true,
        title: true,
        marketingType: true,
        marketingDescription: true,
        liveClassType: true,
        isPlatformCourse: true,
        requiresSubscription: true
      }
    });

    liveClassCourses.forEach((course, index) => {
      console.log(`\n🎯 Live Course ${index + 1}: ${course.title}`);
      console.log(`   📊 Marketing Configuration:`);
      console.log(`      • Marketing Type: ${course.marketingType}`);
      console.log(`      • Marketing Description: ${course.marketingDescription}`);
      console.log(`      • Live Class Type: ${course.liveClassType}`);
      console.log(`      • Platform Course: ${course.isPlatformCourse}`);
      console.log(`      • Requires Subscription: ${course.requiresSubscription}`);
    });

    console.log('\n✅ Marketing Fields Update Complete!');
    console.log('\n🎯 Simplified Classification Benefits:');
    console.log('   • Eliminated redundant fields (courseType, deliveryMode, enrollmentType)');
    console.log('   • Added marketing flexibility with separate marketing fields');
    console.log('   • Clearer course classification logic');
    console.log('   • Easier to maintain and understand');
    console.log('   • Supports all three live class scenarios');

  } catch (error) {
    console.error('❌ Error updating marketing fields:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateMarketingFields();
