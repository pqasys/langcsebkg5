'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Type, 
  Image, 
  Layout, 
  Sparkles,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Download,
  Upload,
  Copy,
  Paintbrush,
  AlignLeft,
  Zap,
  Code
} from 'lucide-react';
import { TemplateSelector } from './TemplateSelector';
import { Separator } from '@/components/ui/separator';
import { FileUpload } from '@/components/ui/file-upload';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface DesignConfig {
  // Background
  backgroundType: 'solid' | 'gradient' | 'image' | 'pattern';
  backgroundColor: string;
  backgroundGradient: {
    from: string;
    to: string;
    direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  };
  backgroundImage: string;
  backgroundPattern: string;
  backgroundOpacity: number;
  
  // Typography
  titleFont: string;
  titleSize: number;
  titleWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  titleColor: string;
  titleAlignment: {
    horizontal: 'left' | 'center' | 'right' | 'justify';
    vertical: 'top' | 'middle' | 'bottom';
    padding: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  titleShadow: boolean;
  titleShadowColor: string;
  
  descriptionFont: string;
  descriptionSize: number;
  descriptionColor: string;
  descriptionAlignment: {
    horizontal: 'left' | 'center' | 'right' | 'justify';
    vertical: 'top' | 'middle' | 'bottom';
    padding: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  
  // Layout
  padding: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  
  // Effects
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffset: number;
  
  // Animation
  hoverEffect: 'none' | 'scale' | 'glow' | 'slide' | 'bounce';
  animationDuration: number;
  
  // Custom CSS
  customCSS: string;
}

export interface DesignToolkitProps {
  config: DesignConfig;
  onConfigChange: (config: DesignConfig) => void;
  onSave?: () => void;
  onReset?: () => void;
  className?: string;
  showSaveButton?: boolean;
  showResetButton?: boolean;
  showPreview?: boolean;
  institutionId?: string;
}

export const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  backgroundType: 'solid',
  backgroundColor: '#ffffff',
  backgroundGradient: {
    from: '#ffffff',
    to: '#e0e0e0',
    direction: 'to-r',
  },
  backgroundImage: '',
  backgroundPattern: 'none',
  backgroundOpacity: 100,
  
  titleFont: 'inter',
  titleSize: 24,
  titleWeight: 'bold',
  titleColor: '#1f2937',
  titleAlignment: {
    horizontal: 'left',
    vertical: 'top',
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  titleShadow: false,
  titleShadowColor: '#000000',
  
  descriptionFont: 'inter',
  descriptionSize: 16,
  descriptionColor: '#6b7280',
  descriptionAlignment: {
    horizontal: 'left',
    vertical: 'top',
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  
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
};

const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'opensans', label: 'Open Sans' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'merriweather', label: 'Merriweather' },
  { value: 'source-sans', label: 'Source Sans Pro' },
];

const PATTERN_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'dots', label: 'Dots' },
  { value: 'lines', label: 'Lines' },
  { value: 'grid', label: 'Grid' },
  { value: 'hexagons', label: 'Hexagons' },
  { value: 'waves', label: 'Waves' },
  { value: 'stars', label: 'Stars' },
];

const GRADIENT_DIRECTIONS = [
  { value: 'to-r', label: 'Right' },
  { value: 'to-l', label: 'Left' },
  { value: 'to-t', label: 'Top' },
  { value: 'to-b', label: 'Bottom' },
  { value: 'to-tr', label: 'Top Right' },
  { value: 'to-tl', label: 'Top Left' },
  { value: 'to-br', label: 'Bottom Right' },
  { value: 'to-bl', label: 'Bottom Left' },
];

export function DesignToolkit({
  config,
  onConfigChange,
  onSave,
  onReset,
  className = '',
  showSaveButton = false,
  showResetButton = true,
  showPreview = true,
  institutionId = 'default'
}: DesignToolkitProps) {
  // Ensure we always have a valid config
  const safeConfig = config || DEFAULT_DESIGN_CONFIG;
  const isInitialMount = useRef(true);
  const backgroundImageTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [localConfig, setLocalConfig] = useState<DesignConfig>(safeConfig);
  const [activeTab, setActiveTab] = useState<'background' | 'typography' | 'layout' | 'effects' | 'custom'>('background');

  // Update local config when prop changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setLocalConfig(safeConfig);
    }
  }, [safeConfig]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (backgroundImageTimeoutRef.current) {
        clearTimeout(backgroundImageTimeoutRef.current);
      }
    };
  }, []);

  const handleConfigChange = (updates: Partial<DesignConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    
    // Ensure gradient object is properly initialized when switching to gradient type
    if (updates.backgroundType === 'gradient' && !newConfig.backgroundGradient) {
      newConfig.backgroundGradient = {
        from: '#667eea',
        to: '#764ba2',
        direction: 'to-r'
      };
    }
    
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handleReset = () => {
    setLocalConfig(DEFAULT_DESIGN_CONFIG);
    onConfigChange(DEFAULT_DESIGN_CONFIG);
    if (onReset) {
      onReset();
    }
  };

  const tabs = [
    { 
      id: 'background', 
      label: 'Background', 
      icon: Paintbrush,
      tooltip: 'Background settings (color, gradient, image)'
    },
    { 
      id: 'typography', 
      label: 'Typography', 
      icon: Type,
      tooltip: 'Text styling (font, size, color, alignment)'
    },
    { 
      id: 'layout', 
      label: 'Layout', 
      icon: Layout,
      tooltip: 'Layout settings (padding, borders, spacing)'
    },
    { 
      id: 'effects', 
      label: 'Effects', 
      icon: Sparkles,
      tooltip: 'Visual effects (shadows, hover, animations)'
    },
    { 
      id: 'custom', 
      label: 'Custom CSS', 
      icon: Code,
      tooltip: 'Custom CSS rules'
    }
  ] as const;

  const generatePatternStyles = (pattern: string, patternColor: string, backgroundColor: string) => {
    const styles: React.CSSProperties = {};
    
    switch (pattern) {
      case 'dots':
        styles.background = `radial-gradient(circle at 1px 1px, ${patternColor} 1px, transparent 0)`;
        styles.backgroundSize = '20px 20px';
        styles.backgroundColor = backgroundColor;
        break;
      case 'lines':
        styles.background = `repeating-linear-gradient(45deg, transparent, transparent 5px, ${patternColor} 5px, ${patternColor} 10px)`;
        styles.backgroundColor = backgroundColor;
        break;
      case 'grid':
        styles.background = `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`;
        styles.backgroundSize = '20px 20px';
        styles.backgroundColor = backgroundColor;
        break;
      case 'hexagons':
        styles.background = `radial-gradient(circle at 50% 50%, ${patternColor} 2px, transparent 2px)`;
        styles.backgroundSize = '30px 30px';
        styles.backgroundColor = backgroundColor;
        break;
      case 'waves':
        styles.background = `repeating-linear-gradient(45deg, transparent, transparent 10px, ${patternColor} 10px, ${patternColor} 20px)`;
        styles.backgroundColor = backgroundColor;
        break;
      case 'stars':
        styles.background = `radial-gradient(circle at 25% 25%, ${patternColor} 1px, transparent 1px), radial-gradient(circle at 75% 75%, ${patternColor} 1px, transparent 1px)`;
        styles.backgroundSize = '50px 50px';
        styles.backgroundColor = backgroundColor;
        break;
      default:
        styles.backgroundColor = backgroundColor;
        break;
    }
    
    return styles;
  };

  return (
    <TooltipProvider>
      <div className={`space-y-4 ${className}`}>
        {/* Action Buttons */}
        {(showSaveButton || showResetButton) && (
          <div className="flex gap-2">
            {showSaveButton && (
              <Button
                onClick={handleSave}
                className="flex-1"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Design
              </Button>
            )}
            {showResetButton && (
              <Button
                variant="outline"
                onClick={handleReset}
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        )}

        {/* Tab Navigation - Icons Only with Tooltips */}
        <div className="flex space-x-1 border-b">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-3 text-sm font-medium rounded-t-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tab.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'background' && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Background Type</Label>
                <Select
                  value={localConfig?.backgroundType || 'solid'}
                  onValueChange={(value: 'solid' | 'gradient' | 'image' | 'pattern') =>
                    handleConfigChange({ backgroundType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="pattern">Pattern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localConfig?.backgroundType === 'solid' && (
                <div>
                  <Label className="text-sm font-medium">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localConfig?.backgroundColor || '#ffffff'}
                      onChange={(e) => handleConfigChange({ backgroundColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={localConfig?.backgroundColor || '#ffffff'}
                      onChange={(e) => handleConfigChange({ backgroundColor: e.target.value })}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              )}

              {localConfig?.backgroundType === 'gradient' && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Gradient Direction</Label>
                    <Select
                      value={localConfig?.backgroundGradient?.direction || 'to-r'}
                      onValueChange={(value: any) => {
                        const currentGradient = localConfig?.backgroundGradient || {
                          from: '#667eea',
                          to: '#764ba2',
                          direction: 'to-r'
                        };
                        const updatedGradient = {
                          ...currentGradient,
                          direction: value
                        };
                        handleConfigChange({
                          backgroundGradient: updatedGradient
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADIENT_DIRECTIONS.map((direction) => (
                          <SelectItem key={direction.value} value={direction.value}>
                            {direction.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm font-medium">From Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={localConfig?.backgroundGradient?.from || '#667eea'}
                          onChange={(e) => {
                            const currentGradient = localConfig?.backgroundGradient || {
                              from: '#667eea',
                              to: '#764ba2',
                              direction: 'to-r'
                            };
                            const updatedGradient = {
                              ...currentGradient,
                              from: e.target.value
                            };
                            handleConfigChange({
                              backgroundGradient: updatedGradient
                            });
                          }}
                          className="w-12 h-8"
                        />
                        <Input
                          value={localConfig?.backgroundGradient?.from || '#667eea'}
                          onChange={(e) => {
                            const currentGradient = localConfig?.backgroundGradient || {
                              from: '#667eea',
                              to: '#764ba2',
                              direction: 'to-r'
                            };
                            const updatedGradient = {
                              ...currentGradient,
                              from: e.target.value
                            };
                            handleConfigChange({
                              backgroundGradient: updatedGradient
                            });
                          }}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">To Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={localConfig?.backgroundGradient?.to || '#764ba2'}
                          onChange={(e) => {
                            const currentGradient = localConfig?.backgroundGradient || {
                              from: '#667eea',
                              to: '#764ba2',
                              direction: 'to-r'
                            };
                            const updatedGradient = {
                              ...currentGradient,
                              to: e.target.value
                            };
                            handleConfigChange({
                              backgroundGradient: updatedGradient
                            });
                          }}
                          className="w-12 h-8"
                        />
                        <Input
                          value={localConfig?.backgroundGradient?.to || '#764ba2'}
                          onChange={(e) => {
                            const currentGradient = localConfig?.backgroundGradient || {
                              from: '#667eea',
                              to: '#764ba2',
                              direction: 'to-r'
                            };
                            const updatedGradient = {
                              ...currentGradient,
                              to: e.target.value
                            };
                            handleConfigChange({
                              backgroundGradient: updatedGradient
                            });
                          }}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {localConfig?.backgroundType === 'image' && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Background Image</Label>
                    
                    {/* File Upload Component */}
                    <FileUpload
                      onUploadSuccess={(url) => {
                        console.log('✅ Image uploaded successfully:', url);
                        setLocalConfig(prev => ({ ...prev, backgroundImage: url }));
                        handleConfigChange({ backgroundImage: url });
                      }}
                      onUploadError={(error) => {
                        console.error('❌ Image upload failed:', error);
                      }}
                      institutionId={institutionId}
                      label="Upload Background Image"
                      className="mb-3"
                    />
                    
                    <Separator className="my-3" />
                    
                    {/* URL Input (for external images) */}
                    <div>
                      <Label className="text-sm font-medium">Or Enter Image URL</Label>
                      <Input
                        value={localConfig?.backgroundImage || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Update local state immediately for responsive UI
                          setLocalConfig(prev => ({ ...prev, backgroundImage: value }));
                          
                          // Clear existing timeout
                          if (backgroundImageTimeoutRef.current) {
                            clearTimeout(backgroundImageTimeoutRef.current);
                          }
                          
                          // Debounce the parent callback to prevent excessive re-renders
                          backgroundImageTimeoutRef.current = setTimeout(() => {
                            handleConfigChange({ backgroundImage: value });
                          }, 300);
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500">
                        Enter a valid URL starting with http://, https://, or / for local paths
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Opacity: {localConfig?.backgroundOpacity || 100}%</Label>
                    <Slider
                      value={[localConfig?.backgroundOpacity || 100]}
                      onValueChange={([value]) => {
                        console.log('🎨 Opacity slider changed to:', value);
                        handleConfigChange({ backgroundOpacity: value });
                      }}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Current opacity value: {localConfig?.backgroundOpacity || 100}%
                    </p>
                  </div>
                </div>
              )}

              {localConfig?.backgroundType === 'pattern' && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Pattern Type</Label>
                    <Select
                      value={localConfig?.backgroundPattern || 'none'}
                      onValueChange={(value) => {
                        handleConfigChange({ backgroundPattern: value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PATTERN_OPTIONS.map((pattern) => (
                          <SelectItem key={pattern.value} value={pattern.value}>
                            {pattern.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Pattern Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={localConfig?.backgroundColor || '#e0e0e0'}
                        onChange={(e) => {
                          handleConfigChange({ backgroundColor: e.target.value });
                        }}
                        className="w-16 h-10"
                      />
                      <Input
                        value={localConfig?.backgroundColor || '#e0e0e0'}
                        onChange={(e) => {
                          handleConfigChange({ backgroundColor: e.target.value });
                        }}
                        placeholder="#e0e0e0"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Title Font</Label>
                <Select
                  value={localConfig?.titleFont || 'inter'}
                  onValueChange={(value) => handleConfigChange({ titleFont: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Title Size: {localConfig?.titleSize || 16}px</Label>
                  <Slider
                    value={[localConfig?.titleSize || 16]}
                    onValueChange={([value]) => handleConfigChange({ titleSize: value })}
                    max={32}
                    min={12}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Title Weight</Label>
                  <Select
                    value={localConfig?.titleWeight || 'semibold'}
                    onValueChange={(value: any) => handleConfigChange({ titleWeight: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="semibold">Semibold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="extrabold">Extra Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Title Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={localConfig?.titleColor || '#1f2937'}
                    onChange={(e) => handleConfigChange({ titleColor: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={localConfig?.titleColor || '#1f2937'}
                    onChange={(e) => handleConfigChange({ titleColor: e.target.value })}
                    placeholder="#1f2937"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Title Alignment</Label>
                  <Select
                    value={localConfig?.titleAlignment?.horizontal || 'left'}
                    onValueChange={(value: any) =>
                      handleConfigChange({
                        titleAlignment: { 
                          ...localConfig?.titleAlignment, 
                          horizontal: value 
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vertical Alignment</Label>
                  <Select
                    value={localConfig?.titleAlignment?.vertical || 'top'}
                    onValueChange={(value: any) =>
                      handleConfigChange({
                        titleAlignment: { 
                          ...localConfig?.titleAlignment, 
                          vertical: value 
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="title-shadow"
                  checked={localConfig?.titleShadow || false}
                  onCheckedChange={(checked) => handleConfigChange({ titleShadow: checked })}
                />
                <Label htmlFor="title-shadow" className="text-sm font-medium">
                  Title Shadow
                </Label>
              </div>

              {localConfig?.titleShadow && (
                <div>
                  <Label className="text-sm font-medium">Shadow Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localConfig?.titleShadowColor || '#000000'}
                      onChange={(e) => handleConfigChange({ titleShadowColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={localConfig?.titleShadowColor || '#000000'}
                      onChange={(e) => handleConfigChange({ titleShadowColor: e.target.value })}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <Label className="text-sm font-medium">Description Font</Label>
                <Select
                  value={localConfig?.descriptionFont || 'inter'}
                  onValueChange={(value) => handleConfigChange({ descriptionFont: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Description Size: {localConfig?.descriptionSize || 14}px</Label>
                  <Slider
                    value={[localConfig?.descriptionSize || 14]}
                    onValueChange={([value]) => handleConfigChange({ descriptionSize: value })}
                    max={24}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Description Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={localConfig?.descriptionColor || '#6b7280'}
                      onChange={(e) => handleConfigChange({ descriptionColor: e.target.value })}
                      className="w-12 h-8"
                    />
                    <Input
                      value={localConfig?.descriptionColor || '#6b7280'}
                      onChange={(e) => handleConfigChange({ descriptionColor: e.target.value })}
                      placeholder="#6b7280"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Description Alignment</Label>
                  <Select
                    value={localConfig?.descriptionAlignment?.horizontal || 'left'}
                    onValueChange={(value: any) =>
                      handleConfigChange({
                        descriptionAlignment: { 
                          ...localConfig?.descriptionAlignment, 
                          horizontal: value 
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vertical Alignment</Label>
                  <Select
                    value={localConfig?.descriptionAlignment?.vertical || 'top'}
                    onValueChange={(value: any) =>
                      handleConfigChange({
                        descriptionAlignment: { 
                          ...localConfig?.descriptionAlignment, 
                          vertical: value 
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Padding: {localConfig?.padding || 16}px</Label>
                <Slider
                  value={[localConfig?.padding || 16]}
                  onValueChange={([value]) => handleConfigChange({ padding: value })}
                  max={32}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Border Radius: {localConfig?.borderRadius || 8}px</Label>
                <Slider
                  value={[localConfig?.borderRadius || 8]}
                  onValueChange={([value]) => handleConfigChange({ borderRadius: value })}
                  max={24}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Border Width: {localConfig?.borderWidth || 1}px</Label>
                  <Slider
                    value={[localConfig?.borderWidth || 1]}
                    onValueChange={([value]) => handleConfigChange({ borderWidth: value })}
                    max={8}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Border Style</Label>
                  <Select
                    value={localConfig?.borderStyle || 'solid'}
                    onValueChange={(value: any) => handleConfigChange({ borderStyle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={localConfig?.borderColor || '#e5e7eb'}
                    onChange={(e) => handleConfigChange({ borderColor: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={localConfig?.borderColor || '#e5e7eb'}
                    onChange={(e) => handleConfigChange({ borderColor: e.target.value })}
                    placeholder="#e5e7eb"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="shadow"
                  checked={localConfig?.shadow || false}
                  onCheckedChange={(checked) => handleConfigChange({ shadow: checked })}
                />
                <Label htmlFor="shadow" className="text-sm font-medium">
                  Enable Shadow
                </Label>
              </div>

              {localConfig?.shadow && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Shadow Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={localConfig?.shadowColor || 'rgba(0, 0, 0, 0.1)'}
                        onChange={(e) => handleConfigChange({ shadowColor: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={localConfig?.shadowColor || 'rgba(0, 0, 0, 0.1)'}
                        onChange={(e) => handleConfigChange({ shadowColor: e.target.value })}
                        placeholder="rgba(0, 0, 0, 0.1)"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Shadow Blur: {localConfig?.shadowBlur || 10}px</Label>
                    <Slider
                      value={[localConfig?.shadowBlur || 10]}
                      onValueChange={([value]) => handleConfigChange({ shadowBlur: value })}
                      max={50}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Shadow Offset: {localConfig?.shadowOffset || 4}px</Label>
                    <Slider
                      value={[localConfig?.shadowOffset || 4]}
                      onValueChange={([value]) => handleConfigChange({ shadowOffset: value })}
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Hover Effect</Label>
                <Select
                  value={localConfig?.hoverEffect || 'none'}
                  onValueChange={(value: any) => handleConfigChange({ hoverEffect: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                    <SelectItem value="glow">Glow</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="bounce">Bounce</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Animation Duration: {localConfig?.animationDuration || 300}ms</Label>
                <Slider
                  value={[localConfig?.animationDuration || 300]}
                  onValueChange={([value]) => handleConfigChange({ animationDuration: value })}
                  max={1000}
                  min={100}
                  step={50}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Custom CSS</Label>
                <Textarea
                  value={localConfig?.customCSS || ''}
                  onChange={(e) => handleConfigChange({ customCSS: e.target.value })}
                  placeholder="Enter custom CSS rules..."
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
              <div className="text-xs text-gray-500">
                <p>Enter CSS rules like: <code>transform: rotate(5deg);</code></p>
                <p>Each rule should end with a semicolon.</p>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="mt-6">
            <Label className="text-sm font-medium mb-2 block">Live Preview</Label>
            
                          <div className="border rounded-lg p-4">
                <div
                  className="p-4 rounded-lg transition-all duration-300"
                  style={{
                    minHeight: '120px',
                    padding: `${localConfig?.padding || 16}px`,
                    borderRadius: `${localConfig?.borderRadius || 8}px`,
                    border: `${localConfig?.borderWidth || 1}px ${localConfig?.borderStyle || 'solid'} ${localConfig?.borderColor || '#e5e7eb'}`,
                    boxShadow: localConfig?.shadow 
                      ? `0 ${localConfig?.shadowOffset || 4}px ${localConfig?.shadowBlur || 10}px ${localConfig?.shadowColor || 'rgba(0, 0, 0, 0.1)'}`
                      : 'none',
                    ...(() => {
                      const bgType = localConfig?.backgroundType || 'solid';
                      const styleObj: React.CSSProperties = {};
                      
                      if (bgType === 'gradient') {
                        const gradientDirection = localConfig?.backgroundGradient?.direction || 'to-r';
                        const gradientFrom = localConfig?.backgroundGradient?.from || '#667eea';
                        const gradientTo = localConfig?.backgroundGradient?.to || '#764ba2';
                        
                        // Convert direction to proper CSS syntax
                        let cssDirection = 'to right';
                        switch (gradientDirection) {
                          case 'to-r': cssDirection = 'to right'; break;
                          case 'to-l': cssDirection = 'to left'; break;
                          case 'to-t': cssDirection = 'to top'; break;
                          case 'to-b': cssDirection = 'to bottom'; break;
                          case 'to-tr': cssDirection = 'to top right'; break;
                          case 'to-tl': cssDirection = 'to top left'; break;
                          case 'to-br': cssDirection = 'to bottom right'; break;
                          case 'to-bl': cssDirection = 'to bottom left'; break;
                        }
                        
                        styleObj.background = `linear-gradient(${cssDirection}, ${gradientFrom}, ${gradientTo})`;
                        styleObj.backgroundColor = gradientFrom; // Fallback
                        
                      } else if (bgType === 'solid') {
                        styleObj.backgroundColor = localConfig?.backgroundColor || '#ffffff';
                        
                      } else if (bgType === 'image') {
                        if (localConfig?.backgroundImage) {
                          const opacity = (localConfig?.backgroundOpacity || 100) / 100;
                          const backgroundColor = localConfig?.backgroundColor || '#ffffff';
                          
                          console.log('🎨 Preview opacity debug:', {
                            opacity,
                            backgroundOpacity: localConfig?.backgroundOpacity,
                            backgroundImage: localConfig?.backgroundImage
                          });
                          
                          // Apply opacity to the background image using linear-gradient overlay
                          if (opacity < 1) {
                            styleObj.background = `linear-gradient(rgba(255, 255, 255, ${1 - opacity}), rgba(255, 255, 255, ${1 - opacity})), url('${localConfig.backgroundImage}') center / cover no-repeat, ${backgroundColor}`;
                            console.log('🎨 Applied opacity overlay:', styleObj.background);
                          } else {
                            styleObj.background = `url('${localConfig.backgroundImage}') center / cover no-repeat, ${backgroundColor}`;
                            console.log('🎨 Applied full opacity:', styleObj.background);
                          }
                        } else {
                          styleObj.backgroundColor = localConfig?.backgroundColor || '#ffffff';
                        }
                        
                      } else if (bgType === 'pattern') {
                        const pattern = localConfig?.backgroundPattern || 'none';
                        const patternColor = localConfig?.backgroundColor || '#e0e0e0';
                        const backgroundColor = localConfig?.backgroundColor || '#ffffff';
                        
                        const patternStyles = generatePatternStyles(pattern, patternColor, backgroundColor);
                        Object.assign(styleObj, patternStyles);
                      }
                      
                      return styleObj;
                    })(),
                  }}
              >
                <h4
                  style={{
                    fontFamily: localConfig?.titleFont || 'inter',
                    fontSize: `${localConfig?.titleSize || 16}px`,
                    fontWeight: localConfig?.titleWeight || 'semibold',
                    color: localConfig?.titleColor || '#1f2937',
                    textAlign: localConfig?.titleAlignment?.horizontal || 'left',
                    textShadow: localConfig?.titleShadow ? `2px 2px 4px ${localConfig?.titleShadowColor || '#000000'}` : 'none',
                  }}
                  className="mb-2"
                >
                  Sample Title
                </h4>
                <p
                  style={{
                    fontFamily: localConfig?.descriptionFont || 'inter',
                    fontSize: `${localConfig?.descriptionSize || 14}px`,
                    color: localConfig?.descriptionColor || '#6b7280',
                    textAlign: localConfig?.descriptionAlignment?.horizontal || 'left',
                  }}
                >
                  This is a sample description that shows how your text will look with the current settings.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
