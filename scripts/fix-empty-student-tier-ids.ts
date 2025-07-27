import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function fixEmptyStudentTierIds() {
  console.log('🔧 Fixing empty or invalid studentTierId in student_subscriptions...');

  // Find the BASIC tier
  const basicTier = await prisma.studentTier.findFirst({
    where: { planType: 'BASIC' }
  });
  if (!basicTier) {
    logger.error('❌ BASIC student tier not found!');
    process.exit(1);
  }

  // 1. Update all student_subscriptions with empty studentTierId
  const result1 = await prisma.$executeRaw`UPDATE student_subscriptions SET studentTierId = ${basicTier.id} WHERE studentTierId = ''`;
  console.log(` Updated ${result1} student_subscriptions with empty studentTierId to BASIC tier (${basicTier.id})`);

  // 2. Update all student_subscriptions with invalid studentTierId (not matching any id in student_tiers)
  const result2 = await prisma.$executeRaw`UPDATE student_subscriptions SET studentTierId = ${basicTier.id} WHERE studentTierId COLLATE utf8mb4_unicode_ci NOT IN (SELECT id COLLATE utf8mb4_unicode_ci FROM student_tiers)`;
  console.log(` Updated ${result2} student_subscriptions with invalid studentTierId to BASIC tier (${basicTier.id})`);

  await prisma.$disconnect();
}

fixEmptyStudentTierIds(); 