import { NextResponse } from 'next/server';
import { prisma, performWarmup } from '@/lib/server-warmup';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure database is warmed up
    await performWarmup();
    
    // Use a single optimized query with join instead of multiple queries
    const coursesByCountry = await prisma.course.groupBy({
      by: ['institutionId'],
      where: {
        status: 'published',
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 8, // Increased to show more countries
    });

    // Get all institutions in one query
    const institutionIds = coursesByCountry.map(group => group.institutionId);
    const institutions = await prisma.institution.findMany({
      where: {
        id: { in: institutionIds }
      },
      select: {
        id: true,
        country: true,
      },
    });

    // Create a map for quick lookup
    const institutionMap = new Map(
      institutions.map(inst => [inst.id, inst.country])
    );

    // Combine the data
    const countriesWithDetails = coursesByCountry.map(group => ({
      country: institutionMap.get(group.institutionId) || 'Unknown',
      courseCount: group._count.id,
    }));

    return NextResponse.json(countriesWithDetails);
  } catch (error) {
    console.error('Error fetching courses by country:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses by country' },
      { status: 500 }
    );
  }
} 