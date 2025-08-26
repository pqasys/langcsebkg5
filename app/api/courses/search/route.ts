import { NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { queryOptimizer } from '@/lib/enhanced-database-optimizer';
import { performanceUtils } from '@/lib/performance-monitor';

export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const tagIds = searchParams.get('tagIds')?.split(',').filter(Boolean) || [];
    const institution = searchParams.get('institution');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    console.log('Search parameters:', {
      query,
      category,
      startDate,
      endDate,
      page,
      limit
    });

    // Build the where clause
    const whereClause: any = {
      status: 'PUBLISHED',
      startDate: { gte: new Date() }
    };

    if (query) {
      whereClause.OR = [
        { title: { contains: query } },
        { description: { contains: query } }
      ];
    }

    if (category) {
      whereClause.categoryId = category;
    }

    if (level) {
      whereClause.level = level;
    }

    if (institution) {
      whereClause.institutionId = institution;
    }

    if (minPrice || maxPrice) {
      whereClause.base_price = {};
      if (minPrice) whereClause.base_price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.base_price.lte = parseFloat(maxPrice);
    }

    if (startDate) {
      whereClause.startDate = {
        ...whereClause.startDate,
        gte: new Date(startDate)
      };
    }

    if (endDate) {
      whereClause.endDate = {
        lte: new Date(endDate)
      };
    }

    if (tagIds.length > 0) {
      whereClause.courseTags = {
        some: {
          tagId: {
            in: tagIds
          }
        }
      };
    }

    console.log('Where clause:', JSON.stringify(whereClause, null, 2));

    const searchResult = await performanceUtils.measureTime(
      () => queryOptimizer.searchCourses({
        query,
        category,
        level,
        institution,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        page,
        limit
      }),
      'courseSearch'
    );

    const { courses, total, totalPages, hasMore } = searchResult;

    const result = {
      courses,
      total,
      page,
      totalPages,
      hasMore,
      performance: {
        queryTime: Date.now() - startTime,
        cacheHit: false,
        optimized: true
      }
    };

    console.log(`Found courses: ${courses.length} in ${Date.now() - startTime}ms`);
    console.log('First course details:', courses[0] ? JSON.stringify(courses[0], null, 2) : 'No courses found');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching courses:');
    return NextResponse.json(
      { 
        message: 'Error searching courses', 
        error: error instanceof Error ? error.message : 'Unknown error',
        performance: {
          queryTime: Date.now() - startTime,
          error: true
        }
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 