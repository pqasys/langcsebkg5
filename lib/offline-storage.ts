// IndexedDB utility for offline data storage
export class OfflineStorage {
  private dbName = 'FluentishOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  // Initialize the database
  async init(): Promise<void> {
    // Check if we're in a browser environment with IndexedDB support
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      throw new Error(`IndexedDB not available - Context: throw new Error('IndexedDB not available');...`);
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('pendingActions')) {
          const actionStore = db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
          actionStore.createIndex('type', 'type', { unique: false });
          actionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('courseProgress')) {
          const progressStore = db.createObjectStore('courseProgress', { keyPath: 'id', autoIncrement: true });
          progressStore.createIndex('courseId', 'courseId', { unique: false });
          progressStore.createIndex('userId', 'userId', { unique: false });
          progressStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('quizSubmissions')) {
          const quizStore = db.createObjectStore('quizSubmissions', { keyPath: 'id', autoIncrement: true });
          quizStore.createIndex('quizId', 'quizId', { unique: false });
          quizStore.createIndex('userId', 'userId', { unique: false });
          quizStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('offlineData')) {
          const dataStore = db.createObjectStore('offlineData', { keyPath: 'key' });
          dataStore.createIndex('type', 'type', { unique: false });
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('type', 'type', { unique: false });
          syncStore.createIndex('priority', 'priority', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Add pending action to sync queue
  async addPendingAction(action: {
    type: string;
    data: unknown;
    endpoint: string;
    method: string;
    priority?: number;
  }): Promise<number> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');
      
      const actionData = {
        ...action,
        timestamp: new Date().toISOString(),
        priority: action.priority || 1,
        retryCount: 0
      };

      const request = store.add(actionData);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all pending actions
  async getPendingActions(): Promise<any[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readonly');
      const store = transaction.objectStore('pendingActions');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Remove pending action
  async removePendingAction(id: number): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Store course progress offline
  async storeCourseProgress(progress: {
    courseId: string;
    userId: string;
    moduleId: string;
    completed: boolean;
    score?: number;
    timeSpent?: number;
  }): Promise<number> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['courseProgress'], 'readwrite');
      const store = transaction.objectStore('courseProgress');
      
      const progressData = {
        ...progress,
        timestamp: new Date().toISOString()
      };

      const request = store.add(progressData);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  // Get stored course progress
  async getStoredCourseProgress(): Promise<any[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['courseProgress'], 'readonly');
      const store = transaction.objectStore('courseProgress');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Store quiz submission offline
  async storeQuizSubmission(submission: {
    quizId: string;
    userId: string;
    answers: unknown[];
    score: number;
    timeSpent: number;
  }): Promise<number> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['quizSubmissions'], 'readwrite');
      const store = transaction.objectStore('quizSubmissions');
      
      const submissionData = {
        ...submission,
        timestamp: new Date().toISOString()
      };

      const request = store.add(submissionData);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  // Get stored quiz submissions
  async getStoredQuizSubmissions(): Promise<any[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['quizSubmissions'], 'readonly');
      const store = transaction.objectStore('quizSubmissions');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Store offline data (courses, categories, etc.)
  async storeOfflineData(key: string, data: unknown, type: string): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      
      const dataToStore = {
        key,
        data,
        type,
        timestamp: new Date().toISOString()
      };

      const request = store.put(dataToStore);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get offline data by key
  async getOfflineData(key: string): Promise<any | null> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Get offline data by type
  async getOfflineDataByType(type: string): Promise<any[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const index = store.index('type');
      const request = index.getAll(type);

      request.onsuccess = () => resolve(request.result.map(item => item.data));
      request.onerror = () => reject(request.error);
    });
  }

  // Add item to sync queue
  async addToSyncQueue(item: {
    type: string;
    data: unknown;
    priority?: number;
  }): Promise<number> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      
      const queueItem = {
        ...item,
        timestamp: new Date().toISOString(),
        priority: item.priority || 1,
        retryCount: 0
      };

      const request = store.add(queueItem);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  // Get sync queue
  async getSyncQueue(): Promise<any[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Remove item from sync queue
  async removeFromSyncQueue(id: number): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all data
  async clearAll(): Promise<void> {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return;
    }

    try {
      await indexedDB.deleteDatabase(this.dbName);
      this.db = null;
    } catch (error) {
      logger.error('Failed to clear offline storage:');
    }
  }

  // Get database size
  async getDatabaseSize(): Promise<number> {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return 0;
    }

    try {
      const databases = await indexedDB.databases();
      const db = databases.find(d => d.name === this.dbName);
      return db?.size || 0;
    } catch (error) {
      logger.error('Failed to get database size:');
      return 0;
    }
  }

  // Ensure database is initialized
  private async ensureDB(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
  }

  // Close database connection
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  // Convenience methods for specific data types
  async storeCourseData(courseId: string, courseData: unknown): Promise<void> {
    await this.storeOfflineData(`course_${courseId}`, courseData, 'course');
  }

  async storeCategoryData(categoryId: string, categoryData: unknown): Promise<void> {
    await this.storeOfflineData(`category_${categoryId}`, categoryData, 'category');
  }

  async storeUserProgress(progress: unknown): Promise<number> {
    return await this.storeCourseProgress(progress);
  }

  async storeQuizSubmission(submission: unknown): Promise<number> {
    return await this.storeQuizSubmission(submission);
  }

  async queueForSync(action: unknown): Promise<number> {
    return await this.addPendingAction(action);
  }

  async getOfflineCourses(): Promise<any[]> {
    return await this.getOfflineDataByType('course');
  }

  async getOfflineCategories(): Promise<any[]> {
    return await this.getOfflineDataByType('category');
  }

  async isDataAvailableOffline(key: string): Promise<boolean> {
    const data = await this.getOfflineData(key);
    return data !== null;
  }
}

// Create a singleton instance
export const offlineStorage = new OfflineStorage();

// Utility functions for common operations
export const OfflineUtils = {
  // Store course data for offline access
  async storeCourseData(courseId: string, courseData: unknown): Promise<void> {
    await offlineStorage.storeOfflineData(`course_${courseId}`, courseData, 'course');
  },

  // Store category data for offline access
  async storeCategoryData(categoryId: string, categoryData: unknown): Promise<void> {
    await offlineStorage.storeOfflineData(`category_${categoryId}`, categoryData, 'category');
  },

  // Store user progress
  async storeUserProgress(progress: unknown): Promise<number> {
    return await offlineStorage.storeCourseProgress(progress);
  },

  // Store quiz submission
  async storeQuizSubmission(submission: unknown): Promise<number> {
    return await offlineStorage.storeQuizSubmission(submission);
  },

  // Queue action for sync when online
  async queueForSync(action: unknown): Promise<number> {
    return await offlineStorage.addToSyncQueue(action);
  },

  // Get all offline courses
  async getOfflineCourses(): Promise<any[]> {
    return await offlineStorage.getOfflineDataByType('course');
  },

  // Get all offline categories
  async getOfflineCategories(): Promise<any[]> {
    return await offlineStorage.getOfflineDataByType('category');
  },

  // Check if data is available offline
  async isDataAvailableOffline(key: string): Promise<boolean> {
    const data = await offlineStorage.getOfflineData(key);
    return data !== null;
  }
}; 