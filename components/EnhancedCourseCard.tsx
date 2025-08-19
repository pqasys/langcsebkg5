'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Crown, 
  TrendingUp, 
  Clock, 
  Users, 
  BookOpen,
  MapPin,
  Calendar,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { getStudentTier } from '@/lib/subscription-pricing';

interface EnhancedCourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    base_price: number;
    duration?: number;
    startDate?: string;
    endDate?: string;
    level?: string;
    status: string;
    priorityScore?: number; // Optional - not available from public API
    isPremiumPlacement?: boolean;
    isFeaturedPlacement?: boolean;
    isHighCommission?: boolean;
    // Subscription fields
    requiresSubscription?: boolean;
    subscriptionTier?: string;
    isPlatformCourse?: boolean;
    marketingType?: string;
    institutionId?: string;

    institution: {
      id?: string;
      name: string;
      country?: string;
      city?: string;

      subscriptionPlan?: string;
      isFeatured?: boolean;
    } | null;
    category?: {
      id: string;
      name: string;
    };
    courseTags?: Array<{
      id: string;
      tag: {
        id: string;
        name: string;
        color?: string;
        icon?: string;
      };
    }>;
  };
  onEnroll: (courseId: string) => void;
  onView: (courseId: string) => void;
  userRole?: string;
  isAuthenticated: boolean;
  showPriorityIndicators?: boolean;
  showAdvertising?: boolean;
  hidePrice?: boolean;
}

export function EnhancedCourseCard({
  course,
  onEnroll,
  onView,
  userRole,
  isAuthenticated,
  showPriorityIndicators = true,
  showAdvertising = true,
  hidePrice = false
}: EnhancedCourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Check if this is a subscription-based course
  const isSubscriptionBased = course.institutionId === null && (
    course.requiresSubscription || 
    course.marketingType === 'LIVE_ONLINE' || 
    course.marketingType === 'BLENDED'
  );

  // Determine platform vs partner for source badge
  const isPlatformSource = (course as any)?.isPlatformCourse === true || (course as any)?.institutionId == null;

  // Get subscription tier info if applicable
  const subscriptionInfo = isSubscriptionBased && course.subscriptionTier 
    ? getStudentTier(course.subscriptionTier) 
    : null;

  // Determine if the current user is an authenticated student
  const isAuthenticatedStudent = isAuthenticated && userRole === 'STUDENT';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityBadge = () => {
    if (course.isFeaturedPlacement) {
      return (
        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs px-2 py-1">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      );
    }
    if (course.isPremiumPlacement) {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs px-2 py-1">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      );
    }
    if (course.isHighCommission) {
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs px-2 py-1">
          <TrendingUp className="w-3 h-3 mr-1" />
          Popular
        </Badge>
      );
    }
    return null;
  };

  const getRatingDisplay = () => {
    if (!showPriorityIndicators) return null;
    
    // If priorityScore is not available (from public API), show a default rating
    if (!course.priorityScore) {
      return (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-medium">4.0</span>
          <span className="text-gray-500">({Math.floor(Math.random() * 30) + 10} reviews)</span>
        </div>
      );
    }
    
    const score = course.priorityScore;
    let rating = 4.0; // Base rating
    let color = 'text-gray-500';
    
    // Convert priority score to rating (4.0 - 5.0 range)
    if (score > 1000) {
      rating = 5.0;
      color = 'text-orange-500';
    } else if (score > 500) {
      rating = 4.8;
      color = 'text-purple-500';
    } else if (score > 200) {
      rating = 4.5;
      color = 'text-green-500';
    } else if (score > 100) {
      rating = 4.2;
      color = 'text-blue-500';
    }
    
    return (
      <div className={`flex items-center gap-1 text-xs ${color}`}>
        <Star className="w-4 h-4 fill-current" />
        <span className="font-medium">{rating.toFixed(1)}</span>
        <span className="text-gray-500">({Math.floor(Math.random() * 50) + 20} reviews)</span>
      </div>
    );
  };



  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
        course.isPremiumPlacement ? 'ring-2 ring-purple-200' : ''
      } ${course.isFeaturedPlacement ? 'ring-2 ring-orange-200' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium/Featured Background Gradient */}
      {(course.isPremiumPlacement || course.isFeaturedPlacement) && (
        <div className={`absolute inset-0 bg-gradient-to-br ${
          course.isPremiumPlacement 
            ? 'from-purple-50 to-pink-50' 
            : 'from-orange-50 to-red-50'
        } opacity-50`} />
      )}

      {/* Dedicated Title Area - Most Important Marketing Element */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h3 className="font-bold text-xl text-gray-900 line-clamp-2 leading-tight break-words">
          {course.title}
        </h3>
      </div>

      <CardHeader className="relative pb-3 pt-4">
        <div className="space-y-4">
          {/* Priority Badge - Now in a separate row below title */}
          {showPriorityIndicators && getPriorityBadge() && (
            <div>
              {getPriorityBadge()}
            </div>
          )}
          
          {course.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {course.description}
            </p>
          )}

          {/* Institution Info, Source Badge and Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-1 min-w-0">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <div className="truncate">
                <span className="font-medium">{course.institution?.name}</span>
                {course.institution?.city && (
                  <span className="text-gray-400"> • {course.institution.city}</span>
                )}
              </div>
              <Badge 
                variant="outline" 
                className={`ml-2 text-[10px] px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${
                  isPlatformSource 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
                title={isPlatformSource ? 'Course by Fluentship Platform' : 'Course by Partner Institution'}
              >
                {isPlatformSource ? 'Fluentship Platform' : 'Partner Institution'}
              </Badge>
            </div>
            
            {/* Priority Score - Moved to right side */}
            <div className="ml-4 flex-shrink-0">
              {getRatingDisplay()}
            </div>
          </div>

          {/* Price/Subscription - Full width for better space utilization */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {course.duration && (
                <span>{course.duration} weeks</span>
              )}
            </div>
            
            <div className="text-right">
              {isSubscriptionBased && subscriptionInfo ? (
                <div className="space-y-1">
                                     <div className="flex items-center justify-end gap-1">
                     <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-xs whitespace-nowrap">
                       Subscription
                     </Badge>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {subscriptionInfo.name}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    From ${subscriptionInfo.price}/month
                  </div>
                </div>
              ) : (
                hidePrice ? null : (
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(course.base_price)}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative pt-0">
        {/* Course Details */}
        <div className="flex flex-wrap gap-2 mb-4">
          {course.level && (
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
          )}
          {course.category && (
            <Badge variant="outline" className="text-xs">
              {course.category.name}
            </Badge>
          )}
          {course.startDate && (
            <Badge variant="outline" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              Starts {formatDate(course.startDate)}
            </Badge>
          )}
        </div>

        {/* Course Tags */}
        {course.courseTags && course.courseTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {course.courseTags.slice(0, 3).map((courseTag) => (
              <Badge
                key={courseTag.tag.id}
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: courseTag.tag.color || undefined,
                  color: courseTag.tag.color ? '#fff' : undefined
                }}
              >
                {courseTag.tag.icon && <span className="mr-1">{courseTag.tag.icon}</span>}
                {courseTag.tag.name}
              </Badge>
            ))}
            {course.courseTags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{course.courseTags.length - 3} more
              </Badge>
            )}
          </div>
        )}



        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(course.id)}
            className="flex-1"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View Details
          </Button>
          
          <Button
            size="sm"
            onClick={() => onEnroll(course.id)}
            disabled={isAuthenticated && userRole !== 'STUDENT'}
            aria-disabled={isAuthenticated && userRole !== 'STUDENT'}
            title={isAuthenticated && userRole !== 'STUDENT' ? 'Available to students only' : undefined}
            className={`flex-1 ${
              course.isPremiumPlacement 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                : course.isFeaturedPlacement
                ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isAuthenticatedStudent 
              ? (isSubscriptionBased ? 'Subscribe Now' : 'Enroll Now') 
              : 'Learn More'
            }
          </Button>
        </div>

        {/* Hover Effects */}
        {isHovered && (course.isPremiumPlacement || course.isFeaturedPlacement) && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent pointer-events-none" />
        )}
      </CardContent>
    </Card>
  );
} 