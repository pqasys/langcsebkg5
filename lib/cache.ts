interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class LRUCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize: number;
  private accessOrder: string[] = [];

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      return null;
    }

    // Update access order
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);

    return item.value;
  }

  async set<T>(key: string, value: T, ttl: number = 300000): Promise<void> {
    // Remove if already exists
    if (this.cache.has(key)) {
      this.removeFromAccessOrder(key);
    }

    // Evict least recently used if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.accessOrder.shift();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    // Add new item
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
    this.accessOrder.push(key);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.removeFromAccessOrder(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.accessOrder = [];
  }

  async has(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      return false;
    }
    
    return true;
  }

  async size(): Promise<number> {
    return this.cache.size;
  }

  async keys(): Promise<string[]> {
    return Array.from(this.cache.keys());
  }

  async stats(): Promise<{
    size: number;
    maxSize: number;
    hitRate: number;
    missRate: number;
  }> {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? this.hitCount / totalRequests : 0;
    const missRate = totalRequests > 0 ? this.missCount / totalRequests : 0;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate,
      missRate
    };
  }

  private hitCount = 0;
  private missCount = 0;

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  // Track cache hits and misses
  private trackHit(): void {
    this.hitCount++;
  }

  private trackMiss(): void {
    this.missCount++;
  }
}

// Create a singleton cache instance
const cacheInstance = new LRUCache(1000);

// Export the cache interface
export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    const result = await cacheInstance.get<T>(key);
    if (result !== null) {
      cacheInstance['trackHit']();
    } else {
      cacheInstance['trackMiss']();
    }
    return result;
  },
  set: async <T>(key: string, value: T, ttl?: number): Promise<void> => {
    await cacheInstance.set(key, value, ttl);
  },
  delete: async (key: string): Promise<void> => {
    await cacheInstance.delete(key);
  },
  clear: async (): Promise<void> => {
    await cacheInstance.clear();
  },
  has: async (key: string): Promise<boolean> => {
    return await cacheInstance.has(key);
  },
  size: async (): Promise<number> => {
    return await cacheInstance.size();
  },
  keys: async (): Promise<string[]> => {
    return await cacheInstance.keys();
  },
  stats: async () => {
    return await cacheInstance.stats();
  }
};

export default cache; 