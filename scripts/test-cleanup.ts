import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCleanup() {
  try {
    console.log('Testing database cleanup functionality...\n');

    // Test orphaned CourseTag records
    console.log('1. Checking for orphaned CourseTag records...');
    const orphanedCourseTags = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM coursetag ct 
      LEFT JOIN tag t ON ct.tagId = t.id 
      LEFT JOIN course c ON ct.courseId = c.id 
      WHERE t.id IS NULL OR c.id IS NULL
    `;
    console.log(`   Found ${(orphanedCourseTags as any[])[0]?.count || 0} orphaned CourseTag records`);

    // Test orphaned modules
    console.log('2. Checking for orphaned modules...');
    const orphanedModules = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM modules m 
      LEFT JOIN course c ON m.course_id = c.id 
      WHERE c.id IS NULL
    `;
    console.log(`   Found ${(orphanedModules as any[])[0]?.count || 0} orphaned modules`);

    // Test orphaned content items
    console.log('3. Checking for orphaned content items...');
    const orphanedContentItems = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM content_items ci 
      LEFT JOIN modules m ON ci.module_id = m.id 
      WHERE m.id IS NULL
    `;
    console.log(`   Found ${(orphanedContentItems as any[])[0]?.count || 0} orphaned content items`);

    console.log('\n✅ Database cleanup test completed successfully!');

  } catch (error) {
    console.error('❌ Error during cleanup test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCleanup(); 