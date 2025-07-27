import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupOrphanedEnrollments() {
  try {
    console.log('🔍 Checking for orphaned enrollment records...');

    // Fetch all enrollments and filter for null studentId in JS
    const allEnrollments = await prisma.studentCourseEnrollment.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    const orphanedEnrollments = allEnrollments.filter(e => !e.studentId);

    console.log(` Found ${orphanedEnrollments.length} orphaned enrollment records`);

    if (orphanedEnrollments.length === 0) {
      console.log('✅ No orphaned enrollments found. Database is clean!');
      return;
    }

    // Display orphaned enrollments
    console.log('\n📋 Orphaned Enrollments:');
    orphanedEnrollments.forEach((enrollment, index) => {
      console.log(`${index + 1}. Enrollment ID: ${enrollment.id}`);
      console.log(`   Course: ${enrollment.course?.title || 'Unknown'} (${enrollment.courseId})`);
      console.log(`   Status: ${enrollment.status}`);
      console.log(`   Created: ${enrollment.createdAt}`);
      console.log(`   Student ID: ${enrollment.studentId}`);
      console.log('');
    });

    // Ask for confirmation before deletion
    console.log('⚠️  These enrollment records have null student references and should be cleaned up.');
    console.log('   This will permanently delete these orphaned records.');
    
    // For now, just log them. In production, you might want to add a confirmation prompt
    console.log('📝 Logging orphaned enrollments for manual review...');
    
    // Optionally, you can uncomment the following lines to actually delete them:
    /*
    console.log('🗑️  Deleting orphaned enrollments...');
    const deleteResult = await prisma.studentCourseEnrollment.deleteMany({
      where: {
        student: null
      }
    });
    console.log(` Deleted ${deleteResult.count} orphaned enrollment records`);
    */

    console.log('✅ Cleanup check completed');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupOrphanedEnrollments(); 