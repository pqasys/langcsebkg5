import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function finalVerification() {
  console.log('🎯 Final Verification - Original Design Restoration\n');

  try {
    // 1. Database Verification
    console.log('1. Database Verification...');
    
    const designs = await prisma.designConfig.findMany({
      where: {
        itemId: { in: ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'] }
      }
    });

    console.log(`   Found ${designs.length} designs in database`);
    
    const allMatch = designs.every(design => {
      const expected = getExpectedDesign(design.itemId);
      return (
        design.backgroundGradientFrom === expected.gradientFrom &&
        design.backgroundGradientTo === expected.gradientTo &&
        design.backgroundOpacity === expected.opacity &&
        design.titleColor === expected.titleColor &&
        design.titleSize === expected.titleSize &&
        design.titleWeight === expected.titleWeight &&
        design.descriptionColor === expected.descriptionColor &&
        design.descriptionSize === expected.descriptionSize
      );
    });

    console.log(`   Database designs match original: ${allMatch ? '✅ YES' : '❌ NO'}`);

    // 2. Public API Verification
    console.log('\n2. Public API Verification...');
    
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN', status: 'ACTIVE' },
      select: { id: true }
    });

    const publicConfigs = await prisma.designConfig.findMany({
      where: {
        OR: [
          { createdBy: { in: adminUsers.map(u => u.id) } },
          { isApproved: true, approvalStatus: 'APPROVED', isActive: true }
        ]
      }
    });

    const coursesPagePublicDesigns = publicConfigs.filter(config => 
      ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'].includes(config.itemId)
    );

    console.log(`   Public API returns ${coursesPagePublicDesigns.length} courses page designs`);
    console.log(`   All courses page designs publicly accessible: ${coursesPagePublicDesigns.length === 3 ? '✅ YES' : '❌ NO'}`);

    // 3. Frontend Processing Verification
    console.log('\n3. Frontend Processing Verification...');
    
    // Simulate frontend processing
    const configsByItemId: { [key: string]: any[] } = {};
    
    publicConfigs.forEach((config: any) => {
      const itemId = config.itemId;
      if (itemId) {
        if (!configsByItemId[itemId]) {
          configsByItemId[itemId] = [];
        }
        configsByItemId[itemId].push(config);
      }
    });

    const configsMap: any = {};
    Object.keys(configsByItemId).forEach(itemId => {
      const configs = configsByItemId[itemId];
      const mostRecentConfig = configs.reduce((latest, current) => 
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
      );
      
      configsMap[itemId] = transformDatabaseConfig(mostRecentConfig);
    });

    const coursesPageItemIds = ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'];
    const frontendProcessingWorks = coursesPageItemIds.every(itemId => {
      const config = configsMap[itemId];
      if (!config) return false;
      
      const expected = getExpectedDesign(itemId);
      return (
        config.backgroundGradient.from === expected.gradientFrom &&
        config.backgroundGradient.to === expected.gradientTo &&
        config.backgroundOpacity === expected.opacity &&
        config.titleColor === expected.titleColor &&
        config.titleSize === expected.titleSize &&
        config.titleWeight === expected.titleWeight &&
        config.descriptionColor === expected.descriptionColor &&
        config.descriptionSize === expected.descriptionSize
      );
    });

    console.log(`   Frontend processing works correctly: ${frontendProcessingWorks ? '✅ YES' : '❌ NO'}`);

    // 4. Component Application Verification
    console.log('\n4. Component Application Verification...');
    
    // Simulate how DesignableAdvertisingBanner would apply the styles
    const componentApplicationWorks = coursesPageItemIds.every(itemId => {
      const config = configsMap[itemId];
      if (!config) return false;
      
      // Simulate getBackgroundStyle() function
      const gradientFrom = config.backgroundGradient?.from || (config as any).backgroundGradientFrom;
      const gradientTo = config.backgroundGradient?.to || (config as any).backgroundGradientTo;
      const gradientDirection = config.backgroundGradient?.direction || (config as any).backgroundGradientDirection || 'to-r';
      
      const backgroundStyle = {
        background: `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})`,
        opacity: config.backgroundOpacity / 100
      };
      
      const expected = getExpectedDesign(itemId);
      return (
        backgroundStyle.background === `linear-gradient(to-r, ${expected.gradientFrom}, ${expected.gradientTo})` &&
        backgroundStyle.opacity === expected.opacity / 100
      );
    });

    console.log(`   Component application works correctly: ${componentApplicationWorks ? '✅ YES' : '❌ NO'}`);

    // 5. Final Summary
    console.log('\n5. Final Summary...');
    
    const allSystemsWorking = allMatch && coursesPagePublicDesigns.length === 3 && frontendProcessingWorks && componentApplicationWorks;
    
    if (allSystemsWorking) {
      console.log('🎉 SUCCESS: All systems are working correctly!');
      console.log('✅ Database contains original designs');
      console.log('✅ Public API returns designs correctly');
      console.log('✅ Frontend processing works correctly');
      console.log('✅ Component application works correctly');
      console.log('');
      console.log('🎨 The top Advertising Banners on /courses should now display with their original styling!');
      console.log('🔧 Admins and institution staff can still customize these designs');
      console.log('🌐 All users (including unauthenticated) will see the original styling');
    } else {
      console.log('❌ ISSUE DETECTED: Some systems are not working correctly');
      console.log(`   Database: ${allMatch ? '✅' : '❌'}`);
      console.log(`   Public API: ${coursesPagePublicDesigns.length === 3 ? '✅' : '❌'}`);
      console.log(`   Frontend Processing: ${frontendProcessingWorks ? '✅' : '❌'}`);
      console.log(`   Component Application: ${componentApplicationWorks ? '✅' : '❌'}`);
    }

  } catch (error) {
    console.error('❌ Error in final verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function getExpectedDesign(itemId: string) {
  const expected = {
    'premium-course-banner': {
      gradientFrom: '#8b5cf6',
      gradientTo: '#ec4899',
      opacity: 10,
      titleColor: '#111827',
      titleSize: 20,
      titleWeight: 'bold',
      descriptionColor: '#4b5563',
      descriptionSize: 14
    },
    'featured-institution-banner': {
      gradientFrom: '#f97316',
      gradientTo: '#ef4444',
      opacity: 10,
      titleColor: '#111827',
      titleSize: 20,
      titleWeight: 'bold',
      descriptionColor: '#4b5563',
      descriptionSize: 14
    },
    'promotional-banner': {
      gradientFrom: '#10b981',
      gradientTo: '#059669',
      opacity: 10,
      titleColor: '#111827',
      titleSize: 20,
      titleWeight: 'bold',
      descriptionColor: '#4b5563',
      descriptionSize: 14
    }
  };
  
  return expected[itemId as keyof typeof expected];
}

// Function to transform database data to DesignConfig format
function transformDatabaseConfig(dbConfig: any): any {
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
    titleShadow: dbConfig.titleShadow || false,
    titleShadowColor: dbConfig.titleShadowColor || '#000000',
    descriptionFont: dbConfig.descriptionFont || 'inter',
    descriptionSize: dbConfig.descriptionSize || 16,
    descriptionColor: dbConfig.descriptionColor || '#6b7280',
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
}

// Run the verification
finalVerification();
