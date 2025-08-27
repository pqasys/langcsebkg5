import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CommunityLiveClassAccessService } from '@/lib/community-live-class-access'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { slug } = params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { title, description, date, time, duration, type, maxAttendees } = await request.json()

    // Validate required fields
    if (!title || !description || !date || !time || !duration || !type) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
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
        { error: 'You must be a member to create events in this circle' },
        { status: 403 }
      )
    }

    // Validate event type
    const validTypes = ['study-session', 'conversation', 'workshop', 'social', 'live-class']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      )
    }

    // Apply freemium access controls for live-class events
    if (type === 'live-class') {
      const validation = await CommunityLiveClassAccessService.validateEventCreation(
        session.user.id,
        { duration, maxAttendees }
      )

      if (!validation.valid) {
        return NextResponse.json(
          { 
            error: validation.reason,
            restrictions: validation.restrictions,
            requiresUpgrade: true
          },
          { status: 403 }
        )
      }
    }

    // Create the event
    const event = await prisma.communityCircleEvent.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        date: new Date(date),
        time,
        duration: parseInt(duration),
        type: type.toUpperCase(),
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        circleId: circle.id,
        createdBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date.toISOString().split('T')[0],
        time: event.time,
        duration: event.duration,
        type: event.type.toLowerCase(),
        attendees: 0,
        maxAttendees: event.maxAttendees
      }
    })

  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { slug } = params

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

    // Get events with attendee counts
    const events = await prisma.communityCircleEvent.findMany({
      where: {
        circleId: circle.id
      },
      include: {
        attendees: true,
        creator: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Transform events to include attendee count and user access info
    const transformedEvents = await Promise.all(
      events.map(async (event) => {
        const attendeeCount = event.attendees.length
        
        // Add access control info for live-class events
        let accessInfo = null
        if (event.type === 'LIVE_CLASS' && session?.user?.id) {
          const accessStatus = await CommunityLiveClassAccessService.canJoinLiveClass(
            session.user.id,
            event.id
          )
          accessInfo = {
            canJoin: accessStatus.hasAccess,
            reason: accessStatus.reason,
            upgradePrompt: accessStatus.upgradePrompt
          }
        }

        return {
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date.toISOString().split('T')[0],
          time: event.time,
          duration: event.duration,
          type: event.type.toLowerCase(),
          attendees: attendeeCount,
          maxAttendees: event.maxAttendees,
          creator: event.creator,
          accessInfo
        }
      })
    )

    return NextResponse.json({
      success: true,
      events: transformedEvents
    })

  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
