'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  BookOpen,
  Palette,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { DesignToolkit, DesignConfig } from './DesignToolkit';
import { DesignablePromotionalCard, PromotionalItem } from './DesignablePromotionalCard';

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
  priorityScore?: number;
  isPremiumPlacement?: boolean;
  isFeaturedPlacement?: boolean;
  isHighCommission?: boolean;
}

interface EnhancedPromotionalSidebarProps {
  className?: string;
  maxItems?: number;
  showSponsored?: boolean;
  showDesignToolkit?: boolean;
  userRole?: 'ADMIN' | 'INSTITUTION_STAFF' | 'STUDENT' | 'USER';
}

const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  // Background
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
  
  // Typography
  titleFont: 'inter',
  titleSize: 16,
  titleWeight: 'semibold',
  titleColor: '#1f2937',
  titleAlignment: 'left',
  titleShadow: false,
  titleShadowColor: '#000000',
  
  descriptionFont: 'inter',
  descriptionSize: 14,
  descriptionColor: '#6b7280',
  descriptionAlignment: 'left',
  
  // Layout
  padding: 16,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  borderStyle: 'solid',
  
  // Effects
  shadow: true,
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowBlur: 10,
  shadowOffset: 4,
  
  // Animation
  hoverEffect: 'scale',
  animationDuration: 300,
  
  // Custom CSS
  customCSS: '',
};

export function EnhancedPromotionalSidebar({ 
  className = '', 
  maxItems = 4,
  showSponsored = true,
  showDesignToolkit = false,
  userRole = 'USER'
}: EnhancedPromotionalSidebarProps) {
  // Safety function to prevent institution logos from being used as background images
  const sanitizeDesignConfig = (config: DesignConfig): DesignConfig => {
    // Only prevent background images if they appear to be institution logos
    const isInstitutionLogo = config.backgroundImage && 
      (config.backgroundImage.includes('logo') ||
       config.backgroundImage.includes('institution') ||
       config.backgroundImage.includes('uploads/logos'));
    
    if (isInstitutionLogo) {
      return {
        ...config,
        backgroundType: 'solid',
        backgroundImage: '',
      };
    }
    
    // Allow legitimate background images for advertising
    return config;
  };

  const [promotionalItems, setPromotionalItems] = useState<PromotionalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAds, setShowAds] = useState(true);
  const [designConfig, setDesignConfig] = useState<DesignConfig>(sanitizeDesignConfig(DEFAULT_DESIGN_CONFIG));
  const [showDesignPanel, setShowDesignPanel] = useState(false);

  const canEditDesign = userRole === 'ADMIN' || userRole === 'INSTITUTION_STAFF';

  // Load and sanitize saved design configuration
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('promotionalDesignConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setDesignConfig(sanitizeDesignConfig(parsedConfig));
      }
    } catch (error) {
      console.error('Error loading saved design config:', error);
      // Fall back to default sanitized config
      setDesignConfig(sanitizeDesignConfig(DEFAULT_DESIGN_CONFIG));
    }
  }, []);

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
            imageUrl: inst.logoUrl, // Use logo for proper display, not background
            ctaText: 'View Institution',
            ctaLink: `/institutions/${inst.id}`,
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
            ctaLink: `/courses/${course.id}`,
            badge: course.isPremiumPlacement ? 'Premium' : course.isFeaturedPlacement ? 'Featured' : 'Popular',
            stats: {
              rating: 4.5
            },
            priority: course.isPremiumPlacement ? 1000 : course.isFeaturedPlacement ? 800 : 600,
            isSponsored: course.isPremiumPlacement
          });
        });
        
        // Add third-party promotions (static for now)
        if (showSponsored && showAds) {
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
  }, [maxItems, showSponsored, showAds]);

  const handleSaveDesign = () => {
    // Save design configuration to localStorage or API
    localStorage.setItem('promotionalDesignConfig', JSON.stringify(designConfig));
    console.log('Design configuration saved:', designConfig);
  };

  const handleResetDesign = () => {
    setDesignConfig(sanitizeDesignConfig(DEFAULT_DESIGN_CONFIG));
    localStorage.removeItem('promotionalDesignConfig');
  };

  const handleDesignToggle = () => {
    setShowDesignPanel(!showDesignPanel);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Featured & Promotions</h3>
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Curated
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {/* Show/Hide Ads Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={showAds}
              onCheckedChange={setShowAds}
              id="show-ads"
            />
            <Label htmlFor="show-ads" className="text-xs">Ads</Label>
          </div>
          
          {/* Design Toolkit Toggle (Admin/Institution only) */}
          {canEditDesign && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDesignToggle}
            >
              {showDesignPanel ? <EyeOff className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Design Toolkit Panel */}
      {showDesignPanel && canEditDesign && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Design Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
                         <DesignToolkit
               config={designConfig}
               onConfigChange={(config) => setDesignConfig(sanitizeDesignConfig(config))}
               onSave={handleSaveDesign}
               onReset={handleResetDesign}
             />
          </CardContent>
        </Card>
      )}

      {/* Promotional Items */}
      {promotionalItems.map((item) => (
        <DesignablePromotionalCard
          key={item.id}
          item={item}
          designConfig={designConfig}
        />
      ))}

      {/* Footer */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Promotional content helps support our platform
        </p>
        {canEditDesign && (
          <p className="text-xs text-blue-500 mt-1">
            Design settings available for admins
          </p>
        )}
      </div>
    </div>
  );
}
