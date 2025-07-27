'use client';

import { useEffect, useState } from 'react';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useNavigation } from '@/lib/navigation';

interface MobileOptimizerProps {
  children: React.ReactNode;
  className?: string;
  enableTouchGestures?: boolean;
  enablePullToRefresh?: boolean;
  enableSwipeNavigation?: boolean;
  onPullToRefresh?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function MobileOptimizer({
  children,
  className = '',
  enableTouchGestures = true,
  enablePullToRefresh = false,
  enableSwipeNavigation = false,
  onPullToRefresh,
  onSwipeLeft,
  onSwipeRight
}: MobileOptimizerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pullToRefreshActive, setPullToRefreshActive] = useState(false);

  // Detect mobile device
  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    
    // Add resize listener with throttling
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Monitor online status
  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Touch gesture handlers
  const touchCallbacks = {
    onSwipeLeft: enableSwipeNavigation ? onSwipeLeft : undefined,
    onSwipeRight: enableSwipeNavigation ? onSwipeRight : undefined,
    onSwipeUp: enablePullToRefresh ? () => {
      if (onPullToRefresh) {
        setPullToRefreshActive(true);
        onPullToRefresh();
        setTimeout(() => setPullToRefreshActive(false), 1000);
      }
    } : undefined
  };

  const { touchHandlers } = useTouchGestures(touchCallbacks);

  // Mobile-specific optimizations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isMobile) {
      // Prevent zoom on double tap
      let lastTouchEnd = 0;
      const preventZoom = (event: TouchEvent) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      };

      document.addEventListener('touchend', preventZoom, false);
      return () => document.removeEventListener('touchend', preventZoom);
    }
  }, [isMobile]);

  // Add mobile-specific classes
  const mobileClasses = [
    'mobile-optimized',
    isMobile ? 'mobile-device' : 'desktop-device',
    !isOnline ? 'offline-mode' : '',
    pullToRefreshActive ? 'pull-to-refresh-active' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={mobileClasses}
      {...(enableTouchGestures ? touchHandlers : {})}
      style={{
        touchAction: enableTouchGestures ? 'manipulation' : 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && pullToRefreshActive && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white text-center py-2 text-sm">
          Refreshing...
        </div>
      )}

      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black text-center py-2 text-sm">
          You're offline. Some features may be limited.
        </div>
      )}

      {children}
    </div>
  );
}

// Mobile-specific hook for responsive behavior
export function useMobileOptimization() {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });
    };

    // Set initial size
    updateScreenSize();
    
    // Add resize listener with throttling
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScreenSize, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Calculate responsive values from screen size
  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isDesktop = screenSize.width >= 1024;
  const isSmallScreen = isMobile || isTablet;

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    isSmallScreen
  };
}

// Mobile-optimized loading component
export function MobileLoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`} />
    </div>
  );
}

// Mobile-optimized skeleton component
export function MobileSkeleton({ 
  className = '', 
  lines = 1, 
  height = 'h-4' 
}: { 
  className?: string; 
  lines?: number; 
  height?: string; 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-gray-200 rounded animate-pulse mobile-skeleton`}
        />
      ))}
    </div>
  );
}

// Mobile-optimized error boundary
export function MobileErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  const navigate = useNavigation();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleError = (error: ErrorEvent) => {
      console.error('Mobile Error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return fallback || (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">Something went wrong</div>
        <button 
          onClick={() => navigate.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

// Mobile-optimized performance monitor
export function useMobilePerformance() {
  const [performance, setPerformance] = useState({
    loadTime: 0,
    memoryUsage: 0,
    batteryLevel: 0
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    // Monitor page load time
    const loadTime = performance.now();
    setPerformance(prev => ({ ...prev, loadTime }));

    // Monitor memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setPerformance(prev => ({ 
        ...prev, 
        memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit 
      }));
    }

    // Monitor battery if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: unknown) => {
        setPerformance(prev => ({ ...prev, batteryLevel: battery.level }));
      });
    }
  }, []);

  return performance;
} 