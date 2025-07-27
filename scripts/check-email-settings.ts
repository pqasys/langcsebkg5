import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function checkEmailSettings() {
  try {
    console.log('🔍 Checking email settings...\n');

    // Get email settings from database
    const emailSettings = await prisma.emailSettings.findFirst();
    
    if (!emailSettings) {
      console.log('❌ No email settings found in database');
      console.log('💡 Please configure email settings in the admin panel');
      return;
    }

    console.log('📧 Current Email Settings:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Host:           ${emailSettings.host}`);
    console.log(`Port:           ${emailSettings.port}`);
    console.log(`Secure:         ${emailSettings.secure ? 'Yes' : 'No'}`);
    console.log(`Username:       ${emailSettings.username}`);
    console.log(`From Email:     ${emailSettings.fromEmail}`);
    console.log(`From Name:      ${emailSettings.fromName}`);
    console.log(`TLS Strict:     ${emailSettings.rejectUnauthorized ? 'Yes' : 'No'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check environment variables
    console.log('🌍 Environment Variables:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`SMTP_HOST:      ${process.env.SMTP_HOST || 'Not set'}`);
    console.log(`SMTP_PORT:      ${process.env.SMTP_PORT || 'Not set'}`);
    console.log(`SMTP_USER:      ${process.env.SMTP_USER || 'Not set'}`);
    console.log(`SMTP_PASS:      ${process.env.SMTP_PASS ? '***SET***' : 'Not set'}`);
    console.log(`SMTP_SECURE:    ${process.env.SMTP_SECURE || 'Not set'}`);
    console.log(`SMTP_FROM_EMAIL: ${process.env.SMTP_FROM_EMAIL || 'Not set'}`);
    console.log(`SMTP_FROM_NAME: ${process.env.SMTP_FROM_NAME || 'Not set'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Analysis
    console.log('🔍 Analysis:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (emailSettings.fromEmail) {
      console.log(` From Email is set: ${emailSettings.fromEmail}`);
      
      // Check if it's a valid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailSettings.fromEmail)) {
        console.log('❌ From Email format is invalid');
      } else {
        console.log('✅ From Email format is valid');
      }
      
      // Check if it matches the username
      if (emailSettings.username && emailSettings.fromEmail !== emailSettings.username) {
        console.log('⚠️  From Email does not match SMTP Username');
        console.log('   This might cause authentication issues');
      } else {
        console.log('✅ From Email matches SMTP Username');
      }
    } else {
      console.log('❌ From Email is not set');
    }

    if (emailSettings.host) {
      console.log(` SMTP Host is set: ${emailSettings.host}`);
    } else {
      console.log('❌ SMTP Host is not set');
    }

    if (emailSettings.username) {
      console.log(` SMTP Username is set: ${emailSettings.username}`);
    } else {
      console.log('❌ SMTP Username is not set');
    }

    if (emailSettings.password) {
      console.log('✅ SMTP Password is set');
    } else {
      console.log('❌ SMTP Password is not set');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Recommendations
    console.log('💡 Recommendations:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (!emailSettings.fromEmail || !emailSettings.username || !emailSettings.password) {
      console.log('1. Complete all required email settings in the admin panel');
    }
    
    if (emailSettings.fromEmail && emailSettings.username && emailSettings.fromEmail !== emailSettings.username) {
      console.log('2. Ensure From Email matches your SMTP Username');
      console.log('   Most SMTP providers require the sender email to match the authenticated username');
    }
    
    if (emailSettings.host && emailSettings.host.includes('gmail')) {
      console.log('3. For Gmail:');
      console.log('   - Use "smtp.gmail.com" as host');
      console.log('   - Use port 587 with secure: false');
      console.log('   - Enable 2-factor authentication');
      console.log('   - Generate an App Password and use it instead of your regular password');
    }
    
    if (emailSettings.host && emailSettings.host.includes('outlook') || emailSettings.host.includes('hotmail')) {
      console.log('3. For Outlook/Hotmail:');
      console.log('   - Use "smtp-mail.outlook.com" as host');
      console.log('   - Use port 587 with secure: false');
      console.log('   - Enable 2-factor authentication');
      console.log('   - Generate an App Password');
    }
    
    if (emailSettings.host && emailSettings.host.includes('yahoo')) {
      console.log('3. For Yahoo:');
      console.log('   - Use "smtp.mail.yahoo.com" as host');
      console.log('   - Use port 587 with secure: false');
      console.log('   - Enable 2-factor authentication');
      console.log('   - Generate an App Password');
    }

    console.log('4. Common SMTP Providers:');
    console.log('   - Gmail: smtp.gmail.com:587');
    console.log('   - Outlook: smtp-mail.outlook.com:587');
    console.log('   - Yahoo: smtp.mail.yahoo.com:587');
    console.log('   - SendGrid: smtp.sendgrid.net:587');
    console.log('   - Mailgun: smtp.mailgun.org:587');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    logger.error('❌ Error checking email settings:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkEmailSettings()
  .then(() => {
    console.log('\n✅ Email settings check completed');
    process.exit(0);
  })
  .catch(() => {
    logger.error('❌ Check failed:');
    process.exit(1);
  }); 