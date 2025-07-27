import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testIONOSSMTP() {
  try {
    console.log('🔧 Testing IONOS SMTP Configuration...\n');

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
    console.log(`From Email: ${emailSettings.fromEmail}\n`);

    // Test different IONOS configurations
    const configs = [
      {
        name: 'IONOS Standard (Port 587)',
        host: 'smtp.ionos.co.uk',
        port: 587,
        secure: false,
        requireTLS: true,
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: emailSettings.username,
          pass: emailSettings.password
        }
      },
      {
        name: 'IONOS Alternative (Port 465)',
        host: 'smtp.ionos.co.uk',
        port: 465,
        secure: true,
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: emailSettings.username,
          pass: emailSettings.password
        }
      },
      {
        name: 'IONOS with STARTTLS',
        host: 'smtp.ionos.co.uk',
        port: 587,
        secure: false,
        requireTLS: true,
        ignoreTLS: false,
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: emailSettings.username,
          pass: emailSettings.password
        }
      }
    ];

    for (const config of configs) {
      console.log(`🧪 Testing: ${config.name}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      try {
        // Create transporter
        const transporter = nodemailer.createTransport(config);
        
        // Verify connection
        console.log('🔍 Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully');
        
        // Test sending email
        console.log('📤 Testing email send...');
        const testEmail = {
          from: `"${emailSettings.fromName}" <${emailSettings.fromEmail}>`,
          to: emailSettings.username, // Send to self for testing
          subject: `IONOS SMTP Test - ${config.name}`,
          html: `
            <h1>IONOS SMTP Test</h1>
            <p>This is a test email to verify IONOS SMTP configuration.</p>
            <p><strong>Configuration:</strong> ${config.name}</p>
            <p><strong>Host:</strong> ${config.host}:${config.port}</p>
            <p><strong>Secure:</strong> ${config.secure ? 'Yes' : 'No'}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          `
        };
        
        const info = await transporter.sendMail(testEmail);
        console.log('✅ Email sent successfully!');
        console.log(`� Message ID: ${info.messageId}`);
        console.log(`� Response: ${info.response}`);
        
        // If successful, update the database settings
        console.log('💾 Updating database settings...');
        await prisma.emailSettings.update({
          where: { id: emailSettings.id },
          data: {
            host: config.host,
            port: config.port,
            secure: config.secure,
            rejectUnauthorized: false // Disable strict TLS verification
          }
        });
        console.log('✅ Database settings updated');
        
        console.log('🎉 IONOS SMTP is now working correctly!');
        break;
        
      } catch (error: any) {
        console.log('❌ Test failed:');
        console.log(`   Error: ${error.message}`);
        
        if (error.code === 'EAUTH') {
          console.log('   🔐 Authentication failed - check username/password');
        } else if (error.code === 'EENVELOPE') {
          console.log('   📧 Envelope error - check sender address');
        } else if (error.code === 'ECONNECTION') {
          console.log('   🌐 Connection failed - check host/port');
        }
        console.log('');
      }
    }

    console.log('💡 IONOS SMTP Troubleshooting Tips:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Verify your domain is properly configured in IONOS');
    console.log('2. Ensure the email account exists and is active');
    console.log('3. Check if you need to enable SMTP in IONOS control panel');
    console.log('4. Try using the full email address as username');
    console.log('5. Make sure the password is correct (not the webmail password)');
    console.log('6. Contact IONOS support if issues persist');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    logger.error('❌ Error testing IONOS SMTP:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testIONOSSMTP()
  .then(() => {
    console.log('\n✅ IONOS SMTP test completed');
    process.exit(0);
  })
  .catch(() => {
    logger.error('❌ Test failed:');
    process.exit(1);
  }); 