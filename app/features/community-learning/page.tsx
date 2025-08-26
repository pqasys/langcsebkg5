'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useSubscription } from '@/hooks/useSubscription'
import { CommunityFeaturesWrapper } from '@/components/CommunityFeaturesWrapper'
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
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Video,
  Target
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

interface Circle {
  id: string;
  name: string;
  slug: string;
  language: string;
  level: string;
  description: string;
  membersCount: number;
  isPublic: boolean;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    image?: string;
  };
}

export default function CommunityLearningFeaturePage() {
  const { data: session } = useSession()
  const { loading: subscriptionLoading } = useSubscription()
  const router = useRouter()

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [autoPlayProgress, setAutoPlayProgress] = useState(0)
  const [isCarouselTransition, setIsCarouselTransition] = useState(false)

  // Achievements carousel state
  const [currentAchievementSlide, setCurrentAchievementSlide] = useState(0)
  const [isAchievementTransitioning, setIsAchievementTransitioning] = useState(false)
  const [achievementAutoPlayProgress, setAchievementAutoPlayProgress] = useState(0)
  const [isAchievementCarouselTransition, setIsAchievementCarouselTransition] = useState(false)

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

  // Circles state
  const [circles, setCircles] = useState<Circle[]>([])
  const [circlesLoading, setCirclesLoading] = useState(true)
  const [showSubscriptionReminder, setShowSubscriptionReminder] = useState(false)
  const [joinedCircleName, setJoinedCircleName] = useState('')

  // Community members state
  const [communityMembers, setCommunityMembers] = useState<any[]>([])
  const [membersLoading, setMembersLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Placeholder profiles for fallback
  const placeholderProfiles = [
    {
      id: 'placeholder-1',
      name: 'Sarah Chen',
      avatar: '/api/placeholder/60/60',
      location: 'Toronto, Canada',
      languages: ['English', 'Mandarin', 'Spanish'],
      level: 'B2',
      interests: ['Travel', 'Cooking', 'Photography'],
      isOnline: true,
      lastActive: '2 minutes ago',
      mutualConnections: 3,
      achievements: 12,
      isPlaceholder: true
    },
    {
      id: 'placeholder-2',
      name: 'Miguel Rodriguez',
      avatar: '/api/placeholder/60/60',
      location: 'Madrid, Spain',
      languages: ['Spanish', 'English', 'French'],
      level: 'C1',
      interests: ['Music', 'Sports', 'Technology'],
      isOnline: false,
      lastActive: '1 hour ago',
      mutualConnections: 1,
      achievements: 8,
      isPlaceholder: true
    },
    {
      id: 'placeholder-3',
      name: 'Emma Thompson',
      avatar: '/api/placeholder/60/60',
      location: 'London, UK',
      languages: ['English', 'German', 'Italian'],
      level: 'B1',
      interests: ['Reading', 'Hiking', 'Art'],
      isOnline: true,
      lastActive: '5 minutes ago',
      mutualConnections: 5,
      achievements: 15,
      isPlaceholder: true
    },
    {
      id: 'placeholder-4',
      name: 'Yuki Tanaka',
      avatar: '/api/placeholder/60/60',
      location: 'Tokyo, Japan',
      languages: ['Japanese', 'English', 'Korean'],
      level: 'A2',
      interests: ['Anime', 'Gaming', 'Cooking'],
      isOnline: false,
      lastActive: '3 hours ago',
      mutualConnections: 2,
      achievements: 6,
      isPlaceholder: true
    }
  ]

  // Placeholder circles for fallback
  const placeholderCircles = [
    {
      id: 'placeholder-1',
      name: 'Spanish Conversation Circle',
      language: 'Spanish',
      level: 'B1-B2',
      membersCount: 12,
      maxMembers: 20,
      description: 'Practice Spanish conversation with native speakers and fellow learners',
      createdBy: 'Maria Rodriguez',
      createdAt: '2 days ago',
      isPublic: true,
      isPlaceholder: true
    },
    {
      id: 'placeholder-2',
      name: 'German Grammar Study Group',
      language: 'German',
      level: 'A2-B1',
      membersCount: 8,
      maxMembers: 15,
      description: 'Focus on German grammar rules and sentence structure',
      createdBy: 'Hans Mueller',
      createdAt: '3 days ago',
      isPublic: true,
      isPlaceholder: true
    },
    {
      id: 'placeholder-3',
      name: 'French Literature Club',
      language: 'French',
      level: 'C1-C2',
      membersCount: 6,
      maxMembers: 12,
      description: 'Read and discuss French literature and poetry',
      createdBy: 'Sophie Dubois',
      createdAt: '5 days ago',
      isPublic: false,
      isPlaceholder: true
    }
  ]

  const fetchCircles = useCallback(async () => {
    try {
      setCirclesLoading(true)
      const response = await fetch('/api/community/circles?limit=10')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setCircles(data)
      } else {
        console.error('API returned invalid data:', data)
        setCircles([])
      }
    } catch (error) {
      console.error('Error fetching circles:', error)
      setCircles([])
    } finally {
      setCirclesLoading(false)
    }
  }, [])

  const fetchCommunityMembers = useCallback(async (forceRefresh = false) => {
    try {
      setMembersLoading(true)
      const url = forceRefresh 
        ? '/api/community/members?limit=4&refresh=true'
        : '/api/community/members?limit=4'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setCommunityMembers(data)
        setLastRefresh(new Date())
      } else {
        console.error('API returned invalid data:', data)
        setCommunityMembers([])
      }
    } catch (error) {
      console.error('Error fetching community members:', error)
      setCommunityMembers([])
    } finally {
      setMembersLoading(false)
    }
  }, [])

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
        
        if (process.env.NODE_ENV === 'development' && data.data.metadata) {
          console.log('Community Stats Metadata:', data.data.metadata)
        }
      } else {
        console.error('Failed to fetch community stats:', data.error)
        setStats({
          totalMembers: 1247,
          totalCertificates: 3421,
          totalAchievements: 1893,
          activeToday: 156
        })
      }
    } catch (error) {
      console.error('Error fetching community stats:', error)
      setStats({
        totalMembers: 1247,
        totalCertificates: 3421,
        totalAchievements: 1893,
        activeToday: 156
      })
    }
  }, [])

  // Auto-play slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning && !isCarouselTransition) {
        setCurrentSlide((prev) => (prev === 4 ? 0 : prev + 1))
      }
    }, 5000) // 5 seconds delay

    return () => clearInterval(interval)
  }, [isTransitioning, isCarouselTransition])

  // Auto-play progress effect
  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!isTransitioning && !isCarouselTransition) {
        setAutoPlayProgress((prev) => {
          if (prev >= 100) {
            return 0
          }
          return prev + (100 / 50) // 5 seconds = 50 intervals of 100ms
        })
      }
    }, 100)

    return () => clearInterval(progressInterval)
  }, [isTransitioning, isCarouselTransition])

  // Reset progress when slide changes
  useEffect(() => {
    setAutoPlayProgress(0)
  }, [currentSlide])

  // Achievements carousel auto-play effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAchievementTransitioning && !isAchievementCarouselTransition && announcements.length > 0) {
        setCurrentAchievementSlide((prev) => (prev === Math.min(announcements.length - 1, 2) ? 0 : prev + 1))
      }
    }, 4000) // 4 seconds delay for achievements

    return () => clearInterval(interval)
  }, [isAchievementTransitioning, isAchievementCarouselTransition, announcements.length])

  // Achievements carousel progress effect
  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!isAchievementTransitioning && !isAchievementCarouselTransition && announcements.length > 0) {
        setAchievementAutoPlayProgress((prev) => {
          if (prev >= 100) {
            return 0
          }
          return prev + (100 / 40) // 4 seconds = 40 intervals of 100ms
        })
      }
    }, 100)

    return () => clearInterval(progressInterval)
  }, [isAchievementTransitioning, isAchievementCarouselTransition, announcements.length])

  // Reset achievements progress when slide changes
  useEffect(() => {
    setAchievementAutoPlayProgress(0)
  }, [currentAchievementSlide])

  // Handle slide transitions with carousel effect
  const handleSlideChange = (newSlide: number) => {
    if (isTransitioning || isCarouselTransition) return
    
    setIsTransitioning(true)
    setCurrentSlide(newSlide)
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 700) // Match the CSS transition duration
  }

  // Handle achievements carousel slide transitions
  const handleAchievementSlideChange = (newSlide: number) => {
    if (isAchievementTransitioning || isAchievementCarouselTransition || announcements.length === 0) return
    
    setIsAchievementTransitioning(true)
    setCurrentAchievementSlide(newSlide)
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsAchievementTransitioning(false)
    }, 600) // Slightly faster transition for achievements
  }

  // Handle carousel loop effect
  useEffect(() => {
    if (currentSlide === 5) {
      // When we reach the duplicate cards, quickly jump back to the real ones
      setTimeout(() => {
        setIsCarouselTransition(true)
        setCurrentSlide(0)
        setTimeout(() => {
          setIsCarouselTransition(false)
        }, 50)
      }, 700)
    } else if (currentSlide === -1) {
      // When we go backwards to duplicates, quickly jump to the end
      setTimeout(() => {
        setIsCarouselTransition(true)
        setCurrentSlide(4)
        setTimeout(() => {
          setIsCarouselTransition(false)
        }, 50)
      }, 700)
    }
  }, [currentSlide])

  useEffect(() => {
    fetchAnnouncements()
    fetchStats()
    fetchCircles()
    fetchCommunityMembers()
  }, [fetchAnnouncements, fetchStats, fetchCircles, fetchCommunityMembers])

  // Periodic refresh for community members (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCommunityMembers(true) // Force refresh for diversity rotation
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [fetchCommunityMembers])

  // Handle post-login redirect for pending circle joins
  useEffect(() => {
    if (session?.user) {
      const pendingCircleJoin = localStorage.getItem('pendingCircleJoin')
      if (pendingCircleJoin) {
        // Clear the pending join and redirect to the specific circle
        localStorage.removeItem('pendingCircleJoin')
        router.push(`/community/circles/${pendingCircleJoin}`)
      }
    }
  }, [session, router])

  const handleLike = async (announcementId: string) => {
    try {
      const response = await fetch(`/api/community/announcements/${announcementId}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
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
        fetchAnnouncements()
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

  const handleJoinCircle = async (circleId: string) => {
    // Check if user is authenticated
    if (!session?.user) {
      // Find the circle to get its slug
      const circle = circles.find(c => c.id === circleId)
      if (circle) {
        // Store the circle context in localStorage for after login
        localStorage.setItem('pendingCircleJoin', circle.slug)
        // Redirect to sign in page with return URL
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/community/circles/${circle.slug}`)}`)
      }
      return
    }

    try {
      // Find the circle to get its slug for the API call
      const circle = circles.find(c => c.id === circleId)
      if (!circle) {
        toast.error('Circle not found')
        return
      }

      const response = await fetch(`/api/community/circles/${circle.slug}/join`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success('Joined study circle successfully!')
        
        // Show subscription reminder if needed
        if (data.showSubscriptionReminder) {
          setJoinedCircleName(data.circleName)
          setShowSubscriptionReminder(true)
        }
        
        // Refresh circles to update member count
        fetchCircles()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to join study circle')
      }
    } catch (error) {
      console.error('Error joining circle:', error)
      toast.error('Failed to join study circle')
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

  // Prepare circles for display - combine live circles with placeholders to maintain 3 circles
  const displayCircles = () => {
    const liveCircles = circles.slice(0, 3) // Take up to 3 live circles
    const neededPlaceholders = Math.max(0, 3 - liveCircles.length)
    const selectedPlaceholders = placeholderCircles.slice(0, neededPlaceholders)
    
    return [...liveCircles, ...selectedPlaceholders]
  }

  // Prepare visible profiles - combine real members with placeholders to maintain 4 members
  const displayMembers = () => {
    const realMembers = communityMembers.slice(0, 4) // Take up to 4 real members
    const neededPlaceholders = Math.max(0, 4 - realMembers.length)
    const selectedPlaceholders = placeholderProfiles.slice(0, neededPlaceholders)
    
    return [...realMembers, ...selectedPlaceholders]
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
          <div className="container mx-auto px-6 py-20">
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full mb-6 animate-pulse">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  FluentShip Community
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                  Connect with fellow learners, share achievements, and accelerate your language learning journey through our vibrant community
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Link href="#benefits">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-3 transition-all duration-300 hover:scale-105">
                    <Users className="h-5 w-5 mr-2" />
                    Community Benefits
                  </Button>
                </Link>
                <Link href="#achievements">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-3 transition-all duration-300 hover:scale-105">
                    <Trophy className="h-5 w-5 mr-2" />
                    Recent Achievements
                  </Button>
                </Link>
                <Link href="#circles">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-3 transition-all duration-300 hover:scale-105">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Study Circles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Slider */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Community Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the powerful tools and features that make learning together more effective
              </p>
            </div>
            
                         {/* Feature Cards Container */}
             <div className="relative overflow-hidden">
               <div 
                 className={`flex gap-6 ${isCarouselTransition ? 'transition-none' : 'transition-all duration-700 ease-out'}`}
                 style={{ 
                   transform: `translateX(-${currentSlide * 320}px)`,
                   filter: isTransitioning ? 'brightness(0.95)' : 'brightness(1)'
                 }}
               >

                                             {/* Feature Card 1: Community Circles */}
                <div className="w-80 flex-shrink-0">
                  <Card className="h-full bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Circles</h3>
                      <p className="text-gray-600 mb-6">
                        Join language-specific study groups and practice with peers at your level
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span>Language-specific groups</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                          <span>Peer-to-peer learning</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Trophy className="h-4 w-4 text-blue-600" />
                          <span>Progress tracking</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                              {/* Feature Card 2: Live Conversations */}
                <div className="w-80 flex-shrink-0">
                  <Card className="h-full bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
                        <MessageCircle className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Conversations</h3>
                      <p className="text-gray-600 mb-6">
                        Practice with native speakers and peers in real-time conversations
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Globe className="h-4 w-4 text-green-600" />
                          <span>Native speakers</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Video className="h-4 w-4 text-green-600" />
                          <span>Real-time video</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Heart className="h-4 w-4 text-green-600" />
                          <span>Cultural context</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                              {/* Feature Card 3: Achievement Sharing */}
                <div className="w-80 flex-shrink-0">
                  <Card className="h-full bg-gradient-to-br from-yellow-50 to-yellow-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600 rounded-full mb-6">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Achievement Sharing</h3>
                      <p className="text-gray-600 mb-6">
                        Showcase your progress with public achievement badges and milestones
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span>Public badges</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <TrendingUp className="h-4 w-4 text-yellow-600" />
                          <span>Progress milestones</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Star className="h-4 w-4 text-yellow-600" />
                          <span>Social recognition</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feature Card 4: Peer Support */}
                <div className="w-80 flex-shrink-0">
                  <Card className="h-full bg-gradient-to-br from-pink-50 to-pink-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-600 rounded-full mb-6">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Peer Support</h3>
                      <p className="text-gray-600 mb-6">
                        Connect with learners at similar levels for motivation and accountability
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <UserPlus className="h-4 w-4 text-pink-600" />
                          <span>Study partners</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Users className="h-4 w-4 text-pink-600" />
                          <span>Mutual encouragement</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <Target className="h-4 w-4 text-pink-600" />
                          <span>Shared goals</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                                 {/* Feature Card 5: Study Clubs */}
                 <div className="w-80 flex-shrink-0">
                   <Card className="h-full bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                     <CardContent className="p-8 text-center">
                       <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
                         <BookOpen className="h-8 w-8 text-white" />
                       </div>
                       <h3 className="text-2xl font-bold text-gray-900 mb-4">Study Clubs</h3>
                       <p className="text-gray-600 mb-6">
                         Join themed study clubs and participate in collaborative learning activities
                       </p>
                       <div className="space-y-3">
                         <div className="flex items-center gap-3 text-sm text-gray-700">
                           <Calendar className="h-4 w-4 text-purple-600" />
                           <span>Regular sessions</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-gray-700">
                           <Share2 className="h-4 w-4 text-purple-600" />
                           <span>Shared resources</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-gray-700">
                           <Crown className="h-4 w-4 text-purple-600" />
                           <span>Team challenges</span>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </div>

                 {/* Duplicate cards for carousel effect - Start */}
                 {/* Feature Card 1: Community Circles (Duplicate) */}
                 <div className="w-80 flex-shrink-0">
                   <Card className="h-full bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                     <CardContent className="p-8 text-center">
                       <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
                         <Users className="h-8 w-8 text-white" />
                       </div>
                       <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Circles</h3>
                       <p className="text-gray-600 mb-6">
                         Join language-specific study groups and practice with peers at your level
                       </p>
                       <div className="space-y-3">
                         <div className="flex items-center gap-3 text-sm text-gray-700">
                           <Users className="h-4 w-4 text-blue-600" />
                           <span>Language-specific groups</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-gray-700">
                           <MessageCircle className="h-4 w-4 text-blue-600" />
                           <span>Peer-to-peer learning</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-gray-700">
                           <Trophy className="h-4 w-4 text-blue-600" />
                           <span>Progress tracking</span>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </div>

                 {/* Feature Card 2: Live Conversations (Duplicate) */}
                 <div className="w-80 flex-shrink-0">
                   <Card className="h-full bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                     <CardContent className="p-8 text-center">
                       <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
                         <MessageCircle className="h-8 w-8 text-white" />
                       </div>
                       <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Conversations</h3>
                       <p className="text-gray-600 mb-6">
                         Practice with native speakers and peers in real-time conversations
                       </p>
                       <div className="space-y-3">
                         <div className="flex items-center gap-3 text-sm text-gray-700">
                           <Globe className="h-4 w-4 text-green-600" />
                           <span>Native speakers</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-gray-700">
                           <Video className="h-4 w-4 text-green-600" />
                           <span>Real-time video</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-gray-700">
                           <Heart className="h-4 w-4 text-green-600" />
                           <span>Cultural context</span>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </div>

                                                      {/* Navigation Controls */}
               <div className="flex justify-center items-center space-x-4 mt-8">
                 <button
                   onClick={() => handleSlideChange(currentSlide === 0 ? -1 : currentSlide - 1)}
                   className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                 >
                   <ChevronLeft className="h-6 w-6" />
                 </button>
                 
                 {/* Progress Bar */}
                 <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-blue-600 rounded-full transition-all duration-100 ease-linear"
                     style={{ width: `${autoPlayProgress}%` }}
                   />
                 </div>
                 
                 {/* Dots */}
                 <div className="flex space-x-2">
                   {[0, 1, 2, 3, 4].map((index) => (
                     <button
                       key={index}
                       onClick={() => handleSlideChange(index)}
                       className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                         currentSlide === index ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                       }`}
                     />
                   ))}
                 </div>
                 
                 <button
                   onClick={() => handleSlideChange(currentSlide === 4 ? 5 : currentSlide + 1)}
                   className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                 >
                   <ChevronRight className="h-6 w-6" />
                 </button>
               </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalMembers.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Community Members</div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Award className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCertificates.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Certificates Earned</div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Trophy className="h-8 w-8 mx-auto mb-3 text-yellow-600" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalAchievements.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Achievements Unlocked</div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activeToday}</div>
                <div className="text-sm text-gray-600">Active Today</div>
              </CardContent>
            </Card>
          </div>

          {/* Community Benefits Section */}
          <section id="benefits" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Join Our Community?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the powerful benefits of learning languages together with our global community
              </p>
            </div>



            {/* Learning Enhancement Benefits */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Learning Enhancement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md h-full">
                    <CardHeader className={`${benefit.bgColor} rounded-t-lg pb-4`}>
                      <div className="text-center">
                        <div className={`inline-flex p-3 rounded-full bg-white ${benefit.color} mb-3`}>
                          <benefit.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg text-gray-900 mb-2">{benefit.title}</CardTitle>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-3 text-xs">
                        {benefit.benefit}
                      </Badge>
                      <ul className="space-y-2">
                        {benefit.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-xs text-gray-700">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Recent Achievements Section */}
              <section id="achievements">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
                    Recent Achievements
                  </h2>
                  
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
                
                {/* Achievements Carousel */}
                <div className="relative overflow-hidden">
                  {announcements.length > 0 ? (
                    <>
                      <div 
                        className={`flex gap-6 ${isAchievementTransitioning ? 'transition-none' : 'transition-all duration-600 ease-in-out'}`}
                        style={{ 
                          transform: `translateX(-${currentAchievementSlide * 400}px)`,
                          filter: isAchievementTransitioning ? 'brightness(0.9)' : 'brightness(1)'
                        }}
                      >
                        {announcements.slice(0, 3).map((announcement, index) => (
                          <div key={announcement.id} className="w-96 flex-shrink-0">
                            <Card className={`h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                              index === currentAchievementSlide 
                                ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 ring-2 ring-yellow-200' 
                                : 'bg-gradient-to-br from-gray-50 to-gray-100'
                            }`}>
                              <CardContent className="p-8">
                                <div className="flex items-start space-x-4 mb-6">
                                  <div className="relative">
                                    <Avatar className="h-16 w-16 ring-4 ring-yellow-200">
                                      <AvatarImage src={announcement.user.image} />
                                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-lg">
                                        {announcement.user.name.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                                      <Trophy className="h-4 w-4" />
                                    </div>
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="font-bold text-lg text-gray-900">{announcement.user.name}</span>
                                      <span className="text-gray-400">•</span>
                                      <span className="text-sm text-gray-500">
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 mb-3">
                                      <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm">
                                        <span className="text-2xl">{getLanguageFlag(announcement.language)}</span>
                                        <span className="font-semibold text-sm">{announcement.language.toUpperCase()}</span>
                                      </div>
                                      
                                      <Badge className={`${getLevelColor(announcement.cefrLevel)} font-bold text-sm px-3 py-1`}>
                                        {announcement.cefrLevel}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                <h3 className="font-bold text-xl mb-3 text-gray-900 leading-tight">{announcement.title}</h3>
                                <p className="text-gray-700 mb-6 leading-relaxed">{announcement.message}</p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                  <div className="flex items-center space-x-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleLike(announcement.id)}
                                      className="flex items-center space-x-2 hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
                                    >
                                      <Heart className="h-5 w-5" />
                                      <span className="font-semibold">{announcement.likes}</span>
                                    </Button>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="flex items-center space-x-2 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                    >
                                      <MessageCircle className="h-5 w-5" />
                                      <span>Comment</span>
                                    </Button>
                                  </div>
                                  
                                  {session?.user?.id === announcement.user.id && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center space-x-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                                    >
                                      <Share2 className="h-4 w-4" />
                                      <span>Edit</span>
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>

                      {/* Achievements Carousel Navigation */}
                      <div className="flex justify-center items-center space-x-4 mt-8">
                        <button
                          onClick={() => handleAchievementSlideChange(currentAchievementSlide === 0 ? Math.min(announcements.length - 1, 2) : currentAchievementSlide - 1)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        
                        {/* Progress Bar */}
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-100 ease-linear"
                            style={{ width: `${achievementAutoPlayProgress}%` }}
                          />
                        </div>
                        
                        {/* Dots */}
                        <div className="flex space-x-2">
                          {[0, 1, 2].slice(0, Math.min(announcements.length, 3)).map((index) => (
                            <button
                              key={index}
                              onClick={() => handleAchievementSlideChange(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                                currentAchievementSlide === index 
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 scale-125' 
                                  : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <button
                          onClick={() => handleAchievementSlideChange(currentAchievementSlide === Math.min(announcements.length - 1, 2) ? 0 : currentAchievementSlide + 1)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-xl">
                      <CardContent className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
                          <Trophy className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">No achievements yet</h3>
                        <p className="text-gray-600 mb-6 text-lg">
                          Be the first to share your language learning achievements!
                        </p>
                        <Button 
                          onClick={() => window.location.href = '/language-proficiency-test'}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                          Take Your First Test
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </section>

              {/* Study Circles Section */}
              <section id="circles">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Users className="h-6 w-6 mr-2 text-blue-600" />
                    Popular Study Circles
                  </h2>
                  
                  {circlesLoading && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Loading live circles...
                    </div>
                  )}
                </div>
                
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {displayCircles().map((circle) => (
                     <Card key={circle.id} className="hover:shadow-lg transition-shadow duration-200">
                       <CardContent className="p-6 flex flex-col h-full">
                         <div className="flex-1">
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
                                 {circle.isPlaceholder && (
                                   <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                     Demo
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
                               <span>
                                 {circle.isPlaceholder 
                                   ? `${circle.membersCount}/${circle.maxMembers} members`
                                   : `${circle.membersCount} members`
                                 }
                               </span>
                             </div>
                             <div className="text-xs text-gray-500">
                               Created {circle.isPlaceholder ? circle.createdAt : formatTimeAgo(circle.createdAt)}
                             </div>
                           </div>
                           
                           <div className="flex items-center space-x-2 mb-4">
                             <Avatar className="h-6 w-6">
                               <AvatarImage src={circle.isPlaceholder ? '' : circle.owner?.image || ''} />
                               <AvatarFallback className="text-xs">
                                 {circle.isPlaceholder 
                                   ? circle.createdBy?.charAt(0).toUpperCase() 
                                   : circle.owner?.name?.charAt(0).toUpperCase() || 'U'
                                 }
                               </AvatarFallback>
                             </Avatar>
                             <div className="text-xs text-gray-500">
                               by {circle.isPlaceholder ? circle.createdBy : circle.owner?.name || 'Unknown'}
                             </div>
                           </div>
                         </div>
                         
                         <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                           {!circle.isPlaceholder && (
                             <Link href={`/community/circles/${circle.slug}`} className="flex-1">
                               <Button 
                                 size="sm" 
                                 variant="outline" 
                                 className="text-xs w-full"
                               >
                                 View Circle
                               </Button>
                             </Link>
                           )}
                           <Button 
                             size="sm" 
                             variant="outline" 
                             className={`text-xs ${!circle.isPlaceholder ? 'flex-1' : 'w-full'}`}
                             disabled={circle.isPlaceholder}
                             onClick={() => {
                               if (!circle.isPlaceholder) {
                                 handleJoinCircle(circle.id)
                               }
                             }}
                           >
                             {circle.isPlaceholder ? 'Demo Circle' : 'Join Circle'}
                           </Button>
                         </div>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
                
                                 <div className="mt-6 text-center">
                   <div>
                     <Link href="/community/circles">
                       <Button variant="outline">
                         <Users className="h-4 w-4 mr-2" />
                         View All Circles
                       </Button>
                     </Link>
                   </div>
                 </div>
              </section>

              {/* Success Stories Section */}
              <section className="bg-gray-50 -mx-6 px-6 py-12 rounded-lg">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Success Stories
                  </h2>
                  <p className="text-gray-600">
                    Real learners who achieved their goals through community learning
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: 'Emma Thompson',
                      country: 'Canada',
                      language: 'Spanish',
                      progress: 'A1 to B2',
                      time: '6 months',
                      story: 'I joined the Spanish study group 6 months ago and made friends from 5 different countries. We practice together weekly and I can now confidently speak Spanish!'
                    },
                    {
                      name: 'Ahmed Hassan',
                      country: 'Egypt',
                      language: 'German',
                      progress: 'B1 to C1',
                      time: '8 months',
                      story: 'The German professional community helped me prepare for job interviews. I landed my dream job in Berlin!'
                    },
                    {
                      name: 'Yuki Tanaka',
                      country: 'Japan',
                      language: 'English',
                      progress: 'B2 to C2',
                      time: '4 months',
                      story: 'Through the English conversation group, I improved my speaking skills and gained confidence. Now I can travel anywhere!'
                    }
                  ].map((story, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                            <Users className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{story.name}</h3>
                            <p className="text-sm text-gray-600">{story.country}</p>
                            <p className="text-sm text-blue-600 font-medium">{story.language}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 italic text-sm">
                          "{story.story}"
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-semibold text-blue-600">{story.progress}</span>
                            <span className="text-gray-500"> in {story.time}</span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Community Features Wrapper */}
              <Suspense fallback={
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              }>
                <CommunityFeaturesWrapper 
                  visibleProfiles={displayMembers()} 
                  onRefresh={() => fetchCommunityMembers(true)}
                  isLoading={membersLoading}
                />
              </Suspense>



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

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Circles</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Live Sessions Today</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Members</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Languages</span>
                    <span className="font-semibold">12</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <section className="mt-20 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white rounded-2xl p-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Join the Community?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Start your language learning journey with friends from around the world
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/features/community-learning">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                    Join Free Community
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Subscription Reminder Dialog */}
      <Dialog open={showSubscriptionReminder} onOpenChange={setShowSubscriptionReminder}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              Welcome to {joinedCircleName}!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                You've successfully joined the circle! 🎉
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Unlock Premium Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Create unlimited study circles</li>
                  <li>• Access advanced analytics and insights</li>
                  <li>• Priority support and early access to features</li>
                  <li>• Ad-free experience across all features</li>
                  <li>• Exclusive premium study materials</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSubscriptionReminder(false)}>
                Maybe Later
              </Button>
              <Button 
                onClick={() => {
                  setShowSubscriptionReminder(false);
                  router.push('/pricing');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                View Plans
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Suspense>
  )
}