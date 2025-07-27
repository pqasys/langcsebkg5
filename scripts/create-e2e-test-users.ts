import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function createE2ETestUsers() {
  try {
    console.log('Creating E2E test users...');
    
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    
    // Create test admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'test.admin@example.com' },
      update: {},
      create: {
        name: 'Test Admin',
        email: 'test.admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log('Created/updated admin user:', adminUser.email);

    // Create test student user
    const studentUser = await prisma.user.upsert({
      where: { email: 'test.student@example.com' },
      update: {},
      create: {
        name: 'Test Student',
        email: 'test.student@example.com',
        password: hashedPassword,
        role: 'STUDENT',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log('Created/updated student user:', studentUser.email);

    // Create test institution user
    const institutionUser = await prisma.user.upsert({
      where: { email: 'test.institution@example.com' },
      update: {},
      create: {
        name: 'Test Institution',
        email: 'test.institution@example.com',
        password: hashedPassword,
        role: 'INSTITUTION',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Create or update institution
    let institution = await prisma.institution.findFirst({
      where: { email: 'test.institution@example.com' }
    });

    if (!institution) {
      institution = await prisma.institution.create({
        data: {
          name: 'Test Institution',
          email: 'test.institution@example.com',
          description: 'Test institution for E2E testing',
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
    }

    // Link user to institution
    await prisma.user.update({
      where: { id: institutionUser.id },
      data: { institutionId: institution.id }
    });

    console.log('Created/updated institution user:', institutionUser.email);
    console.log('Created/updated institution:', institution.name);

    console.log('\nE2E Test Users Created:');
    console.log('Admin: test.admin@example.com / testpassword123');
    console.log('Student: test.student@example.com / testpassword123');
    console.log('Institution: test.institution@example.com / testpassword123');

  } catch (error) {
    logger.error('Error creating E2E test users:');
  } finally {
    await prisma.$disconnect();
  }
}

createE2ETestUsers(); 