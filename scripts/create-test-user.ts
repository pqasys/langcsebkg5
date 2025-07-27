import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Checking database connection...');
    
    // Check if there are any users
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in database`);

    // Check if test user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('Test user already exists:', existingUser.email);
      return;
    }

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'STUDENT',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('Created test user:', user.email);
    console.log('Login credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');

    // Create a test institution user
    const institutionUser = await prisma.user.create({
      data: {
        name: 'Test Institution',
        email: 'institution@example.com',
        password: hashedPassword,
        role: 'INSTITUTION',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Create institution
    const institution = await prisma.institution.create({
      data: {
        name: 'Test Institution',
        email: 'institution@example.com',
        description: 'Test institution for development',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        address: '123 Test St',
        status: 'APPROVED',
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        currency: 'USD',
        commissionRate: 25.0
      }
    });

    // Link user to institution
    await prisma.user.update({
      where: { id: institutionUser.id },
      data: { institutionId: institution.id }
    });

    console.log('Created test institution user:', institutionUser.email);
    console.log('Institution login credentials:');
    console.log('Email: institution@example.com');
    console.log('Password: password123');

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('Created admin user:', adminUser.email);
    console.log('Admin login credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');

  } catch (error) {
    logger.error('Error creating test user:');
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 