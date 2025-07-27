#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function fixUnlinkedRecords() {
  console.log('🔧 Checking for unlinked subscription records...\n');

  try {
    // Check institution subscriptions using raw SQL
    const institutionSubs = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, institutionId FROM institution_subscriptions WHERE commissionTierId IS NULL`
    );
    
    console.log(`Found ${institutionSubs.length} institution subscriptions without tier links`);
    
    for (const sub of institutionSubs) {
      console.log(`   - Institution subscription ${sub.id} needs tier link`);
    }

    // Check student subscriptions using raw SQL
    const studentSubs = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, studentId FROM student_subscriptions WHERE studentTierId IS NULL`
    );
    
    console.log(`Found ${studentSubs.length} student subscriptions without tier links`);
    
    for (const sub of studentSubs) {
      console.log(`   - Student subscription ${sub.id} needs tier link`);
    }

    // Get all tiers for reference
    const commissionTiers = await prisma.commissionTier.findMany();
    const studentTiers = await prisma.studentTier.findMany();
    
    console.log(`\nAvailable tiers:`);
    console.log(`   Institution tiers: ${commissionTiers.map(t => t.planType).join(', ')}`);
    console.log(`   Student tiers: ${studentTiers.map(t => t.planType).join(', ')}`);

    // If there are unlinked records, we need to link them
    if (institutionSubs.length > 0 || studentSubs.length > 0) {
      console.log('\n⚠️  Found unlinked records. Please run the migration script again.');
    } else {
      console.log('\n✅ All subscription records are properly linked to tiers!');
    }

  } catch (error) {
    logger.error('❌ Error checking unlinked records:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
fixUnlinkedRecords().catch(console.error); 