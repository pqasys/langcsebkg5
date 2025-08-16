import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCoursesPageDesigns() {
  console.log('🎨 Creating Default Design Configurations for Courses Page\n');

  try {
    // 1. Get active admin user
    console.log('1. Getting Active Admin User...');
    
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN', status: 'ACTIVE' },
      select: { id: true, email: true, name: true }
    });
    
    console.log(`   Found ${adminUsers.length} admin users`);
    
    if (adminUsers.length === 0) {
      console.log('   ❌ No admin users found - cannot create designs');
      return;
    }
    
    const adminUser = adminUsers[0];

    // 2. Create design configurations for courses page banners
    console.log('\n2. Creating Design Configurations...');
    
    const designConfigs = [
      {
        name: 'Premium Course Banner Design',
        description: 'Default design for premium course advertising banner on courses page',
        itemId: 'premium-course-banner',
        backgroundType: 'gradient',
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#8b5cf6',
        backgroundGradientTo: '#ec4899',
        backgroundGradientDirection: 'to-r',
        backgroundImage: '',
        backgroundPattern: 'none',
        backgroundOpacity: 10,
        titleFont: 'inter',
        titleSize: 20,
        titleWeight: 'bold',
        titleColor: '#111827',
        titleAlignment: JSON.stringify({
          horizontal: 'left',
          vertical: 'top',
          padding: { top: 0, bottom: 8, left: 0, right: 0 }
        }),
        titleShadow: false,
        titleShadowColor: '#000000',
        descriptionFont: 'inter',
        descriptionSize: 14,
        descriptionColor: '#4b5563',
        descriptionAlignment: JSON.stringify({
          horizontal: 'left',
          vertical: 'top',
          padding: { top: 8, bottom: 16, left: 0, right: 0 }
        }),
        padding: 24,
        borderRadius: 8,
        borderWidth: 0,
        borderColor: 'transparent',
        borderStyle: 'solid',
        shadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10,
        shadowOffset: 4,
        hoverEffect: 'none',
        animationDuration: 300,
        isActive: true,
        isDefault: true,
        createdBy: adminUser.id,
        isApproved: true,
        approvedBy: adminUser.id,
        approvedAt: new Date(),
        approvalStatus: 'APPROVED',
        approvalNotes: 'Default premium course banner design matching original'
      },
      {
        name: 'Featured Institution Banner Design',
        description: 'Default design for featured institution advertising banner on courses page',
        itemId: 'featured-institution-banner',
        backgroundType: 'gradient',
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#f97316',
        backgroundGradientTo: '#ef4444',
        backgroundGradientDirection: 'to-r',
        backgroundImage: '',
        backgroundPattern: 'none',
        backgroundOpacity: 10,
        titleFont: 'inter',
        titleSize: 20,
        titleWeight: 'bold',
        titleColor: '#111827',
        titleAlignment: JSON.stringify({
          horizontal: 'left',
          vertical: 'top',
          padding: { top: 0, bottom: 8, left: 0, right: 0 }
        }),
        titleShadow: false,
        titleShadowColor: '#000000',
        descriptionFont: 'inter',
        descriptionSize: 14,
        descriptionColor: '#4b5563',
        descriptionAlignment: JSON.stringify({
          horizontal: 'left',
          vertical: 'top',
          padding: { top: 8, bottom: 16, left: 0, right: 0 }
        }),
        padding: 24,
        borderRadius: 8,
        borderWidth: 0,
        borderColor: 'transparent',
        borderStyle: 'solid',
        shadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10,
        shadowOffset: 4,
        hoverEffect: 'none',
        animationDuration: 300,
        isActive: true,
        isDefault: true,
        createdBy: adminUser.id,
        isApproved: true,
        approvedBy: adminUser.id,
        approvedAt: new Date(),
        approvalStatus: 'APPROVED',
        approvalNotes: 'Default featured institution banner design matching original'
      },
      {
        name: 'Promotional Banner Design',
        description: 'Default design for promotional advertising banner on courses page',
        itemId: 'promotional-banner',
        backgroundType: 'gradient',
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#10b981',
        backgroundGradientTo: '#059669',
        backgroundGradientDirection: 'to-r',
        backgroundImage: '',
        backgroundPattern: 'none',
        backgroundOpacity: 10,
        titleFont: 'inter',
        titleSize: 20,
        titleWeight: 'bold',
        titleColor: '#111827',
        titleAlignment: JSON.stringify({
          horizontal: 'left',
          vertical: 'top',
          padding: { top: 0, bottom: 8, left: 0, right: 0 }
        }),
        titleShadow: false,
        titleShadowColor: '#000000',
        descriptionFont: 'inter',
        descriptionSize: 14,
        descriptionColor: '#4b5563',
        descriptionAlignment: JSON.stringify({
          horizontal: 'left',
          vertical: 'top',
          padding: { top: 8, bottom: 16, left: 0, right: 0 }
        }),
        padding: 24,
        borderRadius: 8,
        borderWidth: 0,
        borderColor: 'transparent',
        borderStyle: 'solid',
        shadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10,
        shadowOffset: 4,
        hoverEffect: 'none',
        animationDuration: 300,
        isActive: true,
        isDefault: true,
        createdBy: adminUser.id,
        isApproved: true,
        approvedBy: adminUser.id,
        approvedAt: new Date(),
        approvalStatus: 'APPROVED',
        approvalNotes: 'Default promotional banner design matching original'
      }
    ];
    
    const createdDesigns = [];
    
    for (const designData of designConfigs) {
      try {
        // Check if design already exists
        const existingDesign = await prisma.designConfig.findFirst({
          where: {
            itemId: designData.itemId,
            isDefault: true
          }
        });
        
        if (existingDesign) {
          console.log(`   ⚠️  Design already exists for ${designData.itemId}, skipping...`);
          continue;
        }
        
        const design = await prisma.designConfig.create({
          data: designData
        });
        
        createdDesigns.push(design);
        console.log(`   ✅ Created: "${design.name}" (ID: ${design.id})`);
        console.log(`      Item ID: ${design.itemId}`);
        console.log(`      Type: ${design.backgroundType} background`);
        console.log(`      Colors: Title=${design.titleColor}, Description=${design.descriptionColor}`);
      } catch (error) {
        console.error(`   ❌ Failed to create design "${designData.name}":`, error);
      }
    }

    // 3. Verify the designs are now available
    console.log('\n3. Verifying Design Availability...');
    
    const allDesigns = await prisma.designConfig.findMany({
      where: {
        itemId: { in: ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'] }
      }
    });
    
    console.log(`   Total designs for courses page: ${allDesigns.length}`);
    
    const premiumCount = allDesigns.filter(d => d.itemId === 'premium-course-banner').length;
    const institutionCount = allDesigns.filter(d => d.itemId === 'featured-institution-banner').length;
    const promotionalCount = allDesigns.filter(d => d.itemId === 'promotional-banner').length;
    
    console.log(`   - Premium Course Banner: ${premiumCount} designs`);
    console.log(`   - Featured Institution Banner: ${institutionCount} designs`);
    console.log(`   - Promotional Banner: ${promotionalCount} designs`);

    // 4. Final verification
    console.log('\n4. Final Verification...');
    
    if (createdDesigns.length > 0) {
      console.log('   ✅ SUCCESS: Created default design configurations!');
      console.log('   🎨 These designs are now available for the courses page banners');
      console.log('   🔧 Admins and institution staff can customize these designs using the Design Toolkit');
      console.log('   🌐 All users (including unauthenticated) will see these designs');
    } else {
      console.log('   ⚠️  No new designs were created (they may already exist)');
    }

    console.log('\n📋 Summary:');
    console.log('   - Premium Course Banner: Purple gradient (original design)');
    console.log('   - Featured Institution Banner: Orange gradient (original design)');
    console.log('   - Promotional Banner: Green gradient (original design)');
    console.log('   - All designs match the original AdvertisingBanner styling');
    console.log('   - All designs are approved and active');
    console.log('   - All designs are publicly accessible');

  } catch (error) {
    console.error('❌ Error creating courses page designs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createCoursesPageDesigns();
