import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

const commissionSubscriptionTemplates = [
  {
    name: 'commission_earned',
    type: 'email',
    subject: 'Commission Earned - {{institutionName}}',
    title: 'Commission Earned',
    content: `
      <h1>Commission Earned</h1>
      <p>Dear {{institutionName}},</p>
      <p>Congratulations! You have earned a commission from a student enrollment.</p>
      <p>Commission details:</p>
      <ul>
        <li>Student: {{studentName}}</li>
        <li>Course: {{courseName}}</li>
        <li>Enrollment Amount: {{enrollmentAmount}}</li>
        <li>Commission Rate: {{commissionRate}}%</li>
        <li>Commission Amount: {{commissionAmount}}</li>
        <li>Date: {{date}}</li>
      </ul>
      <p>Your commission will be processed and added to your next payout.</p>
      <p>Best regards,<br>The Platform Team</p>
    `,
    category: 'commission',
    isDefault: true
  },
  {
    name: 'commission_payout',
    type: 'email',
    subject: 'Commission Payout - {{institutionName}}',
    title: 'Commission Payout',
    content: `
      <h1>Commission Payout</h1>
      <p>Dear {{institutionName}},</p>
      <p>Your commission payout has been processed successfully.</p>
      <p>Payout details:</p>
      <ul>
        <li>Payout Amount: {{payoutAmount}}</li>
        <li>Period: {{startDate}} to {{endDate}}</li>
        <li>Total Commissions: {{totalCommissions}}</li>
        <li>Transaction ID: {{transactionId}}</li>
        <li>Date: {{date}}</li>
      </ul>
      <p>The funds should appear in your account within 3-5 business days.</p>
      <p>Best regards,<br>The Platform Team</p>
    `,
    category: 'commission',
    isDefault: true
  },
  {
    name: 'commission_rate_changed',
    type: 'email',
    subject: 'Commission Rate Updated - {{institutionName}}',
    title: 'Commission Rate Updated',
    content: `
      <h1>Commission Rate Updated</h1>
      <p>Dear {{institutionName}},</p>
      <p>Your commission rate has been updated by the platform administrator.</p>
      <p>Rate change details:</p>
      <ul>
        <li>Previous Rate: {{oldRate}}%</li>
        <li>New Rate: {{newRate}}%</li>
        <li>Effective Date: {{effectiveDate}}</li>
        <li>Reason: {{reason}}</li>
      </ul>
      <p>This change will apply to all future enrollments.</p>
      <p>Best regards,<br>The Platform Team</p>
    `,
    category: 'commission',
    isDefault: true
  },
  {
    name: 'subscription_renewal_reminder',
    type: 'email',
    subject: 'Subscription Renewal Reminder - {{institutionName}}',
    title: 'Subscription Renewal Reminder',
    content: `
      <h1>Subscription Renewal Reminder</h1>
      <p>Dear {{institutionName}},</p>
      <p>This is a friendly reminder that your subscription will renew soon.</p>
      <p>Subscription details:</p>
      <ul>
        <li>Current Plan: {{planName}}</li>
        <li>Renewal Date: {{renewalDate}}</li>
        <li>Amount: {{amount}}</li>
        <li>Days Remaining: {{daysRemaining}}</li>
      </ul>
      <p>Your subscription will automatically renew unless cancelled before the renewal date.</p>
      <p>Best regards,<br>The Platform Team</p>
    `,
    category: 'subscription',
    isDefault: true
  },
  {
    name: 'subscription_expired',
    type: 'email',
    subject: 'Subscription Expired - {{institutionName}}',
    title: 'Subscription Expired',
    content: `
      <h1>Subscription Expired</h1>
      <p>Dear {{institutionName}},</p>
      <p>Your subscription has expired. Some features may be limited until you renew.</p>
      <p>Subscription details:</p>
      <ul>
        <li>Previous Plan: {{planName}}</li>
        <li>Expired Date: {{expiredDate}}</li>
        <li>Renewal Amount: {{amount}}</li>
      </ul>
      <p>Please renew your subscription to continue enjoying all platform features.</p>
      <p>Best regards,<br>The Platform Team</p>
    `,
    category: 'subscription',
    isDefault: true
  },
  {
    name: 'subscription_upgraded',
    type: 'email',
    subject: 'Subscription Upgraded - {{institutionName}}',
    title: 'Subscription Upgraded',
    content: `
      <h1>Subscription Upgraded</h1>
      <p>Dear {{institutionName}},</p>
      <p>Your subscription has been successfully upgraded!</p>
      <p>Upgrade details:</p>
      <ul>
        <li>New Plan: {{newPlanName}}</li>
        <li>Previous Plan: {{oldPlanName}}</li>
        <li>Upgrade Amount: {{upgradeAmount}}</li>
        <li>Effective Date: {{effectiveDate}}</li>
        <li>New Features: {{newFeatures}}</li>
      </ul>
      <p>You now have access to additional features and benefits.</p>
      <p>Best regards,<br>The Platform Team</p>
    `,
    category: 'subscription',
    isDefault: true
  },
  {
    name: 'subscription_downgraded',
    type: 'email',
    subject: 'Subscription Downgraded - {{institutionName}}',
    title: 'Subscription Downgraded',
    content: `
      <h1>Subscription Downgraded</h1>
      <p>Dear {{institutionName}},</p>
      <p>Your subscription has been downgraded as requested.</p>
      <p>Downgrade details:</p>
      <ul>
        <li>New Plan: {{newPlanName}}</li>
        <li>Previous Plan: {{oldPlanName}}</li>
        <li>Effective Date: {{effectiveDate}}</li>
        <li>Changes: {{changes}}</li>
      </ul>
      <p>Some features may no longer be available. You can upgrade again anytime.</p>
      <p>Best regards,<br>The Platform Team</p>
    `,
    category: 'subscription',
    isDefault: true
  },
  {
    name: 'subscription_payment_failed',
    type: 'email',
    subject: 'Subscription Payment Failed - {{institutionName}}',
    title: 'Subscription Payment Failed',
    content: `
      <h1>Subscription Payment Failed</h1>
      <p>Dear {{institutionName}},</p>
      <p>We were unable to process your subscription payment.</p>
      <p>Payment details:</p>
      <ul>
        <li>Plan: {{planName}}</li>
        <li>Amount: {{amount}}</li>
        <li>Due Date: {{dueDate}}</li>
        <li>Error: {{error}}</li>
      </ul>
      <p>Please update your payment method to avoid service interruption.</p>
      <p>Best regards,<br>The Platform Team</p>
    `,
    category: 'subscription',
    isDefault: true
  }
];

async function seedCommissionSubscriptionTemplates() {
  try {
    console.log('🌱 Starting to seed commission and subscription notification templates...');

    // Check existing templates first
    const existingTemplates = await prisma.notificationTemplate.findMany({
      where: {
        name: {
          in: commissionSubscriptionTemplates.map(t => t.name)
        }
      },
      select: { name: true }
    });

    const existingNames = new Set(existingTemplates.map(t => t.name));
    const templatesToCreate = commissionSubscriptionTemplates.filter(t => !existingNames.has(t.name));
    const templatesToSkip = commissionSubscriptionTemplates.filter(t => existingNames.has(t.name));

    console.log(`Found ${existingTemplates.length} existing templates`);
    console.log(`Will create ${templatesToCreate.length} new templates`);
    console.log(`Will skip ${templatesToSkip.length} existing templates`);

    if (templatesToCreate.length === 0) {
      console.log('✅ All commission and subscription templates already exist. No action needed.');
      return;
    }

    // Create new templates
    const createdTemplates = [];
    for (const template of templatesToCreate) {
      try {
        const created = await prisma.notificationTemplate.create({
          data: {
            id: uuidv4(),
            ...template,
            createdBy: 'system-seed' // You can change this to an actual admin user ID
          }
        });
        createdTemplates.push(created.name);
        console.log(` Created template: ${template.name}`);
      } catch (error) {
        logger.error('❌ Failed to create template ${template.name}:');
      }
    }

    // Log skipped templates
    if (templatesToSkip.length > 0) {
      console.log(`⏭️  Skipped existing templates: ${templatesToSkip.map(t => t.name).join(', ')}`);
    }

    console.log('\n📊 Summary:');
    console.log(`Total templates processed: ${commissionSubscriptionTemplates.length}`);
    console.log(`Created: ${createdTemplates.length}`);
    console.log(`Skipped: ${templatesToSkip.length}`);
    
    if (createdTemplates.length > 0) {
      console.log(`\n Successfully created templates: ${createdTemplates.join(', ')}`);
    }

  } catch (error) {
    logger.error('❌ Error seeding commission and subscription templates:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedCommissionSubscriptionTemplates(); 