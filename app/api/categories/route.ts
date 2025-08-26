import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';
import { cache } from '@/lib/cache';
import { isBuildTime } from '@/lib/build-error-handler';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }

    // Try to get cached data first
    const cacheKey = 'categories:all';
    const cachedData = await cache.get(cacheKey);
    
    if (cachedData) {
      // // // // // // // // // // // // console.log('Returning cached categories data');
      return NextResponse.json(cachedData);
    }

    console.log('Fetching fresh categories data from database...');
    const startTime = Date.now();

    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    const endTime = Date.now();
    console.log(`Fetched categories in ${endTime - startTime}ms`);

    // Cache the result for 10 minutes (categories don't change often)
    await cache.set(cacheKey, categories, 10 * 60 * 1000);

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:');
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    // Generate slug from name
    const slug = slugify(name, { lower: true });

    const category = await prisma.category.create({
      data: {
        name,
        description,
        slug,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });

    console.log('Category created successfully');
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:');
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 