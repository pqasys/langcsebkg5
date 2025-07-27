'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';

export function useSessionSync() {
  const { data: session, status, update } = useSession();
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isForceSyncing, setIsForceSyncing] = useState(false);

  // Debug session state - only log when status changes
  useEffect(() => {
    if (status === 'loading') {
      // // // // // // // // // // // // console.log('useSessionSync - Session loading...');
    } else if (status === 'authenticated') {
      console.log('useSessionSync - Session authenticated:', session?.user?.email);
    } else if (status === 'unauthenticated') {
      console.log('useSessionSync - Session unauthenticated');
    }
  }, [session, status]);

  // Force sync function - only for manual use
  const forceSync = useCallback(async () => {
    console.log('useSessionSync - Force sync requested');
    setIsForceSyncing(true);
    setSyncAttempts(prev => prev + 1);
    setLastSyncTime(new Date());
    
    try {
      await update();
    } finally {
      setIsForceSyncing(false);
    }
  }, [update]);

  // Reset sync state when session becomes authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      setSyncAttempts(0);
      setIsForceSyncing(false);
    }
  }, [status, session]);

  // Auto-refresh session if it's stale and we're online
  useEffect(() => {
    if (status === 'authenticated' && session && typeof window !== 'undefined') {
      const lastActivity = sessionStorage.getItem('lastSessionActivity');
      const now = Date.now();
      
      // Refresh session if it's older than 5 minutes and we're online
      if (!lastActivity || (now - parseInt(lastActivity)) > 5 * 60 * 1000) {
        if (navigator.onLine) {
          console.log('useSessionSync - Auto-refreshing stale session');
          forceSync();
        }
      }
      
      // Update last activity
      sessionStorage.setItem('lastSessionActivity', now.toString());
    }
  }, [status, session, forceSync]);

  return {
    session,
    status,
    syncAttempts,
    lastSyncTime,
    forceSync,
    isAuthenticated: status === 'authenticated' && !!session,
    isLoading: status === 'loading' || isForceSyncing,
    isUnauthenticated: status === 'unauthenticated',
    hasSession: !!session,
    userRole: session?.user?.role
  };
} 