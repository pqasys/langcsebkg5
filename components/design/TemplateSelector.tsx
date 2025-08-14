'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Copy, 
  Star,
  Palette,
  Sparkles
} from 'lucide-react';
import { DesignConfig } from './DesignToolkit';
import { DesignablePromotionalCard } from './DesignablePromotionalCard';
import { DESIGN_TEMPLATES, DesignTemplate, getTemplatesByCategory, getTemplatesByTag } from '@/lib/design-templates';

export interface TemplateSelectorProps {
  onTemplateSelect: (config: DesignConfig) => void;
  onClose?: () => void;
  className?: string;
}

const SAMPLE_PROMOTIONAL_ITEM = {
  id: 'template-preview',
  type: 'third-party' as const,
  title: 'Template Preview',
  description: 'This is how your promotional content will look with this template.',
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

const CATEGORIES = [
  { value: 'all', label: 'All Templates' },
  { value: 'modern', label: 'Modern' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'playful', label: 'Playful' },
  { value: 'professional', label: 'Professional' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' }
];

export function TemplateSelector({ onTemplateSelect, onClose, className = '' }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewTemplate, setPreviewTemplate] = useState<DesignTemplate | null>(null);

  const filteredTemplates = React.useMemo(() => {
    let templates = DESIGN_TEMPLATES;

    // Filter by category
    if (selectedCategory !== 'all') {
      templates = getTemplatesByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(template => 
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return templates;
  }, [searchQuery, selectedCategory]);

  const handleTemplateSelect = (template: DesignTemplate) => {
    onTemplateSelect(template.config);
    if (onClose) onClose();
  };

  const handlePreview = (template: DesignTemplate) => {
    setPreviewTemplate(template);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'modern': return <Sparkles className="w-4 h-4" />;
      case 'elegant': return <Star className="w-4 h-4" />;
      case 'playful': return <Palette className="w-4 h-4" />;
      case 'professional': return <Star className="w-4 h-4" />;
      case 'minimal': return <Grid className="w-4 h-4" />;
      case 'bold': return <Sparkles className="w-4 h-4" />;
      default: return <Palette className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'modern': return 'bg-blue-100 text-blue-800';
      case 'elegant': return 'bg-purple-100 text-purple-800';
      case 'playful': return 'bg-yellow-100 text-yellow-800';
      case 'professional': return 'bg-gray-100 text-gray-800';
      case 'minimal': return 'bg-green-100 text-green-800';
      case 'bold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Design Templates</h3>
          <Badge variant="secondary" className="ml-2">
            {filteredTemplates.length} templates
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            {viewMode === 'grid' ? 'List' : 'Grid'}
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">Search templates</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="search"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Template Preview: {previewTemplate.name}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewTemplate(null)}
                >
                  Close
                </Button>
              </div>
              <div className="mb-4">
                <DesignablePromotionalCard
                  item={SAMPLE_PROMOTIONAL_ITEM}
                  designConfig={previewTemplate.config}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleTemplateSelect(previewTemplate)}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Use This Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreviewTemplate(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid/List */}
      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                viewMode === 'list' ? 'flex' : ''
              }`}
              onClick={() => handlePreview(template)}
            >
              <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className={`${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}>
                  {/* Preview */}
                  <div className={`${viewMode === 'list' ? 'w-32 flex-shrink-0' : 'mb-3'}`}>
                    <DesignablePromotionalCard
                      item={SAMPLE_PROMOTIONAL_ITEM}
                      designConfig={template.config}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{template.name}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getCategoryColor(template.category)}`}
                      >
                        {template.category}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(template);
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template);
                        }}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Use
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
