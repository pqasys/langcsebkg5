import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testPasswordHash() {
  try {
    // Test first admin account
    console.log('\nTesting password hash for patrickmorgan001@gmail.com...');
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
    console.log('- Hashed Password:', admin1.password);

    // Test password validation
    const isPasswordValid = await compare('H2qrgxQTLGZ', admin1.password);
    console.log('\nPassword validation:', isPasswordValid ? '✅ Success' : '❌ Failed');

    // Generate a new hash for comparison
    const newHash = await hash('H2qrgxQTLGZ', 12);
    console.log('\nNew hash generated:', newHash);
    console.log('Hash comparison:', await compare('H2qrgxQTLGZ', newHash) ? '✅ Matches' : '❌ Different');

    // Test second admin account
    console.log('\nTesting password hash for admin@example.com...');
    const admin2 = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        status: true,
        name: true
      }
    });

    if (!admin2) {
      logger.error('❌ User not found');
      return;
    }

    console.log('User found in database:');
    console.log('- ID:', admin2.id);
    console.log('- Email:', admin2.email);
    console.log('- Role:', admin2.role);
    console.log('- Status:', admin2.status);
    console.log('- Name:', admin2.name);
    console.log('- Hashed Password:', admin2.password);

    // Test password validation
    const isPasswordValid2 = await compare('admin123', admin2.password);
    console.log('\nPassword validation:', isPasswordValid2 ? '✅ Success' : '❌ Failed');

    // Generate a new hash for comparison
    const newHash2 = await hash('admin123', 12);
    console.log('\nNew hash generated:', newHash2);
    console.log('Hash comparison:', await compare('admin123', newHash2) ? '✅ Matches' : '❌ Different');

  } catch (error) {
    logger.error('Error testing password hash:');
  } finally {
    await prisma.$disconnect();
  }
}

testPasswordHash(); 