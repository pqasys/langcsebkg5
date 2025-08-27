import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CommunityLiveClassAccessService } from '@/lib/community-live-class-access'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string; eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { slug, eventId } = params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if circle exists
    const circle = await prisma.communityCircle.findUnique({
      where: { slug: slug }
    })

    if (!circle) {
      return NextResponse.json(
        { error: 'Circle not found' },
        { status: 404 }
      )
    }

    // Check if user is a member
    const membership = await prisma.communityCircleMembership.findUnique({
      where: {
        circleId_userId: {
          circleId: circle.id,
          userId: session.user.id
        }
      }
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You must be a member to join events in this circle' },
        { status: 403 }
      )
    }

    // Get the event
    const event = await prisma.communityCircleEvent.findUnique({
      where: { id: eventId },
      include: {
        attendees: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if user is already attending
    const isAlreadyAttending = event.attendees.some(
      attendee => attendee.userId === session.user.id
    )

    if (isAlreadyAttending) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      )
    }

    // Apply access controls for live-class events
    if (event.type === 'LIVE_CLASS') {
      const accessStatus = await CommunityLiveClassAccessService.canJoinLiveClass(
        session.user.id,
        eventId
      )

      if (!accessStatus.hasAccess) {
        return NextResponse.json(
          { 
            error: accessStatus.reason,
            upgradePrompt: accessStatus.upgradePrompt,
            requiresUpgrade: true
          },
          { status: 403 }
        )
      }
    }

    // Check if event is full
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return NextResponse.json(
        { error: 'This event is full' },
        { status: 400 }
      )
    }

    // Join the event
    const attendee = await prisma.communityCircleEventAttendee.create({
      data: {
        eventId: eventId,
        userId: session.user.id,
        status: 'REGISTERED'
      }
    })

    // Get updated attendee count
    const updatedAttendeeCount = await prisma.communityCircleEventAttendee.count({
      where: { eventId: eventId }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the event',
      attendeeCount: updatedAttendeeCount
    })

  } catch (error) {
    console.error('Error joining event:', error)
    return NextResponse.json(
      { error: 'Failed to join event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { slug, eventId } = params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is attending the event
    const attendee = await prisma.communityCircleEventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: session.user.id
        }
      }
    })

    if (!attendee) {
      return NextResponse.json(
        { error: 'You are not registered for this event' },
        { status: 404 }
      )
    }

    // Leave the event
    await prisma.communityCircleEventAttendee.delete({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: session.user.id
        }
      }
    })

    // Get updated attendee count
    const updatedAttendeeCount = await prisma.communityCircleEventAttendee.count({
      where: { eventId: eventId }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully left the event',
      attendeeCount: updatedAttendeeCount
    })

  } catch (error) {
    console.error('Error leaving event:', error)
    return NextResponse.json(
      { error: 'Failed to leave event' },
      { status: 500 }
    )
  }
}
