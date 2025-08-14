'use client';

import React, { useState } from 'react';
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
  Copy
} from 'lucide-react';
import { TemplateSelector } from './TemplateSelector';

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
  titleAlignment: 'left' | 'center' | 'right';
  titleShadow: boolean;
  titleShadowColor: string;
  
  descriptionFont: string;
  descriptionSize: number;
  descriptionColor: string;
  descriptionAlignment: 'left' | 'center' | 'right';
  
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
  onPreview?: () => void;
  className?: string;
}

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
  onPreview,
  className = ''
}: DesignToolkitProps) {
  const [activeTab, setActiveTab] = useState<'background' | 'typography' | 'layout' | 'effects'>('background');
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const updateConfig = (updates: Partial<DesignConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const generateCSS = (): string => {
    const styles: string[] = [];
    
    // Background
    if (config.backgroundType === 'solid') {
      styles.push(`background-color: ${config.backgroundColor};`);
    } else if (config.backgroundType === 'gradient') {
      styles.push(`background: linear-gradient(${config.backgroundGradient.direction}, ${config.backgroundGradient.from}, ${config.backgroundGradient.to});`);
    } else if (config.backgroundType === 'image' && config.backgroundImage) {
      styles.push(`background-image: url('${config.backgroundImage}');`);
      styles.push('background-size: cover;');
      styles.push('background-position: center;');
    }
    
    // Typography
    styles.push(`font-family: ${config.titleFont}, sans-serif;`);
    styles.push(`font-size: ${config.titleSize}px;`);
    styles.push(`font-weight: ${config.titleWeight};`);
    styles.push(`color: ${config.titleColor};`);
    styles.push(`text-align: ${config.titleAlignment};`);
    
    if (config.titleShadow) {
      styles.push(`text-shadow: 2px 2px 4px ${config.titleShadowColor};`);
    }
    
    // Layout
    styles.push(`padding: ${config.padding}px;`);
    styles.push(`border-radius: ${config.borderRadius}px;`);
    styles.push(`border: ${config.borderWidth}px ${config.borderStyle} ${config.borderColor};`);
    
    // Effects
    if (config.shadow) {
      styles.push(`box-shadow: 0 ${config.shadowOffset}px ${config.shadowBlur}px ${config.shadowColor};`);
    }
    
    // Animation
    if (config.hoverEffect !== 'none') {
      styles.push(`transition: all ${config.animationDuration}ms ease;`);
    }
    
    return styles.join('\n');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Design Toolkit</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <Copy className="w-4 h-4 mr-1" />
            Templates
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Preview
          </Button>
          {onSave && (
            <Button size="sm" onClick={onSave}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <Card className="border-2 border-dashed border-blue-200">
          <CardContent className="p-4">
            <div
              className="p-4 rounded-lg"
              style={{
                background: config.backgroundType === 'gradient' 
                  ? `linear-gradient(${config.backgroundGradient.direction}, ${config.backgroundGradient.from}, ${config.backgroundGradient.to})`
                  : config.backgroundType === 'solid'
                  ? config.backgroundColor
                  : 'transparent',
                fontFamily: config.titleFont,
                fontSize: `${config.titleSize}px`,
                fontWeight: config.titleWeight,
                color: config.titleColor,
                textAlign: config.titleAlignment,
                padding: `${config.padding}px`,
                borderRadius: `${config.borderRadius}px`,
                border: `${config.borderWidth}px ${config.borderStyle} ${config.borderColor}`,
                boxShadow: config.shadow ? `0 ${config.shadowOffset}px ${config.shadowBlur}px ${config.shadowColor}` : 'none',
                textShadow: config.titleShadow ? `2px 2px 4px ${config.titleShadowColor}` : 'none',
              }}
            >
              <h4 className="mb-2">Sample Title</h4>
              <p 
                className="text-sm"
                style={{
                  fontFamily: config.descriptionFont,
                  fontSize: `${config.descriptionSize}px`,
                  color: config.descriptionColor,
                  textAlign: config.descriptionAlignment,
                }}
              >
                This is a sample description to preview your design settings.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates */}
      {showTemplates && (
        <Card className="border-2 border-dashed border-green-200">
          <CardContent className="p-4">
            <TemplateSelector
              onTemplateSelect={(templateConfig) => {
                onConfigChange(templateConfig);
                setShowTemplates(false);
              }}
              onClose={() => setShowTemplates(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'background', label: 'Background', icon: Image },
          { id: 'typography', label: 'Typography', icon: Type },
          { id: 'layout', label: 'Layout', icon: Layout },
          { id: 'effects', label: 'Effects', icon: Sparkles },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="flex-1"
          >
            <tab.icon className="w-4 h-4 mr-1" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Background Tab */}
      {activeTab === 'background' && (
        <div className="space-y-4">
          <div>
            <Label>Background Type</Label>
            <Select
              value={config.backgroundType}
              onValueChange={(value) => updateConfig({ backgroundType: value as any })}
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

          {config.backgroundType === 'solid' && (
            <div>
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.backgroundColor}
                  onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                  className="w-16"
                />
                <Input
                  value={config.backgroundColor}
                  onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>
          )}

          {config.backgroundType === 'gradient' && (
            <div className="space-y-3">
              <div>
                <Label>Gradient Direction</Label>
                <Select
                  value={config.backgroundGradient.direction}
                  onValueChange={(value) => updateConfig({ 
                    backgroundGradient: { ...config.backgroundGradient, direction: value as any }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADIENT_DIRECTIONS.map((dir) => (
                      <SelectItem key={dir.value} value={dir.value}>
                        {dir.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>From Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.backgroundGradient.from}
                      onChange={(e) => updateConfig({ 
                        backgroundGradient: { ...config.backgroundGradient, from: e.target.value }
                      })}
                      className="w-12"
                    />
                    <Input
                      value={config.backgroundGradient.from}
                      onChange={(e) => updateConfig({ 
                        backgroundGradient: { ...config.backgroundGradient, from: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div>
                  <Label>To Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.backgroundGradient.to}
                      onChange={(e) => updateConfig({ 
                        backgroundGradient: { ...config.backgroundGradient, to: e.target.value }
                      })}
                      className="w-12"
                    />
                    <Input
                      value={config.backgroundGradient.to}
                      onChange={(e) => updateConfig({ 
                        backgroundGradient: { ...config.backgroundGradient, to: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {config.backgroundType === 'image' && (
            <div>
              <Label>Background Image URL</Label>
              <Input
                value={config.backgroundImage}
                onChange={(e) => updateConfig({ backgroundImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

          {config.backgroundType === 'pattern' && (
            <div>
              <Label>Pattern</Label>
              <Select
                value={config.backgroundPattern}
                onValueChange={(value) => updateConfig({ backgroundPattern: value })}
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
          )}

          <div>
            <Label>Background Opacity: {config.backgroundOpacity}%</Label>
            <Slider
              value={[config.backgroundOpacity]}
              onValueChange={([value]) => updateConfig({ backgroundOpacity: value })}
              max={100}
              min={0}
              step={1}
            />
          </div>
        </div>
      )}

      {/* Typography Tab */}
      {activeTab === 'typography' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title Font</Label>
              <Select
                value={config.titleFont}
                onValueChange={(value) => updateConfig({ titleFont: value })}
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
            <div>
              <Label>Title Size: {config.titleSize}px</Label>
              <Slider
                value={[config.titleSize]}
                onValueChange={([value]) => updateConfig({ titleSize: value })}
                max={48}
                min={12}
                step={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title Weight</Label>
              <Select
                value={config.titleWeight}
                onValueChange={(value) => updateConfig({ titleWeight: value as any })}
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
            <div>
              <Label>Title Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.titleColor}
                  onChange={(e) => updateConfig({ titleColor: e.target.value })}
                  className="w-16"
                />
                <Input
                  value={config.titleColor}
                  onChange={(e) => updateConfig({ titleColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Title Alignment</Label>
            <Select
              value={config.titleAlignment}
              onValueChange={(value) => updateConfig({ titleAlignment: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={config.titleShadow}
              onCheckedChange={(checked) => updateConfig({ titleShadow: checked })}
            />
            <Label>Title Shadow</Label>
          </div>

          {config.titleShadow && (
            <div>
              <Label>Shadow Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.titleShadowColor}
                  onChange={(e) => updateConfig({ titleShadowColor: e.target.value })}
                  className="w-16"
                />
                <Input
                  value={config.titleShadowColor}
                  onChange={(e) => updateConfig({ titleShadowColor: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Description Font</Label>
              <Select
                value={config.descriptionFont}
                onValueChange={(value) => updateConfig({ descriptionFont: value })}
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
            <div>
              <Label>Description Size: {config.descriptionSize}px</Label>
              <Slider
                value={[config.descriptionSize]}
                onValueChange={([value]) => updateConfig({ descriptionSize: value })}
                max={24}
                min={10}
                step={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Description Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.descriptionColor}
                  onChange={(e) => updateConfig({ descriptionColor: e.target.value })}
                  className="w-16"
                />
                <Input
                  value={config.descriptionColor}
                  onChange={(e) => updateConfig({ descriptionColor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Description Alignment</Label>
              <Select
                value={config.descriptionAlignment}
                onValueChange={(value) => updateConfig({ descriptionAlignment: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <div className="space-y-4">
          <div>
            <Label>Padding: {config.padding}px</Label>
            <Slider
              value={[config.padding]}
              onValueChange={([value]) => updateConfig({ padding: value })}
              max={48}
              min={0}
              step={2}
            />
          </div>

          <div>
            <Label>Border Radius: {config.borderRadius}px</Label>
            <Slider
              value={[config.borderRadius]}
              onValueChange={([value]) => updateConfig({ borderRadius: value })}
              max={24}
              min={0}
              step={1}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Border Width: {config.borderWidth}px</Label>
              <Slider
                value={[config.borderWidth]}
                onValueChange={([value]) => updateConfig({ borderWidth: value })}
                max={8}
                min={0}
                step={1}
              />
            </div>
            <div>
              <Label>Border Style</Label>
              <Select
                value={config.borderStyle}
                onValueChange={(value) => updateConfig({ borderStyle: value as any })}
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
            <div>
              <Label>Border Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.borderColor}
                  onChange={(e) => updateConfig({ borderColor: e.target.value })}
                  className="w-12"
                />
                <Input
                  value={config.borderColor}
                  onChange={(e) => updateConfig({ borderColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Effects Tab */}
      {activeTab === 'effects' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.shadow}
              onCheckedChange={(checked) => updateConfig({ shadow: checked })}
            />
            <Label>Box Shadow</Label>
          </div>

          {config.shadow && (
            <div className="space-y-3">
              <div>
                <Label>Shadow Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={config.shadowColor}
                    onChange={(e) => updateConfig({ shadowColor: e.target.value })}
                    className="w-16"
                  />
                  <Input
                    value={config.shadowColor}
                    onChange={(e) => updateConfig({ shadowColor: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Shadow Blur: {config.shadowBlur}px</Label>
                <Slider
                  value={[config.shadowBlur]}
                  onValueChange={([value]) => updateConfig({ shadowBlur: value })}
                  max={50}
                  min={0}
                  step={1}
                />
              </div>
              <div>
                <Label>Shadow Offset: {config.shadowOffset}px</Label>
                <Slider
                  value={[config.shadowOffset]}
                  onValueChange={([value]) => updateConfig({ shadowOffset: value })}
                  max={20}
                  min={0}
                  step={1}
                />
              </div>
            </div>
          )}

          <div>
            <Label>Hover Effect</Label>
            <Select
              value={config.hoverEffect}
              onValueChange={(value) => updateConfig({ hoverEffect: value as any })}
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
            <Label>Animation Duration: {config.animationDuration}ms</Label>
            <Slider
              value={[config.animationDuration]}
              onValueChange={([value]) => updateConfig({ animationDuration: value })}
              max={1000}
              min={100}
              step={50}
            />
          </div>

          <div>
            <Label>Custom CSS</Label>
            <Textarea
              value={config.customCSS}
              onChange={(e) => updateConfig({ customCSS: e.target.value })}
              placeholder="Enter custom CSS rules..."
              rows={4}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            CSS Generated
          </Badge>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {generateCSS().split('\n').length} rules
          </code>
        </div>
        <div className="flex items-center gap-2">
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
        </div>
      </div>
    </div>
  );
}
