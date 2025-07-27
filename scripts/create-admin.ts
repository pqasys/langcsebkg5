import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const password = 'admin123';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Hash the password
  const hashedPassword = await hash(password, 12);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    logger.error('Error creating admin user:');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 