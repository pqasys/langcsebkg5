import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { assignTagsToCourse } from '@/lib/tag-utils'
import { v4 as uuidv4 } from 'uuid'
import { logger, logError } from '../../../lib/logger';

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const courses = await prisma.course.findMany({
      where: {
        institution: {
          users: {
            some: {
              id: session.user.id
            }
          }
        }
      },
      include: {
        institution: true,
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'INSTITUTION') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      title,
      description,
      base_price,
      duration,
      categoryId,
      level,
      startDate,
      endDate,
      maxStudents,
      pricingPeriod,
      framework
    } = await request.json()

    const institution = await prisma.institution.findFirst({
      where: {
        users: {
          some: {
            id: session.user.id
          }
        }
      }
    })

    if (!institution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      )
    }

    // Generate unique slug for the course
    function generateSlug(title: string): string {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    async function ensureUniqueSlug(baseSlug: string): Promise<string> {
      let slug = baseSlug;
      let counter = 1;
      
      while (true) {
        const existing = await prisma.course.findFirst({
          where: { slug: slug }
        });
        
        if (!existing) {
          return slug;
        }
        
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const baseSlug = generateSlug(title);
    const uniqueSlug = await ensureUniqueSlug(baseSlug);

    const course = await prisma.course.create({
      data: {
        title,
        slug: uniqueSlug,
        description,
        base_price: parseFloat(base_price || '0'),
        duration: parseInt(duration),
        categoryId,
        level,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxStudents: parseInt(maxStudents || '15'),
        institutionId: institution.id,
        pricingPeriod: pricingPeriod || 'WEEKLY',
        framework: framework || 'CEFR',
        status: 'ACTIVE'
      },
      include: {
        courseTags: {
          include: {
            tag: true
          }
        }
      }
    })

    const tagIds = await assignTagsToCourse({ title, description, category: categoryId })
    
    await Promise.all(
      tagIds.map(tagId =>
        prisma.courseTag.create({
          data: {
            id: uuidv4(),
            courseId: course.id,
            tagId,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      )
    )

    // Fetch the course with updated tags
    const updatedCourse = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        courseTags: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json(updatedCourse, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    )
  }
}
