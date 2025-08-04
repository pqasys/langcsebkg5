import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEnrollmentRecords() {
  try {
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    
    console.log('Checking enrollment records...');
    
    // Check video session participants
    const participants = await prisma.videoSessionParticipant.findMany({
      where: { userId: studentId }
    });
    
    console.log('Video session participants:', participants.length);
    if (participants.length > 0) {
      console.log('Sample participant:', participants[0]);
    }
    
    // Check all video sessions
    const allSessions = await prisma.videoSession.findMany({
      where: {
        status: 'SCHEDULED',
        startTime: { gt: new Date() }
      }
    });
    
    console.log('All future scheduled sessions:', allSessions.length);
    
    // Check platform-wide sessions specifically
    const platformSessions = await prisma.videoSession.findMany({
      where: {
        status: 'SCHEDULED',
        startTime: { gt: new Date() },
        institutionId: null
      }
    });
    
    console.log('Platform-wide future sessions:', platformSessions.length);
    
    // Test the enrollment check for our test class
    const testClassId = '528510ba-0420-4223-a3fa-e4aabfd4e9c9';
    const enrollment = await prisma.videoSessionParticipant.findUnique({
      where: {
        sessionId_userId: {
          sessionId: testClassId,
          userId: studentId,
        },
      },
    });
    
    console.log('Enrollment for test class:', enrollment);
    console.log('Is enrolled in test class:', !!enrollment);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnrollmentRecords(); 