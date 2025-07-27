import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function checkDatabaseState() {
  console.log('🔍 Checking database state...\n');

  try {
    // Check commission tiers
    console.log('1. Commission Tiers:');
    const commissionTiers = await prisma.$queryRaw`
      SELECT id, planType, name, price, commissionRate 
      FROM commission_tiers 
      ORDER BY price
    `;
    console.log(commissionTiers);

    // Check institution subscriptions with raw SQL
    console.log('\n2. Institution Subscriptions:');
    const institutionSubs = await prisma.$queryRaw`
      SELECT 
        ins.id,
        ins.institutionId,
        ins.commissionTierId,
        ins.status,
        i.name as institutionName,
        ct.name as tierName
      FROM institution_subscriptions ins
      LEFT JOIN institution i ON ins.institutionId = i.id
      LEFT JOIN commission_tiers ct ON ins.commissionTierId = ct.id
    `;
    console.log(institutionSubs);

    // Check student tiers
    console.log('\n3. Student Tiers:');
    const studentTiers = await prisma.$queryRaw`
      SELECT id, planType, name, price 
      FROM student_tiers 
      ORDER BY price
    `;
    console.log(studentTiers);

    // Check student subscriptions with raw SQL
    console.log('\n4. Student Subscriptions:');
    const studentSubs = await prisma.$queryRaw`
      SELECT 
        ss.id,
        ss.studentId,
        ss.studentTierId,
        ss.status,
        s.name as studentName,
        st.name as tierName
      FROM student_subscriptions ss
      LEFT JOIN students s ON ss.studentId = s.id
      LEFT JOIN student_tiers st ON ss.studentTierId = st.id
    `;
    console.log(studentSubs);

    // Check for any null tier IDs
    console.log('\n5. Checking for null tier IDs:');
    const nullCommissionTiers = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM institution_subscriptions 
      WHERE commissionTierId IS NULL
    `;
    console.log('Institution subscriptions with null commissionTierId:', nullCommissionTiers);

    const nullStudentTiers = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM student_subscriptions 
      WHERE studentTierId IS NULL
    `;
    console.log('Student subscriptions with null studentTierId:', nullStudentTiers);

  } catch (error) {
    logger.error('❌ Error checking database state:');
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseState(); 