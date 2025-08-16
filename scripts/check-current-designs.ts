import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCurrentDesigns() {
  console.log('🔍 Checking Current Design Configurations in Database\n');

  try {
    const designs = await prisma.designConfig.findMany({
      where: {
        itemId: { in: ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'] }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${designs.length} design configurations:\n`);

    designs.forEach(design => {
      console.log(`📋 ${design.name} (${design.itemId})`);
      console.log(`   ID: ${design.id}`);
      console.log(`   Background Type: ${design.backgroundType}`);
      console.log(`   Background Color: ${design.backgroundColor}`);
      console.log(`   Gradient From: ${design.backgroundGradientFrom}`);
      console.log(`   Gradient To: ${design.backgroundGradientTo}`);
      console.log(`   Gradient Direction: ${design.backgroundGradientDirection}`);
      console.log(`   Background Opacity: ${design.backgroundOpacity}%`);
      console.log(`   Title Color: ${design.titleColor}`);
      console.log(`   Title Size: ${design.titleSize}px`);
      console.log(`   Title Weight: ${design.titleWeight}`);
      console.log(`   Description Color: ${design.descriptionColor}`);
      console.log(`   Description Size: ${design.descriptionSize}px`);
      console.log(`   Padding: ${design.padding}px`);
      console.log(`   Border Radius: ${design.borderRadius}px`);
      console.log(`   Shadow: ${design.shadow ? 'Yes' : 'No'}`);
      console.log(`   Shadow Blur: ${design.shadowBlur}px`);
      console.log(`   Shadow Offset: ${design.shadowOffset}px`);
      console.log(`   Is Active: ${design.isActive}`);
      console.log(`   Is Default: ${design.isDefault}`);
      console.log(`   Is Approved: ${design.isApproved}`);
      console.log(`   Approval Status: ${design.approvalStatus}`);
      console.log(`   Created At: ${design.createdAt}`);
      console.log(`   Updated At: ${design.updatedAt}`);
      console.log('');
    });

    // Check what the original AdvertisingBanner should look like
    console.log('🎨 Original AdvertisingBanner Styling Reference:');
    console.log('   Premium Course Banner:');
    console.log('     - Gradient: from-purple-500 to-pink-500 (#8b5cf6 to #ec4899)');
    console.log('     - Text: Dark gray (#111827)');
    console.log('     - Background opacity: 10%');
    console.log('');
    console.log('   Featured Institution Banner:');
    console.log('     - Gradient: from-orange-500 to-red-500 (#f97316 to #ef4444)');
    console.log('     - Text: Dark gray (#111827)');
    console.log('     - Background opacity: 10%');
    console.log('');
    console.log('   Promotional Banner:');
    console.log('     - Gradient: from-green-500 to-emerald-500 (#10b981 to #059669)');
    console.log('     - Text: Dark gray (#111827)');
    console.log('     - Background opacity: 10%');

  } catch (error) {
    console.error('❌ Error checking designs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkCurrentDesigns();
