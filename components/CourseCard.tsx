'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock, Star, Tag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CourseTag {
  id: string;
  tag: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  };
}

interface Institution {
  id: string;
  name: string;
  country: string;
  city: string;
}

interface Category {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
  duration: number;
  level: string;
  status: string;
  institutionId: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  base_price: number;
  pricingPeriod: string;
  framework: string;
  institution: Institution;
  category: Category;
  courseTags: CourseTag[];
}

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onView?: (courseId: string) => void;
  className?: string;
  userRole?: string;
  isAuthenticated?: boolean;
}

const CourseCard = memo<CourseCardProps>(({ course, onEnroll, onView, className = '', userRole, isAuthenticated }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize expensive calculations
  const courseData = useMemo(() => ({
    formattedPrice: formatCurrency(course.base_price),
            formattedDuration: `${course.duration} weeks`,
    startDate: new Date(course.startDate).toLocaleDateString(),
    endDate: new Date(course.endDate).toLocaleDateString(),
    levelDisplay: course.level.replace('CEFR_', ''),
    tags: course.courseTags.slice(0, 3), // Limit to 3 tags for performance
    hasMoreTags: course.courseTags.length > 3
  }), [course]);

  // Simple handlers without debounce
  const handleEnroll = useCallback(async () => {
    if (onEnroll) {
      setIsLoading(true);
      try {
        await onEnroll(course.id);
      } finally {
        setIsLoading(false);
      }
    }
  }, [onEnroll, course.id]);

  const handleView = useCallback(() => {
    if (onView) {
      onView(course.id);
    }
  }, [onView, course.id]);

  return (
    <Card 
      className={`group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className} ${
        isHovered ? 'ring-2 ring-blue-200' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {course.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{course.institution.city}, {course.institution.country}</span>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className="ml-2 flex-shrink-0"
          >
            {courseData.levelDisplay}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {course.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {course.description}
          </p>
        )}

        {/* Course Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{courseData.formattedDuration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>Max {course.maxStudents}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{courseData.startDate}</span>
          </div>

        </div>

        {/* Tags */}
        {courseData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {courseData.tags.map((courseTag) => (
              <Badge 
                key={courseTag.id}
                variant="outline" 
                className="text-xs px-2 py-1"
                style={{ 
                  borderColor: courseTag.tag.color || undefined,
                  color: courseTag.tag.color || undefined 
                }}
              >
                <Tag className="w-3 h-3 mr-1" />
                {courseTag.tag.name}
              </Badge>
            ))}
            {courseData.hasMoreTags && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{course.courseTags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-lg font-bold text-green-600">
            {courseData.formattedPrice}
            <span className="text-sm text-gray-500 font-normal">
              /{course.pricingPeriod.toLowerCase()}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              className="text-blue-600 hover:text-blue-700"
            >
              View
            </Button>
            <Button
              size="sm"
              onClick={handleEnroll}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Enrolling...' : 'Enroll'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CourseCard.displayName = 'CourseCard';

export default CourseCard; 