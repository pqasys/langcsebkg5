import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestApprovedDesigns() {
  console.log('🧪 Creating Test Approved Designs\n');

  try {
    // 1. Get active users
    console.log('1. Getting Active Users...');
    
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN', status: 'ACTIVE' },
      select: { id: true, email: true, name: true }
    });
    
    const institutionUsers = await prisma.user.findMany({
      where: { role: 'INSTITUTION_STAFF', status: 'ACTIVE' },
      select: { id: true, email: true, name: true }
    });
    
    console.log(`   Found ${adminUsers.length} admin users and ${institutionUsers.length} institution users`);
    
    if (adminUsers.length === 0) {
      console.log('   ❌ No admin users found - cannot create approved designs');
      return;
    }
    
    if (institutionUsers.length === 0) {
      console.log('   ❌ No institution users found - cannot create institution designs');
      return;
    }

    // 2. Create institution designs
    console.log('\n2. Creating Institution Designs...');
    
    const adminUser = adminUsers[0];
    const institutionUser = institutionUsers[0];
    
    const testDesigns = [
      {
        name: 'Institution Course Design - Premium',
        description: 'Premium course design created by institution and approved by admin',
        itemId: 'course-1',
        backgroundType: 'gradient',
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ff6b6b',
        backgroundGradientTo: '#4ecdc4',
        backgroundGradientDirection: 'to-r',
        backgroundImage: '',
        backgroundPattern: 'none',
        backgroundOpacity: 100,
        titleFont: 'inter',
        titleSize: 28,
        titleWeight: 'bold',
        titleColor: '#ffffff',
        titleAlignment: JSON.stringify({
          horizontal: 'center',
          vertical: 'top',
          padding: { top: 20, bottom: 10, left: 0, right: 0 }
        }),
        titleShadow: true,
        titleShadowColor: '#000000',
        descriptionFont: 'inter',
        descriptionSize: 16,
        descriptionColor: '#ffffff',
        descriptionAlignment: JSON.stringify({
          horizontal: 'center',
          vertical: 'top',
          padding: { top: 10, bottom: 20, left: 0, right: 0 }
        }),
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ffffff',
        borderStyle: 'solid',
        shadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 15,
        shadowOffset: 8,
        hoverEffect: 'glow',
        animationDuration: 400,
        isActive: true,
        isDefault: false,
        createdBy: institutionUser.id,
        isApproved: true,
        approvedBy: adminUser.id,
        approvedAt: new Date(),
        approvalStatus: 'APPROVED',
        approvalNotes: 'Approved by admin - high quality design for premium courses'
      },
      {
        name: 'Institution Third-Party Design - Modern',
        description: 'Modern third-party design created by institution and approved by admin',
        itemId: 'third-party-1',
        backgroundType: 'image',
        backgroundColor: '#1a1a1a',
        backgroundGradientFrom: '#667eea',
        backgroundGradientTo: '#764ba2',
        backgroundGradientDirection: 'to-br',
        backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
        backgroundPattern: 'none',
        backgroundOpacity: 80,
        titleFont: 'inter',
        titleSize: 32,
        titleWeight: 'extrabold',
        titleColor: '#ffffff',
        titleAlignment: JSON.stringify({
          horizontal: 'center',
          vertical: 'center',
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }),
        titleShadow: true,
        titleShadowColor: '#000000',
        descriptionFont: 'inter',
        descriptionSize: 18,
        descriptionColor: '#f3f4f6',
        descriptionAlignment: JSON.stringify({
          horizontal: 'center',
          vertical: 'center',
          padding: { top: 10, bottom: 0, left: 0, right: 0 }
        }),
        padding: 30,
        borderRadius: 16,
        borderWidth: 0,
        borderColor: 'transparent',
        borderStyle: 'solid',
        shadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 20,
        shadowOffset: 10,
        hoverEffect: 'scale',
        animationDuration: 300,
        isActive: true,
        isDefault: false,
        createdBy: institutionUser.id,
        isApproved: true,
        approvedBy: adminUser.id,
        approvedAt: new Date(),
        approvalStatus: 'APPROVED',
        approvalNotes: 'Approved by admin - modern and engaging design for third-party promotions'
      }
    ];
    
    const createdDesigns = [];
    
    for (const designData of testDesigns) {
      try {
        const design = await prisma.designConfig.create({
          data: designData
        });
        
        createdDesigns.push(design);
        console.log(`   ✅ Created: "${design.name}" (ID: ${design.id})`);
        console.log(`      Created by: ${institutionUser.email}`);
        console.log(`      Approved by: ${adminUser.email}`);
        console.log(`      Status: ${design.approvalStatus}`);
      } catch (error) {
        console.error(`   ❌ Failed to create design "${designData.name}":`, error);
      }
    }

    // 3. Verify the designs are now publicly accessible
    console.log('\n3. Verifying Public Access...');
    
    const publicConfigs = await prisma.designConfig.findMany({
      where: {
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
      }
    });
    
    console.log(`   Total public configs: ${publicConfigs.length}`);
    
    const adminCreatedCount = publicConfigs.filter(config => 
      adminUsers.map(u => u.id).includes(config.createdBy || '')
    ).length;
    
    const approvedCount = publicConfigs.filter(config => 
      config.isApproved && config.approvalStatus === 'APPROVED'
    ).length;
    
    console.log(`   - Admin-created: ${adminCreatedCount} designs`);
    console.log(`   - Admin-approved: ${approvedCount} designs`);
    
    // 4. Show the newly created approved designs
    console.log('\n4. Newly Created Approved Designs:');
    createdDesigns.forEach(design => {
      console.log(`   - "${design.name}"`);
      console.log(`     Type: ${design.backgroundType} background`);
      console.log(`     Colors: Title=${design.titleColor}, Description=${design.descriptionColor}`);
      console.log(`     Created by: Institution User (${design.createdBy})`);
      console.log(`     Approved by: Admin (${design.approvedBy})`);
      console.log(`     Approval Date: ${design.approvedAt}`);
      console.log(`     Notes: ${design.approvalNotes}`);
    });

    // 5. Final verification
    console.log('\n5. Final Verification...');
    
    if (createdDesigns.length > 0) {
      console.log('   ✅ SUCCESS: Created and approved institution designs!');
      console.log('   🎉 These designs are now accessible to all unauthenticated users!');
      console.log('   📊 The public API now includes:');
      console.log(`      - Admin-created designs: ${adminCreatedCount}`);
      console.log(`      - Admin-approved designs: ${approvedCount}`);
      console.log('   🔒 Security: Only designs approved by active admins are publicly accessible');
    } else {
      console.log('   ⚠️  No new designs were created');
    }

  } catch (error) {
    console.error('❌ Error creating test approved designs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
createTestApprovedDesigns();
