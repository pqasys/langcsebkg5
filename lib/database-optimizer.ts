import { PrismaClient } from '@prisma/client';
import { simpleCache } from './simple-cache';
import { cacheUtils } from './enhanced-cache';

// Performance monitoring interface
interface QueryMetrics {
  queryType: string;
  duration: number;
  cacheHit: boolean;
  timestamp: Date;
  tableName?: string;
  recordCount?: number;
}

class DatabaseOptimizer {
  private prisma: PrismaClient;
  private metrics: QueryMetrics[] = [];
  private cachePrefix = 'db:';

  constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  // Enhanced cache key generation
  private generateCacheKey(operation: string, params: unknown): string {
    const paramString = JSON.stringify(params);
    const hash = this.simpleHash(paramString);
    return `${this.cachePrefix}${operation}:${hash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Optimized course query with Redis caching
  async getCoursesWithOptimizedIncludes(where: unknown = {}, include: unknown = {}) {
    const cacheKey = this.generateCacheKey('courses:optimized', { where, include });
    const startTime = Date.now();

    try {
      // Try Redis cache first
      const cached = await simpleCache.get(cacheKey);
      if (cached) {
        this.recordMetrics('courses:optimized', Date.now() - startTime, true);
        return cached;
      }

      // Fallback to enhanced cache
      const enhancedCached = await cacheUtils.get(cacheKey);
      if (enhancedCached) {
        this.recordMetrics('courses:optimized', Date.now() - startTime, true);
        return enhancedCached;
      }

      // Execute optimized query
      const courses = await this.prisma.course.findMany({
        where,
        include: {
          institution: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
              isFeatured: true,
              commissionRate: true,
              subscription: {
                include: {
                  commissionTier: true
                }
              }
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          },
          courseTags: {
            include: {
              tag: true
            }
          },
          courseWeeklyPrices: true,
          coursePricingRules: true,
          studentCourseEnrollments: {
            select: {
              id: true,
              status: true,
              enrolledAt: true
            }
          },
          studentCourseCompletions: {
            select: {
              id: true,
              completedAt: true
            }
          },
          ...include
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Cache results in both Redis and enhanced cache
      const result = {
        courses,
        timestamp: new Date(),
        queryTime: Date.now() - startTime
      };

      await Promise.all([
        simpleCache.set(cacheKey, result, 600), // 10 minutes in Redis
        cacheUtils.set(cacheKey, result, 600000) // 10 minutes in enhanced cache
      ]);

      this.recordMetrics('courses:optimized', Date.now() - startTime, false, 'Course', courses.length);
      return result;

    } catch (error) {
      console.error('Database query error:', error);
      this.recordMetrics('courses:optimized', Date.now() - startTime, false);
      throw error;
    }
  }

  // Optimized institution query with Redis caching
  async getInstitutionsWithOptimizedIncludes(where: unknown = {}, include: unknown = {}) {
    const cacheKey = this.generateCacheKey('institutions:optimized', { where, include });
    const startTime = Date.now();

    try {
      // Try Redis cache first
      const cached = await simpleCache.get(cacheKey);
      if (cached) {
        this.recordMetrics('institutions:optimized', Date.now() - startTime, true);
        return cached;
      }

      // Fallback to enhanced cache
      const enhancedCached = await cacheUtils.get(cacheKey);
      if (enhancedCached) {
        this.recordMetrics('institutions:optimized', Date.now() - startTime, true);
        return enhancedCached;
      }

      // Execute optimized query
      const institutions = await this.prisma.institution.findMany({
        where,
        include: {
          courses: {
            select: {
              id: true,
              title: true,
              status: true,
              _count: {
                select: {
                  studentCourseEnrollments: true,
                  studentCourseCompletions: true
                }
              }
            }
          },
          subscription: {
            include: {
              commissionTier: true
            }
          },
          ...include
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Cache results
      const result = {
        institutions,
        timestamp: new Date(),
        queryTime: Date.now() - startTime
      };

      await Promise.all([
        simpleCache.set(cacheKey, result, 600),
        cacheUtils.set(cacheKey, result, 600000)
      ]);

      this.recordMetrics('institutions:optimized', Date.now() - startTime, false, 'Institution', institutions.length);
      return result;

    } catch (error) {
      console.error('Database query error:', error);
      this.recordMetrics('institutions:optimized', Date.now() - startTime, false);
      throw error;
    }
  }

  // Optimized user query with Redis caching
  async getUsersWithOptimizedIncludes(where: unknown = {}, include: unknown = {}) {
    const cacheKey = this.generateCacheKey('users:optimized', { where, include });
    const startTime = Date.now();

    try {
      // Try Redis cache first
      const cached = await simpleCache.get(cacheKey);
      if (cached) {
        this.recordMetrics('users:optimized', Date.now() - startTime, true);
        return cached;
      }

      // Fallback to enhanced cache
      const enhancedCached = await cacheUtils.get(cacheKey);
      if (enhancedCached) {
        this.recordMetrics('users:optimized', Date.now() - startTime, true);
        return enhancedCached;
      }

      // Execute optimized query
      const users = await this.prisma.user.findMany({
        where,
        include: {
          studentCourseEnrollments: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  institution: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          },
          studentCourseCompletions: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          },
          ...include
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Cache results
      const result = {
        users,
        timestamp: new Date(),
        queryTime: Date.now() - startTime
      };

      await Promise.all([
        simpleCache.set(cacheKey, result, 300), // 5 minutes for user data
        cacheUtils.set(cacheKey, result, 300000)
      ]);

      this.recordMetrics('users:optimized', Date.now() - startTime, false, 'User', users.length);
      return result;

    } catch (error) {
      console.error('Database query error:', error);
      this.recordMetrics('users:optimized', Date.now() - startTime, false);
      throw error;
    }
  }

  // Optimized statistics query with Redis caching
  async getOptimizedStats() {
    const cacheKey = this.generateCacheKey('stats:optimized', {});
    const startTime = Date.now();

    try {
      // Try Redis cache first
      const cached = await simpleCache.get(cacheKey);
      if (cached) {
        this.recordMetrics('stats:optimized', Date.now() - startTime, true);
        return cached;
      }

      // Fallback to enhanced cache
      const enhancedCached = await cacheUtils.get(cacheKey);
      if (enhancedCached) {
        this.recordMetrics('stats:optimized', Date.now() - startTime, true);
        return enhancedCached;
      }

      // Execute optimized statistics query
      const [
        totalUsers,
        totalInstitutions,
        totalCourses,
        totalEnrollments,
        totalRevenue,
        activeUsers,
        activeInstitutions,
        activeCourses
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.institution.count(),
        this.prisma.course.count(),
        this.prisma.studentCourseEnrollment.count(),
        this.prisma.payment.aggregate({
          _sum: {
            amount: true
          },
          where: {
            status: 'COMPLETED'
          }
        }),
        this.prisma.user.count({
          where: {
            status: 'ACTIVE'
          }
        }),
        this.prisma.institution.count({
          where: {
            status: 'ACTIVE'
          }
        }),
        this.prisma.course.count({
          where: {
            status: 'ACTIVE'
          }
        })
      ]);

      const result = {
        totalUsers,
        totalInstitutions,
        totalCourses,
        totalEnrollments,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeUsers,
        activeInstitutions,
        activeCourses,
        timestamp: new Date(),
        queryTime: Date.now() - startTime
      };

      // Cache results with longer TTL for stats
      await Promise.all([
        simpleCache.set(cacheKey, result, 1800), // 30 minutes in Redis
        cacheUtils.set(cacheKey, result, 1800000) // 30 minutes in enhanced cache
      ]);

      this.recordMetrics('stats:optimized', Date.now() - startTime, false, 'Stats');
      return result;

    } catch (error) {
      console.error('Database query error:', error);
      this.recordMetrics('stats:optimized', Date.now() - startTime, false);
      throw error;
    }
  }

  // Batch operations for better performance
  async batchGetCourses(courseIds: string[]) {
    const cacheKey = this.generateCacheKey('courses:batch', { ids: courseIds });
    const startTime = Date.now();

    try {
      // Try Redis cache first
      const cached = await simpleCache.get(cacheKey);
      if (cached) {
        this.recordMetrics('courses:batch', Date.now() - startTime, true);
        return cached;
      }

      // Execute batch query
      const courses = await this.prisma.course.findMany({
        where: {
          id: {
            in: courseIds
          }
        },
        include: {
          institution: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      const result = {
        courses,
        timestamp: new Date(),
        queryTime: Date.now() - startTime
      };

      // Cache results
      await Promise.all([
        simpleCache.set(cacheKey, result, 600),
        cacheUtils.set(cacheKey, result, 600000)
      ]);

      this.recordMetrics('courses:batch', Date.now() - startTime, false, 'Course', courses.length);
      return result;

    } catch (error) {
      console.error('Batch query error:', error);
      this.recordMetrics('courses:batch', Date.now() - startTime, false);
      throw error;
    }
  }

  // Cache invalidation methods
  async invalidateCourseCache(courseId?: string) {
    const patterns = courseId 
      ? [`${this.cachePrefix}courses:*${courseId}*`, `${this.cachePrefix}stats:*`]
      : [`${this.cachePrefix}courses:*`, `${this.cachePrefix}stats:*`];

    await Promise.all([
      ...patterns.map(pattern => simpleCache.invalidatePattern(pattern)),
      ...patterns.map(pattern => cacheUtils.invalidatePattern(pattern))
    ]);
  }

  async invalidateInstitutionCache(institutionId?: string) {
    const patterns = institutionId
      ? [`${this.cachePrefix}institutions:*${institutionId}*`, `${this.cachePrefix}courses:*`, `${this.cachePrefix}stats:*`]
      : [`${this.cachePrefix}institutions:*`, `${this.cachePrefix}courses:*`, `${this.cachePrefix}stats:*`];

    await Promise.all([
      ...patterns.map(pattern => simpleCache.invalidatePattern(pattern)),
      ...patterns.map(pattern => cacheUtils.invalidatePattern(pattern))
    ]);
  }

  async invalidateUserCache(userId?: string) {
    const patterns = userId
      ? [`${this.cachePrefix}users:*${userId}*`, `${this.cachePrefix}stats:*`]
      : [`${this.cachePrefix}users:*`, `${this.cachePrefix}stats:*`];

    await Promise.all([
      ...patterns.map(pattern => simpleCache.invalidatePattern(pattern)),
      ...patterns.map(pattern => cacheUtils.invalidatePattern(pattern))
    ]);
  }

  // Performance monitoring
  private recordMetrics(queryType: string, duration: number, cacheHit: boolean, tableName?: string, recordCount?: number) {
    this.metrics.push({
      queryType,
      duration,
      cacheHit,
      timestamp: new Date(),
      tableName,
      recordCount
    });

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  async getPerformanceMetrics() {
    const recentMetrics = this.metrics.filter(m => 
      Date.now() - m.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    const avgDuration = recentMetrics.length > 0 
      ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length 
      : 0;

    const cacheHitRate = recentMetrics.length > 0
      ? (recentMetrics.filter(m => m.cacheHit).length / recentMetrics.length) * 100
      : 0;

    const slowQueries = recentMetrics.filter(m => m.duration > 1000); // Queries taking > 1 second

    return {
      totalQueries: recentMetrics.length,
      averageDuration: avgDuration,
      cacheHitRate,
      slowQueries: slowQueries.length,
      slowQueryDetails: slowQueries.slice(-10), // Last 10 slow queries
      timestamp: new Date()
    };
  }

  // Health check
  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const redisHealth = await simpleCache.healthCheck();
      const enhancedCacheHealth = await cacheUtils.healthCheck();

      return {
        database: 'healthy',
        redis: redisHealth.status,
        enhancedCache: enhancedCacheHealth.status,
        timestamp: new Date()
      };
    } catch (error) {
    console.error('Error occurred:', error);
      return {
        database: 'unhealthy',
        redis: 'unknown',
        enhancedCache: 'unknown',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // Cleanup
  async cleanup() {
    await this.prisma.$disconnect();
  }
}

// Export singleton instance
export const queryOptimizer = new DatabaseOptimizer();

// Export types
export type { QueryMetrics }; 