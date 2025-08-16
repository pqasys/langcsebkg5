import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateOpacityDefaults() {
  console.log('🎨 Checking current opacity settings for all design configurations...\n');

  try {
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

    console.log('📋 Current design configurations:');
    allConfigs.forEach(config => {
      console.log(`   ${config.itemId}: ${config.backgroundType} (opacity: ${config.backgroundOpacity || 'not set'}%)`);
      if (config.backgroundType === 'gradient') {
        console.log(`     Gradient: ${config.backgroundGradientFrom} → ${config.backgroundGradientTo}`);
      }
    });

    console.log('\n💡 You can now adjust opacity using the sliders in the Design Toolkit for both solid colors and gradients.');
    console.log('🎨 The opacity sliders are now available for:');
    console.log('   - Solid color backgrounds');
    console.log('   - Gradient backgrounds');
    console.log('   - Image backgrounds (already existed)');

  } catch (error) {
    console.error('❌ Error checking opacity settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateOpacityDefaults();
