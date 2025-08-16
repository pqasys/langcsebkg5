import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function comprehensiveDebugging() {
  console.log('🔍 COMPREHENSIVE DEBUGGING - Original Design Restoration\n');
  console.log('=' .repeat(80));

  try {
    // PHASE 1: Database State Verification
    console.log('\n📊 PHASE 1: Database State Verification');
    console.log('-'.repeat(50));
    
    const designs = await prisma.designConfig.findMany({
      where: {
        itemId: { in: ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'] }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${designs.length} designs in database:`);
    
    designs.forEach(design => {
      console.log(`\n📋 ${design.name} (${design.itemId}):`);
      console.log(`   ID: ${design.id}`);
      console.log(`   Created By: ${design.createdBy}`);
      console.log(`   Is Active: ${design.isActive}`);
      console.log(`   Is Default: ${design.isDefault}`);
      console.log(`   Is Approved: ${design.isApproved}`);
      console.log(`   Approval Status: ${design.approvalStatus}`);
      console.log(`   Background Type: ${design.backgroundType}`);
      console.log(`   Gradient: ${design.backgroundGradientFrom} → ${design.backgroundGradientTo}`);
      console.log(`   Gradient Direction: ${design.backgroundGradientDirection}`);
      console.log(`   Background Opacity: ${design.backgroundOpacity}%`);
      console.log(`   Title Color: ${design.titleColor}`);
      console.log(`   Title Size: ${design.titleSize}px`);
      console.log(`   Title Weight: ${design.titleWeight}`);
      console.log(`   Description Color: ${design.descriptionColor}`);
      console.log(`   Description Size: ${design.descriptionSize}px`);
      console.log(`   Created At: ${design.createdAt}`);
      console.log(`   Updated At: ${design.updatedAt}`);
    });

    // PHASE 2: Admin User Verification
    console.log('\n👥 PHASE 2: Admin User Verification');
    console.log('-'.repeat(50));
    
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN', status: 'ACTIVE' },
      select: { id: true, email: true, name: true }
    });

    console.log(`Found ${adminUsers.length} active admin users:`);
    adminUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ID: ${user.id}`);
    });

    // PHASE 3: Public API Logic Simulation
    console.log('\n🌐 PHASE 3: Public API Logic Simulation');
    console.log('-'.repeat(50));
    
    const publicWhere = {
      OR: [
        { createdBy: { in: adminUsers.map(u => u.id) } },
        { isApproved: true, approvalStatus: 'APPROVED', isActive: true }
      ]
    };

    const publicConfigs = await prisma.designConfig.findMany({
      where: publicWhere,
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    });

    console.log(`Public API would return ${publicConfigs.length} total designs`);
    
    const coursesPagePublicDesigns = publicConfigs.filter(config => 
      ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'].includes(config.itemId)
    );

    console.log(`Courses page designs in public API: ${coursesPagePublicDesigns.length}`);
    
    coursesPagePublicDesigns.forEach(design => {
      const isAdminCreated = adminUsers.some(admin => admin.id === design.createdBy);
      const isApproved = design.isApproved && design.approvalStatus === 'APPROVED' && design.isActive;
      
      console.log(`\n   ✅ ${design.name} (${design.itemId}):`);
      console.log(`      Public Access: ${isAdminCreated || isApproved ? 'YES' : 'NO'}`);
      console.log(`      Reason: ${isAdminCreated ? 'Created by admin' : isApproved ? 'Admin-approved' : 'Not accessible'}`);
      console.log(`      Background: ${design.backgroundType} (${design.backgroundGradientFrom} → ${design.backgroundGradientTo})`);
      console.log(`      Title: ${design.titleSize}px ${design.titleWeight} ${design.titleColor}`);
      console.log(`      Description: ${design.descriptionSize}px ${design.descriptionColor}`);
    });

    // PHASE 4: Frontend Processing Simulation
    console.log('\n🎨 PHASE 4: Frontend Processing Simulation');
    console.log('-'.repeat(50));
    
    // Simulate the exact frontend logic from CoursesPageClient.tsx
    const data = { configs: publicConfigs };
    const configsMap: any = {};
    
    // Group configs by itemId (this is the key fix we made)
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
    
    console.log(`Grouped by itemId: ${Object.keys(configsByItemId).join(', ')}`);
    
    // For each itemId, use the most recent config
    Object.keys(configsByItemId).forEach(itemId => {
      const configs = configsByItemId[itemId];
      const mostRecentConfig = configs.reduce((latest, current) => 
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
      );
      
      configsMap[itemId] = transformDatabaseConfig(mostRecentConfig);
    });
    
    console.log(`Final configs map keys: ${Object.keys(configsMap).join(', ')}`);

    // PHASE 5: Design Configuration Verification
    console.log('\n🎯 PHASE 5: Design Configuration Verification');
    console.log('-'.repeat(50));
    
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

    // PHASE 6: Original Styling Match Verification
    console.log('\n🎨 PHASE 6: Original Styling Match Verification');
    console.log('-'.repeat(50));
    
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

    let allMatch = true;
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
          allMatch = false;
          console.log(`      Expected: ${expected.backgroundGradient.from} → ${expected.backgroundGradient.to}, ${expected.backgroundOpacity}%`);
          console.log(`      Actual: ${actual.backgroundGradient.from} → ${actual.backgroundGradient.to}, ${actual.backgroundOpacity}%`);
          console.log(`      Expected Title: ${expected.titleSize}px ${expected.titleWeight} ${expected.titleColor}`);
          console.log(`      Actual Title: ${actual.titleSize}px ${actual.titleWeight} ${actual.titleColor}`);
        }
      } else {
        console.log(`   ${itemId}: ❌ NOT FOUND`);
        allMatch = false;
      }
    });

    // PHASE 7: Component Application Simulation
    console.log('\n🎭 PHASE 7: Component Application Simulation');
    console.log('-'.repeat(50));
    
    // Simulate how DesignableAdvertisingBanner would apply the styles
    coursesPageItemIds.forEach(itemId => {
      const config = configsMap[itemId];
      if (config) {
        // Simulate getBackgroundStyle() function
        const gradientFrom = config.backgroundGradient?.from || (config as any).backgroundGradientFrom;
        const gradientTo = config.backgroundGradient?.to || (config as any).backgroundGradientTo;
        const gradientDirection = config.backgroundGradient?.direction || (config as any).backgroundGradientDirection || 'to-r';
        
        const backgroundStyle = {
          background: `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})`,
          opacity: config.backgroundOpacity / 100
        };
        
        console.log(`\n   🎨 ${itemId} CSS Output:`);
        console.log(`      .banner-background {`);
        console.log(`        background: ${backgroundStyle.background};`);
        console.log(`        opacity: ${backgroundStyle.opacity};`);
        console.log(`      }`);
        console.log(`      .banner-title {`);
        console.log(`        color: ${config.titleColor};`);
        console.log(`        font-size: ${config.titleSize}px;`);
        console.log(`        font-weight: ${config.titleWeight};`);
        console.log(`      }`);
        console.log(`      .banner-description {`);
        console.log(`        color: ${config.descriptionColor};`);
        console.log(`        font-size: ${config.descriptionSize}px;`);
        console.log(`      }`);
      }
    });

    // PHASE 8: Final Summary
    console.log('\n📋 PHASE 8: Final Summary');
    console.log('-'.repeat(50));
    
    const publicApiWorks = coursesPagePublicDesigns.length === 3;
    const frontendProcessingWorks = coursesPageItemIds.every(itemId => configsMap[itemId]);
    
    console.log(`✅ Database contains designs: ${designs.length === 3 ? 'YES' : 'NO'}`);
    console.log(`✅ Admin users found: ${adminUsers.length > 0 ? 'YES' : 'NO'}`);
    console.log(`✅ Public API works: ${publicApiWorks ? 'YES' : 'NO'}`);
    console.log(`✅ Frontend processing works: ${frontendProcessingWorks ? 'YES' : 'NO'}`);
    console.log(`✅ Original styling matches: ${allMatch ? 'YES' : 'NO'}`);
    
    if (allMatch && publicApiWorks && frontendProcessingWorks) {
      console.log('\n🎉 SUCCESS: All systems are working correctly!');
      console.log('The banners should display with their original styling.');
    } else {
      console.log('\n❌ ISSUE DETECTED: Some systems are not working correctly');
      console.log('Please check the detailed output above to identify the problem.');
    }

  } catch (error) {
    console.error('❌ Error in comprehensive debugging:', error);
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

// Run the comprehensive debugging
comprehensiveDebugging();
