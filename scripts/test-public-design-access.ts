import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPublicDesignAccess() {
  console.log('🧪 Testing Public Design Access for Unauthenticated Users\n');

  try {
    // 1. Check current state
    console.log('1. Current State Analysis...');
    
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN', status: 'ACTIVE' },
      select: { id: true, email: true, name: true }
    });
    
    const institutionUsers = await prisma.user.findMany({
      where: { role: 'INSTITUTION_STAFF', status: 'ACTIVE' },
      select: { id: true, email: true, name: true }
    });
    
    const allDesignConfigs = await prisma.designConfig.findMany();
    
    console.log(`   - Active admin users: ${adminUsers.length}`);
    console.log(`   - Active institution users: ${institutionUsers.length}`);
    console.log(`   - Total design configs: ${allDesignConfigs.length}`);
    
    const adminConfigs = allDesignConfigs.filter(config => 
      adminUsers.some(admin => admin.id === config.createdBy)
    );
    
    const approvedConfigs = allDesignConfigs.filter(config => 
      config.isApproved === true && config.approvalStatus === 'APPROVED'
    );
    
    const institutionConfigs = allDesignConfigs.filter(config => 
      institutionUsers.some(institution => institution.id === config.createdBy)
    );
    
    console.log(`   - Admin-created configs: ${adminConfigs.length}`);
    console.log(`   - Institution-created configs: ${institutionConfigs.length}`);
    console.log(`   - Approved configs: ${approvedConfigs.length}`);

    // 2. Test public API logic
    console.log('\n2. Testing Public API Logic...');
    
    const adminUserIds = adminUsers.map(user => user.id);
    
    const publicConfigs = await prisma.designConfig.findMany({
      where: {
        OR: [
          // Admin-created designs (only from active admins)
          { createdBy: { in: adminUserIds } },
          // Admin-approved designs from all users (including institution users)
          { 
            isApproved: true, 
            approvalStatus: 'APPROVED',
            isActive: true
          }
        ]
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    console.log(`   Public API would return: ${publicConfigs.length} configs`);
    
    // 3. Simulate what unauthenticated users would see
    console.log('\n3. Simulating Unauthenticated User Access...');
    
    const promotionalItems = [
      { id: 'institution-1', type: 'institution' },
      { id: 'course-1', type: 'course' },
      { id: 'third-party-1', type: 'third-party' }
    ];
    
    console.log('   Promotional items that should have designs:');
    promotionalItems.forEach(item => {
      const matchingConfigs = publicConfigs.filter(config => {
        const configName = config.name || '';
        return configName.includes(item.type) || configName.includes(item.id);
      });
      
      console.log(`   - ${item.id} (${item.type}): ${matchingConfigs.length} designs available`);
      
      if (matchingConfigs.length > 0) {
        const latestConfig = matchingConfigs.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        const createdByAdmin = adminUserIds.includes(latestConfig.createdBy || '');
        const isApproved = latestConfig.isApproved && latestConfig.approvalStatus === 'APPROVED';
        
        console.log(`     Latest design: "${latestConfig.name}" (${latestConfig.backgroundType} background)`);
        console.log(`     Created by: ${createdByAdmin ? 'Admin' : 'Institution User'} (${latestConfig.createdBy})`);
        console.log(`     Approval: ${isApproved ? 'Approved' : 'Not Approved'}`);
        console.log(`     Colors: Title=${latestConfig.titleColor}, Description=${latestConfig.descriptionColor}`);
      }
    });

    // 4. Test API endpoint simulation
    console.log('\n4. Testing API Endpoint Simulation...');
    
    // Simulate the public API response
    const apiResponse = {
      configs: publicConfigs.map(config => ({
        id: config.id,
        name: config.name,
        titleColor: config.titleColor,
        descriptionColor: config.descriptionColor,
        backgroundType: config.backgroundType,
        createdBy: config.createdBy,
        isActive: config.isActive,
        isDefault: config.isDefault,
        isApproved: config.isApproved,
        approvalStatus: config.approvalStatus,
        approvedBy: config.approvedBy,
        createdAt: config.createdAt
      }))
    };
    
    console.log(`   API Response would contain: ${apiResponse.configs.length} configs`);
    
    // 5. Test frontend processing simulation
    console.log('\n5. Testing Frontend Processing Simulation...');
    
    const configsByName: { [key: string]: any[] } = {};
    
    apiResponse.configs.forEach((config: any) => {
      const configKey = config.name || config.id;
      if (!configsByName[configKey]) {
        configsByName[configKey] = [];
      }
      configsByName[configKey].push(config);
    });
    
    const processedConfigs: { [key: string]: any } = {};
    
    Object.keys(configsByName).forEach(configKey => {
      const configs = configsByName[configKey];
      const mostRecentConfig = configs.reduce((latest, current) => 
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
      );
      
      // Map configs to promotional item IDs based on name patterns
      let itemId = configKey;
      
      if (configKey.includes('institution-')) {
        itemId = 'institution-1';
      } else if (configKey.includes('course-')) {
        itemId = 'course-1';
      } else if (configKey.includes('third-party-')) {
        itemId = 'third-party-1';
      }
      
      processedConfigs[itemId] = mostRecentConfig;
    });
    
    console.log('   Frontend would process configs for items:');
    Object.keys(processedConfigs).forEach(itemId => {
      const config = processedConfigs[itemId];
      const createdByAdmin = adminUserIds.includes(config.createdBy || '');
      const isApproved = config.isApproved && config.approvalStatus === 'APPROVED';
      
      console.log(`   - ${itemId}: "${config.name}" (${config.backgroundType})`);
      console.log(`     Source: ${createdByAdmin ? 'Admin' : 'Institution User'}`);
      console.log(`     Status: ${isApproved ? 'Approved' : 'Not Approved'}`);
    });

    // 6. Final verification
    console.log('\n6. Final Verification...');
    
    const hasInstitutionDesign = processedConfigs['institution-1'];
    const hasCourseDesign = processedConfigs['course-1'];
    const hasThirdPartyDesign = processedConfigs['third-party-1'];
    
    console.log(`   Institution designs available: ${hasInstitutionDesign ? '✅' : '❌'}`);
    console.log(`   Course designs available: ${hasCourseDesign ? '✅' : '❌'}`);
    console.log(`   Third-party designs available: ${hasThirdPartyDesign ? '✅' : '❌'}`);
    
    const totalAvailable = [hasInstitutionDesign, hasCourseDesign, hasThirdPartyDesign].filter(Boolean).length;
    
    if (totalAvailable > 0) {
      console.log(`\n   ✅ SUCCESS: ${totalAvailable}/3 promotional item types have designs available for unauthenticated users!`);
      console.log('   🎉 Admin-created and admin-approved designs are now accessible to all site users!');
      
      // Show breakdown of design sources
      const adminCreatedCount = publicConfigs.filter(config => 
        adminUserIds.includes(config.createdBy || '')
      ).length;
      
      const approvedCount = publicConfigs.filter(config => 
        config.isApproved && config.approvalStatus === 'APPROVED'
      ).length;
      
      console.log(`   📊 Design Sources:`);
      console.log(`      - Admin-created: ${adminCreatedCount} designs`);
      console.log(`      - Admin-approved: ${approvedCount} designs`);
    } else {
      console.log('\n   ⚠️  No designs are available for promotional items');
      console.log('   💡 Admins should create designs or approve institution designs to make them visible to all users');
    }

  } catch (error) {
    console.error('❌ Error testing public design access:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPublicDesignAccess();
