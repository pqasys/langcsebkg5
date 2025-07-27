'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Clock, 
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useOfflineData, useOfflineStatus } from '@/hooks/useOfflineData';
import { toast } from '@/components/ui/use-toast';

export function OfflineDataManager() {
  const {
    courses,
    categories,
    pendingActions,
    pendingProgress,
    pendingQuizzes,
    totalSize,
    isLoading,
    error,
    loadOfflineData,
    clearAllData,
    manualSync
  } = useOfflineData();

  const { isOnline, lastSync, connectionType, isSlowConnection } = useOfflineStatus();
  const [isClearing, setIsClearing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleClearAllData = async () => {
    if (!confirm('Are you sure you want to clear all offline data? This action cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    try {
      const success = await clearAllData();
      if (success) {
        toast({
          title: "Offline Data Cleared",
          description: "All cached content has been removed.",
          variant: "default",
        });
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast({
        title: "Clear Failed",
        description: "Failed to clear offline data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleManualSync = async () => {
    if (!isOnline) {
      toast({
        title: "Cannot Sync",
        description: "You must be online to sync data.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    try {
      const success = await manualSync();
      if (success) {
        toast({
          title: "Sync Started",
          description: "Data synchronization has begun.",
          variant: "default",
        });
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to start synchronization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageUsagePercentage = () => {
    // Assuming 50MB as max storage (adjust as needed)
    const maxStorage = 50 * 1024 * 1024; // 50MB in bytes
    return Math.min((totalSize * 1024 / maxStorage) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Offline Data Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Connection Status */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-center mb-2">
                {isOnline ? (
                  <Wifi className="w-6 h-6 text-green-500" />
                ) : (
                  <WifiOff className="w-6 h-6 text-red-500" />
                )}
              </div>
              <div className="text-lg font-semibold">
                {isOnline ? 'Online' : 'Offline'}
              </div>
              <div className="text-sm text-gray-600">
                {connectionType !== 'unknown' && `(${connectionType})`}
              </div>
            </div>

            {/* Storage Usage */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <HardDrive className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-lg font-semibold">
                {formatBytes(totalSize * 1024)}
              </div>
              <div className="text-sm text-gray-600">Storage Used</div>
              <Progress value={getStorageUsagePercentage()} className="mt-2" />
            </div>

            {/* Cached Content */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <Download className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-lg font-semibold">
                {courses.length + categories.length}
              </div>
              <div className="text-sm text-gray-600">Cached Items</div>
            </div>

            {/* Pending Sync */}
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <Upload className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-lg font-semibold">
                {pendingActions + pendingProgress + pendingQuizzes}
              </div>
              <div className="text-sm text-gray-600">Pending Sync</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cached Content */}
        <Card>
          <CardHeader>
            <CardTitle>Cached Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Courses</span>
              <Badge variant="secondary">{courses.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Categories</span>
              <Badge variant="secondary">{categories.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Progress Updates</span>
              <Badge variant="secondary">{pendingProgress}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Quiz Submissions</span>
              <Badge variant="secondary">{pendingQuizzes}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sync Information */}
        <Card>
          <CardHeader>
            <CardTitle>Sync Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Last Sync</span>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  {lastSync ? lastSync.toLocaleString() : 'Never'}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Connection Type</span>
              <Badge variant={isSlowConnection ? "destructive" : "default"}>
                {connectionType}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Pending Actions</span>
              <Badge variant="outline">{pendingActions}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Storage Usage</span>
              <span className="text-sm">{getStorageUsagePercentage().toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleManualSync}
              disabled={!isOnline || isSyncing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </Button>

            <Button
              onClick={loadOfflineData}
              disabled={isLoading}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Loading...' : 'Refresh Data'}</span>
            </Button>

            <Button
              onClick={handleClearAllData}
              disabled={isClearing}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isClearing ? 'Clearing...' : 'Clear All Data'}</span>
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course List */}
      {courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cached Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {courses.map((course: unknown, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{course.title || course.name || `Course ${index + 1}`}</div>
                    <div className="text-sm text-gray-600">
                      Cached: {course.timestamp ? new Date(course.timestamp).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                  <Badge variant="outline">Cached</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category List */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cached Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category: unknown, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{category.name || category.title || `Category ${index + 1}`}</div>
                    <div className="text-sm text-gray-600">
                      Cached: {category.timestamp ? new Date(category.timestamp).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                  <Badge variant="outline">Cached</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 