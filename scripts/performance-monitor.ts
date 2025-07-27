#!/usr/bin/env tsx

import { cacheUtils } from '@/lib/enhanced-cache';
import { queryOptimizer } from '@/lib/database-optimizer';

interface PerformanceMetrics {
  timestamp: Date;
  cacheStats: any;
  databaseStats: any;
  memoryUsage: NodeJS.MemoryUsage;
  uptime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private interval: NodeJS.Timeout | null = null;

  start(intervalMs: number = 60000) { // Default: 1 minute
    console.log('🚀 Starting performance monitor...');
    
    this.interval = setInterval(() => {
      this.collectMetrics();
    }, intervalMs);

    // Collect initial metrics
    this.collectMetrics();
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('⏹️ Performance monitor stopped');
    }
  }

  private collectMetrics() {
    const metrics: PerformanceMetrics = {
      timestamp: new Date(),
      cacheStats: cacheUtils.stats(),
      databaseStats: this.getDatabaseStats(),
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };

    this.metrics.push(metrics);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    this.logMetrics(metrics);
  }

  private getDatabaseStats() {
    // This would need to be implemented based on your database monitoring
    // For now, return basic stats
    return {
      activeConnections: 0,
      queryCount: 0,
      slowQueries: 0
    };
  }

  private logMetrics(metrics: PerformanceMetrics) {
    const { cacheStats, memoryUsage, uptime } = metrics;
    
    console.log('\n📊 Performance Metrics:', {
      timestamp: metrics.timestamp.toISOString(),
      cache: {
        hitRate: `${cacheStats.hitRate}%`,
        totalEntries: cacheStats.totalEntries,
        hitCount: cacheStats.hitCount,
        missCount: cacheStats.missCount
      },
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
      },
      uptime: `${Math.round(uptime / 60)} minutes`
    });

    // Log warnings for performance issues
    if (cacheStats.hitRate < 50) {
      console.warn('⚠️ Low cache hit rate detected');
    }

    if (memoryUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
      console.warn('⚠️ High memory usage detected');
    }
  }

  getReport() {
    if (this.metrics.length === 0) {
      return 'No metrics collected yet';
    }

    const latest = this.metrics[this.metrics.length - 1];
    const oldest = this.metrics[0];
    const duration = latest.timestamp.getTime() - oldest.timestamp.getTime();

    const avgHitRate = this.metrics.reduce((sum, m) => sum + m.cacheStats.hitRate, 0) / this.metrics.length;
    const avgMemoryUsage = this.metrics.reduce((sum, m) => sum + m.memoryUsage.heapUsed, 0) / this.metrics.length;

    return {
      duration: `${Math.round(duration / 1000 / 60)} minutes`,
      averageHitRate: `${Math.round(avgHitRate * 100) / 100}%`,
      averageMemoryUsage: `${Math.round(avgMemoryUsage / 1024 / 1024)}MB`,
      totalMetrics: this.metrics.length,
      latestMetrics: latest
    };
  }

  exportMetrics(filename: string = 'performance-metrics.json') {
    const fs = require('fs');
    const path = require('path');
    
    const exportPath = path.join(process.cwd(), 'logs', filename);
    
    // Ensure logs directory exists
    const logsDir = path.dirname(exportPath);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.writeFileSync(exportPath, JSON.stringify(this.metrics, null, 2));
    console.log(` Metrics exported to ${exportPath}`);
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n📊 Final Performance Report:');
    console.log(monitor.getReport());
    monitor.exportMetrics();
    monitor.stop();
    process.exit(0);
  });

  // Start monitoring
  monitor.start();

  console.log('Press Ctrl+C to stop monitoring and generate report');
}

export default PerformanceMonitor; 