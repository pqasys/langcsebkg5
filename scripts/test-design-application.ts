import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDesignApplication() {
  console.log('🧪 Testing Design Configuration Application\n');

  try {
    // Get the current design configurations
    const designs = await prisma.designConfig.findMany({
      where: {
        itemId: { in: ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'] }
      }
    });

    console.log('📋 Current Design Configurations:');
    designs.forEach(design => {
      console.log(`\n🎨 ${design.name} (${design.itemId}):`);
      console.log(`   Background Type: ${design.backgroundType}`);
      console.log(`   Gradient: ${design.backgroundGradientFrom} → ${design.backgroundGradientTo} (${design.backgroundGradientDirection})`);
      console.log(`   Background Opacity: ${design.backgroundOpacity}%`);
      console.log(`   Title Color: ${design.titleColor}`);
      console.log(`   Title Size: ${design.titleSize}px`);
      console.log(`   Title Weight: ${design.titleWeight}`);
      console.log(`   Description Color: ${design.descriptionColor}`);
      console.log(`   Description Size: ${design.descriptionSize}px`);
    });

    // Simulate the transformDatabaseConfig function
    console.log('\n🔄 Simulating Frontend Transformation:');
    designs.forEach(design => {
      const transformedConfig = {
        backgroundType: design.backgroundType || 'solid',
        backgroundColor: design.backgroundColor || '#ffffff',
        backgroundGradient: {
          from: design.backgroundGradientFrom || '#667eea',
          to: design.backgroundGradientTo || '#764ba2',
          direction: design.backgroundGradientDirection || 'to-r'
        },
        backgroundOpacity: design.backgroundOpacity || 100,
        titleColor: design.titleColor || '#1f2937',
        titleSize: design.titleSize || 24,
        titleWeight: design.titleWeight || 'bold',
        descriptionColor: design.descriptionColor || '#6b7280',
        descriptionSize: design.descriptionSize || 16
      };

      console.log(`\n✨ Transformed ${design.itemId}:`);
      console.log(`   Background: ${transformedConfig.backgroundType}`);
      console.log(`   Gradient: ${transformedConfig.backgroundGradient.from} → ${transformedConfig.backgroundGradient.to} (${transformedConfig.backgroundGradient.direction})`);
      console.log(`   Opacity: ${transformedConfig.backgroundOpacity}%`);
      console.log(`   Title: ${transformedConfig.titleSize}px ${transformedConfig.titleWeight} ${transformedConfig.titleColor}`);
      console.log(`   Description: ${transformedConfig.descriptionSize}px ${transformedConfig.descriptionColor}`);
    });

    // Simulate the CSS that would be generated
    console.log('\n🎨 Simulated CSS Output:');
    designs.forEach(design => {
      const gradientFrom = design.backgroundGradientFrom;
      const gradientTo = design.backgroundGradientTo;
      const gradientDirection = design.backgroundGradientDirection || 'to-r';
      const opacity = design.backgroundOpacity / 100;
      
      console.log(`\n📝 ${design.itemId} CSS:`);
      console.log(`   .banner-background {`);
      console.log(`     background: linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo});`);
      console.log(`     opacity: ${opacity};`);
      console.log(`   }`);
      console.log(`   .banner-title {`);
      console.log(`     color: ${design.titleColor};`);
      console.log(`     font-size: ${design.titleSize}px;`);
      console.log(`     font-weight: ${design.titleWeight};`);
      console.log(`   }`);
      console.log(`   .banner-description {`);
      console.log(`     color: ${design.descriptionColor};`);
      console.log(`     font-size: ${design.descriptionSize}px;`);
      console.log(`   }`);
    });

    // Verify the original AdvertisingBanner styling
    console.log('\n🎯 Original AdvertisingBanner Reference:');
    console.log('   Premium Course Banner:');
    console.log('     - Gradient: linear-gradient(to-r, #8b5cf6, #ec4899)');
    console.log('     - Opacity: 0.1 (10%)');
    console.log('     - Title: 20px bold #111827');
    console.log('     - Description: 14px #4b5563');
    console.log('');
    console.log('   Featured Institution Banner:');
    console.log('     - Gradient: linear-gradient(to-r, #f97316, #ef4444)');
    console.log('     - Opacity: 0.1 (10%)');
    console.log('     - Title: 20px bold #111827');
    console.log('     - Description: 14px #4b5563');
    console.log('');
    console.log('   Promotional Banner:');
    console.log('     - Gradient: linear-gradient(to-r, #10b981, #059669)');
    console.log('     - Opacity: 0.1 (10%)');
    console.log('     - Title: 20px bold #111827');
    console.log('     - Description: 14px #4b5563');

    // Check if the designs match the original
    console.log('\n✅ Verification Results:');
    const premiumDesign = designs.find(d => d.itemId === 'premium-course-banner');
    const featuredDesign = designs.find(d => d.itemId === 'featured-institution-banner');
    const promotionalDesign = designs.find(d => d.itemId === 'promotional-banner');

    if (premiumDesign) {
      const matches = 
        premiumDesign.backgroundGradientFrom === '#8b5cf6' &&
        premiumDesign.backgroundGradientTo === '#ec4899' &&
        premiumDesign.backgroundOpacity === 10 &&
        premiumDesign.titleColor === '#111827' &&
        premiumDesign.titleSize === 20 &&
        premiumDesign.descriptionColor === '#4b5563' &&
        premiumDesign.descriptionSize === 14;
      
      console.log(`   Premium Course Banner: ${matches ? '✅ MATCHES' : '❌ DOES NOT MATCH'}`);
    }

    if (featuredDesign) {
      const matches = 
        featuredDesign.backgroundGradientFrom === '#f97316' &&
        featuredDesign.backgroundGradientTo === '#ef4444' &&
        featuredDesign.backgroundOpacity === 10 &&
        featuredDesign.titleColor === '#111827' &&
        featuredDesign.titleSize === 20 &&
        featuredDesign.descriptionColor === '#4b5563' &&
        featuredDesign.descriptionSize === 14;
      
      console.log(`   Featured Institution Banner: ${matches ? '✅ MATCHES' : '❌ DOES NOT MATCH'}`);
    }

    if (promotionalDesign) {
      const matches = 
        promotionalDesign.backgroundGradientFrom === '#10b981' &&
        promotionalDesign.backgroundGradientTo === '#059669' &&
        promotionalDesign.backgroundOpacity === 10 &&
        promotionalDesign.titleColor === '#111827' &&
        promotionalDesign.titleSize === 20 &&
        promotionalDesign.descriptionColor === '#4b5563' &&
        promotionalDesign.descriptionSize === 14;
      
      console.log(`   Promotional Banner: ${matches ? '✅ MATCHES' : '❌ DOES NOT MATCH'}`);
    }

  } catch (error) {
    console.error('❌ Error testing design application:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDesignApplication();
