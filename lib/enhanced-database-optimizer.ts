import { PrismaClient } from '@prisma/client';
import { simpleCache } from './simple-cache';

// Cache TTL constants
const CACHE_TTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 1800,       // 30 minutes
  VERY_LONG: 3600,  // 1 hour
  STATIC: 86400     // 24 hours
};

// Cache keys for different data types
const CACHE_KEYS = {
  COURSES: {
    ALL: 'courses:all',
    BY_ID: (id: string) => `course:${id}`,
    BY_INSTITUTION: (institutionId: string) => `courses:institution:${institutionId}`,
    BY_CATEGORY: (categoryId: string) => `courses:category:${categoryId}`,
    SEARCH: (query: string) => `courses:search:${query}`,
    FEATURED: 'courses:featured',
    POPULAR: 'courses:popular'
  },
  INSTITUTIONS: {
    ALL: 'institutions:all',
    BY_ID: (id: string) => `institution:${id}`,
    FEATURED: 'institutions:featured',
    BY_LOCATION: (location: string) => `institutions:location:${location}`
  },
  CATEGORIES: {
    ALL: 'categories:all',
    BY_ID: (id: string) => `category:${id}`
  },
  USERS: {
    BY_ID: (id: string) => `user:${id}`,
    PROFILE: (id: string) => `user:profile:${id}`,
    ENROLLMENTS: (id: string) => `user:enrollments:${id}`
  },
  STATS: {
    DASHBOARD: 'stats:dashboard',
    COURSES: 'stats:courses',
    ENROLLMENTS: 'stats:enrollments',
    REVENUE: 'stats:revenue'
  }
};

// Enhanced Prisma client with Redis caching and query optimization
class EnhancedPrismaClient extends PrismaClient {
  private queryCache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  // Optimized course queries with Redis caching
  async getCoursesWithCache(where: unknown, include: unknown = {}, options: {
    cacheKey?: string;
    ttl?: number;
    forceRefresh?: boolean;
  } = {}) {
    const cacheKey = options.cacheKey || `courses:${JSON.stringify(where)}:${JSON.stringify(include)}`;
    
    if (!options.forceRefresh) {
      const cached = await simpleCache.get(cacheKey);
      if (cached) {
        // // // // // // // // // console.log('Cache hit for courses query');
        return cached;
      }
    }

    console.log('Cache miss, fetching from database');
    const startTime = Date.now();

    const courses = await this.course.findMany({
      where,
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
            commissionRate: true,
            isApproved: true,
            status: true,
            logoUrl: true
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
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
                icon: true
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true,
            completions: true,
            courseTags: true,
            bookings: true,
            modules: true
          }
        },
        ...include
      },
      orderBy: { createdAt: 'desc' }
    });

    const queryTime = Date.now() - startTime;
    console.log(`Database query completed in ${queryTime}ms`);

    // Cache the result
    await simpleCache.set(cacheKey, courses, options.ttl || CACHE_TTL.MEDIUM);

    return courses;
  }

  // Optimized institution queries
  async getInstitutionsWithCache(where: unknown = {}, include: unknown = {}) {
    const cacheKey = `institutions:${JSON.stringify(where)}:${JSON.stringify(include)}`;
    
    const cached = await simpleCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const institutions = await this.institution.findMany({
      where,
      include: {
        courses: {
          select: {
            id: true,
            title: true,
            status: true,
            _count: {
              select: {
                enrollments: true
              }
            }
          }
        },
        _count: {
          select: {
            courses: true,
            users: true
          }
        },
        ...include
      },
      orderBy: { createdAt: 'desc' }
    });

    await simpleCache.set(cacheKey, institutions, CACHE_TTL.MEDIUM);
    return institutions;
  }

  // Optimized user queries with profile data
  async getUserWithProfile(userId: string) {
    const cacheKey = CACHE_KEYS.USERS.PROFILE(userId);
    
    const cached = await simpleCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const user = await this.user.findUnique({
      where: { id: userId },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            logoUrl: true
          }
        },
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                institution: {
                  select: {
                    name: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            enrollments: true,
            bookings: true
          }
        }
      }
    });

    if (user) {
      await simpleCache.set(cacheKey, user, CACHE_TTL.SHORT);
    }

    return user;
  }

  // Batch operations for better performance
  async batchGetCourses(courseIds: string[]) {
    const cacheKey = `courses:batch:${courseIds.sort().join(',')}`;
    
    const cached = await simpleCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const courses = await this.course.findMany({
      where: {
        id: { in: courseIds }
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true
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

    await simpleCache.set(cacheKey, courses, CACHE_TTL.MEDIUM);
    return courses;
  }

  // Optimized search with caching
  async searchCourses(searchParams: {
    query?: string;
    category?: string;
    level?: string;
    institution?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const cacheKey = `search:${JSON.stringify(searchParams)}`;
    
    const cached = await simpleCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const { query, category, level, institution, minPrice, maxPrice, page = 1, limit = 10 } = searchParams;
    
    const where: unknown = {
      status: 'published'
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (level) {
      where.level = level;
    }

    if (institution) {
      where.institutionId = institution;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.base_price = {};
      if (minPrice !== undefined) where.base_price.gte = minPrice;
      if (maxPrice !== undefined) where.base_price.lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.course.findMany({
        where,
        include: {
          institution: {
            select: {
              id: true,
              name: true,
              country: true,
              city: true,
              logoUrl: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          },
          courseTags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  color: true
                }
              }
            }
          },
          _count: {
            select: {
              enrollments: true,
              completions: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.course.count({ where })
    ]);

    const result = {
      courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    };

    await simpleCache.set(cacheKey, result, CACHE_TTL.MEDIUM);
    return result;
  }

  // Cache invalidation methods
  async invalidateCourseCache(courseId?: string) {
    if (courseId) {
      await simpleCache.invalidatePattern(`*course*${courseId}*`);
    } else {
      await simpleCache.invalidatePattern('*course*');
    }
  }

  async invalidateInstitutionCache(institutionId?: string) {
    if (institutionId) {
      await simpleCache.invalidatePattern(`*institution*${institutionId}*`);
    } else {
      await simpleCache.invalidatePattern('*institution*');
    }
  }

  async invalidateUserCache(userId?: string) {
    if (userId) {
      await simpleCache.invalidatePattern(`*user*${userId}*`);
    } else {
      await simpleCache.invalidatePattern('*user*');
    }
  }

  // Get query statistics
  async getQueryStats() {
    const stats = await simpleCache.getStats();
    return {
      cacheHitRate: stats.hitRate,
      totalRequests: stats.totalRequests,
      memoryUsage: stats.memoryUsage,
      keysCount: stats.keysCount
    };
  }
}

// Export singleton instance
export const enhancedPrisma = new EnhancedPrismaClient();

// Export cache utilities
export { CACHE_TTL, CACHE_KEYS };

// Export queryOptimizer for compatibility
export const queryOptimizer = {
  getCourses: (where: unknown, include: unknown = {}, options?: unknown) => 
    enhancedPrisma.getCoursesWithCache(where, include, options),
  getInstitutions: (where: unknown = {}, include: unknown = {}) => 
    enhancedPrisma.getInstitutionsWithCache(where, include),
  getUserProfile: (userId: string) => 
    enhancedPrisma.getUserWithProfile(userId),
  batchGetCourses: (courseIds: string[]) => 
    enhancedPrisma.batchGetCourses(courseIds),
  searchCourses: (searchParams: unknown) => 
    enhancedPrisma.searchCourses(searchParams),
  invalidateCourseCache: (courseId?: string) => 
    enhancedPrisma.invalidateCourseCache(courseId),
  invalidateInstitutionCache: (institutionId?: string) => 
    enhancedPrisma.invalidateInstitutionCache(institutionId),
  invalidateUserCache: (userId?: string) => 
    enhancedPrisma.invalidateUserCache(userId),
  getStats: () => enhancedPrisma.getQueryStats()
}; 