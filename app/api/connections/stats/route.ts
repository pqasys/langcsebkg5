import { NextRequest, NextResponse } from 'next/server'
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ConnectionIncentivesService } from '@/lib/connection-incentives-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await ConnectionIncentivesService.getUserConnectionStats(session.user.id)

    return NextResponse.json({
      success: true,
      stats,
      userId: session.user.id
    })
  } catch (error) {
    console.error('Error getting connection stats:', error)
    return NextResponse.json(
      { error: 'Failed to get connection stats' },
      { status: 500 }
    )
  }
}
