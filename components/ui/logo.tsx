import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'ship-bubble' | 'crew' | 'compass' | 'wave' | 'badge' | 'badge-circle' | 'badge-image' | 'badge-enhanced' | 'badge-original' | 'badge-faithful';
}

export function Logo({ className = '', size = 'md', variant = 'badge-image' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  // Responsive image sizes for different screen adaptations
  const imageSizes = {
    sm: {
      width: 24,
      height: 24,
      className: 'w-6 h-6'
    },
    md: {
      width: 32,
      height: 32,
      className: 'w-8 h-8'
    },
    lg: {
      width: 48,
      height: 48,
      className: 'w-12 h-12'
    },
    xl: {
      width: 64,
      height: 64,
      className: 'w-16 h-16'
    }
  };

  const renderLogo = () => {
    switch (variant) {
      case 'badge-image':
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              {/* Original PNG image with responsive sizing */}
              <Image 
                src="/fluentship-branding/fluentship-badge.png" 
                alt="FluentShip Badge - Boat with three people on wavy water" 
                width={imageSizes[size].width}
                height={imageSizes[size].height}
                className={`${imageSizes[size].className} object-contain transition-all duration-200 hover:scale-105`}
                priority={size === 'lg' || size === 'xl'}
                sizes={`(max-width: 640px) ${imageSizes.sm.width}px, (max-width: 768px) ${imageSizes.md.width}px, (max-width: 1024px) ${imageSizes.lg.width}px, ${imageSizes.xl.width}px`}
              />
            </div>
            <span className={`font-bold ${sizeClasses[size]} ${className}`}>
              <span className="text-[#0077b6]">Fluent</span>
              <span className="text-[#ff6b6b]">Ship</span>
            </span>
          </div>
        );

      case 'badge-faithful':
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              {/* Original PNG image with responsive sizing */}
              <Image 
                src="/fluentship-branding/fluentship-badge.png" 
                alt="FluentShip Badge - Boat with three people on wavy water" 
                width={imageSizes[size].width}
                height={imageSizes[size].height}
                className={`${imageSizes[size].className} object-contain transition-all duration-200 hover:scale-105`}
                priority={size === 'lg' || size === 'xl'}
                sizes={`(max-width: 640px) ${imageSizes.sm.width}px, (max-width: 768px) ${imageSizes.md.width}px, (max-width: 1024px) ${imageSizes.lg.width}px, ${imageSizes.xl.width}px`}
              />
            </div>
            <span className={`font-bold ${sizeClasses[size]} ${className}`}>
              <span className="text-[#0077b6]">Fluent</span>
              <span className="text-[#ff6b6b]">Ship</span>
            </span>
          </div>
        );

      case 'badge-original':
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              {/* Original PNG image with responsive sizing */}
              <Image 
                src="/fluentship-branding/fluentship-badge.png" 
                alt="FluentShip Badge - Boat with three people on wavy water" 
                width={imageSizes[size].width}
                height={imageSizes[size].height}
                className={`${imageSizes[size].className} object-contain transition-all duration-200 hover:scale-105`}
                priority={size === 'lg' || size === 'xl'}
                sizes={`(max-width: 640px) ${imageSizes.sm.width}px, (max-width: 768px) ${imageSizes.md.width}px, (max-width: 1024px) ${imageSizes.lg.width}px, ${imageSizes.xl.width}px`}
              />
            </div>
            <span className={`font-bold ${sizeClasses[size]} ${className}`}>
              <span className="text-[#0077b6]">Fluent</span>
              <span className="text-[#ff6b6b]">Ship</span>
            </span>
          </div>
        );

      case 'badge-enhanced':
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              {/* Original PNG image with responsive sizing */}
              <Image 
                src="/fluentship-branding/fluentship-badge.png" 
                alt="FluentShip Badge - Boat with three people on wavy water" 
                width={imageSizes[size].width}
                height={imageSizes[size].height}
                className={`${imageSizes[size].className} object-contain transition-all duration-200 hover:scale-105`}
                priority={size === 'lg' || size === 'xl'}
                sizes={`(max-width: 640px) ${imageSizes.sm.width}px, (max-width: 768px) ${imageSizes.md.width}px, (max-width: 1024px) ${imageSizes.lg.width}px, ${imageSizes.xl.width}px`}
              />
            </div>
            <span className={`font-bold ${sizeClasses[size]} ${className}`}>
              <span className="text-[#0077b6]">Fluent</span>
              <span className="text-[#ff6b6b]">Ship</span>
            </span>
          </div>
        );

      case 'badge-circle':
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              {/* Circular badge-style logo */}
              <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
                {/* Outer ring */}
                <circle cx="12" cy="12" r="11" fill="#0077b6" stroke="#f4d35e" strokeWidth="1" />
                
                {/* Inner circle */}
                <circle cx="12" cy="12" r="9" fill="#f6f5f3" />
                
                {/* Decorative inner ring */}
                <circle cx="12" cy="12" r="7" fill="none" stroke="#0077b6" strokeWidth="0.5" />
                
                {/* Ship silhouette in center */}
                <path d="M8 16L10 14H14L16 16H8Z" fill="#0077b6" />
                <rect x="10" y="14" width="4" height="2" fill="#0077b6" />
                
                {/* Mast and sail */}
                <rect x="11.5" y="10" width="1" height="4" fill="#f4d35e" />
                <path d="M10 10L13 10L11.5 12L10.5 12L10 10Z" fill="#ff6b6b" />
                
                {/* Decorative elements around the circle */}
                <circle cx="12" cy="5" r="0.8" fill="#f4d35e" />
                <circle cx="19" cy="12" r="0.8" fill="#ff6b6b" />
                <circle cx="12" cy="19" r="0.8" fill="#f4d35e" />
                <circle cx="5" cy="12" r="0.8" fill="#ff6b6b" />
                
                {/* Small accent dots */}
                <circle cx="15" cy="8" r="0.4" fill="#ff6b6b" />
                <circle cx="9" cy="8" r="0.4" fill="#ff6b6b" />
                <circle cx="15" cy="16" r="0.4" fill="#f4d35e" />
                <circle cx="9" cy="16" r="0.4" fill="#f4d35e" />
              </svg>
            </div>
            <span className={`font-bold ${sizeClasses[size]} ${className}`}>
              <span className="text-[#0077b6]">Fluent</span>
              <span className="text-[#ff6b6b]">Ship</span>
            </span>
          </div>
        );

      case 'ship-bubble':
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              {/* Ship with speech bubble sail */}
              <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
                {/* Ship hull */}
                <path d="M3 18L6 15H18L21 18H3Z" fill="#0077b6" />
                {/* Speech bubble sail */}
                <path d="M8 15L8 8C8 6.89543 8.89543 6 10 6H14C15.1046 6 16 6.89543 16 8V15L14 13H10L8 15Z" fill="#ff6b6b" />
                {/* Speech bubble tail */}
                <path d="M10 13L12 15L10 17L10 13Z" fill="#ff6b6b" />
                {/* Mast */}
                <rect x="11.5" y="4" width="1" height="11" fill="#f4d35e" />
              </svg>
            </div>
            <span className={`font-bold ${sizeClasses[size]} ${className}`}>
              <span className="text-[#0077b6]">Fluent</span>
              <span className="text-[#ff6b6b]">Ship</span>
            </span>
          </div>
        );

      case 'crew':
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              {/* Ship with crew */}
              <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
                {/* Ship hull */}
                <path d="M2 18L5 15H19L22 18H2Z" fill="#0077b6" />
                {/* Deck */}
                <rect x="5" y="15" width="14" height="3" fill="#f6f5f3" />
                {/* Crew members */}
                <circle cx="7" cy="13" r="1.5" fill="#ff6b6b" />
                <circle cx="10" cy="13" r="1.5" fill="#ff6b6b" />
                <circle cx="13" cy="13" r="1.5" fill="#ff6b6b" />
                <circle cx="16" cy="13" r="1.5" fill="#ff6b6b" />
                {/* Mast */}
                <rect x="11.5" y="8" width="1" height="7" fill="#f4d35e" />
                {/* Sail */}
                <path d="M8 8L16 8L14 12L10 12L8 8Z" fill="#f6f5f3" stroke="#0077b6" strokeWidth="0.5" />
              </svg>
            </div>
            <span className={`font-bold ${sizeClasses[size]} ${className}`}>
              <span className="text-[#0077b6]">Fluent</span>
              <span className="text-[#ff6b6b]">Ship</span>
            </span>
          </div>
        );

      case 'compass':
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              {/* Compass icon */}
              <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#f6f5f3" stroke="#0077b6" strokeWidth="2" />
                <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" fill="#ff6b6b" />
                <circle cx="12" cy="12" r="2" fill="#f4d35e" />
              </svg>
            </div>
            <span className={`font-bold ${sizeClasses[size]} ${className}`}>
              <span className="text-[#0077b6]">Fluent</span>
              <span className="text-[#ff6b6b]">Ship</span>
            </span>
          </div>
        );

      case 'wave':
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              {/* Wave icon */}
              <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
                <path d="M2 18C4 16 6 16 8 18C10 20 12 20 14 18C16 16 18 16 20 18C22 20 24 20 26 18" 
                      stroke="#0077b6" strokeWidth="2" fill="none" />
                <path d="M2 14C4 12 6 12 8 14C10 16 12 16 14 14C16 12 18 12 20 14C22 16 24 16 26 14" 
                      stroke="#ff6b6b" strokeWidth="2" fill="none" />
                <path d="M2 10C4 8 6 8 8 10C10 12 12 12 14 10C16 8 18 8 20 10C22 12 24 12 26 10" 
                      stroke="#f4d35e" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className={`font-bold ${sizeClasses[size]} ${className}`}>
              <span className="text-[#0077b6]">Fluent</span>
              <span className="text-[#ff6b6b]">Ship</span>
            </span>
          </div>
        );

      default:
        return (
          <span className={`font-bold ${sizeClasses[size]} ${className}`}>
            <span className="text-[#0077b6]">Fluent</span>
            <span className="text-[#ff6b6b]">Ship</span>
          </span>
        );
    }
  };

  return (
    <Link href="/" className="hover:opacity-90 transition-opacity duration-200">
      {renderLogo()}
    </Link>
  );
} 