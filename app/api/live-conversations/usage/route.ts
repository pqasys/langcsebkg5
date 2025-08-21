import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  getStudentLiveConversationEntitlements,
  getInstitutionLiveConversationDefaults,
  mergeLiveConversationEntitlements,
} from '@/lib/subscription-pricing'
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    // Resolve entitlements
    const subscription = await prisma.studentSubscription.findUnique({ where: { studentId: userId } })
    const studentPlanType = subscription?.planType || 'BASIC'
    const studentEnt = getStudentLiveConversationEntitlements(studentPlanType)

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { institutionId: true } })
    let instEnt = getInstitutionLiveConversationDefaults('STARTER')
    if (user?.institutionId) {
      try {
        const instStatus = await SubscriptionCommissionService.getSubscriptionStatus(user.institutionId)
        const instPlan = instStatus.currentPlan as string | undefined
        if (instPlan) instEnt = getInstitutionLiveConversationDefaults(instPlan)
      } catch {}
    }
    const ent = mergeLiveConversationEntitlements(studentEnt, instEnt)

    // Current cycle usage
    const cycleStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const cycleEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)

    const bookings = await prisma.liveConversationBooking.findMany({
      where: {
        studentId: userId,
        status: { not: 'CANCELLED' },
        scheduledAt: { gte: cycleStart, lte: cycleEnd },
      },
      include: { conversation: true },
    })

    let group = 0
    let oneToOne = 0
    let minutes = 0
    for (const b of bookings) {
      const isOneToOne = (b.conversation?.maxParticipants ?? 0) <= 2 || b.conversation?.conversationType === 'PRIVATE'
      if (isOneToOne) oneToOne += 1
      else group += 1
      minutes += b.duration || 0
    }

    return NextResponse.json({
      group,
      oneToOne,
      minutes,
      ent: {
        groupCap: ent.groupSessionsPerMonth,
        oneToOneCap: ent.oneToOneSessionsPerMonth,
        minutesCap: ent.fairUseMinutesPerMonth,
      },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load usage' }, { status: 500 })
  }
}


