'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  RefreshCcw, 
  Calendar, 
  Users, 
  DollarSign, 
  Shield, 
  AlertTriangle, 
  Eye, 
  X, 
  Flag, 
  UserX,
  BarChart3,
  Filter,
  Search,
  Clock,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Ban
} from 'lucide-react'

interface AdminConversation {
  id: string
  title: string
  conversationType: string
  language: string
  level: string
  startTime: string
  duration: number
  maxParticipants: number
  currentParticipants: number
  price: number
  isFree: boolean
  status: string
  hostId: string
  hostName: string
  hostEmail: string
  isPublic: boolean
  reportCount: number
  lastReportedAt?: string
  createdAt: string
  updatedAt: string
}

interface ConversationStats {
  total: number
  active: number
  completed: number
  cancelled: number
  reported: number
  flagged: number
}

export default function AdminLiveConversationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<AdminConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<ConversationStats>({
    total: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    reported: 0,
    flagged: 0
  })
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [reportFilter, setReportFilter] = useState('all')
  
  // Moderation actions
  const [selectedConversations, setSelectedConversations] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin')
      return
    }
    loadData()
  }, [status, router])

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/live-conversations', { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        setItems(data.conversations)
        setStats(data.stats || {
          total: data.conversations.length,
          active: data.conversations.filter((c: any) => c.status === 'SCHEDULED').length,
          completed: data.conversations.filter((c: any) => c.status === 'COMPLETED').length,
          cancelled: data.conversations.filter((c: any) => c.status === 'CANCELLED').length,
          reported: data.conversations.filter((c: any) => c.reportCount > 0).length,
          flagged: data.conversations.filter((c: any) => c.reportCount >= 3).length
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleModerationAction = async (conversationId: string, action: string, reason?: string) => {
    try {
      const res = await fetch(`/api/admin/live-conversations/${conversationId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      
      if (res.ok) {
        await loadData()
        setSelectedConversations([])
      }
    } catch (error) {
      console.error('Moderation action failed:', error)
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedConversations.length === 0) return
    
    const reason = prompt(`Reason for ${bulkAction} action:`)
    if (!reason) return
    
    for (const conversationId of selectedConversations) {
      await handleModerationAction(conversationId, bulkAction, reason)
    }
  }

  const filteredConversations = items.filter(conversation => {
    const matchesSearch = conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.hostName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter
    const matchesLanguage = languageFilter === 'all' || conversation.language === languageFilter
    const matchesReport = reportFilter === 'all' || 
                         (reportFilter === 'reported' && conversation.reportCount > 0) ||
                         (reportFilter === 'flagged' && conversation.reportCount >= 3)
    
    return matchesSearch && matchesStatus && matchesLanguage && matchesReport
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'SCHEDULED': 'default',
      'ACTIVE': 'default',
      'COMPLETED': 'secondary',
      'CANCELLED': 'destructive'
    }
    return <Badge variant={variants[status] as any}>{status}</Badge>
  }

  const getReportBadge = (reportCount: number) => {
    if (reportCount === 0) return null
    if (reportCount >= 3) return <Badge variant="destructive"><Flag className="w-3 h-3 mr-1" />{reportCount} reports</Badge>
    return <Badge variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" />{reportCount} reports</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Conversations Management</h1>
          <p className="text-gray-600 mt-1">Monitor, moderate, and manage community-driven conversations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCcw className="w-4 h-4 mr-2" />Refresh
          </Button>
        </div>
      </div>

      {/* Admin Role Banner */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Admin Role:</strong> Monitor for safety, moderate inappropriate content, and ensure platform guidelines. 
          Community members create and host their own conversations.
        </AlertDescription>
      </Alert>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reported</p>
                <p className="text-2xl font-bold text-orange-600">{stats.reported}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
              </div>
              <Flag className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="conversations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="moderation">Moderation Queue</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search conversations or hosts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={languageFilter} onValueChange={setLanguageFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={reportFilter} onValueChange={setReportFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Reports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conversations</SelectItem>
                    <SelectItem value="reported">Reported</SelectItem>
                    <SelectItem value="flagged">Flagged (3+ reports)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedConversations.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-800">
                      {selectedConversations.length} conversation(s) selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Bulk action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cancel">Cancel Conversations</SelectItem>
                        <SelectItem value="flag">Flag for Review</SelectItem>
                        <SelectItem value="suspend-host">Suspend Hosts</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleBulkAction}
                      disabled={!bulkAction}
                    >
                      Apply
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedConversations([])}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conversations List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="text-sm text-gray-600">Loading conversations...</div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No conversations found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredConversations.map((conversation) => (
                <Card key={conversation.id} className={`relative ${
                  conversation.reportCount >= 3 ? 'border-red-300 bg-red-50' :
                  conversation.reportCount > 0 ? 'border-orange-300 bg-orange-50' : ''
                }`}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedConversations.includes(conversation.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedConversations([...selectedConversations, conversation.id])
                            } else {
                              setSelectedConversations(selectedConversations.filter(id => id !== conversation.id))
                            }
                          }}
                          className="rounded"
                        />
                        <CardTitle className="text-lg">{conversation.title}</CardTitle>
                        {getReportBadge(conversation.reportCount)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Host: {conversation.hostName}</span>
                        <span>•</span>
                        <span>{conversation.hostEmail}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => router.push(`/admin/live-conversations/${conversation.id}/view`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />View
                      </Button>
                      {conversation.status === 'SCHEDULED' && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleModerationAction(conversation.id, 'cancel')}
                        >
                          <X className="w-4 h-4 mr-1" />Cancel
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(conversation.startTime).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {conversation.duration} minutes
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {conversation.currentParticipants}/{conversation.maxParticipants} participants
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {conversation.isFree ? <Badge>Free</Badge> : `$${conversation.price}`}
                    </div>
                    <div className="flex items-center gap-2">
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
              ))}
            </div>
          )}
        </TabsContent>

        {/* Moderation Queue Tab */}
        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Moderation Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* High Priority - Flagged Conversations */}
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">🚨 High Priority - Flagged Conversations (3+ Reports)</h3>
                  <div className="space-y-2">
                    {filteredConversations
                      .filter(c => c.reportCount >= 3)
                      .map(conversation => (
                        <div key={conversation.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{conversation.title}</p>
                              <p className="text-sm text-gray-600">
                                Host: {conversation.hostName} • {conversation.reportCount} reports
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Review</Button>
                              <Button size="sm" variant="destructive">Cancel</Button>
                              <Button size="sm" variant="destructive">Suspend Host</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {filteredConversations.filter(c => c.reportCount >= 3).length === 0 && (
                      <p className="text-sm text-gray-600">No flagged conversations</p>
                    )}
                  </div>
                </div>

                {/* Medium Priority - Reported Conversations */}
                <div>
                  <h3 className="font-semibold text-orange-700 mb-2">⚠️ Medium Priority - Reported Conversations</h3>
                  <div className="space-y-2">
                    {filteredConversations
                      .filter(c => c.reportCount > 0 && c.reportCount < 3)
                      .map(conversation => (
                        <div key={conversation.id} className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{conversation.title}</p>
                              <p className="text-sm text-gray-600">
                                Host: {conversation.hostName} • {conversation.reportCount} reports
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Review</Button>
                              <Button size="sm" variant="destructive">Cancel</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {filteredConversations.filter(c => c.reportCount > 0 && c.reportCount < 3).length === 0 && (
                      <p className="text-sm text-gray-600">No reported conversations</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Conversation Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Moderation Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Moderation performance metrics coming soon...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


