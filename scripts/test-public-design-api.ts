import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPublicDesignAPI() {
  console.log('🧪 Testing Public Design Configs API\n');

  try {
    // 1. Check if there are any admin users
    console.log('1. Checking Admin Users...');
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        status: 'ACTIVE'
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    console.log(`   Found ${adminUsers.length} active admin users:`);
    adminUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });

    // 2. Check existing design configs
    console.log('\n2. Checking Existing Design Configs...');
    const allDesignConfigs = await prisma.designConfig.findMany();

    console.log(`   Found ${allDesignConfigs.length} total design configs:`);
    
    const adminConfigs = allDesignConfigs.filter(config => 
      adminUsers.some(admin => admin.id === config.createdBy)
    );
    
    const approvedConfigs = allDesignConfigs.filter(config => 
      config.isActive === true
    );

    console.log(`   - Admin-created configs: ${adminConfigs.length}`);
    console.log(`   - Active configs: ${approvedConfigs.length}`);

    // 3. Test what the public API should return
    console.log('\n3. Testing Public API Logic...');
    
    const adminUserIds = adminUsers.map(user => user.id);
    
    const publicConfigs = await prisma.designConfig.findMany({
      where: {
        OR: [
          // Admin-created designs (only from active admins)
          { createdBy: { in: adminUserIds } },
          // Active designs (for public access)
          { isActive: true }
        ]
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    console.log(`   Public API would return ${publicConfigs.length} configs:`);
    
    publicConfigs.forEach(config => {
      const createdByAdmin = adminUserIds.includes(config.createdBy || '');
      console.log(`   - Item: ${config.name || 'Unnamed'}`);
      console.log(`     Created by: ${createdByAdmin ? 'Admin' : 'User'} (${config.createdBy})`);
      console.log(`     Active: ${config.isActive}`);
      console.log(`     Default: ${config.isDefault}`);
    });

    // 4. Create a test admin design if none exist
    if (publicConfigs.length === 0 && adminUsers.length > 0) {
      console.log('\n4. Creating Test Admin Design...');
      
      const testConfig = await prisma.designConfig.create({
        data: {
          name: 'Test Admin Design',
          description: 'Test design created by admin for public access',
          backgroundType: 'gradient',
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#667eea',
          backgroundGradientTo: '#764ba2',
          backgroundGradientDirection: 'to-r',
          backgroundImage: '',
          backgroundPattern: 'none',
          backgroundOpacity: 100,
          titleFont: 'inter',
          titleSize: 24,
          titleWeight: 'bold',
          titleColor: '#1f2937',
          titleAlignment: 'left',
          titleShadow: false,
          titleShadowColor: '#000000',
          descriptionFont: 'inter',
          descriptionSize: 16,
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
          isActive: true,
          isDefault: true,
          createdBy: adminUsers[0].id
        }
      });

      console.log(`   ✅ Created test admin design: ${testConfig.id}`);
    }

    // 5. Final verification
    console.log('\n5. Final Verification...');
    const finalPublicConfigs = await prisma.designConfig.findMany({
      where: {
        OR: [
          { createdBy: { in: adminUserIds } },
          { isActive: true }
        ]
      }
    });

    console.log(`   Final public configs count: ${finalPublicConfigs.length}`);
    
    if (finalPublicConfigs.length > 0) {
      console.log('   ✅ Public API is ready to serve admin designs to unauthenticated users!');
    } else {
      console.log('   ⚠️  No public designs available - admins need to create some designs');
    }

  } catch (error) {
    console.error('❌ Error testing public design API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPublicDesignAPI();
