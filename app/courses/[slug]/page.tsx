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
import { Rating as StarRating } from '@/components/ui/rating';
import { formatDisplayLabel } from '@/lib/utils';

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
  priority?: number;
  hasLiveClasses: boolean;
  liveClassType?: string;
  liveClassFrequency?: string;
  liveClassSchedule?: any;
  isPlatformCourse: boolean;
  requiresSubscription: boolean;
  subscriptionTier?: string;
  marketingType: string;
  marketingDescription?: string;
  createdAt?: string;
  updatedAt?: string;
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
  const [myRating, setMyRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const formatPricingPeriod = (period?: string) => {
    if (!period) return '';
    const key = period.toLowerCase();
    if (key === 'full_course' || key === 'full course' || key === 'fullcourse') {
      return 'Full Course';
    }
    if (key === 'month' || key === 'monthly') return 'Month';
    if (key === 'week' || key === 'weekly') return 'Week';
    if (key === 'session' || key === 'per_session') return 'Session';
    if (key === 'lesson' || key === 'per_lesson') return 'Lesson';
    return period
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  };

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

  const handleSubmitRating = async () => {
    if (!course || !myRating) return;
    try {
      setIsSubmittingRating(true);
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType: 'COURSE', targetId: course.id, rating: myRating }),
      });
      if (!res.ok) {
        console.error('Failed to submit rating');
      }
    } catch (e) {
      console.error('Error submitting rating', e);
    } finally {
      setIsSubmittingRating(false);
    }
  };

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
        {/* Breadcrumbs */}
        <div className="mb-4 text-sm text-gray-600">
          <Link href="/courses" className="hover:underline">Courses</Link>
          {course.category ? (
            <>
              <span className="mx-2">/</span>
              <Link href={`/search?category=${encodeURIComponent(course.category.slug)}`} className="hover:underline">
                {course.category.name}
              </Link>
            </>
          ) : null}
          <span className="mx-2">/</span>
          <span className="text-gray-900">{course.title}</span>
        </div>

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
                  <div className="flex flex-wrap items-center gap-2 text-white">
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
                    {course.level && (
                      <Badge variant="secondary" className="bg-blue-400 text-blue-900">
                        {formatDisplayLabel(course.level)}
                      </Badge>
                    )}
                    {course.status && (
                      <Badge variant="secondary" className="bg-white/90 text-gray-900">
                        Status: {course.status}
                      </Badge>
                    )}
                    {course.requiresSubscription && (
                      <Badge variant="secondary" className="bg-purple-300 text-purple-900">
                        Requires Subscription{course.subscriptionTier ? ` (${course.subscriptionTier})` : ''}
                      </Badge>
                    )}
                    {course.isPlatformCourse && (
                      <Badge variant="secondary" className="bg-indigo-300 text-indigo-900">
                        Platform Course
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {/* Price/Subscription pill */}
              <div className="mt-4">
                {(course.isPlatformCourse && course.requiresSubscription) ? (
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 text-gray-900 font-semibold shadow">
                    <span>Included in {course.subscriptionTier || 'Subscription'}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 text-gray-900 font-semibold shadow">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${course.base_price} / {formatPricingPeriod(course.pricingPeriod)}
                  </div>
                )}
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
                {course.marketingDescription && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold mb-2">Why take this course?</h3>
                    <p className="text-gray-700 leading-relaxed">{course.marketingDescription}</p>
                  </div>
                )}
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
                    {course.endDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className="font-medium">{new Date(course.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Framework</p>
                        <p className="font-medium">{formatDisplayLabel(course.framework)}</p>
                      </div>
                    </div>
                    {!(course.isPlatformCourse && course.requiresSubscription) && (
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="font-medium">${course.base_price} per {formatPricingPeriod(course.pricingPeriod)}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Delivery</p>
                        <p className="font-medium">{formatDisplayLabel(course.marketingType)}</p>
                      </div>
                    </div>
                    {course.hasLiveClasses && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Live Classes</p>
                          <p className="font-medium">{course.liveClassType} {course.liveClassFrequency ? `• ${course.liveClassFrequency}` : ''}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Class Schedule */}
            {course.hasLiveClasses && course.liveClassSchedule && (
              <Card>
                <CardHeader>
                  <CardTitle>Live Class Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700">
                    {typeof course.liveClassSchedule === 'string' ? (
                      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded border border-gray-100">{course.liveClassSchedule}</pre>
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded border border-gray-100">{JSON.stringify(course.liveClassSchedule, null, 2)}</pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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
                      <div className="text-sm text-gray-600">
                        {course.institution.isApproved ? (
                          <span className="inline-flex items-center"><span className="mr-1">✔</span>Approved</span>
                        ) : (
                          <span className="inline-flex items-center"><span className="mr-1">•</span>Pending Approval</span>
                        )}
                        {course.institution.status ? (
                          <span className="ml-2">• Status: {course.institution.status}</span>
                        ) : null}
                      </div>
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

            {/* Meta & Access */}
            <Card>
              <CardHeader>
                <CardTitle>Access & Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <span>Requires Subscription</span>
                    <span className="font-medium">{course.requiresSubscription ? `Yes${course.subscriptionTier ? ` (${course.subscriptionTier})` : ''}` : 'No'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Platform Course</span>
                    <span className="font-medium">{course.isPlatformCourse ? 'Yes' : 'No'}</span>
                  </div>
                  {typeof course.priority !== 'undefined' && (
                    <div className="flex items-center justify-between">
                      <span>Priority</span>
                      <span className="font-medium">{course.priority}</span>
                    </div>
                  )}
                  {course.createdAt && (
                    <div className="flex items-center justify-between">
                      <span>Created</span>
                      <span className="font-medium">{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {course.updatedAt && (
                    <div className="flex items-center justify-between">
                      <span>Last Updated</span>
                      <span className="font-medium">{new Date(course.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Your Rating (does not alter existing displayed ratings) */}
            <Card>
              <CardHeader>
                <CardTitle>Your Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <StarRating value={myRating ?? 0} onChange={(v) => setMyRating(v)} />
                <Button className="mt-4 w-full" onClick={handleSubmitRating} disabled={isSubmittingRating || !myRating}>
                  {isSubmittingRating ? 'Saving...' : 'Submit Rating'}
                </Button>
              </CardContent>
            </Card>

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
                  {course.requiresSubscription && (
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/subscription-signup">Subscription Options</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
