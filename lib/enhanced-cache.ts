// Enhanced cache implementation with TTL and performance monitoring
interface CacheEntry {
  value: unknown;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

class EnhancedCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 1000; // Maximum number of entries
  private hitCount = 0;
  private missCount = 0;

  get(key: string): unknown {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.missCount++;
      return undefined;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.missCount++;
      return undefined;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.hitCount++;

    return entry.value;
  }

  set(key: string, value: unknown, ttl: number = 5 * 60 * 1000): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now()
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  stats() {
    const totalEntries = this.cache.size;
    const now = Date.now();
    let expiredEntries = 0;
    const totalSize = 0;
    let totalAge = 0;
    const mostAccessed: Array<{ key: string; count: number }> = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      }
      totalAge += now - entry.timestamp;
      mostAccessed.push({ key, count: entry.accessCount });
    }

    // Sort by access count and take top 10
    mostAccessed.sort((a, b) => b.count - a.count).slice(0, 10);

    const hitRate = this.hitCount + this.missCount > 0 
      ? (this.hitCount / (this.hitCount + this.missCount)) * 100 
      : 0;

    return {
      totalEntries,
      expiredEntries,
      totalSize,
      averageAge: totalEntries > 0 ? totalAge / totalEntries : 0,
      hitRate: Math.round(hitRate * 100) / 100,
      mostAccessed,
      hitCount: this.hitCount,
      missCount: this.missCount
    };
  }

  // Health check function
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: string }> {
    try {
      // Basic health check - verify cache operations work
      const testKey = '__health_check__';
      const testValue = { test: true, timestamp: Date.now() };
      
      this.set(testKey, testValue, 1000); // 1 second TTL
      const retrieved = this.get(testKey);
      this.delete(testKey);
      
      if (retrieved && typeof retrieved === 'object' && 'test' in retrieved) {
        return {
          status: 'healthy',
          details: 'Enhanced cache is operational'
        };
      } else {
        return {
          status: 'degraded',
          details: 'Cache operations partially working'
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: `Cache health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Invalidate cache entries by pattern
  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

const enhancedCache = new EnhancedCache();

export const cacheUtils = {
  get: (key: string) => enhancedCache.get(key),
  set: (key: string, value: unknown, ttl?: number) => enhancedCache.set(key, value, ttl),
  delete: (key: string) => enhancedCache.delete(key),
  clear: () => enhancedCache.clear(),
  stats: () => enhancedCache.stats(),
  healthCheck: () => enhancedCache.healthCheck(),
  invalidatePattern: (pattern: string) => enhancedCache.invalidatePattern(pattern),
  cleanup: () => enhancedCache.cleanup(),
  course: {
    invalidateAll: () => enhancedCache.invalidatePattern('course')
  },
  institution: {
    invalidateAll: () => enhancedCache.invalidatePattern('institution')
  },
  user: {
    invalidateAll: () => enhancedCache.invalidatePattern('user')
  }
};

export const globalCache = cacheUtils;
export default EnhancedCache;

// Clean up expired entries every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    enhancedCache.cleanup();
  }, 5 * 60 * 1000);
}
