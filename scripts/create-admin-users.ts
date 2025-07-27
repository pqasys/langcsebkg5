import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function createAdminUsers() {
  try {
    // Create first admin user
    const admin1 = await prisma.user.create({
      data: {
        email: 'patrickmorgan001@gmail.com',
        password: await hash('H2qrgxQTLGZ', 12),
        role: 'ADMIN',
        name: 'Patrick Morgan',
        status: 'ACTIVE',
      },
    });

    // Create second admin user
    const admin2 = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: await hash('admin123', 12),
        role: 'ADMIN',
        name: 'Admin User',
        status: 'ACTIVE',
      },
    });

    console.log('Admin users created successfully:');
    console.log('1. Patrick Morgan:', admin1.email);
    console.log('2. Admin User:', admin2.email);
  } catch (error) {
    logger.error('Error creating admin users:');
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUsers(); 