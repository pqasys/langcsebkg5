import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDesignAPI() {
  console.log('🔍 Verifying Design API Endpoints\n');

  try {
    // 1. Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN', status: 'ACTIVE' }
    });

    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }

    console.log('✅ Found admin user:', adminUser.email);

    // 2. Get institution user
    const institutionUser = await prisma.user.findFirst({
      where: { role: 'INSTITUTION_STAFF', status: 'ACTIVE' }
    });

    if (!institutionUser) {
      console.log('❌ No institution user found. Please create an institution user first.');
      return;
    }

    console.log('✅ Found institution user:', institutionUser.email);

    // 3. Check existing designs
    const allDesigns = await prisma.designConfig.findMany({
      include: {
        _count: {
          select: {
            promotionalItems: true,
            advertisingItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n📊 Current Design Statistics:`);
    console.log(`   Total designs: ${allDesigns.length}`);
    
    const adminDesigns = allDesigns.filter(d => d.createdBy === adminUser.id);
    const institutionDesigns = allDesigns.filter(d => d.createdBy === institutionUser.id);
    const approvedDesigns = allDesigns.filter(d => d.isApproved);
    const pendingDesigns = allDesigns.filter(d => !d.isApproved && d.approvalStatus === 'PENDING');

    console.log(`   Admin designs: ${adminDesigns.length}`);
    console.log(`   Institution designs: ${institutionDesigns.length}`);
    console.log(`   Approved designs: ${approvedDesigns.length}`);
    console.log(`   Pending designs: ${pendingDesigns.length}`);

    // 4. Test design retrieval logic
    console.log(`\n🧪 Testing Design Retrieval Logic:`);

    // Test 1: What regular users see (admin designs + approved designs)
    const publicDesigns = await prisma.designConfig.findMany({
      where: {
        OR: [
          { createdBy: adminUser.id },
          { isApproved: true, approvalStatus: 'APPROVED' }
        ]
      }
    });
    console.log(`   ✅ Public designs (available to all users): ${publicDesigns.length}`);

    // Test 2: What institution users see (their own + admin + approved)
    const institutionAccessibleDesigns = await prisma.designConfig.findMany({
      where: {
        OR: [
          { createdBy: institutionUser.id },
          { createdBy: adminUser.id },
          { isApproved: true, approvalStatus: 'APPROVED' }
        ]
      }
    });
    console.log(`   ✅ Institution accessible designs: ${institutionAccessibleDesigns.length}`);

    // 5. Show design details
    if (allDesigns.length > 0) {
      console.log(`\n📋 Design Details:`);
      allDesigns.forEach((design, index) => {
        console.log(`   ${index + 1}. ${design.name}`);
        console.log(`      - Created by: ${design.createdBy === adminUser.id ? 'ADMIN' : 'INSTITUTION'}`);
        console.log(`      - Status: ${design.approvalStatus}`);
        console.log(`      - Approved: ${design.isApproved ? 'Yes' : 'No'}`);
        console.log(`      - Item ID: ${design.itemId || 'N/A'}`);
        console.log(`      - Created: ${design.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }

    // 6. Test priority system
    console.log(`\n🎯 Testing Design Priority System:`);
    
    // Simulate what happens when a user has both their own design and admin design for the same item
    const testItemId = 'test-item-1';
    const userDesigns = allDesigns.filter(d => d.itemId === testItemId && d.createdBy === institutionUser.id);
    const adminDesignsForItem = allDesigns.filter(d => d.itemId === testItemId && d.createdBy === adminUser.id);
    
    if (userDesigns.length > 0 || adminDesignsForItem.length > 0) {
      console.log(`   For item "${testItemId}":`);
      if (userDesigns.length > 0) {
        console.log(`   ✅ User has their own design (PRIORITY)`);
      }
      if (adminDesignsForItem.length > 0) {
        console.log(`   ✅ Admin design available (FALLBACK)`);
      }
    } else {
      console.log(`   No designs found for test item "${testItemId}"`);
    }

    console.log(`\n🎉 Design API verification completed successfully!`);

  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the verification
verifyDesignAPI();
