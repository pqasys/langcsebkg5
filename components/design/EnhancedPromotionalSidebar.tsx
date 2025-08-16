'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Eye, 
  EyeOff, 
  Palette, 
  Settings, 
  X,
  Plus,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';
import { DesignToolkit } from './DesignToolkit';
import { DesignablePromotionalCard, PromotionalItem } from './DesignablePromotionalCard';
import { DesignConfig, DEFAULT_DESIGN_CONFIG } from './DesignToolkit';
import { useSession } from 'next-auth/react';

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

// Enhanced safety check function - moved to top to avoid hoisting issues
const sanitizeDesignConfig = (config: DesignConfig): DesignConfig => {
  // Enhanced safety check: Only prevent institution logos, allow other images
  const isInstitutionLogo = config.backgroundImage &&
    (config.backgroundImage.includes('logo') ||
     config.backgroundImage.includes('institution') ||
     config.backgroundImage.includes('uploads/logos') ||
     config.backgroundImage.toLowerCase().includes('logo'));

  if (isInstitutionLogo) {
    console.log('Sanitizing design config: Preventing institution logo as background');
    return {
      ...DEFAULT_DESIGN_CONFIG, // Start with default to ensure all properties exist
      ...config, // Override with current values
      backgroundType: 'solid',
      backgroundImage: '',
      // Ensure proper alignment structure
      titleAlignment: {
        horizontal: config.titleAlignment?.horizontal || 'left',
        vertical: config.titleAlignment?.vertical || 'top',
        padding: {
          top: config.titleAlignment?.padding?.top || 0,
          bottom: config.titleAlignment?.padding?.bottom || 0,
          left: config.titleAlignment?.padding?.left || 0,
          right: config.titleAlignment?.padding?.right || 0
        }
      },
      descriptionAlignment: {
        horizontal: config.descriptionAlignment?.horizontal || 'left',
        vertical: config.descriptionAlignment?.vertical || 'top',
        padding: {
          top: config.descriptionAlignment?.padding?.top || 0,
          bottom: config.descriptionAlignment?.padding?.bottom || 0,
          left: config.descriptionAlignment?.padding?.left || 0,
          right: config.descriptionAlignment?.padding?.right || 0
        }
      }
    };
  }

  // Allow legitimate background images for advertising, but ensure proper structure
  return {
    ...DEFAULT_DESIGN_CONFIG,
    ...config,
    titleAlignment: {
      horizontal: config.titleAlignment?.horizontal || 'left',
      vertical: config.titleAlignment?.vertical || 'top',
      padding: {
        top: config.titleAlignment?.padding?.top || 0,
        bottom: config.titleAlignment?.padding?.bottom || 0,
        left: config.titleAlignment?.padding?.left || 0,
        right: config.titleAlignment?.padding?.right || 0
      }
    },
    descriptionAlignment: {
      horizontal: config.descriptionAlignment?.horizontal || 'left',
      vertical: config.descriptionAlignment?.vertical || 'top',
      padding: {
        top: config.descriptionAlignment?.padding?.top || 0,
        bottom: config.descriptionAlignment?.padding?.bottom || 0,
        left: config.descriptionAlignment?.padding?.left || 0,
        right: config.descriptionAlignment?.padding?.right || 0
      }
    }
  };
};

interface IndividualDesignConfig {
  [itemId: string]: DesignConfig;
}

interface EnhancedPromotionalSidebarProps {
  maxItems?: number;
  showSponsored?: boolean;
  showDesignToolkit?: boolean;
  userRole?: string;
}

export function EnhancedPromotionalSidebar({ 
  maxItems = 4, 
  showSponsored = true, 
  showDesignToolkit: propShowDesignToolkit = false,
  userRole 
}: EnhancedPromotionalSidebarProps) {
  const { data: session } = useSession();
  const [showAds, setShowAds] = useState(true);
  const [showDesignToolkit, setShowDesignToolkit] = useState(propShowDesignToolkit);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [individualDesignConfigs, setIndividualDesignConfigs] = useState<IndividualDesignConfig>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());

  // Update internal state when prop changes
  useEffect(() => {
    setShowDesignToolkit(propShowDesignToolkit);
  }, [propShowDesignToolkit]);

  // Check if user has permission to access Design Toolkit
  const canAccessDesignToolkit = propShowDesignToolkit && (userRole === 'ADMIN' || userRole === 'INSTITUTION');

  // Debug logging
  useEffect(() => {
    console.log('🔐 Design Toolkit Access Control:', {
      propShowDesignToolkit,
      userRole,
      canAccessDesignToolkit,
      showDesignToolkit
    });
  }, [propShowDesignToolkit, userRole, canAccessDesignToolkit, showDesignToolkit]);

  // Ensure Design Toolkit is hidden if user doesn't have access
  useEffect(() => {
    if (!canAccessDesignToolkit && showDesignToolkit) {
      console.log('🚫 Hiding Design Toolkit - user does not have access');
      setShowDesignToolkit(false);
    }
  }, [canAccessDesignToolkit, showDesignToolkit]);

  // Sample promotional items
  const promotionalItems: PromotionalItem[] = useMemo(() => [
    {
      id: 'institution-1',
      type: 'institution',
      title: 'Cambridge University',
      description: 'Join one of the world\'s most prestigious institutions. Explore our diverse course offerings.',
      imageUrl: '/api/institutions/logo/1',
      ctaText: 'Learn More',
      ctaLink: '/institutions/cambridge',
      badge: 'Featured',
      stats: {
        students: 25000,
        courses: 150,
        rating: 4.8
      },
      priority: 1
    },
    {
      id: 'course-1',
      type: 'course',
      title: 'Advanced Data Science',
      description: 'Master the latest data science techniques with hands-on projects and expert guidance.',
      ctaText: 'Enroll Now',
      ctaLink: '/courses/data-science',
      badge: 'Premium',
      stats: {
        students: 1200,
        rating: 4.9
      },
      priority: 2,
      isSponsored: true
    },
    {
      id: 'third-party-1',
      type: 'third-party',
      title: 'Tech Conference 2024',
      description: 'Join industry leaders for the biggest tech conference of the year. Early bird pricing available.',
      ctaText: 'Register',
      ctaLink: '/events/tech-conference',
      badge: 'Sponsored',
      priority: 3,
      isSponsored: true
    }
  ], []);

  // Load design configurations from database
  useEffect(() => {
    const loadDesignConfigs = async () => {
      try {
        setIsLoading(true);
        
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
          
          // Convert array to map by config name and transform database format to DesignConfig format
          // Group by config name and use the most recent config for each name
          const configsByName: { [key: string]: any[] } = {};
          
          data.configs.forEach((config: any) => {
            const configKey = config.name || config.id;
            if (!configsByName[configKey]) {
              configsByName[configKey] = [];
            }
            configsByName[configKey].push(config);
          });
          
          // For each config name, use the most recent config (highest createdAt)
          Object.keys(configsByName).forEach(configKey => {
            const configs = configsByName[configKey];
            const mostRecentConfig = configs.reduce((latest, current) => 
              new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
            );
            
            // Map configs to promotional item IDs based on name patterns
            let itemId = configKey;
            
            // Try to extract itemId from config name if it follows a pattern
            if (configKey.includes('institution-')) {
              itemId = 'institution-1';
            } else if (configKey.includes('course-')) {
              itemId = 'course-1';
            } else if (configKey.includes('third-party-')) {
              itemId = 'third-party-1';
            }
            
            configsMap[itemId] = transformDatabaseConfig(mostRecentConfig);
          });
          
          console.log('🔄 Transformed configs map:', Object.keys(configsMap));
          setIndividualDesignConfigs(configsMap);
        } else {
          console.error('❌ Failed to load design configs:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ Error loading design configs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDesignConfigs();
  }, [session]);

  // Save design configuration to database
  const saveIndividualConfig = async (itemId: string, config: DesignConfig) => {
    if (!session?.user) {
      console.error('No session available for saving design config');
      return;
    }

    console.log('💾 Saving design config for item:', itemId);
    console.log('💾 Original config:', config);
    
    const sanitized = sanitizeDesignConfig(config);
    console.log('💾 Sanitized config:', sanitized);
    
    const updated = { ...individualDesignConfigs, [itemId]: sanitized };
    setIndividualDesignConfigs(updated);

    // Flatten the nested objects for database storage
    const flattenedConfig = {
      name: `Design for ${itemId}`,
      description: `Custom design configuration for promotional item: ${itemId}`,
      itemId: itemId,
      backgroundType: sanitized.backgroundType,
      backgroundColor: sanitized.backgroundColor,
      backgroundGradientFrom: sanitized.backgroundGradient?.from,
      backgroundGradientTo: sanitized.backgroundGradient?.to,
      backgroundGradientDirection: sanitized.backgroundGradient?.direction,
      backgroundImage: sanitized.backgroundImage,
      backgroundPattern: sanitized.backgroundPattern,
      backgroundOpacity: sanitized.backgroundOpacity,
      titleFont: sanitized.titleFont,
      titleSize: sanitized.titleSize,
      titleWeight: sanitized.titleWeight,
      titleColor: sanitized.titleColor,
      titleAlignment: JSON.stringify(sanitized.titleAlignment),
      titleShadow: sanitized.titleShadow,
      titleShadowColor: sanitized.titleShadowColor,
      descriptionFont: sanitized.descriptionFont,
      descriptionSize: sanitized.descriptionSize,
      descriptionColor: sanitized.descriptionColor,
      descriptionAlignment: JSON.stringify(sanitized.descriptionAlignment),
      padding: sanitized.padding,
      borderRadius: sanitized.borderRadius,
      borderWidth: sanitized.borderWidth,
      borderColor: sanitized.borderColor,
      borderStyle: sanitized.borderStyle,
      shadow: sanitized.shadow,
      shadowColor: sanitized.shadowColor,
      shadowBlur: sanitized.shadowBlur,
      shadowOffset: sanitized.shadowOffset,
      hoverEffect: sanitized.hoverEffect,
      animationDuration: sanitized.animationDuration,
      customCSS: sanitized.customCSS,
      isActive: true,
      isDefault: false
    };
    
    console.log('💾 Flattened config for database:', flattenedConfig);
    
         try {
       // Save to database
       console.log('🔄 Sending to database:', flattenedConfig);
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
         
         // Also save to localStorage as backup
         try {
           localStorage.setItem('individualDesignConfigs', JSON.stringify(updated));
         } catch (localStorageError) {
           console.warn('Could not save to localStorage backup:', localStorageError);
         }
       } else {
         const errorText = await response.text();
         console.error('Failed to save to database:', response.status, response.statusText, errorText);
         // Fallback to localStorage only
         try {
           localStorage.setItem('individualDesignConfigs', JSON.stringify(updated));
           console.log(`✅ Fallback: Saved design config for item: ${itemId} to localStorage`);
         } catch (localStorageError) {
           console.error('Error saving to localStorage fallback:', localStorageError);
         }
       }
     } catch (error) {
       console.error('Error saving design config:', error);
       // Fallback to localStorage only
       try {
         localStorage.setItem('individualDesignConfigs', JSON.stringify(updated));
         console.log(`✅ Fallback: Saved design config for item: ${itemId} to localStorage`);
       } catch (localStorageError) {
         console.error('Error saving to localStorage fallback:', localStorageError);
       }
     }
  };

  // Get design config for a specific item
  const getItemDesignConfig = (itemId: string): DesignConfig => {
    const config = individualDesignConfigs[itemId] || DEFAULT_DESIGN_CONFIG;
    console.log(`🎯 getItemDesignConfig for ${itemId}:`, {
      hasCustomConfig: !!individualDesignConfigs[itemId],
      titleColor: config.titleColor,
      descriptionColor: config.descriptionColor,
      backgroundType: config.backgroundType
    });
    return config;
  };

  // Check if an item has a custom design (different from default)
  const hasCustomDesign = (itemId: string): boolean => {
    try {
      const config = individualDesignConfigs[itemId];
      if (!config) return false;
      
      // Ensure DEFAULT_DESIGN_CONFIG exists and has all properties
      if (!DEFAULT_DESIGN_CONFIG) {
        console.warn('DEFAULT_DESIGN_CONFIG is undefined');
        return false;
      }
      
      // Define safe default values
      const safeDefaults = {
        backgroundType: 'solid',
        backgroundColor: '#ffffff',
        backgroundImage: '',
        backgroundPattern: 'none',
        titleColor: '#1f2937',
        descriptionColor: '#6b7280',
        padding: 16,
        borderRadius: 8
      };
      
      // Ensure config has all required properties with fallbacks
      const safeConfig = {
        backgroundType: config.backgroundType || DEFAULT_DESIGN_CONFIG.backgroundType || safeDefaults.backgroundType,
        backgroundColor: config.backgroundColor || DEFAULT_DESIGN_CONFIG.backgroundColor || safeDefaults.backgroundColor,
        backgroundImage: config.backgroundImage || DEFAULT_DESIGN_CONFIG.backgroundImage || safeDefaults.backgroundImage,
        backgroundPattern: config.backgroundPattern || DEFAULT_DESIGN_CONFIG.backgroundPattern || safeDefaults.backgroundPattern,
        titleColor: config.titleColor || DEFAULT_DESIGN_CONFIG.titleColor || safeDefaults.titleColor,
        descriptionColor: config.descriptionColor || DEFAULT_DESIGN_CONFIG.descriptionColor || safeDefaults.descriptionColor,
        padding: config.padding || DEFAULT_DESIGN_CONFIG.padding || safeDefaults.padding,
        borderRadius: config.borderRadius || DEFAULT_DESIGN_CONFIG.borderRadius || safeDefaults.borderRadius
      };
      
      // Get safe default values for comparison
      const safeDefaultConfig = {
        backgroundType: DEFAULT_DESIGN_CONFIG.backgroundType || safeDefaults.backgroundType,
        backgroundColor: DEFAULT_DESIGN_CONFIG.backgroundColor || safeDefaults.backgroundColor,
        backgroundImage: DEFAULT_DESIGN_CONFIG.backgroundImage || safeDefaults.backgroundImage,
        backgroundPattern: DEFAULT_DESIGN_CONFIG.backgroundPattern || safeDefaults.backgroundPattern,
        titleColor: DEFAULT_DESIGN_CONFIG.titleColor || safeDefaults.titleColor,
        descriptionColor: DEFAULT_DESIGN_CONFIG.descriptionColor || safeDefaults.descriptionColor,
        padding: DEFAULT_DESIGN_CONFIG.padding || safeDefaults.padding,
        borderRadius: DEFAULT_DESIGN_CONFIG.borderRadius || safeDefaults.borderRadius
      };
      
      // Check if any key properties are different from default
      return (
        safeConfig.backgroundType !== safeDefaultConfig.backgroundType ||
        safeConfig.backgroundColor !== safeDefaultConfig.backgroundColor ||
        safeConfig.backgroundImage !== safeDefaultConfig.backgroundImage ||
        safeConfig.backgroundPattern !== safeDefaultConfig.backgroundPattern ||
        safeConfig.titleColor !== safeDefaultConfig.titleColor ||
        safeConfig.descriptionColor !== safeDefaultConfig.descriptionColor ||
        safeConfig.padding !== safeDefaultConfig.padding ||
        safeConfig.borderRadius !== safeDefaultConfig.borderRadius
      );
    } catch (error) {
      console.error('Error in hasCustomDesign:', error);
      return false;
    }
  };

  // Reset design config for a specific item
  const resetItemDesign = async (itemId: string) => {
    const updated = { ...individualDesignConfigs };
    delete updated[itemId];
    setIndividualDesignConfigs(updated);
    
    try {
      // Remove from database if it exists
      if (session?.user) {
        const response = await fetch(`/api/design-configs?itemId=${itemId}&createdBy=${session.user.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log(`🔄 Removed design config for item: ${itemId} from database`);
        }
      }
      
      // Also remove from localStorage
      try {
        localStorage.setItem('individualDesignConfigs', JSON.stringify(updated));
        console.log(`🔄 Reset design config for item: ${itemId}`);
      } catch (localStorageError) {
        console.error('Error resetting design config in localStorage:', localStorageError);
      }
    } catch (error) {
      console.error('Error resetting design config:', error);
    }
  };

  // Clear all individual design configurations
  const clearAllDesignConfigs = async () => {
    setIndividualDesignConfigs({});
    setSelectedItemId(null);
    setEditingItemId(null);
    
    try {
      // Clear from database
      if (session?.user) {
        const response = await fetch(`/api/design-configs?createdBy=${session.user.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log('🗑️ Cleared all design configs from database');
        }
      }
      
      // Clear from localStorage
      try {
        localStorage.removeItem('individualDesignConfigs');
        console.log('🗑️ Cleared all design configs from localStorage');
      } catch (localStorageError) {
        console.error('Error clearing from localStorage:', localStorageError);
      }
    } catch (error) {
      console.error('Error clearing design configs:', error);
    }
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
    if (canAccessDesignToolkit) {
      setShowDesignToolkit(true);
    }
  };

  const handleEditItem = (itemId: string) => {
    console.log('🎨 Edit item clicked:', itemId);
    setEditingItemId(itemId);
    setSelectedItemId(itemId);
    if (canAccessDesignToolkit) {
      setShowDesignToolkit(true); // Ensure design toolkit is shown
    }
  };

  const handleSaveItemDesign = (config: DesignConfig) => {
    if (editingItemId) {
      console.log('🎨 Saving design config for item:', editingItemId, config);
      saveIndividualConfig(editingItemId, config);
      // Clear unsaved changes flag
      setUnsavedChanges(prev => {
        const newSet = new Set(prev);
        newSet.delete(editingItemId);
        return newSet;
      });
      // Close the design toolkit after saving
      handleCloseDesignToolkit();
    }
  };

  const handleCloseDesignToolkit = () => {
    setShowDesignToolkit(false);
    setSelectedItemId(null);
    setEditingItemId(null);
  };

  if (!showAds) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Featured & Promotions</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAds(true)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Show Ads
          </Button>
        </div>
        <p className="text-sm text-gray-500">Promotional content is currently hidden.</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 flex-1 mr-4">Featured & Promotions</h3>
          <div className="flex items-center gap-1">
            {canAccessDesignToolkit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDesignToolkit(!showDesignToolkit)}
                    className="h-8 w-8 p-0"
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showDesignToolkit ? 'Hide Design Toolkit' : 'Show Design Toolkit'}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAds(false)}
                  className="h-8 w-8 p-0"
                >
                  <EyeOff className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hide Promotions</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Loading design configurations...</p>
          </div>
        )}

        {/* Debug Tools - Moved below header for better accessibility */}
        {/* Temporarily disabled - can be re-enabled if needed for debugging */}
        {/*
        {showDesignToolkit && (
          <div className="mb-4 space-y-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Debug Info</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Items with custom designs: {Object.keys(individualDesignConfigs).length}</p>
                <p>Selected: {selectedItemId || 'None'}</p>
                <p>Editing: {editingItemId || 'None'}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllDesignConfigs}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('Individual Design Configs:', individualDesignConfigs);
                  console.log('localStorage:', localStorage.getItem('individualDesignConfigs'));
                }}
                className="flex-1"
              >
                Debug
              </Button>
            </div>
          </div>
        )}
        */}

        {/* Design Toolkit Panel */}
        {showDesignToolkit && canAccessDesignToolkit && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Design Toolkit</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseDesignToolkit}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                {selectedItemId ? (
                  <p>Editing: <strong>{promotionalItems.find(item => item.id === selectedItemId)?.title}</strong></p>
                ) : (
                  <p>Select an item below to customize its design</p>
                )}
              </div>
              
              {editingItemId && (
                <div className="space-y-2">
                                     <DesignToolkit
                     key={editingItemId} // Use stable key to prevent re-renders
                     config={getItemDesignConfig(editingItemId)}
                     onConfigChange={(config) => {
                       // Use a ref to track changes without causing re-renders
                       const updated = { ...individualDesignConfigs, [editingItemId]: config };
                       setIndividualDesignConfigs(updated);
                       // Mark as having unsaved changes
                       setUnsavedChanges(prev => new Set(prev).add(editingItemId!));
                     }}
                     showSaveButton={true}
                     onSave={() => handleSaveItemDesign(getItemDesignConfig(editingItemId))}
                                           institutionId={session?.user?.institutionId || ''}
                   />
                  {unsavedChanges.has(editingItemId) && (
                    <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                      ⚠️ You have unsaved changes. Click "Save Design" to persist your changes.
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resetItemDesign(editingItemId)}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Default
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Promotional Items */}
        <div className="space-y-3">
          {promotionalItems.map((item) => {
            if (!item || !item.id) return null; // Safety check
            
            try {
              const itemConfig = getItemDesignConfig(item.id);
              const isCustom = hasCustomDesign(item.id);
              
              return (
                <div key={item.id} className="relative">
                  <DesignablePromotionalCard
                    item={item}
                    designConfig={itemConfig}
                    onClick={() => handleItemClick(item.id)}
                    className="cursor-pointer"
                  />
                  
                  {/* Design Mode Controls */}
                  {showDesignToolkit && canAccessDesignToolkit && (
                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                      {isCustom && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          Custom
                        </Badge>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditItem(item.id);
                        }}
                        className="h-6 w-6 p-0 hover:bg-gray-200"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            } catch (error) {
              console.error('Error rendering promotional item:', item.id, error);
              return null; // Skip this item if there's an error
            }
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
