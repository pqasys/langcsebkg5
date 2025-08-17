'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { Search, Filter, Star, Crown, TrendingUp, Tag, Palette } from 'lucide-react';
import { EnhancedCourseCard } from '@/components/EnhancedCourseCard';
import { AdvertisingBanner, PremiumCourseBanner, FeaturedInstitutionBanner, PromotionalBanner } from '@/components/AdvertisingBanner';
import { DesignablePremiumCourseBanner, DesignableFeaturedInstitutionBanner, DesignablePromotionalBanner } from '@/components/design/DesignableAdvertisingBanner';
import { EnhancedPromotionalSidebar } from '@/components/design/EnhancedPromotionalSidebar';
import { DesignToolkit } from '@/components/design/DesignToolkit';
import { DesignConfig, DEFAULT_DESIGN_CONFIG } from '@/components/design/DesignToolkit';
import { TagFilter } from '@/components/TagFilter';
import EnrollmentModal from '../app/student/components/EnrollmentModal';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description?: string;
  institution: {
    id?: string;
    name: string;
    country?: string;
    city?: string;
    subscriptionPlan?: string;
    isFeatured?: boolean;
  } | null;
  status: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  base_price: number;
  hasOutstandingPayment?: boolean;
  payment?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
  pricingPeriod?: string;
  enrollmentDetails?: unknown;
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
  isPremiumPlacement?: boolean;
  isFeaturedPlacement?: boolean;
  isHighCommission?: boolean;
}

interface IndividualDesignConfig {
  [itemId: string]: DesignConfig;
}

export default function CoursesPageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showAdvertising, setShowAdvertising] = useState(true);
  
  // Design Toolkit state
  const [showDesignToolkit, setShowDesignToolkit] = useState(false);
  const [individualDesignConfigs, setIndividualDesignConfigs] = useState<IndividualDesignConfig>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(false);

  // Check for enrollment intent from URL parameters
  useEffect(() => {
    const enrollCourseId = searchParams.get('enroll');
    if (enrollCourseId && status === 'authenticated' && session?.user?.role === 'STUDENT') {
      setSelectedCourseId(enrollCourseId);
      setShowEnrollmentModal(true);
    }
  }, [searchParams, status, session]);

  // Load design configurations from database
  useEffect(() => {
    const loadDesignConfigs = async () => {
      try {
        setIsLoadingDesigns(true);
        
        let response;
        if (session?.user) {
          // Authenticated user - load user's own designs + admin designs
          console.log('🔄 Loading design configs for authenticated user:', session.user.id);
          response = await fetch('/api/design-configs?includeAdminDesigns=true');
        } else {
          // Unauthenticated user - load only public admin designs
          console.log('🔄 Loading public design configs for unauthenticated user');
          response = await fetch('/api/design-configs/public');
        }
        
        if (response.ok) {
          const data = await response.json();
          console.log('📥 Raw database response:', data);
          const configsMap: IndividualDesignConfig = {};
          
          // Convert array to map by itemId and transform database format to DesignConfig format
          const configsByItemId: { [key: string]: any[] } = {};
          
          data.configs.forEach((config: any) => {
            const itemId = config.itemId;
            if (itemId) {
              if (!configsByItemId[itemId]) {
                configsByItemId[itemId] = [];
              }
              configsByItemId[itemId].push(config);
            }
          });
          
          // For each itemId, use the most recent config (highest createdAt)
          Object.keys(configsByItemId).forEach(itemId => {
            const configs = configsByItemId[itemId];
            const mostRecentConfig = configs.reduce((latest, current) => 
              new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
            );
            
            configsMap[itemId] = transformDatabaseConfig(mostRecentConfig);
          });
          
          console.log('🔄 Transformed configs map:', Object.keys(configsMap));
          setIndividualDesignConfigs(configsMap);
          
          // Initialize default banner styles if they don't exist
          initializeDefaultBannerStyles(configsMap);
        } else {
          console.error('❌ Failed to load design configs:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ Error loading design configs:', error);
      } finally {
        setIsLoadingDesigns(false);
      }
    };

    loadDesignConfigs();
  }, [session]);

  // Initialize default banner styles in the database
  const initializeDefaultBannerStyles = async (existingConfigs: IndividualDesignConfig) => {
    if (!session?.user) return;

    const defaultBannerConfigs = {
      'premium-course-banner': {
        name: 'Default Premium Course Banner',
        description: 'Default styling for premium course banners with purple gradient',
        itemId: 'premium-course-banner',
        backgroundType: 'gradient',
        backgroundColor: '#8b5cf6',
        backgroundGradientFrom: '#8b5cf6',
        backgroundGradientTo: '#ec4899',
        backgroundGradientDirection: 'to-r',
        backgroundImage: '',
        backgroundPattern: 'none',
        backgroundOpacity: 10,
        titleFont: 'inter',
        titleSize: 24,
        titleWeight: 'bold',
        titleColor: '#1f2937',
        titleAlignment: JSON.stringify({
          horizontal: 'left' as const,
          vertical: 'top' as const,
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }),
        titleShadow: false,
        titleShadowColor: '#000000',
        descriptionFont: 'inter',
        descriptionSize: 16,
        descriptionColor: '#6b7280',
        descriptionAlignment: JSON.stringify({
          horizontal: 'left' as const,
          vertical: 'top' as const,
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }),
        padding: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderStyle: 'solid',
        shadow: false,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10,
        shadowOffset: 5,
        hoverEffect: 'none',
        animationDuration: 300,
        customCSS: '',
        isActive: true,
        isDefault: true
      },
      'featured-institution-banner': {
        name: 'Default Featured Institution Banner',
        description: 'Default styling for featured institution banners with orange gradient',
        itemId: 'featured-institution-banner',
        backgroundType: 'gradient',
        backgroundColor: '#f97316',
        backgroundGradientFrom: '#f97316',
        backgroundGradientTo: '#ef4444',
        backgroundGradientDirection: 'to-r',
        backgroundImage: '',
        backgroundPattern: 'none',
        backgroundOpacity: 10,
        titleFont: 'inter',
        titleSize: 24,
        titleWeight: 'bold',
        titleColor: '#1f2937',
        titleAlignment: JSON.stringify({
          horizontal: 'left' as const,
          vertical: 'top' as const,
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }),
        titleShadow: false,
        titleShadowColor: '#000000',
        descriptionFont: 'inter',
        descriptionSize: 16,
        descriptionColor: '#6b7280',
        descriptionAlignment: JSON.stringify({
          horizontal: 'left' as const,
          vertical: 'top' as const,
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }),
        padding: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderStyle: 'solid',
        shadow: false,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10,
        shadowOffset: 5,
        hoverEffect: 'none',
        animationDuration: 300,
        customCSS: '',
        isActive: true,
        isDefault: true
      },
      'promotional-banner': {
        name: 'Default Promotional Banner',
        description: 'Default styling for promotional banners with green gradient',
        itemId: 'promotional-banner',
        backgroundType: 'gradient',
        backgroundColor: '#22c55e',
        backgroundGradientFrom: '#22c55e',
        backgroundGradientTo: '#10b981',
        backgroundGradientDirection: 'to-r',
        backgroundImage: '',
        backgroundPattern: 'none',
        backgroundOpacity: 10,
        titleFont: 'inter',
        titleSize: 24,
        titleWeight: 'bold',
        titleColor: '#1f2937',
        titleAlignment: JSON.stringify({
          horizontal: 'left' as const,
          vertical: 'top' as const,
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }),
        titleShadow: false,
        titleShadowColor: '#000000',
        descriptionFont: 'inter',
        descriptionSize: 16,
        descriptionColor: '#6b7280',
        descriptionAlignment: JSON.stringify({
          horizontal: 'left' as const,
          vertical: 'top' as const,
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }),
        padding: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderStyle: 'solid',
        shadow: false,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10,
        shadowOffset: 5,
        hoverEffect: 'none',
        animationDuration: 300,
        customCSS: '',
        isActive: true,
        isDefault: true
      }
    };

    // Check which default configs need to be created
    const configsToCreate = Object.keys(defaultBannerConfigs).filter(
      itemId => !existingConfigs[itemId]
    );

    if (configsToCreate.length > 0) {
      console.log('🔄 Creating default banner styles for:', configsToCreate);
      
      try {
        // Create default configs in parallel
        const createPromises = configsToCreate.map(itemId => 
          fetch('/api/design-configs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(defaultBannerConfigs[itemId as keyof typeof defaultBannerConfigs]),
          })
        );

        const responses = await Promise.all(createPromises);
        const successful = responses.filter(response => response.ok);
        
        console.log(`✅ Created ${successful.length} default banner styles`);
        
        // Reload configs to include the newly created defaults
        if (successful.length > 0) {
          setTimeout(() => {
            // Reload the page to refresh the design configs
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        console.error('❌ Error creating default banner styles:', error);
      }
    }
  };

  // Function to transform database data to DesignConfig format
  const transformDatabaseConfig = (dbConfig: any): DesignConfig => {
    // Parse alignment objects from JSON strings
    let titleAlignment = {
      horizontal: 'left',
      vertical: 'top',
      padding: { top: 0, bottom: 0, left: 0, right: 0 }
    };
    
    let descriptionAlignment = {
      horizontal: 'left',
      vertical: 'top',
      padding: { top: 0, bottom: 0, left: 0, right: 0 }
    };

    try {
      if (dbConfig.titleAlignment) {
        titleAlignment = typeof dbConfig.titleAlignment === 'string' 
          ? JSON.parse(dbConfig.titleAlignment) 
          : dbConfig.titleAlignment;
      }
    } catch (error) {
      console.warn('Error parsing titleAlignment:', error);
    }

    try {
      if (dbConfig.descriptionAlignment) {
        descriptionAlignment = typeof dbConfig.descriptionAlignment === 'string' 
          ? JSON.parse(dbConfig.descriptionAlignment) 
          : dbConfig.descriptionAlignment;
      }
    } catch (error) {
      console.warn('Error parsing descriptionAlignment:', error);
    }

    return {
      backgroundType: dbConfig.backgroundType || 'solid',
      backgroundColor: dbConfig.backgroundColor || '#ffffff',
      backgroundGradient: {
        from: dbConfig.backgroundGradientFrom || '#667eea',
        to: dbConfig.backgroundGradientTo || '#764ba2',
        direction: dbConfig.backgroundGradientDirection || 'to-r'
      },
      backgroundImage: dbConfig.backgroundImage || '',
      backgroundPattern: dbConfig.backgroundPattern || 'none',
      backgroundOpacity: dbConfig.backgroundOpacity || 100,
      titleFont: dbConfig.titleFont || 'inter',
      titleSize: dbConfig.titleSize || 24,
      titleWeight: dbConfig.titleWeight || 'bold',
      titleColor: dbConfig.titleColor || '#1f2937',
      titleAlignment: {
        horizontal: titleAlignment.horizontal || 'left',
        vertical: titleAlignment.vertical || 'top',
        padding: {
          top: titleAlignment.padding?.top || 0,
          bottom: titleAlignment.padding?.bottom || 0,
          left: titleAlignment.padding?.left || 0,
          right: titleAlignment.padding?.right || 0
        }
      },
      titleShadow: dbConfig.titleShadow || false,
      titleShadowColor: dbConfig.titleShadowColor || '#000000',
      descriptionFont: dbConfig.descriptionFont || 'inter',
      descriptionSize: dbConfig.descriptionSize || 16,
      descriptionColor: dbConfig.descriptionColor || '#6b7280',
      descriptionAlignment: {
        horizontal: descriptionAlignment.horizontal || 'left',
        vertical: descriptionAlignment.vertical || 'top',
        padding: {
          top: descriptionAlignment.padding?.top || 0,
          bottom: descriptionAlignment.padding?.bottom || 0,
          left: descriptionAlignment.padding?.left || 0,
          right: descriptionAlignment.padding?.right || 0
        }
      },
      padding: dbConfig.padding || 20,
      borderRadius: dbConfig.borderRadius || 8,
      borderWidth: dbConfig.borderWidth || 1,
      borderColor: dbConfig.borderColor || '#e5e7eb',
      borderStyle: dbConfig.borderStyle || 'solid',
      shadow: dbConfig.shadow || false,
      shadowColor: dbConfig.shadowColor || 'rgba(0, 0, 0, 0.1)',
      shadowBlur: dbConfig.shadowBlur || 10,
      shadowOffset: dbConfig.shadowOffset || 5,
      hoverEffect: dbConfig.hoverEffect || 'none',
      animationDuration: dbConfig.animationDuration || 300,
      customCSS: dbConfig.customCSS || ''
    };
  };

  // Get appropriate default design config for each banner type
  const getDefaultConfigForItem = (itemId: string): DesignConfig => {
    switch (itemId) {
      case 'premium-course-banner':
        return {
          ...DEFAULT_DESIGN_CONFIG,
          backgroundType: 'gradient',
          backgroundGradient: {
            from: '#8b5cf6', // purple-500
            to: '#ec4899',  // pink-500
            direction: 'to-r',
          },
          backgroundColor: '#8b5cf6',
          backgroundOpacity: 10, // 10% opacity like the original
          titleColor: '#1f2937',
          descriptionColor: '#6b7280',
        };
      case 'featured-institution-banner':
        return {
          ...DEFAULT_DESIGN_CONFIG,
          backgroundType: 'gradient',
          backgroundGradient: {
            from: '#f97316', // orange-500
            to: '#ef4444',  // red-500
            direction: 'to-r',
          },
          backgroundColor: '#f97316',
          backgroundOpacity: 10,
          titleColor: '#1f2937',
          descriptionColor: '#6b7280',
        };
      case 'promotional-banner':
        return {
          ...DEFAULT_DESIGN_CONFIG,
          backgroundType: 'gradient',
          backgroundGradient: {
            from: '#22c55e', // green-500
            to: '#10b981',  // emerald-500
            direction: 'to-r',
          },
          backgroundColor: '#22c55e',
          backgroundOpacity: 10,
          titleColor: '#1f2937',
          descriptionColor: '#6b7280',
        };
      default:
        return DEFAULT_DESIGN_CONFIG;
    }
  };

  // Get design config for a specific item
  const getItemDesignConfig = (itemId: string): DesignConfig => {
    // First check if there's a saved config for this item
    if (individualDesignConfigs[itemId]) {
      return individualDesignConfigs[itemId];
    }
    
    // If no saved config, use the default config for this banner type
    return getDefaultConfigForItem(itemId);
  };

  // Handle edit item
  const handleEditItem = (itemId: string) => {
    console.log('🎨 Edit item clicked:', itemId);
    setEditingItemId(itemId);
    setShowDesignToolkit(true);
  };

  // Handle save item design
  const handleSaveItemDesign = (config: DesignConfig) => {
    if (editingItemId) {
      console.log('🎨 Saving design config for item:', editingItemId, config);
      saveIndividualConfig(editingItemId, config);
      setShowDesignToolkit(false);
      setEditingItemId(null);
    }
  };

  // Save design configuration to database
  const saveIndividualConfig = async (itemId: string, config: DesignConfig) => {
    if (!session?.user) {
      console.error('No session available for saving design config');
      return;
    }

    console.log('💾 Saving design config for item:', itemId);
    
    const updated = { ...individualDesignConfigs, [itemId]: config };
    setIndividualDesignConfigs(updated);

    // Flatten the nested objects for database storage
    const flattenedConfig = {
      name: `Design for ${itemId}`,
      description: `Custom design configuration for promotional item: ${itemId}`,
      itemId: itemId,
      backgroundType: config.backgroundType,
      backgroundColor: config.backgroundColor,
      backgroundGradientFrom: config.backgroundGradient?.from,
      backgroundGradientTo: config.backgroundGradient?.to,
      backgroundGradientDirection: config.backgroundGradient?.direction,
      backgroundImage: config.backgroundImage,
      backgroundPattern: config.backgroundPattern,
      backgroundOpacity: config.backgroundOpacity,
      titleFont: config.titleFont,
      titleSize: config.titleSize,
      titleWeight: config.titleWeight,
      titleColor: config.titleColor,
      titleAlignment: JSON.stringify(config.titleAlignment),
      titleShadow: config.titleShadow,
      titleShadowColor: config.titleShadowColor,
      descriptionFont: config.descriptionFont,
      descriptionSize: config.descriptionSize,
      descriptionColor: config.descriptionColor,
      descriptionAlignment: JSON.stringify(config.descriptionAlignment),
      padding: config.padding,
      borderRadius: config.borderRadius,
      borderWidth: config.borderWidth,
      borderColor: config.borderColor,
      borderStyle: config.borderStyle,
      shadow: config.shadow,
      shadowColor: config.shadowColor,
      shadowBlur: config.shadowBlur,
      shadowOffset: config.shadowOffset,
      hoverEffect: config.hoverEffect,
      animationDuration: config.animationDuration,
      customCSS: config.customCSS,
      isActive: true,
      isDefault: false
    };
    
    try {
      const response = await fetch('/api/design-configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flattenedConfig),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(`✅ Saved design config for item: ${itemId} to database`, responseData);
      } else {
        const errorText = await response.text();
        console.error('Failed to save to database:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error saving design config:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/public?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      console.log('Fetched courses:', data.length, 'courses found');
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Failed to load courses. Please try again or contact support if the problem persists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.institution?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(course => {
        switch (priorityFilter) {
          case 'featured':
            return course.isFeaturedPlacement;
          case 'premium':
            return course.isPremiumPlacement;
          case 'high-commission':
            return course.isHighCommission;
          default:
            return true;
        }
      });
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(course =>
        course.courseTags?.some(courseTag =>
          selectedTags.includes(courseTag.tag.name)
        )
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, statusFilter, priorityFilter, selectedTags]);

  const handleEnroll = async (courseId: string) => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/courses?enroll=${courseId}`)}`);
      return;
    }

    if (session?.user?.role !== 'STUDENT') {
      return;
    }

    try {
      // Check enrollment eligibility before opening modal
      const response = await fetch(`/api/student/courses/${courseId}/check-enrollment-eligibility`);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle subscription requirement
        if (response.status === 402 && errorData.error === 'Subscription required') {
          console.log('Subscription required for this course');
          toast.error('This course requires an active subscription to enroll.');
          
          // Redirect to subscription page
          if (errorData.redirectUrl) {
            router.push(errorData.redirectUrl);
          } else {
            router.push('/subscription-signup');
          }
          return;
        }
        
        // Handle other errors
        toast.error(errorData.details || errorData.error || 'Unable to check enrollment eligibility');
        return;
      }

      // User is eligible, open enrollment modal
      setSelectedCourseId(courseId);
      setShowEnrollmentModal(true);
    } catch (error) {
      console.error('Error checking enrollment eligibility:', error);
      toast.error('Failed to check enrollment eligibility. Please try again.');
    }
  };

  const handleEnrollmentComplete = () => {
    console.log('Enrollment completed, redirecting to student dashboard...');
    setShowEnrollmentModal(false);
    setSelectedCourseId(null);
    
    // Redirect to student dashboard after successful enrollment
    // Small delay to ensure the modal closes properly
    setTimeout(() => {
      router.push('/student');
    }, 500);
  };

  const handleView = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    const slug = (course as any)?.slug;
    router.push(`/courses/${slug || courseId}`);
  };

  // Get top courses for advertising
  const getTopCourses = () => {
    return courses
      .filter(course => course.isPremiumPlacement || course.isFeaturedPlacement)
      .slice(0, 3);
  };

  // Get featured institutions
  const getFeaturedInstitutions = () => {
    const featuredInstitutions = courses
      .filter(course => course.institution?.isFeatured)
      .map(course => course.institution)
      .filter((inst, index, arr) => arr.findIndex(i => i?.id === inst?.id) === index)
      .slice(0, 2);
    
    return featuredInstitutions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const topCourses = getTopCourses();
  const featuredInstitutions = getFeaturedInstitutions();

  // Check if user has permission to access Design Toolkit
  const canAccessDesignToolkit = session?.user?.role === 'ADMIN' || session?.user?.role === 'INSTITUTION_STAFF';

  // Debug logging
  console.log('🎯 Courses Page Debug:', {
    topCourses: topCourses.length,
    featuredInstitutions: featuredInstitutions.length,
    showAdvertising,
    canAccessDesignToolkit,
    individualDesignConfigs: Object.keys(individualDesignConfigs),
    premiumCourseBanner: getItemDesignConfig('premium-course-banner'),
    featuredInstitutionBanner: getItemDesignConfig('featured-institution-banner'),
    promotionalBanner: getItemDesignConfig('promotional-banner')
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-gray-600 mt-2">
            Discover {filteredCourses.length} language courses from top institutions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canAccessDesignToolkit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDesignToolkit(!showDesignToolkit)}
              className="flex items-center gap-2"
            >
              <Palette className="w-4 h-4" />
              {showDesignToolkit ? 'Hide' : 'Show'} Design Toolkit
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvertising(!showAdvertising)}
          >
            {showAdvertising ? 'Hide' : 'Show'} Ads
          </Button>
        </div>
      </div>

      {/* Design Toolkit Panel */}
      {showDesignToolkit && canAccessDesignToolkit && editingItemId && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Design Toolkit - Editing: {editingItemId}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowDesignToolkit(false);
                setEditingItemId(null);
              }}
            >
              Close
            </Button>
          </div>
                     <DesignToolkit
             config={getItemDesignConfig(editingItemId)}
             onConfigChange={(config) => {
               const updated = { ...individualDesignConfigs, [editingItemId]: config };
               setIndividualDesignConfigs(updated);
             }}
             showSaveButton={true}
             onSave={() => handleSaveItemDesign(getItemDesignConfig(editingItemId))}
             institutionId={session?.user?.institutionId || ''}
             itemId={editingItemId}
           />
        </div>
      )}

             {/* Top Advertising Banner */}
       {showAdvertising && (
         <div className="mb-8">
           <DesignablePremiumCourseBanner 
            course={topCourses[0] || { id: 'demo', title: 'Demo Premium Course', institution: { name: 'Demo Institution' } }}
            className="mb-4"
            designConfig={getItemDesignConfig('premium-course-banner')}
            onEdit={() => handleEditItem('premium-course-banner')}
            showDesignToolkit={canAccessDesignToolkit}
            itemId="premium-course-banner"
          />
        </div>
      )}

             {/* Featured Institutions Banner */}
       {showAdvertising && (
         <div className="mb-8">
           <DesignableFeaturedInstitutionBanner 
            institution={featuredInstitutions[0] || { id: 'demo', name: 'Demo Featured Institution' }}
            className="mb-4"
            designConfig={getItemDesignConfig('featured-institution-banner')}
            onEdit={() => handleEditItem('featured-institution-banner')}
            showDesignToolkit={canAccessDesignToolkit}
            itemId="featured-institution-banner"
          />
        </div>
      )}

      {/* Promotional Banner */}
      {showAdvertising && (
        <div className="mb-8">
          <DesignablePromotionalBanner 
            offer={{
              title: "Summer Language Learning Sale",
              description: "Get 20% off on all courses this summer. Perfect time to start your language journey!",
              ctaText: "View Offers",
              ctaLink: "/offers",
              discount: "Save 20%"
            }}
            className="mb-4"
            designConfig={getItemDesignConfig('promotional-banner')}
            onEdit={() => handleEditItem('promotional-banner')}
            showDesignToolkit={canAccessDesignToolkit}
            itemId="promotional-banner"
          />
        </div>
      )}

      {/* Filters Section */}
      <div className="space-y-4">
        {/* Search and Basic Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 search-container-long">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="AVAILABLE">Available</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="featured">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Featured
                  </div>
                </SelectItem>
                <SelectItem value="premium">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Premium
                  </div>
                </SelectItem>
                <SelectItem value="high-commission">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Popular
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tag Filter */}
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filter by tags:</span>
          <TagFilter
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            className="flex-1"
          />
        </div>
      </div>

      {/* Course Discovery Info */}
      <Alert className="bg-green-50 border-green-200">
        <Info className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Ready to get fluent faster?</strong> Start strong with expert-picked featured courses. Go Premium for smart tools and exclusive content!
        </AlertDescription>
      </Alert>

      {/* Mid-page Advertising */}
      {showAdvertising && filteredCourses.length > 6 && (
        <div className="my-8">
          <AdvertisingBanner
            type="sponsored"
            title="Sponsored: Language Learning Tools"
            description="Enhance your learning experience with our recommended language tools and resources."
            ctaText="Explore Tools"
            ctaLink="/tools"
            stats={{
              students: 2500,
              courses: 150
            }}
            highlight="Recommended"
          />
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="flex gap-8">
        {/* Courses Grid */}
        <div className="flex-1">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <EnhancedCourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
                onView={handleView}
                userRole={session?.user?.role}
                isAuthenticated={status === 'authenticated'}
                showPriorityIndicators={true}
                showAdvertising={showAdvertising}
              />
            ))}
          </div>
        </div>

        {/* Promotional Sidebar */}
        <div className="hidden xl:block">
          <EnhancedPromotionalSidebar 
            maxItems={4}
            showSponsored={showAdvertising}
            showDesignToolkit={session?.user?.role === 'ADMIN' || session?.user?.role === 'INSTITUTION_STAFF'}
            userRole={session?.user?.role}
          />
        </div>
      </div>

      {/* Bottom Advertising */}
      {showAdvertising && filteredCourses.length > 0 && (
        <div className="mt-8">
          <AdvertisingBanner
            type="promotional"
            title="Join Our Language Community"
            description="Connect with fellow learners, share progress, and get exclusive access to community events and resources."
            ctaText="Join Community"
            ctaLink="/community"
            stats={{
              students: 5000,
              courses: 300
            }}
            highlight="Free Access"
          />
        </div>
      )}

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find more courses.
          </p>
          <Button onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setPriorityFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        courseId={selectedCourseId}
        onEnrollmentComplete={handleEnrollmentComplete}
      />
    </div>
  );
} 