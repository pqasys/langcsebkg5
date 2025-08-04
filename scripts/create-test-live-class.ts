import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestLiveClass() {
  try {
    console.log('Creating test live class...');
    
    // Create a future date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0); // 2 PM tomorrow
    
    const endTime = new Date(tomorrow);
    endTime.setHours(15, 0, 0, 0); // 3 PM tomorrow
    
    const testLiveClass = await prisma.videoSession.create({
      data: {
        title: 'Test Live Class - Premium Access',
        description: 'This is a test live class to verify Premium subscription access',
        sessionType: 'GROUP',
        language: 'en',
        level: 'BEGINNER',
        maxParticipants: 15,
        startTime: tomorrow,
        endTime: endTime,
        duration: 60,
        status: 'SCHEDULED',
        instructorId: 'd00a7d05-f380-46f1-8cb4-344f0d04c0f2', // Use existing instructor
        institutionId: null, // Platform-wide class
        price: 0,
        isPublic: true,
        allowChat: true,
        allowScreenShare: true,
        allowRecording: false,
        currency: 'USD'
      }
    });
    
    console.log('Created test live class:', testLiveClass);
    
    // Verify it's accessible
    const accessibleClasses = await prisma.videoSession.findMany({
      where: {
        status: 'SCHEDULED',
        startTime: { gt: new Date() },
        institutionId: null
      }
    });
    
    console.log('Total accessible platform-wide classes:', accessibleClasses.length);
    
  } catch (error) {
    console.error('Error creating test live class:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestLiveClass(); 