import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function fixNotificationTemplates() {
  try {
    console.log('🔧 Fixing notification templates...\n');

    // First, let's find any user to use as the creator
    const anyUser = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!anyUser) {
      console.log('❌ No users found in the database. Cannot fix templates.');
      return;
    }

    console.log(`Found user: ${anyUser.name} (${anyUser.email}) with role: ${anyUser.role}`);

    // Find templates with invalid createdBy values
    const allTemplates = await prisma.notificationTemplate.findMany({
      select: {
        id: true,
        name: true,
        createdBy: true
      }
    });

    console.log(`Total templates found: ${allTemplates.length}`);

    // Check which templates have invalid createdBy values
    const invalidTemplates = [];
    for (const template of allTemplates) {
      try {
        // Try to find the user for this template
        const user = await prisma.user.findUnique({
          where: { id: template.createdBy },
          select: { id: true }
        });
        
        if (!user) {
          invalidTemplates.push(template);
        }
      } catch (error) {
        invalidTemplates.push(template);
      }
    }

    console.log(`Found ${invalidTemplates.length} templates with invalid createdBy values`);

    if (invalidTemplates.length === 0) {
      console.log('✅ All templates have valid createdBy values');
      return;
    }

    // Update the templates
    for (const template of invalidTemplates) {
      try {
        await prisma.notificationTemplate.update({
          where: { id: template.id },
          data: { createdBy: anyUser.id }
        });
        console.log(` Fixed template: ${template.name} (was: ${template.createdBy})`);
      } catch (error) {
        logger.error('❌ Failed to fix template ${template.name}:');
      }
    }

    console.log('\n📊 Summary:');
    console.log(`Fixed ${invalidTemplates.length} templates`);
    console.log(`Using creator ID: ${anyUser.id}`);

  } catch (error) {
    logger.error('❌ Error fixing notification templates:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixNotificationTemplates(); 