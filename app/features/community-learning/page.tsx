'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  FaUsers, 
  FaGlobe, 
  FaComments, 
  FaHeart, 
  FaStar,
  FaArrowRight,
  FaUserFriends,
  FaGraduationCap,
  FaHandshake,
  FaGlobeAmericas,
  FaCalendarAlt,
  FaSearch,
  FaRocket,
  FaCheckCircle,
  FaShieldAlt,
  FaBookOpen,
  FaVideo
} from 'react-icons/fa'

export default function CommunityLearningFeaturePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

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

  const successStories = [
    {
      id: 1,
      name: 'Emma Thompson',
      country: 'Canada',
      language: 'Spanish',
      story: 'I joined the Spanish study group 6 months ago and made friends from 5 different countries. We practice together weekly and I can now confidently speak Spanish!',
      improvement: 'A1 to B2',
      time: '6 months',
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: 'Ahmed Hassan',
      country: 'Egypt',
      language: 'German',
      story: 'The German professional community helped me prepare for job interviews. I landed my dream job in Berlin!',
      improvement: 'B1 to C1',
      time: '8 months',
      image: '/api/placeholder/80/80'
    },
    {
      id: 3,
      name: 'Yuki Tanaka',
      country: 'Japan',
      language: 'English',
      story: 'Through the English conversation group, I improved my speaking skills and gained confidence. Now I can travel anywhere!',
      improvement: 'B2 to C2',
      time: '4 months',
      image: '/api/placeholder/80/80'
    }
  ]

  const pricingPlans = [
    {
      name: 'Free Community',
      price: '$0',
      period: 'forever',
      features: [
        'Access to basic study groups',
        'Community forum participation',
        'Basic resource sharing',
        'Limited group creation'
      ],
      cta: 'Join Free',
      popular: false
    },
    {
      name: 'Premium Community',
      price: '$9.99',
      period: '/month',
      features: [
        'All community features',
        'Exclusive study groups',
        'Advanced resource library',
        'Priority group creation',
        'Community challenges',
        'Progress tracking'
      ],
      cta: 'Start Premium',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Custom community solutions',
        'White-label communities',
        'Advanced analytics',
        'API integration',
        'Dedicated support',
        'Custom branding'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <span className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                Featured Feature
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Community Learning
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              "Where fluency meets friendship" - Join study groups, language exchanges, and global communities of learners
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                <FaUsers className="w-5 h-5 mr-2" />
                Join Free Community
              </Button>
              <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg">
                <FaVideo className="w-5 h-5 mr-2" />
                Watch Community Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Communities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Communities
            </h2>
            <p className="text-xl text-gray-600">
              Join active communities and start learning with fellow language enthusiasts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCommunities.map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {community.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaUsers className="w-4 h-4 mr-1" />
                      {community.members}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {community.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {community.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaGlobe className="w-4 h-4 mr-2" />
                      {community.language}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      {community.meetingTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaStar className="w-4 h-4 mr-2" />
                      {community.level}
                    </div>
                    <div className="flex items-center text-sm text-blue-600">
                      <FaHeart className="w-4 h-4 mr-2" />
                      {community.activeToday} active today
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {community.topics.map((topic, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Join Community
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

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real learners who achieved their goals through community learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                      <FaUserFriends className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{story.name}</h3>
                      <p className="text-sm text-gray-600">{story.country}</p>
                      <p className="text-sm text-blue-600 font-medium">{story.language}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 italic">
                    "{story.story}"
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-semibold text-blue-600">{story.improvement}</span>
                      <span className="text-gray-500"> in {story.time}</span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <FaUserFriends className="w-8 h-8 text-blue-600" />
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
                <FaGraduationCap className="w-8 h-8 text-blue-600" />
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
                <FaHandshake className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cultural Exchange
              </h3>
              <p className="text-gray-600">
                Learn about different cultures while improving your language skills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Community Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start free and upgrade when you want more features
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
                        <FaCheckCircle className="w-4 h-4 text-blue-500 mr-3" />
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
      <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your language learning journey with friends from around the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              Join Free Community
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