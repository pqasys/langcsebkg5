// Performance monitoring and analytics system
interface PerformanceMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  cacheHitRate: number;
  apiResponseTime: number;
  bundleSize: number;
  memoryUsage: number;
}

interface PerformanceEvent {
  type: string;
  timestamp: number;
  data: unknown;
  userId?: string;
  sessionId?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    timeToInteractive: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    cacheHitRate: 0,
    apiResponseTime: 0,
    bundleSize: 0,
    memoryUsage: 0
  };

  private events: PerformanceEvent[] = [];
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();

    // Monitor page load performance
    this.observePageLoad();

    // Monitor API performance
    this.observeAPI();

    // Monitor memory usage
    this.observeMemory();

    // Monitor bundle size
    this.measureBundleSize();
  }

  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
        this.recordEvent('lcp', { value: lastEntry.startTime });
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    }
  }

  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
          this.recordEvent('fid', { value: this.metrics.firstInputDelay });
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    }
  }

  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: unknown) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cumulativeLayoutShift = clsValue;
            this.recordEvent('cls', { value: clsValue });
          }
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    }
  }

  private observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        this.metrics.firstContentfulPaint = firstEntry.startTime;
        this.recordEvent('fcp', { value: firstEntry.startTime });
      });
      observer.observe({ entryTypes: ['first-contentful-paint'] });
      this.observers.push(observer);
    }
  }

  private observePageLoad() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
          this.metrics.timeToInteractive = navigation.domInteractive - navigation.fetchStart;
          
          this.recordEvent('pageLoad', {
            loadTime: this.metrics.pageLoadTime,
            timeToInteractive: this.metrics.timeToInteractive
          });
        }
      });
    }
  }

  private observeAPI() {
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const startTime = performance.now();
        try {
          const response = await originalFetch(...args);
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          
          this.metrics.apiResponseTime = responseTime;
          this.recordEvent('apiCall', {
            url: args[0],
            responseTime,
            status: response.status
          });
          
          return response;
        } catch (error) {
    console.error('Error occurred:', error);
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          
          this.recordEvent('apiError', {
            url: args[0],
            responseTime,
            error: error.message
          });
          
          throw error;
        }
      };
    }
  }

  private observeMemory() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
        this.recordEvent('memory', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      }, 10000); // Check every 10 seconds
    }
  }

  private measureBundleSize() {
    if (typeof window !== 'undefined') {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && src.includes('_next/static')) {
          // Estimate size based on script loading
          totalSize += 100; // Rough estimate in KB
        }
      });
      
      this.metrics.bundleSize = totalSize;
      this.recordEvent('bundleSize', { size: totalSize });
    }
  }

  private recordEvent(type: string, data: unknown) {
    const event: PerformanceEvent = {
      type,
      timestamp: Date.now(),
      data,
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    };
    
    this.events.push(event);
    
    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
    
    // Send to analytics if in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(event);
    }
  }

  private getUserId(): string | undefined {
    // Get user ID from session/localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId') || undefined;
    }
    return undefined;
  }

  private getSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    }
    return 'server_session';
  }

  private async sendToAnalytics(event: PerformanceEvent) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
    console.error('Error occurred:', error);
      // // // console.warn('Failed to send performance data:', error);
    }
  }

  // Public methods
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getEvents(): PerformanceEvent[] {
    return [...this.events];
  }

  recordCustomEvent(type: string, data: unknown) {
    this.recordEvent(type, data);
  }

  updateCacheHitRate(hitRate: number) {
    this.metrics.cacheHitRate = hitRate;
    this.recordEvent('cacheHitRate', { hitRate });
  }

  getPerformanceReport() {
    const metrics = this.getMetrics();
    const events = this.getEvents();
    
    return {
      metrics,
      events: events.slice(-20), // Last 20 events
      summary: {
        averageAPITime: events
          .filter(e => e.type === 'apiCall')
          .reduce((acc, e) => acc + e.data.responseTime, 0) / 
          Math.max(events.filter(e => e.type === 'apiCall').length, 1),
        totalEvents: events.length,
        sessionDuration: events.length > 0 ? 
          events[events.length - 1].timestamp - events[0].timestamp : 0
      }
    };
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Performance utilities
export const performanceUtils = {
  // Measure function execution time
  measureTime: async <T>(fn: () => Promise<T>, name: string): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      performanceMonitor.recordCustomEvent('functionTime', {
        name,
        duration: endTime - startTime
      });
      return result;
    } catch (error) {
    console.error('Error occurred:', error);
      const endTime = performance.now();
      performanceMonitor.recordCustomEvent('functionError', {
        name,
        duration: endTime - startTime,
        error: error.message
      });
      throw error;
    }
  },

  // Measure synchronous function execution time
  measureTimeSync: <T>(fn: () => T, name: string): T => {
    const startTime = performance.now();
    try {
      const result = fn();
      const endTime = performance.now();
      performanceMonitor.recordCustomEvent('functionTime', {
        name,
        duration: endTime - startTime
      });
      return result;
    } catch (error) {
    console.error('Error occurred:', error);
      const endTime = performance.now();
      performanceMonitor.recordCustomEvent('functionError', {
        name,
        duration: endTime - startTime,
        error: error.message
      });
      throw error;
    }
  },

  // Get current performance metrics
  getMetrics: () => performanceMonitor.getMetrics(),

  // Get performance report
  getReport: () => performanceMonitor.getPerformanceReport(),

  // Record custom event
  recordEvent: (type: string, data: unknown) => performanceMonitor.recordCustomEvent(type, data),

  // Update cache hit rate
  updateCacheHitRate: (hitRate: number) => performanceMonitor.updateCacheHitRate(hitRate)
}; 