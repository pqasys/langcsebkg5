import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCourseSlugAPI() {
  console.log('🧪 Testing course slug-based API...\n');

  try {
    // Get all courses with their slugs
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        institutionId: true
      },
      take: 5 // Test first 5 courses
    });

    console.log('📋 Sample courses with slugs:');
    courses.forEach(course => {
      console.log(`   "${course.title}" → /courses/${course.slug}`);
      console.log(`     ID: ${course.id}`);
      console.log(`     Status: ${course.status}`);
      console.log('');
    });

    // Test the slug-based API endpoint
    console.log('🌐 Testing API endpoints...');
    
    for (const course of courses) {
      try {
        const response = await fetch(`http://localhost:3000/api/courses/slug/${course.slug}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ /api/courses/slug/${course.slug} - SUCCESS`);
          console.log(`   Title: ${data.title}`);
          console.log(`   Status: ${data.status}`);
          console.log(`   Institution: ${data.institution?.name || 'Platform Course'}`);
        } else {
          console.log(`❌ /api/courses/slug/${course.slug} - FAILED (${response.status})`);
        }
      } catch (error) {
        console.log(`❌ /api/courses/slug/${course.slug} - ERROR: ${error}`);
      }
    }

    console.log('\n🎉 Course slug-based API testing completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Visit: http://localhost:3000/courses');
    console.log('   3. Click on course links to test slug-based URLs');
    console.log('   4. Verify SEO-friendly URLs are working correctly');

  } catch (error) {
    console.error('❌ Error testing course slug API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCourseSlugAPI();
