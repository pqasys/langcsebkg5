import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testStudentLiveClassesView() {
  try {
    console.log('Testing student live classes view...\n');
    
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    
    // Get student subscription status
    const studentSubscription = await prisma.studentSubscription.findUnique({
      where: { studentId },
    });
    
    console.log('Student subscription:', {
      status: studentSubscription?.status,
      startDate: studentSubscription?.startDate,
      endDate: studentSubscription?.endDate,
    });
    
    // Get user institution enrollment
    const user = await prisma.user.findUnique({
      where: { id: studentId },
    });
    
    const hasSubscription = studentSubscription?.status === 'ACTIVE';
    const hasInstitutionAccess = !!user?.institutionId;
    const institutionId = user?.institutionId;
    
    console.log('Access level:', {
      hasSubscription,
      hasInstitutionAccess,
      institutionId,
    });
    
    // Simulate the API logic for available classes
    const now = new Date();
    console.log(`Current time: ${now.toISOString()}`);
    
    let whereClause: any = {
      status: 'SCHEDULED',
      startTime: { gt: now },
    };
    
    if (hasSubscription && !hasInstitutionAccess) {
      // Student has subscription but no institution access - show platform-wide classes only
      whereClause.institutionId = null;
      console.log('Case: Student has subscription, no institution access - platform-wide classes only');
    } else if (hasInstitutionAccess) {
      // Student has institution access - show institution classes + platform-wide classes
      whereClause.OR = [
        { institutionId: null },
        { institutionId: institutionId },
      ];
      console.log('Case: Student has institution access - institution + platform-wide classes');
    } else {
      // Student has no access
      console.log('Case: Student has no access - no classes shown');
      whereClause = { id: 'no-access' }; // This will return no results
    }
    
    console.log('Where clause:', JSON.stringify(whereClause, null, 2));
    
    // Get available classes
    const availableClasses = await prisma.videoSession.findMany({
      where: whereClause,
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
          where: { userId: studentId },
          select: {
            id: true,
            role: true,
            joinedAt: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
    
    console.log(`\nAvailable classes found: ${availableClasses.length}`);
    
    if (availableClasses.length === 0) {
      console.log('No available classes found for this student.');
      return;
    }
    
    // Display each available class
    availableClasses.forEach((liveClass, index) => {
      console.log(`\n--- Available Class ${index + 1} ---`);
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
      console.log(`Meeting URL: ${liveClass.meetingUrl || 'Not set'}`);
      
      if (liveClass.instructor) {
        console.log(`Instructor: ${liveClass.instructor.name} (${liveClass.instructor.email})`);
      }
      
      if (liveClass.institution) {
        console.log(`Institution: ${liveClass.institution.name}`);
      } else {
        console.log(`Institution: Platform-wide`);
      }
      
      if (liveClass.course) {
        console.log(`Course: ${liveClass.course.title}`);
      } else {
        console.log(`Course: Standalone`);
      }
      
      // Check enrollment status
      const isEnrolled = liveClass.participants.length > 0;
      console.log(`Enrollment Status: ${isEnrolled ? 'Enrolled' : 'Not Enrolled'}`);
      
      if (isEnrolled) {
        const enrollment = liveClass.participants[0];
        console.log(`  Role: ${enrollment.role}`);
        console.log(`  Joined: ${enrollment.joinedAt}`);
        console.log(`  Active: ${enrollment.isActive}`);
      }
      
      // Check if class is currently active
      const startTime = new Date(liveClass.startTime);
      const endTime = new Date(liveClass.endTime);
      const isActive = now >= startTime && now <= endTime;
      const hasStarted = now >= startTime;
      const hasEnded = now > endTime;
      
      console.log(`Class Status:`);
      console.log(`  Has Started: ${hasStarted}`);
      console.log(`  Has Ended: ${hasEnded}`);
      console.log(`  Is Active: ${isActive}`);
      
      // Data quality check
      console.log(`\nData Quality:`);
      if (!liveClass.meetingUrl) {
        console.log(`  ⚠️  No meeting URL set`);
      } else {
        console.log(`  ✅ Meeting URL available`);
      }
      
      if (liveClass.duration <= 0) {
        console.log(`  ⚠️  Invalid duration`);
      } else {
        console.log(`  ✅ Duration valid`);
      }
      
      if (liveClass.maxParticipants <= 0) {
        console.log(`  ⚠️  Invalid max participants`);
      } else {
        console.log(`  ✅ Max participants valid`);
      }
    });
    
    // Summary
    console.log('\n=== SUMMARY ===');
    console.log(`Total available classes: ${availableClasses.length}`);
    console.log(`Classes with meeting URLs: ${availableClasses.filter(c => c.meetingUrl).length}`);
    console.log(`Classes without meeting URLs: ${availableClasses.filter(c => !c.meetingUrl).length}`);
    console.log(`Enrolled classes: ${availableClasses.filter(c => c.participants.length > 0).length}`);
    console.log(`Not enrolled classes: ${availableClasses.filter(c => c.participants.length === 0).length}`);
    
  } catch (error) {
    console.error('Error testing student live classes view:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStudentLiveClassesView(); 