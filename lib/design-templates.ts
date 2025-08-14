import { DesignConfig } from '@/components/design/DesignToolkit';

export interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'elegant' | 'playful' | 'professional' | 'minimal' | 'bold';
  tags: string[];
  previewImage?: string;
  config: DesignConfig;
}

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  // Modern Templates
  {
    id: 'ocean-gradient-modern',
    name: 'Ocean Gradient Modern',
    description: 'Clean gradient design with ocean blue tones, perfect for premium course promotions',
    category: 'modern',
    tags: ['gradient', 'blue', 'premium', 'clean'],
    config: {
      backgroundType: 'gradient',
      backgroundColor: '#ffffff',
      backgroundGradient: {
        from: '#0077b6',
        to: '#00b4d8',
        direction: 'to-br'
      },
      backgroundImage: '',
      backgroundPattern: 'none',
      backgroundOpacity: 100,
      titleFont: 'inter',
      titleSize: 20,
      titleWeight: 'bold',
      titleColor: '#ffffff',
      titleAlignment: 'left',
      titleShadow: true,
      titleShadowColor: 'rgba(0, 0, 0, 0.3)',
      descriptionFont: 'inter',
      descriptionSize: 14,
      descriptionColor: '#f8f9fa',
      descriptionAlignment: 'left',
      padding: 20,
      borderRadius: 12,
      borderWidth: 0,
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      shadow: true,
      shadowColor: 'rgba(0, 119, 182, 0.2)',
      shadowBlur: 15,
      shadowOffset: 5,
      hoverEffect: 'scale',
      animationDuration: 300,
      customCSS: ''
    }
  },

  {
    id: 'coral-warm-modern',
    name: 'Coral Warm Modern',
    description: 'Warm coral gradient with modern typography, ideal for community-focused content',
    category: 'modern',
    tags: ['coral', 'warm', 'community', 'friendly'],
    config: {
      backgroundType: 'gradient',
      backgroundColor: '#ffffff',
      backgroundGradient: {
        from: '#ff6b6b',
        to: '#ffa07a',
        direction: 'to-r'
      },
      backgroundImage: '',
      backgroundPattern: 'none',
      backgroundOpacity: 100,
      titleFont: 'poppins',
      titleSize: 18,
      titleWeight: 'semibold',
      titleColor: '#ffffff',
      titleAlignment: 'left',
      titleShadow: false,
      titleShadowColor: '#000000',
      descriptionFont: 'inter',
      descriptionSize: 14,
      descriptionColor: '#fff5f5',
      descriptionAlignment: 'left',
      padding: 18,
      borderRadius: 10,
      borderWidth: 0,
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      shadow: true,
      shadowColor: 'rgba(255, 107, 107, 0.25)',
      shadowBlur: 12,
      shadowOffset: 4,
      hoverEffect: 'glow',
      animationDuration: 250,
      customCSS: ''
    }
  },

  // Elegant Templates
  {
    id: 'cream-elegant',
    name: 'Cream Elegant',
    description: 'Sophisticated cream background with subtle shadows, perfect for professional content',
    category: 'elegant',
    tags: ['cream', 'elegant', 'professional', 'subtle'],
    config: {
      backgroundType: 'solid',
      backgroundColor: '#f6f5f3',
      backgroundGradient: {
        from: '#f6f5f3',
        to: '#f6f5f3',
        direction: 'to-r'
      },
      backgroundImage: '',
      backgroundPattern: 'none',
      backgroundOpacity: 100,
      titleFont: 'playfair',
      titleSize: 22,
      titleWeight: 'bold',
      titleColor: '#1f2937',
      titleAlignment: 'left',
      titleShadow: false,
      titleShadowColor: '#000000',
      descriptionFont: 'inter',
      descriptionSize: 15,
      descriptionColor: '#6b7280',
      descriptionAlignment: 'left',
      padding: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      shadow: true,
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowBlur: 20,
      shadowOffset: 2,
      hoverEffect: 'slide',
      animationDuration: 400,
      customCSS: ''
    }
  },

  {
    id: 'dark-elegant',
    name: 'Dark Elegant',
    description: 'Dark sophisticated design with gold accents, ideal for premium offerings',
    category: 'elegant',
    tags: ['dark', 'premium', 'gold', 'sophisticated'],
    config: {
      backgroundType: 'gradient',
      backgroundColor: '#1f2937',
      backgroundGradient: {
        from: '#1f2937',
        to: '#374151',
        direction: 'to-br'
      },
      backgroundImage: '',
      backgroundPattern: 'none',
      backgroundOpacity: 100,
      titleFont: 'montserrat',
      titleSize: 20,
      titleWeight: 'bold',
      titleColor: '#f4d35e',
      titleAlignment: 'left',
      titleShadow: false,
      titleShadowColor: '#000000',
      descriptionFont: 'inter',
      descriptionSize: 14,
      descriptionColor: '#d1d5db',
      descriptionAlignment: 'left',
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#4b5563',
      borderStyle: 'solid',
      shadow: true,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowBlur: 25,
      shadowOffset: 8,
      hoverEffect: 'glow',
      animationDuration: 350,
      customCSS: ''
    }
  },

  // Playful Templates
  {
    id: 'yellow-playful',
    name: 'Yellow Playful',
    description: 'Bright and energetic yellow design, perfect for engaging content and calls-to-action',
    category: 'playful',
    tags: ['yellow', 'energetic', 'fun', 'engaging'],
    config: {
      backgroundType: 'gradient',
      backgroundColor: '#ffffff',
      backgroundGradient: {
        from: '#f4d35e',
        to: '#fbbf24',
        direction: 'to-r'
      },
      backgroundImage: '',
      backgroundPattern: 'none',
      backgroundOpacity: 100,
      titleFont: 'poppins',
      titleSize: 19,
      titleWeight: 'bold',
      titleColor: '#1f2937',
      titleAlignment: 'center',
      titleShadow: false,
      titleShadowColor: '#000000',
      descriptionFont: 'inter',
      descriptionSize: 14,
      descriptionColor: '#374151',
      descriptionAlignment: 'center',
      padding: 20,
      borderRadius: 16,
      borderWidth: 0,
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      shadow: true,
      shadowColor: 'rgba(244, 211, 94, 0.4)',
      shadowBlur: 15,
      shadowOffset: 6,
      hoverEffect: 'bounce',
      animationDuration: 200,
      customCSS: ''
    }
  },

  {
    id: 'pattern-playful',
    name: 'Pattern Playful',
    description: 'Fun pattern background with vibrant colors, great for creative and innovative content',
    category: 'playful',
    tags: ['pattern', 'creative', 'vibrant', 'innovative'],
    config: {
      backgroundType: 'pattern',
      backgroundColor: '#ffffff',
      backgroundGradient: {
        from: '#667eea',
        to: '#764ba2',
        direction: 'to-r'
      },
      backgroundImage: '',
      backgroundPattern: 'hexagons',
      backgroundOpacity: 90,
      titleFont: 'poppins',
      titleSize: 18,
      titleWeight: 'semibold',
      titleColor: '#ffffff',
      titleAlignment: 'left',
      titleShadow: true,
      titleShadowColor: 'rgba(0, 0, 0, 0.4)',
      descriptionFont: 'inter',
      descriptionSize: 14,
      descriptionColor: '#f1f5f9',
      descriptionAlignment: 'left',
      padding: 18,
      borderRadius: 14,
      borderWidth: 0,
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      shadow: true,
      shadowColor: 'rgba(102, 126, 234, 0.3)',
      shadowBlur: 18,
      shadowOffset: 5,
      hoverEffect: 'scale',
      animationDuration: 300,
      customCSS: ''
    }
  },

  // Professional Templates
  {
    id: 'blue-professional',
    name: 'Blue Professional',
    description: 'Clean blue design with professional typography, ideal for business and educational content',
    category: 'professional',
    tags: ['blue', 'professional', 'business', 'educational'],
    config: {
      backgroundType: 'solid',
      backgroundColor: '#ffffff',
      backgroundGradient: {
        from: '#ffffff',
        to: '#ffffff',
        direction: 'to-r'
      },
      backgroundImage: '',
      backgroundPattern: 'none',
      backgroundOpacity: 100,
      titleFont: 'inter',
      titleSize: 18,
      titleWeight: 'semibold',
      titleColor: '#0077b6',
      titleAlignment: 'left',
      titleShadow: false,
      titleShadowColor: '#000000',
      descriptionFont: 'inter',
      descriptionSize: 14,
      descriptionColor: '#4b5563',
      descriptionAlignment: 'left',
      padding: 20,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#0077b6',
      borderStyle: 'solid',
      shadow: true,
      shadowColor: 'rgba(0, 119, 182, 0.1)',
      shadowBlur: 10,
      shadowOffset: 2,
      hoverEffect: 'slide',
      animationDuration: 300,
      customCSS: ''
    }
  },

  {
    id: 'gray-professional',
    name: 'Gray Professional',
    description: 'Sophisticated gray design with clean lines, perfect for corporate and institutional content',
    category: 'professional',
    tags: ['gray', 'corporate', 'institutional', 'clean'],
    config: {
      backgroundType: 'gradient',
      backgroundColor: '#ffffff',
      backgroundGradient: {
        from: '#f8fafc',
        to: '#e2e8f0',
        direction: 'to-br'
      },
      backgroundImage: '',
      backgroundPattern: 'none',
      backgroundOpacity: 100,
      titleFont: 'inter',
      titleSize: 17,
      titleWeight: 'semibold',
      titleColor: '#1e293b',
      titleAlignment: 'left',
      titleShadow: false,
      titleShadowColor: '#000000',
      descriptionFont: 'inter',
      descriptionSize: 14,
      descriptionColor: '#64748b',
      descriptionAlignment: 'left',
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      shadow: true,
      shadowColor: 'rgba(0, 0, 0, 0.05)',
      shadowBlur: 8,
      shadowOffset: 1,
      hoverEffect: 'none',
      animationDuration: 200,
      customCSS: ''
    }
  },

  // Minimal Templates
  {
    id: 'white-minimal',
    name: 'White Minimal',
    description: 'Ultra-clean white design with minimal elements, perfect for content-focused promotions',
    category: 'minimal',
    tags: ['white', 'minimal', 'clean', 'content-focused'],
    config: {
      backgroundType: 'solid',
      backgroundColor: '#ffffff',
      backgroundGradient: {
        from: '#ffffff',
        to: '#ffffff',
        direction: 'to-r'
      },
      backgroundImage: '',
      backgroundPattern: 'none',
      backgroundOpacity: 100,
      titleFont: 'inter',
      titleSize: 16,
      titleWeight: 'medium',
      titleColor: '#1f2937',
      titleAlignment: 'left',
      titleShadow: false,
      titleShadowColor: '#000000',
      descriptionFont: 'inter',
      descriptionSize: 13,
      descriptionColor: '#6b7280',
      descriptionAlignment: 'left',
      padding: 16,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#f3f4f6',
      borderStyle: 'solid',
      shadow: false,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowBlur: 0,
      shadowOffset: 0,
      hoverEffect: 'none',
      animationDuration: 200,
      customCSS: ''
    }
  },

  {
    id: 'border-minimal',
    name: 'Border Minimal',
    description: 'Minimal design with subtle border accent, ideal for understated yet elegant promotions',
    category: 'minimal',
    tags: ['border', 'subtle', 'elegant', 'understated'],
    config: {
      backgroundType: 'solid',
      backgroundColor: '#ffffff',
      backgroundGradient: {
        from: '#ffffff',
        to: '#ffffff',
        direction: 'to-r'
      },
      backgroundImage: '',
      backgroundPattern: 'none',
      backgroundOpacity: 100,
      titleFont: 'inter',
      titleSize: 17,
      titleWeight: 'semibold',
      titleColor: '#374151',
      titleAlignment: 'left',
      titleShadow: false,
      titleShadowColor: '#000000',
      descriptionFont: 'inter',
      descriptionSize: 14,
      descriptionColor: '#6b7280',
      descriptionAlignment: 'left',
      padding: 20,
      borderRadius: 0,
      borderWidth: 3,
      borderColor: '#0077b6',
      borderStyle: 'solid',
      shadow: false,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowBlur: 0,
      shadowOffset: 0,
      hoverEffect: 'slide',
      animationDuration: 300,
      customCSS: 'border-left: 3px solid #0077b6;'
    }
  },

  // Bold Templates
  {
    id: 'gradient-bold',
    name: 'Gradient Bold',
    description: 'Bold gradient design with strong typography, perfect for attention-grabbing promotions',
    category: 'bold',
    tags: ['gradient', 'bold', 'attention-grabbing', 'strong'],
    config: {
      backgroundType: 'gradient',
      backgroundColor: '#ffffff',
      backgroundGradient: {
        from: '#667eea',
        to: '#764ba2',
        direction: 'to-r'
      },
      backgroundImage: '',
      backgroundPattern: 'none',
      backgroundOpacity: 100,
      titleFont: 'poppins',
      titleSize: 22,
      titleWeight: 'bold',
      titleColor: '#ffffff',
      titleAlignment: 'center',
      titleShadow: true,
      titleShadowColor: 'rgba(0, 0, 0, 0.5)',
      descriptionFont: 'inter',
      descriptionSize: 15,
      descriptionColor: '#f1f5f9',
      descriptionAlignment: 'center',
      padding: 24,
      borderRadius: 16,
      borderWidth: 0,
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      shadow: true,
      shadowColor: 'rgba(102, 126, 234, 0.4)',
      shadowBlur: 20,
      shadowOffset: 8,
      hoverEffect: 'scale',
      animationDuration: 250,
      customCSS: ''
    }
  },

  {
    id: 'color-block-bold',
    name: 'Color Block Bold',
    description: 'Bold color blocking with strong contrast, ideal for high-impact promotional content',
    category: 'bold',
    tags: ['color-block', 'contrast', 'high-impact', 'strong'],
    config: {
      backgroundType: 'solid',
      backgroundColor: '#ff6b6b',
      backgroundGradient: {
        from: '#ff6b6b',
        to: '#ff6b6b',
        direction: 'to-r'
      },
      backgroundImage: '',
      backgroundPattern: 'none',
      backgroundOpacity: 100,
      titleFont: 'montserrat',
      titleSize: 20,
      titleWeight: 'bold',
      titleColor: '#ffffff',
      titleAlignment: 'left',
      titleShadow: false,
      titleShadowColor: '#000000',
      descriptionFont: 'inter',
      descriptionSize: 14,
      descriptionColor: '#fff5f5',
      descriptionAlignment: 'left',
      padding: 20,
      borderRadius: 8,
      borderWidth: 0,
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      shadow: true,
      shadowColor: 'rgba(255, 107, 107, 0.3)',
      shadowBlur: 15,
      shadowOffset: 5,
      hoverEffect: 'glow',
      animationDuration: 300,
      customCSS: ''
    }
  }
];

export const getTemplateById = (id: string): DesignTemplate | undefined => {
  return DESIGN_TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): DesignTemplate[] => {
  return DESIGN_TEMPLATES.filter(template => template.category === category);
};

export const getTemplatesByTag = (tag: string): DesignTemplate[] => {
  return DESIGN_TEMPLATES.filter(template => template.tags.includes(tag));
};

export const getDefaultTemplate = (): DesignTemplate => {
  return DESIGN_TEMPLATES.find(template => template.id === 'ocean-gradient-modern') || DESIGN_TEMPLATES[0];
};
