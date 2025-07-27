'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'custom';
  customAspectRatio?: string;
  placeholder?: 'blur' | 'empty' | 'color';
  placeholderColor?: string;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  compression?: 'low' | 'medium' | 'high' | 'auto';
}

// Default dimensions based on aspect ratio
const ASPECT_RATIOS = {
  video: { width: 1280, height: 720 },    // 16:9
  square: { width: 800, height: 800 },    // 1:1
  portrait: { width: 800, height: 1200 }, // 2:3
  custom: { width: 800, height: 600 }     // Default custom
};

// Compression quality settings
const COMPRESSION_QUALITY = {
  low: 60,
  medium: 80,
  high: 95,
  auto: 85
};

// Responsive breakpoints for sizes
const RESPONSIVE_SIZES = {
  mobile: '(max-width: 640px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1025px)'
};

export function ImageOptimizer({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 85,
  sizes,
  aspectRatio = 'video',
  customAspectRatio,
  placeholder = 'empty',
  placeholderColor = '#f3f4f6',
  lazy = true,
  onLoad,
  onError,
  fallbackSrc,
  compression = 'auto'
}: ImageOptimizerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Determine actual dimensions
  const actualDimensions = width && height ? { width, height } : ASPECT_RATIOS[aspectRatio];
  
  // Determine quality based on compression setting
  const actualQuality = compression === 'auto' ? COMPRESSION_QUALITY.auto : COMPRESSION_QUALITY[compression];

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || generateResponsiveSizes(actualDimensions.width, fill);

  // Lazy loading with Intersection Observer
  const [isInView, setIsInView] = useState(!lazy || priority);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!lazy || priority || isInView) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, priority, isInView, handleIntersection]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setImageLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
    } else {
      onError?.();
    }
  }, [fallbackSrc, currentSrc, onError]);

  // Update source when src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setHasError(false);
    setImageLoaded(false);
  }, [src]);

  // Generate placeholder styles
  const getPlaceholderStyles = () => {
    if (placeholder === 'color') {
      return { backgroundColor: placeholderColor };
    }
    return {};
  };

  // Render placeholder
  const renderPlaceholder = () => {
    if (placeholder === 'blur' && !hasError) {
      return (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={getPlaceholderStyles()}
        />
      );
    }
    
    if (placeholder === 'empty' || hasError) {
      return (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          style={getPlaceholderStyles()}
        >
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
    
    return null;
  };

  // Render loading skeleton
  const renderSkeleton = () => {
    if (isLoading && !imageLoaded) {
      return (
        <Skeleton 
          className={`absolute inset-0 ${className}`}
          style={fill ? undefined : { width: actualDimensions.width, height: actualDimensions.height }}
        />
      );
    }
    return null;
  };

  // Container styles
  const containerStyles = {
    position: 'relative' as const,
    overflow: 'hidden',
    ...(customAspectRatio && { aspectRatio: customAspectRatio }),
    ...(fill && { width: '100%', height: '100%' }),
    ...(!fill && { width: actualDimensions.width, height: actualDimensions.height })
  };

  return (
    <div 
      ref={imgRef}
      className={`relative ${className}`}
      style={containerStyles}
    >
      {/* Loading skeleton */}
      {renderSkeleton()}
      
      {/* Placeholder */}
      {renderPlaceholder()}
      
      {/* Optimized image */}
      {isInView && (
        <Image
          src={currentSrc}
          alt={alt}
          width={!fill ? actualDimensions.width : undefined}
          height={!fill ? actualDimensions.height : undefined}
          fill={fill}
          className={`transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          quality={actualQuality}
          sizes={responsiveSizes}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
          blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
        />
      )}
      
      {/* Error fallback */}
      {hasError && fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">Image not available</span>
        </div>
      )}
    </div>
  );
}

// Helper function to generate responsive sizes
function generateResponsiveSizes(width: number, fill: boolean): string {
  if (fill) {
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }
  
  if (width <= 400) {
    return `${width}px`;
  } else if (width <= 800) {
    return `(max-width: 640px) 100vw, ${width}px`;
  } else {
    return `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${width}px`;
  }
}

// Helper function to generate blur data URL
function generateBlurDataURL(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJhIiB4PSItMSIgeT0iLTEiIHdpZHRoPSIzIiBoZWlnaHQ9IjMiPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEiLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==';
}

// Export optimized image components for common use cases
export const OptimizedCourseImage = (props: Omit<ImageOptimizerProps, 'aspectRatio'>) => (
  <ImageOptimizer {...props} aspectRatio="video" compression="medium" />
);

export const OptimizedInstitutionLogo = (props: Omit<ImageOptimizerProps, 'aspectRatio'>) => (
  <ImageOptimizer {...props} aspectRatio="square" compression="high" />
);

export const OptimizedHeroImage = (props: Omit<ImageOptimizerProps, 'aspectRatio'>) => (
  <ImageOptimizer {...props} aspectRatio="video" priority={true} compression="medium" />
);

export const OptimizedThumbnail = (props: Omit<ImageOptimizerProps, 'aspectRatio'>) => (
  <ImageOptimizer {...props} aspectRatio="square" compression="low" />
); 