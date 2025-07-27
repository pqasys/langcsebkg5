'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Home, Download, Upload, Database, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
// import { offlineStorage, OfflineUtils } from '@/lib/offline-storage';
import { toast } from 'sonner';

interface SyncStatus {
  pendingActions: number;
  pendingProgress: number;
  pendingQuizzes: number;
  lastSync: Date | null;
  isSyncing: boolean;
}

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    pendingActions: 0,
    pendingProgress: 0,
    pendingQuizzes: 0,
    lastSync: null,
    isSyncing: false
  });
  const [offlineData, setOfflineData] = useState({
    courses: 0,
    categories: 0,
    totalSize: 0
  });

  useEffect(() => {
    // Initialize offline storage
    const initStorage = async () => {
      try {
        await offlineStorage.init();
        await loadOfflineData();
        await loadSyncStatus();
      } catch (error) {
    console.error('Error occurred:', error);
        toast.error('Failed to initialize offline storage:');
      }
    };

    initStorage();

    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      handleOnlineRestored();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get last sync time from localStorage
    const lastSyncTime = localStorage.getItem('lastSync');
    if (lastSyncTime) {
      setSyncStatus(prev => ({ ...prev, lastSync: new Date(lastSyncTime) }));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = async () => {
    try {
      const courses = await OfflineUtils.getOfflineCourses();
      const categories = await OfflineUtils.getOfflineCategories();
      const totalSize = await offlineStorage.getDatabaseSize();

      setOfflineData({
        courses: courses.length,
        categories: categories.length,
        totalSize
      });
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to load offline data:');
    }
  };

  const loadSyncStatus = async () => {
    try {
      const pendingActions = await offlineStorage.getPendingActions();
      const pendingProgress = await offlineStorage.getStoredCourseProgress();
      const pendingQuizzes = await offlineStorage.getStoredQuizSubmissions();

      setSyncStatus(prev => ({
        ...prev,
        pendingActions: pendingActions.length,
        pendingProgress: pendingProgress.length,
        pendingQuizzes: pendingQuizzes.length
      }));
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to load sync status:');
    }
  };

  const handleOnlineRestored = async () => {
    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    
    try {
      // Trigger background sync
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'TRIGGER_SYNC' });
      }

      // Update last sync time
      const now = new Date();
      localStorage.setItem('lastSync', now.toISOString());
      setSyncStatus(prev => ({ ...prev, lastSync: now }));

      // Reload sync status after a delay
      setTimeout(() => {
        loadSyncStatus();
        setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      }, 2000);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to sync:');
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  };

  const handleRefresh = () => {
    navigate.reload();
  };

  const handleGoHome = () => {
    navigate.to('/');
  };

  const handleManualSync = async () => {
    if (!isOnline) return;
    
    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    
    try {
      // Trigger manual sync
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'MANUAL_SYNC' });
      }

      // Update last sync time
      const now = new Date();
      localStorage.setItem('lastSync', now.toISOString());
      setSyncStatus(prev => ({ ...prev, lastSync: now }));

      // Reload sync status after a delay
      setTimeout(() => {
        loadSyncStatus();
        setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      }, 2000);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Manual sync failed:');
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Status Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {isOnline ? (
                <Wifi className="w-16 h-16 text-green-500" />
              ) : (
                <WifiOff className="w-16 h-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {isOnline ? 'You\'re Back Online!' : 'You\'re Offline'}
            </CardTitle>
            <div className="flex justify-center mt-2">
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? 'Connected' : 'Offline Mode'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isOnline ? (
              <>
                <p className="text-gray-600 text-center">
                  Great! Your connection has been restored. You can now access all features and sync your offline data.
                </p>
                
                {syncStatus.isSyncing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-blue-800">Syncing your data...</span>
                    </div>
                    <Progress value={50} className="mt-2" />
                  </div>
                )}

                <div className="space-y-2">
                  <Button onClick={handleManualSync} className="w-full" disabled={syncStatus.isSyncing}>
                    <Upload className="w-4 h-4 mr-2" />
                    {syncStatus.isSyncing ? 'Syncing...' : 'Sync Now'}
                  </Button>
                  <Button variant="outline" onClick={handleRefresh} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Page
                  </Button>
                  <Button variant="outline" onClick={handleGoHome} className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 text-center">
                  It looks like you've lost your internet connection. Don't worry - you can still access cached content and continue learning offline.
                </p>
                
                <div className="space-y-2">
                  <Button onClick={handleRefresh} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full">
                      <Home className="w-4 h-4 mr-2" />
                      Go to Homepage
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Offline Data Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Offline Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{offlineData.courses}</div>
                <div className="text-sm text-gray-600">Courses Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{offlineData.categories}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatBytes(offlineData.totalSize * 1024)}</div>
                <div className="text-sm text-gray-600">Storage Used</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Sync Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{syncStatus.pendingActions}</div>
                  <div className="text-sm text-gray-600">Pending Actions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{syncStatus.pendingProgress}</div>
                  <div className="text-sm text-gray-600">Progress Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{syncStatus.pendingQuizzes}</div>
                  <div className="text-sm text-gray-600">Quiz Submissions</div>
                </div>
              </div>

              {syncStatus.lastSync && (
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Last synced: {syncStatus.lastSync.toLocaleString()}</span>
                </div>
              )}

              {!isOnline && (syncStatus.pendingActions > 0 || syncStatus.pendingProgress > 0 || syncStatus.pendingQuizzes > 0) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Pending Sync</h3>
                  <p className="text-sm text-yellow-800">
                    You have {syncStatus.pendingActions + syncStatus.pendingProgress + syncStatus.pendingQuizzes} items waiting to sync when you're back online.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* What's Available Offline */}
        {!isOnline && (
          <Card>
            <CardHeader>
              <CardTitle>What's Available Offline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-700">✅ Available</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Previously viewed course content</li>
                    <li>• Cached course listings</li>
                    <li>• Your learning progress</li>
                    <li>• Basic navigation</li>
                    <li>• Offline exercises</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-700">❌ Not Available</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• New course downloads</li>
                    <li>• Real-time updates</li>
                    <li>• Live chat support</li>
                    <li>• Payment processing</li>
                    <li>• Video streaming</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 