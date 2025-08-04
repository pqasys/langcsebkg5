import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testApiResponse() {
  try {
    const studentId = '5b5fbd13-8776-4f96-ada9-091973974873';
    
    console.log('Testing API response format...');
    
    // Simulate the exact API logic
    const [studentSubscription, user] = await Promise.all([
      prisma.studentSubscription.findUnique({
        where: { studentId },
      }),
      prisma.user.findUnique({
        where: { id: studentId },
        select: { institutionId: true },
      }),
    ]);
    
    const hasSubscription = studentSubscription?.status === 'ACTIVE';
    const institutionId = user?.institutionId;
    
    // Build where clause
    const where: any = {
      status: 'SCHEDULED',
      startTime: { gt: new Date() },
    };
    
    if (hasSubscription) {
      where.institutionId = null; // Platform-wide classes only
    }
    
    // Get live classes
    const liveClasses = await prisma.videoSession.findMany({
      where,
      orderBy: { startTime: 'asc' },
      take: 10,
    });
    
    // Get enrollment status for each class
    const liveClassesWithEnrollment = await Promise.all(
      liveClasses.map(async (liveClass) => {
        const [instructor, course, enrollment] = await Promise.all([
          prisma.user.findUnique({
            where: { id: liveClass.instructorId },
            select: { id: true, name: true, email: true },
          }),
          liveClass.courseId ? prisma.course.findUnique({
            where: { id: liveClass.courseId },
            select: { id: true, title: true },
          }) : null,
          prisma.videoSessionParticipant.findUnique({
            where: {
              sessionId_userId: {
                sessionId: liveClass.id,
                userId: studentId,
              },
            },
          }),
        ]);

        return {
          ...liveClass,
          instructor,
          course,
          isEnrolled: !!enrollment,
          enrollment,
        };
      })
    );
    
    // Filter for available classes (type=available)
    const availableClasses = liveClassesWithEnrollment.filter(c => !c.isEnrolled);
    
    // Simulate the API response
    const apiResponse = {
      liveClasses: availableClasses,
      pagination: {
        page: 1,
        limit: 10,
        total: availableClasses.length,
        pages: Math.ceil(availableClasses.length / 10),
      },
      accessLevel: {
        hasSubscription,
        hasInstitutionAccess: !!institutionId,
        institutionId,
      },
    };
    
    console.log('API Response:');
    console.log(JSON.stringify(apiResponse, null, 2));
    
    console.log('\nSummary:');
    console.log('- Total classes found:', liveClasses.length);
    console.log('- Available classes (not enrolled):', availableClasses.length);
    console.log('- Has subscription:', hasSubscription);
    console.log('- Has institution access:', !!institutionId);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testApiResponse(); 