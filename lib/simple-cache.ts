// Simple in-memory cache implementation to replace Redis
interface CacheEntry {
  value: unknown;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  metadata?: Record<string, any>;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
  memoryUsage: number;
  keysCount: number;
  averageResponseTime: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalRequests: 0,
    memoryUsage: 0,
    keysCount: 0,
    averageResponseTime: 0,
  };
  private maxSize = 1000; // Maximum number of entries

  constructor() {
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    this.stats.totalRequests++;

    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateStats(startTime);
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats(startTime);
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;

    this.updateStats(startTime);
    return entry.value as T;
  }

  async set(key: string, value: unknown, ttl: number = 300, metadata?: Record<string, any>): Promise<void> {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
      metadata
    });

    this.stats.keysCount = this.cache.size;
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.stats.keysCount = this.cache.size;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalRequests: 0,
      memoryUsage: 0,
      keysCount: 0,
      averageResponseTime: 0,
    };
  }

  async exists(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  async increment(key: string, value: number = 1): Promise<number> {
    const current = await this.get<number>(key) || 0;
    const newValue = current + value;
    await this.set(key, newValue, 300); // 5 minutes TTL for counters
    return newValue;
  }

  async expire(key: string, ttl: number): Promise<void> {
    const entry = this.cache.get(key);
    if (entry) {
      entry.ttl = ttl;
      entry.timestamp = Date.now();
    }
  }

  async getKeys(pattern: string): Promise<string[]> {
    const keys: string[] = [];
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        const entry = this.cache.get(key);
        if (entry && Date.now() - entry.timestamp <= entry.ttl * 1000) {
          keys.push(key);
        }
      }
    }
    
    return keys;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.getKeys(pattern);
    for (const key of keys) {
      this.cache.delete(key);
    }
    this.stats.keysCount = this.cache.size;
  }

  async getStats(): Promise<CacheStats> {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
    
    return {
      ...this.stats,
      hitRate,
      keysCount: this.cache.size,
      memoryUsage: this.calculateMemoryUsage()
    };
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: string }> {
    return {
      status: 'healthy',
      details: 'In-memory cache is operational'
    };
  }

  async mget(keys: string[]): Promise<(any | null)[]> {
    const results = await Promise.all(keys.map(key => this.get(key)));
    return results;
  }

  async mset(entries: Array<{ key: string; value: unknown; ttl?: number }>): Promise<void> {
    await Promise.all(entries.map(entry => 
      this.set(entry.key, entry.value, entry.ttl || 300)
    ));
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

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl * 1000) {
        this.cache.delete(key);
      }
    }
    this.stats.keysCount = this.cache.size;
  }

  private updateStats(startTime: number): void {
    const responseTime = Date.now() - startTime;
    this.stats.averageResponseTime = 
      (this.stats.averageResponseTime * (this.stats.totalRequests - 1) + responseTime) / this.stats.totalRequests;
  }

  private calculateMemoryUsage(): number {
    // Rough estimation of memory usage
    let size = 0;
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2; // UTF-16 characters
      size += JSON.stringify(entry.value).length * 2;
      size += 100; // Overhead for object structure
    }
    return size;
  }
}

// Export singleton instance
export const simpleCache = new SimpleCache(); 