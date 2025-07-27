import { PrismaClient } from '@prisma/client';
import { notificationService } from '../lib/notification';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function seedNotificationTemplates() {
  try {
    console.log('🌱 Starting notification template seeding...');

    // Check if templates already exist
    const existingTemplates = await prisma.notificationTemplate.findMany({
      select: { name: true }
    });

    if (existingTemplates.length > 0) {
      console.log(`� Found ${existingTemplates.length} existing templates`);
      console.log('Templates:', existingTemplates.map(t => t.name).join(', '));
      
      // Check if we have the required templates
      const requiredTemplates = ['course_enrollment', 'payment_confirmation', 'payment_failed', 'payment_reminder'];
      const missingTemplates = requiredTemplates.filter(name => 
        !existingTemplates.some(t => t.name === name)
      );

      if (missingTemplates.length === 0) {
        console.log('✅ All required notification templates already exist');
        return;
      }

      console.log(`⚠️  Missing templates: ${missingTemplates.join(', ')}`);
    }

    // Create default templates
    const result = await notificationService.createDefaultTemplates('SYSTEM');

    console.log('📊 Seeding Results:');
    console.log(`   Total templates: ${result.total}`);
    console.log(`   Created: ${result.created}`);
    console.log(`   Skipped: ${result.skipped}`);
    
    if (result.createdTemplates.length > 0) {
      console.log(`    Created templates: ${result.createdTemplates.join(', ')}`);
    }
    
    if (result.skippedTemplates.length > 0) {
      console.log(`   ⏭️  Skipped templates: ${result.skippedTemplates.join(', ')}`);
    }

    console.log('🎉 Notification template seeding completed!');

  } catch (error) {
    logger.error('❌ Error seeding notification templates:');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedNotificationTemplates()
  .then(() => {
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  })
  .catch(() => {
    logger.error('❌ Seeding failed:');
    process.exit(1);
  }); 