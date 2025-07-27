import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

const expectedTemplates = [
  'commission_earned',
  'commission_payout',
  'commission_rate_changed',
  'subscription_renewal_reminder',
  'subscription_expired',
  'subscription_upgraded',
  'subscription_downgraded',
  'subscription_payment_failed'
];

async function verifyTemplates() {
  try {
    console.log('🔍 Verifying commission and subscription notification templates...\n');

    // Get all templates
    const allTemplates = await prisma.notificationTemplate.findMany({
      select: {
        name: true,
        category: true,
        isActive: true,
        isDefault: true
      },
      orderBy: {
        category: 'asc'
      }
    });

    console.log(` Total templates in database: ${allTemplates.length}\n`);

    // Check commission and subscription templates
    const commissionTemplates = allTemplates.filter(t => t.category === 'commission');
    const subscriptionTemplates = allTemplates.filter(t => t.category === 'subscription');

    console.log('💰 Commission Templates:');
    if (commissionTemplates.length === 0) {
      console.log('  ❌ No commission templates found');
    } else {
      commissionTemplates.forEach(template => {
        console.log(`   ${template.name} (${template.isActive ? 'Active' : 'Inactive'}, ${template.isDefault ? 'Default' : 'Custom'})`);
      });
    }

    console.log('\n📅 Subscription Templates:');
    if (subscriptionTemplates.length === 0) {
      console.log('  ❌ No subscription templates found');
    } else {
      subscriptionTemplates.forEach(template => {
        console.log(`   ${template.name} (${template.isActive ? 'Active' : 'Inactive'}, ${template.isDefault ? 'Default' : 'Custom'})`);
      });
    }

    // Check for missing templates
    const foundTemplates = allTemplates.map(t => t.name);
    const missingTemplates = expectedTemplates.filter(name => !foundTemplates.includes(name));

    console.log('\n📋 Verification Summary:');
    console.log(`Expected templates: ${expectedTemplates.length}`);
    console.log(`Found commission templates: ${commissionTemplates.length}`);
    console.log(`Found subscription templates: ${subscriptionTemplates.length}`);
    
    if (missingTemplates.length > 0) {
      console.log(` Missing templates: ${missingTemplates.join(', ')}`);
    } else {
      console.log('✅ All expected templates are present!');
    }

    // Show all categories
    const categories = [...new Set(allTemplates.map(t => t.category))];
    console.log(`\n� Available categories: ${categories.join(', ')}`);

  } catch (error) {
    logger.error('❌ Error verifying templates:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the verification
verifyTemplates(); 