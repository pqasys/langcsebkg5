import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCurrentTiers() {
  try {
    const tiers = await prisma.studentTier.findMany();
    console.log('Current student tiers:');
    tiers.forEach(tier => {
      console.log(`- ${tier.planType}: ${tier.name} (${tier.billingCycle}) - $${tier.price}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentTiers(); 