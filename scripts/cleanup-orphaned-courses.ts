import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function cleanupOrphanedCourses() {
  try {
    console.log('🔍 Checking for orphaned courses...');

    // Find courses with missing institution
    const orphanedByInstitution = await prisma.$queryRaw`
      SELECT c.id, c.title, c.institutionId, c.createdAt
      FROM course c
      LEFT JOIN institution i ON c.institutionId = i.id
      WHERE i.id IS NULL
    `;

    console.log(`Found ${(orphanedByInstitution as any[]).length} courses with missing institution:`);
    if ((orphanedByInstitution as any[]).length > 0) {
      (orphanedByInstitution as any[]).forEach((course: any) => {
        console.log(`  - Course ID: ${course.id}, Title: ${course.title}, Institution ID: ${course.institutionId}`);
      });
    }

    // Find courses with missing category
    const orphanedByCategory = await prisma.$queryRaw`
      SELECT c.id, c.title, c.categoryId, c.createdAt
      FROM course c
      LEFT JOIN category cat ON c.categoryId = cat.id
      WHERE cat.id IS NULL
    `;

    console.log(`Found ${(orphanedByCategory as any[]).length} courses with missing category:`);
    if ((orphanedByCategory as any[]).length > 0) {
      (orphanedByCategory as any[]).forEach((course: any) => {
        console.log(`  - Course ID: ${course.id}, Title: ${course.title}, Category ID: ${course.categoryId}`);
      });
    }

    // Get all orphaned course IDs (union of both sets)
    const orphanedCourseIds = new Set([
      ...(orphanedByInstitution as any[]).map((c: any) => c.id),
      ...(orphanedByCategory as any[]).map((c: any) => c.id)
    ]);

    const totalOrphaned = orphanedCourseIds.size;
    console.log(`\nTotal unique orphaned courses to delete: ${totalOrphaned}`);

    if (totalOrphaned > 0) {
      // Delete orphaned courses using raw SQL
      const deletedCount = await prisma.$executeRaw`
        DELETE c FROM course c
        LEFT JOIN institution i ON c.institutionId = i.id
        LEFT JOIN category cat ON c.categoryId = cat.id
        WHERE i.id IS NULL OR cat.id IS NULL
      `;

      console.log(` Deleted ${deletedCount} orphaned courses`);
    } else {
      console.log('✅ No orphaned courses found');
    }

    // Verify cleanup
    const remainingOrphaned = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM course c
      LEFT JOIN institution i ON c.institutionId = i.id
      LEFT JOIN category cat ON c.categoryId = cat.id
      WHERE i.id IS NULL OR cat.id IS NULL
    `;

    const remainingCount = (remainingOrphaned as any[])[0]?.count || 0;
    console.log(`\nRemaining orphaned courses after cleanup: ${remainingCount}`);

    if (remainingCount === 0) {
      console.log('🎉 All orphaned courses have been successfully cleaned up!');
    } else {
      console.log('⚠️  Some orphaned courses still remain. Manual review may be needed.');
    }

  } catch (error) {
    logger.error('❌ Error cleaning up orphaned courses:');
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOrphanedCourses(); 