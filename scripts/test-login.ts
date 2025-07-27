import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testLogin() {
  try {
    // Test first admin account
    console.log('\nTesting first admin account (patrickmorgan001@gmail.com)...');
    const admin1 = await prisma.user.findUnique({
      where: { email: 'patrickmorgan001@gmail.com' }
    });

    if (!admin1) {
      logger.error('❌ First admin account not found');
    } else {
      const isPasswordValid = await compare('H2qrgxQTLGZ', admin1.password);
      console.log(` First admin account found`);
      console.log(` Password validation: ${isPasswordValid ? 'Success' : 'Failed'}`);
      console.log(` Role: ${admin1.role}`);
      console.log(` Status: ${admin1.status}`);
    }

    // Test second admin account
    console.log('\nTesting second admin account (admin@example.com)...');
    const admin2 = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (!admin2) {
      logger.error('❌ Second admin account not found');
    } else {
      const isPasswordValid = await compare('admin123', admin2.password);
      console.log(` Second admin account found`);
      console.log(` Password validation: ${isPasswordValid ? 'Success' : 'Failed'}`);
      console.log(` Role: ${admin2.role}`);
      console.log(` Status: ${admin2.status}`);
    }

  } catch (error) {
    logger.error('Error testing login:');
  } finally {
    await prisma.$disconnect();
  }
}

testLogin(); 