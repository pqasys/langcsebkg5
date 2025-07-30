'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FaVideo, 
  FaUsers, 
  FaStar, 
  FaPlay, 
  FaRocket,
  FaCheckCircle,
  FaArrowRight,
  FaClock,
  FaGlobe
} from 'react-icons/fa'

interface VideoConferencingCTAProps {
  variant?: 'hero' | 'featured' | 'compact'
  showStats?: boolean
  showPricing?: boolean
}

export default function VideoConferencingCTA({ 
  variant = 'featured', 
  showStats = true, 
  showPricing = false 
}: VideoConferencingCTAProps) {
  
  const stats = [
    { number: '10,000+', label: 'Video Sessions' },
    { number: '500+', label: 'Certified Instructors' },
    { number: '50+', label: 'Languages' },
    { number: '99.9%', label: 'Uptime' }
  ]

  const features = [
    'HD Video Quality',
    'Screen Sharing',
    'Session Recording',
    'Breakout Rooms',
    'Chat & File Sharing',
    'Mobile Optimized'
  ]

  const pricing = [
    {
      name: 'Free Trial',
      price: '$0',
      period: '1 session',
      features: ['Basic video features', 'Screen sharing', 'Chat functionality']
    },
    {
      name: 'Premium',
      price: '$24.99',
      period: '/month',
      features: ['Unlimited sessions', 'HD quality', 'Advanced features']
    }
  ]

  if (variant === 'hero') {
    return (
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <Badge className="bg-yellow-500 text-gray-900">
                🚀 Premium Feature
              </Badge>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Professional Video Conferencing
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Experience the future of language learning with our advanced video conferencing platform
            </p>
            
            {showStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-blue-100">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/features/live-classes">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                  <FaPlay className="w-5 h-5 mr-2" />
                  Try Free Session
                </Button>
              </Link>
              <Link href="/video-sessions/create">
                <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg">
                  <FaVideo className="w-5 h-5 mr-2" />
                  Create Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <FaVideo className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Professional Video Conferencing
                </h3>
                <p className="text-sm text-gray-600">
                  HD quality, screen sharing, recording, and more
                </p>
              </div>
            </div>
            <Link href="/features/live-classes">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FaArrowRight className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="mb-4">
            <Badge className="bg-yellow-500 text-gray-900">
              🚀 Premium Feature
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Professional Video Conferencing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of language learning with our advanced video conferencing platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Features */}
          <div>
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {showStats && (
              <div className="grid grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/features/live-classes">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <FaPlay className="w-5 h-5 mr-2" />
                  Try Free Session
                </Button>
              </Link>
              <Link href="/video-sessions/create">
                <Button size="lg" variant="outline">
                  <FaVideo className="w-5 h-5 mr-2" />
                  Create Session
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Demo Session */}
          <div>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Live Demo
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                    4.9 (234 reviews)
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Advanced Spanish Conversation
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaGlobe className="w-4 h-4 mr-2" />
                    Spanish • Dr. María González
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaClock className="w-4 h-4 mr-2" />
                    Today, 3:00 PM • 60 min
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="w-4 h-4 mr-2" />
                    6/8 participants
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {['Screen Sharing', 'Recording', 'Chat', 'Breakout Rooms'].map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <FaPlay className="w-4 h-4 mr-2" />
                    Join Demo
                  </Button>
                  <Button variant="outline" className="px-3">
                    <FaRocket className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showPricing && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Simple Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {pricing.map((plan, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      {plan.price}
                      {plan.period && <span className="text-sm text-gray-500">{plan.period}</span>}
                    </div>
                    <ul className="space-y-2 mb-6 text-left">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <FaCheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
} 