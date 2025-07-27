const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupTestUsers() {
  try {
    console.log('Setting up test users...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'integration.test.admin@example.com' },
      update: {},
      create: {
        email: 'integration.test.admin@example.com',
        name: 'Test Admin',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });
    
    // Create student user
    const studentUser = await prisma.user.upsert({
      where: { email: 'integration.test.student@example.com' },
      update: {},
      create: {
        email: 'integration.test.student@example.com',
        name: 'Test Student',
        password: hashedPassword,
        role: 'STUDENT',
        status: 'ACTIVE'
      }
    });
    
    // Create institution user
    const institutionUser = await prisma.user.upsert({
      where: { email: 'test@institution.com' },
      update: {},
      create: {
        email: 'test@institution.com',
        name: 'Test Institution',
        password: hashedPassword,
        role: 'INSTITUTION',
        status: 'ACTIVE'
      }
    });
    
    console.log('Test users created successfully:');
    console.log('- Admin:', adminUser.email);
    console.log('- Student:', studentUser.email);
    console.log('- Institution:', institutionUser.email);
    
  } catch (error) {
    console.error('Error setting up test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestUsers(); 