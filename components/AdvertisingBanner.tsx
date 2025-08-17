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
  Target
} from 'lucide-react';

interface AdvertisingBannerProps {
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

export function AdvertisingBanner({
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
  gradient
}: AdvertisingBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = typeConfig[type];
  const gradientClass = gradient ? gradientClasses[gradient] : gradientClasses[config.gradient];

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-10`} />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {icon || config.icon}
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {badge || config.badge}
              </Badge>
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

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {title}
              {highlight && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Zap className="w-3 h-3 mr-1" />
                  {highlight}
                </span>
              )}
            </h3>

            <p className="text-gray-600 mb-4 leading-relaxed">
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
            >
              {ctaText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Specialized banner components for common use cases
export function PremiumCourseBanner({ course, ...props }: unknown) {
  return (
    <AdvertisingBanner
      type="premium"
      title="Premium Course Available"
      description={`Enroll in "${course.title}" from ${course.institution.name} and get exclusive access to premium features, personalized support, and advanced learning materials.`}
      ctaText="Enroll Now"
      ctaLink={`/courses/${(course as any).slug || course.id}`}
      stats={{
        students: course.enrollmentCount || 150,
        rating: 4.8
      }}
      highlight="Limited Time"
      {...props}
    />
  );
}

export function FeaturedInstitutionBanner({ institution, ...props }: unknown) {
  return (
    <AdvertisingBanner
      type="featured"
      title={`Featured: ${institution.name}`}
      description={`Discover why ${institution.name} is a top-rated language institution with proven results and exceptional student satisfaction.`}
      ctaText="View Institution"
      ctaLink={`/institutions/${(institution as any).slug || institution.id}`}
      stats={{
        students: institution.studentCount || 500,
        courses: institution.courseCount || 25,
        rating: 4.9
      }}
      highlight="Top Rated"
      {...props}
    />
  );
}

export function PromotionalBanner({ offer, ...props }: unknown) {
  return (
    <AdvertisingBanner
      type="promotional"
      title={offer.title || "Special Learning Offer"}
      description={offer.description || "Take advantage of our limited-time offer and accelerate your language learning journey with exclusive discounts."}
      ctaText={offer.ctaText || "Get Offer"}
      ctaLink={offer.ctaLink || "/offers"}
      highlight={offer.discount || "Save 20%"}
      {...props}
    />
  );
} 