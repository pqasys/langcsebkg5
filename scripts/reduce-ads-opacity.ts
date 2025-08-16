import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reduceAdsOpacity() {
  console.log('🎨 Reducing default opacity for advertising banners...\n');

  try {
    // Update courses page banners to have lower opacity
    const coursesPageBanners = await prisma.designConfig.updateMany({
      where: {
        itemId: {
          in: ['premium-course-banner', 'featured-institution-banner', 'promotional-banner']
        }
      },
      data: {
        backgroundOpacity: 30 // Reduced from 80% to 30%
      }
    });

    console.log(`✅ Updated ${coursesPageBanners.count} courses page banners to 30% opacity`);

    // Update other advertising-related designs to have lower opacity
    const otherAds = await prisma.designConfig.updateMany({
      where: {
        itemId: {
          in: ['course-1', 'institution-1', 'third-party-1']
        }
      },
      data: {
        backgroundOpacity: 25 // Reduced to 25% for other ads
      }
    });

    console.log(`✅ Updated ${otherAds.count} other advertising designs to 25% opacity`);

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

    console.log('\n🎉 Default opacity reduced successfully!');
    console.log('💡 Advertising banners now have more subtle backgrounds:');
    console.log('   - Courses page banners: 30% opacity');
    console.log('   - Other advertising: 25% opacity');
    console.log('   - Users can still adjust opacity using Design Toolkit sliders');

  } catch (error) {
    console.error('❌ Error reducing ads opacity:', error);
  } finally {
    await prisma.$disconnect();
  }
}

reduceAdsOpacity();
