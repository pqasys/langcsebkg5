import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../lib/logger';

const execAsync = promisify(exec);

async function runSeedScripts() {
  try {
    console.log('Starting course seeding...');
    console.log('Note: This will only add new courses to existing institutions.');
    console.log('No existing data will be modified or deleted.');

    // Run only the courses seed
    console.log('\nCreating sample courses...');
    await execAsync('npx ts-node scripts/seed-courses.ts');

    console.log('\nCourse seeding completed successfully!');
  } catch (error) {
    logger.error('Error during seeding:');
    process.exit(1);
  }
}

runSeedScripts(); 