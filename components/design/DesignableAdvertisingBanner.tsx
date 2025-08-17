'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Star, 
  TrendingUp, 
  Award, 
  Clock, 
  Users, 
  BookOpen,
  ArrowRight,
  X,
  Zap,
  Crown,
  Target,
  Edit3
} from 'lucide-react';
import { DesignConfig } from './DesignToolkit';

interface DesignableAdvertisingBannerProps {
  type: 'premium' | 'featured' | 'promotional' | 'sponsored';
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  icon?: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  stats?: {
    students?: number;
    courses?: number;
    rating?: number;
  };
  highlight?: string;
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  // Design Toolkit props
  designConfig?: DesignConfig;
  onEdit?: () => void;
  showDesignToolkit?: boolean;
  itemId?: string;
}

const gradientClasses = {
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-pink-500',
  green: 'from-green-500 to-emerald-500',
  orange: 'from-orange-500 to-red-500',
  red: 'from-red-500 to-pink-500'
};

const typeConfig = {
  premium: {
    icon: <Crown className="w-5 h-5" />,
    gradient: 'purple' as const,
    badge: 'Premium'
  },
  featured: {
    icon: <Star className="w-5 h-5" />,
    gradient: 'orange' as const,
    badge: 'Featured'
  },
  promotional: {
    icon: <TrendingUp className="w-5 h-5" />,
    gradient: 'green' as const,
    badge: 'Special Offer'
  },
  sponsored: {
    icon: <Target className="w-5 h-5" />,
    gradient: 'blue' as const,
    badge: 'Sponsored'
  }
};

export function DesignableAdvertisingBanner({
  type,
  title,
  description,
  ctaText,
  ctaLink,
  badge,
  icon,
  className = '',
  dismissible = false,
  onDismiss,
  stats,
  highlight,
  gradient,
  designConfig,
  onEdit,
  showDesignToolkit = false,
  itemId
}: DesignableAdvertisingBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = typeConfig[type];
  const gradientClass = gradient ? gradientClasses[gradient] : gradientClasses[config.gradient];

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  // Apply design configuration
  const getBackgroundStyle = () => {
    if (!designConfig) {
      console.log('🎨 No designConfig provided to DesignableAdvertisingBanner');
      return {};
    }
    
    console.log('🎨 DesignableAdvertisingBanner applying designConfig:', {
      backgroundType: designConfig.backgroundType,
      backgroundGradient: designConfig.backgroundGradient,
      backgroundOpacity: designConfig.backgroundOpacity,
      titleColor: designConfig.titleColor,
      titleSize: designConfig.titleSize,
      titleWeight: designConfig.titleWeight
    });
    
    switch (designConfig.backgroundType) {
             case 'solid':
         // Apply opacity to the background color itself
         const solidColor = designConfig.backgroundColor;
         const solidOpacity = designConfig.backgroundOpacity / 100;
         return {
           backgroundColor: solidColor,
           opacity: solidOpacity
         };
                    case 'gradient':
          // Handle both interface format and database format
          const gradientFrom = designConfig.backgroundGradient?.from || (designConfig as any).backgroundGradientFrom;
          const gradientTo = designConfig.backgroundGradient?.to || (designConfig as any).backgroundGradientTo;
          const gradientDirection = designConfig.backgroundGradient?.direction || (designConfig as any).backgroundGradientDirection || 'to-r';
          
          // Convert Tailwind direction to standard CSS direction
          const cssDirection = gradientDirection === 'to-r' ? 'to right' : 
                              gradientDirection === 'to-l' ? 'to left' :
                              gradientDirection === 'to-t' ? 'to top' :
                              gradientDirection === 'to-b' ? 'to bottom' :
                              gradientDirection === 'to-tr' ? 'to top right' :
                              gradientDirection === 'to-tl' ? 'to top left' :
                              gradientDirection === 'to-br' ? 'to bottom right' :
                              gradientDirection === 'to-bl' ? 'to bottom left' :
                              gradientDirection; // Use as-is if it's already a standard CSS value
          
          // Apply opacity to the gradient using a white overlay
          const gradientOpacity = designConfig.backgroundOpacity / 100;
          const backgroundColor = designConfig.backgroundColor || '#ffffff';
          
          if (gradientOpacity < 1) {
            const gradientStyle = {
              background: `linear-gradient(rgba(255, 255, 255, ${1 - gradientOpacity}), rgba(255, 255, 255, ${1 - gradientOpacity})), linear-gradient(${cssDirection}, ${gradientFrom}, ${gradientTo}), ${backgroundColor}`
            };
            console.log('🎨 Applied gradient style with opacity:', gradientStyle);
            return gradientStyle;
          } else {
            const gradientStyle = {
              background: `linear-gradient(${cssDirection}, ${gradientFrom}, ${gradientTo})`
            };
            console.log('🎨 Applied gradient style:', gradientStyle);
            return gradientStyle;
                     }
      case 'image':
        if (designConfig.backgroundImage) {
          const opacity = designConfig.backgroundOpacity / 100;
          const backgroundColor = designConfig.backgroundColor || '#ffffff';
          
          // Apply opacity to the background image using linear-gradient overlay
          if (opacity < 1) {
            return {
              background: `linear-gradient(rgba(255, 255, 255, ${1 - opacity}), rgba(255, 255, 255, ${1 - opacity})), url('${designConfig.backgroundImage}') center / cover no-repeat, ${backgroundColor}`
            };
          } else {
            return {
              background: `url('${designConfig.backgroundImage}') center / cover no-repeat, ${backgroundColor}`
            };
          }
        }
        return {
          backgroundColor: designConfig.backgroundColor || '#ffffff'
        };
      default:
        return {};
    }
  };

  const getTextStyle = (element: 'title' | 'description') => {
    if (!designConfig) return {};
    
    const config = element === 'title' ? {
      fontSize: `${designConfig.titleSize}px`,
      fontWeight: designConfig.titleWeight,
      color: designConfig.titleColor,
      textShadow: designConfig.titleShadow ? `2px 2px 4px ${designConfig.titleShadowColor}` : undefined
    } : {
      fontSize: `${designConfig.descriptionSize}px`,
      color: designConfig.descriptionColor
    };
    
    return config;
  };

  const getFontClass = (element: 'title' | 'description') => {
    if (!designConfig) return 'font-inter';
    
    const fontName = element === 'title' ? designConfig.titleFont : designConfig.descriptionFont;
    const fontClass = `font-${fontName || 'inter'}`;
    console.log(`🎨 ${element} font class:`, fontClass, 'for font:', fontName);
    return fontClass;
  };

     const backgroundStyle = getBackgroundStyle();
   console.log('🎨 DesignableAdvertisingBanner final style object:', backgroundStyle);
   console.log('🎨 Background style background property (direct):', backgroundStyle.background);
   console.log('🎨 Background style keys:', Object.keys(backgroundStyle));
   console.log('🎨 Background style values:', Object.values(backgroundStyle));

  return (
    <div 
      className={`relative overflow-hidden rounded-lg border-0 shadow-lg ${className}`} 
    >
             {/* Background overlay with gradient */}
       <div 
         className="absolute inset-0 z-0"
         style={{
           background: backgroundStyle.background || 'transparent',
           opacity: backgroundStyle.opacity || 1,
           pointerEvents: 'none'
         }}
       />
      <div className="relative p-6" style={{ backgroundColor: 'transparent', zIndex: 1 }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {icon || config.icon}
              <Badge 
                variant="secondary" 
                className="bg-white/20 text-white border-white/30"
                style={{
                  backgroundColor: designConfig?.backgroundColor || 'rgba(255, 255, 255, 0.2)',
                  color: designConfig?.titleColor || 'white'
                }}
              >
                {badge || config.badge}
              </Badge>
              
              {/* Design Toolkit Edit Button */}
              {showDesignToolkit && onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="ml-auto h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              )}
              
              {dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="ml-auto h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <h3 
              className={`text-xl font-bold mb-2 ${getFontClass('title')}`}
              style={getTextStyle('title')}
            >
              {title}
              {highlight && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Zap className="w-3 h-3 mr-1" />
                  {highlight}
                </span>
              )}
            </h3>

            <p 
              className={`text-gray-600 mb-4 ${getFontClass('description')}`}
              style={getTextStyle('description')}
            >
              {description}
            </p>

            {stats && (
              <div className="flex items-center gap-6 mb-4 text-sm text-gray-500">
                {stats.students && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{stats.students.toLocaleString()}+ students</span>
                  </div>
                )}
                {stats.courses && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{stats.courses}+ courses</span>
                  </div>
                )}
                {stats.rating && (
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{stats.rating}/5 rating</span>
                  </div>
                )}
              </div>
            )}

            <Button 
              className={`bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white border-0`}
              onClick={() => { if (typeof window !== 'undefined') window.open(ctaLink, '_blank'); }}
              style={{
                backgroundColor: designConfig?.buttonBackgroundColor,
                color: designConfig?.buttonColor,
                borderRadius: `${designConfig?.buttonBorderRadius || 8}px`,
                fontFamily: designConfig?.buttonFont,
                fontSize: `${designConfig?.buttonSize}px`,
                fontWeight: designConfig?.buttonWeight,
                padding: designConfig?.buttonPadding ? 
                  `${designConfig.buttonPadding.top}px ${designConfig.buttonPadding.right}px ${designConfig.buttonPadding.bottom}px ${designConfig.buttonPadding.left}px` : 
                  undefined
              }}
            >
              {ctaText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Specialized banner components for common use cases
export function DesignablePremiumCourseBanner({ course, designConfig, onEdit, showDesignToolkit, itemId, ...props }: any) {
  console.log('🎨 DesignablePremiumCourseBanner received designConfig:', designConfig);
  return (
    <DesignableAdvertisingBanner
      type="premium"
      title={course.title || "Premium Course"}
      description={course.description || "Experience our highest quality language learning program with expert instructors and comprehensive materials."}
      ctaText="Enroll Now"
      ctaLink={`/courses/${(course as any).slug || course.id}`}
      highlight="Top Rated"
      stats={{
        students: course.stats?.students || 1000,
        rating: course.stats?.rating || 4.8
      }}
      designConfig={designConfig}
      onEdit={onEdit}
      showDesignToolkit={showDesignToolkit}
      itemId={itemId}
      {...props}
    />
  );
}

export function DesignableFeaturedInstitutionBanner({ institution, designConfig, onEdit, showDesignToolkit, itemId, ...props }: any) {
  console.log('🎨 DesignableFeaturedInstitutionBanner received designConfig:', designConfig);
  return (
    <DesignableAdvertisingBanner
      type="featured"
      title={institution.name || "Featured Institution"}
      description={`Join ${institution.name} and access their exclusive language learning programs.`}
      ctaText="Learn More"
      ctaLink={`/institutions/${(institution as any).slug || institution.id}`}
      highlight="Featured"
      stats={{
        students: institution.studentCount || 5000,
        courses: institution.courseCount || 50
      }}
      designConfig={designConfig}
      onEdit={onEdit}
      showDesignToolkit={showDesignToolkit}
      itemId={itemId}
      {...props}
    />
  );
}

export function DesignablePromotionalBanner({ offer, designConfig, onEdit, showDesignToolkit, itemId, ...props }: any) {
  console.log('🎨 DesignablePromotionalBanner received designConfig:', designConfig);
  return (
    <DesignableAdvertisingBanner
      type="promotional"
      title={offer.title || "Special Learning Offer"}
      description={offer.description || "Take advantage of our limited-time offer and accelerate your language learning journey with exclusive discounts."}
      ctaText={offer.ctaText || "Get Offer"}
      ctaLink={offer.ctaLink || "/offers"}
      highlight={offer.discount || "Save 20%"}
      designConfig={designConfig}
      onEdit={onEdit}
      showDesignToolkit={showDesignToolkit}
      itemId={itemId}
      {...props}
    />
  );
}
