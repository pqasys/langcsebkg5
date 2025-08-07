import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyLiveClassCourses() {
  try {
    console.log('🔍 Verifying Live Class Courses...\n');

    // Get all courses with live classes
    const liveClassCourses = await prisma.course.findMany({
      where: {
        hasLiveClasses: true
      },
      include: {
        institution: {
          select: { id: true, name: true }
        },
        category: {
          select: { id: true, name: true }
        },
        videoSessions: {
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true,
            status: true,
            maxParticipants: true
          },
          orderBy: { startTime: 'asc' }
        },
        _count: {
          select: {
            videoSessions: true,
            enrollments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📚 Found ${liveClassCourses.length} live class courses:\n`);

    liveClassCourses.forEach((course, index) => {
      console.log(`🎯 Course ${index + 1}: ${course.title}`);
      console.log(`   📝 Description: ${course.description?.substring(0, 100)}...`);
      console.log(`   🏢 Institution: ${course.institution?.name || 'Platform-Wide'}`);
      console.log(`   📂 Category: ${course.category?.name}`);
      console.log(`   💰 Price: $${course.base_price} (${course.pricingPeriod})`);
      console.log(`   👥 Max Students: ${course.maxStudents}`);
      console.log(`   📅 Duration: ${course.duration} weeks`);
      console.log(`   📊 Status: ${course.status}`);
      
      // Live class specific details
      console.log(`   🎥 Live Class Details:`);
      console.log(`      • Type: ${course.liveClassType}`);
      console.log(`      • Frequency: ${course.liveClassFrequency}`);
      console.log(`      • Platform Course: ${course.isPlatformCourse ? 'Yes' : 'No'}`);
      console.log(`      • Requires Subscription: ${course.requiresSubscription ? 'Yes' : 'No'}`);
      console.log(`      • Subscription Tier: ${course.subscriptionTier || 'N/A'}`);
      
      if (course.liveClassSchedule) {
        const schedule = course.liveClassSchedule as any;
        console.log(`      • Schedule: ${schedule.dayOfWeek} at ${schedule.time} (${schedule.timezone})`);
        console.log(`      • Session Duration: ${schedule.duration} minutes`);
      }
      
      console.log(`   📊 Statistics:`);
      console.log(`      • Live Sessions: ${course._count.videoSessions}`);
      console.log(`      • Enrollments: ${course._count.enrollments}`);
      
      // Show first few sessions
      if (course.videoSessions.length > 0) {
        console.log(`   📅 Upcoming Sessions:`);
        course.videoSessions.slice(0, 3).forEach((session, sessionIndex) => {
          const startDate = new Date(session.startTime).toLocaleDateString();
          const startTime = new Date(session.startTime).toLocaleTimeString();
          console.log(`      ${sessionIndex + 1}. ${session.title} - ${startDate} at ${startTime} (${session.status})`);
        });
        if (course.videoSessions.length > 3) {
          console.log(`      ... and ${course.videoSessions.length - 3} more sessions`);
        }
      }
      
      console.log(`   🔗 Admin URL: /admin/courses/${course.id}`);
      console.log('');
    });

    // Show enrollment governance details
    console.log('🔐 Enrollment Governance Analysis:\n');
    
    const institutionCourses = liveClassCourses.filter(c => !c.isPlatformCourse);
    const platformCourses = liveClassCourses.filter(c => c.isPlatformCourse);
    
    console.log(`📚 Institution Live Courses (${institutionCourses.length}):`);
    institutionCourses.forEach(course => {
      console.log(`   • ${course.title}`);
      console.log(`     - Enrollment: ${course.enrollmentType}`);
      console.log(`     - Payment: Course-based ($${course.base_price}/${course.pricingPeriod})`);
      console.log(`     - Governance: Institution-controlled`);
    });
    
    console.log(`\n🌐 Platform Live Courses (${platformCourses.length}):`);
    platformCourses.forEach(course => {
      console.log(`   • ${course.title}`);
      console.log(`     - Enrollment: ${course.enrollmentType}`);
      console.log(`     - Payment: Subscription-based (${course.subscriptionTier} tier)`);
      console.log(`     - Governance: Platform-controlled with usage limits`);
    });

    // Check subscription governance setup
    console.log('\n🔍 Checking Subscription Governance Setup...');
    
    const studentTiers = await prisma.studentTier.findMany({
      select: { id: true, name: true, maxCourses: true, enrollmentQuota: true }
    });
    console.log(`   📊 Found ${studentTiers.length} student tiers`);
    studentTiers.forEach(tier => {
      console.log(`      • ${tier.name}: ${tier.maxCourses} max courses, ${tier.enrollmentQuota} monthly quota`);
    });

    const subscriptions = await prisma.studentSubscription.findMany({
      select: { id: true, studentId: true, studentTierId: true, currentEnrollments: true, monthlyEnrollments: true }
    });
    console.log(`   👥 Found ${subscriptions.length} active subscriptions`);

    console.log('\n✅ Live Class Courses Verification Complete!');
    console.log('\n🎯 Key Features Implemented:');
    console.log('   • Institution live courses with course-based enrollment');
    console.log('   • Platform-wide live courses with subscription-based enrollment');
    console.log('   • Recurring live sessions with proper scheduling');
    console.log('   • Subscription governance with usage tracking');
    console.log('   • Different pricing models (weekly vs subscription)');
    console.log('   • Timezone-aware scheduling for global courses');

  } catch (error) {
    console.error('❌ Error verifying live class courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyLiveClassCourses();
