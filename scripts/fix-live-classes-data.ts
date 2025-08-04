import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLiveClassesData() {
  try {
    console.log('Fixing live classes data accuracy issues...\n');
    
    // 1. Fix missing meeting URLs
    console.log('1. Adding meeting URLs to live classes...');
    
    const classesWithoutMeetingUrl = await prisma.videoSession.findMany({
      where: {
        meetingUrl: null,
        status: 'SCHEDULED',
      },
    });
    
    console.log(`Found ${classesWithoutMeetingUrl.length} classes without meeting URLs`);
    
    for (const liveClass of classesWithoutMeetingUrl) {
      // Generate a placeholder meeting URL (in real implementation, this would be from a video service)
      const meetingUrl = `https://meet.example.com/${liveClass.id}`;
      
      await prisma.videoSession.update({
        where: { id: liveClass.id },
        data: { meetingUrl },
      });
      
      console.log(`✅ Added meeting URL to: ${liveClass.title}`);
    }
    
    // 2. Check for past classes that should be marked as completed
    console.log('\n2. Checking for past classes...');
    
    const now = new Date();
    const pastClasses = await prisma.videoSession.findMany({
      where: {
        status: 'SCHEDULED',
        endTime: { lt: now },
      },
    });
    
    console.log(`Found ${pastClasses.length} past classes that should be marked as completed`);
    
    for (const liveClass of pastClasses) {
      await prisma.videoSession.update({
        where: { id: liveClass.id },
        data: { status: 'COMPLETED' },
      });
      
      console.log(`✅ Marked as completed: ${liveClass.title}`);
    }
    
    // 3. Create additional test classes for better variety
    console.log('\n3. Creating additional test classes...');
    
    const instructor = await prisma.user.findFirst({
      where: { role: 'INSTRUCTOR' },
    });
    
    if (instructor) {
      // Create a Spanish class
      const spanishClass = await prisma.videoSession.create({
        data: {
          title: 'Spanish Conversation - Intermediate',
          description: 'Practice Spanish conversation skills in an interactive group setting',
          sessionType: 'CONVERSATION',
          language: 'es',
          level: 'INTERMEDIATE',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 hour
          duration: 60,
          maxParticipants: 12,
          price: 0,
          currency: 'USD',
          status: 'SCHEDULED',
          isPublic: true,
          isRecorded: false,
          allowChat: true,
          allowScreenShare: true,
          allowRecording: false,
          instructorId: instructor.id,
          institutionId: null, // Platform-wide
          courseId: null,
          meetingUrl: `https://meet.example.com/spanish-${Date.now()}`,
        },
      });
      
      console.log(`✅ Created Spanish class: ${spanishClass.title}`);
      
      // Create a German class
      const germanClass = await prisma.videoSession.create({
        data: {
          title: 'German Grammar Workshop',
          description: 'Learn German grammar fundamentals with practical exercises',
          sessionType: 'WORKSHOP',
          language: 'de',
          level: 'BEGINNER',
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // +1.5 hours
          duration: 90,
          maxParticipants: 10,
          price: 0,
          currency: 'USD',
          status: 'SCHEDULED',
          isPublic: true,
          isRecorded: true,
          allowChat: true,
          allowScreenShare: true,
          allowRecording: false,
          instructorId: instructor.id,
          institutionId: null, // Platform-wide
          courseId: null,
          meetingUrl: `https://meet.example.com/german-${Date.now()}`,
        },
      });
      
      console.log(`✅ Created German class: ${germanClass.title}`);
      
      // Create an advanced English class
      const englishClass = await prisma.videoSession.create({
        data: {
          title: 'Advanced English Writing',
          description: 'Master advanced English writing techniques and academic writing',
          sessionType: 'TUTORIAL',
          language: 'en',
          level: 'ADVANCED',
          startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
          endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000), // +2 hours
          duration: 120,
          maxParticipants: 8,
          price: 0,
          currency: 'USD',
          status: 'SCHEDULED',
          isPublic: true,
          isRecorded: true,
          allowChat: true,
          allowScreenShare: true,
          allowRecording: false,
          instructorId: instructor.id,
          institutionId: null, // Platform-wide
          courseId: null,
          meetingUrl: `https://meet.example.com/english-${Date.now()}`,
        },
      });
      
      console.log(`✅ Created English class: ${englishClass.title}`);
    }
    
    // 4. Verify the fixes
    console.log('\n4. Verifying fixes...');
    
    const updatedClasses = await prisma.videoSession.findMany({
      where: {
        status: 'SCHEDULED',
        startTime: { gt: now },
      },
      include: {
        instructor: {
          select: { name: true, email: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
    
    console.log(`\nUpdated available classes: ${updatedClasses.length}`);
    
    updatedClasses.forEach((liveClass, index) => {
      console.log(`\n${index + 1}. ${liveClass.title}`);
      console.log(`   Language: ${liveClass.language.toUpperCase()}`);
      console.log(`   Level: ${liveClass.level}`);
      console.log(`   Start: ${liveClass.startTime}`);
      console.log(`   Duration: ${liveClass.duration} minutes`);
      console.log(`   Instructor: ${liveClass.instructor?.name}`);
      console.log(`   Meeting URL: ${liveClass.meetingUrl ? '✅ Set' : '❌ Missing'}`);
    });
    
    console.log('\n✅ Live classes data accuracy fixes completed!');
    
  } catch (error) {
    console.error('Error fixing live classes data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixLiveClassesData(); 