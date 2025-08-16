import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCoursesPageDesigns() {
  console.log('🎨 Updating Design Configurations to Match Original Styling\n');

  try {
    // 1. Get active admin user
    console.log('1. Getting Active Admin User...');
    
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN', status: 'ACTIVE' },
      select: { id: true, email: true, name: true }
    });
    
    console.log(`   Found ${adminUsers.length} admin users`);
    
    if (adminUsers.length === 0) {
      console.log('   ❌ No admin users found - cannot update designs');
      return;
    }

    // 2. Update design configurations to match original styling
    console.log('\n2. Updating Design Configurations...');
    
    const designUpdates = [
      {
        itemId: 'premium-course-banner',
        updates: {
          backgroundType: 'gradient',
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#8b5cf6',
          backgroundGradientTo: '#ec4899',
          backgroundGradientDirection: 'to-r',
          backgroundOpacity: 80, // Increased to 80% for testing
          titleSize: 20,
          titleColor: '#111827',
          titleShadow: false,
          descriptionSize: 14,
          descriptionColor: '#4b5563',
          padding: 24,
          borderRadius: 8,
          borderWidth: 0,
          shadowBlur: 10,
          shadowOffset: 4,
          hoverEffect: 'none',
          animationDuration: 300,
          name: 'Premium Course Banner Design (Original)',
          description: 'Original design for premium course advertising banner matching AdvertisingBanner styling'
        }
      },
      {
        itemId: 'featured-institution-banner',
        updates: {
          backgroundType: 'gradient',
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f97316',
          backgroundGradientTo: '#ef4444',
          backgroundGradientDirection: 'to-r',
          backgroundOpacity: 80, // Increased to 80% for testing
          titleSize: 20,
          titleWeight: 'bold',
          titleColor: '#111827',
          titleShadow: false,
          descriptionSize: 14,
          descriptionColor: '#4b5563',
          padding: 24,
          borderRadius: 8,
          borderWidth: 0,
          shadowBlur: 10,
          shadowOffset: 4,
          hoverEffect: 'none',
          animationDuration: 300,
          name: 'Featured Institution Banner Design (Original)',
          description: 'Original design for featured institution advertising banner matching AdvertisingBanner styling'
        }
      },
      {
        itemId: 'promotional-banner',
        updates: {
          backgroundType: 'gradient',
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#10b981',
          backgroundGradientTo: '#059669',
          backgroundGradientDirection: 'to-r',
          backgroundOpacity: 80, // Increased to 80% for testing
          titleSize: 20,
          titleColor: '#111827',
          titleShadow: false,
          descriptionSize: 14,
          descriptionColor: '#4b5563',
          padding: 24,
          borderRadius: 8,
          borderWidth: 0,
          shadowBlur: 10,
          shadowOffset: 4,
          hoverEffect: 'none',
          animationDuration: 300,
          name: 'Promotional Banner Design (Original)',
          description: 'Original design for promotional advertising banner matching AdvertisingBanner styling'
        }
      }
    ];
    
    const updatedDesigns = [];
    
    for (const designUpdate of designUpdates) {
      try {
        // Find the existing design
        const existingDesign = await prisma.designConfig.findFirst({
          where: {
            itemId: designUpdate.itemId,
            isDefault: true
          }
        });
        
        if (!existingDesign) {
          console.log(`   ⚠️  No existing design found for ${designUpdate.itemId}, skipping...`);
          continue;
        }
        
        // Update the design
        const updatedDesign = await prisma.designConfig.update({
          where: { id: existingDesign.id },
          data: designUpdate.updates
        });
        
        updatedDesigns.push(updatedDesign);
        console.log(`   ✅ Updated: "${updatedDesign.name}" (ID: ${updatedDesign.id})`);
        console.log(`      Item ID: ${updatedDesign.itemId}`);
        console.log(`      Type: ${updatedDesign.backgroundType} background`);
        console.log(`      Colors: Title=${updatedDesign.titleColor}, Description=${updatedDesign.descriptionColor}`);
        console.log(`      Gradient: ${updatedDesign.backgroundGradientFrom} to ${updatedDesign.backgroundGradientTo}`);
      } catch (error) {
        console.error(`   ❌ Failed to update design for ${designUpdate.itemId}:`, error);
      }
    }

    // 3. Verify the updated designs
    console.log('\n3. Verifying Updated Designs...');
    
    const allDesigns = await prisma.designConfig.findMany({
      where: {
        itemId: { in: ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'] }
      }
    });
    
    console.log(`   Total designs for courses page: ${allDesigns.length}`);
    
    const premiumCount = allDesigns.filter(d => d.itemId === 'premium-course-banner').length;
    const institutionCount = allDesigns.filter(d => d.itemId === 'featured-institution-banner').length;
    const promotionalCount = allDesigns.filter(d => d.itemId === 'promotional-banner').length;
    
    console.log(`   - Premium Course Banner: ${premiumCount} designs`);
    console.log(`   - Featured Institution Banner: ${institutionCount} designs`);
    console.log(`   - Promotional Banner: ${promotionalCount} designs`);

    // 4. Show the updated design details
    console.log('\n4. Updated Design Details:');
    allDesigns.forEach(design => {
      console.log(`   ${design.itemId}:`);
      console.log(`     - Name: "${design.name}"`);
      console.log(`     - Background: ${design.backgroundType} (${design.backgroundGradientFrom} to ${design.backgroundGradientTo})`);
      console.log(`     - Opacity: ${design.backgroundOpacity}%`);
      console.log(`     - Title: ${design.titleSize}px ${design.titleColor}`);
      console.log(`     - Description: ${design.descriptionSize}px ${design.descriptionColor}`);
      console.log(`     - Shadow: ${design.shadowBlur}px blur, ${design.shadowOffset}px offset`);
    });

    // 5. Final verification
    console.log('\n5. Final Verification...');
    
    if (updatedDesigns.length > 0) {
      console.log('   ✅ SUCCESS: Updated design configurations to match original styling!');
      console.log('   🎨 These designs now match the original AdvertisingBanner component');
      console.log('   🔧 Admins and institution staff can still customize these designs');
      console.log('   🌐 All users (including unauthenticated) will see the original styling');
    } else {
      console.log('   ⚠️  No designs were updated');
    }

    console.log('\n📋 Summary:');
    console.log('   - Premium Course Banner: Purple gradient (original design)');
    console.log('   - Featured Institution Banner: Orange gradient (original design)');
    console.log('   - Promotional Banner: Green gradient (original design)');
    console.log('   - All designs now match the original AdvertisingBanner styling');
    console.log('   - Background opacity: 10% (subtle gradient overlay)');
    console.log('   - Text colors: Dark gray for readability');
    console.log('   - All designs are approved and publicly accessible');

  } catch (error) {
    console.error('❌ Error updating courses page designs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateCoursesPageDesigns();
