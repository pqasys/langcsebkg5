'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Users, 
  BookOpen, 
  Star, 
  Building2,
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { Rating as StarRating } from '@/components/ui/rating';
import { formatDisplayLabel } from '@/lib/utils';

interface Institution {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postcode?: string;
  email: string;
  website?: string;
  telephone?: string;
  contactName?: string;
  contactJobTitle?: string;
  contactPhone?: string;
  contactEmail?: string;
  logoUrl?: string;
  facilities?: string;
  status: string;
  isApproved: boolean;
  isFeatured: boolean;
  subscriptionPlan: string;
  mainImageUrl?: string;
  courses?: {
    id: string;
    title: string;
    description?: string;
    base_price: number;
    duration: number;
    level: string;
    status: string;
  }[]
}

export default function InstitutionDetails() {
  const params = useParams();
  const router = useRouter();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        // Add debugging to see what slug we're trying to fetch
        console.log('🔍 Fetching institution with slug:', params.slug);
        
        // Validate slug before making the request
        if (!params.slug || params.slug === 'undefined') {
          console.error('❌ Invalid slug:', params.slug);
          setError('Invalid institution URL');
          setLoading(false);
          return;
        }

        // Use slug-based API endpoint
        const response = await fetch(`/api/institutions/slug/${params.slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Institution not found');
          } else {
            throw new Error(`Failed to fetch institution details - Status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          
          // Normalize facilities to ensure it's always an array
          const institutionData = {
            ...data,
            facilities: Array.isArray(data.facilities) ? data.facilities : []
          };
          
          setInstitution(institutionData);
        }
      } catch (error) {
        console.error('Error fetching institution:', error);
        setError('Failed to load institution details');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a valid slug and the component is mounted
    if (mounted && params.slug && params.slug !== 'undefined') {
      fetchInstitution();
    } else if (mounted && (!params.slug || params.slug === 'undefined')) {
      console.error('❌ No valid slug provided:', params.slug);
      setError('Invalid institution URL');
      setLoading(false);
    }
  }, [params.slug, mounted]);

  const handleSubmitRating = async () => {
    if (!institution || !myRating) return;
    try {
      setIsSubmittingRating(true);
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType: 'INSTITUTION', targetId: institution.id, rating: myRating }),
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

  if (error || !institution) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Institution Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The institution you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/institutions')}>
            Browse All Institutions
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
            {institution.mainImageUrl && (
              <img 
                src={institution.mainImageUrl} 
                alt={institution.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-4">
                {institution.logoUrl && (
                  <img 
                    src={institution.logoUrl} 
                    alt={`${institution.name} logo`}
                    className="w-16 h-16 rounded-lg bg-white p-2"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{institution.name}</h1>
                  <div className="flex items-center space-x-4 text-white">
                    {institution.isFeatured && (
                      <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
                        <Star className="w-4 h-4 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-green-400 text-green-900">
                      {institution.subscriptionPlan}
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
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  About {institution.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{institution.description}</p>
              </CardContent>
            </Card>

            {/* Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Available Courses ({institution.courses?.filter(course => course.status === 'ACTIVE' || course.status === 'PUBLISHED').length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {institution.courses?.filter(course => course.status === 'ACTIVE' || course.status === 'PUBLISHED').length > 0 ? (
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {institution.courses?.filter(course => course.status === 'ACTIVE' || course.status === 'PUBLISHED').map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {formatDisplayLabel(course.level)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {course.duration} weeks
                          </div>
                          <div className="flex items-center text-lg font-semibold text-blue-600">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {course.base_price}
                          </div>
                        </div>
                        <Button 
                          asChild
                          className="w-full mt-4"
                        >
                          <Link href={`/courses/${(course as any).slug || course.id}`}>
                            View Course
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No courses available at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-900">{institution.address}</p>
                    <p className="text-sm text-gray-500">
                      {institution.city}{institution.state && `, ${institution.state}`}, {institution.country}
                    </p>
                  </div>
                </div>
                
                {institution.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-3" />
                    <a 
                      href={institution.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {institution.website}
                    </a>
                  </div>
                )}
                
                {institution.telephone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{institution.telephone}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-900">{institution.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Courses</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {institution.courses?.filter(course => course.status === 'ACTIVE' || course.status === 'PUBLISHED').length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Plan</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {institution.subscriptionPlan}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href={`/institutions/${institution.slug}/courses`}>
                      Browse All Courses
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/institutions">
                      View All Institutions
                    </Link>
                  </Button>
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
          </div>
        </div>
      </div>
    </div>
  );
}
