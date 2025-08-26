import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const title = searchParams.get('title');

    // If no filters are applied, return only top-level tags (tags without a parent)
    if (!categoryId && !title) {
      const topTags = await prisma.tag.findMany({
        where: {
          parentId: null // Only get tags without a parent
        },
        orderBy: {
          name: 'asc'
        }
      });

      return NextResponse.json(topTags);
    }

    // Build the where clause based on filters
    const where: unknown = {};

    if (categoryId) {
      where.courseTags = {
        some: {
          course: {
            categoryId: categoryId
          }
        }
      };
    }

    if (title) {
      where.courseTags = {
        ...where.courseTags,
        some: {
          course: {
            title: {
              contains: title
            }
          }
        }
      };
    }

    const tags = await prisma.tag.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    // Check if tag already exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        name: {
          equals: name
        }
      }
    });

    if (existingTag) {
      return NextResponse.json(existingTag);
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const tag = await prisma.tag.create({
      data: {
        id: crypto.randomUUID(),
        name,
        slug,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error creating tag:');
    return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 