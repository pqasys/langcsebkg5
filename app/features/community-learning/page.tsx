'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useSubscription } from '@/hooks/useSubscription'
import { useConnectionAuth } from '@/hooks/useConnectionAuth'
import { ConnectionRequestDialog } from '@/components/ConnectionRequestDialog'
import { ConnectionIncentivesDisplay } from '@/components/ConnectionIncentivesDisplay'
import { 
  Trophy, 
  Star, 
  Heart, 
  Share2, 
  Users, 
  TrendingUp,
  Globe,
  Award,
  Calendar,
  MessageCircle,
  Plus,
  Filter,
  MapPin, 
  Languages, 
  UserPlus, 
  Shield, 
  Settings,
  Search,
  GraduationCap,
  CheckCircle,
  Crown,
  BookOpen
} from 'lucide-react'
import { toast } from 'sonner'

interface Announcement {
  id: string;
  title: string;
  message: string;
  language: string;
  cefrLevel: string;
  likes: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  certificateId?: string;
}

export default function CommunityLearningFeaturePage() {
  const { data: session } = useSession()
  const { 
    userType,
    canAccessLiveClasses,
    canAccessPlatformContent,
    canAccessInstitutionContent,
    canAccessPremiumFeatures,
    hasActiveSubscription,
    currentPlan,
    institutionEnrollment,
    loading: subscriptionLoading 
  } = useSubscription()

  // Community announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [filters, setFilters] = useState({
    language: 'all',
    level: 'all'
  })
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    language: 'en',
    cefrLevel: 'A1'
  })
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalCertificates: 0,
    totalAchievements: 0,
    activeToday: 0
  })

  // Placeholder visible profiles data
  const visibleProfiles = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: '/api/placeholder/60/60',
      location: 'Toronto, Canada',
      languages: ['English', 'Mandarin', 'Spanish'],
      level: 'B2',
      interests: ['Travel', 'Cooking', 'Photography'],
      isOnline: true,
      lastActive: '2 minutes ago',
      mutualConnections: 3,
      achievements: 12
    },
    {
      id: '2',
      name: 'Miguel Rodriguez',
      avatar: '/api/placeholder/60/60',
      location: 'Madrid, Spain',
      languages: ['Spanish', 'English', 'French'],
      level: 'C1',
      interests: ['Music', 'Sports', 'Technology'],
      isOnline: false,
      lastActive: '1 hour ago',
      mutualConnections: 1,
      achievements: 8
    },
    {
      id: '3',
      name: 'Emma Thompson',
      avatar: '/api/placeholder/60/60',
      location: 'London, UK',
      languages: ['English', 'German', 'Italian'],
      level: 'B1',
      interests: ['Reading', 'Hiking', 'Art'],
      isOnline: true,
      lastActive: '5 minutes ago',
      mutualConnections: 5,
      achievements: 15
    },
    {
      id: '4',
      name: 'Yuki Tanaka',
      avatar: '/api/placeholder/60/60',
      location: 'Tokyo, Japan',
      languages: ['Japanese', 'English', 'Korean'],
      level: 'A2',
      interests: ['Anime', 'Gaming', 'Cooking'],
      isOnline: false,
      lastActive: '3 hours ago',
      mutualConnections: 2,
      achievements: 6
    },
    {
      id: '5',
      name: 'Carlos Silva',
      avatar: '/api/placeholder/60/60',
      location: 'São Paulo, Brazil',
      languages: ['Portuguese', 'English', 'Spanish'],
      level: 'B2',
      interests: ['Soccer', 'Cooking', 'Travel'],
      isOnline: true,
      lastActive: '1 minute ago',
      mutualConnections: 4,
      achievements: 10
    }
  ]

  const { authenticateForConnection, executePendingConnection, pendingConnectionRequest } = useConnectionAuth()

  const handleConnectRequest = async (profileId: string) => {
    try {
      const result = await authenticateForConnection(profileId)
      
      if (result.success) {
        // User is authenticated, send connection request
        const response = await fetch('/api/connections/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receiverId: profileId,
            message: 'Would like to connect with you on FluentShip!'
          }),
        })

        if (response.ok) {
          toast.success('Connection request sent!')
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to send connection request')
        }
      } else if (result.requiresAuth) {
        // User will be redirected to login, show message
        toast.info('Please sign in to send connection requests')
      }
    } catch (error) {
      console.error('Error sending connection request:', error)
      toast.error('Failed to send connection request')
    }
  }

  const fetchAnnouncements = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filters.language && filters.language !== 'all') params.append('language', filters.language)
      if (filters.level && filters.level !== 'all') params.append('level', filters.level)
      
      const response = await fetch(`/api/community/announcements?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setAnnouncements(data.data || [])
      } else {
        console.error('API returned error:', data.error)
        setAnnouncements([])
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
      toast.error('Failed to load community updates')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/community/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
        
        // Log metadata for debugging (only in development)
        if (process.env.NODE_ENV === 'development' && data.data.metadata) {
          console.log('Community Stats Metadata:', data.data.metadata)
        }
      } else {
        console.error('Failed to fetch community stats:', data.error)
        // Fallback to default stats on error
        setStats({
          totalMembers: 1247,
          totalCertificates: 3421,
          totalAchievements: 1893,
          activeToday: 156
        })
      }
    } catch (error) {
      console.error('Error fetching community stats:', error)
      // Fallback to default stats on error
      setStats({
        totalMembers: 1247,
        totalCertificates: 3421,
        totalAchievements: 1893,
        activeToday: 156
      })
    }
  }, [])

  useEffect(() => {
    fetchAnnouncements()
    fetchStats()
  }, [fetchAnnouncements, fetchStats])

  // Execute pending connection request after authentication
  useEffect(() => {
    if (pendingConnectionRequest && session?.user) {
      executePendingConnection().then((result) => {
        if (result.success) {
          toast.success('Connection request sent!')
        } else if (result.error) {
          toast.error(result.error)
        }
      })
    }
  }, [pendingConnectionRequest, session?.user, executePendingConnection])

  const handleLike = async (announcementId: string) => {
    try {
      const response = await fetch(`/api/community/announcements/${announcementId}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
        // Update local state
        setAnnouncements(prev => prev.map(announcement => 
          announcement.id === announcementId 
            ? { ...announcement, likes: announcement.likes + 1 }
            : announcement
        ))
        toast.success('Liked!')
      }
    } catch (error) {
      console.error('Error liking announcement:', error)
      toast.error('Failed to like announcement')
    }
  }

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.message || !newAnnouncement.language || !newAnnouncement.cefrLevel) {
      toast.error('Please fill in all fields')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/community/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Achievement shared with community!')
        setShowCreateDialog(false)
        setNewAnnouncement({ title: '', message: '', language: 'en', cefrLevel: 'A1' })
        fetchAnnouncements() // Refresh the list
      } else {
        toast.error(data.error || 'Failed to share achievement')
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      toast.error('Failed to share achievement')
    } finally {
      setCreating(false)
    }
  }

  const getLanguageFlag = (language: string) => {
    const flags: { [key: string]: string } = {
      'en': '🇺🇸',
      'fr': '🇫🇷',
      'es': '🇪🇸',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹',
      'ru': '🇷🇺',
      'zh': '🇨🇳',
      'ja': '🇯🇵',
      'ko': '🇰🇷'
    }
    return flags[language] || '🌍'
  }

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'A1': 'bg-gray-100 text-gray-800',
      'A2': 'bg-blue-100 text-blue-800',
      'B1': 'bg-green-100 text-green-800',
      'B2': 'bg-yellow-100 text-yellow-800',
      'C1': 'bg-orange-100 text-orange-800',
      'C2': 'bg-purple-100 text-purple-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">FluentShip Community</h1>
            <p className="text-xl text-blue-100 mb-6">
              Celebrate language learning achievements and connect with fellow learners
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#social-benefits">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Users className="h-4 w-4 mr-2" />
                  Social Learning Benefits
                </Button>
              </Link>
              <Link href="#connection-incentives">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Trophy className="h-4 w-4 mr-2" />
                  Connection Incentives
                </Button>
              </Link>
              <Link href="#live-conversations">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Conversations
                </Button>
              </Link>
              <Link href="#success-stories">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Star className="h-4 w-4 mr-2" />
                  Success Stories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{stats.totalMembers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Community Members</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{stats.totalCertificates.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Certificates Earned</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">{stats.totalAchievements.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Achievements Unlocked</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{stats.activeToday}</div>
              <div className="text-sm text-gray-600">Active Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Social Learning Benefits Section */}
        <section id="social-benefits" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Social Learning Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with fellow learners and unlock powerful social learning features that make language learning more effective and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Users,
                title: 'Community Circles',
                description: 'Join language-specific study groups',
                benefit: 'Practice with peers at your level',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                features: [
                  'Language-specific study groups',
                  'Peer-to-peer learning',
                  'Structured practice sessions',
                  'Progress tracking with group'
                ]
              },
              {
                icon: MessageCircle,
                title: 'Live Conversations',
                description: 'Practice with native speakers and peers',
                benefit: 'Real-time speaking practice',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                features: [
                  'Native speaker conversations',
                  'Real-time video practice',
                  'Cultural context learning',
                  'Pronunciation feedback'
                ]
              },
              {
                icon: Trophy,
                title: 'Achievement Sharing',
                description: 'Public profile visibility for accomplishments',
                benefit: 'Showcase your progress',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                features: [
                  'Public achievement badges',
                  'Progress milestones',
                  'Social recognition',
                  'Motivation through sharing'
                ]
              },
              {
                icon: Heart,
                title: 'Peer Support',
                description: 'Connect with learners at similar levels',
                benefit: 'Motivation and accountability',
                color: 'text-pink-600',
                bgColor: 'bg-pink-50',
                features: [
                  'Study partner matching',
                  'Mutual encouragement',
                  'Shared learning goals',
                  'Accountability partners'
                ]
              }
            ].map((benefit, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className={`${benefit.bgColor} rounded-t-lg`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-white ${benefit.color}`}>
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{benefit.title}</CardTitle>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-4">
                    {benefit.benefit}
                  </Badge>
                  <ul className="space-y-2">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Learning Enhancement Benefits */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learning Enhancement
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take your learning to the next level with advanced features designed to accelerate your progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Users,
                title: 'Study Partners',
                description: 'Find compatible learning partners',
                benefit: 'Collaborative learning experience',
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                features: [
                  'AI-powered matching',
                  'Compatibility assessment',
                  'Learning style alignment',
                  'Schedule coordination'
                ]
              },
              {
                icon: Globe,
                title: 'Cultural Exchange',
                description: 'Connect with native speakers for authentic practice',
                benefit: 'Learn cultural nuances',
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50',
                features: [
                  'Native speaker connections',
                  'Cultural context learning',
                  'Authentic language use',
                  'Cultural insights sharing'
                ]
              },
              {
                icon: Crown,
                title: 'Mentorship',
                description: 'Connect with advanced learners for guidance',
                benefit: 'Accelerate your learning',
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                features: [
                  'Advanced learner guidance',
                  'Learning path optimization',
                  'Study technique sharing',
                  'Progress acceleration'
                ]
              },
              {
                icon: BookOpen,
                title: 'Group Activities',
                description: 'Participate in collaborative learning',
                benefit: 'Enhanced engagement',
                color: 'text-teal-600',
                bgColor: 'bg-teal-50',
                features: [
                  'Collaborative projects',
                  'Group discussions',
                  'Shared learning resources',
                  'Team-based challenges'
                ]
              }
            ].map((benefit, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className={`${benefit.bgColor} rounded-t-lg`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-white ${benefit.color}`}>
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{benefit.title}</CardTitle>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-4">
                    {benefit.benefit}
                  </Badge>
                  <ul className="space-y-2">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

                 {/* Main Content with Right Sidebar */}
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8 h-fit">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters and Create Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={filters.language} onValueChange={(value) => setFilters(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="A1">A1</SelectItem>
                    <SelectItem value="A2">A2</SelectItem>
                    <SelectItem value="B1">B1</SelectItem>
                    <SelectItem value="B2">B2</SelectItem>
                    <SelectItem value="C1">C1</SelectItem>
                    <SelectItem value="C2">C2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {session?.user && (
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Share Achievement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share Your Achievement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          placeholder="e.g., Passed B2 Spanish Test!"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Message</label>
                        <Textarea
                          placeholder="Share your learning journey..."
                          value={newAnnouncement.message}
                          onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Language</label>
                          <Select value={newAnnouncement.language} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, language: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="it">Italian</SelectItem>
                              <SelectItem value="pt">Portuguese</SelectItem>
                              <SelectItem value="ru">Russian</SelectItem>
                              <SelectItem value="zh">Chinese</SelectItem>
                              <SelectItem value="ja">Japanese</SelectItem>
                              <SelectItem value="ko">Korean</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">CEFR Level</label>
                          <Select value={newAnnouncement.cefrLevel} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, cefrLevel: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A1">A1</SelectItem>
                              <SelectItem value="A2">A2</SelectItem>
                              <SelectItem value="B1">B1</SelectItem>
                              <SelectItem value="B2">B2</SelectItem>
                              <SelectItem value="C1">C1</SelectItem>
                              <SelectItem value="C2">C2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateAnnouncement} disabled={creating}>
                          {creating ? 'Sharing...' : 'Share'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Recent Achievements */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
                Recent Achievements
              </h2>
              
              <div className="grid gap-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={announcement.user.image} />
                          <AvatarFallback>
                            {announcement.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold">{announcement.user.name}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-500">
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                          <p className="text-gray-600 mb-4">{announcement.message}</p>
                          
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{getLanguageFlag(announcement.language)}</span>
                              <span className="font-medium">{announcement.language.toUpperCase()}</span>
                            </div>
                            
                            <Badge className={getLevelColor(announcement.cefrLevel)}>
                              {announcement.cefrLevel}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(announcement.id)}
                                className="flex items-center space-x-1"
                              >
                                <Heart className="h-4 w-4" />
                                <span>{announcement.likes}</span>
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-1"
                              >
                                <MessageCircle className="h-4 w-4" />
                                <span>Comment</span>
                              </Button>
                            </div>
                            
                            {session?.user?.id === announcement.user.id && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center space-x-1"
                              >
                                <Share2 className="h-4 w-4" />
                                <span>Edit</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {announcements.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Globe className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
                    <p className="text-gray-600 mb-4">
                      Be the first to share your language learning achievements!
                    </p>
                    <Button onClick={() => window.location.href = '/language-proficiency-test'}>
                      Take Your First Test
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Connection Incentives Section */}
            <section id="connection-incentives" className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Connection Incentives
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get rewarded for building connections and participating in the community. 
                  Earn points, unlock achievements, and redeem valuable rewards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: 'Sparkles',
                    title: 'Points System',
                    description: 'Earn points for every connection activity',
                    rewards: [
                      'Send connection request: +5 points',
                      'Accept connection: +10 points',
                      'Complete study session: +25 points',
                      'Share achievement: +15 points',
                      'Participate in circle: +20 points',
                      'Help other learner: +30 points',
                      'Create study group: +50 points',
                      'Refer new user: +100 points'
                    ]
                  },
                  {
                    icon: 'Trophy',
                    title: 'Achievement Badges',
                    description: 'Unlock special badges for your accomplishments',
                    rewards: [
                      '🦋 Social Butterfly: First connection',
                      '🌐 Network Builder: 10+ connections',
                      '👥 Study Buddy: 5 study sessions',
                      '🎓 Language Mentor: Help 3+ learners',
                      '🏛️ Cultural Ambassador: Share cultural insights'
                    ]
                  },
                  {
                    icon: 'Gift',
                    title: 'Reward Redemption',
                    description: 'Redeem points for valuable rewards',
                    rewards: [
                      '100 points: Free 1-week premium trial',
                      '250 points: 50% off next month subscription',
                      '500 points: Free live conversation session',
                      '1000 points: Free certificate test',
                      '2000 points: Free 1-month premium subscription'
                    ]
                  }
                ].map((incentive, index) => (
                  <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-4 rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center">
                        {incentive.icon === 'Sparkles' && <div className="text-2xl">✨</div>}
                        {incentive.icon === 'Trophy' && <Trophy className="h-8 w-8 text-blue-600" />}
                        {incentive.icon === 'Gift' && <div className="text-2xl">🎁</div>}
                      </div>
                      <CardTitle className="text-xl">{incentive.title}</CardTitle>
                      <p className="text-gray-600">{incentive.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {incentive.rewards.map((reward, rewardIndex) => (
                          <li key={rewardIndex} className="flex items-center gap-2 text-sm text-gray-700">
                            <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            {reward}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recently Created Circles */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                Recently Created Circles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: '1',
                    name: 'Spanish Conversation Circle',
                    language: 'Spanish',
                    level: 'B1-B2',
                    members: 12,
                    maxMembers: 20,
                    description: 'Practice Spanish conversation with native speakers and fellow learners',
                    createdBy: 'Maria Rodriguez',
                    createdAt: '2 days ago',
                    isPublic: true
                  },
                  {
                    id: '2',
                    name: 'German Grammar Study Group',
                    language: 'German',
                    level: 'A2-B1',
                    members: 8,
                    maxMembers: 15,
                    description: 'Focus on German grammar rules and sentence structure',
                    createdBy: 'Hans Mueller',
                    createdAt: '3 days ago',
                    isPublic: true
                  },
                  {
                    id: '3',
                    name: 'French Literature Club',
                    language: 'French',
                    level: 'C1-C2',
                    members: 6,
                    maxMembers: 12,
                    description: 'Read and discuss French literature and poetry',
                    createdBy: 'Sophie Dubois',
                    createdAt: '5 days ago',
                    isPublic: false
                  }
                ].map((circle) => (
                  <Card key={circle.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{circle.name}</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {circle.language}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {circle.level}
                            </Badge>
                            {!circle.isPublic && (
                              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                Private
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {circle.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{circle.members}/{circle.maxMembers} members</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Created {circle.createdAt}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          by {circle.createdBy}
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          Join Circle
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => window.location.href = '/community/circles'}>
                  <Users className="h-4 w-4 mr-2" />
                  View All Circles
                </Button>
              </div>
            </div>

            {/* Recently Created Clubs */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-green-600" />
                Recently Created Clubs
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: '1',
                    name: 'Japanese Culture Night',
                    language: 'Japanese',
                    level: 'All Levels',
                    attendees: 25,
                    maxAttendees: 50,
                    description: 'Learn about Japanese culture, traditions, and language through interactive activities',
                    organizer: 'Yuki Tanaka',
                    date: '2024-01-25T19:00:00Z',
                    location: 'Virtual',
                    isFree: true
                  },
                  {
                    id: '2',
                    name: 'Italian Cooking Workshop',
                    language: 'Italian',
                    level: 'A2-C1',
                    attendees: 18,
                    maxAttendees: 30,
                    description: 'Learn to cook authentic Italian dishes while practicing Italian vocabulary',
                    organizer: 'Marco Rossi',
                    date: '2024-01-28T18:00:00Z',
                    location: 'Virtual',
                    isFree: false
                  },
                  {
                    id: '3',
                    name: 'English Debate Club',
                    language: 'English',
                    level: 'B2-C2',
                    attendees: 15,
                    maxAttendees: 25,
                    description: 'Practice English through structured debates on current topics',
                    organizer: 'Sarah Johnson',
                    date: '2024-01-30T20:00:00Z',
                    location: 'Virtual',
                    isFree: true
                  }
                ].map((club) => (
                  <Card key={club.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{club.name}</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {club.language}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {club.level}
                            </Badge>
                            {club.isFree ? (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                Free
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                Paid
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {club.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{new Date(club.date).toLocaleDateString()} at {new Date(club.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{club.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{club.attendees}/{club.maxAttendees} attending</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          by {club.organizer}
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          RSVP
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => window.location.href = '/community/clubs'}>
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Clubs
                </Button>
              </div>
            </div>

            {/* Call to Action */}
             {session?.user && (
               <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                 <CardContent className="p-8 text-center">
                   <h3 className="text-xl font-semibold mb-2">Share Your Achievement</h3>
                   <p className="text-gray-600 mb-4">
                     Have you earned a certificate? Share it with the community and inspire others!
                   </p>
                   <div className="flex justify-center space-x-4">
                     <Button onClick={() => window.location.href = '/language-proficiency-test'}>
                       Take a Test
                     </Button>
                     <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
                       Share Achievement
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             )}

             {/* Success Stories */}
             <section id="success-stories" className="pt-8 pb-16 bg-gray-50 -mx-6 px-6">
               <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                   Success Stories
                 </h2>
                 <p className="text-xl text-gray-600">
                   Real learners who achieved their goals through community learning
                 </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <Card className="hover:shadow-lg transition-shadow duration-300">
                   <CardContent className="p-6">
                     <div className="flex items-center mb-4">
                       <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                         <Users className="w-8 h-8 text-gray-600" />
                       </div>
                       <div>
                         <h3 className="font-semibold text-gray-900">Emma Thompson</h3>
                         <p className="text-sm text-gray-600">Canada</p>
                         <p className="text-sm text-blue-600 font-medium">Spanish</p>
                       </div>
                     </div>
                     
                     <p className="text-gray-600 mb-4 italic">
                       "I joined the Spanish study group 6 months ago and made friends from 5 different countries. We practice together weekly and I can now confidently speak Spanish!"
                     </p>
                     
                     <div className="flex justify-between items-center">
                       <div className="text-sm">
                         <span className="font-semibold text-blue-600">A1 to B2</span>
                         <span className="text-gray-500"> in 6 months</span>
                       </div>
                       <div className="flex">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className="w-4 h-4 text-yellow-400" />
                         ))}
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 <Card className="hover:shadow-lg transition-shadow duration-300">
                   <CardContent className="p-6">
                     <div className="flex items-center mb-4">
                       <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                         <Users className="w-8 h-8 text-gray-600" />
                       </div>
                       <div>
                         <h3 className="font-semibold text-gray-900">Ahmed Hassan</h3>
                         <p className="text-sm text-gray-600">Egypt</p>
                         <p className="text-sm text-blue-600 font-medium">German</p>
                       </div>
                     </div>
                     
                     <p className="text-gray-600 mb-4 italic">
                       "The German professional community helped me prepare for job interviews. I landed my dream job in Berlin!"
                     </p>
                     
                     <div className="flex justify-between items-center">
                       <div className="text-sm">
                         <span className="font-semibold text-blue-600">B1 to C1</span>
                         <span className="text-gray-500"> in 8 months</span>
                       </div>
                       <div className="flex">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className="w-4 h-4 text-yellow-400" />
                         ))}
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 <Card className="hover:shadow-lg transition-shadow duration-300">
                   <CardContent className="p-6">
                     <div className="flex items-center mb-4">
                       <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                         <Users className="w-8 h-8 text-gray-600" />
                       </div>
                       <div>
                         <h3 className="font-semibold text-gray-900">Yuki Tanaka</h3>
                         <p className="text-sm text-gray-600">Japan</p>
                         <p className="text-sm text-blue-600 font-medium">English</p>
                       </div>
                     </div>
                     
                     <p className="text-gray-600 mb-4 italic">
                       "Through the English conversation group, I improved my speaking skills and gained confidence. Now I can travel anywhere!"
                     </p>
                     
                     <div className="flex justify-between items-center">
                       <div className="text-sm">
                         <span className="font-semibold text-blue-600">B2 to C2</span>
                         <span className="text-gray-500"> in 4 months</span>
                       </div>
                       <div className="flex">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className="w-4 h-4 text-yellow-400" />
                         ))}
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </section>

             {/* Benefits */}
             <section className="py-16 bg-white -mx-6 px-6">
               <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                   Why Join Communities?
                 </h2>
                 <p className="text-xl text-gray-600">
                   Learn faster and make lasting friendships through community learning
                 </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="text-center">
                   <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Users className="w-8 h-8 text-blue-600" />
                   </div>
                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
                     Make Friends
                   </h3>
                   <p className="text-gray-600">
                     Connect with learners from around the world and build lasting friendships
                   </p>
                 </div>
                 
                 <div className="text-center">
                   <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <GraduationCap className="w-8 h-8 text-blue-600" />
                   </div>
                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
                     Learn Together
                   </h3>
                   <p className="text-gray-600">
                     Share resources, practice together, and motivate each other to succeed
                   </p>
                 </div>
                 
                 <div className="text-center">
                   <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Award className="w-8 h-8 text-purple-600" />
                   </div>
                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
                     Cultural Exchange
                   </h3>
                   <p className="text-gray-600">
                     Learn about different cultures while improving your language skills
                   </p>
                 </div>
               </div>
             </section>

             {/* Live Conversations Section */}
             <section id="live-conversations" className="py-16 bg-white -mx-6 px-6">
               <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                   Live Conversation Sessions
                 </h2>
                 <p className="text-xl text-gray-600">
                   Practice with native speakers and expert tutors in real-time
                 </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <Card className="hover:shadow-lg transition-shadow duration-300">
                   <CardContent className="p-6 text-center">
                     <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Users className="w-8 h-8 text-blue-600" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-2">
                       Group Sessions
                     </h3>
                     <p className="text-gray-600 mb-4">
                       Join small group conversations with 3-6 learners and a native speaker tutor
                     </p>
                     <div className="space-y-2 text-sm text-gray-600">
                       <div className="flex items-center justify-center">
                         <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                         <span>45-minute sessions</span>
                       </div>
                       <div className="flex items-center justify-center">
                         <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                         <span>All skill levels</span>
                       </div>
                       <div className="flex items-center justify-center">
                         <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                         <span>Topic-based discussions</span>
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 <Card className="hover:shadow-lg transition-shadow duration-300">
                   <CardContent className="p-6 text-center">
                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <MessageCircle className="w-8 h-8 text-green-600" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-2">
                       One-on-One Tutoring
                     </h3>
                     <p className="text-gray-600 mb-4">
                       Personalized sessions with certified language tutors and native speakers
                     </p>
                     <div className="space-y-2 text-sm text-gray-600">
                       <div className="flex items-center justify-center">
                         <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                         <span>30-60 minute sessions</span>
                       </div>
                       <div className="flex items-center justify-center">
                         <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                         <span>Customized curriculum</span>
                       </div>
                       <div className="flex items-center justify-center">
                         <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                         <span>Progress tracking</span>
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 <Card className="hover:shadow-lg transition-shadow duration-300">
                   <CardContent className="p-6 text-center">
                     <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Calendar className="w-8 h-8 text-purple-600" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-2">
                       Cultural Events
                     </h3>
                     <p className="text-gray-600 mb-4">
                       Special events, cultural celebrations, and themed conversation nights
                     </p>
                     <div className="space-y-2 text-sm text-gray-600">
                       <div className="flex items-center justify-center">
                         <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                         <span>Monthly events</span>
                       </div>
                       <div className="flex items-center justify-center">
                         <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                         <span>Cultural immersion</span>
                       </div>
                       <div className="flex items-center justify-center">
                         <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                         <span>Interactive activities</span>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </section>

             {/* Lecturers/Tutors/Organisers Section */}
             <section className="py-16 bg-gray-50 -mx-6 px-6">
               <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                   Expert Tutors & Community Organizers
                 </h2>
                 <p className="text-xl text-gray-600">
                   Learn from certified language professionals and passionate community leaders
                 </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <Card className="hover:shadow-lg transition-shadow duration-300">
                   <CardContent className="p-6 text-center">
                     <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Users className="w-10 h-10 text-blue-600" />
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
                       Native Speakers
                     </h3>
                     <p className="text-sm text-gray-600 mb-3">
                       Certified native speakers from around the world
                     </p>
                     <div className="text-xs text-gray-500">
                       <div>• Authentic pronunciation</div>
                       <div>• Cultural insights</div>
                       <div>• Real-world expressions</div>
                     </div>
                   </CardContent>
                 </Card>

                 <Card className="hover:shadow-lg transition-shadow duration-300">
                   <CardContent className="p-6 text-center">
                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <GraduationCap className="w-10 h-10 text-green-600" />
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
                       Certified Tutors
                     </h3>
                     <p className="text-sm text-gray-600 mb-3">
                       Professional language teachers with certifications
                     </p>
                     <div className="text-xs text-gray-500">
                       <div>• CELTA/DELTA certified</div>
                       <div>• Structured learning</div>
                       <div>• Progress assessment</div>
                     </div>
                   </CardContent>
                 </Card>

                 <Card className="hover:shadow-lg transition-shadow duration-300">
                   <CardContent className="p-6 text-center">
                     <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Award className="w-10 h-10 text-purple-600" />
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
                       Community Leaders
                     </h3>
                     <p className="text-sm text-gray-600 mb-3">
                       Passionate organizers who create engaging experiences
                     </p>
                     <div className="text-xs text-gray-500">
                       <div>• Event planning</div>
                       <div>• Group facilitation</div>
                       <div>• Cultural activities</div>
                     </div>
                   </CardContent>
                 </Card>

                 <Card className="hover:shadow-lg transition-shadow duration-300">
                   <CardContent className="p-6 text-center">
                     <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Star className="w-10 h-10 text-orange-600" />
                     </div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
                       Language Partners
                     </h3>
                     <p className="text-sm text-gray-600 mb-3">
                       Peer learners who help each other grow
                     </p>
                     <div className="text-xs text-gray-500">
                       <div>• Mutual support</div>
                       <div>• Practice buddies</div>
                       <div>• Friendship building</div>
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </section>

             {/* Stats */}
             <section className="py-16 bg-white -mx-6 px-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                 <div>
                   <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
                   <div className="text-gray-600">Active Communities</div>
                 </div>
                 <div>
                   <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">25+</div>
                   <div className="text-gray-600">Languages</div>
                 </div>
                 <div>
                   <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">10K+</div>
                   <div className="text-gray-600">Active Learners</div>
                 </div>
                 <div>
                   <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">50+</div>
                   <div className="text-gray-600">Countries</div>
                 </div>
               </div>
             </section>

             {/* CTA Section */}
             <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white -mx-6 px-6">
               <div className="max-w-4xl mx-auto text-center">
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">
                   Ready to Join the Community?
                 </h2>
                 <p className="text-xl text-blue-100 mb-8">
                   Start your language learning journey with friends from around the world
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Link href="/features/community-learning">
                     <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                       Join Free Community
                     </Button>
                   </Link>
                   <Link href="/">
                     <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg">
                       Back to Home
                     </Button>
                   </Link>
                 </div>
               </div>
             </section>
           </div>

                      {/* Right Sidebar - Visible Profiles */}
            <div className="lg:col-span-1">
              <div>
                               <Card className="mb-6 shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg font-bold text-gray-800">
                      <Users className="h-6 w-6 mr-3 text-blue-600" />
                      Community Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-6 font-medium">
                      Connect with language learners who have opted to make their profiles public
                    </p>
                    
                    <div className="space-y-3">
                      {visibleProfiles.map((profile) => (
                        <div key={profile.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 bg-gray-50/50">
                          <div className="relative">
                            <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                              <AvatarImage src={profile.avatar} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                {profile.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {profile.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-3 border-white rounded-full shadow-sm"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {profile.name}
                              </h4>
                              <Badge variant="secondary" className="text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200">
                                {profile.level}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-600 mb-1">
                              <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                              {profile.location}
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-600 mb-3">
                              <Languages className="h-3 w-3 mr-1 text-green-500" />
                              <span className="font-medium">{profile.languages.slice(0, 2).join(', ')}</span>
                              {profile.languages.length > 2 && <span className="text-gray-500"> +{profile.languages.length - 2}</span>}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-600">
                                <Users className="h-3 w-3 mr-1 text-purple-500" />
                                <span className="font-medium">{profile.mutualConnections} mutual</span>
                              </div>
                                                             <ConnectionRequestDialog
                                 targetUser={{
                                   id: profile.id,
                                   name: profile.name,
                                   level: profile.level,
                                   location: profile.location
                                 }}
                                 trigger={
                                   <Button 
                                     size="sm" 
                                     variant="default"
                                     className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                   >
                                     <UserPlus className="h-3 w-3 mr-1" />
                                     Connect
                                   </Button>
                                 }
                               />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-medium"
                        onClick={() => window.location.href = '/features/community-learning'}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Browse All Members
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Connection Incentives Display */}
                <ConnectionIncentivesDisplay />

               {/* Profile Visibility Opt-in */}
               {session?.user && (
                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center">
                       <Shield className="h-5 w-5 mr-2" />
                       Profile Visibility
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-gray-600 mb-4">
                       Make your profile visible to other learners and receive connection requests
                     </p>
                     <Button 
                       size="sm" 
                       className="w-full"
                       onClick={() => window.location.href = '/student/profile'}
                     >
                       <Settings className="h-4 w-4 mr-2" />
                       Manage Profile
                     </Button>
                   </CardContent>
                 </Card>
               )}
             </div>
           </div>
                  </div>
       </div>
     </div>
   ) 