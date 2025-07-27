const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupOrphanedStudents() {
  try {
    console.log('Starting cleanup of orphaned student records...\n');

    // Get all students
    const allStudents = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    console.log(`Total students found: ${allStudents.length}`);

    // Get all users with STUDENT role
    const studentUsers = await prisma.user.findMany({
      where: {
        role: 'STUDENT'
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    console.log(`Total student users found: ${studentUsers.length}`);

    // Find orphaned students (students without corresponding user accounts)
    const userEmails = new Set(studentUsers.map(user => user.email));
    const orphanedStudents = allStudents.filter(student => !userEmails.has(student.email));

    console.log(`\nOrphaned students found: ${orphanedStudents.length}`);
    orphanedStudents.forEach(student => {
      console.log(`- ${student.name} (${student.email}) - ID: ${student.id}`);
    });

    if (orphanedStudents.length === 0) {
      console.log('\nNo orphaned students found. Nothing to clean up.');
      return;
    }

    const orphanedStudentIds = orphanedStudents.map(student => student.id);

    // Delete dependent records in the correct order
    console.log('\nDeleting dependent records...');

    // 1. Delete student progress records
    const deletedProgress = await prisma.student_progress.deleteMany({
      where: {
        student_id: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedProgress.count} student progress records`);

    // 2. Delete module progress records
    const deletedModuleProgress = await prisma.moduleProgress.deleteMany({
      where: {
        studentId: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedModuleProgress.count} module progress records`);

    // 3. Delete learning sessions (via module progress)
    const moduleProgressIds = await prisma.moduleProgress.findMany({
      where: {
        studentId: {
          in: orphanedStudentIds
        }
      },
      select: { id: true }
    });
    
    const moduleProgressIdList = moduleProgressIds.map(mp => mp.id);
    const deletedLearningSessions = await prisma.learningSession.deleteMany({
      where: {
        moduleProgressId: {
          in: moduleProgressIdList
        }
      }
    });
    console.log(`Deleted ${deletedLearningSessions.count} learning sessions`);

    // 4. Delete student achievements
    const deletedAchievements = await prisma.studentAchievement.deleteMany({
      where: {
        studentId: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedAchievements.count} student achievements`);

    // 5. Delete exercise attempts
    const deletedExerciseAttempts = await prisma.exerciseAttempt.deleteMany({
      where: {
        studentId: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedExerciseAttempts.count} exercise attempts`);

    // 6. Delete quiz attempts
    const deletedQuizAttempts = await prisma.quizAttempt.deleteMany({
      where: {
        student_id: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedQuizAttempts.count} quiz attempts`);

    // 7. Delete quiz responses
    const deletedQuizResponses = await prisma.quizResponse.deleteMany({
      where: {
        studentId: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedQuizResponses.count} quiz responses`);

    // 8. Delete student course completions
    const deletedCompletions = await prisma.studentCourseCompletion.deleteMany({
      where: {
        studentId: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedCompletions.count} course completions`);

    // 9. Delete student course enrollments
    const deletedEnrollments = await prisma.studentCourseEnrollment.deleteMany({
      where: {
        studentId: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedEnrollments.count} course enrollments`);

    // 10. Delete student institution relationships
    const deletedStudentInstitutions = await prisma.studentInstitution.deleteMany({
      where: {
        student_id: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedStudentInstitutions.count} student institution relationships`);

    // 11. Delete student notification preferences
    const deletedNotificationPrefs = await prisma.studentNotificationPreferences.deleteMany({
      where: {
        student_id: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedNotificationPrefs.count} notification preferences`);

    // 12. Delete student subscriptions
    const deletedSubscriptions = await prisma.studentSubscription.deleteMany({
      where: {
        studentId: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedSubscriptions.count} student subscriptions`);

    // 13. Delete bookings (if any)
    const deletedBookings = await prisma.booking.deleteMany({
      where: {
        studentId: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedBookings.count} bookings`);

    // 14. Finally, delete the orphaned students
    const deletedStudents = await prisma.student.deleteMany({
      where: {
        id: {
          in: orphanedStudentIds
        }
      }
    });
    console.log(`Deleted ${deletedStudents.count} orphaned students`);

    console.log('\n✅ Cleanup completed successfully!');
    console.log(`\nRemaining students: ${allStudents.length - orphanedStudents.length}`);

    // Show remaining students
    const remainingStudents = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    console.log('\nRemaining students:');
    remainingStudents.forEach(student => {
      console.log(`- ${student.name} (${student.email})`);
    });

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOrphanedStudents(); 