import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStudentSubscription() {
  try {
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    
    console.log('Checking student subscription...');
    
    // Check student subscription
    const subscription = await prisma.studentSubscription.findUnique({
      where: { studentId }
    });
    
    console.log('Student subscription:', subscription);
    
    // Check student tier if subscription exists
    if (subscription) {
      const tier = await prisma.studentTier.findUnique({
        where: { id: subscription.studentTierId }
      });
      console.log('Student tier:', tier);
    }
    
    // Check if there are any video sessions
    const videoSessions = await prisma.videoSession.findMany({
      take: 5
    });
    
    console.log('Available video sessions:', videoSessions.length);
    if (videoSessions.length > 0) {
      console.log('Sample video session:', videoSessions[0]);
    }
    
    // Check user institution enrollment
    const user = await prisma.user.findUnique({
      where: { id: studentId },
      select: { institutionId: true }
    });
    
    console.log('User institution enrollment:', user);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudentSubscription(); 