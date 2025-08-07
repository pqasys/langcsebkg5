import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeCourseTypes() {
  try {
    console.log('🔍 Analyzing Course Types and Enrollment Patterns...\n');

    // Get all courses with their classification fields
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        institutionId: true,
        isPlatformCourse: true,
        enrollmentType: true,
        courseType: true,
        deliveryMode: true,
        hasLiveClasses: true,
        liveClassType: true,
        requiresSubscription: true,
        subscriptionTier: true,
        status: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    console.log(`📊 Total Courses: ${courses.length}\n`);

    // Analyze institution vs platform courses
    const institutionCourses = courses.filter(c => c.institutionId);
    const platformCourses = courses.filter(c => !c.institutionId || c.isPlatformCourse);

    console.log(`🏫 Institution Courses: ${institutionCourses.length}`);
    console.log(`🌐 Platform Courses: ${platformCourses.length}\n`);

    // Analyze enrollment types
    const enrollmentTypeCounts = courses.reduce((acc, course) => {
      const type = course.enrollmentType || 'NOT_SET';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📈 Enrollment Type Distribution:');
    Object.entries(enrollmentTypeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} courses`);
    });
    console.log();

    // Analyze course types
    const courseTypeCounts = courses.reduce((acc, course) => {
      const type = course.courseType || 'NOT_SET';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📚 Course Type Distribution:');
    Object.entries(courseTypeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} courses`);
    });
    console.log();

    // Analyze delivery modes
    const deliveryModeCounts = courses.reduce((acc, course) => {
      const mode = course.deliveryMode || 'NOT_SET';
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('🚀 Delivery Mode Distribution:');
    Object.entries(deliveryModeCounts).forEach(([mode, count]) => {
      console.log(`  ${mode}: ${count} courses`);
    });
    console.log();

    // Analyze live classes
    const liveClassCounts = courses.reduce((acc, course) => {
      const hasLive = course.hasLiveClasses ? 'YES' : 'NO';
      acc[hasLive] = (acc[hasLive] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('🎥 Live Classes Distribution:');
    Object.entries(liveClassCounts).forEach(([hasLive, count]) => {
      console.log(`  ${hasLive}: ${count} courses`);
    });
    console.log();

    // Show some example courses
    console.log('📋 Sample Courses:');
    courses.slice(0, 5).forEach(course => {
      console.log(`  "${course.title}"`);
      console.log(`    Institution: ${course.institutionId ? 'Yes' : 'No'}`);
      console.log(`    Platform: ${course.isPlatformCourse ? 'Yes' : 'No'}`);
      console.log(`    Enrollment Type: ${course.enrollmentType || 'NOT_SET'}`);
      console.log(`    Course Type: ${course.courseType || 'NOT_SET'}`);
      console.log(`    Delivery Mode: ${course.deliveryMode || 'NOT_SET'}`);
      console.log(`    Has Live Classes: ${course.hasLiveClasses ? 'Yes' : 'No'}`);
      console.log(`    Live Class Type: ${course.liveClassType || 'N/A'}`);
      console.log(`    Requires Subscription: ${course.requiresSubscription ? 'Yes' : 'No'}`);
      console.log(`    Enrollments: ${course._count.enrollments}`);
      console.log();
    });

    // Check for inconsistencies
    console.log('⚠️  Potential Inconsistencies:');
    
    // Courses with both institutionId and isPlatformCourse = true
    const inconsistentPlatform = courses.filter(c => c.institutionId && c.isPlatformCourse);
    if (inconsistentPlatform.length > 0) {
      console.log(`  - ${inconsistentPlatform.length} courses have both institutionId and isPlatformCourse=true`);
    }

    // Courses with hasLiveClasses=false but liveClassType set
    const inconsistentLive = courses.filter(c => !c.hasLiveClasses && c.liveClassType);
    if (inconsistentLive.length > 0) {
      console.log(`  - ${inconsistentLive.length} courses have hasLiveClasses=false but liveClassType is set`);
    }

    // Courses with conflicting courseType and deliveryMode
    const conflictingTypes = courses.filter(c => 
      c.courseType === 'LIVE_ONLY' && c.deliveryMode === 'SELF_PACED' ||
      c.courseType === 'STANDARD' && c.deliveryMode === 'LIVE_ONLY'
    );
    if (conflictingTypes.length > 0) {
      console.log(`  - ${conflictingTypes.length} courses have conflicting courseType and deliveryMode`);
    }

    if (inconsistentPlatform.length === 0 && inconsistentLive.length === 0 && conflictingTypes.length === 0) {
      console.log('  ✅ No obvious inconsistencies found');
    }

    console.log('\n🎯 Business Logic Analysis:');
    console.log('Based on the data, here are the actual course patterns:');
    
    // Analyze real patterns
    const patterns = courses.reduce((acc, course) => {
      const pattern = {
        hasInstitution: !!course.institutionId,
        isPlatform: !!course.isPlatformCourse,
        hasLive: !!course.hasLiveClasses,
        requiresSub: !!course.requiresSubscription
      };
      
      const key = JSON.stringify(pattern);
      if (!acc[key]) {
        acc[key] = { pattern, count: 0, examples: [] };
      }
      acc[key].count++;
      if (acc[key].examples.length < 3) {
        acc[key].examples.push(course.title);
      }
      return acc;
    }, {} as Record<string, { pattern: any, count: number, examples: string[] }>);

    Object.entries(patterns).forEach(([key, data]) => {
      console.log(`  Pattern ${data.count} courses:`);
      console.log(`    Institution: ${data.pattern.hasInstitution}`);
      console.log(`    Platform: ${data.pattern.isPlatform}`);
      console.log(`    Live Classes: ${data.pattern.hasLive}`);
      console.log(`    Requires Subscription: ${data.pattern.requiresSub}`);
      console.log(`    Examples: ${data.examples.join(', ')}`);
      console.log();
    });

  } catch (error) {
    console.error('Error analyzing course types:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeCourseTypes();
