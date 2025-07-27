import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function globalTeardown() {
  // // // // // // console.log('🧹 Starting global teardown...');

  try {
    // Clean up test data
    await cleanupTestData();
    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');
  
  // Delete test users and related data
  await prisma.user.deleteMany({
    where: { email: { contains: 'test.' } }
  });
  
  // Delete test institutions
  await prisma.institution.deleteMany({
    where: { name: { contains: 'Test Institution' } }
  });
  
  // Delete test courses
  await prisma.course.deleteMany({
    where: { title: { contains: 'Test Course' } }
  });
}

export default globalTeardown; 