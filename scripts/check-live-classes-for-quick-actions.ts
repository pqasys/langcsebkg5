import { prisma } from '../lib/prisma';

async function checkLiveClassesForQuickActions() {
  console.log('🔍 Checking Live Classes for Quick Actions\n');

  try {
    const now = new Date();
    console.log(`Current time: ${now.toISOString()}`);

    // Get all live classes
    const allLiveClasses = await prisma.videoSession.findMany({
      where: {
        status: 'SCHEDULED',
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        duration: true,
        status: true,
        meetingUrl: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    console.log(`\n📊 Total scheduled live classes: ${allLiveClasses.length}`);

    if (allLiveClasses.length === 0) {
      console.log('❌ No scheduled live classes found');
      return;
    }

    // Check which classes are ready to join (within 15 minutes of start time)
    const readyToJoinClasses = allLiveClasses.filter(cls => {
      const startTime = new Date(cls.startTime);
      const timeDiff = startTime.getTime() - now.getTime();
      const minutesUntilStart = timeDiff / (1000 * 60);
      
      // Class is ready to join if it starts within 15 minutes and hasn't ended
      const endTime = new Date(cls.endTime);
      const hasEnded = now > endTime;
      
      return minutesUntilStart <= 15 && minutesUntilStart >= -cls.duration && !hasEnded;
    });

    console.log(`\n✅ Classes ready to join (within 15 minutes): ${readyToJoinClasses.length}`);

    if (readyToJoinClasses.length > 0) {
      console.log('\n🎯 Ready to join classes:');
      readyToJoinClasses.forEach((cls, index) => {
        const startTime = new Date(cls.startTime);
        const timeDiff = startTime.getTime() - now.getTime();
        const minutesUntilStart = Math.round(timeDiff / (1000 * 60));
        
        console.log(`   ${index + 1}. ${cls.title}`);
        console.log(`      ID: ${cls.id}`);
        console.log(`      Start: ${startTime.toISOString()}`);
        console.log(`      Minutes until start: ${minutesUntilStart}`);
        console.log(`      Duration: ${cls.duration} minutes`);
        console.log(`      Meeting URL: ${cls.meetingUrl || 'Not set'}`);
        console.log('');
      });
    }

    // Check upcoming classes (future classes not ready yet)
    const upcomingClasses = allLiveClasses.filter(cls => {
      const startTime = new Date(cls.startTime);
      const timeDiff = startTime.getTime() - now.getTime();
      const minutesUntilStart = timeDiff / (1000 * 60);
      
      return minutesUntilStart > 15;
    });

    console.log(`\n📅 Upcoming classes (not ready yet): ${upcomingClasses.length}`);

    if (upcomingClasses.length > 0) {
      console.log('\n⏰ Next few upcoming classes:');
      upcomingClasses.slice(0, 3).forEach((cls, index) => {
        const startTime = new Date(cls.startTime);
        const timeDiff = startTime.getTime() - now.getTime();
        const minutesUntilStart = Math.round(timeDiff / (1000 * 60));
        const hoursUntilStart = Math.round(minutesUntilStart / 60);
        
        console.log(`   ${index + 1}. ${cls.title}`);
        console.log(`      Start: ${startTime.toISOString()}`);
        console.log(`      Time until start: ${hoursUntilStart > 0 ? `${hoursUntilStart}h ${minutesUntilStart % 60}m` : `${minutesUntilStart}m`}`);
        console.log('');
      });
    }

    // Summary for Quick Actions
    console.log('\n📋 Quick Actions Summary:');
    console.log(`   - Ready to join: ${readyToJoinClasses.length > 0 ? 'Yes' : 'No'}`);
    console.log(`   - Button should show: ${readyToJoinClasses.length > 0 ? 'Join Next Class' : 'No Classes Ready'}`);
    
    if (readyToJoinClasses.length > 0) {
      const nextClass = readyToJoinClasses[0];
      console.log(`   - Next class to join: ${nextClass.title}`);
      console.log(`   - Class ID: ${nextClass.id}`);
    }

  } catch (error) {
    console.error('❌ Error checking live classes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLiveClassesForQuickActions(); 