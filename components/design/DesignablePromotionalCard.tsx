'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Crown, 
  TrendingUp, 
  Users, 
  BookOpen,
  ChevronRight,
  Award
} from 'lucide-react';
import { DesignConfig } from './DesignToolkit';

export interface PromotionalItem {
  id: string;
  type: 'institution' | 'course' | 'third-party';
  title: string;
  description: string;
  imageUrl?: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  stats?: {
    students?: number;
    courses?: number;
    rating?: number;
  };
  priority?: number;
  isSponsored?: boolean;
}

export interface DesignablePromotionalCardProps {
  item: PromotionalItem;
  designConfig?: DesignConfig;
  className?: string;
  onClick?: () => void;
}

// Default design configuration to use when none is provided
const DEFAULT_CONFIG: DesignConfig = {
  backgroundType: 'solid',
  backgroundColor: '#ffffff',
  backgroundGradient: {
    from: '#667eea',
    to: '#764ba2',
    direction: 'to-r'
  },
  backgroundImage: '',
  backgroundPattern: 'none',
  backgroundOpacity: 100,
  titleFont: 'inter',
  titleSize: 16,
  titleWeight: 'semibold',
  titleColor: '#1f2937',
  titleAlignment: {
    horizontal: 'left',
    vertical: 'top',
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  },
  titleShadow: false,
  titleShadowColor: '#000000',
  descriptionFont: 'inter',
  descriptionSize: 14,
  descriptionColor: '#6b7280',
  descriptionAlignment: {
    horizontal: 'left',
    vertical: 'top',
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  },
  padding: 16,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  borderStyle: 'solid',
  shadow: true,
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowBlur: 10,
  shadowOffset: 4,
  hoverEffect: 'scale',
  animationDuration: 300,
  customCSS: ''
};

export function DesignablePromotionalCard({
  item,
  designConfig,
  className = '',
  onClick
}: DesignablePromotionalCardProps) {
  
  // Ensure we always have a valid design config
  const config = designConfig || DEFAULT_CONFIG;
  
  // Debug logging for image issues
  if (config?.backgroundType === 'image' && config?.backgroundImage) {
    console.log('🖼️ DesignablePromotionalCard received config:', {
      backgroundType: config.backgroundType,
      backgroundImage: config.backgroundImage,
      fullConfig: config
    });
  }

  const getBadgeIcon = (badge?: string) => {
    switch (badge?.toLowerCase()) {
      case 'featured':
        return <Star className="w-3 h-3" />;
      case 'premium':
        return <Crown className="w-3 h-3" />;
      case 'sponsored':
        return <TrendingUp className="w-3 h-3" />;
      case 'free':
        return <Award className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getHoverClasses = () => {
    const hoverEffect = config?.hoverEffect || 'none';
    switch (hoverEffect) {
      case 'scale':
        return 'hover:scale-105';
      case 'glow':
        return 'hover:shadow-lg hover:shadow-blue-500/25';
      case 'slide':
        return 'hover:translate-y-[-2px]';
      case 'bounce':
        return 'hover:animate-bounce';
      default:
        return '';
    }
  };

  const generateStyles = () => {
    const styles: React.CSSProperties = {
      transition: `all ${config?.animationDuration || 300}ms ease`,
    };

    // Handle different background types for all items
    const bgType = config?.backgroundType || 'solid';
    
    // Use complete background shorthand to avoid conflicts
    styles.background = (() => {
      switch (bgType) {
        case 'solid':
          return config?.backgroundColor || '#ffffff';
          
        case 'gradient':
          const gradientDirection = config?.backgroundGradient?.direction || 'to-r';
          const gradientFrom = config?.backgroundGradient?.from || '#667eea';
          const gradientTo = config?.backgroundGradient?.to || '#764ba2';
          
          // Convert direction to proper CSS syntax
          let cssDirection = 'to right';
          switch (gradientDirection) {
            case 'to-r': cssDirection = 'to right'; break;
            case 'to-l': cssDirection = 'to left'; break;
            case 'to-t': cssDirection = 'to top'; break;
            case 'to-b': cssDirection = 'to bottom'; break;
            case 'to-tr': cssDirection = 'to top right'; break;
            case 'to-tl': cssDirection = 'to top left'; break;
            case 'to-br': cssDirection = 'to bottom right'; break;
            case 'to-bl': cssDirection = 'to bottom left'; break;
          }
          
          return `linear-gradient(${cssDirection}, ${gradientFrom}, ${gradientTo})`;
          
        case 'image':
          if (config?.backgroundImage) {
            const imageUrl = `url('${config.backgroundImage}') center / cover no-repeat, ${config?.backgroundColor || '#ffffff'}`;
            console.log('🖼️ Image background string:', imageUrl);
            console.log('🖼️ Original image URL:', config.backgroundImage);
            return imageUrl;
          }
          return config?.backgroundColor || '#ffffff';
          
        case 'pattern':
          const pattern = config?.backgroundPattern || 'none';
          const patternColor = config?.backgroundColor || '#e0e0e0';
          
          console.log('🎨 DesignablePromotionalCard pattern debug:', {
            pattern,
            patternColor,
            backgroundColor: config?.backgroundColor
          });
          
          switch (pattern) {
            case 'dots':
              return `radial-gradient(circle, ${patternColor} 1px, transparent 1px), ${config?.backgroundColor || '#ffffff'} / 20px 20px repeat`;
            case 'lines':
              return `repeating-linear-gradient(45deg, transparent, transparent 5px, ${patternColor} 5px, ${patternColor} 10px), ${config?.backgroundColor || '#ffffff'} / 20px 20px repeat`;
            case 'grid':
              return `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px), ${config?.backgroundColor || '#ffffff'} / 20px 20px repeat`;
            case 'hexagons':
              return `radial-gradient(circle at 50% 50%, ${patternColor} 2px, transparent 2px), ${config?.backgroundColor || '#ffffff'} / 30px 30px repeat`;
            case 'waves':
              return `repeating-linear-gradient(45deg, transparent, transparent 10px, ${patternColor} 10px, ${patternColor} 20px), ${config?.backgroundColor || '#ffffff'} / 40px 40px repeat`;
            case 'stars':
              return `radial-gradient(circle at 25% 25%, ${patternColor} 1px, transparent 1px), radial-gradient(circle at 75% 75%, ${patternColor} 1px, transparent 1px), ${config?.backgroundColor || '#ffffff'} / 50px 50px repeat`;
            default:
              return config?.backgroundColor || '#ffffff';
          }
          
        default:
          return config?.backgroundColor || '#ffffff';
      }
    })();

    // Layout
    styles.padding = `${config?.padding || 16}px`;
    styles.borderRadius = `${config?.borderRadius || 8}px`;
    styles.border = `${config?.borderWidth || 1}px ${config?.borderStyle || 'solid'} ${config?.borderColor || '#e5e7eb'}`;

    // Effects
    if (config?.shadow) {
      styles.boxShadow = `0 ${config.shadowOffset || 4}px ${config.shadowBlur || 10}px ${config.shadowColor || 'rgba(0, 0, 0, 0.1)'}`;
    }

    // Custom CSS
    if (config?.customCSS) {
      // Parse and apply custom CSS but exclude background-related properties to avoid conflicts
      const customStyles = config.customCSS
        .split(';')
        .filter(rule => rule.trim())
        .reduce((acc, rule) => {
          const [property, value] = rule.split(':').map(s => s.trim());
          if (property && value) {
            // Skip background-related properties to avoid conflicts
            const backgroundProps = ['background', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'backgroundColor'];
            if (!backgroundProps.includes(property)) {
              acc[property] = value;
            }
          }
          return acc;
        }, {} as Record<string, string>);
      
      Object.assign(styles, customStyles);
    }

    return styles;
  };

  const generateTitleStyles = () => {
    // Safety check for alignment structure
    const titleAlignment = config?.titleAlignment || { horizontal: 'left', vertical: 'top', padding: { top: 0, bottom: 0, left: 0, right: 0 } };
    const titlePadding = titleAlignment.padding || { top: 0, bottom: 0, left: 0, right: 0 };
    
    return {
      fontFamily: config?.titleFont || 'inter',
      fontSize: `${config?.titleSize || 16}px`,
      fontWeight: config?.titleWeight || 'semibold',
      color: config?.titleColor || '#1f2937',
      textAlign: titleAlignment.horizontal,
      textShadow: config?.titleShadow ? `2px 2px 4px ${config.titleShadowColor || '#000000'}` : 'none',
      paddingTop: `${titlePadding.top}px`,
      paddingBottom: `${titlePadding.bottom}px`,
      paddingLeft: `${titlePadding.left}px`,
      paddingRight: `${titlePadding.right}px`,
    };
  };

  const generateDescriptionStyles = () => {
    // Safety check for alignment structure
    const descriptionAlignment = config?.descriptionAlignment || { horizontal: 'left', vertical: 'top', padding: { top: 0, bottom: 0, left: 0, right: 0 } };
    const descriptionPadding = descriptionAlignment.padding || { top: 0, bottom: 0, left: 0, right: 0 };
    
    return {
      fontFamily: config?.descriptionFont || 'inter',
      fontSize: `${config?.descriptionSize || 14}px`,
      color: config?.descriptionColor || '#6b7280',
      textAlign: descriptionAlignment.horizontal,
      paddingTop: `${descriptionPadding.top}px`,
      paddingBottom: `${descriptionPadding.bottom}px`,
      paddingLeft: `${descriptionPadding.left}px`,
      paddingRight: `${descriptionPadding.right}px`,
    };
  };

  return (
    <Card 
      className={`group transition-all duration-300 ${getHoverClasses()} ${
        item.isSponsored ? 'ring-1 ring-purple-200' : ''
      } ${className}`}
      style={{
        ...generateStyles(),
        // Ensure no default background interferes
        background: generateStyles().background || 'transparent'
      }}
      onClick={onClick}
    >
      {/* Test image div for debugging */}
      {config?.backgroundType === 'image' && config?.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full"
            style={{ 
              background: `url('${config.backgroundImage}') center / cover no-repeat`,
              opacity: 0.3 // Make it visible but not overwhelming
            }}
          ></div>
        </div>
      )}
      
      <CardContent className="p-0 relative z-10">
        <div className="relative p-4">
          {/* Header with badge and optional logo */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              {/* Institution logo for institution type items */}
              {item.type === 'institution' && item.imageUrl && (
                <div className="mb-2">
                  <img 
                    src={item.imageUrl} 
                    alt={`${item.title} logo`}
                    className="h-8 w-auto object-contain"
                    onError={(e) => {
                      // Hide logo if it fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <h4 
                className="font-medium line-clamp-2 group-hover:text-blue-600 transition-colors"
                style={generateTitleStyles()}
              >
                {item.title}
              </h4>
            </div>
            {item.badge && (
              <Badge 
                variant="secondary" 
                className="ml-2 flex-shrink-0 text-xs"
              >
                {getBadgeIcon(item.badge)}
                <span className="ml-1">{item.badge}</span>
              </Badge>
            )}
          </div>

          {/* Description */}
          <p 
            className="mb-3 line-clamp-2"
            style={generateDescriptionStyles()}
          >
            {item.description}
          </p>

          {/* Stats (if available) */}
          {item.stats && (
            <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
              {item.stats.students && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{item.stats.students.toLocaleString()}</span>
                </div>
              )}
              {item.stats.courses && (
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{item.stats.courses}</span>
                </div>
              )}
              {item.stats.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{item.stats.rating}</span>
                </div>
              )}
            </div>
          )}

          {/* CTA Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof window !== 'undefined') {
                window.open(item.ctaLink, '_blank');
              }
            }}
          >
            {item.ctaText}
            <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
