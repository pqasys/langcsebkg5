'use client'

import { VideoSessionInterface } from '@/components/video/VideoSessionInterface'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

interface VideoSessionPageProps {
  params: {
    id: string
  }
}

export default function VideoSessionPage({ params }: VideoSessionPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.id) {
      router.push('/auth/signin')
      return
    }

    // Fetch session data to verify access
    fetchSessionData()
  }, [session, status, params.id])

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`/api/video-sessions/${params.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError('Video session not found')
        } else if (response.status === 403) {
          setError('You do not have permission to join this session')
        } else {
          setError('Failed to join video session')
        }
        return
      }

      const data = await response.json()
      setSessionData(data.session)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch session data:', error)
      setError('Failed to load video session')
    }
  }

  const handleLeave = () => {
    router.push('/dashboard')
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading video session...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Initializing video session...</p>
        </div>
      </div>
    )
  }

  return (
    <VideoSessionInterface
      sessionId={params.id}
      onLeave={handleLeave}
    />
  )
} 