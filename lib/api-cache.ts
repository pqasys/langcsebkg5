interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cache keys for different endpoints
  static getStatsKey(): string {
    return 'api:stats';
  }

  static getCoursesByCountryKey(): string {
    return 'api:courses-by-country';
  }

  // Invalidate cache when data changes
  invalidateStats(): void {
    this.delete(APICache.getStatsKey());
  }

  invalidateCoursesByCountry(): void {
    this.delete(APICache.getCoursesByCountryKey());
  }
}

// Export singleton instance and class
export const apiCache = new APICache();
export { APICache }; 