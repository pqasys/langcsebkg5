'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface SubscriptionUsageProps {
  userId: string;
}

interface UsageData {
  subscription: any;
  usage: {
    enrollments: {
      current: number;
      max: number;
      percentage: number;
    };
    monthlyAttendance: {
      current: number;
      max: number;
      percentage: number;
    };
    monthlyEnrollments: {
      current: number;
      max: number;
      percentage: number;
    };
  };
  activeEnrollments: any[];
  hasSubscription: boolean;
}

export function SubscriptionUsage({ userId }: SubscriptionUsageProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsage();
  }, [userId]);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/subscription/usage?userId=${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 404) {
          setUsage({ ...data, hasSubscription: false });
        } else {
          throw new Error(data.error || 'Failed to fetch usage data');
        }
      } else {
        setUsage(data);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch usage data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading subscription usage: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!usage || !usage.hasSubscription) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No active subscription found. Subscribe to access platform courses and live sessions.
        </AlertDescription>
      </Alert>
    );
  }

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return 'critical';
    if (percentage >= 80) return 'warning';
    return 'normal';
  };

  const getUsageColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getUsageIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Subscription Usage</h3>
        <Badge variant="outline">
          {usage.subscription.planType} Plan
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Course Enrollments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Course Enrollments</span>
              {getUsageIcon(getUsageStatus(usage.usage.enrollments.percentage))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current</span>
                <span className={getUsageColor(getUsageStatus(usage.usage.enrollments.percentage))}>
                  {usage.usage.enrollments.current}/{usage.usage.enrollments.max}
                </span>
              </div>
              <Progress 
                value={usage.usage.enrollments.percentage} 
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                {usage.usage.enrollments.remaining > 0 
                  ? `${usage.usage.enrollments.remaining} enrollments remaining`
                  : 'Enrollment limit reached'
                }
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Attendance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Monthly Attendance</span>
              {getUsageIcon(getUsageStatus(usage.usage.monthlyAttendance.percentage))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>This Month</span>
                <span className={getUsageColor(getUsageStatus(usage.usage.monthlyAttendance.percentage))}>
                  {usage.usage.monthlyAttendance.current}/
                  {usage.usage.monthlyAttendance.max === -1 ? '∞' : usage.usage.monthlyAttendance.max}
                </span>
              </div>
              <Progress 
                value={usage.usage.monthlyAttendance.percentage} 
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                {usage.usage.monthlyAttendance.max === -1 
                  ? 'Unlimited attendance'
                  : usage.usage.monthlyAttendance.remaining > 0 
                    ? `${usage.usage.monthlyAttendance.remaining} sessions remaining`
                    : 'Monthly quota reached'
                }
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Enrollments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Monthly Enrollments</span>
              {getUsageIcon(getUsageStatus(usage.usage.monthlyEnrollments.percentage))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>This Month</span>
                <span className={getUsageColor(getUsageStatus(usage.usage.monthlyEnrollments.percentage))}>
                  {usage.usage.monthlyEnrollments.current}/
                  {usage.usage.monthlyEnrollments.max === -1 ? '∞' : usage.usage.monthlyEnrollments.max}
                </span>
              </div>
              <Progress 
                value={usage.usage.monthlyEnrollments.percentage} 
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                {usage.usage.monthlyEnrollments.max === -1 
                  ? 'Unlimited enrollments'
                  : usage.usage.monthlyEnrollments.remaining > 0 
                    ? `${usage.usage.monthlyEnrollments.remaining} enrollments remaining`
                    : 'Monthly quota reached'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Active Enrollments */}
      {usage.activeEnrollments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {usage.activeEnrollments.map((enrollment: any) => (
                <div key={enrollment.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{enrollment.course.title}</span>
                    <p className="text-sm text-muted-foreground">
                      Progress: {Math.round(enrollment.progress)}%
                    </p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Usage Alerts */}
      {Object.values(usage.usage).some(metric => getUsageStatus(metric.percentage) === 'warning' || getUsageStatus(metric.percentage) === 'critical') && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You're approaching your usage limits. Consider upgrading your plan for more flexibility.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 