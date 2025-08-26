import { notificationService } from './notification';
import { prisma } from './prisma';
import { logger } from './logger';

/**
 * Comprehensive notification integration service
 * Provides easy-to-use methods for triggering notifications across all key events
 */
export class NotificationIntegrationService {
  /**
   * Trigger notifications for course completion
   */
  static async triggerCourseCompletion(
    studentId: string,
    courseId: string,
    completionData: {
      score: number;
      totalModules: number;
      totalQuizzes: number;
    }
  ) {
    try {
      const [student, course] = await Promise.all([
        prisma.student.findUnique({
          where: { id: studentId }
        }),
        prisma.course.findUnique({
          where: { id: courseId }
        })
      ]);

      if (!student || !course) {
        throw new Error(`Student or course not found - Context: throw new Error('Student or course not found');...);
      }

      await notificationService.sendCourseCompletionNotification(
        student.id,
        courseId,
        course.title,
        {
          ...completionData,
          completionDate: new Date(),
          studentName: student.name
        }
      );

      logger.info(Course completion notification sent for student ${studentId} and course ${courseId}`);
    } catch (error) {
      logger.error('Failed to trigger course completion notification:', error);
    }
  }

  /**
   * Trigger notifications for quiz completion
   */
  static async triggerQuizCompletion(
    studentId: string,
    quizId: string,
    quizData: {
      score: number;
      totalQuestions: number;
      correctAnswers: number;
      timeTaken: number;
      passed: boolean;
    }
  ) {
    try {
      const [student, quiz, module, course] = await Promise.all([
        prisma.student.findUnique({
          where: { id: studentId }
        }),
        prisma.quiz.findUnique({
          where: { id: quizId }
        }),
        prisma.module.findFirst({
          where: { quizzes: { some: { id: quizId } } }
        }),
        prisma.course.findFirst({
          where: { modules: { some: { quizzes: { some: { id: quizId } } } } }
        })
      ]);

      if (!student || !quiz || !module || !course) {
        throw new Error(`Required data not found for quiz notification - Context: if (!student?.user || !quiz || !module || !course)...);
      }

      await notificationService.sendQuizCompletionNotification(
        student.id,
        quizId,
        quiz.title,
        module.title,
        course.title,
        {
          ...quizData,
          studentName: student.name
        }
      );

      logger.info(Quiz completion notification sent for student ${studentId} and quiz ${quizId}`);
    } catch (error) {
      logger.error('Failed to trigger quiz completion notification:', error);
    }
  }

  /**
   * Trigger notifications for achievement unlock
   */
  static async triggerAchievementUnlock(
    studentId: string,
    achievementId: string,
    achievementData: {
      name: string;
      description: string;
      type: string;
      points: number;
      icon?: string;
    }
  ) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId }
      });

      if (!student) {
        throw new Error(`Student not found - Context: const student = await prisma.student.findUnique({...);
      }

      await notificationService.sendAchievementNotification(
        student.id,
        achievementId,
        {
          ...achievementData,
          studentName: student.name
        }
      );

      logger.info(Achievement notification sent for student ${studentId} and achievement ${achievementId}`);
    } catch (error) {
      logger.error('Failed to trigger achievement notification:', error);
    }
  }

  /**
   * Trigger notifications for module completion
   */
  static async triggerModuleCompletion(
    studentId: string,
    moduleId: string,
    moduleData: {
      progress: number;
      totalContent: number;
      completedContent: number;
    }
  ) {
    try {
      const [student, module, course] = await Promise.all([
        prisma.student.findUnique({
          where: { id: studentId }
        }),
        prisma.module.findUnique({
          where: { id: moduleId }
        }),
        prisma.course.findFirst({
          where: { modules: { some: { id: moduleId } } }
        })
      ]);

      if (!student || !module || !course) {
        throw new Error(`Required data not found for module notification - Context: where: { id: moduleId }...);
      }

      await notificationService.sendModuleCompletionNotification(
        student.id,
        moduleId,
        module.title,
        course.title,
        {
          ...moduleData,
          studentName: student.name
        }
      );

      logger.info(Module completion notification sent for student ${studentId} and module ${moduleId}`);
    } catch (error) {
      logger.error('Failed to trigger module completion notification:', error);
    }
  }

  /**
   * Trigger notifications for learning streak milestone
   */
  static async triggerLearningStreak(
    studentId: string,
    streakData: {
      currentStreak: number;
      previousStreak: number;
      milestone: number;
    }
  ) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId }
      });

      if (!student) {
        throw new Error(`Student not found - Context: previousStreak: number;...);
      }

      await notificationService.sendLearningStreakNotification(
        student.id,
        {
          ...streakData,
          studentName: student.name
        }
      );

      logger.info(Learning streak notification sent for student ${studentId}`);
    } catch (error) {
      logger.error('Failed to trigger learning streak notification:', error);
    }
  }

  /**
   * Trigger notifications for subscription status change
   */
  static async triggerSubscriptionStatusChange(
    userId: string,
    subscriptionId: string,
    statusData: {
      oldStatus: string;
      newStatus: string;
      planName: string;
      reason?: string;
      effectiveDate: Date;
    }
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { student: true, institution: true }
      });

      if (!user) {
        throw new Error(`User not found - Context: planName: string;...);
      }

      const studentName = user.student?.name || user.institution?.name || 'User';

      await notificationService.sendSubscriptionStatusNotification(
        userId,
        subscriptionId,
        {
          ...statusData,
          studentName
        }
      );

      logger.info(Subscription status notification sent for user ${userId}`);
    } catch (error) {
      logger.error('Failed to trigger subscription status notification:', error);
    }
  }

  /**
   * Trigger notifications for payment reminder
   */
  static async triggerPaymentReminder(
    userId: string,
    paymentData: {
      amount: number;
      dueDate: Date;
      daysRemaining: number;
      courseName?: string;
      subscriptionPlan?: string;
    }
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { student: true }
      });

      if (!user) {
        throw new Error(`User not found - Context: dueDate: Date;...);
      }

      const studentName = user.student?.name || 'Student';

      await notificationService.sendPaymentReminderNotification(
        userId,
        {
          ...paymentData,
          userName: studentName
        }
      );

      logger.info(Payment reminder notification sent for user ${userId}`);
    } catch (error) {
      logger.error('Failed to trigger payment reminder notification:', error);
    }
  }

  /**
   * Trigger notifications for account update
   */
  static async triggerAccountUpdate(
    userId: string,
    updateData: {
      updateType: 'profile' | 'email' | 'password' | 'preferences';
      description: string;
    }
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { student: true, institution: true }
      });

      if (!user) {
        throw new Error(`User not found - Context: userId: string,...);
      }

      const userName = user.student?.name || user.institution?.name || 'User';

      await notificationService.sendAccountUpdateNotification(
        userId,
        updateData.updateType,
        {
          ...updateData,
          userName
        }
      );

      logger.info(Account update notification sent for user ${userId}`);
    } catch (error) {
      logger.error('Failed to trigger account update notification:', error);
    }
  }

  /**
   * Trigger notifications for password reset
   */
  static async triggerPasswordReset(
    userId: string,
    resetToken: string,
    resetUrl: string
  ) {
    try {
      await notificationService.sendPasswordResetNotification(
        userId,
        resetToken,
        resetUrl
      );

      logger.info(`Password reset notification sent for user ${userId}`);
    } catch (error) {
      logger.error('Failed to trigger password reset notification:', error);
    }
  }

  /**
   * Bulk notification trigger for multiple events
   */
  static async triggerBulkNotifications(events: Array<{
    type: string;
    userId: string;
    data: unknown;
  }>) {
    const results = [];

    for (const event of events) {
      try {
        switch (event.type) {
          case 'course_completion':
            await this.triggerCourseCompletion(event.userId, event.data.courseId, event.data);
            break;
          case 'quiz_completion':
            await this.triggerQuizCompletion(event.userId, event.data.quizId, event.data);
            break;
          case 'achievement_unlock':
            await this.triggerAchievementUnlock(event.userId, event.data.achievementId, event.data);
            break;
          case 'module_completion':
            await this.triggerModuleCompletion(event.userId, event.data.moduleId, event.data);
            break;
          case 'learning_streak':
            await this.triggerLearningStreak(event.userId, event.data);
            break;
          case 'subscription_status':
            await this.triggerSubscriptionStatusChange(event.userId, event.data.subscriptionId, event.data);
            break;
          case 'payment_reminder':
            await this.triggerPaymentReminder(event.userId, event.data);
            break;
          case 'account_update':
            await this.triggerAccountUpdate(event.userId, event.data);
            break;
          case 'password_reset':
            await this.triggerPasswordReset(event.userId, event.data.resetToken, event.data.resetUrl);
            break;
          default:
            logger.warn(`Unknown notification event type: ${event.type}`);
        }

        results.push({ type: event.type, userId: event.userId, success: true });
      } catch (error) {
        logger.error(`Failed to trigger notification for event ${event.type}:`, error);
        results.push({ type: event.type, userId: event.userId, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Trigger notifications for language proficiency test completion
   */
  static async triggerTestCompletion(
    studentId: string,
    testData: {
      language: string;
      score: number;
      level: string;
      timeSpent: number;
    }
  ) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId }
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Send test completion notification
      await notificationService.sendNotificationWithTemplate(
        'test_completion',
        student.id,
        {
          name: student.name,
          language: testData.language,
          score: testData.score,
          level: testData.level,
          timeSpent: Math.floor(testData.timeSpent / 60), // Convert to minutes
          completionDate: new Date().toLocaleDateString()
        },
        {
          testType: 'language_proficiency',
          language: testData.language,
          score: testData.score,
          level: testData.level
        },
        'SYSTEM'
      );

      logger.info(`Test completion notification sent for student ${studentId}`);
    } catch (error) {
      logger.error('Failed to trigger test completion notification:', error);
    }
  }
}

export default NotificationIntegrationService; 