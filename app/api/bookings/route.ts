import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'
import Stripe from 'stripe'
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma'
import { logger, logError } from '../../../lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId }: { courseId: string } = await request.json()

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Get institution details
    const institution = await prisma.institution.findUnique({
      where: { id: course.institutionId },
      select: {
        id: true,
        name: true,
        commissionRate: true
      }
    })

    if (!institution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      )
    }

    // Calculate commission using institution's commission rate
    const commissionRate = institution.commissionRate / 100; // Convert percentage to decimal
    const commission = course.base_price * commissionRate;
    const totalAmount = course.base_price + commission;

    // // // console.log('Creating booking with courseId:', courseId);
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        amount: course.base_price, // Store the base price, commission is added separately
        status: 'PENDING',
        institutionId: course.institutionId,
        studentId: session.user.id,
      } as Prisma.bookingUncheckedCreateInput,
    })

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: `Course by ${institution.name}`,
            },
            unit_amount: Math.round(totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/courses/${courseId}`,
      metadata: {
        bookingId: booking.id,
      },
    })

    return NextResponse.json({ sessionId: stripeSession.id })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            institutionId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get institution data for all courses
    const institutionIds = [...new Set(bookings.map(b => b.course.institutionId).filter(Boolean))];
    const institutions = await prisma.institution.findMany({
      where: {
        id: {
          in: institutionIds
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    // Add institution data to bookings
    const bookingsWithInstitutions = bookings.map(booking => ({
      ...booking,
      course: {
        ...booking.course,
        institution: institutions.find(i => i.id === booking.course.institutionId)
      }
    }));

    return NextResponse.json(bookingsWithInstitutions)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    )
  }
} 