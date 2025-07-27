'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Globe, 
  Zap, 
  Shield, 
  Headphones, 
  Smartphone, 
  BarChart3, 
  Award, 
  Clock, 
  Target, 
  MessageSquare 
} from 'lucide-react';
import Link from 'next/link';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'learning' | 'technology' | 'support' | 'analytics';
}

export default function FeaturesPageClient() {
  const features: Feature[] = [
    // Learning Features
    {
      title: 'Comprehensive Course Library',
      description: 'Access thousands of courses across multiple languages, skill levels, and learning styles.',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-blue-500',
      category: 'learning'
    },
    {
      title: 'Expert Instructors',
      description: 'Learn from certified language teachers and native speakers with years of experience.',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-green-500',
      category: 'learning'
    },
    {
      title: 'Interactive Learning',
      description: 'Engage with interactive exercises, quizzes, and real-world conversation scenarios.',
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'bg-purple-500',
      category: 'learning'
    },
    {
      title: 'Personalized Learning Paths',
      description: 'AI-powered recommendations that adapt to your learning style and progress.',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-orange-500',
      category: 'learning'
    },
    
    // Technology Features
    {
      title: 'Mobile-First Design',
      description: 'Learn anywhere, anytime with our responsive mobile-optimized platform.',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'bg-indigo-500',
      category: 'technology'
    },
    {
      title: 'Offline Learning',
      description: 'Download courses and continue learning even without an internet connection.',
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-yellow-500',
      category: 'technology'
    },
    {
      title: 'Multi-Platform Support',
      description: 'Seamless experience across web, mobile, and tablet devices.',
      icon: <Globe className="h-6 w-6" />,
      color: 'bg-teal-500',
      category: 'technology'
    },
    {
      title: 'Advanced Security',
      description: 'Enterprise-grade security to protect your data and learning progress.',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-red-500',
      category: 'technology'
    },
    
    // Analytics Features
    {
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and insights.',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'bg-pink-500',
      category: 'analytics'
    },
    {
      title: 'Performance Analytics',
      description: 'Get detailed reports on your strengths, weaknesses, and improvement areas.',
      icon: <Award className="h-6 w-6" />,
      color: 'bg-cyan-500',
      category: 'analytics'
    },
    {
      title: 'Time Management',
      description: 'Track your study time and optimize your learning schedule.',
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-emerald-500',
      category: 'analytics'
    },
    
    // Support Features
    {
      title: '24/7 Support',
      description: 'Get help whenever you need it with our comprehensive support system.',
      icon: <Headphones className="h-6 w-6" />,
      color: 'bg-violet-500',
      category: 'support'
    }
  ];

  const categories = [
    { id: 'learning', name: 'Learning Experience', description: 'Core learning features and tools' },
    { id: 'technology', name: 'Technology', description: 'Advanced technology and platform features' },
    { id: 'analytics', name: 'Analytics & Progress', description: 'Tracking and reporting capabilities' },
    { id: 'support', name: 'Support & Community', description: 'Help and community features' }
  ];

  const getFeaturesByCategory = (categoryId: string) => {
    return features.filter(feature => feature.category === categoryId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Powerful Features for Effective Language Learning
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the comprehensive suite of tools and features designed to make your language learning journey 
          engaging, effective, and enjoyable.
        </p>
      </div>

      {/* Features by Category */}
      {categories.map((category) => (
        <div key={category.id} className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {category.name}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFeaturesByCategory(category.id).map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className={`${feature.color} text-white rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Key Benefits Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our comprehensive language learning solution.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Expert Instructors
            </h3>
            <p className="text-gray-600">
              Learn from certified teachers and native speakers
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Personalized Learning
            </h3>
            <p className="text-gray-600">
              AI-powered recommendations tailored to your needs
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 text-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mobile-First Design
            </h3>
            <p className="text-gray-600">
              Learn anywhere, anytime with mobile optimization
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 text-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Progress Tracking
            </h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed analytics
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built with Modern Technology
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform leverages cutting-edge technology to deliver the best learning experience.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Next.js', description: 'React Framework' },
            { name: 'TypeScript', description: 'Type Safety' },
            { name: 'Tailwind CSS', description: 'Styling' },
            { name: 'Prisma', description: 'Database ORM' },
            { name: 'NextAuth.js', description: 'Authentication' },
            { name: 'PostgreSQL', description: 'Database' },
            { name: 'Vercel', description: 'Deployment' },
            { name: 'PWA', description: 'Progressive Web App' }
          ].map((tech, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-1">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Start your language learning journey today and discover how our comprehensive features 
            can help you achieve your language goals faster and more effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/register">
                Start Free Trial
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 