'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useSubscription } from '@/hooks/useSubscription'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  Globe, 
  MessageCircle,
  Plus,
  Play,
  BookOpen,
  Heart,
  Share2,
  MapPin,
  Languages,
  GraduationCap,
  Video,
  Mic,
  Headphones,
  Users2,
  Clock4,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy
} from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface LiveConversation {
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
  culturalNotes?: string
  vocabularyList?: string[]
  grammarPoints?: string[]
  conversationPrompts?: string[]
  instructor?: {
    id: string
    name: string
    email: string
    image?: string
  }
  host: {
    id: string
    name: string
    email: string
    image?: string
  }
  participants: Array<{
    id: string
    user: {
      id: string
      name: string
      image?: string
    }
    joinedAt: string
    isInstructor: boolean
    isHost: boolean
    status: string
  }>
  _count: {
    participants: number
    bookings: number
  }
  isBooked?: boolean
  bookingStatus?: string
}

interface ConversationFilters {
  language: string
  level: string
  type: string
  isFree: string
  search: string
}

type UsageSummary = {
  group: number
  oneToOne: number
  minutes: number
  ent: { groupCap: number; oneToOneCap: number; minutesCap: number }
}

function LiveConversationsInner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isCalendarView = (searchParams?.get('view') || '').toLowerCase() === 'calendar'
  const { canAccessLiveClasses } = useSubscription()
  const [conversations, setConversations] = useState<LiveConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState<string | null>(null)
  const [usageSummary, setUsageSummary] = useState<UsageSummary | null>(null)
  const [filters, setFilters] = useState<ConversationFilters>({
    language: 'all',
    level: 'all',
    type: 'all',
    isFree: 'all',
    search: ''
  })

  const languages = [
    { code: 'all', name: 'All Languages', flag: '🌍' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' }
  ]

  const levels = [
    { code: 'all', name: 'All Levels' },
    { code: 'CEFR_A1', name: 'Beginner (A1)' },
    { code: 'CEFR_A2', name: 'Elementary (A2)' },
    { code: 'CEFR_B1', name: 'Intermediate (B1)' },
    { code: 'CEFR_B2', name: 'Upper Intermediate (B2)' },
    { code: 'CEFR_C1', name: 'Advanced (C1)' },
    { code: 'CEFR_C2', name: 'Proficient (C2)' }
  ]

  const conversationTypes = [
    { code: 'all', name: 'All Types' },
    { code: 'GROUP', name: 'Group Practice' },
    { code: 'PRIVATE', name: 'Private Session' },
    { code: 'PRACTICE', name: 'Practice Session' },
    { code: 'CULTURAL', name: 'Cultural Exchange' }
  ]

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConversations()
      fetchUsage()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status, filters])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.language !== 'all') params.append('language', filters.language)
      if (filters.level !== 'all') params.append('level', filters.level)
      if (filters.type !== 'all') params.append('type', filters.type)
      if (filters.isFree !== 'all') params.append('isFree', filters.isFree)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/live-conversations?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setConversations(data.conversations)
      } else {
        toast.error('Failed to fetch conversations')
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      toast.error('Failed to fetch conversations')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/live-conversations/usage')
      if (!res.ok) return
      const data = await res.json()
      setUsageSummary(data)
    } catch {}
  }

  const handleBookConversation = async (conversationId: string) => {
    if (!session?.user) {
      toast.error('Please sign in to book conversations')
      router.push('/auth/signin')
      return
    }

    try {
      setBookingLoading(conversationId)
      const response = await fetch(`/api/live-conversations/${conversationId}/join`, { method: 'POST' })

      const data = await response.json()

      if (data.success && data.videoSessionId) {
        toast.success('Opening session...')
        router.push(`/video-session/${data.videoSessionId}`)
        return
      } else {
        toast.error(data.error || 'Failed to book conversation')
      }
    } catch (error) {
      console.error('Error booking conversation:', error)
      toast.error('Failed to book conversation')
    } finally {
      setBookingLoading(null)
    }
  }

  const handleCancelBooking = async (conversationId: string) => {
    try {
      setBookingLoading(conversationId)
      const response = await fetch(`/api/live-conversations/${conversationId}/book`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Booking cancelled successfully')
        fetchConversations() // Refresh the list
      } else {
        toast.error(data.error || 'Failed to cancel booking')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Failed to cancel booking')
    } finally {
      setBookingLoading(null)
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getLanguageFlag = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode)
    return language?.flag || '🌍'
  }

  const getLevelColor = (level: string) => {
    const levelColors: Record<string, string> = {
      'CEFR_A1': 'bg-green-100 text-green-800',
      'CEFR_A2': 'bg-blue-100 text-blue-800',
      'CEFR_B1': 'bg-yellow-100 text-yellow-800',
      'CEFR_B2': 'bg-orange-100 text-orange-800',
      'CEFR_C1': 'bg-red-100 text-red-800',
      'CEFR_C2': 'bg-purple-100 text-purple-800',
    }
    return levelColors[level] || 'bg-gray-100 text-gray-800'
  }

  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      'GROUP': 'bg-blue-100 text-blue-800',
      'PRIVATE': 'bg-purple-100 text-purple-800',
      'PRACTICE': 'bg-green-100 text-green-800',
      'CULTURAL': 'bg-orange-100 text-orange-800',
    }
    return typeColors[type] || 'bg-gray-100 text-gray-800'
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Live Conversations
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Practice speaking with native speakers in real-time conversations. 
              Join our community of language learners and improve your speaking skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => router.push('/auth/signin')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign In to Join
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/features/live-conversations')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {status === 'authenticated' && usageSummary && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-800">
              Live Conversations this cycle — Group: {usageSummary.group}{usageSummary.ent.groupCap >= 0 ? ` / ${usageSummary.ent.groupCap}` : ''}, 1:1: {usageSummary.oneToOne}{usageSummary.ent.oneToOneCap >= 0 ? ` / ${usageSummary.ent.oneToOneCap}` : ''}, Minutes: {usageSummary.minutes}{usageSummary.ent.minutesCap > 0 ? ` / ${usageSummary.ent.minutesCap}` : ''}
            </AlertDescription>
          </Alert>
        </div>
      )}
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Live Conversations</h1>
              <p className="text-gray-600 mt-2">
                Practice speaking with native speakers and fellow learners
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/live-conversations/create')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </Button>
              <Button
                onClick={() => router.push('/live-conversations/my-bookings')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                My Bookings
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/achievements')}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Certificates
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(isCalendarView ? '/live-conversations' : '/live-conversations?view=calendar')}
              >
                {isCalendarView ? 'List View' : 'Calendar View'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.language} onValueChange={(value) => setFilters({ ...filters, language: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    <span className="mr-2">{language.flag}</span>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.level} onValueChange={(value) => setFilters({ ...filters, level: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.code} value={level.code}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {conversationTypes.map((type) => (
                  <SelectItem key={type.code} value={type.code}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.isFree} onValueChange={(value) => setFilters({ ...filters, isFree: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="true">Free Only</SelectItem>
                <SelectItem value="false">Paid Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or create a new conversation session.
            </p>
            <Button onClick={() => router.push('/live-conversations/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Conversation
            </Button>
          </div>
        ) : isCalendarView ? (
          // Calendar view: group sessions by date with simple day cards
          <div className="space-y-6">
            {Object.entries(
              conversations.reduce((acc: Record<string, LiveConversation[]>, conv) => {
                const d = new Date(conv.startTime)
                const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
                acc[key] = acc[key] || []
                acc[key].push(conv)
                return acc
              }, {})
            ).sort(([a],[b]) => (a > b ? 1 : -1)).map(([dateKey, items]) => (
              <div key={dateKey}>
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  {new Date(dateKey).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((conversation) => (
                    <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base line-clamp-2">{conversation.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-700 space-y-2">
                        <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{formatDateTime(conversation.startTime)}</div>
                        <div className="flex items-center"><Users className="w-4 h-4 mr-2" />{conversation.currentParticipants}/{conversation.maxParticipants}</div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1" onClick={() => handleBookConversation(conversation.id)}>
                            <Play className="w-4 h-4 mr-1" /> Join
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => router.push(`/live-conversations/${conversation.id}`)}>
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getLanguageFlag(conversation.language)}</span>
                        <Badge variant="outline" className={getLevelColor(conversation.level)}>
                          {conversation.level.replace('CEFR_', '')}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(conversation.conversationType)}>
                          {conversation.conversationType}
                        </Badge>
                      </div>
                      {usageSummary && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(() => {
                            const isOneToOne = (conversation.maxParticipants ?? 0) <= 2 || conversation.conversationType === 'PRIVATE'
                            if (isOneToOne) {
                              const cap = usageSummary.ent.oneToOneCap
                              const left = cap >= 0 ? Math.max(0, cap - usageSummary.oneToOne) : -1
                              return (
                                <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                                  {cap >= 0 ? `${left} 1:1 left this month` : '1:1 unlimited'}
                                </Badge>
                              )
                            } else {
                              const cap = usageSummary.ent.groupCap
                              const left = cap >= 0 ? Math.max(0, cap - usageSummary.group) : -1
                              return (
                                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                                  {cap >= 0 ? `${left} group left this month` : 'Group unlimited'}
                                </Badge>
                              )
                            }
                          })()}
                          {usageSummary.ent.minutesCap > 0 && (
                            <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                              {Math.max(0, usageSummary.ent.minutesCap - usageSummary.minutes)} min left
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardTitle className="text-lg">{conversation.title}</CardTitle>
                      {conversation.topic && (
                        <p className="text-sm text-gray-600 mt-1">{conversation.topic}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {conversation.isFree ? (
                        <Badge className="bg-green-100 text-green-800">Free</Badge>
                      ) : (
                        <div className="text-right">
                          <Badge className="bg-blue-100 text-blue-800">
                            ${conversation.price}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {conversation.description && (
                    <p className="text-sm text-gray-600">{conversation.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDateTime(conversation.startTime)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {conversation.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {conversation.currentParticipants}/{conversation.maxParticipants} participants
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      {conversation.instructor ? 'Instructor-led' : 'Peer-to-peer'}
                    </div>
                  </div>

                  {conversation.instructor && (
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {conversation.instructor.name}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {conversation.isBooked ? (
                      <>
                        <Button
                          className="flex-1"
                          onClick={() => router.push(`/live-conversations/${conversation.id}`)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Open Session
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleCancelBooking(conversation.id)}
                          disabled={bookingLoading === conversation.id}
                        >
                          {bookingLoading === conversation.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel Booking
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      (() => {
                        const isOneToOne = (conversation.maxParticipants ?? 0) <= 2 || conversation.conversationType === 'PRIVATE'
                        const cap = usageSummary ? (isOneToOne ? usageSummary.ent.oneToOneCap : usageSummary.ent.groupCap) : Infinity
                        const used = usageSummary ? (isOneToOne ? usageSummary.oneToOne : usageSummary.group) : 0
                        const left = cap >= 0 ? cap - used : Infinity
                        const minutesLeft = usageSummary?.ent.minutesCap ? (usageSummary.ent.minutesCap - usageSummary.minutes) : Infinity
                        const reached = (left <= 0) || (minutesLeft <= 0)

                        const btn = (
                          canAccessLiveClasses ? (
                            <Button
                              className="flex-1"
                              onClick={() => handleBookConversation(conversation.id)}
                              disabled={
                                bookingLoading === conversation.id ||
                                conversation.currentParticipants >= conversation.maxParticipants ||
                                reached
                              }
                            >
                              {bookingLoading === conversation.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : conversation.currentParticipants >= conversation.maxParticipants ? (
                                <>
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  Full
                                </>
                              ) : reached ? (
                                <>
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  Limit Reached
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Book Session
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              className="flex-1"
                              onClick={() => router.push(`/subscription-signup?next=${encodeURIComponent(`/live-conversations/${conversation.id}/enter`)}&context=live-conversations`)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Trial to Join
                            </Button>
                          )
                        )

                        if (reached) {
                          const reason = (() => {
                            if (left <= 0) return isOneToOne ? 'You have used all your 1:1 sessions this month.' : 'You have used all your group sessions this month.'
                            if (minutesLeft <= 0) return 'You have used all your fair‑use minutes this month.'
                            return 'Limit reached.'
                          })()
                          return (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  {btn}
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="max-w-xs text-sm">
                                    {reason}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )
                        }
                        return btn
                      })()
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/live-conversations/${conversation.id}`)}
                    >
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 

export default function LiveConversationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-gray-600">Loading...</p></div></div>}>
      <LiveConversationsInner />
    </Suspense>
  )
}