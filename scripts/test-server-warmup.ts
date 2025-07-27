import { performWarmup, prisma } from '../lib/server-warmup';

async function testServerWarmup() {
  console.log('🧪 Testing Server Warmup...\n');

  try {
    // Test 1: Perform warmup
    console.log('1. Testing database warmup...');
    const startTime = Date.now();
    await performWarmup();
    const warmupTime = Date.now() - startTime;
    console.log(`✅ Warmup completed in ${warmupTime}ms`);

    // Test 2: Test stats queries
    console.log('\n2. Testing stats queries...');
    const statsStartTime = Date.now();
    
    const [students, institutions, courses, languages] = await Promise.all([
      prisma.user.count({
        where: { 
          role: 'STUDENT',
          status: 'ACTIVE'
        }
      }),
      prisma.institution.count({
        where: { 
          isApproved: true,
          status: 'ACTIVE'
        }
      }),
      prisma.course.count({
        where: { 
          status: 'published'
        }
      }),
      prisma.course.groupBy({
        by: ['framework'],
        where: {
          status: 'published'
        }
      }).then(result => result.length)
    ]);

    const statsTime = Date.now() - statsStartTime;
    console.log(`✅ Stats queries completed in ${statsTime}ms`);
    console.log(`   - Students: ${students}`);
    console.log(`   - Institutions: ${institutions}`);
    console.log(`   - Courses: ${courses}`);
    console.log(`   - Languages: ${languages}`);

    // Test 3: Test courses by country query
    console.log('\n3. Testing courses by country query...');
    const countryStartTime = Date.now();
    
    const coursesByCountry = await prisma.course.groupBy({
      by: ['institutionId'],
      where: {
        status: 'published',
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 8,
    });

    const countryTime = Date.now() - countryStartTime;
    console.log(`✅ Courses by country query completed in ${countryTime}ms`);
    console.log(`   - Found ${coursesByCountry.length} institution groups`);

    console.log('\n🎉 All tests passed! Server warmup is working correctly.');

  } catch (error) {
    console.error('\n❌ Server warmup test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testServerWarmup(); 