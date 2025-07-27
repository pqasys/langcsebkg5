import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testHomepagePerformance() {
  console.log('Testing homepage API performance...\n');

  try {
    // Test stats endpoint performance
    console.log('Testing stats endpoint...');
    const startTime = Date.now();
    
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
        by: ['language'],
        where: {
          status: 'published'
        }
      }).then(result => result.length)
    ]);

    const statsTime = Date.now() - startTime;
    console.log(` Stats query completed in ${statsTime}ms`);
    console.log(`   - Students: ${students}`);
    console.log(`   - Institutions: ${institutions}`);
    console.log(`   - Courses: ${courses}`);
    console.log(`   - Languages: ${languages}\n`);

    // Test courses by country endpoint performance
    console.log('Testing courses by country endpoint...');
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

    const institutionIds = coursesByCountry.map(group => group.institutionId);
    const institutionData = await prisma.institution.findMany({
      where: {
        id: { in: institutionIds }
      },
      select: {
        id: true,
        country: true,
      },
    });

    const countryTime = Date.now() - countryStartTime;
    console.log(` Courses by country query completed in ${countryTime}ms`);
    console.log(`   - Found ${coursesByCountry.length} institution groups`);
    console.log(`   - Found ${institutionData.length} institutions\n`);

    // Test database connection
    console.log('Testing database connection...');
    const connectionStartTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const connectionTime = Date.now() - connectionStartTime;
    console.log(` Database connection test completed in ${connectionTime}ms\n`);

    // Check for potential performance issues
    console.log('Performance Analysis:');
    if (statsTime > 1000) {
      console.log(`⚠️  Stats query is slow (${statsTime}ms) - consider adding indexes`);
    } else {
      console.log(` Stats query performance is good (${statsTime}ms)`);
    }

    if (countryTime > 1000) {
      console.log(`⚠️  Courses by country query is slow (${countryTime}ms) - consider adding indexes`);
    } else {
      console.log(` Courses by country query performance is good (${countryTime}ms)`);
    }

    if (connectionTime > 100) {
      console.log(`⚠️  Database connection is slow (${connectionTime}ms)`);
    } else {
      console.log(` Database connection is fast (${connectionTime}ms)`);
    }

    const totalTime = statsTime + countryTime;
    console.log(`\nTotal API time: ${totalTime}ms`);
    
    if (totalTime > 2000) {
      console.log('⚠️  Total API time is high - consider implementing caching');
    } else {
      console.log('✅ Total API time is acceptable');
    }

  } catch (error) {
    console.error('❌ Error testing performance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testHomepagePerformance(); 