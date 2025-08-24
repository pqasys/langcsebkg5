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
    const limit = parseInt(searchParams.get('limit') || '20')

    const history = await ConnectionIncentivesService.getUserPointsHistory(
      session.user.id,
      limit
    )

    return NextResponse.json({
      success: true,
      history,
      userId: session.user.id
    })
  } catch (error) {
    console.error('Error getting points history:', error)
    return NextResponse.json(
      { error: 'Failed to get points history' },
      { status: 500 }
    )
  }
}
