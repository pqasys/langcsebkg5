// React optimization utilities
'use client';

import React, { 
  memo, 
  useMemo, 
  useCallback, 
  Suspense, 
  lazy, 
  useEffect, 
  useRef,
  useState 
} from 'react';

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      // // // console.log(`[${componentName}] Render #${renderCount.current} (${timeSinceLastRender}ms since last render)`);
    }
    
    lastRenderTime.current = now;
  });

  return {
    renderCount: renderCount.current,
    timeSinceLastRender: Date.now() - lastRenderTime.current
  };
};

// Intersection Observer hook for lazy loading
export const useInView = (options: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
} = {}) => {
  const [inView, setInView] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const hasTriggered = useRef(false);

  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry.isIntersecting;
        
        if (triggerOnce && hasTriggered.current) {
          return;
        }
        
        if (isInView && triggerOnce) {
          hasTriggered.current = true;
        }
        
        setInView(isInView);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, triggerOnce]);

  return { ref: setRef, inView };
};

// Debounce utility function
export const debounce = <T extends (...args: unknown[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Optimized image component with lazy loading
export const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  priority = false,
  ...props 
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  [key: string]: unknown;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image failed to load</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Virtualized list component for large datasets
export const VirtualizedList = memo(({ 
  items, 
  renderItem, 
  itemHeight = 60,
  containerHeight = 400,
  overscan = 5
}: {
  items: unknown[];
  renderItem: (item: unknown, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil(scrollTop / itemHeight) + visibleCount + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';

// Debounced search hook
export const useDebouncedSearch = (delay: number = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return { searchTerm, setSearchTerm, debouncedTerm };
};

// Infinite scroll hook
export const useInfiniteScroll = (
  loadMore: () => Promise<void>,
  hasMore: boolean,
  threshold: number = 100
) => {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        setIsLoading(true);
        loadMore().finally(() => setIsLoading(false));
      }
    },
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: `${threshold}px`,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  return { loadMoreRef, isLoading };
};

// Optimized fetch hook with caching
export const useOptimizedFetch = <T,>(
  url: string,
  options: {
    dependencies?: unknown[];
    cacheTime?: number;
    staleTime?: number;
  } = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  const { dependencies = [], cacheTime = 5 * 60 * 1000, staleTime = 60 * 1000 } = options;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = url;
      const cached = cacheRef.current.get(cacheKey);
      const now = Date.now();

      if (cached && (now - cached.timestamp) < staleTime) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - Context: throw new Error(`HTTP error! status: ${response.st...`);
      }

      const result = await response.json();
      
      cacheRef.current.set(cacheKey, { data: result, timestamp: now });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [url, staleTime]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  // Clean up old cache entries
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of cacheRef.current.entries()) {
        if (now - value.timestamp > cacheTime) {
          cacheRef.current.delete(key);
        }
      }
    }, cacheTime);

    return () => clearInterval(interval);
  }, [cacheTime]);

  return { data, loading, error, refetch: fetchData };
};

// Loading boundary component
export const LoadingBoundary = ({ 
  children, 
  fallback = <div className="animate-pulse">Loading...</div> 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Error boundary component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by boundary:');
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-red-600">Something went wrong</h2>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
} 