'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Video, 
  Users, 
  Calendar, 
  Clock, 
  Play,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

interface VideoSession {
  id: string
  title: string
  description?: string
  sessionType: string
  language: string
  level: string
  maxParticipants: number
  startTime: string
  endTime: string
  duration: number
  status: string
  price: number
  isPublic: boolean
  isRecorded: boolean
  participants: any[]
  instructor: {
    id: string
    name: string
    email: string
  }
}

export default function InstitutionVideoSessionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sessions, setSessions] = useState<VideoSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.id) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'INSTITUTION') {
      router.push('/dashboard')
      return
    }

    fetchVideoSessions()
  }, [session, status])

  const fetchVideoSessions = async () => {
    try {
      const response = await fetch('/api/video-sessions/institution', {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error('Failed to fetch video sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge variant="secondary">Scheduled</Badge>
      case 'ACTIVE':
        return <Badge variant="default">Live</Badge>
      case 'COMPLETED':
        return <Badge variant="outline">Completed</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'GROUP':
        return 'Group Session'
      case 'ONE_ON_ONE':
        return 'One-on-One'
      case 'WORKSHOP':
        return 'Workshop'
      default:
        return type
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Video Sessions
              </h1>
              <p className="text-gray-600">
                Manage your language learning video sessions
              </p>
            </div>
            <Link href="/video-sessions/create">
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Session</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{session.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusBadge(session.status)}
                      <Badge variant="outline">
                        {getSessionTypeLabel(session.sessionType)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/video-session/${session.id}`)}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/video-sessions/${session.id}/edit`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {session.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {session.language.toUpperCase()} • {session.level}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {session.participants.length}/{session.maxParticipants}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {format(new Date(session.startTime), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {format(new Date(session.startTime), 'HH:mm')} - {format(new Date(session.endTime), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        Instructor: {session.instructor.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {session.price > 0 && (
                        <Badge variant="secondary">
                          ${session.price}
                        </Badge>
                      )}
                      {session.isPublic && (
                        <Badge variant="outline">Public</Badge>
                      )}
                      {session.isRecorded && (
                        <Badge variant="outline">Recorded</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sessions.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No video sessions yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first video session to start teaching languages online.
              </p>
              <Link href="/video-sessions/create">
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Session</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 