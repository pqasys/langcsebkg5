import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function main() {
  const admins = [
    {
      email: 'patrickmorgan001@gmail.com',
      password: 'H2qrgxQTLGZ',
      name: 'Patrick Morgan'
    },
    {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User'
    }
  ];

  try {
    for (const admin of admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);

      const createdAdmin = await prisma.user.upsert({
        where: { email: admin.email },
        update: {
          role: 'ADMIN',
          password: hashedPassword,
          name: admin.name
        },
        create: {
          email: admin.email,
          password: hashedPassword,
          role: 'ADMIN',
          name: admin.name
        }
      });

      console.log('Admin user created/updated successfully:', {
        email: createdAdmin.email,
        name: createdAdmin.name,
        role: createdAdmin.role
      });
    }
  } catch (error) {
    logger.error('Error creating admin users:');
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(() => {
    logger.error('Error in main:');
    process.exit(1);
  }); 