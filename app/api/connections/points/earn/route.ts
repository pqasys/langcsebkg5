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

    const { activityType, description } = await request.json()

    if (!activityType) {
      return NextResponse.json({ error: 'Activity type is required' }, { status: 400 })
    }

    const points = await ConnectionIncentivesService.awardPoints(
      session.user.id,
      activityType,
      description
    )

    return NextResponse.json({
      success: true,
      points,
      message: 'Points awarded successfully'
    })
  } catch (error) {
    console.error('Error awarding points:', error)
    return NextResponse.json(
      { error: 'Failed to award points' },
      { status: 500 }
    )
  }
}
