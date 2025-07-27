'use client';

import { useEffect, useState } from 'react';

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    domContentLoaded: 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const startTime = performance.now();

    // DOM Content Loaded
    const handleDOMContentLoaded = () => {
      const domContentLoaded = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, domContentLoaded }));
    };

    // Load event
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime }));
    };

    // Performance observer for paint metrics
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') {
          const paintTime = entry.startTime;
          if (entry.name === 'first-paint') {
            setMetrics(prev => ({ ...prev, firstPaint: paintTime }));
          } else if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, firstContentfulPaint: paintTime }));
          }
        } else if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, largestContentfulPaint: entry.startTime }));
        }
      }
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

    // Add event listeners
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    } else {
      handleDOMContentLoaded();
    }

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Log performance metrics
    const logMetrics = () => {
      // // // console.log('🚀 Performance Metrics:', {
        'DOM Content Loaded': `${metrics.domContentLoaded.toFixed(2)}ms`,
        'Page Load': `${metrics.loadTime.toFixed(2)}ms`,
        'First Paint': `${metrics.firstPaint.toFixed(2)}ms`,
        'First Contentful Paint': `${metrics.firstContentfulPaint.toFixed(2)}ms`,
        'Largest Contentful Paint': `${metrics.largestContentfulPaint.toFixed(2)}ms`
      });
    };

    // Log metrics after a delay to capture all paint events
    const timeoutId = setTimeout(logMetrics, 2000);

    return () => {
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
      window.removeEventListener('load', handleLoad);
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded text-xs z-50">
      <div>DOM: {metrics.domContentLoaded.toFixed(0)}ms</div>
      <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
      <div>FCP: {metrics.firstContentfulPaint.toFixed(0)}ms</div>
    </div>
  );
} 