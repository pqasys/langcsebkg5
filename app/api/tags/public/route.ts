import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isBuildTime } from '@/lib/build-error-handler';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: any = {};
    
    if (featured) {
      where.featured = true;
    }

    // Only get tags that are actually used in published courses
    where.courseTags = {
      some: {
        course: {
          status: 'PUBLISHED',
          institution: {
            isApproved: true,
            status: 'ACTIVE'
          }
        }
      }
    };

    const tags = await prisma.tag.findMany({
      where,
      select: {
        id: true,
        name: true,
        color: true,
        icon: true,
        featured: true,
        courseTags: {
          where: {
            course: {
              status: 'PUBLISHED',
              institution: {
                isApproved: true,
                status: 'ACTIVE'
              }
            }
          },
          select: {
            id: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { name: 'asc' }
      ],
      ...(limit > 0 && { take: limit })
    });

    // Transform the data to include usage count
    const transformedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      icon: tag.icon,
      featured: tag.featured,
      usageCount: tag.courseTags.length
    }));

    // Sort by usage count after fetching
    transformedTags.sort((a, b) => b.usageCount - a.usageCount);

    return NextResponse.json(transformedTags);
  } catch (error) {
    console.error('Error fetching public tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
} 