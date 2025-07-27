// Performance Integration Module
// Combines Redis caching, database optimization, CDN integration, and load balancing

import { PrismaClient } from '@prisma/client';
import { queryOptimizer } from './database-optimizer';
import { cdnOptimizer, AssetType } from './cdn-optimizer';
import { LoadBalancer, LoadBalancingStrategy, defaultLoadBalancerConfig } from './load-balancer';
import { cacheUtils } from './enhanced-cache';
import { simpleCache } from './simple-cache';

// Performance monitoring interface
interface PerformanceMetrics {
  timestamp: Date;
  redis: {
    hitRate: number;
    memoryUsage: number;
    keysCount: number;
    averageResponseTime: number;
  };
  database: {
    totalQueries: number;
    averageDuration: number;
    cacheHitRate: number;
    slowQueries: number;
  };
  cdn: {
    isEnabled: boolean;
    domain: string;
    assetCount: number;
  };
  loadBalancer: {
    totalServers: number;
    activeServers: number;
    totalConnections: number;
    averageResponseTime: number;
  };
  overall: {
    averageResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
}

// Performance configuration
interface PerformanceConfig {
  redis: {
    enabled: boolean;
    ttl: {
      short: number;
      medium: number;
      long: number;
      veryLong: number;
    };
  };
  database: {
    queryTimeout: number;
    maxConnections: number;
    enableQueryLogging: boolean;
  };
  cdn: {
    enabled: boolean;
    compression: boolean;
    imageOptimization: boolean;
  };
  loadBalancer: {
    enabled: boolean;
    healthCheckInterval: number;
    failover: boolean;
  };
  monitoring: {
    enabled: boolean;
    metricsInterval: number;
    alertThresholds: {
      responseTime: number;
      errorRate: number;
      cacheHitRate: number;
    };
  };
}

// Main Performance Integration class
export class PerformanceIntegration {
  private config: PerformanceConfig;
  private loadBalancer: LoadBalancer | null = null;
  private metrics: PerformanceMetrics[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor(config?: Partial<PerformanceConfig>) {
    this.config = {
      redis: {
        enabled: true,
        ttl: {
          short: 60, // 1 minute
          medium: 300, // 5 minutes
          long: 1800, // 30 minutes
          veryLong: 86400 // 24 hours
        }
      },
      database: {
        queryTimeout: 30000, // 30 seconds
        maxConnections: 10,
        enableQueryLogging: process.env.NODE_ENV === 'development'
      },
      cdn: {
        enabled: true,
        compression: true,
        imageOptimization: true
      },
      loadBalancer: {
        enabled: false, // Disabled by default
        healthCheckInterval: 30000,
        failover: true
      },
      monitoring: {
        enabled: true,
        metricsInterval: 60000, // 1 minute
        alertThresholds: {
          responseTime: 1000, // 1 second
          errorRate: 0.05, // 5%
          cacheHitRate: 0.7 // 70%
        }
      },
      ...config
    };

    this.initialize();
  }

  // Initialize all performance systems
  private async initialize(): Promise<void> {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('🚀 Initializing Performance Integration...');

    // Initialize Redis cache
    if (this.config.redis.enabled) {
      await this.initializeRedis();
    }

    // Initialize database optimizer
    await this.initializeDatabase();

    // Initialize CDN
    if (this.config.cdn.enabled) {
      this.initializeCDN();
    }

    // Initialize load balancer
    if (this.config.loadBalancer.enabled) {
      this.initializeLoadBalancer();
    }

    // Start monitoring
    if (this.config.monitoring.enabled) {
      this.startMonitoring();
    }

    console.log('✅ Performance Integration initialized successfully');
  }

  // Initialize Redis cache
  private async initializeRedis(): Promise<void> {
    try {
      const health = await simpleCache.healthCheck();
      console.log(` Redis Cache: ${health.status} - ${health.details}`);
    } catch (error) {
      console.error('❌ Redis initialization failed:', error);
    }
  }

  // Initialize database optimizer
  private async initializeDatabase(): Promise<void> {
    try {
      const health = await queryOptimizer.healthCheck();
      console.log(`�️ Database Optimizer: ${health.database} | Redis: ${health.redis} | Enhanced Cache: ${health.enhancedCache}`);
    } catch (error) {
      console.error('❌ Database optimizer initialization failed:', error);
    }
  }

  // Initialize CDN
  private initializeCDN(): void {
    if (cdnOptimizer.isEnabled()) {
      console.log(`� CDN: Enabled - ${cdnOptimizer.getDomain()}`);
    } else {
      console.log('🌐 CDN: Disabled - no domain configured');
    }
  }

  // Initialize load balancer
  private initializeLoadBalancer(): void {
    const config = {
      ...defaultLoadBalancerConfig,
      healthCheck: {
        ...defaultLoadBalancerConfig.healthCheck,
        interval: this.config.loadBalancer.healthCheckInterval
      },
      failover: this.config.loadBalancer.failover
    };

    this.loadBalancer = new LoadBalancer(config);
    console.log('⚖️ Load Balancer: Initialized');
  }

  // Start performance monitoring
  private startMonitoring(): void {
    this.monitoringInterval = setInterval(async () => {
      await this.collectMetrics();
      this.checkAlerts();
    }, this.config.monitoring.metricsInterval);
  }

  // Collect performance metrics
  private async collectMetrics(): Promise<void> {
    try {
      const [redisStats, dbStats, loadBalancerStats] = await Promise.all([
        simpleCache.getStats(),
        queryOptimizer.getPerformanceMetrics(),
        this.loadBalancer?.getStats() || null
      ]);

      const metrics: PerformanceMetrics = {
        timestamp: new Date(),
        redis: {
          hitRate: redisStats.hitRate,
          memoryUsage: redisStats.memoryUsage,
          keysCount: redisStats.keysCount,
          averageResponseTime: redisStats.averageResponseTime
        },
        database: {
          totalQueries: dbStats.totalQueries,
          averageDuration: dbStats.averageDuration,
          cacheHitRate: dbStats.cacheHitRate,
          slowQueries: dbStats.slowQueries
        },
        cdn: {
          isEnabled: cdnOptimizer.isEnabled(),
          domain: cdnOptimizer.getDomain(),
          assetCount: 0 // Would need to track asset count
        },
        loadBalancer: loadBalancerStats ? {
          totalServers: loadBalancerStats.totalServers,
          activeServers: loadBalancerStats.activeServers,
          totalConnections: loadBalancerStats.totalConnections,
          averageResponseTime: loadBalancerStats.averageResponseTime
        } : {
          totalServers: 0,
          activeServers: 0,
          totalConnections: 0,
          averageResponseTime: 0
        },
        overall: {
          averageResponseTime: (redisStats.averageResponseTime + dbStats.averageDuration) / 2,
          cacheHitRate: (redisStats.hitRate + dbStats.cacheHitRate) / 2,
          errorRate: 0 // Would need to track errors
        }
      };

      this.metrics.push(metrics);

      // Keep only last 1000 metrics
      if (this.metrics.length > 1000) {
        this.metrics = this.metrics.slice(-1000);
      }

    } catch (error) {
      console.error('Error collecting performance metrics:', error);
    }
  }

  // Check for performance alerts
  private checkAlerts(): void {
    if (this.metrics.length === 0) return;

    const latest = this.metrics[this.metrics.length - 1];
    const { alertThresholds } = this.config.monitoring;

    // Check response time
    if (latest.overall.averageResponseTime > alertThresholds.responseTime) {
      // // // // // // console.warn(`⚠️ High response time: ${latest.overall.averageResponseTime}ms`);
    }

    // Check cache hit rate
    if (latest.overall.cacheHitRate < alertThresholds.cacheHitRate) {
      console.warn(`⚠️ Low cache hit rate: ${(latest.overall.cacheHitRate * 100).toFixed(1)}%`);
    }

    // Check error rate
    if (latest.overall.errorRate > alertThresholds.errorRate) {
      console.warn(`⚠️ High error rate: ${(latest.overall.errorRate * 100).toFixed(1)}%`);
    }
  }

  // Optimized data fetching with all performance layers
  async getOptimizedData<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    options: {
      ttl?: number;
      assetType?: AssetType;
      cacheKey?: string;
    } = {}
  ): Promise<T> {
    const startTime = Date.now();
    const ttl = options.ttl || this.config.redis.ttl.medium;
    const assetType = options.assetType || AssetType.API;

    try {
      // Try Redis cache first
      if (this.config.redis.enabled) {
        const cached = await simpleCache.get<T>(key);
        if (cached) {
          this.recordPerformance('cache_hit', Date.now() - startTime);
          return cached;
        }
      }

      // Try enhanced cache
      const enhancedCached = await cacheUtils.get<T>(key);
      if (enhancedCached) {
        this.recordPerformance('cache_hit', Date.now() - startTime);
        return enhancedCached;
      }

      // Fetch fresh data
      const data = await fetchFunction();

      // Cache in both systems
      await Promise.all([
        this.config.redis.enabled && simpleCache.set(key, data, ttl),
        cacheUtils.set(key, data, ttl * 1000)
      ]);

      this.recordPerformance('cache_miss', Date.now() - startTime);
      return data;

    } catch (error) {
    console.error('Error occurred:', error);
      this.recordPerformance('error', Date.now() - startTime);
      throw error;
    }
  }

  // Optimized image URL generation
  optimizeImageUrl(path: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}): string {
    if (!this.config.cdn.enabled) {
      return path;
    }

    return cdnOptimizer.optimizeImageUrl(path, options);
  }

  // Optimized asset URL generation
  optimizeAssetUrl(path: string, assetType: AssetType = AssetType.STATIC): string {
    if (!this.config.cdn.enabled) {
      return path;
    }

    return cdnOptimizer.optimizeAssetUrl(path, assetType);
  }

  // Database query with optimization
  async optimizedQuery<T>(
    queryFunction: () => Promise<T>,
    cacheKey?: string
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await queryFunction();
      this.recordPerformance('database_query', Date.now() - startTime);
      return result;
    } catch (error) {
    console.error('Error occurred:', error);
      this.recordPerformance('database_error', Date.now() - startTime);
      throw error;
    }
  }

  // Cache invalidation across all systems
  async invalidateCache(pattern: string): Promise<void> {
    await Promise.all([
      this.config.redis.enabled && simpleCache.invalidatePattern(pattern),
      cacheUtils.invalidatePattern(pattern)
    ]);
  }

  // Get performance statistics
  getPerformanceStats(): PerformanceMetrics | null {
    if (this.metrics.length === 0) return null;
    return this.metrics[this.metrics.length - 1];
  }

  // Get historical metrics
  getHistoricalMetrics(hours: number = 24): PerformanceMetrics[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.metrics.filter(m => m.timestamp.getTime() > cutoff);
  }

  // Record performance metric
  private recordPerformance(type: string, duration: number): void {
    // This would integrate with your monitoring system
    console.debug(`Performance: ${type} - ${duration}ms`);
  }

  // Health check for all systems
  async healthCheck(): Promise<{
    redis: string;
    database: string;
    cdn: string;
    loadBalancer: string;
    overall: string;
  }> {
    const checks = await Promise.all([
      simpleCache.healthCheck(),
      queryOptimizer.healthCheck(),
      Promise.resolve({ status: cdnOptimizer.isEnabled() ? 'healthy' : 'disabled' }),
      Promise.resolve({ status: this.loadBalancer ? 'healthy' : 'disabled' })
    ]);

    const overall = checks.every(check => check.status === 'healthy') ? 'healthy' : 'degraded';

    return {
      redis: checks[0].status,
      database: checks[1].database,
      cdn: checks[2].status,
      loadBalancer: checks[3].status,
      overall
    };
  }

  // Cleanup resources
  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up Performance Integration...');

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    if (this.loadBalancer) {
      this.loadBalancer.stopHealthChecks();
    }

    await queryOptimizer.cleanup();

    console.log('✅ Performance Integration cleanup completed');
  }
}

// Default performance integration instance
export const performanceIntegration = new PerformanceIntegration();

// Utility functions for common performance operations
export const performanceUtils = {
  // Optimize multiple assets at once
  optimizeAssets(assets: Array<{ path: string; type: AssetType }>): Record<string, string> {
    return cdnOptimizer.optimizeAssets(assets);
  },

  // Generate responsive image URLs
  getResponsiveImages(basePath: string, sizes: number[]): Record<string, string> {
    const urls: Record<string, string> = {};
    sizes.forEach(size => {
      urls[`${size}w`] = performanceIntegration.optimizeImageUrl(basePath, { 
        width: size, 
        format: 'webp' 
      });
    });
    return urls;
  },

  // Batch cache operations
  async batchCache<T>(
    items: Array<{ key: string; data: T; ttl?: number }>
  ): Promise<void> {
    await Promise.all(
      items.map(({ key, data, ttl }) => 
        simpleCache.set(key, data, ttl || 300)
      )
    );
  },

  // Batch cache retrieval
  async batchGetCache<T>(keys: string[]): Promise<(T | null)[]> {
    return await simpleCache.mget(keys);
  }
};

// Export types
export type { PerformanceMetrics, PerformanceConfig }; 