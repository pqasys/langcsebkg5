'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Crown,
  Zap
} from 'lucide-react';

interface UsageMetrics {
  currentEnrollments: number;
  maxEnrollments: number;
  monthlyAttendance: number;
  maxMonthlyAttendance: number;
  enrollmentUsagePercentage: number;
  attendanceUsagePercentage: number;
  daysUntilReset: number;
}

interface SubscriptionInfo {
  planType: string;
  status: string;
  endDate: string;
  features: Record<string, boolean>;
}

interface SubscriptionUsageDashboardProps {
  usageMetrics: UsageMetrics;
  subscriptionInfo: SubscriptionInfo;
  onUpgrade?: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function SubscriptionUsageDashboard({
  usageMetrics,
  subscriptionInfo,
  onUpgrade
}: SubscriptionUsageDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const enrollmentData = [
    { name: 'Used', value: usageMetrics.currentEnrollments, color: '#0088FE' },
    { name: 'Available', value: usageMetrics.maxEnrollments - usageMetrics.currentEnrollments, color: '#E5E7EB' }
  ];

  const attendanceData = [
    { name: 'Used', value: usageMetrics.monthlyAttendance, color: '#00C49F' },
    { name: 'Available', value: usageMetrics.maxMonthlyAttendance - usageMetrics.monthlyAttendance, color: '#E5E7EB' }
  ];

  const isEnrollmentNearLimit = usageMetrics.enrollmentUsagePercentage >= 80;
  const isAttendanceNearLimit = usageMetrics.attendanceUsagePercentage >= 80;

  const handleUpgrade = async () => {
    if (onUpgrade) {
      setIsLoading(true);
      try {
        await onUpgrade();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'ENTERPRISE':
        return <Crown className="h-5 w-5 text-purple-600" />;
      case 'PREMIUM':
        return <Zap className="h-5 w-5 text-yellow-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-blue-600" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'ENTERPRISE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PREMIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Dashboard</h2>
          <p className="text-gray-600">Monitor your usage and subscription status</p>
        </div>
        <div className="flex items-center space-x-2">
          {getPlanIcon(subscriptionInfo.planType)}
          <Badge className={getPlanColor(subscriptionInfo.planType)}>
            {subscriptionInfo.planType} Plan
          </Badge>
        </div>
      </div>

      {/* Alerts */}
      {(isEnrollmentNearLimit || isAttendanceNearLimit) && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You're approaching your usage limits. Consider upgrading your plan for more capacity.
          </AlertDescription>
        </Alert>
      )}

      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageMetrics.currentEnrollments}/{usageMetrics.maxEnrollments}
            </div>
            <Progress 
              value={usageMetrics.enrollmentUsagePercentage} 
              className="mt-2"
              color={isEnrollmentNearLimit ? 'orange' : 'blue'}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(usageMetrics.enrollmentUsagePercentage)}% used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Class Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageMetrics.monthlyAttendance}/{usageMetrics.maxMonthlyAttendance}
            </div>
            <Progress 
              value={usageMetrics.attendanceUsagePercentage} 
              className="mt-2"
              color={isAttendanceNearLimit ? 'orange' : 'green'}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(usageMetrics.attendanceUsagePercentage)}% used this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Until Reset</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageMetrics.daysUntilReset}</div>
            <p className="text-xs text-muted-foreground">
              Monthly quotas reset in {usageMetrics.daysUntilReset} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {subscriptionInfo.status.toLowerCase()}
            </div>
            <p className="text-xs text-muted-foreground">
              Expires {new Date(subscriptionInfo.endDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={enrollmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {enrollmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Live Class Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(subscriptionInfo.features).map(([feature, enabled]) => (
              <div key={feature} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-sm ${enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                  {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      {(isEnrollmentNearLimit || isAttendanceNearLimit) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Upgrade Your Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-4">
              You're approaching your usage limits. Upgrade to a higher tier for more enrollments and live class access.
            </p>
            <Button 
              onClick={handleUpgrade} 
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? 'Processing...' : 'Upgrade Now'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 