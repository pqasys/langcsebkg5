import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testAdminEmail() {
  try {
    console.log('🧪 Testing Admin Email Test Endpoint...\n');

    // Get current email settings
    const emailSettings = await prisma.emailSettings.findFirst();
    
    if (!emailSettings) {
      console.log('❌ No email settings found');
      return;
    }

    console.log('📧 Current Settings:');
    console.log(`Host: ${emailSettings.host}`);
    console.log(`Port: ${emailSettings.port}`);
    console.log(`Username: ${emailSettings.username}`);
    console.log(`From Email: ${emailSettings.fromEmail}`);
    console.log(`From Name: ${emailSettings.fromName}`);
    console.log(`TLS Strict: ${emailSettings.rejectUnauthorized ? 'Yes' : 'No'}\n`);

    // Test the admin email endpoint
    console.log('🌐 Testing admin email endpoint...');
    
    const response = await fetch('http://localhost:3000/api/admin/settings/email/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Admin email test successful!');
      console.log('📧 Response:', result);
    } else {
      const error = await response.text();
      console.log('❌ Admin email test failed:');
      console.log('📧 Status:', response.status);
      console.log('📧 Error:', error);
    }

  } catch (error) {
    logger.error('❌ Error testing admin email:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testAdminEmail()
  .then(() => {
    console.log('\n✅ Admin email test completed');
    process.exit(0);
  })
  .catch(() => {
    logger.error('❌ Test failed:');
    process.exit(1);
  }); 