import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Starting comprehensive data cleanup...');

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Delete records in the correct order to handle foreign key constraints
      
      console.log('1. Deleting quiz responses...');
      const deletedQuizResponses = await tx.quizResponse.deleteMany({});
      
      console.log('2. Deleting quiz attempts...');
      const deletedQuizAttempts = await tx.quizAttempt.deleteMany({});
      
      console.log('3. Deleting student achievements...');
      const deletedStudentAchievements = await tx.studentAchievement.deleteMany({});
      
      console.log('4. Deleting learning sessions...');
      const deletedLearningSessions = await tx.learningSession.deleteMany({});
      
      console.log('5. Deleting module progress...');
      const deletedModuleProgress = await tx.moduleProgress.deleteMany({});
      
      console.log('6. Deleting student notification preferences...');
      const deletedNotificationPreferences = await tx.studentNotificationPreferences.deleteMany({});
      
      console.log('7. Deleting payment records...');
      const deletedPayments = await tx.payment.deleteMany({});
      
      console.log('8. Deleting institution payouts...');
      const deletedPayouts = await tx.institutionPayout.deleteMany({});
      
      console.log('9. Deleting commission logs...');
      const deletedCommissionLogs = await tx.commissionRateLog.deleteMany({});
      
      console.log('10. Deleting student progress records...');
      const deletedProgress = await tx.student_progress.deleteMany({});
      
      console.log('11. Deleting student course completions...');
      const deletedCompletions = await tx.studentCourseCompletion.deleteMany({});
      
      console.log('12. Deleting bookings...');
      const deletedBookings = await tx.booking.deleteMany({});
      
      console.log('13. Deleting student course enrollments...');
      const deletedEnrollments = await tx.studentCourseEnrollment.deleteMany({});
      
      console.log('14. Deleting students...');
      const deletedStudents = await tx.student.deleteMany({});

      return {
        quizResponses: deletedQuizResponses.count,
        quizAttempts: deletedQuizAttempts.count,
        studentAchievements: deletedStudentAchievements.count,
        learningSessions: deletedLearningSessions.count,
        moduleProgress: deletedModuleProgress.count,
        notificationPreferences: deletedNotificationPreferences.count,
        payments: deletedPayments.count,
        payouts: deletedPayouts.count,
        commissionLogs: deletedCommissionLogs.count,
        progress: deletedProgress.count,
        completions: deletedCompletions.count,
        bookings: deletedBookings.count,
        enrollments: deletedEnrollments.count,
        students: deletedStudents.count,
      };
    });

    console.log('Cleanup completed successfully');

    return NextResponse.json({
      message: 'Cleanup completed successfully',
      deletedRecords: result
    });
  } catch (error) {
    console.error('Error during cleanup:');
    return NextResponse.json(
      { message: 'Error during cleanup', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 