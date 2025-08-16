import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testFrontendDesignLoading() {
  console.log('🎨 Testing Frontend Design Loading Process\n');

  try {
    // 1. Simulate the public API response
    console.log('1. Simulating Public API Response...');
    
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        status: 'ACTIVE'
      },
      select: {
        id: true
      }
    });

    const publicWhere = {
      OR: [
        { createdBy: { in: adminUsers.map(u => u.id) } },
        { 
          isApproved: true, 
          approvalStatus: 'APPROVED',
          isActive: true
        }
      ]
    };

    const publicConfigs = await prisma.designConfig.findMany({
      where: publicWhere,
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    console.log(`   Public API would return ${publicConfigs.length} designs`);

    // 2. Simulate the frontend processing logic
    console.log('\n2. Simulating Frontend Processing...');
    
    const data = { configs: publicConfigs };
    const configsMap: any = {};
    
    // Group configs by itemId
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
    
    console.log(`   Grouped by itemId: ${Object.keys(configsByItemId).join(', ')}`);
    
    // For each itemId, use the most recent config
    Object.keys(configsByItemId).forEach(itemId => {
      const configs = configsByItemId[itemId];
      const mostRecentConfig = configs.reduce((latest, current) => 
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
      );
      
      configsMap[itemId] = transformDatabaseConfig(mostRecentConfig);
    });
    
    console.log(`   Final configs map keys: ${Object.keys(configsMap).join(', ')}`);

    // 3. Check courses page specific designs
    console.log('\n3. Checking Courses Page Designs...');
    
    const coursesPageItemIds = ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'];
    
    coursesPageItemIds.forEach(itemId => {
      if (configsMap[itemId]) {
        const config = configsMap[itemId];
        console.log(`\n   ✅ ${itemId}:`);
        console.log(`      Background: ${config.backgroundType} (${config.backgroundGradient.from} → ${config.backgroundGradient.to})`);
        console.log(`      Opacity: ${config.backgroundOpacity}%`);
        console.log(`      Title: ${config.titleSize}px ${config.titleWeight} ${config.titleColor}`);
        console.log(`      Description: ${config.descriptionSize}px ${config.descriptionColor}`);
      } else {
        console.log(`\n   ❌ ${itemId}: NOT FOUND in configs map`);
      }
    });

    // 4. Verify the designs match the original styling
    console.log('\n4. Verifying Original Styling Match...');
    
    const expectedDesigns = {
      'premium-course-banner': {
        backgroundGradient: { from: '#8b5cf6', to: '#ec4899' },
        backgroundOpacity: 10,
        titleSize: 20,
        titleWeight: 'bold',
        titleColor: '#111827',
        descriptionSize: 14,
        descriptionColor: '#4b5563'
      },
      'featured-institution-banner': {
        backgroundGradient: { from: '#f97316', to: '#ef4444' },
        backgroundOpacity: 10,
        titleSize: 20,
        titleWeight: 'bold',
        titleColor: '#111827',
        descriptionSize: 14,
        descriptionColor: '#4b5563'
      },
      'promotional-banner': {
        backgroundGradient: { from: '#10b981', to: '#059669' },
        backgroundOpacity: 10,
        titleSize: 20,
        titleWeight: 'bold',
        titleColor: '#111827',
        descriptionSize: 14,
        descriptionColor: '#4b5563'
      }
    };

    coursesPageItemIds.forEach(itemId => {
      const actual = configsMap[itemId];
      const expected = expectedDesigns[itemId as keyof typeof expectedDesigns];
      
      if (actual && expected) {
        const matches = 
          actual.backgroundGradient.from === expected.backgroundGradient.from &&
          actual.backgroundGradient.to === expected.backgroundGradient.to &&
          actual.backgroundOpacity === expected.backgroundOpacity &&
          actual.titleSize === expected.titleSize &&
          actual.titleWeight === expected.titleWeight &&
          actual.titleColor === expected.titleColor &&
          actual.descriptionSize === expected.descriptionSize &&
          actual.descriptionColor === expected.descriptionColor;
        
        console.log(`   ${itemId}: ${matches ? '✅ MATCHES' : '❌ DOES NOT MATCH'}`);
        
        if (!matches) {
          console.log(`      Expected: ${expected.backgroundGradient.from} → ${expected.backgroundGradient.to}, ${expected.backgroundOpacity}%`);
          console.log(`      Actual: ${actual.backgroundGradient.from} → ${actual.backgroundGradient.to}, ${actual.backgroundOpacity}%`);
        }
      } else {
        console.log(`   ${itemId}: ❌ NOT FOUND`);
      }
    });

  } catch (error) {
    console.error('❌ Error testing frontend design loading:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Function to transform database data to DesignConfig format (copied from CoursesPageClient)
function transformDatabaseConfig(dbConfig: any): any {
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
}

// Run the test
testFrontendDesignLoading();
