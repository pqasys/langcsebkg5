'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSubscription } from '@/hooks/useSubscription'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Calendar, Clock, Users, AlertCircle, Play, Globe, GraduationCap, BookOpen } from 'lucide-react'

interface ConversationDetail {
  id: string
  title: string
  description?: string
  conversationType: string
  language: string
  level: string
  startTime: string
  endTime: string
  duration: number
  maxParticipants: number
  currentParticipants: number
  price: number
  isPublic: boolean
  isFree: boolean
  status: string
  topic?: string
  instructor?: { id: string; name: string }
  host: { id: string; name: string }
  _count: { participants: number; bookings: number }
}

export default function LiveConversationDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { canAccessLiveClasses } = useSubscription()
  const [conversation, setConversation] = useState<ConversationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [usageSummary, setUsageSummary] = useState<{ group: number; oneToOne: number; minutes: number; ent: { groupCap: number; oneToOneCap: number; minutesCap: number } } | null>(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/live-conversations/${params.id}`)
        const data = await res.json()
        if (data.success) setConversation(data.conversation)
        if (status === 'authenticated') {
          const u = await fetch('/api/live-conversations/usage')
          if (u.ok) setUsageSummary(await u.json())
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, status])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Conversation Not Found</h1>
          <Button onClick={() => router.push('/live-conversations')}>Back to Conversations</Button>
        </div>
      </div>
    )
  }

  const isOneToOne = (conversation.maxParticipants ?? 0) <= 2 || conversation.conversationType === 'PRIVATE'
  const cap = usageSummary ? (isOneToOne ? usageSummary.ent.oneToOneCap : usageSummary.ent.groupCap) : Infinity
  const used = usageSummary ? (isOneToOne ? usageSummary.oneToOne : usageSummary.group) : 0
  const left = cap >= 0 ? cap - used : Infinity
  const minutesLeft = usageSummary?.ent.minutesCap ? (usageSummary.ent.minutesCap - usageSummary.minutes) : Infinity
  const reached = (left <= 0) || (minutesLeft <= 0)

  const joinBtn = (
    canAccessLiveClasses ? (
      <Button
        onClick={async () => {
          setJoining(true)
          try {
            router.push(`/live-conversations/${conversation.id}/enter`)
            return
          } finally {
            setJoining(false)
          }
        }}
        disabled={joining}
      >
        <>
          <Play className="w-4 h-4 mr-2" />
          Join Session
        </>
      </Button>
    ) : (
      <Button
        onClick={() => router.push(`/subscription-signup?next=${encodeURIComponent(`/live-conversations/${conversation.id}/enter`)}&context=live-conversations`)}
      >
        <Play className="w-4 h-4 mr-2" />
        Start Trial to Join
      </Button>
    )
  )

  const legacyJoinBtn = (
    <Button
      onClick={async () => {
        setJoining(true)
        try {
          const res = await fetch(`/api/live-conversations/${conversation.id}/join`, { method: 'POST' })
          const data = await res.json()
          if (res.ok && data.success && data.videoSessionId) {
            router.push(`/video-session/${data.videoSessionId}`)
          } else {
            if (data?.redirectUrl) {
              // Use toast + CTA before redirect
              try { (await import('sonner')).toast?.info('This session requires an upgraded plan.', { action: { label: 'Upgrade', onClick: () => router.push(data.redirectUrl) } }) } catch {}
              router.push(data.redirectUrl)
              return
            }
            // Fallback: show reason inline if available and link to docs
            const reason = data?.error || 'Unable to book this session under your current plan.'
            try { (await import('sonner')).toast?.error(reason, { action: { label: 'Why?', onClick: () => router.push('/subscription-signup') } }) } catch {}
            alert(reason + '\nSee: Live Conversations access — subscription limits.')
          }
        } finally {
          setJoining(false)
        }
      }}
      disabled={joining || reached || conversation.currentParticipants >= conversation.maxParticipants}
    >
      {reached ? (
        <>
          <AlertCircle className="w-4 h-4 mr-2" />
          Limit Reached
        </>
      ) : conversation.currentParticipants >= conversation.maxParticipants ? (
        <>
          <AlertCircle className="w-4 h-4 mr-2" />
          Full
        </>
      ) : (
        <>
          <Play className="w-4 h-4 mr-2" />
          Join Session
        </>
      )}
    </Button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{conversation.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{conversation.level.replace('CEFR_', '')}</Badge>
              <Badge variant="outline">{conversation.conversationType}</Badge>
              {conversation.isFree ? (
                <Badge className="bg-green-100 text-green-800">Free</Badge>
              ) : (
                <Badge className="bg-blue-100 text-blue-800">${conversation.price}</Badge>
              )}
            </div>
            {conversation.description && <p className="text-gray-700">{conversation.description}</p>}
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{new Date(conversation.startTime).toLocaleString()}</div>
              <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{conversation.duration} minutes</div>
              <div className="flex items-center"><Users className="w-4 h-4 mr-2" />{conversation.currentParticipants}/{conversation.maxParticipants} participants</div>
              <div className="flex items-center"><Globe className="w-4 h-4 mr-2" />{conversation.instructor ? 'Instructor-led' : 'Peer-to-peer'}</div>
              {conversation.instructor && (
                <div className="flex items-center"><GraduationCap className="w-4 h-4 mr-2" />{conversation.instructor.name}</div>
              )}
            </div>

            {usageSummary && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  Group: {usageSummary.group}{usageSummary.ent.groupCap >= 0 ? ` / ${usageSummary.ent.groupCap}` : ''}, 1:1: {usageSummary.oneToOne}{usageSummary.ent.oneToOneCap >= 0 ? ` / ${usageSummary.ent.oneToOneCap}` : ''}, Minutes: {usageSummary.minutes}{usageSummary.ent.minutesCap > 0 ? ` / ${usageSummary.ent.minutesCap}` : ''}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              {reached ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {joinBtn}
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs text-sm">
                        {left <= 0 ? (isOneToOne ? 'You have used all your 1:1 sessions this month.' : 'You have used all your group sessions this month.') : 'You have used all your fair‑use minutes this month.'}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : joinBtn}
              <Button variant="outline" onClick={() => router.push('/live-conversations')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


