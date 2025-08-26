/**
 * Utility functions to handle build-time API errors gracefully
 * This prevents build failures when database/external services are unavailable
 */

export interface BuildTimeFallback {
  _isFallback: true;
  _error?: string;
  _timestamp: string;
}

export function isBuildTime(): boolean {
  // Only return true during actual Next.js build phases
  // This should NOT return true during runtime, even in production
  return process.env.NEXT_PHASE === 'phase-production-build' || 
         process.env.NEXT_PHASE === 'phase-production-optimize';
}

export function createBuildTimeFallback(error?: string): BuildTimeFallback {
  return {
    _isFallback: true,
    _error: error || 'Build-time fallback data',
    _timestamp: new Date().toISOString()
  };
}

export function isFallbackData(data: any): data is BuildTimeFallback {
  return data && typeof data === 'object' && data._isFallback === true;
}

export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallback: T | (() => T)
): Promise<T> {
  try {
    if (isBuildTime()) {
      // During build time, return fallback data immediately
      return typeof fallback === 'function' ? fallback() : fallback;
    }
    
    return await apiCall();
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return typeof fallback === 'function' ? fallback() : fallback;
  }
}

export function createEmptyArrayFallback<T>(): T[] {
  return [] as T[];
}

export function createEmptyObjectFallback<T>(): T {
  return {} as T;
}

export function createZeroFallback(): number {
  return 0;
}

export function createFalseFallback(): boolean {
  return false;
}

export function createStringFallback(value: string = ''): string {
  return value;
}

// Common fallback data for different types
export const fallbackData = {
  courses: createEmptyArrayFallback(),
  institutions: createEmptyArrayFallback(),
  payments: createEmptyArrayFallback(),
  notifications: createEmptyArrayFallback(),
  stats: {
    totalCourses: 0,
    totalInstitutions: 0,
    totalStudents: 0,
    totalRevenue: 0,
    _isFallback: true
  },
  user: null,
  session: null,
  settings: createEmptyObjectFallback(),
  profile: createEmptyObjectFallback()
};
