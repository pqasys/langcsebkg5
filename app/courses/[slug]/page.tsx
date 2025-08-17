'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Users, 
  BookOpen, 
  Star, 
  Calendar,
  DollarSign,
  Building2,
  Tag,
  Globe
} from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  duration: number;
  level: string;
  status: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  base_price: number;
  pricingPeriod: string;
  framework: string;
  isFeatured: boolean;
  isSponsored: boolean;
  hasLiveClasses: boolean;
  liveClassType?: string;
  liveClassFrequency?: string;
  isPlatformCourse: boolean;
  requiresSubscription: boolean;
  subscriptionTier?: string;
  marketingType: string;
  marketingDescription?: string;
  institution?: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    isApproved: boolean;
    status: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
    color?: string;
    icon?: string;
  }>;
}

export default function CourseDetails() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Add debugging to see what slug we're trying to fetch
        console.log('🔍 Fetching course with slug:', params.slug);
        
        // Validate slug before making the request
        if (!params.slug || params.slug === 'undefined') {
          console.error('❌ Invalid slug:', params.slug);
          setError('Invalid course URL');
          setLoading(false);
          return;
        }

        // Use slug-based API endpoint
        const response = await fetch(`/api/courses/slug/${params.slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Course not found');
          } else {
            throw new Error(`Failed to fetch course details - Status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setCourse(data);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a valid slug and the component is mounted
    if (mounted && params.slug && params.slug !== 'undefined') {
      fetchCourse();
    } else if (mounted && (!params.slug || params.slug === 'undefined')) {
      console.error('❌ No valid slug provided:', params.slug);
      setError('Invalid course URL');
      setLoading(false);
    }
  }, [params.slug, mounted]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The course you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/courses')}>
            Browse All Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-4">
                {course.institution?.logoUrl && (
                  <img 
                    src={course.institution.logoUrl} 
                    alt={`${course.institution.name} logo`}
                    className="w-16 h-16 rounded-lg bg-white p-2"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
                  <div className="flex items-center space-x-4 text-white">
                    {course.isFeatured && (
                      <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
                        <Star className="w-4 h-4 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {course.isSponsored && (
                      <Badge variant="secondary" className="bg-green-400 text-green-900">
                        Sponsored
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-blue-400 text-blue-900">
                      {course.level}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {course.description || 'No description available for this course.'}
                </p>
              </CardContent>
            </Card>

            {/* Course Details */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">{course.duration} weeks</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Max Students</p>
                        <p className="font-medium">{course.maxStudents}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-medium">{new Date(course.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Framework</p>
                        <p className="font-medium">{course.framework}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-medium">${course.base_price} per {course.pricingPeriod.toLowerCase()}</p>
                      </div>
                    </div>
                    
                    {course.hasLiveClasses && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Live Classes</p>
                          <p className="font-medium">{course.liveClassType} - {course.liveClassFrequency}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Course Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <Badge 
                        key={tag.id} 
                        variant="outline"
                        style={{ 
                          borderColor: tag.color || '#e5e7eb',
                          color: tag.color || '#6b7280'
                        }}
                      >
                        {tag.icon && <span className="mr-1">{tag.icon}</span>}
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Institution Information */}
            {course.institution && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Institution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    {course.institution.logoUrl && (
                      <img 
                        src={course.institution.logoUrl} 
                        alt={`${course.institution.name} logo`}
                        className="w-12 h-12 rounded-lg bg-gray-100 p-2"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{course.institution.name}</h3>
                      <p className="text-sm text-gray-600">Approved Institution</p>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/institutions/${course.institution.slug}`}>
                      View Institution
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Category */}
            {course.category && (
              <Card>
                <CardHeader>
                  <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-sm">
                    {course.category.name}
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Enroll Now
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/courses">
                      Browse All Courses
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
