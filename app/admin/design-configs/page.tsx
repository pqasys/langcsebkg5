'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Download, 
  Upload,
  Palette,
  Settings
} from 'lucide-react';
import { DesignToolkit, DesignConfig } from '@/components/design/DesignToolkit';
import { DesignablePromotionalCard } from '@/components/design/DesignablePromotionalCard';
import { TemplateSelector } from '@/components/design/TemplateSelector';
import { getDefaultTemplate } from '@/lib/design-templates';

interface DesignConfigWithMetadata {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  // Design properties
  backgroundType: string;
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  backgroundGradientDirection: string;
  backgroundImage?: string;
  backgroundPattern: string;
  backgroundOpacity: number;
  titleFont: string;
  titleSize: number;
  titleWeight: string;
  titleColor: string;
  titleAlignment: string;
  titleShadow: boolean;
  titleShadowColor: string;
  descriptionFont: string;
  descriptionSize: number;
  descriptionColor: string;
  descriptionAlignment: string;
  padding: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  borderStyle: string;
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffset: number;
  hoverEffect: string;
  animationDuration: number;
  customCSS?: string;
}

const SAMPLE_PROMOTIONAL_ITEM = {
  id: 'sample',
  type: 'third-party' as const,
  title: 'Sample Promotional Item',
  description: 'This is a sample promotional item to preview your design configuration.',
  ctaText: 'Learn More',
  ctaLink: '#',
  badge: 'Featured',
  stats: {
    students: 1250,
    courses: 45,
    rating: 4.8
  },
  priority: 1000,
  isSponsored: false
};

export default function DesignConfigsPage() {
  const [configs, setConfigs] = useState<DesignConfigWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<DesignConfigWithMetadata | null>(null);
  const [editingConfig, setEditingConfig] = useState<DesignConfig | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [previewConfig, setPreviewConfig] = useState<DesignConfig | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/design-configs');
      if (response.ok) {
        const data = await response.json();
        setConfigs(data.configs);
      }
    } catch (error) {
      console.error('Error fetching configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConfig = async (config: DesignConfig) => {
    try {
      const response = await fetch('/api/design-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: config.name || 'New Design Config',
          description: config.description,
          backgroundType: config.backgroundType,
          backgroundColor: config.backgroundColor,
          backgroundGradientFrom: config.backgroundGradient.from,
          backgroundGradientTo: config.backgroundGradient.to,
          backgroundGradientDirection: config.backgroundGradient.direction,
          backgroundImage: config.backgroundImage,
          backgroundPattern: config.backgroundPattern,
          backgroundOpacity: config.backgroundOpacity,
          titleFont: config.titleFont,
          titleSize: config.titleSize,
          titleWeight: config.titleWeight,
          titleColor: config.titleColor,
          titleAlignment: config.titleAlignment,
          titleShadow: config.titleShadow,
          titleShadowColor: config.titleShadowColor,
          descriptionFont: config.descriptionFont,
          descriptionSize: config.descriptionSize,
          descriptionColor: config.descriptionColor,
          descriptionAlignment: config.descriptionAlignment,
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
          isDefault: false
        })
      });

      if (response.ok) {
        await fetchConfigs();
        setShowCreateForm(false);
        setEditingConfig(null);
      }
    } catch (error) {
      console.error('Error creating config:', error);
    }
  };

  const handleUpdateConfig = async (config: DesignConfig) => {
    if (!selectedConfig) return;

    try {
      const response = await fetch(`/api/design-configs/${selectedConfig.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: config.name || selectedConfig.name,
          description: config.description,
          backgroundType: config.backgroundType,
          backgroundColor: config.backgroundColor,
          backgroundGradientFrom: config.backgroundGradient.from,
          backgroundGradientTo: config.backgroundGradient.to,
          backgroundGradientDirection: config.backgroundGradient.direction,
          backgroundImage: config.backgroundImage,
          backgroundPattern: config.backgroundPattern,
          backgroundOpacity: config.backgroundOpacity,
          titleFont: config.titleFont,
          titleSize: config.titleSize,
          titleWeight: config.titleWeight,
          titleColor: config.titleColor,
          titleAlignment: config.titleAlignment,
          titleShadow: config.titleShadow,
          titleShadowColor: config.titleShadowColor,
          descriptionFont: config.descriptionFont,
          descriptionSize: config.descriptionSize,
          descriptionColor: config.descriptionColor,
          descriptionAlignment: config.descriptionAlignment,
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
          customCSS: config.customCSS
        })
      });

      if (response.ok) {
        await fetchConfigs();
        setSelectedConfig(null);
        setEditingConfig(null);
      }
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  const handleDeleteConfig = async (id: string) => {
    if (!confirm('Are you sure you want to delete this design configuration?')) return;

    try {
      const response = await fetch(`/api/design-configs/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchConfigs();
        if (selectedConfig?.id === id) {
          setSelectedConfig(null);
        }
      }
    } catch (error) {
      console.error('Error deleting config:', error);
    }
  };

  const convertToDesignConfig = (config: DesignConfigWithMetadata): DesignConfig => ({
    backgroundType: config.backgroundType as any,
    backgroundColor: config.backgroundColor,
    backgroundGradient: {
      from: config.backgroundGradientFrom,
      to: config.backgroundGradientTo,
      direction: config.backgroundGradientDirection as any
    },
    backgroundImage: config.backgroundImage || '',
    backgroundPattern: config.backgroundPattern,
    backgroundOpacity: config.backgroundOpacity,
    titleFont: config.titleFont,
    titleSize: config.titleSize,
    titleWeight: config.titleWeight as any,
    titleColor: config.titleColor,
    titleAlignment: config.titleAlignment as any,
    titleShadow: config.titleShadow,
    titleShadowColor: config.titleShadowColor,
    descriptionFont: config.descriptionFont,
    descriptionSize: config.descriptionSize,
    descriptionColor: config.descriptionColor,
    descriptionAlignment: config.descriptionAlignment as any,
    padding: config.padding,
    borderRadius: config.borderRadius,
    borderWidth: config.borderWidth,
    borderColor: config.borderColor,
    borderStyle: config.borderStyle as any,
    shadow: config.shadow,
    shadowColor: config.shadowColor,
    shadowBlur: config.shadowBlur,
    shadowOffset: config.shadowOffset,
    hoverEffect: config.hoverEffect as any,
    animationDuration: config.animationDuration,
    customCSS: config.customCSS || ''
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Design Configurations</h1>
          <p className="text-gray-600 mt-2">
            Manage design configurations for promotional and advertising items
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTemplateSelector(true)}>
            <Copy className="w-4 h-4 mr-2" />
            Use Template
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Configurations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {configs.map((config) => (
                  <div
                    key={config.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedConfig?.id === config.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedConfig(config)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{config.name}</h3>
                        <p className="text-sm text-gray-500">
                          {config.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {config.isDefault && (
                          <Badge variant="default" className="text-xs">Default</Badge>
                        )}
                        {config.isActive ? (
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Inactive</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingConfig(convertToDesignConfig(config));
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewConfig(convertToDesignConfig(config));
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConfig(config.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Design Toolkit and Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create/Edit Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DesignToolkit
                  config={editingConfig || {
                    backgroundType: 'solid',
                    backgroundColor: '#ffffff',
                    backgroundGradient: { from: '#667eea', to: '#764ba2', direction: 'to-r' },
                    backgroundImage: '',
                    backgroundPattern: 'none',
                    backgroundOpacity: 100,
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
                    padding: 16,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderStyle: 'solid',
                    shadow: true,
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10,
                    shadowOffset: 4,
                    hoverEffect: 'scale',
                    animationDuration: 300,
                    customCSS: ''
                  }}
                  onConfigChange={setEditingConfig}
                  onSave={() => editingConfig && handleCreateConfig(editingConfig)}
                  onReset={() => {
                    setShowCreateForm(false);
                    setEditingConfig(null);
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Template Selector */}
          {showTemplateSelector && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="w-5 h-5" />
                  Choose a Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TemplateSelector
                  onTemplateSelect={(templateConfig) => {
                    setEditingConfig(templateConfig);
                    setShowTemplateSelector(false);
                    setShowCreateForm(true);
                  }}
                  onClose={() => setShowTemplateSelector(false)}
                />
              </CardContent>
            </Card>
          )}

          {/* Edit Existing Config */}
          {selectedConfig && editingConfig && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit Configuration: {selectedConfig.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DesignToolkit
                  config={editingConfig}
                  onConfigChange={setEditingConfig}
                  onSave={() => handleUpdateConfig(editingConfig)}
                  onReset={() => {
                    setSelectedConfig(null);
                    setEditingConfig(null);
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Preview */}
          {previewConfig && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DesignablePromotionalCard
                  item={SAMPLE_PROMOTIONAL_ITEM}
                  designConfig={previewConfig}
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setPreviewConfig(null)}
                  >
                    Close Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {!showCreateForm && !selectedConfig && !previewConfig && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Design configurations allow you to customize the appearance of promotional and advertising items.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Create New</h4>
                      <p className="text-sm text-gray-500 mb-3">
                        Create a new design configuration from scratch
                      </p>
                      <Button size="sm" onClick={() => setShowCreateForm(true)}>
                        <Plus className="w-4 h-4 mr-1" />
                        New Config
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Edit Existing</h4>
                      <p className="text-sm text-gray-500 mb-3">
                        Select a configuration from the list to edit
                      </p>
                      <p className="text-xs text-gray-400">
                        Click on any configuration in the sidebar
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
