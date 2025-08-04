import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testLiveClassesApiLogic() {
  try {
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    
    console.log('Testing live classes API logic...');
    
    // Get student's subscription and institution enrollment (same as API)
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
    
    const hasSubscription = studentSubscription?.status === 'ACTIVE';
    const institutionId = user?.institutionId;
    
    console.log('hasSubscription:', hasSubscription);
    console.log('institutionId:', institutionId);
    
    // Build where clause (same as API)
    const where: any = {
      status: 'SCHEDULED',
      startTime: { gt: new Date() }, // Only future classes
    };
    
    console.log('Initial where clause:', where);
    
    // Filter based on access level (same as API)
    if (hasSubscription && institutionId) {
      console.log('Case: Student has both subscription and institution enrollment');
      const institutionAccess = [
        { institutionId: null }, // Platform-wide classes
        { institutionId: institutionId }, // Institution classes
      ];
      where.OR = institutionAccess;
    } else if (hasSubscription) {
      console.log('Case: Student has only subscription - platform-wide classes only');
      where.institutionId = null;
    } else if (institutionId) {
      console.log('Case: Student has only institution enrollment - institution classes only');
      where.institutionId = institutionId;
    } else {
      console.log('Case: Student has no access');
      console.log('Returning empty result');
      return;
    }
    
    console.log('Final where clause:', JSON.stringify(where, null, 2));
    
    // Test the query
    const total = await prisma.videoSession.count({ where });
    const liveClasses = await prisma.videoSession.findMany({
      where,
      orderBy: { startTime: 'asc' },
      take: 10,
    });
    
    console.log('Total matching classes:', total);
    console.log('Live classes found:', liveClasses.length);
    
    if (liveClasses.length > 0) {
      console.log('Sample class:', {
        id: liveClasses[0].id,
        title: liveClasses[0].title,
        startTime: liveClasses[0].startTime,
        institutionId: liveClasses[0].institutionId,
        status: liveClasses[0].status
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLiveClassesApiLogic(); 