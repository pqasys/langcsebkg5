import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ConnectionIncentivesService } from '@/lib/connection-incentives-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const achievements = await ConnectionIncentivesService.getUserAchievements(session.user.id)

    return NextResponse.json({
      success: true,
      achievements,
      userId: session.user.id
    })
  } catch (error) {
    console.error('Error getting achievements:', error)
    return NextResponse.json(
      { error: 'Failed to get achievements' },
      { status: 500 }
    )
  }
}
