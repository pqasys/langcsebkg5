'use client'

import Link from 'next/link'
import { 
  FaGlobe, 
  FaUsers, 
  FaGraduationCap, 
  FaAward, 
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaHeadphones,
  FaVideo,
  FaCertificate,
  FaMobile,
  FaBrain,
  FaComments,
  FaBookOpen,
  FaClock,
  FaMapMarkerAlt,
  FaRocket,
  FaHeart,
  FaShieldAlt
} from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'



export default function StudentsPublicPage() {
  const benefits = [
    {
      icon: FaGlobe,
      title: 'Learn from Native Speakers',
      description: 'Connect with certified native speakers from around the world',
      details: ['Authentic pronunciation', 'Cultural insights', 'Real-world context', 'Native-level fluency']
    },
    {
      icon: FaVideo,
      title: 'Interactive Learning',
      description: 'Engage with multimedia content designed for optimal retention',
      details: ['HD video lessons', 'Audio exercises', 'Interactive quizzes', 'Progress tracking']
    },
    {
      icon: FaComments,
      title: 'Live Practice Sessions',
      description: 'Practice speaking with native speakers and fellow learners',
      details: ['Live conversations', 'Group sessions', 'Pronunciation feedback', 'Cultural exchange']
    },
    {
      icon: FaCertificate,
      title: 'Internationally Recognized',
      description: 'Earn certificates aligned with global language standards',
      details: ['CEFR aligned', 'Industry recognized', 'Digital certificates', 'Portfolio ready']
    },
    {
      icon: FaMobile,
      title: 'Learn Anywhere',
      description: 'Access your courses on any device, anytime, anywhere',
      details: ['Mobile apps', 'Offline learning', 'Cross-platform sync', '24/7 access']
    },
    {
      icon: FaBrain,
      title: 'AI-Powered Learning',
      description: 'Personalized learning paths that adapt to your progress',
      details: ['Smart recommendations', 'Difficulty adjustment', 'Learning analytics', 'Study reminders']
    }
  ]

  const languages = [
    { name: 'English', flag: 'gb', students: '25K+', level: 'Beginner to Advanced' },
    { name: 'Spanish', flag: 'es', students: '18K+', level: 'A1 to C2' },
    { name: 'French', flag: 'fr', students: '15K+', level: 'Beginner to Advanced' },
    { name: 'German', flag: 'de', students: '12K+', level: 'A1 to C2' },
    { name: 'Italian', flag: 'it', students: '10K+', level: 'Beginner to Advanced' },
    { name: 'Portuguese', flag: 'pt', students: '8K+', level: 'A1 to C2' },
    { name: 'Chinese', flag: 'cn', students: '6K+', level: 'Beginner to Advanced' },
    { name: 'Japanese', flag: 'jp', students: '5K+', level: 'A1 to C2' }
  ]

  const testimonials = [
    {
      name: 'Maria Santos',
      country: 'Brazil',
      language: 'English',
      content: 'Fluentish helped me achieve fluency in English in just 6 months. The native speakers and interactive lessons made all the difference.',
      rating: 5,
      achievement: 'B2 to C1 in 6 months'
    },
    {
      name: 'Ahmed Hassan',
      country: 'Egypt',
      language: 'German',
      content: 'The live conversation practice sessions are incredible. I can now confidently speak German in professional settings.',
      rating: 5,
      achievement: 'A2 to B2 in 8 months'
    },
    {
      name: 'Yuki Tanaka',
      country: 'Japan',
      language: 'Spanish',
      content: 'Learning Spanish with Fluentish has been amazing. The cultural content and native speakers make learning authentic and fun.',
      rating: 5,
      achievement: 'Beginner to B1 in 4 months'
    }
  ]

  const learningPaths = [
    {
      level: 'Beginner',
      description: 'Perfect for those starting their language journey',
      features: ['Basic vocabulary', 'Simple conversations', 'Pronunciation basics', 'Cultural introduction'],
      duration: '3-6 months',
      color: 'from-green-500 to-emerald-500'
    },
    {
      level: 'Intermediate',
      description: 'For learners with basic knowledge seeking fluency',
      features: ['Advanced grammar', 'Complex conversations', 'Business language', 'Cultural immersion'],
      duration: '6-12 months',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      level: 'Advanced',
      description: 'For near-fluent speakers aiming for mastery',
      features: ['Academic language', 'Professional contexts', 'Cultural nuances', 'Certification prep'],
      duration: '12-18 months',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const stats = [
    { number: '50K+', label: 'Active Students' },
    { number: '15+', label: 'Languages Available' },
    { number: '95%', label: 'Success Rate' },
    { number: '4.9/5', label: 'Student Rating' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Master Languages with Confidence
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join thousands of learners worldwide who have achieved fluency through our comprehensive 
            language learning platform with native speakers and interactive content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
                <FaPlay className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-colors duration-200">
                <FaRocket className="w-5 h-5 mr-2" />
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Fluentish?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the most effective way to learn languages with our comprehensive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 mb-6">{benefit.description}</p>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                        <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Learn 15+ Languages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From popular languages to niche dialects, we offer comprehensive courses for every learner.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {languages.map((language, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <img
                      src={`https://flagcdn.com/w160/${language.flag}.png`}
                      alt={`${language.name} flag`}
                      className="h-12 w-auto rounded-lg shadow-sm"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{language.name}</h3>
                  <p className="text-sm text-blue-600 mb-2">{language.students} students</p>
                  <p className="text-xs text-gray-500">{language.level}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold">
                Explore All Languages
                <FaArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Your Learning Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the path that matches your current level and learning goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${path.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <FaBookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{path.level}</h3>
                  <p className="text-gray-600 mb-6">{path.description}</p>
                  <ul className="space-y-2 mb-6">
                    {path.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="text-sm text-blue-600 font-medium">
                    Duration: {path.duration}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from real students who have achieved their language learning goals with Fluentish.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-blue-600 text-sm">{testimonial.language} • {testimonial.country}</div>
                    <div className="text-green-600 text-sm font-medium">{testimonial.achievement}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just 4 simple steps and begin your language learning journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Sign Up</h3>
              <p className="text-gray-600">Create your free account and choose your target language</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Choose Your Course</h3>
              <p className="text-gray-600">Browse courses from top institutions and select your perfect match</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Start Learning</h3>
              <p className="text-gray-600">Begin with interactive lessons and practice with native speakers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Achieve Fluency</h3>
              <p className="text-gray-600">Track your progress and earn certificates as you master your language</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4">
              <FaStar className="w-4 h-4 mr-2" />
              Premium Learning Plans
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock your full language learning potential with our comprehensive subscription plans designed for every level.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Basic Plan */}
            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$12.99</div>
                  <div className="text-gray-500">per month</div>
                </div>
                <p className="text-gray-600 mb-6 text-center">Perfect for beginners starting their language journey</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Access to 5 languages
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Basic video lessons
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Progress tracking
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Mobile app access
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$24.99</div>
                  <div className="text-gray-500">per month</div>
                </div>
                <p className="text-gray-600 mb-6 text-center">Most popular choice for serious language learners</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Access to all 15+ languages
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    HD video lessons
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Live conversation practice
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    AI-powered adaptive learning
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Offline downloads
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Premium certificates
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Choose Premium
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-purple-600 mb-2">$49.99</div>
                  <div className="text-gray-500">per month</div>
                </div>
                <p className="text-gray-600 mb-6 text-center">Complete experience with personal tutoring</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Everything in Premium
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    One-on-one tutoring sessions
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Custom learning paths
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Personal learning coach
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    24/7 support
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">
                    Go Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Plan Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Flexible Billing</h4>
              <p className="text-gray-600 text-sm">Monthly or annual plans with easy upgrades and downgrades</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h4>
              <p className="text-gray-600 text-sm">Multiple payment methods with enterprise-grade security</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadphones className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-gray-600 text-sm">Round-the-clock customer support for all subscription plans</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/pricing">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold">
                <FaArrowRight className="w-5 h-5 mr-2" />
                View All Plans & Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Language Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of learners who have already transformed their language skills with Fluentish.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
                <FaPlay className="w-5 h-5 mr-2" />
                Browse Courses
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-colors duration-200">
                <FaHeart className="w-5 h-5 mr-2" />
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 