import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function cleanupOrphanedCourseTags() {
  try {
    console.log('🔍 Checking for orphaned CourseTag records...');

    // Find CourseTag records where the referenced tag doesn't exist
    const orphanedCourseTags = await prisma.$queryRaw`
      SELECT ct.id, ct.courseId, ct.tagId, ct.createdAt
      FROM coursetag ct
      LEFT JOIN tag t ON ct.tagId = t.id
      WHERE t.id IS NULL
    `;

    console.log(`Found ${(orphanedCourseTags as any[]).length} orphaned CourseTag records:`);
    
    if ((orphanedCourseTags as any[]).length > 0) {
      (orphanedCourseTags as any[]).forEach((record: any) => {
        console.log(`  - CourseTag ID: ${record.id}, Course: ${record.courseId}, Tag: ${record.tagId}`);
      });

      // Delete orphaned records using raw SQL
      const deletedCount = await prisma.$executeRaw`
        DELETE ct FROM coursetag ct
        LEFT JOIN tag t ON ct.tagId = t.id
        WHERE t.id IS NULL
      `;

      console.log(` Deleted ${deletedCount} orphaned CourseTag records`);
    } else {
      console.log('✅ No orphaned CourseTag records found');
    }

    // Also check for orphaned CourseTag records using a different approach
    const allCourseTags = await prisma.courseTag.findMany({
      include: {
        tag: true
      }
    });

    const orphanedByPrisma = allCourseTags.filter(ct => !ct.tag);
    console.log(`Found ${orphanedByPrisma.length} orphaned records via Prisma query`);

    if (orphanedByPrisma.length > 0) {
      const orphanedIds = orphanedByPrisma.map(ct => ct.id);
      await prisma.courseTag.deleteMany({
        where: {
          id: {
            in: orphanedIds
          }
        }
      });
      console.log(` Deleted ${orphanedByPrisma.length} orphaned CourseTag records via Prisma`);
    }

  } catch (error) {
    logger.error('❌ Error cleaning up orphaned CourseTag records:');
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOrphanedCourseTags(); 