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
  designConfig: DesignConfig;
  className?: string;
  onClick?: () => void;
}

export function DesignablePromotionalCard({
  item,
  designConfig,
  className = '',
  onClick
}: DesignablePromotionalCardProps) {
  
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
    switch (designConfig.hoverEffect) {
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
      transition: `all ${designConfig.animationDuration}ms ease`,
    };

    // Background
    if (designConfig.backgroundType === 'solid') {
      styles.backgroundColor = designConfig.backgroundColor;
    } else if (designConfig.backgroundType === 'gradient') {
      styles.background = `linear-gradient(${designConfig.backgroundGradient.direction}, ${designConfig.backgroundGradient.from}, ${designConfig.backgroundGradient.to})`;
    } else if (designConfig.backgroundType === 'image' && designConfig.backgroundImage) {
      // Safety check: Don't use institution logos as background images
      const isInstitutionLogo = item.type === 'institution' && item.imageUrl && 
        (designConfig.backgroundImage === item.imageUrl || 
         designConfig.backgroundImage.includes('logo') ||
         designConfig.backgroundImage.includes('institution') ||
         designConfig.backgroundImage.includes('uploads/logos'));
      
      if (isInstitutionLogo) {
        // Fall back to solid background if trying to use institution logo
        styles.backgroundColor = designConfig.backgroundColor || '#ffffff';
      } else {
        // Allow legitimate background images for advertising
        styles.backgroundImage = `url('${designConfig.backgroundImage}')`;
        styles.backgroundSize = 'cover';
        styles.backgroundPosition = 'center';
      }
    }

    // Layout
    styles.padding = `${designConfig.padding}px`;
    styles.borderRadius = `${designConfig.borderRadius}px`;
    styles.border = `${designConfig.borderWidth}px ${designConfig.borderStyle} ${designConfig.borderColor}`;

    // Effects
    if (designConfig.shadow) {
      styles.boxShadow = `0 ${designConfig.shadowOffset}px ${designConfig.shadowBlur}px ${designConfig.shadowColor}`;
    }

    // Custom CSS
    if (designConfig.customCSS) {
      // Parse and apply custom CSS
      const customStyles = designConfig.customCSS
        .split(';')
        .filter(rule => rule.trim())
        .reduce((acc, rule) => {
          const [property, value] = rule.split(':').map(s => s.trim());
          if (property && value) {
            acc[property] = value;
          }
          return acc;
        }, {} as Record<string, string>);
      
      Object.assign(styles, customStyles);
    }

    return styles;
  };

  const generateTitleStyles = () => {
    return {
      fontFamily: designConfig.titleFont,
      fontSize: `${designConfig.titleSize}px`,
      fontWeight: designConfig.titleWeight,
      color: designConfig.titleColor,
      textAlign: designConfig.titleAlignment,
      textShadow: designConfig.titleShadow ? `2px 2px 4px ${designConfig.titleShadowColor}` : 'none',
    };
  };

  const generateDescriptionStyles = () => {
    return {
      fontFamily: designConfig.descriptionFont,
      fontSize: `${designConfig.descriptionSize}px`,
      color: designConfig.descriptionColor,
      textAlign: designConfig.descriptionAlignment,
    };
  };

  return (
    <Card 
      className={`group transition-all duration-300 ${getHoverClasses()} ${
        item.isSponsored ? 'ring-1 ring-purple-200' : ''
      } ${className}`}
      style={generateStyles()}
      onClick={onClick}
    >
      <CardContent className="p-0">
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
