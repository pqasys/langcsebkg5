import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reduceOpacityFurther() {
  console.log('🎨 Reducing opacity further for advertising banners...\n');

  try {
    // Update courses page banners to have even lower opacity
    const coursesPageBanners = await prisma.designConfig.updateMany({
      where: {
        itemId: {
          in: ['premium-course-banner', 'featured-institution-banner', 'promotional-banner']
        }
      },
      data: {
        backgroundOpacity: 15 // Reduced from 30% to 15%
      }
    });

    console.log(`✅ Updated ${coursesPageBanners.count} courses page banners to 15% opacity`);

    // Update other advertising-related designs to have even lower opacity
    const otherAds = await prisma.designConfig.updateMany({
      where: {
        itemId: {
          in: ['course-1', 'institution-1', 'third-party-1']
        }
      },
      data: {
        backgroundOpacity: 12 // Reduced from 25% to 12%
      }
    });

    console.log(`✅ Updated ${otherAds.count} other advertising designs to 12% opacity`);

    // Show current state of all configurations
    const allConfigs = await prisma.designConfig.findMany({
      select: {
        id: true,
        name: true,
        itemId: true,
        backgroundType: true,
        backgroundOpacity: true,
        backgroundGradientFrom: true,
        backgroundGradientTo: true
      },
      orderBy: {
        itemId: 'asc'
      }
    });

    console.log('\n📋 Updated design configurations:');
    allConfigs.forEach(config => {
      console.log(`   ${config.itemId}: ${config.backgroundType} (opacity: ${config.backgroundOpacity}%)`);
      if (config.backgroundType === 'gradient') {
        console.log(`     Gradient: ${config.backgroundGradientFrom} → ${config.backgroundGradientTo}`);
      }
    });

    console.log('\n🎉 Opacity reduced further successfully!');
    console.log('💡 Advertising banners now have very subtle backgrounds:');
    console.log('   - Courses page banners: 15% opacity (very subtle)');
    console.log('   - Other advertising: 12% opacity (extremely subtle)');
    console.log('   - Users can still adjust opacity using Design Toolkit sliders');

  } catch (error) {
    console.error('❌ Error reducing opacity further:', error);
  } finally {
    await prisma.$disconnect();
  }
}

reduceOpacityFurther();
