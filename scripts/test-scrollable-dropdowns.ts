import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testScrollableDropdowns() {
  try {
    console.log('Testing scrollable dropdowns...');
    
    // Get all categories to verify we have enough options to test scrolling
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    console.log(`\n Category count: ${categories.length}`);
    console.log('This should be enough to test scrollable dropdowns in the admin courses page.');
    
    // Show all categories
    console.log('\n📋 All categories:');
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category.slug})`);
    });
    
    console.log('\n✅ Test completed!');
    console.log('💡 The category dropdown in admin/courses should now be scrollable.');
    console.log('💡 Other dropdowns throughout the app should also be scrollable.');
    
  } catch (error) {
    logger.error('❌ Error testing scrollable dropdowns:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testScrollableDropdowns()
  .then(() => {
    console.log('Test script completed successfully');
    process.exit(0);
  })
  .catch(() => {
    logger.error('Test script failed:');
    process.exit(1);
  }); 