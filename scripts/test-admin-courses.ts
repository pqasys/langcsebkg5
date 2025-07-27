import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAdminCourses() {
  try {
    console.log('🔍 Testing admin courses API...');
    
    // Check total number of courses in database
    const totalCourses = await prisma.course.count();
    console.log(`Total courses in database: ${totalCourses}`);
    
    // Test fetching with default limit (should be 10)
    console.log('\n📋 Testing with default limit...');
    const defaultCourses = await prisma.course.findMany({
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        courseTags: {
          select: {
            id: true,
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
                icon: true
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true,
            completions: true,
            courseTags: true,
            bookings: true,
            modules: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log(`Default limit returned: ${defaultCourses.length} courses`);
    
    // Test fetching with higher limit (100)
    console.log('\n📋 Testing with limit=100...');
    const allCourses = await prisma.course.findMany({
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        courseTags: {
          select: {
            id: true,
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
                icon: true
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true,
            completions: true,
            courseTags: true,
            bookings: true,
            modules: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    
    console.log(`Higher limit returned: ${allCourses.length} courses`);
    
    if (allCourses.length === totalCourses) {
      console.log('✅ Successfully retrieved all courses!');
    } else {
      console.log(`⚠️  Retrieved ${allCourses.length} out of ${totalCourses} courses`);
    }
    
    // Show sample course data
    if (allCourses.length > 0) {
      console.log('\n📋 Sample course data:');
      console.log({
        id: allCourses[0].id,
        title: allCourses[0].title,
        institution: allCourses[0].institution?.name,
        category: allCourses[0].category?.name,
        status: allCourses[0].status,
        enrollments: allCourses[0]._count.enrollments
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing admin courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminCourses(); 