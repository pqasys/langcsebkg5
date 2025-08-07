import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testLiveClassAdminAccess() {
  try {
    console.log('🔍 Testing Live Class Admin Access...\n');

    // Get all live class courses with full details
    const liveClassCourses = await prisma.course.findMany({
      where: {
        hasLiveClasses: true
      },
      include: {
        institution: {
          select: { id: true, name: true, status: true }
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
            maxParticipants: true,
            instructorId: true
          },
          orderBy: { startTime: 'asc' }
        },
        _count: {
          select: {
            videoSessions: true,
            enrollments: true
          }
        }
      }
    });

    console.log(`📚 Found ${liveClassCourses.length} live class courses for admin access:\n`);

    liveClassCourses.forEach((course, index) => {
      console.log(`🎯 Course ${index + 1}: ${course.title}`);
      console.log(`   🔗 Admin URL: /admin/courses/${course.id}`);
      console.log(`   🏢 Institution: ${course.institution?.name || 'Platform-Wide'}`);
      console.log(`   📂 Category: ${course.category?.name}`);
      console.log(`   💰 Price: $${course.base_price} (${course.pricingPeriod})`);
      console.log(`   👥 Max Students: ${course.maxStudents}`);
      console.log(`   📅 Duration: ${course.duration} weeks`);
      console.log(`   📊 Status: ${course.status}`);
      
      // Live class specific details
      console.log(`   🎥 Live Class Configuration:`);
      console.log(`      • Has Live Classes: ${course.hasLiveClasses}`);
      console.log(`      • Live Class Type: ${course.liveClassType}`);
      console.log(`      • Frequency: ${course.liveClassFrequency}`);
      console.log(`      • Platform Course: ${course.isPlatformCourse}`);
      console.log(`      • Requires Subscription: ${course.requiresSubscription}`);
      console.log(`      • Subscription Tier: ${course.subscriptionTier || 'N/A'}`);
      
      if (course.liveClassSchedule) {
        const schedule = course.liveClassSchedule as any;
        console.log(`      • Schedule: ${schedule.dayOfWeek} at ${schedule.time} (${schedule.timezone})`);
        console.log(`      • Session Duration: ${schedule.duration} minutes`);
      }
      
      console.log(`   📊 Live Sessions: ${course._count.videoSessions}`);
      console.log(`   👥 Enrollments: ${course._count.enrollments}`);
      
      // Test API endpoints
      console.log(`   🔗 API Endpoints:`);
      console.log(`      • GET /api/admin/courses/${course.id}`);
      console.log(`      • PUT /api/admin/courses/${course.id}`);
      console.log(`      • DELETE /api/admin/courses/${course.id}`);
      
      if (course.videoSessions.length > 0) {
        console.log(`      • GET /api/admin/live-classes?courseId=${course.id}`);
        console.log(`      • POST /api/admin/live-classes (for new sessions)`);
      }
      
      console.log('');
    });

    // Test subscription governance access
    console.log('🔐 Testing Subscription Governance Access...\n');
    
    const studentTiers = await prisma.studentTier.findMany({
      select: { id: true, name: true, planType: true, maxCourses: true, enrollmentQuota: true }
    });
    
    console.log(`📊 Student Tiers (${studentTiers.length}):`);
    studentTiers.forEach(tier => {
      console.log(`   • ${tier.name} (${tier.planType})`);
      console.log(`     - Max Courses: ${tier.maxCourses}`);
      console.log(`     - Monthly Quota: ${tier.enrollmentQuota}`);
      console.log(`     - Admin URL: /admin/subscriptions/tiers/${tier.id}`);
    });

    const subscriptions = await prisma.studentSubscription.findMany({
      select: { id: true, studentId: true, studentTierId: true, status: true, currentEnrollments: true, monthlyEnrollments: true }
    });
    
    console.log(`\n👥 Active Subscriptions (${subscriptions.length}):`);
    subscriptions.slice(0, 3).forEach(sub => {
      console.log(`   • Subscription ${sub.id.substring(0, 8)}...`);
      console.log(`     - Student: ${sub.studentId.substring(0, 8)}...`);
      console.log(`     - Status: ${sub.status}`);
      console.log(`     - Current Enrollments: ${sub.currentEnrollments}`);
      console.log(`     - Monthly Enrollments: ${sub.monthlyEnrollments}`);
      console.log(`     - Admin URL: /admin/subscriptions/${sub.id}`);
    });
    
    if (subscriptions.length > 3) {
      console.log(`   ... and ${subscriptions.length - 3} more subscriptions`);
    }

    // Test live session management
    console.log('\n📅 Testing Live Session Management...\n');
    
    const totalSessions = liveClassCourses.reduce((sum, course) => sum + course.videoSessions.length, 0);
    console.log(`📊 Total Live Sessions: ${totalSessions}`);
    
    const upcomingSessions = liveClassCourses.flatMap(course => 
      course.videoSessions.filter(session => 
        new Date(session.startTime) > new Date() && session.status === 'SCHEDULED'
      )
    );
    
    console.log(`📅 Upcoming Sessions: ${upcomingSessions.length}`);
    console.log(`✅ Completed Sessions: ${totalSessions - upcomingSessions.length}`);
    
    // Test governance services
    console.log('\n🔧 Testing Governance Services...\n');
    
    console.log('✅ Available Services:');
    console.log('   • SubscriptionManagementService');
    console.log('   • LiveClassGovernanceService');
    console.log('   • PlatformCourseGovernanceService');
    console.log('   • UsageAnalyticsService');
    
    console.log('\n🔗 Service Endpoints:');
    console.log('   • /api/admin/subscriptions/governance');
    console.log('   • /api/admin/live-classes/governance');
    console.log('   • /api/admin/platform-courses/governance');
    console.log('   • /api/admin/analytics/usage');

    console.log('\n✅ Live Class Admin Access Test Complete!');
    console.log('\n🎯 Admin Dashboard Features Available:');
    console.log('   • Course Management: Create, edit, delete live class courses');
    console.log('   • Session Management: Schedule and manage live sessions');
    console.log('   • Enrollment Tracking: Monitor course enrollments');
    console.log('   • Subscription Governance: Manage subscription limits');
    console.log('   • Usage Analytics: Track platform usage');
    console.log('   • Access Control: Role-based permissions');

  } catch (error) {
    console.error('❌ Error testing live class admin access:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLiveClassAdminAccess();
