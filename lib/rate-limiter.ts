import { prisma } from './prisma';
import { logger } from './logger';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Skip counting successful requests
  skipFailedRequests?: boolean; // Skip counting failed requests
  keyGenerator?: (req: unknown) => string; // Custom key generator
  handler?: (req: unknown, res: unknown) => void; // Custom error handler
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

class RateLimiter {
  private static instance: RateLimiter;
  private limits: Map<string, RateLimitConfig> = new Map();
  private store: Map<string, { count: number; resetTime: number }> = new Map();

  private constructor() {
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  /**
   * Add a rate limit configuration
   */
  public addLimit(name: string, config: RateLimitConfig): void {
    this.limits.set(name, config);
  }

  /**
   * Check if a request is allowed
   */
  public async checkLimit(
    name: string,
    identifier: string,
    req?: unknown
  ): Promise<{ allowed: boolean; info: RateLimitInfo }> {
    const config = this.limits.get(name);
    if (!config) {
      return {
        allowed: true,
        info: { limit: 0, remaining: 0, reset: new Date() }
      };
    }

    const key = this.generateKey(name, identifier);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get current usage
    const current = this.store.get(key);
    let count = 0;
    let resetTime = now + config.windowMs;

    if (current && current.resetTime > now) {
      count = current.count;
      resetTime = current.resetTime;
    }

    // Check if limit exceeded
    const allowed = count < config.maxRequests;

    if (allowed) {
      // Increment counter
      this.store.set(key, {
        count: count + 1,
        resetTime
      });

      // Log rate limit usage to database
      await this.logRateLimitUsage(name, identifier, count + 1, allowed);
    }

    const info: RateLimitInfo = {
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - count - (allowed ? 1 : 0)),
      reset: new Date(resetTime),
      retryAfter: allowed ? undefined : Math.ceil((resetTime - now) / 1000)
    };

    return { allowed, info };
  }

  /**
   * Reset rate limit for an identifier
   */
  public resetLimit(name: string, identifier: string): void {
    const key = this.generateKey(name, identifier);
    this.store.delete(key);
  }

  /**
   * Get current usage for an identifier
   */
  public getUsage(name: string, identifier: string): RateLimitInfo | null {
    const config = this.limits.get(name);
    if (!config) return null;

    const key = this.generateKey(name, identifier);
    const current = this.store.get(key);
    const now = Date.now();

    if (!current || current.resetTime <= now) {
      return {
        limit: config.maxRequests,
        remaining: config.maxRequests,
        reset: new Date(now + config.windowMs)
      };
    }

    return {
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - current.count),
      reset: new Date(current.resetTime)
    };
  }

  /**
   * Generate rate limit key
   */
  private generateKey(name: string, identifier: string): string {
    return `${name}:${identifier}`;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (value.resetTime <= now) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Log rate limit usage to database
   */
  private async logRateLimitUsage(
    name: string,
    identifier: string,
    count: number,
    allowed: boolean
  ): Promise<void> {
    try {
      await prisma.rateLimitLog.create({
        data: {
          name,
          identifier,
          count,
          allowed,
          timestamp: new Date()
        }
      });
    } catch (error) {
      logger.error('Failed to log rate limit usage:');
    }
  }

  /**
   * Get rate limit statistics
   */
  public async getStats(): Promise<{
    totalRequests: number;
    blockedRequests: number;
    topIdentifiers: Array<{ identifier: string; count: number }>;
    topLimits: Array<{ name: string; count: number }>;
  }> {
    try {
      const [totalRequests, blockedRequests, topIdentifiers, topLimits] = await Promise.all([
        prisma.rateLimitLog.count(),
        prisma.rateLimitLog.count({ where: { allowed: false } }),
        prisma.rateLimitLog.groupBy({
          by: ['identifier'],
          _count: { identifier: true },
          orderBy: { _count: { identifier: 'desc' } },
          take: 10
        }),
        prisma.rateLimitLog.groupBy({
          by: ['name'],
          _count: { name: true },
          orderBy: { _count: { name: 'desc' } },
          take: 10
        })
      ]);

      return {
        totalRequests,
        blockedRequests,
        topIdentifiers: topIdentifiers.map(item => ({
          identifier: item.identifier,
          count: item._count.identifier
        })),
        topLimits: topLimits.map(item => ({
          name: item.name,
          count: item._count.name
        }))
      };
    } catch (error) {
      logger.error('Failed to get rate limit stats:');
      return {
        totalRequests: 0,
        blockedRequests: 0,
        topIdentifiers: [],
        topLimits: []
      };
    }
  }
}

export const rateLimiter = RateLimiter.getInstance();

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // General API rate limits
  API_GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000
  },
  
  // Authentication endpoints
  AUTH_LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5
  },
  
  AUTH_REGISTER: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3
  },
  
  AUTH_PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3
  },
  
  // Course enrollment
  COURSE_ENROLLMENT: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10
  },
  
  // Payment processing
  PAYMENT_PROCESS: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20
  },
  
  // File uploads
  FILE_UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50
  },
  
  // Search requests
  SEARCH: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 100
  },
  
  // WebSocket connections
  WEBSOCKET: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10
  }
};

// Initialize rate limits
Object.entries(RATE_LIMITS).forEach(([name, config]) => {
  rateLimiter.addLimit(name, config);
});

// Helper function to get client identifier
export function getClientIdentifier(req: unknown): string {
  // Try to get IP address
  const ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection?.remoteAddress || 
             req.socket?.remoteAddress || 
             'unknown';
  
  // If it's an array, take the first one
  const clientIp = Array.isArray(ip) ? ip[0] : ip;
  
  // Add user ID if available
  const userId = req.user?.id || 'anonymous';
  
  return `${clientIp}:${userId}`;
}

// Middleware for Express/Next.js
export function createRateLimitMiddleware(limitName: string) {
  return async (req: unknown, res: unknown, next: unknown) => {
    try {
      const identifier = getClientIdentifier(req);
      const { allowed, info } = await rateLimiter.checkLimit(limitName, identifier, req);

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', info.limit);
      res.setHeader('X-RateLimit-Remaining', info.remaining);
      res.setHeader('X-RateLimit-Reset', info.reset.toISOString());

      if (!allowed) {
        res.setHeader('Retry-After', info.retryAfter);
        return res.status(429).json({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: info.retryAfter
        });
      }

      next();
    } catch (error) {
      logger.error('Rate limit middleware error:');
      next();
    }
  };
} 