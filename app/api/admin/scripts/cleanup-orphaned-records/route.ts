import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    console.log('Starting database cleanup of orphaned records...');
    const startTime = Date.now();
    const cleanupResults: Record<string, number> = {};

    // Helper function to safely execute cleanup operations
    const safeCleanup = async (operation: () => Promise<any>, name: string) => {
      try {
        const result = await operation();
        cleanupResults[name] = result;
        console.log(`✅ ${name}: ${result} records cleaned`);
        return result;
      } catch (error) {
        console.warn(`⚠️ ${name}: Skipped due to error - ${error instanceof Error ? error.message : 'Unknown error'}`);
        cleanupResults[name] = 0;
        return 0;
      }
    };

    // 1. Clean up orphaned CourseTag records
    await safeCleanup(async () => {
      return await prisma.$executeRaw`
        DELETE ct FROM coursetag ct 
        LEFT JOIN tag t ON ct.tagId = t.id 
        LEFT JOIN course c ON ct.courseId = c.id 
        WHERE t.id IS NULL OR c.id IS NULL
      `;
    }, 'orphanedCourseTags');

    // 2. Clean up orphaned modules
    await safeCleanup(async () => {
      return await prisma.$executeRaw`
        DELETE m FROM modules m 
        LEFT JOIN course c ON m.course_id = c.id 
        WHERE c.id IS NULL
      `;
    }, 'orphanedModules');

    // 3. Clean up orphaned content items
    await safeCleanup(async () => {
      return await prisma.$executeRaw`
        DELETE ci FROM content_items ci 
        LEFT JOIN modules m ON ci.module_id = m.id 
        WHERE m.id IS NULL
      `;
    }, 'orphanedContentItems');

    // 4. Clean up orphaned exercises
    await safeCleanup(async () => {
      return await prisma.$executeRaw`
        DELETE e FROM exercises e 
        LEFT JOIN modules m ON e.module_id = m.id 
        WHERE m.id IS NULL
      `;
    }, 'orphanedExercises');

    // 5. Clean up orphaned quizzes
    await safeCleanup(async () => {
      return await prisma.$executeRaw`
        DELETE q FROM quizzes q 
        LEFT JOIN modules m ON q.module_id = m.id 
        WHERE m.id IS NULL
      `;
    }, 'orphanedQuizzes');

    // 6. Clean up orphaned quiz questions
    await safeCleanup(async () => {
      return await prisma.$executeRaw`
        DELETE qq FROM quiz_questions qq 
        LEFT JOIN quizzes q ON qq.quiz_id = q.id 
        WHERE q.id IS NULL
      `;
    }, 'orphanedQuizQuestions');

    // 7. Clean up orphaned student enrollments
    await safeCleanup(async () => {
      return await prisma.$executeRaw`
        DELETE sce FROM student_course_enrollments sce 
        LEFT JOIN course c ON sce.courseId = c.id 
        WHERE c.id IS NULL
      `;
    }, 'orphanedEnrollments');

    // 8. Clean up orphaned payments
    await safeCleanup(async () => {
      return await prisma.$executeRaw`
        DELETE p FROM payments p 
        LEFT JOIN student_course_enrollments sce ON p.enrollmentId = sce.id 
        WHERE sce.id IS NULL
      `;
    }, 'orphanedPayments');

    // 9. Clean up orphaned bookings
    await safeCleanup(async () => {
      return await prisma.$executeRaw`
        DELETE b FROM booking b 
        LEFT JOIN course c ON b.courseId = c.id 
        WHERE c.id IS NULL
      `;
    }, 'orphanedBookings');

    // 10. Clean up orphaned student progress
    await safeCleanup(async () => {
      return await prisma.$executeRaw`
        DELETE sp FROM student_progress sp 
        LEFT JOIN modules m ON sp.module_id = m.id 
        WHERE m.id IS NULL
      `;
    }, 'orphanedStudentProgress');

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Calculate total records cleaned
    const totalRecordsCleaned = Object.values(cleanupResults).reduce((sum, count) => sum + count, 0);

    console.log(`Database cleanup completed in ${duration}ms. Total records cleaned: ${totalRecordsCleaned}`);

    return NextResponse.json({
      success: true,
      message: `Database cleanup completed successfully`,
      duration: `${duration}ms`,
      totalRecordsCleaned,
      details: cleanupResults
    });

  } catch (error) {
    console.error('Error during database cleanup:', error);
    return NextResponse.json(
      { 
        error: 'Failed to cleanup database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 