import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ConnectionIncentivesService } from '@/lib/connection-incentives-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const leaderboard = await ConnectionIncentivesService.getAchievementLeaderboard(limit)

    return NextResponse.json({
      success: true,
      leaderboard,
      limit
    })
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to get leaderboard' },
      { status: 500 }
    )
  }
}
