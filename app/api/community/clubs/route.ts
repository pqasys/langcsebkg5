import { NextRequest, NextResponse } from 'next/server'
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Weekly clubs are modeled using VideoSession with isRecurring=true and isPublic=true
// GET /api/community/clubs?from=&to=&language=&level=&limit=
export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const language = searchParams.get('language') || undefined
    const level = searchParams.get('level') || undefined
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)

    const where: any = {
      isPublic: true,
      status: 'SCHEDULED',
      OR: [] as any[],
    }
    if (language) where.language = language
    if (level) where.level = level
    if (from && to) {
      const fromDate = new Date(from)
      const toDate = new Date(to)
      where.OR = [
        { AND: [{ startTime: { gte: fromDate } }, { startTime: { lte: toDate } }] },
        { AND: [{ endTime: { gte: fromDate } }, { endTime: { lte: toDate } }] },
        { AND: [{ startTime: { lte: fromDate } }, { endTime: { gte: toDate } }] },
      ]
    }

    const sessions = await prisma.videoSession.findMany({
      where,
      orderBy: { startTime: 'asc' },
      take: limit,
      select: {
        id: true,
        title: true,
        language: true,
        level: true,
        startTime: true,
        endTime: true,
        maxParticipants: true,
        isRecurring: true,
        recurringPatternId: true,
      },
    })

    const clubs = sessions.map((s) => ({
      id: s.id,
      title: s.title || 'Community Club',
      language: s.language,
      level: s.level,
      start: s.startTime,
      end: s.endTime,
      capacity: s.maxParticipants,
      isRecurring: s.isRecurring,
      recurringPatternId: s.recurringPatternId,
    }))

    return NextResponse.json(clubs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load clubs' }, { status: 500 })
  }
}


