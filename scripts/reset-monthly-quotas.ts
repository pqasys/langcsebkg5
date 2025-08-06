import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function resetMonthlyQuotas() {
  try {
    logger.info('Starting monthly quota reset process...');

    // Get all active subscriptions
    const activeSubscriptions = await prisma.studentSubscription.findMany({
      where: { status: 'ACTIVE' },
      include: { studentTier: true }
    });

    logger.info(`Found ${activeSubscriptions.length} active subscriptions to process`);

    let resetCount = 0;
    let errorCount = 0;

    for (const subscription of activeSubscriptions) {
      try {
        // Reset monthly quotas
        await prisma.studentSubscription.update({
          where: { id: subscription.id },
          data: {
            monthlyEnrollments: 0,
            monthlyAttendance: 0,
            updatedAt: new Date()
          }
        });

        // Log the reset
        await prisma.subscriptionLog.create({
          data: {
            subscriptionId: subscription.id,
            action: 'MONTHLY_QUOTA_RESET',
            userId: subscription.studentId,
            reason: 'Monthly quota reset - automated process',
            metadata: {
              previousMonthlyEnrollments: subscription.monthlyEnrollments,
              previousMonthlyAttendance: subscription.monthlyAttendance,
              resetAt: new Date()
            }
          }
        });

        resetCount++;
        logger.info(`Reset quotas for subscription ${subscription.id} (user: ${subscription.studentId})`);

      } catch (error) {
        errorCount++;
        logger.error(`Error resetting quotas for subscription ${subscription.id}:`, error);
      }
    }

    // Create a summary log
    await prisma.auditLog.create({
      data: {
        action: 'MONTHLY_QUOTA_RESET_BATCH',
        userId: 'SYSTEM',
        resourceType: 'SUBSCRIPTION',
        resourceId: 'BATCH',
        details: {
          totalSubscriptions: activeSubscriptions.length,
          successfulResets: resetCount,
          failedResets: errorCount,
          resetAt: new Date()
        },
        ipAddress: 'SYSTEM',
        userAgent: 'CRON_JOB'
      }
    });

    logger.info(`Monthly quota reset completed. Success: ${resetCount}, Errors: ${errorCount}`);

    // Send notifications to users who were near their limits
    await sendQuotaResetNotifications(activeSubscriptions);

  } catch (error) {
    logger.error('Error during monthly quota reset:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function sendQuotaResetNotifications(subscriptions: any[]) {
  try {
    const usersNearLimit = subscriptions.filter(sub => 
      sub.monthlyEnrollments >= sub.studentTier.enrollmentQuota * 0.8 ||
      sub.monthlyAttendance >= sub.studentTier.attendanceQuota * 0.8
    );

    logger.info(`Sending quota reset notifications to ${usersNearLimit.length} users`);

    for (const subscription of usersNearLimit) {
      try {
        await prisma.systemNotification.create({
          data: {
            userId: subscription.studentId,
            type: 'QUOTA_RESET',
            title: 'Monthly Quotas Reset',
            message: `Your monthly enrollment and attendance quotas have been reset. You now have ${subscription.studentTier.enrollmentQuota} enrollments and ${subscription.studentTier.attendanceQuota} live class attendances available for this month.`,
            priority: 'LOW',
            isRead: false,
            metadata: {
              previousEnrollments: subscription.monthlyEnrollments,
              previousAttendance: subscription.monthlyAttendance,
              newEnrollmentQuota: subscription.studentTier.enrollmentQuota,
              newAttendanceQuota: subscription.studentTier.attendanceQuota
            }
          }
        });

        logger.info(`Sent quota reset notification to user ${subscription.studentId}`);

      } catch (error) {
        logger.error(`Error sending notification to user ${subscription.studentId}:`, error);
      }
    }

  } catch (error) {
    logger.error('Error sending quota reset notifications:', error);
  }
}

// Function to check if it's the first day of the month
function isFirstDayOfMonth(): boolean {
  const now = new Date();
  return now.getDate() === 1;
}

// Function to check if it's time to run the reset (e.g., 2 AM)
function isResetTime(): boolean {
  const now = new Date();
  return now.getHours() === 2 && now.getMinutes() === 0;
}

// Main execution function
async function main() {
  try {
    // Check if it's the right time to run the reset
    if (!isFirstDayOfMonth()) {
      logger.info('Not the first day of the month, skipping quota reset');
      return;
    }

    if (!isResetTime()) {
      logger.info('Not reset time (2 AM), skipping quota reset');
      return;
    }

    await resetMonthlyQuotas();
    logger.info('Monthly quota reset process completed successfully');

  } catch (error) {
    logger.error('Monthly quota reset process failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('Monthly quota reset completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Monthly quota reset failed:', error);
      process.exit(1);
    });
}

export { resetMonthlyQuotas, main }; 