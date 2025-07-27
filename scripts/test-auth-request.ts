import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testAuthRequest() {
  try {
    // Test first admin account
    console.log('\nTesting authentication for patrickmorgan001@gmail.com...');
    const admin1 = await prisma.user.findUnique({
      where: { email: 'patrickmorgan001@gmail.com' },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        status: true,
        name: true
      }
    });

    if (!admin1) {
      logger.error('❌ User not found');
      return;
    }

    console.log('User found in database:');
    console.log('- ID:', admin1.id);
    console.log('- Email:', admin1.email);
    console.log('- Role:', admin1.role);
    console.log('- Status:', admin1.status);
    console.log('- Name:', admin1.name);

    // Test password validation
    const isPasswordValid = await compare('H2qrgxQTLGZ', admin1.password);
    console.log('\nPassword validation:', isPasswordValid ? '✅ Success' : '❌ Failed');

    // Check if the user has all required fields for NextAuth
    const requiredFields = ['id', 'email', 'role', 'status', 'name'];
    const missingFields = requiredFields.filter(field => !admin1[field]);
    
    if (missingFields.length > 0) {
      logger.error('\n❌ Missing required fields:');
    } else {
      console.log('\n✅ All required fields are present');
    }

  } catch (error) {
    logger.error('Error testing auth request:');
  } finally {
    await prisma.$disconnect();
  }
}

testAuthRequest(); 