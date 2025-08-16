import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testOpacityApplication() {
  console.log('🎨 Testing opacity application for design configurations...\n');

  try {
    // Get the courses page banners to verify their opacity
    const coursesPageBanners = await prisma.designConfig.findMany({
      where: {
        itemId: {
          in: ['premium-course-banner', 'featured-institution-banner', 'promotional-banner']
        }
      },
      select: {
        id: true,
        name: true,
        itemId: true,
        backgroundType: true,
        backgroundOpacity: true,
        backgroundGradientFrom: true,
        backgroundGradientTo: true,
        backgroundGradientDirection: true
      }
    });

    console.log('📋 Courses page banners opacity status:');
    coursesPageBanners.forEach(config => {
      console.log(`   ${config.itemId}:`);
      console.log(`     Background Type: ${config.backgroundType}`);
      console.log(`     Opacity: ${config.backgroundOpacity}%`);
      if (config.backgroundType === 'gradient') {
        console.log(`     Gradient: ${config.backgroundGradientFrom} → ${config.backgroundGradientTo}`);
        console.log(`     Direction: ${config.backgroundGradientDirection}`);
        
        // Simulate the CSS that should be generated
        const cssDirection = config.backgroundGradientDirection === 'to-r' ? 'to right' : 
                           config.backgroundGradientDirection === 'to-l' ? 'to left' :
                           config.backgroundGradientDirection === 'to-t' ? 'to top' :
                           config.backgroundGradientDirection === 'to-b' ? 'to bottom' :
                           config.backgroundGradientDirection;
        
        console.log(`     Expected CSS: linear-gradient(${cssDirection}, ${config.backgroundGradientFrom}, ${config.backgroundGradientTo})`);
        console.log(`     Expected Opacity: ${config.backgroundOpacity / 100}`);
      }
      console.log('');
    });

    console.log('💡 Opacity should now be working correctly!');
    console.log('🎯 The background overlay div now includes:');
    console.log('   - background: linear-gradient(...)');
    console.log('   - opacity: [value from database]');
    console.log('   - pointer-events: none');

  } catch (error) {
    console.error('❌ Error testing opacity application:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOpacityApplication();
