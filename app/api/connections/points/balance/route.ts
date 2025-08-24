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

    const points = await ConnectionIncentivesService.getUserPoints(session.user.id)

    return NextResponse.json({
      success: true,
      points,
      userId: session.user.id
    })
  } catch (error) {
    console.error('Error getting points balance:', error)
    return NextResponse.json(
      { error: 'Failed to get points balance' },
      { status: 500 }
    )
  }
}
