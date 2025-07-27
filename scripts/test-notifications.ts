import { PrismaClient } from '@prisma/client';
import { notificationService } from '../lib/notification';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testNotifications() {
  try {
    console.log('🧪 Testing notification system...');

    // Check if notification templates exist
    const templates = await prisma.notificationTemplate.findMany({
      select: { name: true, isActive: true }
    });

    console.log(`� Found ${templates.length} notification templates:`);
    templates.forEach(t => console.log(`   - ${t.name} (${t.isActive ? 'active' : 'inactive'})`));

    // Check if we have the required templates
    const requiredTemplates = ['course_enrollment', 'payment_confirmation'];
    const missingTemplates = requiredTemplates.filter(name => 
      !templates.some(t => t.name === name && t.isActive)
    );

    if (missingTemplates.length > 0) {
      console.log(`⚠️  Missing required templates: ${missingTemplates.join(', ')}`);
      console.log('Creating missing templates...');
      
      const result = await notificationService.createDefaultTemplates('SYSTEM');
      console.log(` Created ${result.created} templates`);
    }

    // Get a test user
    const testUser = await prisma.user.findFirst({
      where: { role: 'STUDENT' },
      select: { id: true, name: true, email: true }
    });

    if (!testUser) {
      console.log('❌ No test user found. Please create a student user first.');
      return;
    }

    console.log(`� Using test user: ${testUser.name} (${testUser.email})`);

    // Test course enrollment notification
    console.log('\n📧 Testing course enrollment notification...');
    try {
      await notificationService.sendNotificationWithTemplate(
        'course_enrollment',
        testUser.id,
        {
          name: testUser.name,
          courseName: 'Test Course',
          institutionName: 'Test Institution',
          duration: '8 weeks',
          startDate: new Date().toLocaleDateString()
        },
        {
          test: true,
          enrollmentId: 'test-enrollment-id'
        },
        'SYSTEM'
      );
      console.log('✅ Course enrollment notification sent successfully');
    } catch (error) {
      logger.error('❌ Course enrollment notification failed:');
    }

    // Test payment confirmation notification
    console.log('\n💰 Testing payment confirmation notification...');
    try {
      await notificationService.sendNotificationWithTemplate(
        'payment_confirmation',
        testUser.id,
        {
          name: testUser.name,
          amount: '$99.99',
          referenceNumber: 'TEST-REF-123',
          date: new Date().toLocaleDateString(),
          courseName: 'Test Course'
        },
        {
          test: true,
          enrollmentId: 'test-enrollment-id'
        },
        'SYSTEM'
      );
      console.log('✅ Payment confirmation notification sent successfully');
    } catch (error) {
      logger.error('❌ Payment confirmation notification failed:');
    }

    // Check notification logs
    console.log('\n📊 Checking notification logs...');
    const logs = await prisma.notificationLog.findMany({
      where: {
        recipientId: testUser.id,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log(`� Found ${logs.length} recent notification logs:`);
    logs.forEach(log => {
      console.log(`   - ${log.type}: ${log.title} (${log.status})`);
      if (log.errorMessage) {
        console.log(`     Error: ${log.errorMessage}`);
      }
    });

    console.log('\n🎉 Notification system test completed!');

  } catch (error) {
    logger.error('❌ Test failed:');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testNotifications()
  .then(() => {
    console.log('✅ Test completed successfully');
    process.exit(0);
  })
  .catch(() => {
    logger.error('❌ Test failed:');
    process.exit(1);
  }); 