'use client';

import { useState, useEffect } from 'react';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';
import { useServiceWorkerContext } from '@/components/ServiceWorkerProvider';

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className = '' }: OfflineIndicatorProps) {
  const { isOnline } = useServiceWorkerContext();
  const [showOffline, setShowOffline] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Show offline indicator only when actually offline
    const checkOfflineStatus = () => {
      const isOffline = !navigator.onLine;
      console.log('OfflineIndicator - Checking status:', { isOffline });
      
      if (isOffline) {
        setShowOffline(true);
      } else {
        setShowOffline(false);
      }
    };

    checkOfflineStatus();
    
    // Check periodically
    const interval = setInterval(checkOfflineStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (!showOffline || !mounted) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg ${className}`}>
      <div className="flex items-center text-yellow-800 text-sm">
        <FaWifi className="w-4 h-4 mr-2" />
        <span>{isOnline ? 'Using cached data' : 'Offline mode'}</span>
      </div>
    </div>
  );
} 