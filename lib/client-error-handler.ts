/**
 * Utility functions to handle client-side errors gracefully during build time
 * This prevents build failures when API calls fail during static generation
 */

export interface ClientFallbackData {
  _isFallback: true;
  _error?: string;
  _timestamp: string;
}

export function isClientBuildTime(): boolean {
  // Only return true during actual Next.js build phases
  // This should NOT return true during runtime, even in production
  return process.env.NEXT_PHASE === 'phase-production-build' || 
         process.env.NEXT_PHASE === 'phase-production-optimize';
}

export function createClientFallbackData(error?: string): ClientFallbackData {
  return {
    _isFallback: true,
    _error: error || 'Client-side fallback data',
    _timestamp: new Date().toISOString()
  };
}

export function isClientFallbackData(data: any): data is ClientFallbackData {
  return data && typeof data === 'object' && data._isFallback === true;
}

export async function safeClientApiCall<T>(
  apiCall: () => Promise<T>,
  fallback: T | (() => T)
): Promise<T> {
  try {
    if (isClientBuildTime()) {
      // During build time, return fallback data immediately
      return typeof fallback === 'function' ? fallback() : fallback;
    }
    
    return await apiCall();
  } catch (error) {
    console.warn('Client API call failed, using fallback data:', error);
    return typeof fallback === 'function' ? fallback() : fallback;
  }
}

// Common fallback data for client-side components
export const clientFallbackData = {
  // Dashboard data
  dashboardStats: {
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0,
    activeCourses: 0,
    _isFallback: true
  },
  
  // Learning stats
  learningStats: {
    totalTimeSpent: 0,
    averageSessionTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
    thisWeekSessions: 0,
    averageScore: 0,
    _isFallback: true
  },
  
  // Quiz stats
  quizStats: {
    totalAttempts: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    bestScore: 0,
    quizzesPassed: 0,
    totalQuizzes: 0,
    _isFallback: true
  },
  
  // Subscription data
  subscriptionStatus: {
    hasActiveSubscription: false,
    currentPlan: null,
    features: {},
    subscriptionEndDate: null,
    canUpgrade: false,
    canDowngrade: false,
    canCancel: false,
    nextBillingDate: null,
    billingHistory: [],
    _isFallback: true
  },
  
  // Course progress
  courseProgress: [],
  
  // Recent modules
  recentModules: [],
  
  // Achievements
  achievements: [],
  
  // Recent quiz attempts
  recentQuizAttempts: [],
  
  // Notifications
  notifications: [],
  
  // Payments
  payments: [],
  
  // Institutions
  institutions: [],
  
  // Categories
  categories: [],
  
  // Tags
  tags: [],
  
  // Stats
  stats: {
    students: 0,
    institutions: 0,
    courses: 0,
    languages: 0,
    _isFallback: true
  }
};

// Helper function to check if data is fallback data
export function isFallbackData(data: any): boolean {
  return data && typeof data === 'object' && data._isFallback === true;
}

// Helper function to get fallback data for specific types
export function getFallbackData<T>(type: keyof typeof clientFallbackData): T {
  return clientFallbackData[type] as T;
}
