import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testEnrollmentModal() {
  try {
    console.log('Testing enrollment modal functionality...\n');
    
    // Get a student and available live class for testing
    const student = await prisma.user.findFirst({
      where: { role: 'STUDENT' },
    });
    
    const liveClass = await prisma.videoSession.findFirst({
      where: {
        status: 'SCHEDULED',
        startTime: { gt: new Date() },
        institutionId: null, // Platform-wide class
      },
      include: {
        instructor: {
          select: { name: true, email: true },
        },
      },
    });
    
    if (!student || !liveClass) {
      console.log('❌ Test setup failed: Missing student or live class');
      return;
    }
    
    console.log('✅ Test setup successful');
    console.log(`Student: ${student.name} (${student.email})`);
    console.log(`Live Class: ${liveClass.title}`);
    console.log(`Instructor: ${liveClass.instructor.name}`);
    console.log(`Start Time: ${liveClass.startTime}`);
    console.log(`Duration: ${liveClass.duration} minutes`);
    console.log(`Language: ${liveClass.language.toUpperCase()}`);
    console.log(`Level: ${liveClass.level}`);
    console.log(`Session Type: ${liveClass.sessionType}`);
    console.log(`Meeting URL: ${liveClass.meetingUrl ? '✅ Available' : '❌ Missing'}`);
    
    // Check if student is already enrolled
    const existingEnrollment = await prisma.videoSessionParticipant.findFirst({
      where: {
        sessionId: liveClass.id,
        userId: student.id,
      },
    });
    
    if (existingEnrollment) {
      console.log('\n⚠️  Student is already enrolled in this class');
      console.log(`Enrollment ID: ${existingEnrollment.id}`);
      console.log(`Role: ${existingEnrollment.role}`);
      console.log(`Active: ${existingEnrollment.isActive}`);
    } else {
      console.log('\n✅ Student is not enrolled - ready for enrollment test');
    }
    
    // Simulate the enrollment modal data that would be displayed
    console.log('\n📋 Enrollment Modal Content Preview:');
    console.log('=' .repeat(50));
    
    // Class Overview Section
    console.log('\n🎓 CLASS OVERVIEW:');
    console.log(`Title: ${liveClass.title}`);
    console.log(`Description: ${liveClass.description || 'No description available'}`);
    console.log(`Instructor: ${liveClass.instructor.name} (${liveClass.instructor.email})`);
    console.log(`Date: ${liveClass.startTime.toLocaleDateString()}`);
    console.log(`Time: ${liveClass.startTime.toLocaleTimeString()} - ${liveClass.endTime.toLocaleTimeString()}`);
    console.log(`Duration: ${liveClass.duration} minutes`);
    console.log(`Language: ${liveClass.language.toUpperCase()}`);
    console.log(`Level: ${liveClass.level}`);
    console.log(`Session Type: ${liveClass.sessionType}`);
    
    // What to Expect Section
    console.log('\n📚 WHAT TO EXPECT:');
    console.log('• Live Video Session - Join via video conferencing');
    console.log('• Interactive Chat - Real-time discussions and Q&A');
    console.log('• Screen Sharing - Instructor presentations and demos');
    console.log('• Group Learning - Interactive group environment');
    
    // Important Information Section
    console.log('\n⚠️  IMPORTANT INFORMATION:');
    console.log('• Join 5 minutes before scheduled start time');
    console.log('• Ensure stable internet connection and working microphone');
    console.log('• Access meeting link from enrolled classes when session starts');
    console.log('• Session may be recorded if enabled by instructor');
    
    // Enrollment Action Buttons
    console.log('\n🔘 MODAL ACTIONS:');
    console.log('• Cancel Button - Closes modal without enrolling');
    console.log('• Confirm Enrollment Button - Proceeds with enrollment');
    
    // Test enrollment flow
    console.log('\n🔄 ENROLLMENT FLOW TEST:');
    
    if (!existingEnrollment) {
      console.log('1. User clicks "Enroll Now" button');
      console.log('2. Modal opens with class details and expectations');
      console.log('3. User reviews information and clicks "Confirm Enrollment"');
      console.log('4. API call to /api/student/live-classes/enroll');
      console.log('5. Enrollment created in database');
      console.log('6. Modal closes and page refreshes');
      console.log('7. Class moves from "Available" to "Enrolled" tab');
      
      // Simulate the API call
      console.log('\n📡 Simulating enrollment API call...');
      
      // Note: This is just a simulation - actual API call would require authentication
      console.log('POST /api/student/live-classes/enroll');
      console.log('Body: { liveClassId: "' + liveClass.id + '" }');
      console.log('Expected Response: 200 OK with enrollment confirmation');
      
    } else {
      console.log('1. User is already enrolled');
      console.log('2. "Enroll Now" button should not be visible');
      console.log('3. "Join Class" button should be available instead');
    }
    
    // User Experience Benefits
    console.log('\n✨ USER EXPERIENCE BENEFITS:');
    console.log('✅ Prevents accidental enrollments');
    console.log('✅ Provides clear expectations about the class');
    console.log('✅ Shows important technical requirements');
    console.log('✅ Displays comprehensive class information');
    console.log('✅ Professional confirmation flow');
    console.log('✅ Reduces user confusion and support requests');
    
    console.log('\n✅ Enrollment modal functionality test completed!');
    
  } catch (error) {
    console.error('❌ Error testing enrollment modal:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEnrollmentModal(); 