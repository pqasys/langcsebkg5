'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Crown, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink,
  ChevronRight,
  Award,
  BookOpen
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
// import { toast } from 'sonner';

interface PromotionalItem {
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

interface InstitutionPromotion {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  commissionRate: number;
  subscriptionPlan: string;
  isFeatured: boolean;
  logoUrl?: string;
  courseCount: number;
  studentCount: number;
}

interface CoursePromotion {
  id: string;
  title: string;
  description?: string;
  base_price: number;
  duration?: number;
  level?: string;
  institution?: {
    name: string;
    city: string;
    commissionRate: number;
    isFeatured?: boolean;
  } | null;
  priorityScore?: number; // Optional - not available from public API
  isPremiumPlacement?: boolean;
  isFeaturedPlacement?: boolean;
  isHighCommission?: boolean;
}

interface PromotionalSidebarProps {
  className?: string;
  maxItems?: number;
  showSponsored?: boolean;
}

export function PromotionalSidebar({ 
  className = '', 
  maxItems = 4,
  showSponsored = true 
}: PromotionalSidebarProps) {
  const [promotionalItems, setPromotionalItems] = useState<PromotionalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotionalContent = async () => {
      try {
        setLoading(true);
        
        // Fetch featured institutions
        const institutionsResponse = await fetch('/api/institutions?featured=true&limit=2');
        const institutionsData = institutionsResponse.ok ? await institutionsResponse.json() : { institutions: [] };
        const institutions: InstitutionPromotion[] = institutionsData.institutions || [];
        
        // Fetch courses (no priority filter available, will filter client-side)
        const coursesResponse = await fetch('/api/courses/public');
        const courses: CoursePromotion[] = coursesResponse.ok ? await coursesResponse.json() : [];
        
        // Transform into promotional items
        const items: PromotionalItem[] = [];
        
        // Add institution promotions
        institutions.forEach(inst => {
          items.push({
            id: inst.id,
            type: 'institution',
            title: inst.name,
            description: `${inst.city}, ${inst.country} • ${inst.courseCount} courses`,
            imageUrl: inst.logoUrl,
            ctaText: 'View Institution',
            ctaLink: `/institutions/${(inst as any).slug || inst.id}`,
            badge: inst.isFeatured ? 'Featured' : inst.subscriptionPlan,
            stats: {
              students: inst.studentCount,
              courses: inst.courseCount
            },
            priority: inst.isFeatured ? 1000 : (inst.commissionRate * 10),
            isSponsored: inst.subscriptionPlan === 'ENTERPRISE'
          });
        });
        
        // Add course promotions (filter for high priority courses)
        const highPriorityCourses = courses
          .filter(course => 
            course.institution?.isFeatured || 
            course.institution?.commissionRate > 15 ||
            course.isPremiumPlacement ||
            course.isFeaturedPlacement
          )
          .slice(0, 2);
          
        highPriorityCourses.forEach(course => {
          items.push({
            id: course.id,
            type: 'course',
            title: course.title,
            description: `${course.institution?.name || 'Platform Course'} • ${course.duration || 0} weeks • ${course.level || 'All Levels'}`,
            ctaText: 'View Course',
            ctaLink: `/courses/${(course as any).slug || course.id}`,
            badge: course.isPremiumPlacement ? 'Premium' : course.isFeaturedPlacement ? 'Featured' : 'Popular',
            stats: {
              rating: 4.5
            },
            priority: course.isPremiumPlacement ? 1000 : course.isFeaturedPlacement ? 800 : 600,
            isSponsored: course.isPremiumPlacement
          });
        });
        
        // Add third-party promotions (static for now)
        if (showSponsored) {
          items.push({
            id: 'lang-tools',
            type: 'third-party',
            title: 'Language Learning Tools',
            description: 'Enhance your learning with premium language tools and resources',
            ctaText: 'Explore Tools',
            ctaLink: '/tools',
            badge: 'Sponsored',
            priority: 500,
            isSponsored: true
          });
          
          items.push({
            id: 'community',
            type: 'third-party',
            title: 'Join Our Community',
            description: 'Connect with fellow learners and get exclusive resources',
            ctaText: 'Join Free',
            ctaLink: '/community',
            badge: 'Free',
            priority: 300,
            isSponsored: false
          });
        }
        
        // Sort by priority and limit items
        items.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        
        // If no items from API, add fallback content
        if (items.length === 0) {
          items.push({
            id: 'fallback-1',
            type: 'third-party',
            title: 'Language Learning Tools',
            description: 'Enhance your learning with premium language tools and resources',
            ctaText: 'Explore Tools',
            ctaLink: '/tools',
            badge: 'Sponsored',
            priority: 500,
            isSponsored: true
          });
          
          items.push({
            id: 'fallback-2',
            type: 'third-party',
            title: 'Join Our Community',
            description: 'Connect with fellow learners and get exclusive resources',
            ctaText: 'Join Free',
            ctaLink: '/community',
            badge: 'Free',
            priority: 300,
            isSponsored: false
          });
        }
        
        setPromotionalItems(items.slice(0, maxItems));
        
      } catch (error) {
        console.error('Error fetching promotional content:', error);
        // Fallback content on error
        setPromotionalItems([
          {
            id: 'error-fallback-1',
            type: 'third-party',
            title: 'Language Learning Tools',
            description: 'Enhance your learning with premium language tools and resources',
            ctaText: 'Explore Tools',
            ctaLink: '/tools',
            badge: 'Sponsored',
            priority: 500,
            isSponsored: true
          },
          {
            id: 'error-fallback-2',
            type: 'third-party',
            title: 'Join Our Community',
            description: 'Connect with fellow learners and get exclusive resources',
            ctaText: 'Join Free',
            ctaLink: '/community',
            badge: 'Free',
            priority: 300,
            isSponsored: false
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionalContent();
  }, [maxItems, showSponsored]);

  const getBadgeVariant = (badge?: string) => {
    switch (badge?.toLowerCase()) {
      case 'featured':
      case 'premium':
        return 'default';
      case 'sponsored':
        return 'secondary';
      case 'free':
        return 'outline';
      default:
        return 'secondary';
    }
  };

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

  if (loading) {
    return (
      <div className={`w-80 space-y-4 ${className}`}>
        {[...Array(maxItems)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`w-80 space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Featured & Promotions</h3>
        <Badge variant="outline" className="text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
          Curated
        </Badge>
      </div>

      {promotionalItems.map((item) => (
        <Card 
          key={item.id} 
          className={`group transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
            item.isSponsored ? 'ring-1 ring-purple-200' : ''
          }`}
        >
          <CardContent className="p-4">
            {/* Header with badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
              </div>
              {item.badge && (
                <Badge 
                  variant={getBadgeVariant(item.badge)} 
                  className="ml-2 flex-shrink-0 text-xs"
                >
                  {getBadgeIcon(item.badge)}
                  <span className="ml-1">{item.badge}</span>
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
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
              onClick={() => { if (typeof window !== 'undefined') window.open(item.ctaLink, '_blank'); }}
            >
              {item.ctaText}
              <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Footer */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Promotional content helps support our platform
        </p>
      </div>
    </div>
  );
} 