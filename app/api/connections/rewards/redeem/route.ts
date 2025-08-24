import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ConnectionIncentivesService } from '@/lib/connection-incentives-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rewardType } = await request.json()

    if (!rewardType) {
      return NextResponse.json({ error: 'Reward type is required' }, { status: 400 })
    }

    const reward = await ConnectionIncentivesService.redeemReward(session.user.id, rewardType)

    return NextResponse.json({
      success: true,
      reward,
      message: 'Reward redeemed successfully'
    })
  } catch (error) {
    console.error('Error redeeming reward:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to redeem reward' },
      { status: 500 }
    )
  }
}
