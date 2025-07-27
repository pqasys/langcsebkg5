import { prisma } from './prisma';
import { notificationService } from './notification';
import { logger } from './logger';
import { CronJob } from 'cron';

export class NotificationScheduler {
  private static jobs: Map<string, CronJob> = new Map();

  /**
   * Initialize all scheduled notifications
   */
  static async initialize() {
    logger.info('Initializing notification scheduler...');
    
    // Schedule daily payment reminders
    this.schedulePaymentReminders();
    
    // Schedule learning streak checks
    this.scheduleLearningStreakChecks();
    
    // Schedule subscription expiry reminders
    this.scheduleSubscriptionReminders();
    
    // Schedule course completion reminders
    this.scheduleCourseCompletionReminders();
    
    logger.info('Notification scheduler initialized successfully');
  }

  /**
   * Schedule daily payment reminders
   */
  private static schedulePaymentReminders() {
    const job = new CronJob('0 9 * * *', async () => { // 9 AM daily
      try {
        logger.info('Running daily payment reminders...');
        
        // Get pending payments due in the next 3 days
        const pendingPayments = await prisma.payment.findMany({
          where: {
            status: 'PENDING',
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          },
          include: {
            enrollment: {
              include: {
                            student: true,
                course: true
              }
            }
          }
        });

        for (const payment of pendingPayments) {
          const dueDate = new Date(payment.createdAt);
          dueDate.setDate(dueDate.getDate() + 7); // 7 days from creation
          const daysRemaining = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          if (daysRemaining <= 3 && daysRemaining > 0) {
            await notificationService.sendPaymentReminderNotification(
              payment.enrollment.student.id,
              {
                amount: payment.amount,
                dueDate,
                daysRemaining,
                courseName: payment.enrollment.course.title,
                userName: payment.enrollment.student.name
              }
            );
          }
        }

        logger.info(`Sent ${pendingPayments.length} payment reminders`);
      } catch (error) {
        logger.error('Error in payment reminder job:', error);
      }
    });

    this.jobs.set('payment-reminders', job);
    job.start();
  }

  /**
   * Schedule learning streak checks
   */
  private static scheduleLearningStreakChecks() {
    const job = new CronJob('0 8 * * *', async () => { // 8 AM daily
      try {
        logger.info('Running learning streak checks...');
        
        // Get students with active enrollments
        const activeEnrollments = await prisma.studentCourseEnrollment.findMany({
          where: {
            status: 'ENROLLED',
            paymentStatus: 'PAID'
          },
          include: {
            student: true
          }
        });

        for (const enrollment of activeEnrollments) {
          // Check learning activity in the last 7 days
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          
          const recentActivity = await prisma.studentActivity.findMany({
            where: {
              studentId: enrollment.studentId,
              createdAt: {
                gte: sevenDaysAgo
              }
            }
          });

          const currentStreak = this.calculateLearningStreak(recentActivity);
          
          // Check for milestone achievements
          const milestones = [7, 14, 30, 60, 90, 180, 365];
          for (const milestone of milestones) {
            if (currentStreak === milestone) {
              await notificationService.sendLearningStreakNotification(
                enrollment.student.id,
                {
                  currentStreak,
                  previousStreak: currentStreak - 1,
                  milestone,
                  studentName: enrollment.student.name
                }
              );
              break;
            }
          }
        }

        logger.info('Learning streak checks completed');
      } catch (error) {
        logger.error('Error in learning streak job:', error);
      }
    });

    this.jobs.set('learning-streaks', job);
    job.start();
  }

  /**
   * Schedule subscription reminders
   */
  private static scheduleSubscriptionReminders() {
    const job = new CronJob('0 10 * * *', async () => { // 10 AM daily
      try {
        logger.info('Running subscription reminders...');
        
        // Check for expiring subscriptions
        const expiringSubscriptions = await prisma.studentSubscription.findMany({
          where: {
            status: 'ACTIVE',
            endDate: {
              gte: new Date(),
              lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
            }
          },
          include: {
            student: {
              include: { user: true }
            }
          }
        });

        for (const subscription of expiringSubscriptions) {
          const daysUntilExpiry = Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilExpiry <= 3) {
            await notificationService.sendSubscriptionStatusNotification(
              subscription.student.user.id,
              subscription.id,
              {
                oldStatus: 'ACTIVE',
                newStatus: 'EXPIRING',
                planName: `${subscription.planType} Plan`,
                reason: `Subscription expires in ${daysUntilExpiry} days`,
                effectiveDate: subscription.endDate,
                studentName: subscription.student.name
              }
            );
          }
        }

        logger.info(`Sent ${expiringSubscriptions.length} subscription reminders`);
      } catch (error) {
        logger.error('Error in subscription reminder job:', error);
      }
    });

    this.jobs.set('subscription-reminders', job);
    job.start();
  }

  /**
   * Schedule course completion reminders
   */
  private static scheduleCourseCompletionReminders() {
    const job = new CronJob('0 11 * * *', async () => { // 11 AM daily
      try {
        logger.info('Running course completion reminders...');
        
        // Find enrollments that are close to completion but haven't been completed
        const nearCompletionEnrollments = await prisma.studentCourseEnrollment.findMany({
          where: {
            status: 'ENROLLED',
            paymentStatus: 'PAID',
            progress: {
              gte: 80 // 80% or more complete
            }
          },
          include: {
            student: true,
            course: true
          }
        });

        for (const enrollment of nearCompletionEnrollments) {
          // Check if they haven't been reminded in the last 3 days
          const lastReminder = await prisma.notification.findFirst({
            where: {
              userId: enrollment.student.id,
              type: 'course_completion_reminder',
              createdAt: {
                gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
              }
            }
          });

          if (!lastReminder) {
            await notificationService.sendNotificationWithTemplate(
              'course_completion_reminder',
              enrollment.student.id,
              {
                name: enrollment.student.name,
                courseName: enrollment.course.title,
                progress: `${enrollment.progress}%`,
                remainingContent: `${100 - enrollment.progress}%`
              },
              {
                enrollmentId: enrollment.id,
                courseId: enrollment.courseId,
                progress: enrollment.progress
              },
              'SYSTEM'
            );
          }
        }

        logger.info(`Sent ${nearCompletionEnrollments.length} completion reminders`);
      } catch (error) {
        logger.error('Error in course completion reminder job:', error);
      }
    });

    this.jobs.set('completion-reminders', job);
    job.start();
  }

  /**
   * Calculate learning streak from activity data
   */
  private static calculateLearningStreak(activities: unknown[]): number {
    if (activities.length === 0) return 0;

    const sortedActivities = activities.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) { // Check up to 1 year
      const activityOnDate = sortedActivities.find(activity => {
        const activityDate = new Date(activity.createdAt);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === currentDate.getTime();
      });

      if (activityOnDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Stop all scheduled jobs
   */
  static stopAll() {
    logger.info('Stopping all notification scheduler jobs...');
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped job: ${name}`);
    });
    this.jobs.clear();
  }

  /**
   * Get job status
   */
  static getJobStatus() {
    const status: Record<string, boolean> = {};
    this.jobs.forEach((job, name) => {
      status[name] = job.running;
    });
    return status;
  }
}

export default NotificationScheduler; 