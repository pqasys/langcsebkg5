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

export function EnhancedPromotionalSidebar() {
  const [showAds, setShowAds] = useState(true);
  const [showDesignToolkit, setShowDesignToolkit] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [individualDesignConfigs, setIndividualDesignConfigs] = useState<IndividualDesignConfig>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

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

  // Load individual design configurations from localStorage
  useEffect(() => {
    try {
      const savedConfigs = localStorage.getItem('individualDesignConfigs');
      if (savedConfigs) {
        const parsed = JSON.parse(savedConfigs);
        // Don't sanitize when loading - just load the configs as-is
        setIndividualDesignConfigs(parsed);
      }
    } catch (error) {
      console.error('Error loading individual design configs:', error);
    }
  }, []);

  // Save individual design configurations to localStorage
  const saveIndividualConfig = (itemId: string, config: DesignConfig) => {
    const sanitized = sanitizeDesignConfig(config);
    const updated = { ...individualDesignConfigs, [itemId]: sanitized };
    setIndividualDesignConfigs(updated);
    
    try {
      localStorage.setItem('individualDesignConfigs', JSON.stringify(updated));
      console.log(`✅ Saved individual design config for item: ${itemId}`);
    } catch (error) {
      console.error('Error saving individual design config:', error);
    }
  };

  // Get design config for a specific item
  const getItemDesignConfig = (itemId: string): DesignConfig => {
    return individualDesignConfigs[itemId] || DEFAULT_DESIGN_CONFIG;
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
  const resetItemDesign = (itemId: string) => {
    const updated = { ...individualDesignConfigs };
    delete updated[itemId];
    setIndividualDesignConfigs(updated);
    
    try {
      localStorage.setItem('individualDesignConfigs', JSON.stringify(updated));
      console.log(`🔄 Reset design config for item: ${itemId}`);
    } catch (error) {
      console.error('Error resetting design config:', error);
    }
  };

  // Clear all individual design configurations
  const clearAllDesignConfigs = () => {
    setIndividualDesignConfigs({});
    setSelectedItemId(null);
    setEditingItemId(null);
    
    try {
      localStorage.removeItem('individualDesignConfigs');
      console.log('🗑️ Cleared all individual design configs');
    } catch (error) {
      console.error('Error clearing design configs:', error);
    }
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
    setShowDesignToolkit(true);
  };

  const handleEditItem = (itemId: string) => {
    console.log('🎨 Edit item clicked:', itemId);
    setEditingItemId(itemId);
    setSelectedItemId(itemId);
    setShowDesignToolkit(true); // Ensure design toolkit is shown
  };

  const handleSaveItemDesign = (config: DesignConfig) => {
    if (editingItemId) {
      console.log('🎨 Saving design config for item:', editingItemId, config);
      saveIndividualConfig(editingItemId, config);
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
        {showDesignToolkit && (
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
                    key={`${editingItemId}-${JSON.stringify(getItemDesignConfig(editingItemId))}`} // Force re-render when config changes
                    config={getItemDesignConfig(editingItemId)}
                    onConfigChange={handleSaveItemDesign}
                    showSaveButton={true}
                    onSave={() => handleSaveItemDesign(getItemDesignConfig(editingItemId))}
                  />
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
                  {showDesignToolkit && (
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
