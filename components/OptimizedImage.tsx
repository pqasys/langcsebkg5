'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  aspectRatio?: 'video' | 'square' | 'portrait';
}

export function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  priority = false,
  aspectRatio = 'video',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Default dimensions based on aspect ratio
  const defaultDimensions = {
    video: { width: 1280, height: 720 },    // 16:9
    square: { width: 800, height: 800 },    // 1:1
    portrait: { width: 800, height: 1200 }, // 2:3
  };

  const dimensions = defaultDimensions[aspectRatio];

  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }

    if (typeof document !== 'undefined') {
      const img = document.createElement('img');
      img.src = src;
      
      img.onload = () => {
        setIsLoading(false);
        setError(false);
      };
      
      img.onerror = () => {
        setIsLoading(false);
        setError(true);
      };

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [src]);

  if (error) {
    return (
      <div 
        className={`relative bg-gray-100 ${className}`}
        style={fill ? undefined : { width: width || dimensions.width, height: height || dimensions.height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <span className="text-gray-400 block mb-2">Image not available</span>
            <span className="text-xs text-gray-400 block">
              Recommended size: {dimensions.width}x{dimensions.height}px
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Skeleton 
        className={className}
        style={fill ? undefined : { width: width || dimensions.width, height: height || dimensions.height }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? (width || dimensions.width) : undefined}
      height={!fill ? (height || dimensions.height) : undefined}
      className={`object-cover ${className}`}
      priority={priority}
      onError={() => setError(true)}
    />
  );
} 