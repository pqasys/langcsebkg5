import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function checkDatabaseDirectly() {
  try {
    console.log('Checking database directly...\n');

    // Get all institutions with raw data
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        logoUrl: true,
        mainImageUrl: true,
      },
    });

    console.log(`Found ${institutions.length} institutions:\n`);

    institutions.forEach((institution, index) => {
      console.log(`${index + 1}. ${institution.name} (ID: ${institution.id})`);
      console.log(`   Logo URL: "${institution.logoUrl}"`);
      console.log(`   Main Image URL: "${institution.mainImageUrl}"`);
      console.log(`   Main Image URL type: ${typeof institution.mainImageUrl}`);
      console.log(`   Main Image URL is null: ${institution.mainImageUrl === null}`);
      console.log(`   Main Image URL is undefined: ${institution.mainImageUrl === undefined}`);
      console.log('');
    });

    // Check specifically for ABC School of English
    const abcSchool = institutions.find(i => i.name.includes('ABC'));
    if (abcSchool) {
      console.log('=== ABC School of English Details ===');
      console.log(`ID: ${abcSchool.id}`);
      console.log(`Name: ${abcSchool.name}`);
      console.log(`Main Image URL: "${abcSchool.mainImageUrl}"`);
      console.log(`Type: ${typeof abcSchool.mainImageUrl}`);
      console.log(`Is null: ${abcSchool.mainImageUrl === null}`);
      console.log(`Is undefined: ${abcSchool.mainImageUrl === undefined}`);
      console.log(`Length: ${abcSchool.mainImageUrl?.length || 'N/A'}`);
    }

  } catch (error) {
    logger.error('Error checking database:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkDatabaseDirectly(); 