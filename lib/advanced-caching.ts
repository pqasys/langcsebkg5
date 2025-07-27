// Advanced caching system with sophisticated invalidation strategies

// Cache configuration interface
interface CacheConfig {
  name: string;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'cache-only' | 'network-only';
  maxAge: number; // in seconds
  maxEntries: number;
  patterns: string[];
  dependencies: string[];
  invalidationTriggers: string[];
  priority: 'high' | 'normal' | 'low';
  compress: boolean;
}

// Invalidation item interface
interface InvalidationItem {
  id: string;
  type: 'pattern' | 'exact' | 'dependency' | 'version';
  target: string;
  timestamp: Date;
  priority: 'immediate' | 'deferred' | 'background';
}

// Cache stats interface
interface CacheStats {
  totalCaches: number;
  totalEntries: number;
  totalSize: number;
  cacheDetails: {
    name: string;
    strategy: string;
    entries: number;
    size: number;
    maxEntries: number;
    maxAge: number;
  }[];
}

export class AdvancedCaching {
  private static instance: AdvancedCaching;
  private cacheVersion = 'v3';
  private cacheConfigs: Map<string, CacheConfig> = new Map();
  private invalidationQueue: InvalidationItem[] = [];
  private isProcessingQueue = false;

  private constructor() {
    this.initializeCacheConfigs();
  }

  static getInstance(): AdvancedCaching {
    if (!AdvancedCaching.instance) {
      AdvancedCaching.instance = new AdvancedCaching();
    }
    return AdvancedCaching.instance;
  }

  // Initialize cache configurations
  private initializeCacheConfigs() {
    // Static content - cache first with long TTL
    this.cacheConfigs.set('static', {
      name: 'fluentish-static-v3',
      strategy: 'cache-first',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      maxEntries: 1000,
      patterns: ['/static/', '/_next/static/', '/images/', '/icons/'],
      dependencies: [],
      invalidationTriggers: ['app-update', 'content-update'],
      priority: 'high',
      compress: true
    });

    // API responses - network first with shorter TTL
    this.cacheConfigs.set('api', {
      name: 'fluentish-api-v3',
      strategy: 'network-first',
      maxAge: 5 * 60, // 5 minutes
      maxEntries: 500,
      patterns: ['/api/courses/', '/api/categories/', '/api/institutions/'],
      dependencies: [],
      invalidationTriggers: ['data-update', 'user-action'],
      priority: 'normal',
      compress: false
    });

    // User-specific data - stale while revalidate
    this.cacheConfigs.set('user-data', {
      name: 'fluentish-user-v3',
      strategy: 'stale-while-revalidate',
      maxAge: 2 * 60, // 2 minutes
      maxEntries: 200,
      patterns: ['/api/user/', '/api/student/', '/api/institution/'],
      dependencies: ['user-session'],
      invalidationTriggers: ['user-action', 'session-change'],
      priority: 'high',
      compress: false
    });

    // Dynamic content - network first with very short TTL
    this.cacheConfigs.set('dynamic', {
      name: 'fluentish-dynamic-v3',
      strategy: 'network-first',
      maxAge: 30, // 30 seconds
      maxEntries: 300,
      patterns: ['/api/search/', '/api/stats/', '/api/analytics/'],
      dependencies: [],
      invalidationTriggers: ['real-time-update'],
      priority: 'low',
      compress: true
    });

    // Images - cache first with medium TTL
    this.cacheConfigs.set('images', {
      name: 'fluentish-images-v3',
      strategy: 'cache-first',
      maxAge: 24 * 60 * 60, // 24 hours
      maxEntries: 2000,
      patterns: ['/uploads/', '/_next/image', '/temp/'],
      dependencies: [],
      invalidationTriggers: ['image-update', 'content-update'],
      priority: 'normal',
      compress: false
    });
  }

  // Get cache configuration for a URL
  getCacheConfig(url: string): CacheConfig | null {
    for (const [key, config] of this.cacheConfigs) {
      if (config.patterns.some(pattern => url.includes(pattern))) {
        return config;
      }
    }
    return null;
  }

  // Intelligent cache invalidation
  async invalidateCache(options: {
    type: 'pattern' | 'exact' | 'dependency' | 'version';
    target: string;
    priority?: 'immediate' | 'deferred' | 'background';
    reason?: string;
  }): Promise<void> {
    const invalidationItem: InvalidationItem = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: options.type,
      target: options.target,
      timestamp: new Date(),
      priority: options.priority || 'deferred'
    };

    // Add to invalidation queue
    this.invalidationQueue.push(invalidationItem);

    // Process queue based on priority
    if (options.priority === 'immediate') {
      await this.processInvalidationQueue();
    } else if (!this.isProcessingQueue) {
      // Process deferred items after a delay
      setTimeout(() => this.processInvalidationQueue(), 1000);
    }

    // // // // // // // // // // // // // // // console.log(`Cache invalidation queued: ${options.type} - ${options.target} (${options.reason || 'no reason'})`);
  }

  // Process invalidation queue
  private async processInvalidationQueue(): Promise<void> {
    if (this.isProcessingQueue || this.invalidationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      // Sort by priority and timestamp
      this.invalidationQueue.sort((a, b) => {
        const priorityOrder = { immediate: 0, deferred: 1, background: 2 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.timestamp.getTime() - b.timestamp.getTime();
      });

      const itemsToProcess = [...this.invalidationQueue];
      this.invalidationQueue = [];

      for (const item of itemsToProcess) {
        await this.processInvalidationItem(item);
      }
    } catch (error) {
      logger.error('Error processing invalidation queue:');
    } finally {
      this.isProcessingQueue = false;
    }
  }

  // Process individual invalidation item
  private async processInvalidationItem(item: InvalidationItem): Promise<void> {
    try {
      switch (item.type) {
        case 'pattern':
          await this.invalidateByPattern(item.target);
          break;
        case 'exact':
          await this.invalidateExact(item.target);
          break;
        case 'dependency':
          await this.invalidateByDependency(item.target);
          break;
        case 'version':
          await this.invalidateByVersion(item.target);
          break;
      }

      console.log(`Cache invalidation completed: ${item.type} - ${item.target}`);
    } catch (error) {
      logger.error('Failed to process invalidation item ${item.id}:');
    }
  }

  // Invalidate cache by pattern
  private async invalidateByPattern(pattern: string): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const matchingCaches = cacheNames.filter(name => name.includes(pattern));
      
      for (const cacheName of matchingCaches) {
        await caches.delete(cacheName);
        console.log(`Deleted cache: ${cacheName}`);
      }
    }
  }

  // Invalidate exact cache entry
  private async invalidateExact(url: string): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        await cache.delete(url);
      }
    }
  }

  // Invalidate cache by dependency
  private async invalidateByDependency(dependency: string): Promise<void> {
    // Find all cache configs that depend on this dependency
    const dependentConfigs = Array.from(this.cacheConfigs.values())
      .filter(config => config.dependencies.includes(dependency));
    
    for (const config of dependentConfigs) {
      await this.invalidateByPattern(config.name);
    }
  }

  // Invalidate cache by version
  private async invalidateByVersion(version: string): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const versionCaches = cacheNames.filter(name => name.includes(version));
      
      for (const cacheName of versionCaches) {
        await caches.delete(cacheName);
        console.log(`Deleted version cache: ${cacheName}`);
      }
    }
  }

  // Get cache statistics
  async getCacheStats(): Promise<CacheStats> {
    const stats: CacheStats = {
      totalCaches: 0,
      totalEntries: 0,
      totalSize: 0,
      cacheDetails: []
    };

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      stats.totalCaches = cacheNames.length;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        const config = this.getCacheConfig(cacheName);
        
        const cacheDetail = {
          name: cacheName,
          strategy: config?.strategy || 'unknown',
          entries: keys.length,
          size: 0, // Would need to calculate actual size
          maxEntries: config?.maxEntries || 0,
          maxAge: config?.maxAge || 0
        };

        stats.cacheDetails.push(cacheDetail);
        stats.totalEntries += keys.length;
      }
    }

    return stats;
  }

  // Clear all caches
  async clearAllCaches(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log(`Cleared cache: ${cacheName}`);
      }
    }
  }

  // Invalidate course-related caches
  async invalidateCourseCache(courseId: string): Promise<void> {
    await this.invalidateCache({
      type: 'pattern',
      target: `course-${courseId}`,
      priority: 'immediate',
      reason: 'course-update'
    });
  }

  // Invalidate user-related caches
  async invalidateUserCache(userId: string): Promise<void> {
    await this.invalidateCache({
      type: 'pattern',
      target: `user-${userId}`,
      priority: 'immediate',
      reason: 'user-update'
    });
  }

  // Invalidate all API caches
  async invalidateAllAPICaches(): Promise<void> {
    await this.invalidateCache({
      type: 'pattern',
      target: 'api',
      priority: 'deferred',
      reason: 'api-update'
    });
  }

  // Invalidate static assets
  async invalidateStaticAssets(): Promise<void> {
    await this.invalidateCache({
      type: 'pattern',
      target: 'static',
      priority: 'background',
      reason: 'static-update'
    });
  }
} 