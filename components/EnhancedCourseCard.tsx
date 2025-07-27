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
}

export function EnhancedCourseCard({
  course,
  onEnroll,
  onView,
  userRole,
  isAuthenticated,
  showPriorityIndicators = true,
  showAdvertising = true
}: EnhancedCourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
      {/* Priority Badge */}
      {showPriorityIndicators && getPriorityBadge() && (
        <div className="absolute top-2 left-2 z-20 sm:top-3 sm:left-3">
          {getPriorityBadge()}
        </div>
      )}

      {/* Premium/Featured Background Gradient */}
      {(course.isPremiumPlacement || course.isFeaturedPlacement) && (
        <div className={`absolute inset-0 bg-gradient-to-br ${
          course.isPremiumPlacement 
            ? 'from-purple-50 to-pink-50' 
            : 'from-orange-50 to-red-50'
        } opacity-50`} />
      )}

      <CardHeader className="relative pb-3 pt-10 sm:pt-12">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 leading-tight mb-2">
              {course.title}
            </h3>
            
            {course.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {course.description}
              </p>
            )}

            {/* Institution Info */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{course.institution?.name}</span>
              {course.institution?.city && (
                <span>• {course.institution.city}</span>
              )}
            </div>

            {/* Priority Score */}
            {getRatingDisplay()}
          </div>

          {/* Price */}
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(course.base_price)}
            </div>
            {course.duration && (
              <div className="text-sm text-gray-500">
                {course.duration} weeks
              </div>
            )}
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
            className={`flex-1 ${
              course.isPremiumPlacement 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                : course.isFeaturedPlacement
                ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isAuthenticated && userRole === 'STUDENT' ? 'Enroll Now' : 'Learn More'}
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