'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Video, 
  Users, 
  Clock, 
  Calendar,
  Edit,
  Eye,
  Play,
  Trash2,
  Search,
  Filter,
  SortAsc,
  Star,
  DollarSign,
  Globe,
  GraduationCap
} from 'lucide-react'
import { toast } from 'sonner'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

interface VideoSession {
  id: string
  title: string
  description?: string
  sessionType: string
  language: string
  level: string
  startTime: string
  endTime: string
  duration: number
  maxParticipants: number
  price: number
  status: string
  isPublic: boolean
  isRecorded: boolean
  instructor: {
    id: string
    name: string
    email: string
  }
  participants: Array<{
    id: string
    user: {
      id: string
      name: string
      email: string
    }
    role: string
    joinedAt: string
  }>
  createdAt: string
  updatedAt: string
}

interface Module {
  id: string
  title: string
  description?: string
  course: {
    id: string
    title: string
  }
}

export default function ModuleVideoSessionsPage({ 
  params 
}: { 
  params: { id: string; moduleId: string } 
}) {
  const router = useRouter()
  const [videoSessions, setVideoSessions] = useState<VideoSession[]>([])
  const [module, setModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchData()
  }, [params.id, params.moduleId])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch module details
      const moduleResponse = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}`)
      if (!moduleResponse.ok) {
        throw new Error('Failed to fetch module')
      }
      const moduleData = await moduleResponse.json()
      setModule(moduleData)

      // Fetch video sessions for this module
      const sessionsResponse = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/video-sessions`)
      if (!sessionsResponse.ok) {
        throw new Error('Failed to fetch video sessions')
      }
      const sessionsData = await sessionsResponse.json()
      setVideoSessions(sessionsData.sessions || [])
    } catch (error) {
      console.error('Error occurred:', error)
      toast.error('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSession = () => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/video-sessions/new`)
  }

  const handleEditSession = (sessionId: string) => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/video-sessions/${sessionId}/edit`)
  }

  const handleViewSession = (sessionId: string) => {
    router.push(`/video-session/${sessionId}`)
  }

  const handleJoinSession = (sessionId: string) => {
    router.push(`/video-session/${sessionId}`)
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

  const filteredSessions = videoSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus
    const matchesType = filterType === 'all' || session.sessionType === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Video Sessions</h1>
          <p className="text-muted-foreground">
            Manage video sessions for {module?.title} in {module?.course.title}
          </p>
        </div>
        <Button onClick={handleCreateSession}>
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ACTIVE">Live</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="GROUP">Group</option>
            <option value="ONE_ON_ONE">One-on-One</option>
            <option value="WORKSHOP">Workshop</option>
          </select>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow duration-300">
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
                  {session.status === 'ACTIVE' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleJoinSession(session.id)}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewSession(session.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSession(session.id)}
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
                    <Globe className="w-4 h-4 text-gray-400" />
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
                      {new Date(session.startTime).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {session.instructor.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {session.price > 0 && (
                      <Badge variant="secondary">
                        <DollarSign className="w-3 h-3 mr-1" />
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
      {filteredSessions.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No video sessions yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first video session for this module to start teaching languages online.
            </p>
            <Button onClick={handleCreateSession}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 