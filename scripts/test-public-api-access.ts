import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPublicApiAccess() {
  console.log('🌐 Testing Public API Access for Courses Page Banners\n');

  try {
    // 1. Check what the public API should return
    console.log('1. Checking Public API Logic...');
    
    // Get active admin user IDs
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
      console.log(`     - ${user.name} (${user.email})`);
    });

    // 2. Check the courses page banner designs
    console.log('\n2. Checking Courses Page Banner Designs...');
    
    const coursesPageDesigns = await prisma.designConfig.findMany({
      where: {
        itemId: { in: ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'] }
      }
    });

    console.log(`   Found ${coursesPageDesigns.length} designs for courses page:`);
    
    coursesPageDesigns.forEach(design => {
      console.log(`\n   📋 ${design.name} (${design.itemId}):`);
      console.log(`      Created By: ${design.createdBy}`);
      console.log(`      Is Active: ${design.isActive}`);
      console.log(`      Is Default: ${design.isDefault}`);
      console.log(`      Is Approved: ${design.isApproved}`);
      console.log(`      Approval Status: ${design.approvalStatus}`);
      console.log(`      Background: ${design.backgroundType} (${design.backgroundGradientFrom} → ${design.backgroundGradientTo})`);
      console.log(`      Title: ${design.titleSize}px ${design.titleWeight} ${design.titleColor}`);
      console.log(`      Description: ${design.descriptionSize}px ${design.descriptionColor}`);
      
      // Check if this design should be publicly accessible
      const isAdminCreated = adminUsers.some(admin => admin.id === design.createdBy);
      const isApproved = design.isApproved && design.approvalStatus === 'APPROVED' && design.isActive;
      
      console.log(`      Public Access: ${isAdminCreated || isApproved ? '✅ YES' : '❌ NO'}`);
      if (isAdminCreated) {
        console.log(`         Reason: Created by active admin`);
      } else if (isApproved) {
        console.log(`         Reason: Admin-approved and active`);
      } else {
        console.log(`         Reason: Not created by admin and not approved`);
      }
    });

    // 3. Simulate the public API query
    console.log('\n3. Simulating Public API Query...');
    
    const publicWhere = {
      OR: [
        // Admin-created designs (only from active admins)
        { createdBy: { in: adminUsers.map(u => u.id) } },
        // Admin-approved designs from all users (including institution users)
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

    console.log(`   Public API would return ${publicConfigs.length} designs:`);
    
    const coursesPagePublicDesigns = publicConfigs.filter(config => 
      ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'].includes(config.itemId)
    );

    console.log(`   Courses page banners in public API: ${coursesPagePublicDesigns.length}`);
    
    coursesPagePublicDesigns.forEach(design => {
      console.log(`\n   ✅ ${design.name} (${design.itemId}):`);
      console.log(`      Background: ${design.backgroundType} (${design.backgroundGradientFrom} → ${design.backgroundGradientTo})`);
      console.log(`      Title: ${design.titleSize}px ${design.titleWeight} ${design.titleColor}`);
      console.log(`      Description: ${design.descriptionSize}px ${design.descriptionColor}`);
    });

    // 4. Check if any courses page designs are missing from public API
    console.log('\n4. Checking for Missing Designs...');
    
    const missingDesigns = coursesPageDesigns.filter(design => 
      !coursesPagePublicDesigns.some(publicDesign => publicDesign.id === design.id)
    );

    if (missingDesigns.length > 0) {
      console.log(`   ❌ ${missingDesigns.length} designs are missing from public API:`);
      missingDesigns.forEach(design => {
        console.log(`      - ${design.name} (${design.itemId})`);
        console.log(`        Created By: ${design.createdBy}`);
        console.log(`        Is Active: ${design.isActive}`);
        console.log(`        Is Approved: ${design.isApproved}`);
        console.log(`        Approval Status: ${design.approvalStatus}`);
      });
    } else {
      console.log('   ✅ All courses page designs are available in public API');
    }

    // 5. Test actual API call
    console.log('\n5. Testing Actual API Call...');
    
    try {
      const response = await fetch('http://localhost:3000/api/design-configs/public');
      if (response.ok) {
        const data = await response.json();
        const apiDesigns = data.configs.filter((config: any) => 
          ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'].includes(config.itemId)
        );
        
        console.log(`   API returned ${apiDesigns.length} courses page designs:`);
        apiDesigns.forEach((design: any) => {
          console.log(`      - ${design.name} (${design.itemId})`);
        });
      } else {
        console.log(`   ❌ API call failed with status: ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ API call failed: ${error}`);
    }

  } catch (error) {
    console.error('❌ Error testing public API access:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPublicApiAccess();
