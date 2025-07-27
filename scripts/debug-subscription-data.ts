import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function debugSubscriptionData() {
  console.log('🔍 Debugging subscription data...\n');

  try {
    // Check institution subscriptions
    console.log('1. Institution Subscriptions:');
    const institutionSubs = await prisma.institutionSubscription.findMany({
      include: {
        commissionTier: true,
        institution: {
          select: { name: true }
        }
      }
    });

    console.log(`Found ${institutionSubs.length} institution subscriptions:`);
    institutionSubs.forEach((sub, index) => {
      console.log(`  ${index + 1}. Institution: ${sub.institution?.name || 'Unknown'}`);
      console.log(`     Tier: ${sub.commissionTier?.name || 'NULL'} (ID: ${sub.commissionTierId})`);
      console.log(`     Status: ${sub.status}`);
      console.log('');
    });

    // Check student subscriptions
    console.log('2. Student Subscriptions:');
    const studentSubs = await prisma.studentSubscription.findMany({
      include: {
        studentTier: true,
        student: {
          select: { name: true }
        }
      }
    });

    console.log(`Found ${studentSubs.length} student subscriptions:`);
    studentSubs.forEach((sub, index) => {
      console.log(`  ${index + 1}. Student: ${sub.student?.name || 'Unknown'}`);
      console.log(`     Tier: ${sub.studentTier?.name || 'NULL'} (ID: ${sub.studentTierId})`);
      console.log(`     Status: ${sub.status}`);
      console.log('');
    });

    // Check commission tiers
    console.log('3. Commission Tiers:');
    const commissionTiers = await prisma.commissionTier.findMany();
    console.log(`Found ${commissionTiers.length} commission tiers:`);
    commissionTiers.forEach(tier => {
      console.log(`  - ${tier.name}: $${tier.price}/month (${tier.commissionRate}% commission)`);
    });

    // Check student tiers
    console.log('\n4. Student Tiers:');
    const studentTiers = await prisma.studentTier.findMany();
    console.log(`Found ${studentTiers.length} student tiers:`);
    studentTiers.forEach(tier => {
      console.log(`  - ${tier.name}: $${tier.price}/month`);
    });

  } catch (error) {
    console.error('❌ Error debugging subscription data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSubscriptionData(); 