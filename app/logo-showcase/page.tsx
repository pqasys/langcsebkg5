'use client'

import { useState } from 'react'
import { Logo } from '@/components/ui/logo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Ship, 
  Users, 
  Compass, 
  Waves, 
  Palette, 
  Download,
  Heart,
  Star,
  Globe,
  MessageCircle
} from 'lucide-react'

export default function LogoShowcasePage() {
  const [selectedVariant, setSelectedVariant] = useState('badge-image')

  const logoVariants = [
    {
      id: 'badge-image',
      name: 'Original PNG Badge (Recommended)',
      description: 'The authentic original fluentship-badge.png image showing a boat with three people on wavy water - true to the original design',
      icon: Star,
      colors: ['Original Colors'],
      style: 'Authentic, Original, PNG'
    },
    {
      id: 'badge-original',
      name: 'Original Badge (Brand Colors)',
      description: 'The original badge design adapted with FluentShip brand colors - captures friendship, voyage of discovery, and community spirit',
      icon: Star,
      colors: ['Ocean Blue', 'Coral', 'Accent Yellow', 'Soft Cream'],
      style: 'Friendship, Voyage, Community'
    },
    {
      id: 'badge',
      name: 'Badge Shield',
      description: 'Shield-shaped badge with ship design, representing trust, achievement, and community recognition',
      icon: Star,
      colors: ['Ocean Blue', 'Coral', 'Accent Yellow', 'Soft Cream'],
      style: 'Trust, Achievement, Recognition'
    },
    {
      id: 'badge-circle',
      name: 'Badge Circle',
      description: 'Circular badge design with ship motif, perfect for achievement recognition and community badges',
      icon: Star,
      colors: ['Ocean Blue', 'Coral', 'Accent Yellow', 'Soft Cream'],
      style: 'Achievement, Recognition, Community'
    },
    {
      id: 'badge-faithful',
      name: 'Faithful Badge Reproduction',
      description: 'Exact reproduction of the original fluentship-badge.png with FluentShip brand colors - staying true to the authentic design',
      icon: Star,
      colors: ['Ocean Blue', 'Coral', 'Accent Yellow', 'Soft Cream'],
      style: 'Authentic, Original, Faithful'
    },
    {
      id: 'badge-enhanced',
      name: 'Enhanced Badge',
      description: 'Sophisticated circular badge with detailed ship design and decorative elements',
      icon: Star,
      colors: ['Ocean Blue', 'Coral', 'Accent Yellow', 'Soft Cream'],
      style: 'Detailed, Sophisticated, Premium'
    },
    {
      id: 'ship-bubble',
      name: 'Ship + Speech Bubble',
      description: 'A small sailboat where the sail is shaped like a chat bubble — symbolizing a "conversation-powered journey"',
      icon: MessageCircle,
      colors: ['Ocean Blue', 'Coral', 'Accent Yellow'],
      style: 'Modern, Conversational, Journey'
    },
    {
      id: 'crew',
      name: 'People as Crew',
      description: 'Stylized ship with crew members on deck, representing community learning and collaboration',
      icon: Users,
      colors: ['Ocean Blue', 'Coral', 'Soft Cream'],
      style: 'Community, Collaboration, Team'
    },
    {
      id: 'compass',
      name: 'Compass + Navigation',
      description: 'Clean compass icon representing navigation and guidance through the language learning journey',
      icon: Compass,
      colors: ['Ocean Blue', 'Coral', 'Accent Yellow'],
      style: 'Navigation, Guidance, Direction'
    },
    {
      id: 'wave',
      name: 'Wave & Journey',
      description: 'Wave icon symbolizing the journey and flow of language learning with community support',
      icon: Waves,
      colors: ['Ocean Blue', 'Coral', 'Accent Yellow'],
      style: 'Flow, Journey, Movement'
    },
    {
      id: 'default',
      name: 'Typography Only',
      description: 'Clean typography-focused logo with the new FluentShip color palette',
      icon: Palette,
      colors: ['Ocean Blue', 'Coral'],
      style: 'Clean, Typography, Minimal'
    }
  ]

  const taglines = [
    {
      category: 'Community / Friendship',
      taglines: [
        'Learn together. Speak with confidence.',
        'FluentShip — Where fluency meets friendship.',
        'Fluent learning starts with human connection.'
      ]
    },
    {
      category: 'Journey / Metaphor',
      taglines: [
        'Your journey to fluency begins here.',
        'FluentShip — Set sail for your next language.',
        'On FluentShip, you\'re never learning alone.'
      ]
    },
    {
      category: 'Outcome / Empowerment',
      taglines: [
        'Speak fluently. Live fully.',
        'Fluency is closer than you think.',
        'Learn a language. Join a crew. Change your world.'
      ]
    }
  ]

  const colorPalette = [
    { name: 'Ocean Blue', hex: '#0077b6', description: 'Trust, progress, calm — ties to the "ship" metaphor' },
    { name: 'Coral', hex: '#ff6b6b', description: 'Warmth, friendliness, passion — for community engagement' },
    { name: 'Soft Cream', hex: '#f6f5f3', description: 'Clean backdrop for trust and accessibility' },
    { name: 'Accent Yellow', hex: '#f4d35e', description: 'Highlighting CTA buttons or active icons' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f5f3] to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0077b6] via-[#005a8b] to-[#003d5f] text-white py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Ship className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">FluentShip Branding</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Welcome to FluentShip
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Where fluency meets friendship. Explore our new branding and logo concepts that capture the essence of community-powered language learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#ff6b6b] hover:bg-[#ff5252] px-8 py-4 text-lg font-semibold">
              <Download className="w-5 h-5 mr-2" />
              Download Assets
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
              <Globe className="w-5 h-5 mr-2" />
              View Guidelines
            </Button>
          </div>
        </div>
      </section>

      {/* Logo Showcase */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Logo Concepts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each logo variant represents a different aspect of our mission to create a community-powered language learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {logoVariants.map((variant) => (
              <Card 
                key={variant.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedVariant === variant.id ? 'ring-2 ring-[#0077b6] shadow-lg' : ''
                }`}
                onClick={() => setSelectedVariant(variant.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <variant.icon className="w-6 h-6 text-[#0077b6]" />
                    <Badge variant="secondary" className="text-xs">
                      {variant.style}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{variant.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-4">
                    <Logo size="lg" variant={variant.id as any} />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{variant.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Colors:</p>
                    <div className="flex flex-wrap gap-1">
                      {variant.colors.map((color) => (
                        <Badge key={color} variant="outline" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Logo Preview */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Selected Logo Preview
            </h3>
            <div className="flex flex-col items-center space-y-8">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg shadow-md mb-2">
                    <Logo size="sm" variant={selectedVariant as any} />
                  </div>
                  <p className="text-sm text-gray-600">Small</p>
                </div>
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg shadow-md mb-2">
                    <Logo size="md" variant={selectedVariant as any} />
                  </div>
                  <p className="text-sm text-gray-600">Medium</p>
                </div>
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg shadow-md mb-2">
                    <Logo size="lg" variant={selectedVariant as any} />
                  </div>
                  <p className="text-sm text-gray-600">Large</p>
                </div>
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg shadow-md mb-2">
                    <Logo size="xl" variant={selectedVariant as any} />
                  </div>
                  <p className="text-sm text-gray-600">Extra Large</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" className="border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
                <Button variant="outline" className="border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download SVG
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Color Palette
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our carefully chosen colors reflect the warmth, trust, and community spirit of FluentShip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {colorPalette.map((color) => (
              <Card key={color.name} className="text-center">
                <CardContent className="pt-6">
                  <div 
                    className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <h3 className="font-semibold text-gray-900 mb-2">{color.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 font-mono">{color.hex}</p>
                  <p className="text-xs text-gray-500">{color.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Taglines */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tagline Variations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Different messaging approaches to test with users and find the perfect voice for FluentShip.
            </p>
          </div>

          <Tabs defaultValue="community" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="journey">Journey</TabsTrigger>
              <TabsTrigger value="outcome">Outcome</TabsTrigger>
            </TabsList>

            {taglines.map((category) => (
              <TabsContent key={category.category} value={category.category.toLowerCase().split(' ')[0]}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.taglines.map((tagline, index) => (
                    <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-center mb-4">
                          {category.category.includes('Community') && <Users className="w-6 h-6 text-[#0077b6]" />}
                          {category.category.includes('Journey') && <Ship className="w-6 h-6 text-[#0077b6]" />}
                          {category.category.includes('Outcome') && <Star className="w-6 h-6 text-[#0077b6]" />}
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">{tagline}</p>
                        <Badge variant="outline" className="text-xs">
                          {category.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#0077b6] to-[#005a8b] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Set Sail?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join FluentShip and start your language learning journey with a community that supports your growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#ff6b6b] hover:bg-[#ff5252] px-8 py-4 text-lg font-semibold">
              <Heart className="w-5 h-5 mr-2" />
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
              <MessageCircle className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 