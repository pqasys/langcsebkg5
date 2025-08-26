import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import slugify from 'slugify';

// GET /api/tags - Get all tags
export async function GET(request: Request) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    console.log('Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userRole: session?.user?.role
    });

    if (!session?.user) {
      console.log('No session or user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeHierarchy = searchParams.get('include') === 'hierarchy';
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';
    const institutionId = searchParams.get('institutionId');

    console.log('Request params:', { 
      includeHierarchy, 
      search, 
      featured, 
      institutionId 
    });

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      }),
      ...(featured && { featured: true }),
      ...(institutionId && {
        courseTags: {
          some: {
            course: {
              institutionId: institutionId
            }
          }
        }
      })
    };

    console.log('Fetching tags with where clause:', where);

    try {
      const tags = await prisma.tag.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          color: true,
          icon: true,
          featured: true,
          priority: true,
          parentId: true
        },
        orderBy: [
          { priority: 'desc' },
          { name: 'asc' }
        ]
      });

      // Add counts separately for each tag
      const tagsWithCounts = await Promise.all(
        tags.map(async (tag) => {
          const [courseTagsCount, childCount] = await Promise.all([
            prisma.courseTag.count({ where: { tagId: tag.id } }),
            prisma.tag.count({ where: { parentId: tag.id } })
          ]);

          return {
            ...tag,
            _count: {
              courseTags: courseTagsCount,
              children: childCount
            }
          };
        })
      );

      console.log('Found tags:', tagsWithCounts.length);
      if (tagsWithCounts.length === 0) {
        console.log('No tags found in the database');
        // Check if there are any tags at all
        const totalTags = await prisma.tag.count();
        console.log('Total tags in database:', totalTags);
      } else {
        console.log('First few tags:', tagsWithCounts.slice(0, 3));
      }

      // If hierarchy is requested, fetch children separately
      if (includeHierarchy) {
        console.log('Fetching hierarchy for tags');
        const tagsWithChildren = await Promise.all(
          tagsWithCounts.map(async (tag) => {
            const children = await prisma.tag.findMany({
              where: { parentId: tag.id },
              select: {
                id: true,
                name: true,
                description: true,
                color: true,
                icon: true,
                featured: true,
                priority: true,
                parentId: true,
                _count: {
                  select: {
                    courseTags: true
                  }
                }
              },
              orderBy: [
                { priority: 'desc' },
                { name: 'asc' }
              ]
            });

            // Add child count to each child tag
            const childrenWithCount = await Promise.all(
              children.map(async (child) => {
                const childCount = await prisma.tag.count({
                  where: { parentId: child.id }
                });
                return {
                  ...child,
                  _count: {
                    ...child._count,
                    children: childCount
                  }
                };
              })
            );

            return { ...tag, children: childrenWithCount };
          })
        );
        console.log('Returning tags with hierarchy');
        return NextResponse.json(tagsWithChildren);
      }

      console.log('Returning flat tags list');
      return NextResponse.json(tagsWithCounts);
    } catch (error) {
      console.error('Database error:');
      return NextResponse.json({ error: 'Database error occurred' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error in tags API:');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, parentId, color, icon, featured, priority } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check if tag with same name exists
    const existingTag = await prisma.tag.findFirst({
      where: { name: { contains: name } }
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'A tag with this name already exists' },
        { status: 400 }
      );
    }

    // If parentId is provided, verify it exists
    if (parentId) {
      const parentTag = await prisma.tag.findUnique({
        where: { id: parentId }
      });

      if (!parentTag) {
        return NextResponse.json(
          { error: 'Parent tag not found' },
          { status: 400 }
        );
      }
    }

    const tag = await prisma.tag.create({
      data: {
        id: crypto.randomUUID(),
        name,
        description,
        parentId,
        color,
        icon,
        featured: featured || false,
        priority: priority || 0,
        slug: slugify(name, { lower: true, strict: true }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('Tag created successfully:', tag);
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error creating tag:');
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 