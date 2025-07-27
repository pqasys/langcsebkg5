import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCourseModules() {
  const courseId = '7e806add-bd45-43f6-a28f-fb736707653c';
  
  try {
    console.log('🔍 Testing course modules API...');
    console.log('Course ID:', courseId);
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        institutionId: true
      }
    });
    
    if (!course) {
      console.log('❌ Course not found');
      return;
    }
    
    console.log('✅ Course found:', course.title);
    
    // Check modules table structure
    console.log('\n📋 Checking modules table...');
    const modules = await prisma.modules.findMany({
      where: { course_id: courseId },
      select: {
        id: true,
        title: true,
        course_id: true,
        order_index: true
      }
    });
    
    console.log(`Found ${modules.length} modules for this course`);
    
    if (modules.length > 0) {
      console.log('Sample module:', modules[0]);
    }
    
    // Test the full query that's failing
    console.log('\n🧪 Testing full modules query...');
    const fullModules = await prisma.modules.findMany({
      where: {
        course_id: courseId
      },
      orderBy: {
        order_index: 'asc'
      },
      include: {
        contentItems: {
          select: {
            id: true,
            type: true,
            title: true,
            order_index: true
          },
          orderBy: {
            order_index: 'asc'
          }
        },
        exercises: {
          select: {
            id: true,
            type: true,
            question: true,
            order_index: true
          },
          orderBy: {
            order_index: 'asc'
          }
        },
        quizzes: {
          select: {
            id: true,
            title: true,
            description: true,
            passing_score: true,
            time_limit: true,
            quiz_type: true,
            difficulty: true
          }
        }
      }
    });
    
    console.log('✅ Full query successful');
    console.log(`Retrieved ${fullModules.length} modules with full data`);
    
  } catch (error) {
    console.error('❌ Error testing course modules:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCourseModules(); 