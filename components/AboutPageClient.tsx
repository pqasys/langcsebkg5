'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Globe, 
  Award, 
  Target, 
  Heart, 
  Zap, 
  Shield, 
  BookOpen,
  Star,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export default function AboutPageClient() {
  const stats: Stat[] = [
    {
      value: '50,000+',
      label: 'Active Learners',
      icon: <Users className="h-6 w-6" />
    },
    {
      value: '25+',
      label: 'Languages',
      icon: <Globe className="h-6 w-6" />
    },
    {
      value: '500+',
      label: 'Expert Instructors',
      icon: <Award className="h-6 w-6" />
    },
    {
      value: '95%',
      label: 'Success Rate',
      icon: <Target className="h-6 w-6" />
    }
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from course quality to user experience.',
      icon: <Star className="h-6 w-6" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'Innovation',
      description: 'We continuously innovate to provide the most effective language learning solutions.',
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Accessibility',
      description: 'We believe language learning should be accessible to everyone, everywhere.',
      icon: <Heart className="h-6 w-6" />,
      color: 'bg-red-500'
    },
    {
      title: 'Trust',
      description: 'We build trust through transparency, security, and reliable service.',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-green-500'
    }
  ];

  const team: TeamMember[] = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former linguistics professor with 15+ years of experience in language education technology.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Tech leader with expertise in AI, machine learning, and educational technology platforms.'
    },
    {
      name: 'Dr. Elena Rodriguez',
      role: 'Head of Education',
      bio: 'Curriculum specialist with a PhD in Applied Linguistics and 20+ years in language teaching.'
    },
    {
      name: 'David Kim',
      role: 'Head of Product',
      bio: 'Product strategist focused on creating intuitive and effective learning experiences.'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Platform Launch',
      description: 'Launched our first version with 5 languages and 100 courses.'
    },
    {
      year: '2021',
      title: 'Mobile App Release',
      description: 'Introduced our mobile app, making learning accessible on-the-go.'
    },
    {
      year: '2022',
      title: 'AI Integration',
      description: 'Implemented AI-powered personalized learning paths and recommendations.'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded to 25+ languages and reached 50,000+ active learners worldwide.'
    },
    {
      year: '2024',
      title: 'Institution Partnerships',
      description: 'Launched partnerships with educational institutions and corporate clients.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Fluentish
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to make language learning accessible, effective, and enjoyable for everyone. 
          Our platform combines cutting-edge technology with proven educational methods to help learners 
          achieve their language goals faster and more efficiently.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">
              To break down language barriers and connect people across cultures through innovative, 
              accessible, and effective language learning solutions. We believe that language is the 
              key to understanding, empathy, and global collaboration.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">
              To become the world's leading platform for language learning, empowering millions of 
              people to communicate confidently in any language, anywhere in the world.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how we're making a difference in language learning worldwide.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-gray-600 text-sm">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className={`${value.color} text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4`}>
                  {value.icon}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {value.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate individuals behind our mission to revolutionize language learning.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="bg-gray-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-500" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {member.name}
                </CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {member.role}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {member.bio}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Key milestones in our mission to transform language learning.
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-1/2 px-8">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{milestone.year}</Badge>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {milestone.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">
                        {milestone.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
                <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg relative z-10"></div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Mission
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Be part of the global community of language learners and help us break down barriers 
            one conversation at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/register">
                Start Learning Today
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 