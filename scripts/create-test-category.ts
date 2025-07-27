import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function createTestCategory() {
  try {
    const category = await prisma.category.create({
      data: {
        name: 'Test Category',
        description: 'Test Category Description',
        updatedAt: new Date(),
      },
    });
    console.log('Created test category:', category.id);
    return category.id;
  } catch (error) {
    logger.error('Error creating test category:');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestCategory(); 