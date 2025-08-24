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

    const rewards = await ConnectionIncentivesService.getAvailableRewards(session.user.id)

    return NextResponse.json({
      success: true,
      rewards,
      userId: session.user.id
    })
  } catch (error) {
    console.error('Error getting available rewards:', error)
    return NextResponse.json(
      { error: 'Failed to get available rewards' },
      { status: 500 }
    )
  }
}
