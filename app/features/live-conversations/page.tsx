'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  FaComments, 
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
  FaShieldAlt
} from 'react-icons/fa'

export default function LiveConversationsFeaturePage() {
  const [selectedLanguage, setSelectedLanguage] = useState('all')

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

  const demoSessions = [
    {
      id: 1,
      title: 'Beginner Spanish Conversation',
      language: 'Spanish',
      instructor: 'María González',
      time: 'Today, 2:00 PM',
      duration: '45 min',
      participants: 8,
      maxParticipants: 12,
      level: 'Beginner',
      type: 'Group Session',
      preview: 'https://example.com/preview1.mp4',
      rating: 4.8,
      reviews: 156
    },
    {
      id: 2,
      title: 'Business English Practice',
      language: 'English',
      instructor: 'Sarah Johnson',
      time: 'Today, 4:30 PM',
      duration: '60 min',
      participants: 5,
      maxParticipants: 8,
      level: 'Intermediate',
      type: 'Professional',
      preview: 'https://example.com/preview2.mp4',
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      title: 'French Pronunciation Workshop',
      language: 'French',
      instructor: 'Pierre Dubois',
      time: 'Tomorrow, 10:00 AM',
      duration: '30 min',
      participants: 12,
      maxParticipants: 15,
      level: 'All Levels',
      type: 'Workshop',
      preview: 'https://example.com/preview3.mp4',
      rating: 4.7,
      reviews: 203
    }
  ]

  const instructors = [
    {
      id: 1,
      name: 'María González',
      language: 'Spanish',
      country: 'Spain',
      rating: 4.9,
      students: 1200,
      sessions: 450,
      specialties: ['Conversation', 'Business Spanish', 'DELE Preparation'],
      image: '/api/placeholder/100/100'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      language: 'English',
      country: 'USA',
      rating: 4.8,
      students: 980,
      sessions: 320,
      specialties: ['Business English', 'IELTS', 'TOEFL'],
      image: '/api/placeholder/100/100'
    },
    {
      id: 3,
      name: 'Pierre Dubois',
      language: 'French',
      country: 'France',
      rating: 4.9,
      students: 750,
      sessions: 280,
      specialties: ['Pronunciation', 'DELF', 'Conversation'],
      image: '/api/placeholder/100/100'
    }
  ]

  const pricingPlans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: '1 session',
      features: [
        '1 free conversation session',
        'Access to demo recordings',
        'Basic progress tracking',
        'Community forum access'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Premium',
      price: '$19.99',
      period: '/month',
      features: [
        'Unlimited conversation sessions',
        'All languages and instructors',
        'Priority booking',
        'Session recordings',
        'Advanced progress tracking',
        'Study group access'
      ],
      cta: 'Start Premium',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Custom conversation programs',
        'Dedicated instructors',
        'Progress reporting',
        'API integration',
        'White-label options',
        '24/7 support'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <span className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                Featured Feature
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Live Conversations
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              "Set sail for your next language" - Practice with certified native speakers in real-time conversations
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

      {/* Demo Sessions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Experience Live Conversations
            </h2>
            <p className="text-xl text-gray-600">
              Join upcoming sessions and see the magic of real-time language practice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {session.type}
                    </span>
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
                      <FaUsers className="w-4 h-4 mr-2" />
                      {session.instructor}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaClock className="w-4 h-4 mr-2" />
                      {session.time} • {session.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaStar className="w-4 h-4 mr-2" />
                      {session.level}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <FaPlay className="w-4 h-4 mr-2" />
                      Join Demo
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

      {/* Top Instructors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Top Instructors
            </h2>
            <p className="text-xl text-gray-600">
              Learn from certified native speakers with proven track records
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FaGraduationCap className="w-10 h-10 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {instructor.name}
                  </h3>
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

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Live Conversations?
            </h2>
            <p className="text-xl text-gray-600">
              Experience authentic language practice with real people
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMicrophone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-Time Practice
              </h3>
              <p className="text-gray-600">
                Practice speaking with native speakers in real-time conversations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Group Learning
              </h3>
              <p className="text-gray-600">
                Join study groups and learn with fellow language enthusiasts
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadphones className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Flexible Scheduling
              </h3>
              <p className="text-gray-600">
                Choose from multiple time slots that fit your schedule
              </p>
            </div>
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
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
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
            Ready to Start Speaking?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners who have improved their speaking skills through live conversations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              Start Your Free Trial
            </Button>
            <Link href="/">
              <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 