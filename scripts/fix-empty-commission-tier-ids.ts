import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function fixEmptyCommissionTierIds() {
  console.log('🔧 Fixing empty commissionTierId in institution_subscriptions...');

  // Find the STARTER tier
  const starterTier = await prisma.commissionTier.findFirst({
    where: { planType: 'STARTER' }
  });
  if (!starterTier) {
    logger.error('❌ STARTER commission tier not found!');
    process.exit(1);
  }

  // Update all institution_subscriptions with empty commissionTierId
  const result = await prisma.$executeRaw`UPDATE institution_subscriptions SET commissionTierId = ${starterTier.id} WHERE commissionTierId = ''`;
  console.log(` Updated ${result} institution_subscriptions to use STARTER tier (${starterTier.id})`);

  await prisma.$disconnect();
}

fixEmptyCommissionTierIds(); 