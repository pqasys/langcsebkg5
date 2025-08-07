import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function simplifyCourseClassification() {
  try {
    console.log('🔧 Simplifying Course Classification...\n');

    // Step 1: Analyze current course classification
    console.log('📊 Analyzing Current Course Classification...\n');
    
    const allCourses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        courseType: true,
        deliveryMode: true,
        enrollmentType: true,
        hasLiveClasses: true,
        liveClassType: true,
        liveClassFrequency: true,
        liveClassSchedule: true,
        isPlatformCourse: true,
        requiresSubscription: true,
        subscriptionTier: true
      }
    });

    console.log(`📚 Found ${allCourses.length} courses to analyze`);

    // Step 2: Show current classification patterns
    console.log('\n📊 Current Classification Analysis:');
    
    const classificationStats = {
      courseTypes: new Set<string>(),
      deliveryModes: new Set<string>(),
      enrollmentTypes: new Set<string>(),
      liveClassTypes: new Set<string>(),
      platformCourses: 0,
      subscriptionCourses: 0,
      liveClassCourses: 0
    };

    allCourses.forEach(course => {
      classificationStats.courseTypes.add(course.courseType || 'NULL');
      classificationStats.deliveryModes.add(course.deliveryMode || 'NULL');
      classificationStats.enrollmentTypes.add(course.enrollmentType || 'NULL');
      if (course.liveClassType) classificationStats.liveClassTypes.add(course.liveClassType);
      if (course.isPlatformCourse) classificationStats.platformCourses++;
      if (course.requiresSubscription) classificationStats.subscriptionCourses++;
      if (course.hasLiveClasses) classificationStats.liveClassCourses++;
    });

    console.log(`   • Course Types: ${Array.from(classificationStats.courseTypes).join(', ')}`);
    console.log(`   • Delivery Modes: ${Array.from(classificationStats.deliveryModes).join(', ')}`);
    console.log(`   • Enrollment Types: ${Array.from(classificationStats.enrollmentTypes).join(', ')}`);
    console.log(`   • Live Class Types: ${Array.from(classificationStats.liveClassTypes).join(', ')}`);
    console.log(`   • Platform Courses: ${classificationStats.platformCourses}`);
    console.log(`   • Subscription Courses: ${classificationStats.subscriptionCourses}`);
    console.log(`   • Live Class Courses: ${classificationStats.liveClassCourses}`);

    // Step 3: Show the three scenarios with current data
    console.log('\n🎯 Three Scenarios Analysis:');
    
    const liveClassCourses = allCourses.filter(c => c.hasLiveClasses);
    const platformCourses = allCourses.filter(c => c.isPlatformCourse);
    const institutionCourses = allCourses.filter(c => !c.isPlatformCourse);

    console.log(`\n📚 Scenario 1: Institution Live Classes (${liveClassCourses.filter(c => !c.isPlatformCourse).length} courses)`);
    liveClassCourses.filter(c => !c.isPlatformCourse).forEach(course => {
      console.log(`   • ${course.title}`);
      console.log(`     - Current: ${course.courseType} | ${course.deliveryMode} | ${course.enrollmentType}`);
      console.log(`     - Simplified: hasLiveClasses=true, isPlatformCourse=false`);
    });

    console.log(`\n🌐 Scenario 2: Platform-Wide Live Classes (${liveClassCourses.filter(c => c.isPlatformCourse).length} courses)`);
    liveClassCourses.filter(c => c.isPlatformCourse).forEach(course => {
      console.log(`   • ${course.title}`);
      console.log(`     - Current: ${course.courseType} | ${course.deliveryMode} | ${course.enrollmentType}`);
      console.log(`     - Simplified: hasLiveClasses=true, isPlatformCourse=true, requiresSubscription=true`);
    });

    console.log(`\n📖 Scenario 3: Regular Courses (${allCourses.filter(c => !c.hasLiveClasses).length} courses)`);
    allCourses.filter(c => !c.hasLiveClasses).forEach(course => {
      console.log(`   • ${course.title}`);
      console.log(`     - Current: ${course.courseType} | ${course.deliveryMode} | ${course.enrollmentType}`);
      console.log(`     - Simplified: hasLiveClasses=false`);
    });

    // Step 4: Create migration plan
    console.log('\n📝 Migration Plan:');
    console.log(`
🎯 SIMPLIFIED COURSE CLASSIFICATION STRUCTURE:

✅ ESSENTIAL FIELDS (Keep):
   • hasLiveClasses: boolean
   • liveClassType: string?
   • liveClassFrequency: string?
   • liveClassSchedule: Json?
   • isPlatformCourse: boolean
   • requiresSubscription: boolean
   • subscriptionTier: string?

❌ REDUNDANT FIELDS (Remove):
   • courseType: string
   • deliveryMode: string
   • enrollmentType: string

🆕 MARKETING FIELDS (Add):
   • marketingType: 'IN_PERSON' | 'LIVE_ONLINE' | 'SELF_PACED' | 'BLENDED'
   • marketingDescription: string
`);

    // Step 5: Create schema migration script
    console.log('\n📄 Schema Migration Script:');
    
    const migrationScript = `
-- Migration: Simplify Course Classification
-- File: migrations/simplify_course_classification.sql

-- Step 1: Add marketing fields
ALTER TABLE course ADD COLUMN marketingType VARCHAR(50) DEFAULT 'SELF_PACED';
ALTER TABLE course ADD COLUMN marketingDescription TEXT;

-- Step 2: Update marketing fields based on current classification
UPDATE course 
SET marketingType = CASE 
    WHEN hasLiveClasses = true AND isPlatformCourse = true THEN 'LIVE_ONLINE'
    WHEN hasLiveClasses = true AND isPlatformCourse = false THEN 'LIVE_ONLINE'
    WHEN hasLiveClasses = false AND isPlatformCourse = true THEN 'SELF_PACED'
    ELSE 'SELF_PACED'
END,
marketingDescription = CONCAT(title, ' - ', 
    CASE 
        WHEN hasLiveClasses = true AND isPlatformCourse = true THEN 'Live interactive sessions with global participants'
        WHEN hasLiveClasses = true AND isPlatformCourse = false THEN 'Interactive live sessions'
        WHEN hasLiveClasses = false AND isPlatformCourse = true THEN 'Self-paced learning with platform resources'
        ELSE 'Self-paced learning'
    END
);

-- Step 3: Remove redundant fields (after confirming marketing data is correct)
-- ALTER TABLE course DROP COLUMN courseType;
-- ALTER TABLE course DROP COLUMN deliveryMode;
-- ALTER TABLE course DROP COLUMN enrollmentType;

-- Step 4: Update Prisma schema file (prisma/schema.prisma)
-- Remove the redundant fields from the Course model
-- Add the marketing fields to the Course model
`;

    console.log(migrationScript);

    // Step 6: Show the three scenarios with simplified structure
    console.log('\n📚 Three Scenarios with Simplified Structure:');
    
    console.log(`
🎯 SCENARIO 1: Institution Course (Live Classes Only)
   {
     hasLiveClasses: true,
     liveClassType: 'CONVERSATION',
     liveClassFrequency: 'WEEKLY',
     liveClassSchedule: { dayOfWeek: 'Wednesday', time: '19:00', timezone: 'UTC-5' },
     isPlatformCourse: false,
     requiresSubscription: false,
     marketingType: 'LIVE_ONLINE' // or 'IN_PERSON' for marketing
   }

🎯 SCENARIO 2: Institution Course (Blended Learning)
   {
     hasLiveClasses: true,
     liveClassType: 'COMPREHENSIVE',
     liveClassFrequency: 'BIWEEKLY',
     liveClassSchedule: { dayOfWeek: 'Saturday', time: '14:00', timezone: 'UTC' },
     isPlatformCourse: false,
     requiresSubscription: false,
     marketingType: 'BLENDED'
   }

🎯 SCENARIO 3: Platform-Wide Course (Live Classes Only)
   {
     hasLiveClasses: true,
     liveClassType: 'COMPREHENSIVE',
     liveClassFrequency: 'BIWEEKLY',
     liveClassSchedule: { dayOfWeek: 'Saturday', time: '14:00', timezone: 'UTC' },
     isPlatformCourse: true,
     requiresSubscription: true,
     subscriptionTier: 'PREMIUM',
     marketingType: 'LIVE_ONLINE'
   }
`);

    // Step 7: Show current live class courses with simplified view
    console.log('\n🎥 Current Live Class Courses (Simplified View):');
    
    liveClassCourses.forEach((course, index) => {
      console.log(`\n🎯 Live Course ${index + 1}: ${course.title}`);
      console.log(`   📊 Simplified Classification:`);
      console.log(`      • Has Live Classes: ${course.hasLiveClasses}`);
      console.log(`      • Live Class Type: ${course.liveClassType || 'Not set'}`);
      console.log(`      • Live Class Frequency: ${course.liveClassFrequency || 'Not set'}`);
      console.log(`      • Platform Course: ${course.isPlatformCourse}`);
      console.log(`      • Requires Subscription: ${course.requiresSubscription}`);
      console.log(`      • Subscription Tier: ${course.subscriptionTier || 'N/A'}`);
      
      // Determine marketing type
      let marketingType = 'SELF_PACED';
      if (course.hasLiveClasses) {
        if (course.isPlatformCourse) {
          marketingType = 'LIVE_ONLINE';
        } else {
          marketingType = 'LIVE_ONLINE'; // or 'BLENDED' depending on liveClassType
        }
      }
      console.log(`      • Marketing Type: ${marketingType}`);
    });

    console.log('\n✅ Course Classification Simplification Analysis Complete!');
    console.log('\n🎯 Next Steps:');
    console.log('   1. Review the migration script above');
    console.log('   2. Update Prisma schema file to remove redundant fields');
    console.log('   3. Add marketing fields to Prisma schema');
    console.log('   4. Run the migration script');
    console.log('   5. Update API endpoints to use simplified fields');
    console.log('   6. Update UI forms to reflect simplified structure');
    console.log('   7. Test the simplified classification system');

    console.log('\n🔧 Key Benefits of Simplification:');
    console.log('   • Eliminates redundant fields (courseType, deliveryMode, enrollmentType)');
    console.log('   • Clearer logic with essential fields only');
    console.log('   • Marketing flexibility with separate marketing fields');
    console.log('   • Easier to understand and maintain');
    console.log('   • Supports all three live class scenarios');

  } catch (error) {
    console.error('❌ Error analyzing course classification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simplifyCourseClassification();
