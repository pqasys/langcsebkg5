// Offline analytics system for tracking usage patterns and performance

// Analytics event interface
interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'content_access' | 'offline_action' | 'sync_attempt' | 'error' | 'performance';
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  metadata: Record<string, any>;
}

// Analytics metrics interface
interface AnalyticsMetrics {
  offlineSessions: number;
  totalOfflineTime: number;
  cachedContentAccess: number;
  syncAttempts: number;
  syncFailures: number;
  averageOfflineSessionDuration: number;
  mostAccessedContent: Map<string, number>;
  offlineActions: Map<string, number>;
  performanceMetrics: {
    averageLoadTime: number;
    cacheHitRate: number;
    syncSuccessRate: number;
  };
}

// Analytics summary interface
interface AnalyticsSummary {
  totalEvents: number;
  eventsLast24Hours: number;
  eventsLast7Days: number;
  offlineSessions: number;
  totalOfflineTime: number;
  averageOfflineSessionDuration: number;
  cachedContentAccess: number;
  syncSuccessRate: number;
  mostAccessedContent: [string, number][];
  topOfflineActions: [string, number][];
  performanceMetrics: {
    averageLoadTime: number;
    cacheHitRate: number;
    syncSuccessRate: number;
  };
}

export class OfflineAnalytics {
  private static instance: OfflineAnalytics;
  private events: AnalyticsEvent[] = [];
  private metrics: AnalyticsMetrics = {
    offlineSessions: 0,
    totalOfflineTime: 0,
    cachedContentAccess: 0,
    syncAttempts: 0,
    syncFailures: 0,
    averageOfflineSessionDuration: 0,
    mostAccessedContent: new Map(),
    offlineActions: new Map(),
    performanceMetrics: {
      averageLoadTime: 0,
      cacheHitRate: 0,
      syncSuccessRate: 0
    }
  };
  private sessionStartTime: Date | null = null;
  private isOnline = true;

  private constructor() {
    this.initializeAnalytics();
  }

  static getInstance(): OfflineAnalytics {
    if (!OfflineAnalytics.instance) {
      OfflineAnalytics.instance = new OfflineAnalytics();
    }
    return OfflineAnalytics.instance;
  }

  // Initialize analytics
  private initializeAnalytics(): void {
    this.loadStoredAnalytics();
    this.setupEventListeners();
    this.startSession();
  }

  // Load stored analytics from IndexedDB
  private async loadStoredAnalytics(): Promise<void> {
    try {
      const storedEvents = await this.getStoredEvents();
      this.events = storedEvents;

      const storedMetrics = await this.getStoredMetrics();
      if (storedMetrics) {
        this.metrics = { ...this.metrics, ...storedMetrics };
      }
    } catch (error) {
      logger.error('Failed to load stored analytics:');
    }
  }

  // Setup event listeners for online/offline status
  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.trackEvent('offline_action', 'connection', 'online_restored');
      this.endOfflineSession();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.trackEvent('offline_action', 'connection', 'went_offline');
      this.startOfflineSession();
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('offline_action', 'session', 'page_hidden');
      } else {
        this.trackEvent('offline_action', 'session', 'page_visible');
      }
    });

    // Track beforeunload for session end
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  // Start a new session
  private startSession(): void {
    this.sessionStartTime = new Date();
    this.trackEvent('offline_action', 'session', 'session_started');
  }

  // Start offline session
  private startOfflineSession(): void {
    this.metrics.offlineSessions++;
    this.trackEvent('offline_action', 'session', 'offline_session_started');
  }

  // End offline session
  private endOfflineSession(): void {
    if (this.sessionStartTime) {
      const sessionDuration = Date.now() - this.sessionStartTime.getTime();
      this.metrics.totalOfflineTime += sessionDuration;
      this.metrics.averageOfflineSessionDuration = 
        this.metrics.totalOfflineTime / this.metrics.offlineSessions;
      
      this.trackEvent('offline_action', 'session', 'offline_session_ended', undefined, {
        duration: sessionDuration,
        totalOfflineTime: this.metrics.totalOfflineTime
      });
    }
  }

  // End current session
  private endSession(): void {
    this.trackEvent('offline_action', 'session', 'session_ended');
    this.saveAnalytics();
  }

  // Track an analytics event
  trackEvent(
    type: AnalyticsEvent['type'],
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata: Record<string, any> = {}
  ): void {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      category,
      action,
      label,
      value,
      timestamp: new Date(),
      sessionId: this.getSessionId(),
      userId: this.getCurrentUserId(),
      metadata: {
        isOnline: this.isOnline,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        ...metadata
      }
    };

    this.events.push(event);
    this.updateMetrics(event);
    this.saveEvent(event);

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  // Update metrics based on event
  private updateMetrics(event: AnalyticsEvent): void {
    switch (event.type) {
      case 'content_access':
        this.metrics.cachedContentAccess++;
        this.updateContentAccess(event.action);
        break;
      case 'offline_action':
        this.updateOfflineAction(event.action);
        break;
      case 'sync_attempt':
        this.metrics.syncAttempts++;
        break;
      case 'error':
        if (event.category === 'sync') {
          this.metrics.syncFailures++;
        }
        break;
      case 'performance':
        this.updatePerformanceMetrics(event);
        break;
    }
  }

  // Update content access metrics
  private updateContentAccess(contentType: string): void {
    const currentCount = this.metrics.mostAccessedContent.get(contentType) || 0;
    this.metrics.mostAccessedContent.set(contentType, currentCount + 1);
  }

  // Update offline action metrics
  private updateOfflineAction(action: string): void {
    const currentCount = this.metrics.offlineActions.get(action) || 0;
    this.metrics.offlineActions.set(action, currentCount + 1);
  }

  // Update performance metrics
  private updatePerformanceMetrics(event: AnalyticsEvent): void {
    if (event.value !== undefined) {
      switch (event.action) {
        case 'load_time':
          this.updateAverageLoadTime(event.value);
          break;
        case 'cache_hit':
          this.updateCacheHitRate(event.value);
          break;
        case 'sync_success':
          this.updateSyncSuccessRate(event.value);
          break;
      }
    }
  }

  // Update average load time
  private updateAverageLoadTime(loadTime: number): void {
    const current = this.metrics.performanceMetrics.averageLoadTime;
    const count = this.events.filter(e => e.type === 'performance' && e.action === 'load_time').length;
    this.metrics.performanceMetrics.averageLoadTime = (current * (count - 1) + loadTime) / count;
  }

  // Update cache hit rate
  private updateCacheHitRate(isHit: number): void {
    const current = this.metrics.performanceMetrics.cacheHitRate;
    const count = this.events.filter(e => e.type === 'performance' && e.action === 'cache_hit').length;
    this.metrics.performanceMetrics.cacheHitRate = (current * (count - 1) + isHit) / count;
  }

  // Update sync success rate
  private updateSyncSuccessRate(isSuccess: number): void {
    const current = this.metrics.performanceMetrics.syncSuccessRate;
    const count = this.events.filter(e => e.type === 'performance' && e.action === 'sync_success').length;
    this.metrics.performanceMetrics.syncSuccessRate = (current * (count - 1) + isSuccess) / count;
  }

  // Track page view
  trackPageView(page: string, title?: string): void {
    this.trackEvent('page_view', 'navigation', 'page_viewed', title, undefined, {
      page,
      title: title || page
    });
  }

  // Track content access
  trackContentAccess(contentType: string, contentId: string, isCached: boolean): void {
    this.trackEvent('content_access', 'content', 'content_accessed', contentId, undefined, {
      contentType,
      contentId,
      isCached,
      isOnline: this.isOnline
    });
  }

  // Track offline action
  trackOfflineAction(action: string, details?: Record<string, any>): void {
    this.trackEvent('offline_action', 'user_action', action, undefined, undefined, details);
  }

  // Track sync attempt
  trackSyncAttempt(syncType: string, success: boolean, duration?: number): void {
    this.trackEvent('sync_attempt', 'sync', syncType, undefined, duration, {
      success,
      syncType,
      duration
    });

    if (!success) {
      this.trackEvent('error', 'sync', 'sync_failed', syncType, undefined, {
        syncType,
        duration
      });
    }
  }

  // Track performance metric
  trackPerformance(metric: string, value: number): void {
    this.trackEvent('performance', 'performance', metric, undefined, value, {
      metric,
      value
    });
  }

  // Track error
  trackError(error: Error, context?: string): void {
    this.trackEvent('error', 'error', 'error_occurred', context, undefined, {
      errorMessage: error.message,
      errorStack: error.stack,
      context
    });
  }

  // Get analytics data
  getAnalyticsData(): {
    events: AnalyticsEvent[];
    metrics: AnalyticsMetrics;
    summary: AnalyticsSummary;
  } {
    const summary = this.generateSummary();
    
    return {
      events: [...this.events],
      metrics: { ...this.metrics },
      summary
    };
  }

  // Generate analytics summary
  private generateSummary(): AnalyticsSummary {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentEvents = this.events.filter(e => e.timestamp > last24Hours);
    const weeklyEvents = this.events.filter(e => e.timestamp > last7Days);

    return {
      totalEvents: this.events.length,
      eventsLast24Hours: recentEvents.length,
      eventsLast7Days: weeklyEvents.length,
      offlineSessions: this.metrics.offlineSessions,
      totalOfflineTime: this.metrics.totalOfflineTime,
      averageOfflineSessionDuration: this.metrics.averageOfflineSessionDuration,
      cachedContentAccess: this.metrics.cachedContentAccess,
      syncSuccessRate: this.metrics.syncAttempts > 0 
        ? ((this.metrics.syncAttempts - this.metrics.syncFailures) / this.metrics.syncAttempts) * 100 
        : 0,
      mostAccessedContent: Array.from(this.metrics.mostAccessedContent.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      topOfflineActions: Array.from(this.metrics.offlineActions.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      performanceMetrics: this.metrics.performanceMetrics
    };
  }

  // Save event to IndexedDB
  private async saveEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const events = await this.getStoredEvents();
      events.push(event);
      
      // Keep only last 5000 events in storage
      if (events.length > 5000) {
        events.splice(0, events.length - 5000);
      }
      
      await this.storeEvents(events);
    } catch (error) {
      logger.error('Failed to save analytics event:');
    }
  }

  // Save analytics data
  private async saveAnalytics(): Promise<void> {
    try {
      await this.storeMetrics(this.metrics);
    } catch (error) {
      logger.error('Failed to save analytics:');
    }
  }

  // Get stored events from IndexedDB
  private async getStoredEvents(): Promise<AnalyticsEvent[]> {
    try {
      const db = await this.openAnalyticsDB();
      const transaction = db.transaction(['events'], 'readonly');
      const store = transaction.objectStore('events');
      const events = await store.get('analytics_events');
      return events?.data || [];
    } catch (error) {
      logger.error('Failed to get stored events:');
      return [];
    }
  }

  // Store events in IndexedDB
  private async storeEvents(events: AnalyticsEvent[]): Promise<void> {
    try {
      const db = await this.openAnalyticsDB();
      const transaction = db.transaction(['events'], 'readwrite');
      const store = transaction.objectStore('events');
      await store.put({ key: 'analytics_events', data: events, timestamp: new Date().toISOString() });
    } catch (error) {
      logger.error('Failed to store events:');
    }
  }

  // Get stored metrics from IndexedDB
  private async getStoredMetrics(): Promise<AnalyticsMetrics | null> {
    try {
      const db = await this.openAnalyticsDB();
      const transaction = db.transaction(['metrics'], 'readonly');
      const store = transaction.objectStore('metrics');
      const metrics = await store.get('analytics_metrics');
      return metrics?.data || null;
    } catch (error) {
      logger.error('Failed to get stored metrics:');
      return null;
    }
  }

  // Store metrics in IndexedDB
  private async storeMetrics(metrics: AnalyticsMetrics): Promise<void> {
    try {
      const db = await this.openAnalyticsDB();
      const transaction = db.transaction(['metrics'], 'readwrite');
      const store = transaction.objectStore('metrics');
      await store.put({ key: 'analytics_metrics', data: metrics, timestamp: new Date().toISOString() });
    } catch (error) {
      logger.error('Failed to store metrics:');
    }
  }

  // Open IndexedDB for analytics
  private async openAnalyticsDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AnalyticsDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('events')) {
          db.createObjectStore('events', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('metrics')) {
          db.createObjectStore('metrics', { keyPath: 'key' });
        }
      };
    });
  }

  // Get session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Get current user ID from session or local storage
  private getCurrentUserId(): string | undefined {
    // This would typically come from your auth system
    return localStorage.getItem('user_id') || undefined;
  }

  // Clear all analytics data
  async clearAnalytics(): Promise<void> {
    this.events = [];
    this.metrics = {
      offlineSessions: 0,
      totalOfflineTime: 0,
      cachedContentAccess: 0,
      syncAttempts: 0,
      syncFailures: 0,
      averageOfflineSessionDuration: 0,
      mostAccessedContent: new Map(),
      offlineActions: new Map(),
      performanceMetrics: {
        averageLoadTime: 0,
        cacheHitRate: 0,
        syncSuccessRate: 0
      }
    };

    try {
      const db = await this.openAnalyticsDB();
      const transaction = db.transaction(['events', 'metrics'], 'readwrite');
      
      await transaction.objectStore('events').clear();
      await transaction.objectStore('metrics').clear();
    } catch (error) {
      logger.error('Failed to clear analytics:');
    }
  }

  // Export analytics data as JSON
  exportAnalytics(): string {
    return JSON.stringify(this.getAnalyticsData(), null, 2);
  }
}

// Export singleton instance
export const offlineAnalytics = OfflineAnalytics.getInstance();

// Utility functions for common analytics tracking
export const AnalyticsUtils = {
  // Track course access
  trackCourseAccess: (courseId: string, isCached: boolean) => {
    offlineAnalytics.trackContentAccess('course', courseId, isCached);
  },

  // Track lesson access
  trackLessonAccess: (lessonId: string, isCached: boolean) => {
    offlineAnalytics.trackContentAccess('lesson', lessonId, isCached);
  },

  // Track quiz completion
  trackQuizCompletion: (quizId: string, score: number) => {
    offlineAnalytics.trackOfflineAction('quiz_completed', { quizId, score });
  },

  // Track sync operation
  trackSync: (syncType: string, success: boolean, duration?: number) => {
    offlineAnalytics.trackSyncAttempt(syncType, success, duration);
  },

  // Track performance
  trackLoadTime: (loadTime: number) => {
    offlineAnalytics.trackPerformance('load_time', loadTime);
  },

  // Track cache hit
  trackCacheHit: (isHit: boolean) => {
    offlineAnalytics.trackPerformance('cache_hit', isHit ? 1 : 0);
  }
}; 