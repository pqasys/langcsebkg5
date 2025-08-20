'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { toast } from 'sonner';
import { useNavigation } from '@/lib/navigation';

interface ServiceWorkerContextType {
  isOnline: boolean;
  isServiceWorkerReady: boolean;
  hasUpdate: boolean;
  updateApp: () => void;
  syncOfflineData: () => Promise<void>;
  clearOfflineData: () => Promise<void>;
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | undefined>(undefined);

// Safe toast function that only works on client side
const safeToast = (message: string, options?: unknown) => {
  if (typeof window !== 'undefined') {
    toast(message, options);
  }
};

export function ServiceWorkerProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigation();
  const [isClient, setIsClient] = useState(false);
  const [isOnline, setIsOnline] = useState(() => {
    // Initialize with a safe default that works on both server and client
    if (typeof window !== 'undefined') {
      return navigator.onLine;
    }
    return true; // Default to true on server
  });
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasReloadedRef = useRef(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    if (!isClient) return;

    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      console.log('ServiceWorkerProvider - Network status changed:', online);
      setIsOnline(online);
      
      if (online) {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('lastSync', new Date().toISOString());
        }
      }
    };

    // Set initial status
    updateOnlineStatus();

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [isClient]);

  // Register service worker
  useEffect(() => {
    if (!isClient) return;

    const registerServiceWorker = async () => {
      try {
        // Check if service worker is supported
        if (!('serviceWorker' in navigator)) {
          setError('Service Worker not supported');
          return;
        }

        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        setRegistration(reg);

        // Handle service worker updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setHasUpdate(true);
              }
            });
          }
        });

        // Handle service worker controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setHasUpdate(false);
          // Avoid reload loops during development; only auto-reload once in production
          if (process.env.NODE_ENV === 'production' && !hasReloadedRef.current) {
            hasReloadedRef.current = true;
            navigate.reload();
          }
        });

        // Initialize offline storage
        try {
          // Dynamic import to avoid SSR issues
          const { offlineStorage } = await import('@/lib/offline-storage');
          await offlineStorage.init();
          setIsServiceWorkerReady(true);
        } catch (storageError) {
          toast.error('Failed to initialize offline storage:');
        }

      } catch (err) {
        toast.error('Service Worker registration failed:');
        setError(err instanceof Error ? err.message : 'Registration failed');
      }
    };

    registerServiceWorker();
  }, [isClient]);

  // Handle service worker errors
  useEffect(() => {
    if (!isClient) return;

    if (error) {
      toast.error('Service Worker error:');
      safeToast("Service Worker Error: Failed to initialize offline features. Some functionality may be limited.");
    }
  }, [error, isClient]);

  // Handle service worker updates
  useEffect(() => {
    if (!isClient) return;

    if (hasUpdate) {
      safeToast("App Update Available: A new version is available. Click to update.");
    }
  }, [hasUpdate, isClient]);

  // Handle online/offline status changes
  useEffect(() => {
    if (!isClient) return;

    if (!isOnline) {
      safeToast("You're Offline: Some features may be limited. Your data will sync when you're back online.");
    } else if (isServiceWorkerReady) {
      // Only sync if we were previously offline (don't sync on every online status)
      const wasOffline = sessionStorage.getItem('wasOffline');
      if (wasOffline === 'true') {
        sessionStorage.removeItem('wasOffline');
        syncOfflineData();
      }
    }
  }, [isOnline, isServiceWorkerReady, isClient]);

  // Track offline status for sync
  useEffect(() => {
    if (!isClient) return;
    
    if (!isOnline) {
      sessionStorage.setItem('wasOffline', 'true');
    }
  }, [isOnline, isClient]);

  const syncOfflineData = async () => {
    if (!isClient) return;
    
    try {
      // Trigger background sync
      if (registration && 'sync' in registration) {
        await (registration as any).sync.register('background-sync');
      }

      // Update last sync time
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('lastSync', new Date().toISOString());
      }

      // Only show sync success toast if there was actually data to sync
      const hasPendingData = localStorage.getItem('hasPendingData');
      if (hasPendingData === 'true') {
        safeToast("Data Synced: Your offline data has been synchronized.");
        localStorage.removeItem('hasPendingData');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to sync offline data:');
      safeToast("Sync Failed: Failed to sync offline data. Please try again.");
    }
  };

  const clearOfflineData = async () => {
    if (!isClient) return;
    
    try {
      const { offlineStorage } = await import('@/lib/offline-storage');
      await offlineStorage.clearAll();
      safeToast("Offline Data Cleared: All offline data has been removed.");
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to clear offline data:');
      safeToast("Clear Failed: Failed to clear offline data. Please try again.");
    }
  };

  const updateApp = () => {
    if (isClient && registration && hasUpdate) {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const value: ServiceWorkerContextType = {
    isOnline,
    isServiceWorkerReady,
    hasUpdate,
    updateApp,
    syncOfflineData,
    clearOfflineData,
  };

  return (
    <ServiceWorkerContext.Provider value={value}>
      {children}
      
      {/* Update notification banner */}
      {isClient && hasUpdate && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">App Update Available</h4>
              <p className="text-sm opacity-90">A new version is ready to install</p>
            </div>
            <button
              onClick={updateApp}
              className="bg-primary-foreground text-primary px-3 py-1 rounded text-sm font-medium hover:bg-primary-foreground/90"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </ServiceWorkerContext.Provider>
  );
}

export function useServiceWorkerContext() {
  const context = useContext(ServiceWorkerContext);
  if (context === undefined) {
    throw new Error(`useServiceWorkerContext must be used within a ServiceWorkerProvider - Context: throw new Error('useServiceWorkerContext must be u...`);
  }
  return context;
}

// Component for showing offline status in the UI
export function OfflineIndicator() {
  const { isOnline, isServiceWorkerReady } = useServiceWorkerContext();

  if (isOnline || !isServiceWorkerReady) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-yellow-500 text-white px-3 py-2 rounded-lg shadow-lg z-50 text-sm font-medium">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>Offline Mode</span>
      </div>
    </div>
  );
}

// Component for showing sync status
export function SyncStatusIndicator() {
  const { isOnline, isServiceWorkerReady } = useServiceWorkerContext();
  const [syncStatus, setSyncStatus] = useState({
    pendingActions: 0,
    pendingProgress: 0,
    pendingQuizzes: 0
  });

  useEffect(() => {
    if (!isServiceWorkerReady || typeof window === 'undefined') return;

    const loadSyncStatus = async () => {
      try {
        const { offlineStorage } = await import('@/lib/offline-storage');
        const pendingActions = await offlineStorage.getPendingActions();
        const pendingProgress = await offlineStorage.getStoredCourseProgress();
        const pendingQuizzes = await offlineStorage.getStoredQuizSubmissions();

        setSyncStatus({
          pendingActions: pendingActions.length,
          pendingProgress: pendingProgress.length,
          pendingQuizzes: pendingQuizzes.length
        });
      } catch (error) {
    console.error('Error occurred:', error);
        toast.error('Failed to load sync status:');
      }
    };

    loadSyncStatus();

    // Update sync status periodically
    const interval = setInterval(loadSyncStatus, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isServiceWorkerReady]);

  const totalPending = syncStatus.pendingActions + syncStatus.pendingProgress + syncStatus.pendingQuizzes;

  if (totalPending === 0 || !isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg z-50 text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>{totalPending} items pending sync</span>
      </div>
    </div>
  );
} 