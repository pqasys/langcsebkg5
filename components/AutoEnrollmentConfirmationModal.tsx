'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users,
  Calendar,
  BookOpen,
  Video,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDisplayLabel } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  marketingType: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  enrolledCount?: number;
  institution: {
    name: string;
  };
}

interface AutoEnrollmentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  subscriptionPlan: string;
  trialDays: number;
}

export default function AutoEnrollmentConfirmationModal({
  isOpen,
  onClose,
  course,
  subscriptionPlan,
  trialDays
}: AutoEnrollmentConfirmationModalProps) {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  console.log('🔍 AutoEnrollmentConfirmationModal props:', {
    isOpen,
    course: course ? { id: course.id, title: course.title } : null,
    subscriptionPlan,
    trialDays
  });
  
  // Debug: Log when modal should be shown
  if (isOpen && course) {
    console.log('🎯 AutoEnrollmentConfirmationModal should be visible!');
  } else if (isOpen && !course) {
    console.log('⚠️ Modal is open but no course data!');
  } else if (!isOpen) {
    console.log('🔒 Modal is closed');
  }

  if (!isOpen || !course) return null;

  const handleConfirmEnrollment = async () => {
    if (!course) return;
    
    setIsEnrolling(true);
    try {
      console.log('Starting direct enrollment for course:', course.id);
      
      // For subscription-based courses, use the direct enrollment API
      const response = await fetch(`/api/student/courses/${course.id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // For subscription-based courses, no additional payment is required
          startDate: new Date().toISOString(),
          endDate: course.endDate,
          // This will be handled as a subscription-based enrollment
          // since the user now has an active subscription
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Enrollment failed:', errorData);
        throw new Error(errorData.error || errorData.details || 'Failed to enroll in course');
      }

      const enrollmentData = await response.json();
      console.log('Enrollment successful:', enrollmentData);
      
      toast.success(`Successfully enrolled in "${course.title}"!`);
      
      // Clear any stored enrollment context
      sessionStorage.removeItem('pendingCourseEnrollment');
      sessionStorage.removeItem('fromEnrollment');
      
      // Close modal and redirect to student dashboard
      onClose();
      router.push('/student');
      
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to enroll in course');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleDeclineEnrollment = async () => {
    setIsDeclining(true);
    try {
      // Clear any stored enrollment context
      sessionStorage.removeItem('pendingCourseEnrollment');
      sessionStorage.removeItem('fromEnrollment');
      
      toast.success('No problem! You can enroll in this course anytime from your dashboard.');
      
      // Close modal and redirect to student dashboard
      onClose();
      router.push('/student');
      
    } catch (error) {
      console.error('Error declining enrollment:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsDeclining(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCourseTypeIcon = (marketingType: string) => {
    switch (marketingType) {
      case 'LIVE_ONLINE':
        return <Video className="w-4 h-4" />;
      case 'BLENDED':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <GraduationCap className="w-4 h-4" />;
    }
  };

  const getCourseTypeLabel = (marketingType: string) => formatDisplayLabel(marketingType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Subscription Activated!
              </h2>
              <p className="text-sm text-gray-600">
                Your {subscriptionPlan} plan with {trialDays}-day free trial is now active
              </p>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ready to enroll in your course?
            </h3>
            <p className="text-gray-600 mb-6">
              You originally wanted to enroll in this course. Since you now have an active subscription, 
              you can enroll immediately at no additional cost.
            </p>
          </div>

          {/* Course Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                    {course.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getCourseTypeIcon(course.marketingType)}
                      {getCourseTypeLabel(course.marketingType)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.enrolledCount || 0}/{course.maxStudents} enrolled
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {course.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(course.startDate)} - {formatDate(course.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Flexible schedule</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    No additional payment required - included in your subscription!
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDeclineEnrollment}
              variant="outline"
              disabled={isDeclining || isEnrolling}
              className="flex-1"
            >
              {isDeclining ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Maybe Later
                </>
              )}
            </Button>
            
            <Button
              onClick={handleConfirmEnrollment}
              disabled={isEnrolling || isDeclining}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isEnrolling ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Enrolling...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Enroll Now
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
