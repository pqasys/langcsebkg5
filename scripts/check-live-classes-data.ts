import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLiveClassesData() {
  try {
    console.log('Checking live classes data accuracy...\n');
    
    // Get all live classes
    const allLiveClasses = await prisma.videoSession.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        participants: {
          select: {
            userId: true,
            role: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
    
    console.log(`Total live classes in database: ${allLiveClasses.length}\n`);
    
    if (allLiveClasses.length === 0) {
      console.log('No live classes found in the database.');
      return;
    }
    
    // Check each live class
    allLiveClasses.forEach((liveClass, index) => {
      console.log(`--- Live Class ${index + 1} ---`);
      console.log(`ID: ${liveClass.id}`);
      console.log(`Title: ${liveClass.title}`);
      console.log(`Description: ${liveClass.description || 'No description'}`);
      console.log(`Session Type: ${liveClass.sessionType || 'Not set'}`);
      console.log(`Language: ${liveClass.language || 'Not set'}`);
      console.log(`Level: ${liveClass.level || 'Not set'}`);
      console.log(`Start Time: ${liveClass.startTime}`);
      console.log(`End Time: ${liveClass.endTime}`);
      console.log(`Duration: ${liveClass.duration} minutes`);
      console.log(`Max Participants: ${liveClass.maxParticipants}`);
      console.log(`Price: ${liveClass.price} ${liveClass.currency}`);
      console.log(`Status: ${liveClass.status}`);
      console.log(`Is Public: ${liveClass.isPublic}`);
      console.log(`Is Recorded: ${liveClass.isRecorded}`);
      console.log(`Allow Chat: ${liveClass.allowChat}`);
      console.log(`Allow Screen Share: ${liveClass.allowScreenShare}`);
      console.log(`Allow Recording: ${liveClass.allowRecording}`);
      console.log(`Meeting URL: ${liveClass.meetingUrl || 'Not set'}`);
      
      // Instructor info
      if (liveClass.instructor) {
        console.log(`Instructor: ${liveClass.instructor.name} (${liveClass.instructor.email})`);
      } else {
        console.log(`Instructor: Not assigned`);
      }
      
      // Institution info
      if (liveClass.institution) {
        console.log(`Institution: ${liveClass.institution.name}`);
      } else {
        console.log(`Institution: Platform-wide (no specific institution)`);
      }
      
      // Course info
      if (liveClass.course) {
        console.log(`Course: ${liveClass.course.title}`);
      } else {
        console.log(`Course: Standalone (no specific course)`);
      }
      
      // Participants info
      console.log(`Participants: ${liveClass.participants.length} enrolled`);
      if (liveClass.participants.length > 0) {
        liveClass.participants.forEach((participant, pIndex) => {
          console.log(`  ${pIndex + 1}. User ID: ${participant.userId}, Role: ${participant.role}, Active: ${participant.isActive}`);
        });
      }
      
      // Data validation checks
      console.log('\n--- Data Validation ---');
      
      // Check if start time is in the future
      const now = new Date();
      const startTime = new Date(liveClass.startTime);
      const endTime = new Date(liveClass.endTime);
      
      if (startTime <= now) {
        console.log(`⚠️  WARNING: Start time is in the past or now`);
      } else {
        console.log(`✅ Start time is in the future`);
      }
      
      if (endTime <= startTime) {
        console.log(`⚠️  WARNING: End time is before or equal to start time`);
      } else {
        console.log(`✅ End time is after start time`);
      }
      
      if (liveClass.duration <= 0) {
        console.log(`⚠️  WARNING: Duration is zero or negative`);
      } else {
        console.log(`✅ Duration is valid`);
      }
      
      if (liveClass.maxParticipants <= 0) {
        console.log(`⚠️  WARNING: Max participants is zero or negative`);
      } else {
        console.log(`✅ Max participants is valid`);
      }
      
      if (liveClass.price < 0) {
        console.log(`⚠️  WARNING: Price is negative`);
      } else {
        console.log(`✅ Price is valid`);
      }
      
      if (!liveClass.instructorId) {
        console.log(`⚠️  WARNING: No instructor assigned`);
      } else {
        console.log(`✅ Instructor is assigned`);
      }
      
      console.log('\n');
    });
    
    // Summary statistics
    console.log('=== SUMMARY STATISTICS ===');
    
    const statusCounts = allLiveClasses.reduce((acc, liveClass) => {
      acc[liveClass.status] = (acc[liveClass.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Status distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    const futureClasses = allLiveClasses.filter(liveClass => 
      new Date(liveClass.startTime) > new Date()
    );
    
    console.log(`\nFuture classes: ${futureClasses.length}`);
    console.log(`Past classes: ${allLiveClasses.length - futureClasses.length}`);
    
    const platformClasses = allLiveClasses.filter(liveClass => 
      !liveClass.institutionId
    );
    
    console.log(`Platform-wide classes: ${platformClasses.length}`);
    console.log(`Institution-specific classes: ${allLiveClasses.length - platformClasses.length}`);
    
    const classesWithParticipants = allLiveClasses.filter(liveClass => 
      liveClass.participants.length > 0
    );
    
    console.log(`Classes with participants: ${classesWithParticipants.length}`);
    console.log(`Empty classes: ${allLiveClasses.length - classesWithParticipants.length}`);
    
  } catch (error) {
    console.error('Error checking live classes data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLiveClassesData(); 