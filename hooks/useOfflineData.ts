import { useState, useEffect, useCallback } from 'react';
import { offlineStorage, OfflineUtils } from '@/lib/offline-storage';

interface OfflineDataState {
  courses: unknown[];
  categories: unknown[];
  pendingActions: number;
  pendingProgress: number;
  pendingQuizzes: number;
  totalSize: number;
  isLoading: boolean;
  error: string | null;
}

export function useOfflineData() {
  const [state, setState] = useState<OfflineDataState>({
    courses: [],
    categories: [],
    pendingActions: 0,
    pendingProgress: 0,
    pendingQuizzes: 0,
    totalSize: 0,
    isLoading: false,
    error: null
  });

  // Load offline data
  const loadOfflineData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [courses, categories, pendingActions, pendingProgress, pendingQuizzes, totalSize] = await Promise.all([
        OfflineUtils.getOfflineCourses(),
        OfflineUtils.getOfflineCategories(),
        offlineStorage.getPendingActions(),
        offlineStorage.getStoredCourseProgress(),
        offlineStorage.getStoredQuizSubmissions(),
        offlineStorage.getDatabaseSize()
      ]);

      setState(prev => ({
        ...prev,
        courses,
        categories,
        pendingActions: pendingActions.length,
        pendingProgress: pendingProgress.length,
        pendingQuizzes: pendingQuizzes.length,
        totalSize,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to load offline data:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load offline data',
        isLoading: false
      }));
    }
  }, []);

  // Store course data offline
  const storeCourse = useCallback(async (courseId: string, courseData: unknown) => {
    try {
      await OfflineUtils.storeCourseData(courseId, courseData);
      await loadOfflineData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Failed to store course:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to store course'
      }));
      return false;
    }
  }, [loadOfflineData]);

  // Store category data offline
  const storeCategory = useCallback(async (categoryId: string, categoryData: unknown) => {
    try {
      await OfflineUtils.storeCategoryData(categoryId, categoryData);
      await loadOfflineData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Failed to store category:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to store category'
      }));
      return false;
    }
  }, [loadOfflineData]);

  // Store user progress
  const storeProgress = useCallback(async (progress: unknown) => {
    try {
      await OfflineUtils.storeUserProgress(progress);
      await loadOfflineData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Failed to store progress:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to store progress'
      }));
      return false;
    }
  }, [loadOfflineData]);

  // Store quiz submission
  const storeQuizSubmission = useCallback(async (submission: unknown) => {
    try {
      await OfflineUtils.storeQuizSubmission(submission);
      await loadOfflineData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Failed to store quiz submission:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to store quiz submission'
      }));
      return false;
    }
  }, [loadOfflineData]);

  // Queue action for sync
  const queueForSync = useCallback(async (action: unknown) => {
    try {
      await OfflineUtils.queueForSync(action);
      await loadOfflineData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Failed to queue for sync:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to queue for sync'
      }));
      return false;
    }
  }, [loadOfflineData]);

  // Check if data is available offline
  const isDataAvailableOffline = useCallback(async (key: string) => {
    try {
      return await OfflineUtils.isDataAvailableOffline(key);
    } catch (error) {
      console.error('Failed to check offline availability:', error);
      return false;
    }
  }, []);

  // Get offline data by key
  const getOfflineData = useCallback(async (key: string) => {
    try {
      return await offlineStorage.getOfflineData(key);
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return null;
    }
  }, []);

  // Clear all offline data
  const clearAllData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await offlineStorage.clearAll();
      setState(prev => ({
        ...prev,
        courses: [],
        categories: [],
        pendingActions: 0,
        pendingProgress: 0,
        pendingQuizzes: 0,
        totalSize: 0,
        isLoading: false
      }));
      return true;
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to clear offline data',
        isLoading: false
      }));
      return false;
    }
  }, []);

  // Manual sync
  const manualSync = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Trigger background sync
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'MANUAL_SYNC' });
      }

      // Update last sync time
      localStorage.setItem('lastSync', new Date().toISOString());

      // Wait a bit for sync to complete
      setTimeout(async () => {
        await loadOfflineData();
      }, 2000);

      return true;
    } catch (error) {
      console.error('Manual sync failed:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Manual sync failed',
        isLoading: false
      }));
      return false;
    }
  }, [loadOfflineData]);

  // Load data on mount
  useEffect(() => {
    loadOfflineData();
  }, [loadOfflineData]);

  // Set up periodic refresh
  useEffect(() => {
    const interval = setInterval(loadOfflineData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [loadOfflineData]);

  return {
    ...state,
    loadOfflineData,
    storeCourse,
    storeCategory,
    storeProgress,
    storeQuizSubmission,
    queueForSync,
    isDataAvailableOffline,
    getOfflineData,
    clearAllData,
    manualSync
  };
}

// Hook for offline status with more detailed information
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Get connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection?.effectiveType || 'unknown');
      
      connection?.addEventListener('change', () => {
        setConnectionType(connection.effectiveType || 'unknown');
      });
    }

    // Get last sync time
    const lastSyncTime = localStorage.getItem('lastSync');
    if (lastSyncTime) {
      setLastSync(new Date(lastSyncTime));
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Update last sync time when coming back online
      const now = new Date();
      localStorage.setItem('lastSync', now.toISOString());
      setLastSync(now);
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    lastSync,
    connectionType,
    isSlowConnection: connectionType === 'slow-2g' || connectionType === '2g'
  };
} 