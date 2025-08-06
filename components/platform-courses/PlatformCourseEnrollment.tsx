'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  Zap,
  Lock
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: number;
  isPlatformCourse: boolean;
  requiresSubscription: boolean;
  subscriptionTier?: string;
  maxStudents: number;
  currentEnrollments: number;
  courseType: string;
  deliveryMode: string;
}

interface EnrollmentValidation {
  canEnroll: boolean;
  reason?: string;
  requiredTier?: string;
  currentTier?: string;
  enrollmentQuota?: {
    used: number;
    max: number;
    remaining: number;
  };
}

interface PlatformCourseEnrollmentProps {
  course: Course;
  validation: EnrollmentValidation;
  onEnroll: (courseId: string) => Promise<void>;
  onUpgrade?: () => void;
}

export default function PlatformCourseEnrollment({
  course,
  validation,
  onEnroll,
  onUpgrade
}: PlatformCourseEnrollmentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const enrollmentPercentage = (course.currentEnrollments / course.maxStudents) * 100;
  const isNearCapacity = enrollmentPercentage >= 80;
  const isAtCapacity = course.currentEnrollments >= course.maxStudents;

  const handleEnroll = async () => {
    if (!validation.canEnroll) return;
    
    setIsLoading(true);
    try {
      await onEnroll(course.id);
      setIsEnrolled(true);
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (tier?: string) => {
    switch (tier) {
      case 'ENTERPRISE':
        return <Crown className="h-4 w-4 text-purple-600" />;
      case 'PREMIUM':
        return <Zap className="h-4 w-4 text-yellow-600" />;
      default:
        return <BookOpen className="h-4 w-4 text-blue-600" />;
    }
  };

  const getPlanColor = (tier?: string) => {
    switch (tier) {
      case 'ENTERPRISE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PREMIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getDeliveryModeIcon = (mode: string) => {
    switch (mode) {
      case 'LIVE_ONLY':
        return <Users className="h-4 w-4" />;
      case 'BLENDED':
        return <BookOpen className="h-4 w-4" />;
      case 'SELF_PACED':
        return <Clock className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDeliveryModeColor = (mode: string) => {
    switch (mode) {
      case 'LIVE_ONLY':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'BLENDED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SELF_PACED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isEnrolled) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Successfully Enrolled!</h3>
              <p className="text-sm text-green-700">
                You are now enrolled in "{course.title}". Check your dashboard for course access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <p className="text-gray-600">{course.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {course.requiresSubscription && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                <Lock className="h-3 w-3 mr-1" />
                Subscription Required
              </Badge>
            )}
            <Badge className={getDeliveryModeColor(course.deliveryMode)}>
              {getDeliveryModeIcon(course.deliveryMode)}
              <span className="ml-1">{course.deliveryMode.replace('_', ' ')}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Course Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{course.level}</div>
            <div className="text-sm text-gray-600">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{course.duration}</div>
            <div className="text-sm text-gray-600">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {course.currentEnrollments}/{course.maxStudents}
            </div>
            <div className="text-sm text-gray-600">Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{course.courseType}</div>
            <div className="text-sm text-gray-600">Type</div>
          </div>
        </div>

        {/* Enrollment Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Enrollment Capacity</span>
            <span>{Math.round(enrollmentPercentage)}% full</span>
          </div>
          <Progress 
            value={enrollmentPercentage} 
            className="h-2"
            color={isAtCapacity ? 'red' : isNearCapacity ? 'orange' : 'green'}
          />
          {isAtCapacity && (
            <p className="text-sm text-red-600">This course is at maximum capacity</p>
          )}
        </div>

        {/* Subscription Requirements */}
        {course.requiresSubscription && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              This course requires a subscription. 
              {course.subscriptionTier && (
                <span> Minimum tier: {course.subscriptionTier}</span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Validation Messages */}
        {!validation.canEnroll && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {validation.reason}
              {validation.requiredTier && validation.currentTier && (
                <span>
                  {' '}Required: {validation.requiredTier}, Current: {validation.currentTier}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Enrollment Quota Info */}
        {validation.enrollmentQuota && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Your Enrollment Quota</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {validation.enrollmentQuota.used}
                </div>
                <div className="text-sm text-gray-600">Used</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {validation.enrollmentQuota.remaining}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-600">
                  {validation.enrollmentQuota.max}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleEnroll}
            disabled={!validation.canEnroll || isLoading || isAtCapacity}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Enrolling...' : 'Enroll Now'}
          </Button>
          
          {!validation.canEnroll && validation.requiredTier && onUpgrade && (
            <Button
              onClick={onUpgrade}
              variant="outline"
              className="flex-shrink-0"
            >
              Upgrade Plan
            </Button>
          )}
        </div>

        {/* Course Features */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Course Features</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Self-paced learning</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Certificate of completion</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Lifetime access</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Mobile friendly</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 