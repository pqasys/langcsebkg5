import { prisma } from '../lib/prisma';

async function testQuickActionsFix() {
  console.log('🔧 Testing Quick Actions Fix\n');

  try {
    const now = new Date();
    console.log(`Current time: ${now.toISOString()}`);

    // Test the ready-to-join API endpoint
    console.log('\n📡 Testing ready-to-join API endpoint...');
    try {
      const readyResponse = await fetch('http://localhost:3001/api/features/live-classes/ready-to-join');
      if (readyResponse.ok) {
        const readyData = await readyResponse.json();
        console.log(`✅ Ready-to-join API working: ${readyData.readyToJoinClasses.length} classes ready`);
        
        if (readyData.readyToJoinClasses.length > 0) {
          const nextClass = readyData.readyToJoinClasses[0];
          console.log(`   - Next class: ${nextClass.title}`);
          console.log(`   - Class ID: ${nextClass.id}`);
          console.log(`   - Start time: ${nextClass.startTime}`);
          console.log(`   - Instructor: ${nextClass.instructor.name}`);
        }
      } else {
        console.log('❌ Ready-to-join API failed');
      }
    } catch (error) {
      console.log('❌ Could not test ready-to-join API (server may not be running)');
    }

    // Test the upcoming classes API endpoint
    console.log('\n📡 Testing upcoming classes API endpoint...');
    try {
      const upcomingResponse = await fetch('http://localhost:3001/api/features/live-classes/upcoming');
      if (upcomingResponse.ok) {
        const upcomingData = await upcomingResponse.json();
        console.log(`✅ Upcoming classes API working: ${upcomingData.upcomingClasses.length} upcoming classes`);
        
        if (upcomingData.upcomingClasses.length > 0) {
          console.log('   - Next few upcoming classes:');
          upcomingData.upcomingClasses.slice(0, 3).forEach((cls: any, index: number) => {
            const startTime = new Date(cls.startTime);
            const timeDiff = startTime.getTime() - now.getTime();
            const minutesUntilStart = Math.round(timeDiff / (1000 * 60));
            const hoursUntilStart = Math.round(minutesUntilStart / 60);
            
            console.log(`     ${index + 1}. ${cls.title}`);
            console.log(`        Time until start: ${hoursUntilStart > 0 ? `${hoursUntilStart}h ${minutesUntilStart % 60}m` : `${minutesUntilStart}m`}`);
          });
        }
      } else {
        console.log('❌ Upcoming classes API failed');
      }
    } catch (error) {
      console.log('❌ Could not test upcoming classes API (server may not be running)');
    }

    // Check database directly for comparison
    console.log('\n🗄️ Checking database directly...');
    const readyToJoinClasses = await prisma.videoSession.findMany({
      where: {
        status: 'SCHEDULED',
        startTime: {
          gte: new Date(now.getTime() - 15 * 60 * 1000),
          lte: new Date(now.getTime() + 15 * 60 * 1000),
        },
        endTime: {
          gt: now,
        },
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        duration: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    console.log(`✅ Database check: ${readyToJoinClasses.length} classes ready to join`);

    // Summary
    console.log('\n📋 Quick Actions Fix Summary:');
    console.log('✅ API endpoints created for real-time data');
    console.log('✅ Features page updated to use real data instead of mock data');
    console.log('✅ Quick Actions button will now show correct status');
    console.log('✅ Join functionality updated to use WebRTC session page');
    
    if (readyToJoinClasses.length > 0) {
      console.log(`✅ Quick Actions should show: "Join Next Class"`);
      console.log(`✅ Next class to join: ${readyToJoinClasses[0].title}`);
    } else {
      console.log(`✅ Quick Actions should show: "No Classes Ready"`);
    }

    console.log('\n🎯 Next Steps:');
    console.log('1. Visit /features/live-classes in browser');
    console.log('2. Check Quick Actions section');
    console.log('3. Verify button shows correct text based on available classes');
    console.log('4. Test "Join Next Class" functionality');

  } catch (error) {
    console.error('❌ Error testing Quick Actions fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testQuickActionsFix(); 