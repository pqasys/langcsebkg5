'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  LineChart,
  Line
} from 'recharts';
import { 
  Calendar, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Video
} from 'lucide-react';

interface LiveClassStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  totalParticipants: number;
  completionRate: number;
  cancellationRate: number;
  currentLiveClasses: number;
  maxLiveClasses: number;
  upcomingSessions: number;
}

interface InstructorAvailability {
  isAvailable: boolean;
  conflicts: Array<{
    id: string;
    title: string;
    startTime: string;
    endTime: string;
  }>;
  nextAvailableSlot?: string;
}

interface LiveClassGovernanceDashboardProps {
  stats: LiveClassStats;
  availability: InstructorAvailability;
  onCreateClass?: () => void;
  onViewConflicts?: () => void;
}

export default function LiveClassGovernanceDashboard({
  stats,
  availability,
  onCreateClass,
  onViewConflicts
}: LiveClassGovernanceDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isNearLimit = stats.currentLiveClasses >= stats.maxLiveClasses * 0.8;
  const isAtLimit = stats.currentLiveClasses >= stats.maxLiveClasses;

  const monthlyData = [
    { month: 'Jan', sessions: 12, participants: 45 },
    { month: 'Feb', sessions: 15, participants: 52 },
    { month: 'Mar', sessions: 18, participants: 68 },
    { month: 'Apr', sessions: 14, participants: 55 },
    { month: 'May', sessions: 20, participants: 75 },
    { month: 'Jun', sessions: 16, participants: 62 },
  ];

  const sessionStatusData = [
    { status: 'Completed', count: stats.completedSessions, color: '#10B981' },
    { status: 'Active', count: stats.activeSessions, color: '#3B82F6' },
    { status: 'Scheduled', count: stats.upcomingSessions, color: '#F59E0B' },
    { status: 'Cancelled', count: stats.cancelledSessions, color: '#EF4444' },
  ];

  const handleCreateClass = async () => {
    if (onCreateClass) {
      setIsLoading(true);
      try {
        await onCreateClass();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Class Governance</h2>
          <p className="text-gray-600">Monitor your live class creation and availability</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleCreateClass} 
            disabled={isLoading || isAtLimit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Creating...' : 'Create Live Class'}
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {!availability.isAvailable && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You have scheduling conflicts. {availability.conflicts.length} conflicting sessions found.
            {availability.nextAvailableSlot && (
              <span> Next available slot: {new Date(availability.nextAvailableSlot).toLocaleString()}</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {isNearLimit && !isAtLimit && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You're approaching your live class limit. Consider upgrading your subscription for more capacity.
          </AlertDescription>
        </Alert>
      )}

      {isAtLimit && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You've reached your live class limit. Upgrade your subscription to create more classes.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              All time sessions created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Live Classes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.currentLiveClasses}/{stats.maxLiveClasses}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.currentLiveClasses / stats.maxLiveClasses) * 100)}% of limit used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.completionRate)}%</div>
            <p className="text-xs text-muted-foreground">
              Sessions completed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              All time participants
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Sessions"
                />
                <Line 
                  type="monotone" 
                  dataKey="participants" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Participants"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Session Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Session Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Session Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Session Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sessionStatusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="font-medium">{item.status}</p>
                    <p className="text-sm text-gray-500">{item.count} sessions</p>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Availability Status */}
      <Card>
        <CardHeader>
          <CardTitle>Availability Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {availability.isAvailable ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <div>
                <p className="font-medium">
                  {availability.isAvailable ? 'Available for Scheduling' : 'Scheduling Conflicts Detected'}
                </p>
                <p className="text-sm text-gray-500">
                  {availability.isAvailable 
                    ? 'You can create new live classes' 
                    : `${availability.conflicts.length} conflicting sessions found`
                  }
                </p>
              </div>
            </div>
            {!availability.isAvailable && onViewConflicts && (
              <Button variant="outline" onClick={onViewConflicts}>
                View Conflicts
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={handleCreateClass}
              disabled={isAtLimit}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Plus className="h-6 w-6" />
              <span>Create Live Class</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <span>View Schedule</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>Manage Participants</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 