'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Users, Calendar, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface SubscriptionUsage {
  userId: string;
  month: string;
  totalHoursAttended: number;
  maxHoursAllowed: number;
  remainingHours: number;
  sessionsAttended: number;
  lastAttendanceDate?: Date;
}

interface SubscriptionUsageDisplayProps {
  userId?: string;
  showHistory?: boolean;
}

export default function SubscriptionUsageDisplay({ 
  userId, 
  showHistory = false 
}: SubscriptionUsageDisplayProps) {
  const [currentUsage, setCurrentUsage] = useState<SubscriptionUsage | null>(null);
  const [history, setHistory] = useState<SubscriptionUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUsage();
    if (showHistory) {
      fetchHistory();
    }
  }, [userId, showHistory]);

  const fetchCurrentUsage = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscription/usage');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription usage');
      }
      
      const usage = await response.json();
      setCurrentUsage(usage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch usage');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/subscription/history?months=6');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription history');
      }
      
      const historyData = await response.json();
      setHistory(historyData);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const getUsagePercentage = () => {
    if (!currentUsage) return 0;
    return (currentUsage.totalHoursAttended / currentUsage.maxHoursAllowed) * 100;
  };

  const getUsageStatus = () => {
    if (!currentUsage) return 'unknown';
    
    const percentage = getUsagePercentage();
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'good': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'good': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!currentUsage) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>No subscription usage data available.</AlertDescription>
      </Alert>
    );
  }

  const status = getUsageStatus();

  return (
    <div className="space-y-6">
      {/* Current Month Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Month Usage ({formatMonth(currentUsage.month)})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status)}
              <span className={`font-medium ${getStatusColor(status)}`}>
                {currentUsage.totalHoursAttended} / {currentUsage.maxHoursAllowed} hours used
              </span>
            </div>
            <Badge variant={status === 'critical' ? 'destructive' : status === 'warning' ? 'secondary' : 'default'}>
              {currentUsage.remainingHours} hours remaining
            </Badge>
          </div>

          <Progress value={getUsagePercentage()} className="h-2" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{currentUsage.sessionsAttended} sessions attended</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>
                {currentUsage.lastAttendanceDate 
                  ? new Date(currentUsage.lastAttendanceDate).toLocaleDateString()
                  : 'No sessions yet'
                }
              </span>
            </div>
          </div>

          {status === 'critical' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have used {currentUsage.totalHoursAttended} out of {currentUsage.maxHoursAllowed} hours this month. 
                Consider upgrading to Premium for more hours.
              </AlertDescription>
            </Alert>
          )}

          {status === 'warning' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have {currentUsage.remainingHours} hours remaining this month. 
                Plan your sessions accordingly.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Usage History */}
      {showHistory && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Usage History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((monthUsage) => (
                <div key={monthUsage.month} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{formatMonth(monthUsage.month)}</div>
                    <div className="text-sm text-gray-500">
                      {monthUsage.sessionsAttended} sessions • {monthUsage.totalHoursAttended} hours
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {monthUsage.totalHoursAttended}/{monthUsage.maxHoursAllowed} hours
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((monthUsage.totalHoursAttended / monthUsage.maxHoursAllowed) * 100)}% used
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={fetchCurrentUsage} variant="outline" size="sm">
          Refresh
        </Button>
        {currentUsage.remainingHours === 0 && (
          <Button variant="default" size="sm">
            Upgrade to Premium
          </Button>
        )}
      </div>
    </div>
  );
}
