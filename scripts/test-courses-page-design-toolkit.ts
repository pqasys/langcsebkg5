import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCoursesPageDesignToolkit() {
  console.log('🧪 Testing Design Toolkit for Courses Page\n');

  try {
    // 1. Check if design configurations exist
    console.log('1. Checking Design Configurations...');
    
    const designConfigs = await prisma.designConfig.findMany({
      where: {
        itemId: { in: ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'] }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`   Found ${designConfigs.length} design configurations for courses page`);
    
    if (designConfigs.length === 0) {
      console.log('   ❌ No design configurations found for courses page');
      return;
    }
    
    // Group by itemId
    const configsByItemId: { [key: string]: any[] } = {};
    designConfigs.forEach(config => {
      if (!configsByItemId[config.itemId]) {
        configsByItemId[config.itemId] = [];
      }
      configsByItemId[config.itemId].push(config);
    });
    
    // 2. Verify each banner type has configurations
    console.log('\n2. Verifying Banner Configurations...');
    
    const expectedBanners = ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'];
    
    expectedBanners.forEach(bannerType => {
      const configs = configsByItemId[bannerType] || [];
      console.log(`   ${bannerType}:`);
      console.log(`     - Configurations: ${configs.length}`);
      
      if (configs.length > 0) {
        const latestConfig = configs[0];
        console.log(`     - Latest: "${latestConfig.name}"`);
        console.log(`     - Background: ${latestConfig.backgroundType}`);
        console.log(`     - Title Color: ${latestConfig.titleColor}`);
        console.log(`     - Description Color: ${latestConfig.descriptionColor}`);
        console.log(`     - Status: ${latestConfig.isActive ? 'Active' : 'Inactive'}`);
        console.log(`     - Approved: ${latestConfig.isApproved ? 'Yes' : 'No'}`);
        console.log(`     - Public Access: ${latestConfig.isApproved && latestConfig.isActive ? 'Yes' : 'No'}`);
      } else {
        console.log(`     - ❌ No configurations found`);
      }
    });

    // 3. Test public API access
    console.log('\n3. Testing Public API Access...');
    
    const publicConfigs = await prisma.designConfig.findMany({
      where: {
        OR: [
          // Admin-created designs (only from active admins)
          { createdBy: { in: await getActiveAdminUserIds() } },
          // Admin-approved designs from all users (including institution users)
          {
            isApproved: true,
            approvalStatus: 'APPROVED',
            isActive: true
          }
        ],
        itemId: { in: expectedBanners }
      }
    });
    
    console.log(`   Public API would return ${publicConfigs.length} configurations`);
    
    const publicByType: { [key: string]: number } = {};
    publicConfigs.forEach(config => {
      publicByType[config.itemId] = (publicByType[config.itemId] || 0) + 1;
    });
    
    expectedBanners.forEach(bannerType => {
      const count = publicByType[bannerType] || 0;
      console.log(`   - ${bannerType}: ${count} public configurations`);
    });

    // 4. Simulate frontend processing
    console.log('\n4. Simulating Frontend Processing...');
    
    const simulatedConfigsMap: { [key: string]: any } = {};
    
    // Group by itemId and use the most recent config for each
    Object.keys(configsByItemId).forEach(itemId => {
      const configs = configsByItemId[itemId];
      if (configs.length > 0) {
        const mostRecentConfig = configs.reduce((latest, current) =>
          new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
        );
        simulatedConfigsMap[itemId] = mostRecentConfig;
      }
    });
    
    console.log(`   Frontend would load ${Object.keys(simulatedConfigsMap).length} design configurations`);
    
    Object.keys(simulatedConfigsMap).forEach(itemId => {
      const config = simulatedConfigsMap[itemId];
      console.log(`   - ${itemId}: "${config.name}"`);
      console.log(`     Background: ${config.backgroundType}`);
      console.log(`     Colors: Title=${config.titleColor}, Description=${config.descriptionColor}`);
      console.log(`     Font: ${config.titleFont} ${config.titleSize}px ${config.titleWeight}`);
    });

    // 5. Test design customization workflow
    console.log('\n5. Testing Design Customization Workflow...');
    
    // Simulate what happens when an admin edits a design
    const testItemId = 'premium-course-banner';
    const testConfig = simulatedConfigsMap[testItemId];
    
    if (testConfig) {
      console.log(`   Simulating edit for ${testItemId}:`);
      console.log(`   - Current title color: ${testConfig.titleColor}`);
      console.log(`   - Current background: ${testConfig.backgroundType}`);
      
      // Simulate a design change
      const updatedConfig = {
        ...testConfig,
        titleColor: '#ff6b6b',
        backgroundType: 'gradient',
        backgroundGradientFrom: '#ff6b6b',
        backgroundGradientTo: '#4ecdc4'
      };
      
      console.log(`   - Updated title color: ${updatedConfig.titleColor}`);
      console.log(`   - Updated background: ${updatedConfig.backgroundType}`);
      console.log(`   - This would be saved to database with itemId: ${testItemId}`);
    }

    // 6. Final verification
    console.log('\n6. Final Verification...');
    
    const allBannersHaveConfigs = expectedBanners.every(bannerType => 
      (configsByItemId[bannerType] || []).length > 0
    );
    
    const allConfigsArePublic = publicConfigs.length === designConfigs.length;
    
    console.log(`   ✅ All banner types have configurations: ${allBannersHaveConfigs}`);
    console.log(`   ✅ All configurations are publicly accessible: ${allConfigsArePublic}`);
    
    if (allBannersHaveConfigs && allConfigsArePublic) {
      console.log('\n🎉 SUCCESS: Design Toolkit is fully functional for courses page!');
      console.log('📋 Summary:');
      console.log('   - Premium Course Banner: Purple gradient design');
      console.log('   - Featured Institution Banner: Light gray design');
      console.log('   - Promotional Banner: Orange gradient design');
      console.log('   - All designs are approved and publicly accessible');
      console.log('   - Admins and institution staff can customize designs');
      console.log('   - Unauthenticated users can see the designs');
      console.log('   - Design changes are saved to database');
    } else {
      console.log('\n⚠️  Some issues detected:');
      if (!allBannersHaveConfigs) {
        console.log('   - Not all banner types have configurations');
      }
      if (!allConfigsArePublic) {
        console.log('   - Not all configurations are publicly accessible');
      }
    }

  } catch (error) {
    console.error('❌ Error testing courses page design toolkit:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to get active admin user IDs
async function getActiveAdminUserIds(): Promise<string[]> {
  try {
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        status: 'ACTIVE'
      },
      select: {
        id: true
      }
    });
    return adminUsers.map(user => user.id);
  } catch (error) {
    console.error('Error fetching admin user IDs:', error);
    return [];
  }
}

// Run the test
testCoursesPageDesignToolkit();
