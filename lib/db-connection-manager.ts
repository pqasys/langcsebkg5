import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

class DatabaseConnectionManager {
  private prisma: PrismaClient;
  private isWarmedUp = false;
  private warmupPromise: Promise<void> | null = null;
  private connectionCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    // Start connection monitoring
    this.startConnectionMonitoring();
  }

  private async startConnectionMonitoring() {
    // Check connection every 30 seconds
    this.connectionCheckInterval = setInterval(async () => {
      try {
        await this.prisma.$queryRaw`SELECT 1`;
      } catch (error) {
        logger.error('Database connection check failed:', error);
        this.isWarmedUp = false;
      }
    }, 30000);
  }

  private async warmupConnection(): Promise<void> {
    if (this.isWarmedUp) {
      return;
    }

    if (this.warmupPromise) {
      return this.warmupPromise;
    }

    this.warmupPromise = this.performWarmup();
    return this.warmupPromise;
  }

  private async performWarmup(): Promise<void> {
    try {
      logger.info('Warming up database connection...');

      // Test basic connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Preload common queries
      await Promise.all([
        this.prisma.user.count({
          where: { 
            role: 'STUDENT',
            status: 'ACTIVE'
          }
        }),
        this.prisma.institution.count({
          where: { 
            isApproved: true,
            status: 'ACTIVE'
          }
        }),
        this.prisma.course.count({
          where: { 
            status: 'published'
          }
        }),
        this.prisma.course.groupBy({
          by: ['framework'],
          where: {
            status: 'published'
          }
        })
      ]);

      this.isWarmedUp = true;
      logger.info('Database connection warmed up successfully');
    } catch (error) {
      logger.error('Database warmup failed:', error);
      throw error;
    } finally {
      this.warmupPromise = null;
    }
  }

  async getClient(): Promise<PrismaClient> {
    // Ensure connection is warmed up
    await this.warmupConnection();
    return this.prisma;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database connection test failed:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }
    await this.prisma.$disconnect();
  }

  isConnected(): boolean {
    return this.isWarmedUp;
  }
}

// Create singleton instance
const dbConnectionManager = new DatabaseConnectionManager();

// Graceful shutdown
process.on('SIGINT', async () => {
  await dbConnectionManager.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await dbConnectionManager.disconnect();
  process.exit(0);
});

export { dbConnectionManager }; 