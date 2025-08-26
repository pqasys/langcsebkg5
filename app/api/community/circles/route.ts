import { NextRequest, NextResponse } from 'next/server'
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/community/circles?search=&language=&level=&limit=20
export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined
    const language = searchParams.get('language') || undefined
    const level = searchParams.get('level') || undefined
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50)

    const where: any = { isActive: true, isPublic: true }
    if (language) where.language = language
    if (level) where.level = level
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const circles = await prisma.communityCircle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { 
        members: true,
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
    })

    const result = circles.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      language: c.language,
      level: c.level,
      description: c.description,
      membersCount: c.members.length,
      isPublic: c.isPublic,
      createdAt: c.createdAt,
      owner: c.owner,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load circles' }, { status: 500 })
  }
}

// POST /api/community/circles  { name, language?, level?, description? }
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const name: string = String(body.name || '').trim()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const slugBase = slugify(name, { lower: true, strict: true })
    let slug = slugBase
    let i = 1
    while (await prisma.communityCircle.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${i++}`
    }

    const circle = await prisma.communityCircle.create({
      data: {
        name,
        slug,
        language: body.language || null,
        level: body.level || null,
        description: body.description || null,
        ownerId: session.user.id,
        isPublic: true,
      },
    })

    // auto-join owner
    await prisma.communityCircleMembership.create({
      data: { circleId: circle.id, userId: session.user.id, role: 'OWNER' },
    })

    return NextResponse.json(circle, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create circle' }, { status: 500 })
  }
}


