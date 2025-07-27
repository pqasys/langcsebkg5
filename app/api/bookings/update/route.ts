import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { logger, logError } from '../../../../lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Retrieve the Stripe session
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (!stripeSession) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
    }

    // Find the booking associated with this session
    const booking = await prisma.booking.findFirst({
      where: {
        stripeSessionId: sessionId,
      },
      include: {
        course: {
          include: {
            institution: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Update the booking status based on the Stripe session status
    const updatedBooking = await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        status: stripeSession.payment_status === 'paid' ? 'CONFIRMED' : 'CANCELLED',
        paymentStatus: stripeSession.payment_status,
        paymentIntentId: stripeSession.payment_intent as string,
      },
      include: {
        course: {
          include: {
            institution: true,
          },
        },
      },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    )
  }
} 