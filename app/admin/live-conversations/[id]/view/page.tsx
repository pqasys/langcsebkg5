'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  MessageSquare, 
  AlertTriangle, 
  Flag, 
  UserX,
  Eye,
  X,
  Ban,
  Shield,
  Mail,
  Phone,
  Globe,
  MapPin
} from 'lucide-react'

interface ConversationDetails {
  id: string
  title: string
  description: string
  conversationType: string
  language: string
  level: string
  startTime: string
  endTime: string
  duration: number
  maxParticipants: number
  currentParticipants: number
  price: number
  isFree: boolean
  status: string
  isPublic: boolean
  hostId: string
  hostName: string
  hostEmail: string
  hostImage?: string
  reportCount: number
  reports: Array<{
    id: string
    reason: string
    reporterName: string
    reporterEmail: string
    createdAt: string
    status: string
  }>
  participants: Array<{
    id: string
    userId: string
    userName: string
    userEmail: string
    userImage?: string
    status: string
    joinedAt: string
  }>
  createdAt: string
  updatedAt: string
}

export default function AdminConversationViewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const conversationId = params.id as string
  
  const [conversation, setConversation] = useState<ConversationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin')
      return
    }
    if (conversationId) {
      loadConversationDetails()
    }
  }, [status, router, conversationId])

  const loadConversationDetails = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/live-conversations/${conversationId}`, { 
        cache: 'no-store' 
      })
      const data = await res.json()
      if (data.success) {
        setConversation(data.conversation)
      }
    } catch (error) {
      console.error('Error loading conversation details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModerationAction = async (action: string, reason?: string) => {
    if (!reason) {
      reason = prompt(`Reason for ${action} action:`)
      if (!reason) return
    }

    try {
      setActionLoading(true)
      const res = await fetch(`/api/admin/live-conversations/${conversationId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      
      if (res.ok) {
        await loadConversationDetails()
        alert(`${action} action completed successfully`)
      } else {
        const error = await res.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Moderation action failed:', error)
      alert('Action failed. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'SCHEDULED': 'default',
      'ACTIVE': 'default',
      'COMPLETED': 'secondary',
      'CANCELLED': 'destructive'
    }
    return <Badge variant={variants[status] as any}>{status}</Badge>
  }

  const getParticipantStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'CONFIRMED': 'default',
      'PENDING': 'secondary',
      'CANCELLED': 'destructive'
    }
    return <Badge variant={variants[status] as any}>{status}</Badge>
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-sm text-gray-600">Loading conversation details...</div>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-sm text-gray-600">Conversation not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Conversation Details</h1>
            <p className="text-gray-600">Admin view and moderation tools</p>
          </div>
        </div>
        <div className="flex gap-2">
          {conversation.status === 'SCHEDULED' && (
            <>
              <Button 
                variant="destructive" 
                onClick={() => handleModerationAction('cancel')}
                disabled={actionLoading}
              >
                <X className="w-4 h-4 mr-2" />Cancel Conversation
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleModerationAction('suspend-host')}
                disabled={actionLoading}
              >
                <UserX className="w-4 h-4 mr-2" />Suspend Host
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Alert for reported conversations */}
      {conversation.reportCount > 0 && (
        <Alert className={`border-2 ${
          conversation.reportCount >= 3 ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50'
        }`}>
          <AlertTriangle className={`h-4 w-4 ${
            conversation.reportCount >= 3 ? 'text-red-600' : 'text-orange-600'
          }`} />
          <AlertDescription className={`${
            conversation.reportCount >= 3 ? 'text-red-800' : 'text-orange-800'
          }`}>
            <strong>⚠️ {conversation.reportCount} report(s) received</strong>
            {conversation.reportCount >= 3 && ' - This conversation has been flagged for immediate review'}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Conversation Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{conversation.title}</h3>
                <p className="text-gray-600 mt-1">{conversation.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {new Date(conversation.startTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{conversation.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {conversation.currentParticipants}/{conversation.maxParticipants} participants
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {conversation.isFree ? 'Free' : `$${conversation.price}`}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {getStatusBadge(conversation.status)}
                <Badge variant="outline">{conversation.conversationType}</Badge>
                <Badge variant="outline">{conversation.level.replace('CEFR_', '')}</Badge>
                <Badge variant="outline">{conversation.language}</Badge>
                {conversation.isPublic ? (
                  <Badge variant="outline">Public</Badge>
                ) : (
                  <Badge variant="outline">Private</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Host Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Host Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {conversation.hostImage && (
                  <img 
                    src={conversation.hostImage} 
                    alt={conversation.hostName}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <h4 className="font-semibold">{conversation.hostName}</h4>
                  <p className="text-sm text-gray-600">{conversation.hostEmail}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />Email Host
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants ({conversation.participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {conversation.participants.length === 0 ? (
                <p className="text-gray-600 text-sm">No participants yet</p>
              ) : (
                <div className="space-y-3">
                  {conversation.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {participant.userImage && (
                          <img 
                            src={participant.userImage} 
                            alt={participant.userName}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium">{participant.userName}</p>
                          <p className="text-sm text-gray-600">{participant.userEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getParticipantStatusBadge(participant.status)}
                        <span className="text-xs text-gray-500">
                          {new Date(participant.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reports */}
          {conversation.reports.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Flag className="h-5 w-5" />
                  Reports ({conversation.reports.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversation.reports.map((report) => (
                    <div key={report.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{report.reporterName}</span>
                        <Badge variant="destructive" className="text-xs">
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{report.reason}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Moderation Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Moderation Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversation.status === 'SCHEDULED' && (
                <>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => handleModerationAction('cancel')}
                    disabled={actionLoading}
                  >
                    <X className="w-4 h-4 mr-2" />Cancel Conversation
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => handleModerationAction('suspend-host')}
                    disabled={actionLoading}
                  >
                    <UserX className="w-4 h-4 mr-2" />Suspend Host
                  </Button>
                </>
              )}
              
              <Button variant="outline" className="w-full">
                <Flag className="w-4 h-4 mr-2" />Flag for Review
              </Button>
              
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />Contact Host
              </Button>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{new Date(conversation.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span>{new Date(conversation.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conversation ID:</span>
                <span className="font-mono text-xs">{conversation.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
