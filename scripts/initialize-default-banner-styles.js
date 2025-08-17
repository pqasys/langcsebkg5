const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
      horizontal: 'left',
      vertical: 'top',
      padding: { top: 0, bottom: 0, left: 0, right: 0 }
    }),
    titleShadow: false,
    titleShadowColor: '#000000',
    descriptionFont: 'inter',
    descriptionSize: 16,
    descriptionColor: '#6b7280',
    descriptionAlignment: JSON.stringify({
      horizontal: 'left',
      vertical: 'top',
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
    isDefault: true,
    createdBy: null // Admin default
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
      horizontal: 'left',
      vertical: 'top',
      padding: { top: 0, bottom: 0, left: 0, right: 0 }
    }),
    titleShadow: false,
    titleShadowColor: '#000000',
    descriptionFont: 'inter',
    descriptionSize: 16,
    descriptionColor: '#6b7280',
    descriptionAlignment: JSON.stringify({
      horizontal: 'left',
      vertical: 'top',
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
    isDefault: true,
    createdBy: null // Admin default
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
      horizontal: 'left',
      vertical: 'top',
      padding: { top: 0, bottom: 0, left: 0, right: 0 }
    }),
    titleShadow: false,
    titleShadowColor: '#000000',
    descriptionFont: 'inter',
    descriptionSize: 16,
    descriptionColor: '#6b7280',
    descriptionAlignment: JSON.stringify({
      horizontal: 'left',
      vertical: 'top',
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
    isDefault: true,
    createdBy: null // Admin default
  }
};

async function initializeDefaultBannerStyles() {
  try {
    console.log('🔄 Initializing default banner styles...');
    
    for (const [itemId, config] of Object.entries(defaultBannerConfigs)) {
      // Check if default config already exists
      const existingConfig = await prisma.designConfig.findFirst({
        where: {
          itemId: itemId,
          isDefault: true
        }
      });
      
      if (!existingConfig) {
        console.log(`📝 Creating default config for ${itemId}...`);
        await prisma.designConfig.create({
          data: config
        });
        console.log(`✅ Created default config for ${itemId}`);
      } else {
        console.log(`⏭️  Default config for ${itemId} already exists, skipping...`);
      }
    }
    
    console.log('🎉 Default banner styles initialization completed!');
  } catch (error) {
    console.error('❌ Error initializing default banner styles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization
initializeDefaultBannerStyles();
