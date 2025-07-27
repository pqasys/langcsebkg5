import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function warmupDatabase() {
  console.log('🔥 Warming up database connection...\n');

  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Basic connection successful');

    // Preload common queries
    console.log('\n2. Preloading common queries...');
    
    // Preload stats queries
    await Promise.all([
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
      })
    ]);
    console.log('✅ Stats queries preloaded');

    // Preload courses by country query
    await prisma.course.groupBy({
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
    console.log('✅ Courses by country query preloaded');

    console.log('\n🎉 Database warmup completed successfully!');
    console.log('💡 The database connection is now ready for optimal performance.');

  } catch (error) {
    console.error('\n❌ Database warmup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the warmup
warmupDatabase(); 