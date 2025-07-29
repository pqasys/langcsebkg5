'use client'

import { VideoSessionCreator } from '@/components/video/VideoSessionCreator'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'

export default function CreateVideoSessionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.id) {
      router.push('/auth/signin')
      return
    }

    // Only allow instructors and institutions to create video sessions
    if (session.user.role !== 'INSTITUTION' && session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  const handleSessionCreated = (sessionId: string) => {
    router.push(`/video-session/${sessionId}`)
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>Authentication Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You must be signed in to create video sessions.
            </p>
            <Button onClick={() => router.push('/auth/signin')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (session.user.role !== 'INSTITUTION' && session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>Access Denied</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Only instructors and administrators can create video sessions.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Video Session
          </h1>
          <p className="text-gray-600">
            Schedule a new video session for language learning and practice.
          </p>
        </div>

        <VideoSessionCreator
          onSessionCreated={handleSessionCreated}
          onCancel={handleCancel}
          institutionId={session.user.institutionId}
        />
      </div>
    </div>
  )
} 