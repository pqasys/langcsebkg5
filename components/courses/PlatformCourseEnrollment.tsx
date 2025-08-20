'use client';

import { useState } from 'react';
import { formatDisplayLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Lock, Users, Clock, Video } from 'lucide-react';

interface PlatformCourseEnrollmentProps {
  course: {
    id: string;
    title: string;
    description?: string;
    level: string;
    duration: number;
    maxStudents: number;
    hasLiveClasses: boolean;
    liveClassType?: string;
    courseType: string;
    deliveryMode: string;
    enrollmentType: string;
    requiresSubscription: boolean;
    subscriptionTier?: string;
  };
  userId: string;
  onEnrollmentSuccess?: (enrollment: any) => void;
}

interface EnrollmentCheck {
  canEnroll: boolean;
  reason?: string;
  limits?: {
    current: number;
    max: number;
    remaining: number;
  };
}

export function PlatformCourseEnrollment({ 
  course, 
  userId, 
  onEnrollmentSuccess 
}: PlatformCourseEnrollmentProps) {
  const [loading, setLoading] = useState(false);
  const [enrollmentCheck, setEnrollmentCheck] = useState<EnrollmentCheck | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const checkEnrollmentEligibility = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/platform-courses/enroll?courseId=${course.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setEnrollmentCheck(data);
      } else {
        setError(data.error || 'Failed to check enrollment eligibility');
      }
    } catch (error) {
      console.error('Error checking enrollment eligibility:', error);
      setError('Failed to check enrollment eligibility');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/platform-courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: course.id }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        onEnrollmentSuccess?.(data.enrollment);
      } else {
        setError(data.error || 'Failed to enroll in course');
        if (data.details) {
          console.error('Enrollment details:', data.details);
        }
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setError('Failed to enroll in course');
    } finally {
      setLoading(false);
    }
  };

  const getCourseTypeLabel = (courseType: string) => {
    const labels = {
      'STANDARD': 'Self-Paced Course',
      'LIVE_ONLY': 'Live Classes Only',
      'BLENDED': 'Blended Learning',
      'PLATFORM_LIVE': 'Platform Live Course'
    };
    return labels[courseType] || 'Course';
  };

  const getDeliveryModeLabel = (deliveryMode: string) => {
    const labels = {
      'SELF_PACED': 'Self-Paced',
      'LIVE_ONLY': 'Live Classes Only',
      'BLENDED': 'Blended Learning',
      'PLATFORM_LIVE': 'Platform Live'
    };
    return labels[deliveryMode] || 'Self-Paced';
  };

  const getEnrollmentTypeLabel = (enrollmentType: string) => {
    const labels = {
      'COURSE_BASED': 'One-time Purchase',
      'SUBSCRIPTION_BASED': 'Subscription Required'
    };
    return labels[enrollmentType] || 'One-time Purchase';
  };

  if (success) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Successfully enrolled in {course.title}! You can now access the course content.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{course.title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {getCourseTypeLabel(course.courseType)}
            </Badge>
            {course.hasLiveClasses && (
              <Badge variant="outline">
                <Video className="w-3 h-3 mr-1" />
                Live Classes
              </Badge>
            )}
            {course.requiresSubscription && (
              <Badge variant="destructive">
                <Lock className="w-3 h-3 mr-1" />
                Subscription Required
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {getDeliveryModeLabel(course.deliveryMode)}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration} hours</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Max {course.maxStudents} students</span>
            </div>
            <Badge variant="outline">{formatDisplayLabel(course.level)}</Badge>
          </div>
        </div>

        {course.description && (
          <p className="text-sm text-muted-foreground">
            {course.description}
          </p>
        )}

        {/* Enrollment Status */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {getEnrollmentTypeLabel(course.enrollmentType)}
            </span>
            
            {!enrollmentCheck && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={checkEnrollmentEligibility}
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Check Eligibility'}
              </Button>
            )}
          </div>

          {enrollmentCheck && (
            <div className="space-y-3">
              {enrollmentCheck.canEnroll ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enrollment Status</span>
                    <span className="text-green-600 font-medium">Available</span>
                  </div>
                  
                  {enrollmentCheck.limits && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Your Enrollments</span>
                        <span>{enrollmentCheck.limits.current}/{enrollmentCheck.limits.max}</span>
                      </div>
                      <Progress 
                        value={(enrollmentCheck.limits.current / enrollmentCheck.limits.max) * 100} 
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        {enrollmentCheck.limits.remaining > 0 
                          ? `${enrollmentCheck.limits.remaining} enrollments remaining`
                          : 'This will use your last available enrollment'
                        }
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleEnroll}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {enrollmentCheck.reason}
                    {enrollmentCheck.limits && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Your Enrollments</span>
                          <span>{enrollmentCheck.limits.current}/{enrollmentCheck.limits.max}</span>
                        </div>
                        <Progress 
                          value={(enrollmentCheck.limits.current / enrollmentCheck.limits.max) * 100} 
                          className="w-full mt-1"
                        />
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 