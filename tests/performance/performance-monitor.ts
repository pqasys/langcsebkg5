import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  databaseQueries?: number;
  memoryUsage?: NodeJS.MemoryUsage;
}

interface DatabaseMetrics {
  queryCount: number;
  slowQueries: Array<{
    query: string;
    duration: number;
    timestamp: Date;
  }>;
  connectionPool: {
    active: number;
    idle: number;
    total: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private dbMetrics: DatabaseMetrics = {
    queryCount: 0,
    slowQueries: [],
    connectionPool: { active: 0, idle: 0, total: 0 }
  };
  private prisma: PrismaClient;
  private isMonitoring = false;

  constructor() {
    this.prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    this.setupDatabaseMonitoring();
  }

  private setupDatabaseMonitoring() {
    this.prisma.$on('query', (e) => {
      this.dbMetrics.queryCount++;
      
      // Track slow queries (> 1000ms)
      if (e.duration > 1000) {
        this.dbMetrics.slowQueries.push({
          query: e.query,
          duration: e.duration,
          timestamp: new Date()
        });
      }
    });
  }

  startMonitoring() {
    this.isMonitoring = true;
    // // // // // // // // // // // // // // // // // // // // // // // // console.log('🚀 Performance monitoring started');
  }

  stopMonitoring() {
    this.isMonitoring = false;
    console.log('⏹️ Performance monitoring stopped');
  }

  recordMetric(metric: Omit<PerformanceMetrics, 'timestamp'>) {
    if (!this.isMonitoring) return;

    const fullMetric: PerformanceMetrics = {
      ...metric,
      timestamp: new Date(),
      memoryUsage: process.memoryUsage()
    };

    this.metrics.push(fullMetric);

    // Log slow responses
    if (metric.responseTime > 2000) {
      // // console.warn(`� Slow response: ${metric.endpoint} took ${metric.responseTime}ms`);
    }
  }

  async measureDatabasePerformance() {
    const startTime = performance.now();
    
    try {
      // Test common database operations
      await this.prisma.user.count();
      await this.prisma.course.count();
      await this.prisma.institution.count();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      return {
        totalQueries: this.dbMetrics.queryCount,
        slowQueries: this.dbMetrics.slowQueries.length,
        averageResponseTime: duration / 3,
        memoryUsage: process.memoryUsage()
      };
    } catch (error) {
      console.error('Database performance test failed:', error);
      return null;
    }
  }

  async measureApiEndpoint(url: string, method: string = 'GET') {
    const startTime = performance.now();
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      this.recordMetric({
        endpoint: url,
        method,
        responseTime,
        statusCode: response.status
      });
      
      return {
        statusCode: response.status,
        responseTime,
        success: response.ok
      };
    } catch (error) {
      console.error(`API test failed for ${url}:`, error);
      return {
        statusCode: 0,
        responseTime: 0,
        success: false,
        error: error.message
      };
    }
  }

  getMetrics() {
    const totalRequests = this.metrics.length;
    const successfulRequests = this.metrics.filter(m => m.statusCode < 400).length;
    const failedRequests = totalRequests - successfulRequests;
    
    const responseTimes = this.metrics.map(m => m.responseTime);
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);
    
    return {
      summary: {
        totalRequests,
        successfulRequests,
        failedRequests,
        successRate: (successfulRequests / totalRequests) * 100
      },
      performance: {
        averageResponseTime: Math.round(avgResponseTime),
        maxResponseTime: Math.round(maxResponseTime),
        minResponseTime: Math.round(minResponseTime)
      },
      database: this.dbMetrics,
      recentMetrics: this.metrics.slice(-10)
    };
  }

  generateReport() {
    const metrics = this.getMetrics();
    
    console.log('\n📊 Performance Report');
    console.log('====================');
    console.log(`Total Requests: ${metrics.summary.totalRequests}`);
    console.log(`Success Rate: ${metrics.summary.successRate.toFixed(2)}%`);
    console.log(`Average Response Time: ${metrics.performance.averageResponseTime}ms`);
    console.log(`Max Response Time: ${metrics.performance.maxResponseTime}ms`);
    console.log(`Database Queries: ${metrics.database.queryCount}`);
    console.log(`Slow Queries: ${metrics.database.slowQueries.length}`);
    
    if (metrics.database.slowQueries.length > 0) {
      console.log('\n🐌 Slow Queries:');
      metrics.database.slowQueries.slice(-5).forEach(query => {
        console.log(`  - ${query.query.substring(0, 50)}... (${query.duration}ms)`);
      });
    }
    
    return metrics;
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-cleanup on process exit
process.on('exit', () => {
  performanceMonitor.cleanup();
});

process.on('SIGINT', () => {
  performanceMonitor.cleanup();
  process.exit(0);
}); 