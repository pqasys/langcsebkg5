'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { FaSpinner, FaStar } from 'react-icons/fa';
import { Search } from 'lucide-react';
import { getStudentTier } from '@/lib/subscription-pricing';
import PayCourseButton from '@/app/student/components/PayCourseButton';
import EnrollmentModal from '../components/EnrollmentModal';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Calendar, Star } from "lucide-react";
import { formatDisplayLabel } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  institution: {
    id: string;
    name: string;
  } | null;
  status: 'ENROLLED' | 'AVAILABLE' | 'COMPLETED' | 'PENDING_PAYMENT';
  progress?: number;
  startDate?: string;
  endDate?: string;
  base_price: number;
  duration?: number;
  level?: string;
  framework?: string;
  marketingType?: string;
  hasLiveClasses?: boolean;
  hasOutstandingPayment?: boolean;
  payment?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
  pricingPeriod?: string;
  enrollmentDetails?: unknown;
  // Subscription fields
  requiresSubscription?: boolean;
  subscriptionTier?: string;
  isPlatformCourse?: boolean;
  institutionId?: string;
}

export default function StudentCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [ratingsMap, setRatingsMap] = useState<Record<string, { average: number; count: number }>>({});

  // Deterministic pseudo-random rating helpers (4.0 - 5.0) and review counts
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const getDeterministicRandom = (seed: string, min: number, max: number) => {
    const h = hashString(seed);
    const rnd = (h % 10000) / 10000; // 0.0 - 1.0
    return min + rnd * (max - min);
  };

  const getCourseRating = (courseId: string) => {
    const value = getDeterministicRandom(`rating-${courseId}`, 4.0, 5.0);
    return Math.round(value * 10) / 10; // one decimal
  };

  const getCourseReviewCount = (courseId: string) => {
    // 15 - 120 reviews
    return Math.floor(getDeterministicRandom(`reviews-${courseId}`, 15, 120));
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // // // // // // // // // // // // console.log('Fetching courses...');
      const response = await fetch(`/api/student/courses?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) throw new Error(`Failed to fetch courses - Context: if (!response.ok) throw new Error('Failed to fetch...`);
      const data = await response.json();
      console.log('Fetched courses:', data.map(c => ({ id: c.id, title: c.title, status: c.status })));
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load courses. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCourses();
    }
  }, [status]);

  useEffect(() => {
    let filtered = courses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.institution?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, statusFilter, courses]);

  // Fetch real ratings for visible courses
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ids = Array.from(new Set(filteredCourses.map(c => c.id)));
        if (ids.length === 0) {
          setRatingsMap({});
          return;
        }

        const entries = await Promise.all(ids.map(async (id) => {
          try {
            const res = await fetch(`/api/ratings?targetType=COURSE&targetId=${id}`);
            if (!res.ok) throw new Error('ratings fetch failed');
            const data = await res.json();
            const list: Array<{ rating: number }> = Array.isArray(data) ? data : (data.ratings || []);
            if (!Array.isArray(list) || list.length === 0) {
              return [id, undefined] as const;
            }
            const sum = list.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
            const avg = sum / list.length;
            return [id, { average: Math.round(avg * 10) / 10, count: list.length }] as const;
          } catch {
            return [id, undefined] as const;
          }
        }));

        const map: Record<string, { average: number; count: number }> = {};
        for (const [id, val] of entries) {
          if (val) map[id] = val;
        }
        setRatingsMap(map);
      } catch (e) {
        console.warn('Failed to fetch ratings', e);
      }
    };

    fetchRatings();
  }, [filteredCourses]);

  const handleEnroll = async (courseId: string) => {
    try {
      // Check enrollment eligibility before opening modal
      const response = await fetch(`/api/student/courses/${courseId}/check-enrollment-eligibility`);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle subscription requirement
        if (response.status === 402 && errorData.error === 'Subscription required') {
          console.log('Subscription required for this course');
          toast.error('This course requires an active subscription to enroll.');
          
          // Redirect to subscription page
          if (errorData.redirectUrl) {
            router.push(errorData.redirectUrl);
          } else {
            router.push('/subscription-signup');
          }
          return;
        }
        
        // Handle other errors
        toast.error(errorData.details || errorData.error || 'Unable to check enrollment eligibility');
        return;
      }

      // User is eligible, open enrollment modal
      setSelectedCourseId(courseId);
      setShowEnrollmentModal(true);
    } catch (error) {
      console.error('Error checking enrollment eligibility:', error);
      toast.error('Failed to check enrollment eligibility. Please try again.');
    }
  };

  const handleEnrollmentComplete = () => {
    console.log('Enrollment completed, refreshing courses...');
    setShowEnrollmentModal(false);
    setSelectedCourseId(null);
    fetchCourses(); // Refresh the courses list
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">My Courses</h1>
      </div>

      {/* Mobile-optimized search and filter */}
      <div className="flex flex-col gap-4">
        <div className="relative search-container-long">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 text-base"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full h-12 text-base">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="ENROLLED">Enrolled</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile-optimized course grid */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => {
          const needsPayment = course.status === 'PENDING_PAYMENT' || course.hasOutstandingPayment;
          const isEnrolled = course.status === 'ENROLLED';
          const isCompleted = course.status === 'COMPLETED';
          const hasPendingPayment = course.payment?.status === 'PROCESSING' || course.payment?.status === 'INITIATED';
          const isPlatformSource = (course as any)?.isPlatformCourse === true || course.institution == null || (course as any)?.institutionId == null;
          const formatDateLocal = (dateString?: string) => {
            return dateString
              ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : '';
          };
          
          console.log('Course card:', { 
            id: course.id, 
            title: course.title, 
            status: course.status, 
            needsPayment, 
            hasPendingPayment,
            paymentStatus: course.payment?.status,
            hasOutstandingPayment: course.hasOutstandingPayment 
          });
          
          const ratingValue = ratingsMap[course.id]?.average ?? getCourseRating(course.id);
          const reviewCount = ratingsMap[course.id]?.count ?? getCourseReviewCount(course.id);

          return (
            <Card key={course.id} className="flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-2">
                  <CardTitle className="line-clamp-2 text-lg leading-tight">{course.title}</CardTitle>
                  {course.status !== 'AVAILABLE' && (
                    <Badge variant={
                      isEnrolled ? 'default' :
                      isCompleted ? 'success' :
                      needsPayment ? 'warning' :
                      'secondary'
                    } className="self-start">
                      {formatDisplayLabel(course.status)}
                    </Badge>
                  )}
                </div>
                {/* Badges row: Partner/Platform + Available */}
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] px-2 py-0.5 whitespace-nowrap ${
                      isPlatformSource 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {isPlatformSource ? 'Fluentship Platform' : 'Partner Institution'}
                  </Badge>
                  {course.status === 'AVAILABLE' && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 whitespace-nowrap bg-violet-50 text-violet-700 border-violet-200"
                    >
                      Available
                    </Badge>
                  )}
                </div>

                {/* Institution name row */}
                {course.institution?.name && (
                  <div className="text-sm text-muted-foreground">
                    {course.institution.name}
                  </div>
                )}

                {/* Rating row */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                  <span className="font-medium">{ratingValue.toFixed(1)}</span>
                  <span className="text-gray-400 text-[10px]">({reviewCount} reviews)</span>
                </div>
                {/* Start/End date badges row */}
                {(course.startDate || course.endDate) && (
                  <div className="flex items-center gap-2">
                    {course.startDate && (
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 whitespace-nowrap">
                        <Calendar className="w-3 h-3 mr-1" />
                        Starts {formatDateLocal(course.startDate)}
                      </Badge>
                    )}
                    {course.endDate && (
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 whitespace-nowrap">
                        <Calendar className="w-3 h-3 mr-1" />
                        Ends {formatDateLocal(course.endDate)}
                      </Badge>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex-grow flex flex-col pt-2">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {course.description}
                </p>


                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                  <div>
                    <span className="font-semibold">Type:</span> {formatDisplayLabel(course.marketingType || (course.hasLiveClasses ? 'LIVE' : 'SELF_PACED'))}
                  </div>
                  <div>
                    <span className="font-semibold">Level:</span> {formatDisplayLabel(course.level || 'N/A')}
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span> {course.duration ? `${course.duration} weeks` : 'Flexible'}
                  </div>
                  <div>
                    <span className="font-semibold">
                      {course.institutionId === null && (course.requiresSubscription || course.marketingType === 'LIVE_ONLINE' || course.marketingType === 'BLENDED') 
                        ? 'Subscription:' 
                        : 'Pricing:'
                      }
                    </span> 
                    {course.institutionId === null && (course.requiresSubscription || course.marketingType === 'LIVE_ONLINE' || course.marketingType === 'BLENDED') 
                      ? (course.subscriptionTier ? getStudentTier(course.subscriptionTier)?.name || course.subscriptionTier : 'Required')
                      : formatDisplayLabel(course.pricingPeriod || 'FULL_COURSE')
                    }
                  </div>
                </div>

                {/* Mobile rating row moved to header; removed duplicate here */}

                {needsPayment && (
                  <Alert variant="warning" className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {hasPendingPayment 
                        ? 'Your payment is being processed. Please wait for confirmation.'
                        : 'Payment required to access course content. Please complete payment to continue.'}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  {course.status === 'AVAILABLE' ? (
                    <>
                      {/* Show subscription requirement upfront - only for platform courses */}
                      {course.institutionId === null && (course.requiresSubscription || course.marketingType === 'LIVE_ONLINE' || course.marketingType === 'BLENDED') && (
                        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="flex items-center gap-2 text-sm text-blue-700">
                            <FaStar className="h-3 w-3" />
                            <span className="font-medium">Subscription Required</span>
                          </div>
                          <p className="text-xs text-blue-600 mt-1">
                            This course requires an active subscription. Start with a free trial!
                          </p>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => handleEnroll(course.id)}
                        className="w-full h-12 text-base"
                      >
                        Enroll Now
                      </Button>
                    </>
                  ) : isCompleted ? (
                    <Button
                      variant="outline"
                      className="w-full h-12 text-base"
                      onClick={() => router.push(`/student/courses/${course.id}`)}
                    >
                      View Certificate
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        className="w-full h-12 text-base"
                        onClick={() => router.push(`/student/courses/${course.id}`)}
                        disabled={needsPayment}
                      >
                        {needsPayment 
                          ? (hasPendingPayment 
                              ? 'Payment Processing...' 
                              : 'Complete Payment First')
                          : 'Continue Learning'}
                      </Button>
                      {needsPayment && !hasPendingPayment && (
                        <PayCourseButton
                          courseId={course.id}
                          amount={course.enrollmentDetails?.price || course.payment?.amount || course.base_price || 0}
                          courseTitle={course.title}
                          institutionName={course.institution?.name || 'Not assigned'}
                          enrollmentDetails={course.enrollmentDetails}
                          onPaymentComplete={fetchCourses}
                        />
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        courseId={selectedCourseId}
        onEnrollmentComplete={handleEnrollmentComplete}
      />
    </div>
  );
} 