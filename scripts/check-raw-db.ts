import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function checkRawDatabase() {
  try {
    console.log('Checking raw database values...\n');

    // Use raw SQL to check the exact values
    const institutions = await prisma.$queryRaw`
      SELECT id, name, logoUrl, mainImageUrl, 
             CASE WHEN mainImageUrl IS NULL THEN 'NULL' ELSE 'NOT NULL' END as mainImageStatus,
             LENGTH(mainImageUrl) as mainImageLength
      FROM institution 
      ORDER BY name
    `;

    console.log('Raw database query results:');
    console.log(institutions);

    // Also check specifically for ABC School
    const abcSchool = await prisma.$queryRaw`
      SELECT id, name, logoUrl, mainImageUrl, 
             CASE WHEN mainImageUrl IS NULL THEN 'NULL' ELSE 'NOT NULL' END as mainImageStatus,
             LENGTH(mainImageUrl) as mainImageLength
      FROM institution 
      WHERE name LIKE '%ABC%'
    `;

    console.log('\nABC School raw database values:');
    console.log(abcSchool);

  } catch (error) {
    logger.error('Error checking raw database:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkRawDatabase(); 