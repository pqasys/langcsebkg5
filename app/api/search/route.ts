import { NextRequest, NextResponse } from 'next/server';
import { searchService, SearchOptions } from '@/lib/search';
import { z } from 'zod';

const searchQuerySchema = z.object({
  query: z.string().optional().default(''),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  sortBy: z.enum(['relevance', 'price', 'duration', 'startDate', 'popularity']).optional().default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  category: z.string().optional(),
  level: z.string().optional(),
  institution: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minDuration: z.coerce.number().min(0).optional(),
  maxDuration: z.coerce.number().min(0).optional(),
  startDateFrom: z.string().optional(),
  startDateTo: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  framework: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validatedParams = searchQuerySchema.parse(queryParams);
    
    // Build search options
    const searchOptions: SearchOptions = {
      query: validatedParams.query,
      page: validatedParams.page,
      limit: validatedParams.limit,
      sortBy: validatedParams.sortBy,
      sortOrder: validatedParams.sortOrder,
      filters: {}
    };

    // Add filters
    if (validatedParams.category) {
      searchOptions.filters!.category = validatedParams.category;
    }

    if (validatedParams.level) {
      searchOptions.filters!.level = validatedParams.level;
    }

    if (validatedParams.institution) {
      searchOptions.filters!.institution = validatedParams.institution;
    }

    if (validatedParams.minPrice !== undefined || validatedParams.maxPrice !== undefined) {
      searchOptions.filters!.priceRange = {
        min: validatedParams.minPrice || 0,
        max: validatedParams.maxPrice || 999999
      };
    }

    if (validatedParams.minDuration !== undefined || validatedParams.maxDuration !== undefined) {
      searchOptions.filters!.duration = {
        min: validatedParams.minDuration || 0,
        max: validatedParams.maxDuration || 999999
      };
    }

    if (validatedParams.startDateFrom || validatedParams.startDateTo) {
      searchOptions.filters!.startDate = {
        from: validatedParams.startDateFrom ? new Date(validatedParams.startDateFrom) : new Date(),
        to: validatedParams.startDateTo ? new Date(validatedParams.startDateTo) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      };
    }

    if (validatedParams.tags) {
      searchOptions.filters!.tags = validatedParams.tags.split(',').map(tag => tag.trim());
    }

    if (validatedParams.framework) {
      searchOptions.filters!.framework = validatedParams.framework;
    }

    // Perform search
    const results = await searchService.searchCourses(searchOptions);

    return NextResponse.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Search error:');
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid search parameters',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Search failed'
    }, { status: 500, statusText: 'Internal Server Error' });
  }
}

// Get search suggestions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 5 } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Query parameter is required'
      }, { status: 400 });
    }

    const suggestions = await searchService.getSearchSuggestions(query, limit);

    return NextResponse.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('Search suggestions error:');
    return NextResponse.json({
      success: false,
      error: 'Failed to get search suggestions'
    }, { status: 500, statusText: 'Internal Server Error' });
  }
} 