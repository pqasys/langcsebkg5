import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('Testing authentication system...');
    
    // Test 1: Check if users exist
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        password: true
      }
    });

    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.status}`);
    });

    // Test 2: Test password verification
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    });

    if (user) {
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`Password verification for ${testEmail}: ${isValid ? 'SUCCESS' : 'FAILED'}`);
      
      if (isValid) {
        console.log('✅ Authentication should work correctly');
      } else {
        console.log('❌ Password verification failed');
      }
    } else {
      console.log(` User ${testEmail} not found`);
    }

    // Test 3: Check institution relationship
    const institutionUser = await prisma.user.findUnique({
      where: { email: 'institution@example.com' },
      include: { institution: true }
    });

    if (institutionUser) {
      console.log(`Institution user: ${institutionUser.email}`);
      console.log(`Institution ID: ${institutionUser.institutionId}`);
      console.log(`Institution: ${institutionUser.institution?.name || 'Not linked'}`);
    }

  } catch (error) {
    logger.error('Error testing auth:');
  } finally {
    await prisma.$disconnect();
  }
}

testAuth(); 