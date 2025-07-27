import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageContainerProps {
  src: string;
  alt: string;
  type: 'card' | 'hero' | 'logo' | 'facility';
  className?: string;
  fallback?: React.ReactNode;
  sizes?: string;
  priority?: boolean;
}

const aspectRatios = {
  card: 'aspect-[3/1]',    // 3:1 ratio for institution cards
  hero: 'aspect-[3/1]',    // 3:1 ratio for hero sections
  logo: 'aspect-square',   // 1:1 ratio for logos
  facility: 'aspect-square' // 1:1 ratio for facility images
};

const defaultSizes = {
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  hero: '100vw',
  logo: '80px',
  facility: '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
};

const defaultPlaceholders = {
  card: '/api/placeholder/institution-card',
  hero: '/api/placeholder/institution-hero',
  logo: '/api/placeholder/institution-logo',
  facility: '/api/placeholder/institution-facility'
};

export function ImageContainer({
  src,
  alt,
  type,
  className,
  fallback,
  sizes,
  priority = false
}: ImageContainerProps) {
  const aspectRatio = aspectRatios[type];
  const defaultSize = defaultSizes[type];
  const placeholderUrl = defaultPlaceholders[type];

  // Determine the actual source URL
  const imageSrc = src && src.trim() !== '' ? src : placeholderUrl;
  
  // Check if this is a placeholder image (SVG from our API)
  const isPlaceholder = imageSrc === placeholderUrl || imageSrc.startsWith('/api/placeholder/');
  
  // Check if this is a local upload (doesn't need Next.js Image optimization)
  const isLocalUpload = imageSrc.startsWith('/uploads/');

  // Default fallback content
  const defaultFallback = (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    </div>
  );

  return (
    <div className={cn('relative overflow-hidden', aspectRatio, className)}>
      {(isPlaceholder || isLocalUpload) ? (
        // Use regular img tag for placeholder SVGs and local uploads
        <img
          src={imageSrc}
          alt={alt}
          className={cn(
            'w-full h-full object-cover',
            type === 'logo' && 'object-contain'
          )}
          onError={(e) => {
            // If the image fails to load, show fallback
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ) : (
        // Use Next.js Image for remote images
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={cn(
            'object-cover',
            type === 'logo' && 'object-contain'
          )}
          sizes={sizes || defaultSize}
          priority={priority}
          onError={(e) => {
            // If the image fails to load, show fallback
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      )}
      {/* Only show fallback if no custom fallback is provided and this is a placeholder */}
      {!fallback && isPlaceholder && defaultFallback}
    </div>
  );
}

// Specialized components for common use cases
export function InstitutionCardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <ImageContainer
      src={src}
      alt={alt}
      type="card"
      className={className}
      fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
          <div className="text-center text-white">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-sm font-medium">Institution</p>
          </div>
        </div>
      }
    />
  );
}

export function InstitutionHeroImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <ImageContainer
      src={src}
      alt={alt}
      type="hero"
      className={className}
      priority={true}
      fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
          <div className="text-center text-white">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-lg font-semibold">Institution</p>
            <p className="text-sm opacity-80">Add your main image</p>
          </div>
        </div>
      }
    />
  );
}

export function InstitutionLogoImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <ImageContainer
      src={src}
      alt={alt}
      type="logo"
      className={className}
      fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      }
    />
  );
}

export function FacilityImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <ImageContainer
      src={src}
      alt={alt}
      type="facility"
      className={className}
      fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      }
    />
  );
} 