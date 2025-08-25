'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'
import { 
  Users, 
  Globe, 
  MessageCircle, 
  Heart, 
  Star,
  ArrowRight,
  UserPlus,
  GraduationCap,
  Handshake,
  Calendar,
  Search,
  Rocket,
  CheckCircle,
  Shield,
  BookOpen,
  Video,
  Crown,
  Settings,
  MapPin,
  Languages,
  Award,
  BarChart3
} from 'lucide-react'

interface VisibleProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  languages: string[];
  level: string;
  interests: string[];
  isOnline: boolean;
  lastActive: string;
  mutualConnections: number;
  achievements: number;
}

export default function CommunityFeaturesPage() {
  const { data: session } = useSession()
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Placeholder visible profiles data
  const visibleProfiles: VisibleProfile[] = [
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

  const categories = [
    { code: 'all', name: 'All Communities', icon: '🌍' },
    { code: 'study-groups', name: 'Study Groups', icon: '📚' },
    { code: 'language-exchange', name: 'Language Exchange', icon: '🔄' },
    { code: 'cultural', name: 'Cultural Exchange', icon: '🎭' },
    { code: 'professional', name: 'Professional', icon: '💼' },
    { code: 'travel', name: 'Travel & Tourism', icon: '✈️' }
  ]

  const featuredCommunities = [
    {
      id: 1,
      name: 'Spanish Study Group - Beginners',
      category: 'Study Groups',
      language: 'Spanish',
      members: 156,
      activeToday: 23,
      description: 'A supportive community for Spanish beginners. Practice together, share resources, and motivate each other.',
      topics: ['Grammar', 'Vocabulary', 'Pronunciation'],
      meetingTime: 'Every Tuesday, 7:00 PM',
      level: 'Beginner',
      image: '/api/placeholder/300/200',
      successStories: 45
    },
    {
      id: 2,
      name: 'English-French Language Exchange',
      category: 'Language Exchange',
      language: 'English/French',
      members: 89,
      activeToday: 15,
      description: 'Practice English and French with native speakers. Perfect for intermediate learners looking to improve fluency.',
      topics: ['Conversation', 'Cultural Topics', 'Daily Life'],
      meetingTime: 'Every Thursday, 6:30 PM',
      level: 'Intermediate',
      image: '/api/placeholder/300/200',
      successStories: 32
    },
    {
      id: 3,
      name: 'Japanese Culture & Language',
      category: 'Cultural Exchange',
      language: 'Japanese',
      members: 234,
      activeToday: 31,
      description: 'Learn Japanese while exploring Japanese culture, traditions, and modern life.',
      topics: ['Culture', 'Traditions', 'Modern Japan'],
      meetingTime: 'Every Saturday, 2:00 PM',
      level: 'All Levels',
      image: '/api/placeholder/300/200',
      successStories: 67
    }
  ]

  const handleConnectRequest = (profileId: string) => {
    // TODO: Implement connection request logic
    console.log('Sending connection request to:', profileId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Community Features</h1>
            <p className="text-xl text-blue-100 mb-6">
              Connect, learn, and grow with language learners worldwide
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/community">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Users className="h-4 w-4 mr-2" />
                  Join Community
                </Button>
              </Link>
              <Link href="/community/circles">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Study Circles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Study Groups</h3>
                      <p className="text-sm text-gray-600">Join focused learning communities</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Structured learning sessions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Peer accountability</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Shared resources</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Language Exchange</h3>
                      <p className="text-sm text-gray-600">Practice with native speakers</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>1-on-1 conversations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Cultural insights</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Real-world practice</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Achievement Sharing</h3>
                      <p className="text-sm text-gray-600">Celebrate your progress</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Share certificates</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Inspire others</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Track milestones</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Events & Meetups</h3>
                      <p className="text-sm text-gray-600">Join language events</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Local meetups</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Virtual events</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Cultural celebrations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Members</span>
                    <span className="font-semibold">2,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Today</span>
                    <span className="font-semibold text-green-600">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Study Groups</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Events This Week</span>
                    <span className="font-semibold">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find Study Partners
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Browse Events
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Conversation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

