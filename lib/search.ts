import { prisma } from './prisma';

export interface SearchFilters {
  category?: string;
  level?: string;
  institution?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  duration?: {
    min: number;
    max: number;
  };
  startDate?: {
    from: Date;
    to: Date;
  };
  tags?: string[];
  framework?: string;
  status?: string;
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'price' | 'duration' | 'startDate' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  score: number;
  highlights: {
    field: string;
    snippet: string;
  }[];
  metadata: {
    category: string;
    level: string;
    institution: string;
    price: number;
    duration: number;
    startDate: Date;
    tags: string[];
  };
}

class SearchService {
  /**
   * Perform advanced search with full-text capabilities
   */
  async searchCourses(options: SearchOptions): Promise<{
    results: SearchResult[];
    total: number;
    page: number;
    totalPages: number;
    facets: unknown;
  }> {
    const {
      query,
      filters = {},
      page = 1,
      limit = 20,
      sortBy = 'relevance',
      sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;

    // Build the where clause
    const whereClause: any = {
      status: {
        in: ['ACTIVE', 'PUBLISHED']
      },
      startDate: {
        gte: new Date(new Date().setHours(0, 0, 0, 0) - 30 * 24 * 60 * 60 * 1000) // Show courses starting from 30 days ago
      }
    };

    // Add text search
    if (query.trim()) {
      whereClause.OR = [
        {
          title: {
            contains: query
          }
        },
        {
          description: {
            contains: query
          }
        },
        {
          institution: {
            name: {
              contains: query
            }
          }
        },
        {
          category: {
            name: {
              contains: query
            }
          }
        },
        {
          courseTags: {
            some: {
              tag: {
                name: {
                  contains: query
                }
              }
            }
          }
        }
      ];
    }

    // Add filters
    if (filters.category) {
      whereClause.categoryId = filters.category;
    }

    if (filters.level) {
      whereClause.level = filters.level;
    }

    if (filters.institution) {
      whereClause.institutionId = filters.institution;
    }

    if (filters.priceRange) {
      whereClause.base_price = {
        gte: filters.priceRange.min,
        lte: filters.priceRange.max
      };
    }

    if (filters.duration) {
      whereClause.duration = {
        gte: filters.duration.min,
        lte: filters.duration.max
      };
    }

    if (filters.startDate) {
      whereClause.startDate = {
        gte: filters.startDate.from,
        lte: filters.startDate.to
      };
    }

    if (filters.tags && filters.tags.length > 0) {
      whereClause.courseTags = {
        some: {
          tag: {
            name: {
              in: filters.tags
            }
          }
        }
      };
    }

    if (filters.framework) {
      whereClause.framework = filters.framework;
    }

    // Build order by clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'price':
        orderBy.base_price = sortOrder;
        break;
      case 'duration':
        orderBy.duration = sortOrder;
        break;
      case 'startDate':
        orderBy.startDate = sortOrder;
        break;
      case 'popularity':
        orderBy.enrollments = {
          _count: sortOrder
        };
        break;
              default:
          // For relevance, we'll use a combination of factors
          orderBy = [
            { title: 'asc' },
            { startDate: 'asc' }
          ];
    }

    // Execute search
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where: whereClause,
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
                  // Removed enrollments to protect sensitive data
        },
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.course.count({ where: whereClause })
    ]);

    // Transform results
    const results: SearchResult[] = courses.map(course => {
      const score = this.calculateRelevanceScore(course, query);
      const highlights = this.generateHighlights(course, query);

      return {
        id: course.id,
        title: course.title,
        description: course.description || '',
        score,
        highlights,
        // Removed enrollments to protect sensitive data
        metadata: {
          category: course.category.name,
          level: course.level,
          institution: course.institution.name,
          price: course.base_price,
          duration: course.duration,
          startDate: course.startDate,
          tags: course.courseTags.map(ct => ct.tag.name)
        }
      };
    }).filter(result => result.score >= 2); // Only include courses with meaningful relevance

    // Get facets for filtering
    const facets = await this.getSearchFacets(whereClause);

    return {
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      facets
    };
  }

  /**
   * Calculate relevance score for search results
   */
  private calculateRelevanceScore(course: unknown, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    // Title match (highest weight)
    if (course.title.toLowerCase().includes(queryLower)) {
      score += 10;
      if (course.title.toLowerCase().startsWith(queryLower)) {
        score += 5;
      }
    }

    // Description match
    if (course.description?.toLowerCase().includes(queryLower)) {
      score += 3;
    }

    // Institution match
    if (course.institution.name.toLowerCase().includes(queryLower)) {
      score += 2;
    }

    // Category match
    if (course.category.name.toLowerCase().includes(queryLower)) {
      score += 2;
    }

    // Tag matches (lower weight)
    course.courseTags.forEach((ct: unknown) => {
      if (ct.tag.name.toLowerCase().includes(queryLower)) {
        score += 0.5; // Reduced weight for tag matches
      }
    });

    // Recency bonus (newer courses get slight boost)
    const daysSinceStart = Math.max(0, (new Date().getTime() - course.startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceStart < 30) {
      score += 0.5;
    }

    return score;
  }

  /**
   * Generate search highlights
   */
  private generateHighlights(course: unknown, query: string): { field: string; snippet: string }[] {
    const highlights: { field: string; snippet: string }[] = [];
    const queryLower = query.toLowerCase();

    // Title highlight
    if (course.title.toLowerCase().includes(queryLower)) {
      const index = course.title.toLowerCase().indexOf(queryLower);
      const start = Math.max(0, index - 20);
      const end = Math.min(course.title.length, index + query.length + 20);
      highlights.push({
        field: 'title',
        snippet: `...${course.title.substring(start, end)}...`
      });
    }

    // Description highlight
    if (course.description?.toLowerCase().includes(queryLower)) {
      const index = course.description.toLowerCase().indexOf(queryLower);
      const start = Math.max(0, index - 50);
      const end = Math.min(course.description.length, index + query.length + 50);
      highlights.push({
        field: 'description',
        snippet: `...${course.description.substring(start, end)}...`
      });
    }

    return highlights;
  }

  /**
   * Get search facets for filtering
   */
  private async getSearchFacets(whereClause: any) {
    const [categories, levels, institutions, frameworks] = await Promise.all([
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              courses: {
                where: whereClause
              }
            }
          }
        }
      }),
      prisma.course.groupBy({
        by: ['level'],
        where: whereClause,
        _count: {
          level: true
        }
      }),
      prisma.institution.findMany({
        where: {
          courses: {
            some: whereClause
          }
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              courses: {
                where: whereClause
              }
            }
          }
        }
      }),
      prisma.course.groupBy({
        by: ['framework'],
        where: whereClause,
        _count: {
          framework: true
        }
      })
    ]);

    return {
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        count: c._count.courses
      })),
      levels: levels.map(l => ({
        value: l.level,
        count: l._count.level
      })),
      institutions: institutions.map(i => ({
        id: i.id,
        name: i.name,
        count: i._count.courses
      })),
      frameworks: frameworks.map(f => ({
        value: f.framework,
        count: f._count.framework
      }))
    };
  }

  /**
   * Search suggestions for autocomplete
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!query.trim()) return [];

    const suggestions = await prisma.course.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query
            }
          },
          {
            institution: {
              name: {
                contains: query
              }
            }
          },
          {
            category: {
              name: {
                contains: query
              }
            }
          }
        ],
        status: {
          in: ['ACTIVE', 'PUBLISHED']
        }
      },
      select: {
        title: true,
        institution: {
          select: {
            name: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      },
      take: limit
    });

    const results = new Set<string>();
    
    suggestions.forEach(suggestion => {
      if (suggestion.title.toLowerCase().includes(query.toLowerCase())) {
        results.add(suggestion.title);
      }
      if (suggestion.institution.name.toLowerCase().includes(query.toLowerCase())) {
        results.add(suggestion.institution.name);
      }
      if (suggestion.category.name.toLowerCase().includes(query.toLowerCase())) {
        results.add(suggestion.category.name);
      }
    });

    return Array.from(results).slice(0, limit);
  }

  /**
   * Get popular search terms
   */
  async getPopularSearches(limit: number = 10): Promise<string[]> {
    // This would typically come from a search analytics table
    // For now, return common terms based on course titles
    const popularTerms = await prisma.course.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'PUBLISHED']
        }
      },
      select: {
        title: true
      },
      take: 100
    });

    const termCounts = new Map<string, number>();
    
    popularTerms.forEach(course => {
      const words = course.title.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) {
          termCounts.set(word, (termCounts.get(word) || 0) + 1);
        }
      });
    });

    return Array.from(termCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([term]) => term);
  }
}

export const searchService = new SearchService(); 