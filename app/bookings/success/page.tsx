'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'
import { toast } from 'sonner'
import { useCurrency } from '@/app/hooks/useCurrency'

const prisma = new PrismaClient()

interface Booking {
  id: string
  course: {
    title: string
    institution: {
      name: string
    }
  }
  amount: number
  status: string
  paymentStatus: string
}

function BookingSuccessContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const { formatCurrencyWithSymbol } = useCurrency()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) {
      router.push('/')
      return
    }

    const updateBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/update?session_id=${sessionId}`, {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error(`Failed to update booking - Context: throw new Error('Failed to update booking')...`)
        }

        const data = await response.json()
        setBooking(data)
        toast.success('Booking confirmed successfully!')
      } catch (error) {
        console.error('Error updating booking:', error)
        toast.error('Failed to confirm booking')
      } finally {
        setLoading(false)
      }
    }

    updateBooking()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Booking not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The booking you're looking for doesn't exist or has been removed
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Booking Confirmed
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Thank you for your booking!
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Course</dt>
                <dd className="mt-1 text-sm text-gray-900">{booking.course.title}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Institution</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {booking.course.institution.name}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Amount Paid</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatCurrencyWithSymbol(booking.amount)}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{booking.status}</dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <button
              onClick={() => router.push('/bookings')}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccess() {
  return (
    <Suspense fallback={<div>Loading booking details...</div>}>
      <BookingSuccessContent />
    </Suspense>
  )
} 