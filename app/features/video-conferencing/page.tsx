'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FaVideo, 
  FaUsers, 
  FaGlobe, 
  FaClock, 
  FaStar,
  FaArrowRight,
  FaHeadphones,
  FaMicrophone,
  FaCalendarAlt,
  FaPlay,
  FaCheckCircle,
  FaRocket,
  FaGraduationCap,
  FaHeart,
  FaShieldAlt,
  FaCrown,
  FaZap,
  FaChartLine,
  FaDollarSign,
  FaUsersCog,
  FaLaptop,
  FaMobile,
  FaTablet
} from 'react-icons/fa'

export default function VideoConferencingFeaturePage() {
  const [selectedUseCase, setSelectedUseCase] = useState('all')

  const useCases = [
    { code: 'all', name: 'All Use Cases', icon: '🎯' },
    { code: 'one-on-one', name: 'One-on-One Tutoring', icon: '👤' },
    { code: 'group-sessions', name: 'Group Sessions', icon: '👥' },
    { code: 'workshops', name: 'Workshops', icon: '🎓' },
    { code: 'exams', name: 'Exam Preparation', icon: '📝' },
    { code: 'business', name: 'Business Language', icon: '💼' }
  ]

  const demoSessions = [
    {
      id: 1,
      title: 'Advanced Spanish Conversation',
      language: 'Spanish',
      instructor: 'Dr. María González',
      time: 'Today, 3:00 PM',
      duration: '60 min',
      participants: 6,
      maxParticipants: 8,
      level: 'Advanced',
      type: 'Group Session',
      price: 29.99,
      rating: 4.9,
      reviews: 234,
      features: ['Screen Sharing', 'Recording', 'Chat', 'Breakout Rooms']
    },
    {
      id: 2,
      title: 'Business English Masterclass',
      language: 'English',
      instructor: 'Prof. Sarah Johnson',
      time: 'Today, 5:30 PM',
      duration: '90 min',
      participants: 4,
      maxParticipants: 6,
      level: 'Professional',
      type: 'Workshop',
      price: 49.99,
      rating: 4.8,
      reviews: 156,
      features: ['Presentation Mode', 'Recording', 'Chat', 'File Sharing']
    },
    {
      id: 3,
      title: 'French Pronunciation Workshop',
      language: 'French',
      instructor: 'Pierre Dubois',
      time: 'Tomorrow, 10:00 AM',
      duration: '45 min',
      participants: 12,
      maxParticipants: 15,
      level: 'All Levels',
      type: 'Workshop',
      price: 19.99,
      rating: 4.7,
      reviews: 189,
      features: ['Screen Sharing', 'Recording', 'Chat']
    }
  ]

  const instructors = [
    {
      id: 1,
      name: 'Dr. María González',
      language: 'Spanish',
      country: 'Spain',
      rating: 4.9,
      students: 2500,
      sessions: 850,
      hourlyRate: 45,
      specialties: ['Conversation', 'Business Spanish', 'DELE Preparation'],
      image: '/api/placeholder/100/100',
      verified: true,
      featured: true
    },
    {
      id: 2,
      name: 'Prof. Sarah Johnson',
      language: 'English',
      country: 'USA',
      rating: 4.8,
      students: 1800,
      sessions: 620,
      hourlyRate: 55,
      specialties: ['Business English', 'IELTS', 'TOEFL'],
      image: '/api/placeholder/100/100',
      verified: true,
      featured: true
    },
    {
      id: 3,
      name: 'Pierre Dubois',
      language: 'French',
      country: 'France',
      rating: 4.9,
      students: 1200,
      sessions: 480,
      hourlyRate: 40,
      specialties: ['Pronunciation', 'DELF', 'Conversation'],
      image: '/api/placeholder/100/100',
      verified: true,
      featured: false
    }
  ]

  const pricingPlans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: '1 session',
      features: [
        '1 free video session',
        'Basic video features',
        'Screen sharing',
        'Chat functionality',
        'Session recording (24h)',
        'Community forum access'
      ],
      cta: 'Start Free Trial',
      popular: false,
      conversion: 'trial'
    },
    {
      name: 'Premium',
      price: '$24.99',
      period: '/month',
      features: [
        'Unlimited video sessions',
        'All languages and instructors',
        'Priority booking',
        'HD video quality',
        'Advanced screen sharing',
        'Session recordings (30 days)',
        'Breakout rooms',
        'File sharing',
        'Advanced analytics',
        'Study group access'
      ],
      cta: 'Start Premium',
      popular: true,
      conversion: 'premium'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Custom video programs',
        'Dedicated instructors',
        'Unlimited recordings',
        'Advanced analytics',
        'API integration',
        'White-label options',
        '24/7 priority support',
        'Custom branding',
        'Multi-language support',
        'Bulk pricing'
      ],
      cta: 'Contact Sales',
      popular: false,
      conversion: 'enterprise'
    }
  ]

  const features = [
    {
      title: 'HD Video Quality',
      description: 'Crystal clear video with adaptive quality based on your connection',
      icon: <FaVideo className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Screen Sharing',
      description: 'Share your screen for presentations, documents, and interactive learning',
      icon: <FaLaptop className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Recording & Playback',
      description: 'Record sessions for later review and learning reinforcement',
      icon: <FaPlay className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Breakout Rooms',
      description: 'Split into smaller groups for focused practice and discussions',
      icon: <FaUsers className="w-6 h-6" />,
      color: 'bg-orange-500'
    },
    {
      title: 'Chat & File Sharing',
      description: 'Real-time messaging and secure file sharing during sessions',
      icon: <FaMicrophone className="w-6 h-6" />,
      color: 'bg-pink-500'
    },
    {
      title: 'Mobile Optimized',
      description: 'Join sessions from any device with our mobile-friendly interface',
      icon: <FaMobile className="w-6 h-6" />,
      color: 'bg-indigo-500'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Video Sessions', icon: <FaVideo className="w-6 h-6" /> },
    { number: '500+', label: 'Certified Instructors', icon: <FaGraduationCap className="w-6 h-6" /> },
    { number: '50+', label: 'Languages', icon: <FaGlobe className="w-6 h-6" /> },
    { number: '99.9%', label: 'Uptime', icon: <FaShieldAlt className="w-6 h-6" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <span className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                🚀 Premium Feature
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Video Conferencing
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Experience the future of language learning with our advanced video conferencing platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                <FaPlay className="w-5 h-5 mr-2" />
                Try Free Session
              </Button>
              <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg">
                <FaVideo className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-blue-600 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Sessions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Experience Professional Video Sessions
            </h2>
            <p className="text-xl text-gray-600">
              Join upcoming sessions and see the power of our video conferencing platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {session.type}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                      {session.rating} ({session.reviews})
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {session.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaGlobe className="w-4 h-4 mr-2" />
                      {session.language}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaGraduationCap className="w-4 h-4 mr-2" />
                      {session.instructor}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaClock className="w-4 h-4 mr-2" />
                      {session.time} • {session.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUsers className="w-4 h-4 mr-2" />
                      {session.participants}/{session.maxParticipants} participants
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaDollarSign className="w-4 h-4 mr-2" />
                      ${session.price}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {session.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <FaPlay className="w-4 h-4 mr-2" />
                      Join Session
                    </Button>
                    <Button variant="outline" className="px-3">
                      <FaHeart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Video Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for professional language learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`${feature.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Premium Instructors
            </h2>
            <p className="text-xl text-gray-600">
              Learn from certified native speakers with proven track records
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className={`relative hover:shadow-lg transition-shadow duration-300 ${instructor.featured ? 'border-2 border-yellow-400' : ''}`}>
                {instructor.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-white">
                      <FaCrown className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FaGraduationCap className="w-10 h-10 text-gray-600" />
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {instructor.name}
                    </h3>
                    {instructor.verified && (
                      <FaShieldAlt className="w-4 h-4 text-blue-500 ml-2" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">
                    {instructor.language} • {instructor.country}
                  </p>
                  <div className="flex items-center justify-center mb-4">
                    <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-semibold">{instructor.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({instructor.students} students)
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <div>${instructor.hourlyRate}/hour</div>
                    <div>{instructor.sessions} sessions completed</div>
                  </div>
                  <div className="space-y-1 mb-4">
                    {instructor.specialties.map((specialty, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded mr-1 mb-1 inline-block">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start with a free trial and upgrade when you're ready
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-blue-500 bg-blue-50' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-4">
                    {plan.price}
                    {plan.period && <span className="text-lg text-gray-500">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    data-conversion={plan.conversion}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Professional Video Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners who have transformed their language skills through our video conferencing platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              <FaRocket className="w-5 h-5 mr-2" />
              Start Your Free Trial
            </Button>
            <Link href="/features/live-conversations">
              <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg">
                <FaArrowRight className="w-5 h-5 mr-2" />
                Explore Live Conversations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 