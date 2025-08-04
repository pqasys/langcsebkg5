import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testJoinClass() {
  try {
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    const testClassId = '528510ba-0420-4223-a3fa-e4aabfd4e9c9';
    
    console.log('Testing join class functionality...');
    
    // Get the live class
    const liveClass = await prisma.videoSession.findUnique({
      where: { id: testClassId },
    });
    
    console.log('Live class:', {
      id: liveClass?.id,
      title: liveClass?.title,
      startTime: liveClass?.startTime,
      endTime: liveClass?.endTime,
      status: liveClass?.status,
      meetingUrl: liveClass?.meetingUrl
    });
    
    // Check if student is enrolled
    const enrollment = await prisma.videoSessionParticipant.findUnique({
      where: {
        sessionId_userId: {
          sessionId: testClassId,
          userId: studentId,
        },
      },
    });
    
    console.log('Current enrollment:', enrollment);
    
    // Check class timing
    const now = new Date();
    const startTime = liveClass ? new Date(liveClass.startTime) : null;
    const endTime = liveClass ? new Date(liveClass.endTime) : null;
    
    console.log('Timing check:');
    console.log('- Current time:', now);
    console.log('- Start time:', startTime);
    console.log('- End time:', endTime);
    console.log('- Has started:', startTime ? now >= startTime : false);
    console.log('- Has ended:', endTime ? now > endTime : false);
    console.log('- Is active:', startTime && endTime ? now >= startTime && now <= endTime : false);
    
    // Test the join logic
    if (enrollment && liveClass) {
      const isActive = startTime && endTime ? now >= startTime && now <= endTime : false;
      
      if (isActive) {
        console.log('Class is active - can join');
        
        // Simulate joining
        const updatedEnrollment = await prisma.videoSessionParticipant.update({
          where: {
            sessionId_userId: {
              sessionId: testClassId,
              userId: studentId,
            },
          },
          data: {
            isActive: true,
            joinedAt: now,
            lastSeen: now,
            updatedAt: now,
          },
        });
        
        console.log('Updated enrollment:', updatedEnrollment);
        
        // Create a system message
        const systemMessage = await prisma.videoSessionMessage.create({
          data: {
            sessionId: testClassId,
            userId: studentId,
            messageType: 'SYSTEM',
            content: 'Student joined the session',
            timestamp: now,
            isPrivate: false,
          },
        });
        
        console.log('System message created:', systemMessage);
        
      } else if (now < startTime!) {
        console.log('Class has not started yet');
      } else {
        console.log('Class has already ended');
      }
    } else {
      console.log('Student is not enrolled in this class');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testJoinClass(); 