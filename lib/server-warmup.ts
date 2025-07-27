import { PrismaClient } from '@prisma/client';

let isWarmedUp = false;
let warmupPromise: Promise<void> | null = null;

// Create a single Prisma instance for the server
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function performWarmup(): Promise<void> {
  if (isWarmedUp) {
    return;
  }

  if (warmupPromise) {
    return warmupPromise;
  }

  warmupPromise = (async () => {
    try {
      console.log('🔥 Warming up database connection on server start...');
      
      // Test basic connection
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Basic connection established');

      // Preload common queries
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

      console.log('✅ Common queries preloaded');
      isWarmedUp = true;
      console.log('🎉 Database warmup completed successfully');
    } catch (error) {
      console.error('❌ Database warmup failed:', error);
      throw error;
    } finally {
      warmupPromise = null;
    }
  })();

  return warmupPromise;
}

// Export the warmup function and prisma client
export { performWarmup, prisma };

// Auto-warmup on module load (server start)
if (typeof window === 'undefined') {
  // Only run on server side
  performWarmup().catch(error => {
    console.error('Failed to warm up database on server start:', error);
  });
} 