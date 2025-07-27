import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const connectionTime = Date.now() - startTime;
    console.log(`✅ Connection successful (${connectionTime}ms)`);

    // Test 2: Stats queries (same as API)
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
    console.log(`✅ Stats queries successful (${statsTime}ms)`);
    console.log(`   - Students: ${students}`);
    console.log(`   - Institutions: ${institutions}`);
    console.log(`   - Courses: ${courses}`);
    console.log(`   - Languages: ${languages}`);

    // Test 3: Connection pool info
    console.log('\n3. Testing connection pool...');
    const poolStartTime = Date.now();
    
    // Test multiple concurrent queries
    const concurrentQueries = Array.from({ length: 5 }, () => 
      prisma.$queryRaw`SELECT 1`
    );
    
    await Promise.all(concurrentQueries);
    const poolTime = Date.now() - poolStartTime;
    console.log(`✅ Connection pool test successful (${poolTime}ms)`);

    // Test 4: Database info
    console.log('\n4. Getting database info...');
    const dbInfo = await prisma.$queryRaw`SELECT VERSION() as version, DATABASE() as db_name`;
    console.log('✅ Database info:', dbInfo);

    console.log('\n🎉 All tests passed! Database connection is working properly.');

  } catch (error) {
    console.error('\n❌ Database connection test failed:', error);
    
    // Provide troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if MySQL server is running');
    console.log('2. Verify DATABASE_URL environment variable');
    console.log('3. Check database credentials');
    console.log('4. Ensure database exists and is accessible');
    console.log('5. Check firewall settings');
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.log('\n💡 This looks like a connection refused error. Make sure:');
        console.log('   - MySQL server is running on localhost:3306');
        console.log('   - No firewall is blocking the connection');
      } else if (error.message.includes('Access denied')) {
        console.log('\n💡 This looks like an authentication error. Check:');
        console.log('   - Database username and password');
        console.log('   - User permissions');
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection(); 