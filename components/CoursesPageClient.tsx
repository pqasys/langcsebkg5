'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { FaSpinner } from 'react-icons/fa';
import { Search, Filter, Star, Crown, TrendingUp, Tag } from 'lucide-react';
import { EnhancedCourseCard } from '@/components/EnhancedCourseCard';
import { AdvertisingBanner, PremiumCourseBanner, FeaturedInstitutionBanner, PromotionalBanner } from '@/components/AdvertisingBanner';
import { PromotionalSidebar } from '@/components/PromotionalSidebar';
import { TagFilter } from '@/components/TagFilter';
import EnrollmentModal from '../app/student/components/EnrollmentModal';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description?: string;
  institution: {
    id?: string;
    name: string;
    country?: string;
    city?: string;

    subscriptionPlan?: string;
    isFeatured?: boolean;
  } | null;
  status: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  base_price: number;
  hasOutstandingPayment?: boolean;
  payment?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
  pricingPeriod?: string;
  enrollmentDetails?: unknown;
  category?: {
    id: string;
    name: string;
  };
  courseTags?: Array<{
    id: string;
    tag: {
      id: string;
      name: string;
      color?: string;
      icon?: string;
    };
  }>;
  isPremiumPlacement?: boolean;
  isFeaturedPlacement?: boolean;
  isHighCommission?: boolean;
}

export default function CoursesPageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showAdvertising, setShowAdvertising] = useState(true);

  // Check for enrollment intent from URL parameters
  useEffect(() => {
    const enrollCourseId = searchParams.get('enroll');
    if (enrollCourseId && status === 'authenticated' && session?.user?.role === 'STUDENT') {
      setSelectedCourseId(enrollCourseId);
      setShowEnrollmentModal(true);
    }
  }, [searchParams, status, session]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/public?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      console.log('Fetched courses:', data.length, 'courses found');
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Failed to load courses. Please try again or contact support if the problem persists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    console.log('Initial courses count:', courses.length);
    console.log('Initial filtered courses:', filtered.length);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.institution?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('After search filter:', filtered.length);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => {
        if (statusFilter === 'AVAILABLE') {
          return course.status === 'PUBLISHED';
        }
        return false;
      });
      console.log('After status filter:', filtered.length);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(course => {
        switch (priorityFilter) {
          case 'featured':
            return course.isFeaturedPlacement;
          case 'premium':
            return course.isPremiumPlacement;
          case 'high-commission':
            return course.isHighCommission;
          default:
            return true;
        }
      });
      console.log('After priority filter:', filtered.length);
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(course => {
        const courseTagIds = course.courseTags?.map(ct => ct.tag.id) || [];
        return selectedTags.some(tagId => courseTagIds.includes(tagId));
      });
      console.log('After tag filter:', filtered.length);
    }

    console.log('Final filtered courses:', filtered.length);
    setFilteredCourses(filtered);
  }, [searchTerm, statusFilter, priorityFilter, selectedTags, courses]);

  const handleEnroll = (courseId: string) => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/courses?enroll=${courseId}`)}`);
      return;
    }

    if (session?.user?.role !== 'STUDENT') {
      // toast.error('Only students can enroll in courses');
      return;
    }

    setSelectedCourseId(courseId);
    setShowEnrollmentModal(true);
  };

  const handleEnrollmentComplete = () => {
    console.log('Enrollment completed, redirecting to student dashboard...');
    setShowEnrollmentModal(false);
    setSelectedCourseId(null);
    
    // Redirect to student dashboard after successful enrollment
    // Small delay to ensure the modal closes properly
    setTimeout(() => {
      router.push('/student');
    }, 500);
  };

  const handleView = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  // Get top courses for advertising
  const getTopCourses = () => {
    return courses
      .filter(course => course.isPremiumPlacement || course.isFeaturedPlacement)
      .slice(0, 3);
  };

  // Get featured institutions
  const getFeaturedInstitutions = () => {
    const featuredInstitutions = courses
      .filter(course => course.institution?.isFeatured)
      .map(course => course.institution)
      .filter((inst, index, arr) => arr.findIndex(i => i?.id === inst?.id) === index)
      .slice(0, 2);
    
    return featuredInstitutions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const topCourses = getTopCourses();
  const featuredInstitutions = getFeaturedInstitutions();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-gray-600 mt-2">
            Discover {filteredCourses.length} language courses from top institutions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvertising(!showAdvertising)}
          >
            {showAdvertising ? 'Hide' : 'Show'} Ads
          </Button>
        </div>
      </div>

      {/* Top Advertising Banner */}
      {showAdvertising && topCourses.length > 0 && (
        <div className="mb-8">
          <PremiumCourseBanner 
            course={topCourses[0]}
            className="mb-4"
          />
        </div>
      )}

      {/* Featured Institutions Banner */}
      {showAdvertising && featuredInstitutions.length > 0 && (
        <div className="mb-8">
          <FeaturedInstitutionBanner 
            institution={featuredInstitutions[0]}
            className="mb-4"
          />
        </div>
      )}

      {/* Promotional Banner */}
      {showAdvertising && (
        <div className="mb-8">
          <PromotionalBanner 
            offer={{
              title: "Summer Language Learning Sale",
              description: "Get 20% off on all courses this summer. Perfect time to start your language journey!",
              ctaText: "View Offers",
              ctaLink: "/offers",
              discount: "Save 20%"
            }}
            className="mb-4"
          />
        </div>
      )}

      {/* Filters Section */}
      <div className="space-y-4">
        {/* Search and Basic Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 search-container-long">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="AVAILABLE">Available</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="featured">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Featured
                  </div>
                </SelectItem>
                <SelectItem value="premium">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                  Premium
                </div>
              </SelectItem>
              <SelectItem value="high-commission">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Popular
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filter by tags:</span>
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          className="flex-1"
        />
      </div>
    </div>

      {/* Course Discovery Info */}
      <Alert className="bg-green-50 border-green-200">
        <Info className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Ready to get fluent faster?</strong> Start strong with expert-picked featured courses. Go Premium for smart tools and exclusive content!
        </AlertDescription>
      </Alert>

      {/* Mid-page Advertising */}
      {showAdvertising && filteredCourses.length > 6 && (
        <div className="my-8">
          <AdvertisingBanner
            type="sponsored"
            title="Sponsored: Language Learning Tools"
            description="Enhance your learning experience with our recommended language tools and resources."
            ctaText="Explore Tools"
            ctaLink="/tools"
            stats={{
              students: 2500,
              courses: 150
            }}
            highlight="Recommended"
          />
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="flex gap-8">
        {/* Courses Grid */}
        <div className="flex-1">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <EnhancedCourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
                onView={handleView}
                userRole={session?.user?.role}
                isAuthenticated={status === 'authenticated'}
                showPriorityIndicators={true}
                showAdvertising={showAdvertising}
              />
            ))}
          </div>
        </div>

        {/* Promotional Sidebar */}
        <div className="hidden xl:block">
          <PromotionalSidebar 
            maxItems={4}
            showSponsored={showAdvertising}
          />
        </div>
      </div>

      {/* Bottom Advertising */}
      {showAdvertising && filteredCourses.length > 0 && (
        <div className="mt-8">
          <AdvertisingBanner
            type="promotional"
            title="Join Our Language Community"
            description="Connect with fellow learners, share progress, and get exclusive access to community events and resources."
            ctaText="Join Community"
            ctaLink="/community"
            stats={{
              students: 5000,
              courses: 300
            }}
            highlight="Free Access"
          />
        </div>
      )}

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find more courses.
          </p>
          <Button onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setPriorityFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

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