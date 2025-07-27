'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Database, 
  Download, 
  Upload, 
  Bell, 
  Activity,
  Settings,
  RefreshCw,
  TrendingUp,
  Clock,
  HardDrive,
  Zap,
  Shield
} from 'lucide-react';
import { useServiceWorkerContext } from '@/components/ServiceWorkerProvider';
import { useOfflineData } from '@/hooks/useOfflineData';
import { offlineAnalytics } from '@/lib/offline-analytics';
import { contentPreloader } from '@/lib/content-preloader';
import { backgroundSync } from '@/lib/background-sync';
import { pushNotificationService } from '@/lib/push-notifications';
import { advancedCaching } from '@/lib/advanced-caching';
import { NotificationManager } from '@/components/NotificationManager';
import { OfflineDataManager } from '@/components/OfflineDataManager';
import { toast } from 'sonner';

export function AdvancedMobileDashboard() {
  const { isOnline, isServiceWorkerReady, hasUpdate, updateApp } = useServiceWorkerContext();
  const { 
    courses, 
    categories, 
    pendingActions, 
    pendingProgress, 
    pendingQuizzes, 
    totalSize,
    manualSync,
    clearAllData 
  } = useOfflineData();

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [preloadStats, setPreloadStats] = useState<any>(null);
  const [syncStats, setSyncStats] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [analytics, preload, sync, cache] = await Promise.all([
        offlineAnalytics.getAnalyticsData(),
        contentPreloader.getPreloadStats(),
        backgroundSync.getSyncStats(),
        advancedCaching.getCacheStats()
      ]);

      setAnalyticsData(analytics);
      setPreloadStats(preload);
      setSyncStats(sync);
      setCacheStats(cache);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to load dashboard data:');
    }
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    try {
      await manualSync();
      await loadDashboardData();
      toast.success("Sync Completed: All data has been synchronized successfully.");
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error("Sync Failed: Failed to synchronize data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllData = async () => {
    if (!confirm('Are you sure you want to clear all offline data? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      await clearAllData();
      await loadDashboardData();
      toast({
        title: "Data Cleared",
        description: "All offline data has been cleared.",
        variant: "default",
      });
    } catch (error) {
    console.error('Error occurred:', error);
      toast({
        title: "Clear Failed",
        description: "Failed to clear offline data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    const maxStorage = 100 * 1024 * 1024; // 100MB
    return Math.min((totalSize * 1024 / maxStorage) * 100, 100);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Mobile Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <Badge variant={isOnline ? "default" : "secondary"}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </div>

      {/* Service Worker Status */}
      {hasUpdate && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">App Update Available</span>
              </div>
              <Button onClick={updateApp} size="sm">
                Update Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Offline Data</p>
                    <p className="text-2xl font-bold">{formatBytes(totalSize * 1024)}</p>
                  </div>
                </div>
                <Progress value={getStorageUsagePercentage()} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Pending Sync</p>
                    <p className="text-2xl font-bold">{pendingActions + pendingProgress + pendingQuizzes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Cached Content</p>
                    <p className="text-2xl font-bold">{courses.length + categories.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Offline Sessions</p>
                    <p className="text-2xl font-bold">{analyticsData?.summary?.offlineSessions || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sync Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Sync Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Last Sync</span>
                  <span className="text-sm text-gray-600">
                    {analyticsData?.summary?.lastSync 
                      ? new Date(analyticsData.summary.lastSync).toLocaleString()
                      : 'Never'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sync Success Rate</span>
                  <span className="text-sm font-medium">
                    {syncStats?.successRate?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleManualSync} disabled={isLoading || !isOnline}>
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Sync Now
                  </Button>
                  <Button variant="outline" onClick={loadDashboardData}>
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Cache Hit Rate</span>
                  <span className="text-sm font-medium">
                    {cacheStats?.cacheDetails?.[0]?.hitRate?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Load Time</span>
                  <span className="text-sm font-medium">
                    {analyticsData?.summary?.performanceMetrics?.averageLoadTime?.toFixed(0) || 0}ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Preload Queue</span>
                  <span className="text-sm font-medium">
                    {preloadStats?.queueSize || 0} items
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <NotificationManager />
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data">
          <OfflineDataManager />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Usage Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analyticsData.summary.offlineSessions}
                      </div>
                      <div className="text-sm text-gray-600">Offline Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {analyticsData.summary.cachedContentAccess}
                      </div>
                      <div className="text-sm text-gray-600">Content Accesses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analyticsData.summary.syncSuccessRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Sync Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round(analyticsData.summary.averageOfflineSessionDuration / 1000 / 60)}m
                      </div>
                      <div className="text-sm text-gray-600">Avg Session Duration</div>
                    </div>
                  </div>

                  {/* Most Accessed Content */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Most Accessed Content</h4>
                    {analyticsData.summary.mostAccessedContent.slice(0, 5).map(([content, count], index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{content}</span>
                        <Badge variant="outline">{count} accesses</Badge>
                      </div>
                    ))}
                  </div>

                  {/* Top Offline Actions */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Top Offline Actions</h4>
                    {analyticsData.summary.topOfflineActions.slice(0, 5).map(([action, count], index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{action}</span>
                        <Badge variant="outline">{count} times</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No analytics data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sync Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Sync Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {syncStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {syncStats.totalSynced}
                      </div>
                      <div className="text-sm text-gray-600">Total Synced</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {syncStats.syncedLast24Hours}
                      </div>
                      <div className="text-sm text-gray-600">Last 24 Hours</div>
                    </div>
                  </div>

                  {/* Sync by Type */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Sync by Type</h4>
                    {syncStats.statsByType.slice(0, 5).map(([type, stats], index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{type}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{stats.success} success</Badge>
                          <Badge variant="destructive">{stats.failed} failed</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No sync data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cache Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5" />
                <span>Cache Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cacheStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {cacheStats.totalCaches}
                      </div>
                      <div className="text-sm text-gray-600">Total Caches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {cacheStats.totalEntries}
                      </div>
                      <div className="text-sm text-gray-600">Total Entries</div>
                    </div>
                  </div>

                  {/* Cache Details */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Cache Details</h4>
                    {cacheStats.cacheDetails.map((cache, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <span className="text-sm font-medium">{cache.name}</span>
                          <div className="text-xs text-gray-600">
                            {cache.entries} entries, {formatBytes(cache.size)}
                          </div>
                        </div>
                        <Badge variant="outline">{cache.strategy}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No cache data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 