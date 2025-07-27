import { useEffect, useState, useCallback } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalled: boolean;
  isUpdated: boolean;
  registration: ServiceWorkerRegistration | null;
  error: string | null;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isInstalled: false,
    isUpdated: false,
    registration: null,
    error: null
  });

  const registerServiceWorker = useCallback(async () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      setState(prev => ({ ...prev, isSupported: false, error: 'Not in browser environment' }));
      return;
    }

    if (!('serviceWorker' in navigator)) {
      setState(prev => ({ ...prev, isSupported: false, error: 'Service Worker not supported' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isSupported: true, error: null }));

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      setState(prev => ({ 
        ...prev, 
        isRegistered: true, 
        registration,
        error: null 
      }));

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, isUpdated: true }));
            }
          });
        }
      });

      // Handle service worker state changes
      if (registration.installing) {
        registration.installing.addEventListener('statechange', (e) => {
          if ((e.target as ServiceWorker).state === 'installed') {
            setState(prev => ({ ...prev, isInstalled: true }));
          }
        });
      }

      // Handle service worker controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setState(prev => ({ ...prev, isUpdated: false }));
        window.location.reload();
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }));
    }
  }, []);

  const updateServiceWorker = useCallback(() => {
    if (state.registration && state.isUpdated) {
      state.registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [state.registration, state.isUpdated]);

  const unregisterServiceWorker = useCallback(async () => {
    if (state.registration) {
      await state.registration.unregister();
      setState(prev => ({ 
        ...prev, 
        isRegistered: false, 
        registration: null 
      }));
    }
  }, [state.registration]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  // Subscribe to push notifications
  const subscribeToPushNotifications = useCallback(async () => {
    if (!state.registration) {
      throw new Error(`Service Worker not registered - Context: throw new Error('Service Worker not registered');...`);
    }

    const permission = await requestNotificationPermission();
    if (!permission) {
      throw new Error(`Notification permission denied - Context: const permission = await requestNotificationPermis...`);
    }

    try {
      const subscription = await state.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }, [state.registration, requestNotificationPermission]);

  // Unsubscribe from push notifications
  const unsubscribeFromPushNotifications = useCallback(async () => {
    if (!state.registration) {
      return;
    }

    const subscription = await state.registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      
      // Notify server about unsubscription
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
    }
  }, [state.registration]);

  // Check if push notifications are supported
  const isPushSupported = useCallback(() => {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
  }, []);

  // Get push subscription status
  const getPushSubscriptionStatus = useCallback(async () => {
    if (!state.registration) {
      return { subscribed: false, permission: 'default' };
    }

    const subscription = await state.registration.pushManager.getSubscription();
    return {
      subscribed: !!subscription,
      permission: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
    };
  }, [state.registration]);

  // Register service worker on mount
  useEffect(() => {
    // Only register on client side
    if (typeof window !== 'undefined') {
      registerServiceWorker();
    }
  }, [registerServiceWorker]);

  return {
    ...state,
    registerServiceWorker,
    updateServiceWorker,
    unregisterServiceWorker,
    requestNotificationPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    isPushSupported,
    getPushSubscriptionStatus
  };
}

// Hook for offline status
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (online) {
        setLastOnline(new Date());
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
  }, []);

  return {
    isOnline,
    lastOnline,
    isOffline: !isOnline
  };
}

// Hook for background sync
export function useBackgroundSync() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Only check on client side
    if (typeof window !== 'undefined') {
      setIsSupported('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype);
    }
  }, []);

  const registerBackgroundSync = useCallback(async (tag: string, data?: unknown) => {
    if (!isSupported) {
      throw new Error(`Background sync not supported - Context: }...`);
    }

    const registration = await navigator.serviceWorker.ready;
    
    if ('sync' in registration) {
      await registration.sync.register(tag);
      
      // Store sync data in IndexedDB if provided
      if (data) {
        await storeSyncData(tag, data);
      }
    }
  }, [isSupported]);

  return {
    isSupported,
    registerBackgroundSync
  };
}

// Store sync data in IndexedDB
async function storeSyncData(tag: string, data: unknown) {
  // This would typically use IndexedDB
  // For now, store in localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    const syncData = JSON.parse(localStorage.getItem('syncData') || '{}');
    syncData[tag] = {
      data,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('syncData', JSON.stringify(syncData));
  }
} 