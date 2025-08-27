import { logger } from './logger';

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize: number; // Maximum number of items in cache
}

export interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>> = new Map();
  private config: CacheConfig = {
    ttl: 300, // 5 minutes default
    maxSize: 1000
  };

  private constructor() {
    // Start cleanup interval
    setInterval(() => this.cleanup(), 60000); // Cleanup every minute
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Set cache configuration
   */
  setConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    try {
      const item = this.cache.get(key);
      
      if (!item) {
        return null;
      }

      // Check if item has expired
      const now = Date.now();
      if (now - item.timestamp > item.ttl * 1000) {
        this.cache.delete(key);
        return null;
      }

      logger.debug(`Cache hit for key: ${key}`);
      return item.value;
    } catch (error) {
      logger.error('Error getting item from cache:', error);
      return null;
    }
  }

  /**
   * Set item in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    try {
      // Check if cache is full
      if (this.cache.size >= this.config.maxSize) {
        this.evictOldest();
      }

      const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
        ttl: ttl || this.config.ttl
      };

      this.cache.set(key, item);
      logger.debug(`Cache set for key: ${key}`);
    } catch (error) {
      logger.error('Error setting item in cache:', error);
    }
  }

  /**
   * Delete item from cache
   */
  delete(key: string): boolean {
    try {
      const deleted = this.cache.delete(key);
      if (deleted) {
        logger.debug(`Cache deleted for key: ${key}`);
      }
      return deleted;
    } catch (error) {
      logger.error('Error deleting item from cache:', error);
      return false;
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    try {
      this.cache.clear();
      logger.info('Cache cleared');
    } catch (error) {
      logger.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    keys: string[];
  } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: 0, // TODO: Implement hit rate tracking
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Cleanup expired items
   */
  private cleanup(): void {
    try {
      const now = Date.now();
      let cleanedCount = 0;

      for (const [key, item] of this.cache.entries()) {
        if (now - item.timestamp > item.ttl * 1000) {
          this.cache.delete(key);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        logger.debug(`Cache cleanup: removed ${cleanedCount} expired items`);
      }
    } catch (error) {
      logger.error('Error during cache cleanup:', error);
    }
  }

  /**
   * Evict oldest items when cache is full
   */
  private evictOldest(): void {
    try {
      let oldestKey: string | null = null;
      let oldestTime = Date.now();

      for (const [key, item] of this.cache.entries()) {
        if (item.timestamp < oldestTime) {
          oldestTime = item.timestamp;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey);
        logger.debug(`Cache eviction: removed oldest item with key: ${oldestKey}`);
      }
    } catch (error) {
      logger.error('Error during cache eviction:', error);
    }
  }
}

/**
 * Language threshold configuration cache
 */
export class LanguageThresholdCache {
  private static cache = CacheService.getInstance();
  private static readonly CACHE_PREFIX = 'lang_threshold:';
  private static readonly CONFIG_TTL = 600; // 10 minutes
  private static readonly METADATA_TTL = 3600; // 1 hour

  /**
   * Get cached threshold configuration
   */
  static getThresholdConfig(
    language: string,
    country?: string,
    region?: string
  ): any | null {
    const key = this.buildConfigKey(language, country, region);
    return this.cache.get(key);
  }

  /**
   * Set cached threshold configuration
   */
  static setThresholdConfig(
    language: string,
    country: string | undefined,
    region: string | undefined,
    config: any
  ): void {
    const key = this.buildConfigKey(language, country, region);
    this.cache.set(key, config, this.CONFIG_TTL);
  }

  /**
   * Get cached metadata
   */
  static getMetadata(type: 'languages' | 'countries' | 'regions', language?: string): string[] | null {
    const key = this.buildMetadataKey(type, language);
    return this.cache.get(key);
  }

  /**
   * Set cached metadata
   */
  static setMetadata(
    type: 'languages' | 'countries' | 'regions',
    data: string[],
    language?: string
  ): void {
    const key = this.buildMetadataKey(type, language);
    this.cache.set(key, data, this.METADATA_TTL);
  }

  /**
   * Invalidate all threshold configuration cache
   */
  static invalidateThresholdConfigs(): void {
    const stats = this.cache.getStats();
    for (const key of stats.keys) {
      if (key.startsWith(this.CACHE_PREFIX + 'config:')) {
        this.cache.delete(key);
      }
    }
    logger.info('Language threshold configuration cache invalidated');
  }

  /**
   * Invalidate metadata cache
   */
  static invalidateMetadata(): void {
    const stats = this.cache.getStats();
    for (const key of stats.keys) {
      if (key.startsWith(this.CACHE_PREFIX + 'metadata:')) {
        this.cache.delete(key);
      }
    }
    logger.info('Language threshold metadata cache invalidated');
  }

  /**
   * Build cache key for configuration
   */
  private static buildConfigKey(language: string, country?: string, region?: string): string {
    return `${this.CACHE_PREFIX}config:${language}:${country || 'null'}:${region || 'null'}`;
  }

  /**
   * Build cache key for metadata
   */
  private static buildMetadataKey(type: string, language?: string): string {
    return `${this.CACHE_PREFIX}metadata:${type}:${language || 'all'}`;
  }
}

/**
 * Session attendance analysis cache
 */
export class AttendanceAnalysisCache {
  private static cache = CacheService.getInstance();
  private static readonly CACHE_PREFIX = 'attendance_analysis:';
  private static readonly ANALYSIS_TTL = 300; // 5 minutes

  /**
   * Get cached attendance analysis
   */
  static getAnalysis(sessionId: string): any | null {
    const key = this.buildAnalysisKey(sessionId);
    return this.cache.get(key);
  }

  /**
   * Set cached attendance analysis
   */
  static setAnalysis(sessionId: string, analysis: any): void {
    const key = this.buildAnalysisKey(sessionId);
    this.cache.set(key, analysis, this.ANALYSIS_TTL);
  }

  /**
   * Invalidate session analysis cache
   */
  static invalidateSessionAnalysis(sessionId: string): void {
    const key = this.buildAnalysisKey(sessionId);
    this.cache.delete(key);
  }

  /**
   * Build cache key for analysis
   */
  private static buildAnalysisKey(sessionId: string): string {
    return `${this.CACHE_PREFIX}${sessionId}`;
  }
}

/**
 * Notification template cache
 */
export class NotificationTemplateCache {
  private static cache = CacheService.getInstance();
  private static readonly CACHE_PREFIX = 'notification_template:';
  private static readonly TEMPLATE_TTL = 1800; // 30 minutes

  /**
   * Get cached notification template
   */
  static getTemplate(
    type: string,
    language: string,
    country?: string,
    region?: string
  ): any | null {
    const key = this.buildTemplateKey(type, language, country, region);
    return this.cache.get(key);
  }

  /**
   * Set cached notification template
   */
  static setTemplate(
    type: string,
    language: string,
    country: string | undefined,
    region: string | undefined,
    template: any
  ): void {
    const key = this.buildTemplateKey(type, language, country, region);
    this.cache.set(key, template, this.TEMPLATE_TTL);
  }

  /**
   * Invalidate notification template cache
   */
  static invalidateTemplates(): void {
    const stats = this.cache.getStats();
    for (const key of stats.keys) {
      if (key.startsWith(this.CACHE_PREFIX)) {
        this.cache.delete(key);
      }
    }
    logger.info('Notification template cache invalidated');
  }

  /**
   * Build cache key for template
   */
  private static buildTemplateKey(
    type: string,
    language: string,
    country?: string,
    region?: string
  ): string {
    return `${this.CACHE_PREFIX}${type}:${language}:${country || 'null'}:${region || 'null'}`;
  }
}
