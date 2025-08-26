import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      // // // console.log('Analytics access denied - Session:', session);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total tags count
    const totalTags = await prisma.tag.count();

    // Get featured tags count
    const featuredTags = await prisma.tag.count({
      where: { featured: true }
    });

    // Get unused tags count (tags not used in any course)
    const unusedTags = await prisma.tag.count({
      where: {
        courseTags: {
          none: {}
        }
      }
    });

    // Get most used tags with accurate course counts
    const mostUsedTags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      },
      take: 5
    });

    // Get course counts for most used tags
    const mostUsedTagsWithCounts = await Promise.all(
      mostUsedTags.map(async (tag) => {
        const courseCount = await prisma.courseTag.count({
          where: { tagId: tag.id }
        });
        return {
          name: tag.name,
          count: courseCount
        };
      })
    );

    // Sort by count descending
    mostUsedTagsWithCounts.sort((a, b) => b.count - a.count);

    // Get recently added tags
    const recentlyAddedTags = await prisma.tag.findMany({
      select: {
        name: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    return NextResponse.json({
      totalTags,
      featuredTags,
      unusedTags,
      mostUsedTags: mostUsedTagsWithCounts,
      recentlyAddedTags: recentlyAddedTags.map(tag => ({
        name: tag.name,
        createdAt: tag.createdAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching tag analytics:');
    return NextResponse.json(
      { error: 'Failed to fetch tag analytics' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 