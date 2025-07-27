import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  prisma = global.prisma;
}

// Add a check to ensure prisma is properly initialized
if (!prisma) {
  logger.error('Prisma client failed to initialize');
  throw new Error(`Prisma client failed to initialize - Context: throw new Error('Prisma client failed to initializ...`);
}

// Add connection health check
async function checkConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database connection check failed:', error);
    return false;
  }
}

// Export connection check function
export { checkConnection };

export { prisma }; 