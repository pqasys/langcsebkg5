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
import { FaSpinner } from 'react-icons/fa';
import { Search } from 'lucide-react';
import PayCourseButton from '@/app/student/components/PayCourseButton';
import EnrollmentModal from '../components/EnrollmentModal';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
  hasOutstandingPayment?: boolean;
  payment?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
  pricingPeriod?: string;
  enrollmentDetails?: unknown;
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

  const handleEnroll = (courseId: string) => {
    setSelectedCourseId(courseId);
    setShowEnrollmentModal(true);
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
          
          console.log('Course card:', { 
            id: course.id, 
            title: course.title, 
            status: course.status, 
            needsPayment, 
            hasPendingPayment,
            paymentStatus: course.payment?.status,
            hasOutstandingPayment: course.hasOutstandingPayment 
          });
          
          return (
            <Card key={course.id} className="flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2">
                  <CardTitle className="line-clamp-2 text-lg leading-tight">{course.title}</CardTitle>
                  <Badge variant={
                    isEnrolled ? 'default' :
                    isCompleted ? 'success' :
                    needsPayment ? 'warning' :
                    'secondary'
                  } className="self-start">
                    {course.status.replace('_', ' ')}
                  </Badge>
                </div>
                {course.institution?.name && (
                  <p className="text-sm text-muted-foreground">
                    {course.institution.name}
                  </p>
                )}
              </CardHeader>

              <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                  {course.description}
                </p>

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
                    <Button
                      onClick={() => handleEnroll(course.id)}
                      className="w-full h-12 text-base"
                    >
                      Enroll Now
                    </Button>
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