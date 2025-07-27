// Content preloading system for intelligent content caching

// Preload item interface
interface PreloadItem {
  id: string;
  url: string;
  type: 'course' | 'lesson' | 'quiz' | 'image' | 'api' | 'page';
  priority: 'high' | 'normal' | 'low';
  weight: number;
  dependencies: string[];
  estimatedSize: number;
  timestamp: Date;
  metadata: Record<string, any>;
}

// Preload strategy interface
interface PreloadStrategy {
  enabled: boolean;
  maxItems: number;
  maxSize: number;
  priority: 'high' | 'normal' | 'low';
  dependencies: boolean;
  prefetch: boolean;
}

// Preload configuration interface
interface PreloadConfig {
  maxConcurrentPreloads: number;
  maxQueueSize: number;
  maxTotalSize: number; // in bytes
  preloadDelay: number; // in milliseconds
  enablePredictivePreloading: boolean;
  enableTimeBasedPreloading: boolean;
  enableUserBehaviorPreloading: boolean;
  preloadStrategies: {
    course: PreloadStrategy;
    lesson: PreloadStrategy;
    quiz: PreloadStrategy;
    image: PreloadStrategy;
    api: PreloadStrategy;
    page: PreloadStrategy;
  };
}

// User behavior interface
interface UserBehavior {
  frequentlyAccessed: Map<string, number>;
  navigationPatterns: Map<string, string[]>;
  timeBasedAccess: Map<string, number[]>;
  lastAccess: Map<string, Date>;
}

// Preload stats interface
interface PreloadStats {
  queueSize: number;
  isPreloading: boolean;
  totalPreloaded: number;
  frequentlyAccessed: [string, number][];
  navigationPatterns: { from: string; to: string[] }[];
}

export class ContentPreloader {
  private static instance: ContentPreloader;
  private preloadQueue: PreloadItem[] = [];
  private isPreloading = false;
  private preloadConfig: PreloadConfig;
  private userBehavior: UserBehavior = {
    frequentlyAccessed: new Map(),
    navigationPatterns: new Map(),
    timeBasedAccess: new Map(),
    lastAccess: new Map()
  };

  private constructor() {
    this.preloadConfig = this.initializePreloadConfig();
    this.loadUserBehavior();
  }

  static getInstance(): ContentPreloader {
    if (!ContentPreloader.instance) {
      ContentPreloader.instance = new ContentPreloader();
    }
    return ContentPreloader.instance;
  }

  // Initialize preload configuration
  private initializePreloadConfig(): PreloadConfig {
    return {
      maxConcurrentPreloads: 3,
      maxQueueSize: 50,
      maxTotalSize: 100 * 1024 * 1024, // 100MB
      preloadDelay: 2000, // 2 seconds
      enablePredictivePreloading: true,
      enableTimeBasedPreloading: true,
      enableUserBehaviorPreloading: true,
      preloadStrategies: {
        course: {
          enabled: true,
          maxItems: 10,
          maxSize: 50 * 1024 * 1024, // 50MB
          priority: 'high',
          dependencies: true,
          prefetch: true
        },
        lesson: {
          enabled: true,
          maxItems: 20,
          maxSize: 20 * 1024 * 1024, // 20MB
          priority: 'high',
          dependencies: true,
          prefetch: true
        },
        quiz: {
          enabled: true,
          maxItems: 15,
          maxSize: 10 * 1024 * 1024, // 10MB
          priority: 'normal',
          dependencies: false,
          prefetch: true
        },
        image: {
          enabled: true,
          maxItems: 50,
          maxSize: 10 * 1024 * 1024, // 10MB
          priority: 'low',
          dependencies: false,
          prefetch: false
        },
        api: {
          enabled: true,
          maxItems: 30,
          maxSize: 5 * 1024 * 1024, // 5MB
          priority: 'normal',
          dependencies: false,
          prefetch: true
        },
        page: {
          enabled: true,
          maxItems: 20,
          maxSize: 5 * 1024 * 1024, // 5MB
          priority: 'normal',
          dependencies: false,
          prefetch: true
        }
      }
    };
  }

  // Load user behavior from storage
  private async loadUserBehavior(): Promise<void> {
    try {
      const stored = await this.getStoredUserBehavior();
      if (stored) {
        this.userBehavior = { ...this.userBehavior, ...stored };
      }
    } catch (error) {
      logger.error('Failed to load user behavior:');
    }
  }

  // Save user behavior to storage
  private async saveUserBehavior(): Promise<void> {
    try {
      await this.storeUserBehavior(this.userBehavior);
    } catch (error) {
      logger.error('Failed to save user behavior:');
    }
  }

  // Add item to preload queue
  async addToPreloadQueue(item: Omit<PreloadItem, 'id' | 'timestamp'>): Promise<string> {
    const preloadItem: PreloadItem = {
      ...item,
      id: `preload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    // Check if item already exists in queue
    const existingIndex = this.preloadQueue.findIndex(q => q.url === item.url);
    if (existingIndex !== -1) {
      // Update existing item with higher priority if needed
      if (this.getPriorityWeight(item.priority) > this.getPriorityWeight(this.preloadQueue[existingIndex].priority)) {
        this.preloadQueue[existingIndex] = preloadItem;
      }
    } else {
      this.preloadQueue.push(preloadItem);
    }

    // Sort queue by priority and weight
    this.preloadQueue.sort((a, b) => {
      const priorityDiff = this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority);
      if (priorityDiff !== 0) return priorityDiff;
      return b.weight - a.weight;
    });

    // Limit queue size
    if (this.preloadQueue.length > this.preloadConfig.maxQueueSize) {
      this.preloadQueue = this.preloadQueue.slice(0, this.preloadConfig.maxQueueSize);
    }

    // Start preloading if not already running
    if (!this.isPreloading) {
      this.startPreloading();
    }

    return preloadItem.id;
  }

  // Start preloading process
  private async startPreloading(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }

    this.isPreloading = true;
    // // // // // // // // // // // // // // // // // // // // // console.log('Starting content preloading...');

    try {
      while (this.preloadQueue.length > 0) {
        const itemsToPreload = this.preloadQueue.splice(0, this.preloadConfig.maxConcurrentPreloads);
        
        await Promise.allSettled(
          itemsToPreload.map(item => this.preloadItem(item))
        );

        // Add delay between batches
        if (this.preloadQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.preloadConfig.preloadDelay));
        }
      }
    } catch (error) {
      logger.error('Preloading error:');
    } finally {
      this.isPreloading = false;
      console.log('Content preloading completed');
    }
  }

  // Preload individual item
  private async preloadItem(item: PreloadItem): Promise<void> {
    try {
      console.log(`Preloading: ${item.type} - ${item.url}`);

      const strategy = this.preloadConfig.preloadStrategies[item.type];
      if (!strategy.enabled) {
        console.log(`Preloading disabled for type: ${item.type}`);
        return;
      }

      // Check dependencies
      if (strategy.dependencies && item.dependencies.length > 0) {
        await this.preloadDependencies(item.dependencies);
      }

      // Perform preload
      await this.performPreload(item, strategy);

      // Update user behavior
      this.updateUserBehavior(item);

      console.log(`Preload successful: ${item.type} - ${item.url}`);
    } catch (error) {
      logger.error('Preload failed: ${item.type} - ${item.url}');
    }
  }

  // Preload dependencies
  private async preloadDependencies(dependencies: string[]): Promise<void> {
    for (const dependency of dependencies) {
      try {
        await fetch(dependency, { method: 'HEAD' });
        console.log(`Dependency preloaded: ${dependency}`);
      } catch (error) {
    console.error('Error occurred:', error);
        // // // console.warn(`Failed to preload dependency: ${dependency}`, error);
      }
    }
  }

  // Perform actual preload
  private async performPreload(item: PreloadItem, strategy: PreloadStrategy): Promise<void> {
    if (strategy.prefetch) {
      // Use prefetch for pages and API calls
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = item.url;
      document.head.appendChild(link);
    } else {
      // Use fetch for other content types
      const response = await fetch(item.url, { 
        method: 'GET',
        cache: 'force-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText} - Context: throw new Error(`HTTP ${response.status}: ${respon...`);
      }
    }
  }

  // Update user behavior based on preload
  private updateUserBehavior(item: PreloadItem): void {
    // Update frequently accessed
    const currentCount = this.userBehavior.frequentlyAccessed.get(item.url) || 0;
    this.userBehavior.frequentlyAccessed.set(item.url, currentCount + 1);

    // Update last access
    this.userBehavior.lastAccess.set(item.url, new Date());

    // Update time-based access
    const hour = new Date().getHours();
    const timeAccess = this.userBehavior.timeBasedAccess.get(item.url) || new Array(24).fill(0);
    timeAccess[hour]++;
    this.userBehavior.timeBasedAccess.set(item.url, timeAccess);

    // Save user behavior
    this.saveUserBehavior();
  }

  // Track navigation pattern
  trackNavigation(from: string, to: string): void {
    const patterns = this.userBehavior.navigationPatterns.get(from) || [];
    if (!patterns.includes(to)) {
      patterns.push(to);
      this.userBehavior.navigationPatterns.set(from, patterns);
      this.saveUserBehavior();
    }
  }

  // Get priority weight
  private getPriorityWeight(priority: 'high' | 'normal' | 'low'): number {
    switch (priority) {
      case 'high': return 3;
      case 'normal': return 2;
      case 'low': return 1;
      default: return 1;
    }
  }

  // Get stored user behavior
  private async getStoredUserBehavior(): Promise<UserBehavior | null> {
    try {
      const db = await this.openPreloadDB();
      const transaction = db.transaction(['behavior'], 'readonly');
      const store = transaction.objectStore('behavior');
      const behavior = await store.get('user_behavior');
      return behavior?.data || null;
    } catch (error) {
      logger.error('Failed to get stored user behavior:');
      return null;
    }
  }

  // Store user behavior
  private async storeUserBehavior(behavior: UserBehavior): Promise<void> {
    try {
      const db = await this.openPreloadDB();
      const transaction = db.transaction(['behavior'], 'readwrite');
      const store = transaction.objectStore('behavior');
      await store.put({ key: 'user_behavior', data: behavior, timestamp: new Date().toISOString() });
    } catch (error) {
      logger.error('Failed to store user behavior:');
    }
  }

  // Open IndexedDB for preload
  private async openPreloadDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PreloadDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('behavior')) {
          db.createObjectStore('behavior', { keyPath: 'key' });
        }
      };
    });
  }

  // Get preload statistics
  getPreloadStats(): PreloadStats {
    const frequentlyAccessed = Array.from(this.userBehavior.frequentlyAccessed.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    const navigationPatterns = Array.from(this.userBehavior.navigationPatterns.entries())
      .map(([from, to]) => ({ from, to }))
      .slice(0, 10);

    return {
      queueSize: this.preloadQueue.length,
      isPreloading: this.isPreloading,
      totalPreloaded: this.userBehavior.frequentlyAccessed.size,
      frequentlyAccessed,
      navigationPatterns
    };
  }

  // Clear preload queue
  clearPreloadQueue(): void {
    this.preloadQueue = [];
    console.log('Preload queue cleared');
  }

  // Clear user behavior
  async clearUserBehavior(): Promise<void> {
    this.userBehavior = {
      frequentlyAccessed: new Map(),
      navigationPatterns: new Map(),
      timeBasedAccess: new Map(),
      lastAccess: new Map()
    };

    try {
      const db = await this.openPreloadDB();
      const transaction = db.transaction(['behavior'], 'readwrite');
      await transaction.objectStore('behavior').clear();
    } catch (error) {
      logger.error('Failed to clear user behavior:');
    }
  }
}

// Export singleton instance
export const contentPreloader = ContentPreloader.getInstance();

// Utility functions for common preloading scenarios
export const PreloadUtils = {
  // Preload course content
  preloadCourse: async (courseId: string) => {
    await contentPreloader.addToPreloadQueue({
      url: `/api/courses/${courseId}`,
      type: 'course',
      priority: 'high',
      weight: 1.0,
      dependencies: [],
      estimatedSize: 2 * 1024 * 1024, // 2MB
      metadata: { courseId }
    });
  },

  // Preload lesson content
  preloadLesson: async (lessonId: string, courseId: string) => {
    await contentPreloader.addToPreloadQueue({
      url: `/api/lessons/${lessonId}`,
      type: 'lesson',
      priority: 'high',
      weight: 1.0,
      dependencies: [`/api/courses/${courseId}`],
      estimatedSize: 1 * 1024 * 1024, // 1MB
      metadata: { lessonId, courseId }
    });
  },

  // Preload quiz content
  preloadQuiz: async (quizId: string) => {
    await contentPreloader.addToPreloadQueue({
      url: `/api/quizzes/${quizId}`,
      type: 'quiz',
      priority: 'normal',
      weight: 0.8,
      dependencies: [],
      estimatedSize: 512 * 1024, // 512KB
      metadata: { quizId }
    });
  },

  // Preload user profile
  preloadUserProfile: async (userId: string) => {
    await contentPreloader.addToPreloadQueue({
      url: `/api/user/${userId}/profile`,
      type: 'api',
      priority: 'normal',
      weight: 0.6,
      dependencies: [],
      estimatedSize: 128 * 1024, // 128KB
      metadata: { userId }
    });
  },

  // Track page navigation
  trackNavigation: (fromUrl: string, toUrl: string) => {
    contentPreloader.trackNavigation(fromUrl, toUrl);
  }
}; 