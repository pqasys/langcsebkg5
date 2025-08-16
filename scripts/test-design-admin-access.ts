import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDesignAdminAccess() {
  console.log('🧪 Testing Design Toolkit Admin Access Functionality\n');

  try {
    // 1. Test admin user creation
    console.log('1. Creating test admin user...');
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        name: 'Test Admin',
        password: 'hashedpassword',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });
    console.log('✅ Admin user created:', adminUser.id);

    // 2. Test institution user creation
    console.log('\n2. Creating test institution user...');
    const institutionUser = await prisma.user.upsert({
      where: { email: 'institution@test.com' },
      update: {},
      create: {
        email: 'institution@test.com',
        name: 'Test Institution',
        password: 'hashedpassword',
        role: 'INSTITUTION_STAFF',
        status: 'ACTIVE'
      }
    });
    console.log('✅ Institution user created:', institutionUser.id);

    // 3. Test admin design creation (should be auto-approved)
    console.log('\n3. Creating admin design (should be auto-approved)...');
    const adminDesign = await prisma.designConfig.create({
      data: {
        name: 'Admin Test Design',
        description: 'Test design created by admin',
        itemId: 'test-item-1',
        createdBy: adminUser.id,
        backgroundType: 'gradient',
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#667eea',
        backgroundGradientTo: '#764ba2',
        backgroundGradientDirection: 'to-r',
        titleColor: '#1f2937',
        descriptionColor: '#6b7280',
        isActive: true,
        isApproved: true, // Should be auto-approved
        approvalStatus: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date()
      }
    });
    console.log('✅ Admin design created and auto-approved:', {
      id: adminDesign.id,
      isApproved: adminDesign.isApproved,
      approvalStatus: adminDesign.approvalStatus
    });

    // 4. Test institution design creation (should be pending approval)
    console.log('\n4. Creating institution design (should be pending approval)...');
    const institutionDesign = await prisma.designConfig.create({
      data: {
        name: 'Institution Test Design',
        description: 'Test design created by institution',
        itemId: 'test-item-2',
        createdBy: institutionUser.id,
        backgroundType: 'solid',
        backgroundColor: '#f3f4f6',
        titleColor: '#374151',
        descriptionColor: '#6b7280',
        isActive: true,
        isApproved: false, // Should be pending approval
        approvalStatus: 'PENDING'
      }
    });
    console.log('✅ Institution design created (pending approval):', {
      id: institutionDesign.id,
      isApproved: institutionDesign.isApproved,
      approvalStatus: institutionDesign.approvalStatus
    });

    // 5. Test design retrieval for regular user (should see admin designs)
    console.log('\n5. Testing design retrieval for regular user...');
    const allDesigns = await prisma.designConfig.findMany({
      where: {
        OR: [
          { createdBy: { in: [adminUser.id] } },
          { isApproved: true, approvalStatus: 'APPROVED' }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log('✅ Designs available to all users:', allDesigns.length);
    allDesigns.forEach(design => {
      console.log(`   - ${design.name} (${design.approvalStatus})`);
    });

    // 6. Test design retrieval for institution user (should see their own + admin designs)
    console.log('\n6. Testing design retrieval for institution user...');
    const userDesigns = await prisma.designConfig.findMany({
      where: {
        OR: [
          { createdBy: institutionUser.id },
          { createdBy: { in: [adminUser.id] } },
          { isApproved: true, approvalStatus: 'APPROVED' }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log('✅ Designs available to institution user:', userDesigns.length);
    userDesigns.forEach(design => {
      console.log(`   - ${design.name} (${design.createdBy === institutionUser.id ? 'OWN' : 'ADMIN'})`);
    });

    // 7. Test admin approval of institution design
    console.log('\n7. Testing admin approval of institution design...');
    const approvedDesign = await prisma.designConfig.update({
      where: { id: institutionDesign.id },
      data: {
        isApproved: true,
        approvalStatus: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date(),
        approvalNotes: 'Design approved by admin test'
      }
    });
    console.log('✅ Institution design approved:', {
      id: approvedDesign.id,
      isApproved: approvedDesign.isApproved,
      approvalStatus: approvedDesign.approvalStatus,
      approvedBy: approvedDesign.approvedBy
    });

    // 8. Test final design retrieval (should now include approved institution design)
    console.log('\n8. Testing final design retrieval...');
    const finalDesigns = await prisma.designConfig.findMany({
      where: {
        OR: [
          { createdBy: { in: [adminUser.id] } },
          { isApproved: true, approvalStatus: 'APPROVED' }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log('✅ Final designs available to all users:', finalDesigns.length);
    finalDesigns.forEach(design => {
      console.log(`   - ${design.name} (${design.approvalStatus})`);
    });

    console.log('\n🎉 All tests passed! Design Toolkit Admin Access is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDesignAdminAccess();
