import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testEnrollmentApi() {
  try {
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    const testClassId = '528510ba-0420-4223-a3fa-e4aabfd4e9c9';
    
    console.log('Testing enrollment API logic...');
    
    // Simulate the enrollment API logic
    const [studentSubscription, user] = await Promise.all([
      prisma.studentSubscription.findUnique({
        where: { studentId },
      }),
      prisma.user.findUnique({
        where: { id: studentId },
        select: { institutionId: true },
      }),
    ]);
    
    console.log('Student subscription:', studentSubscription);
    console.log('User institution enrollment:', user);
    
    // Get the live class
    const liveClass = await prisma.videoSession.findUnique({
      where: { id: testClassId },
    });
    
    console.log('Live class:', liveClass);
    
    // Check if student is already enrolled
    const existingEnrollment = await prisma.videoSessionParticipant.findUnique({
      where: {
        sessionId_userId: {
          sessionId: testClassId,
          userId: studentId,
        },
      },
    });
    
    console.log('Existing enrollment:', existingEnrollment);
    
    // Determine access level
    const hasSubscription = studentSubscription?.status === 'ACTIVE';
    const hasInstitutionAccess = user?.institutionId && liveClass?.institutionId === user.institutionId;
    
    console.log('Access check:');
    console.log('- Has subscription:', hasSubscription);
    console.log('- Has institution access:', hasInstitutionAccess);
    console.log('- Can enroll:', hasSubscription || hasInstitutionAccess);
    
    // Check if class is at capacity
    const currentParticipants = await prisma.videoSessionParticipant.count({
      where: { sessionId: testClassId },
    });
    
    console.log('Current participants:', currentParticipants);
    console.log('Max participants:', liveClass?.maxParticipants);
    console.log('Has capacity:', currentParticipants < (liveClass?.maxParticipants || 0));
    
    // Test enrollment creation
    if (!existingEnrollment && hasSubscription && currentParticipants < (liveClass?.maxParticipants || 0)) {
      console.log('Creating enrollment...');
      
      const enrollment = await prisma.videoSessionParticipant.create({
        data: {
          sessionId: testClassId,
          userId: studentId,
          role: 'PARTICIPANT',
          isActive: false,
          updatedAt: new Date(),
        },
      });
      
      console.log('Enrollment created:', enrollment);
      
      // Verify enrollment
      const verifyEnrollment = await prisma.videoSessionParticipant.findUnique({
        where: {
          sessionId_userId: {
            sessionId: testClassId,
            userId: studentId,
          },
        },
      });
      
      console.log('Verification - enrollment exists:', !!verifyEnrollment);
    } else {
      console.log('Cannot create enrollment:');
      console.log('- Already enrolled:', !!existingEnrollment);
      console.log('- No access:', !hasSubscription && !hasInstitutionAccess);
      console.log('- At capacity:', currentParticipants >= (liveClass?.maxParticipants || 0));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEnrollmentApi(); 