import { prisma } from './prisma';
import { logger } from './logger';

export interface SubscriptionUpgradeRequest {
  userId: string;
  newTierId: string;
  reason?: string;
  immediateUpgrade?: boolean;
}

export interface SubscriptionDowngradeRequest {
  userId: string;
  newTierId: string;
  reason?: string;
  effectiveDate?: Date;
}

export interface GracePeriodInfo {
  isInGracePeriod: boolean;
  daysRemaining: number;
  expiryDate: Date;
}

export class SubscriptionManagementService {
  /**
   * Upgrade user subscription with prorated billing
   */
  static async upgradeSubscription(request: SubscriptionUpgradeRequest) {
    const { userId, newTierId, reason, immediateUpgrade = true } = request;

    try {
      // Get current subscription
      const currentSubscription = await prisma.studentSubscription.findUnique({
        where: { studentId: userId },
        include: { studentTier: true }
      });

      if (!currentSubscription) {
        throw new Error('No active subscription found');
      }

      // Get new tier
      const newTier = await prisma.studentTier.findUnique({
        where: { id: newTierId }
      });

      if (!newTier) {
        throw new Error('Invalid tier ID');
      }

      // Calculate prorated amount
      const proratedAmount = await this.calculateProratedAmount(
        currentSubscription,
        newTier,
        immediateUpgrade
      );

      // Update subscription immediately if requested
      if (immediateUpgrade) {
        const updatedSubscription = await prisma.studentSubscription.update({
          where: { studentId: userId },
          data: {
            studentTierId: newTierId,
            planType: newTier.planType,
            // Update limits immediately
            maxEnrollments: newTier.enrollmentQuota,
            enrollmentQuota: newTier.enrollmentQuota,
            attendanceQuota: newTier.attendanceQuota,
            updatedAt: new Date()
          }
        });

        // Log the upgrade
        await prisma.subscriptionLog.create({
          data: {
            subscriptionId: currentSubscription.id,
            action: 'UPGRADE',
            oldPlan: currentSubscription.planType,
            newPlan: newTier.planType,
            oldAmount: currentSubscription.studentTier.price,
            newAmount: newTier.price,
            userId,
            reason: reason || 'User requested upgrade',
            metadata: {
              proratedAmount,
              immediateUpgrade
            }
          }
        });

        logger.info(`Subscription upgraded for user ${userId} from ${currentSubscription.planType} to ${newTier.planType}`);

        return {
          success: true,
          subscription: updatedSubscription,
          proratedAmount,
          message: 'Subscription upgraded successfully'
        };
      } else {
        // Schedule upgrade for next billing cycle
        await prisma.subscriptionLog.create({
          data: {
            subscriptionId: currentSubscription.id,
            action: 'UPGRADE_SCHEDULED',
            oldPlan: currentSubscription.planType,
            newPlan: newTier.planType,
            oldAmount: currentSubscription.studentTier.price,
            newAmount: newTier.price,
            userId,
            reason: reason || 'User requested scheduled upgrade',
            metadata: {
              scheduledUpgrade: true,
              effectiveDate: currentSubscription.endDate
            }
          }
        });

        return {
          success: true,
          message: 'Upgrade scheduled for next billing cycle',
          effectiveDate: currentSubscription.endDate
        };
      }
    } catch (error) {
      logger.error('Error upgrading subscription:', error);
      throw error;
    }
  }

  /**
   * Downgrade user subscription with grace period
   */
  static async downgradeSubscription(request: SubscriptionDowngradeRequest) {
    const { userId, newTierId, reason, effectiveDate } = request;

    try {
      // Get current subscription
      const currentSubscription = await prisma.studentSubscription.findUnique({
        where: { studentId: userId },
        include: { studentTier: true }
      });

      if (!currentSubscription) {
        throw new Error('No active subscription found');
      }

      // Get new tier
      const newTier = await prisma.studentTier.findUnique({
        where: { id: newTierId }
      });

      if (!newTier) {
        throw new Error('Invalid tier ID');
      }

      // Check for active enrollments that exceed new limits
      const activeEnrollments = await prisma.studentCourseEnrollment.count({
        where: {
          studentId: userId,
          isActive: true
        }
      });

      if (activeEnrollments > newTier.enrollmentQuota) {
        throw new Error(`Cannot downgrade: ${activeEnrollments} active enrollments exceed new limit of ${newTier.enrollmentQuota}`);
      }

      // Check current enrollments vs new limit
      if (currentSubscription.currentEnrollments > newTier.enrollmentQuota) {
        throw new Error(`Cannot downgrade: ${currentSubscription.currentEnrollments} current enrollments exceed new limit of ${newTier.enrollmentQuota}`);
      }

      // Schedule downgrade
      const effectiveDateToUse = effectiveDate || currentSubscription.endDate;

      await prisma.subscriptionLog.create({
        data: {
          subscriptionId: currentSubscription.id,
          action: 'DOWNGRADE_SCHEDULED',
          oldPlan: currentSubscription.planType,
          newPlan: newTier.planType,
          oldAmount: currentSubscription.studentTier.price,
          newAmount: newTier.price,
          userId,
          reason: reason || 'User requested downgrade',
          metadata: {
            effectiveDate: effectiveDateToUse,
            gracePeriodDays: newTier.gracePeriodDays
          }
        }
      });

      logger.info(`Subscription downgrade scheduled for user ${userId} from ${currentSubscription.planType} to ${newTier.planType}`);

      return {
        success: true,
        message: 'Downgrade scheduled successfully',
        effectiveDate: effectiveDateToUse,
        gracePeriodDays: newTier.gracePeriodDays
      };
    } catch (error) {
      logger.error('Error downgrading subscription:', error);
      throw error;
    }
  }

  /**
   * Handle grace period for expired subscriptions
   */
  static async handleGracePeriod(userId: string): Promise<GracePeriodInfo> {
    try {
      const subscription = await prisma.studentSubscription.findUnique({
        where: { studentId: userId },
        include: { studentTier: true }
      });

      if (!subscription) {
        return {
          isInGracePeriod: false,
          daysRemaining: 0,
          expiryDate: new Date()
        };
      }

      const now = new Date();
      const endDate = new Date(subscription.endDate);
      const gracePeriodEnd = new Date(endDate.getTime() + (subscription.studentTier.gracePeriodDays * 24 * 60 * 60 * 1000));

      const isInGracePeriod = now > endDate && now <= gracePeriodEnd;
      const daysRemaining = isInGracePeriod 
        ? Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        : 0;

      return {
        isInGracePeriod,
        daysRemaining,
        expiryDate: gracePeriodEnd
      };
    } catch (error) {
      logger.error('Error handling grace period:', error);
      throw error;
    }
  }

  /**
   * Check if user can enroll in a course
   */
  static async canEnrollInCourse(userId: string, courseId: string): Promise<boolean> {
    try {
      const subscription = await prisma.studentSubscription.findUnique({
        where: { studentId: userId },
        include: { studentTier: true }
      });

      if (!subscription || subscription.status !== 'ACTIVE') {
        return false;
      }

      // Check enrollment quota
      if (subscription.currentEnrollments >= subscription.studentTier.enrollmentQuota) {
        return false;
      }

      // Check monthly enrollment quota
      if (subscription.monthlyEnrollments >= subscription.studentTier.enrollmentQuota) {
        return false;
      }

      // Check if already enrolled
      const existingEnrollment = await prisma.studentCourseEnrollment.findFirst({
        where: {
          studentId: userId,
          courseId,
          isActive: true
        }
      });

      if (existingEnrollment) {
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error checking enrollment eligibility:', error);
      return false;
    }
  }

  /**
   * Check if user can join a live class
   */
  static async canJoinLiveClass(userId: string, sessionId: string): Promise<boolean> {
    try {
      const subscription = await prisma.studentSubscription.findUnique({
        where: { studentId: userId },
        include: { studentTier: true }
      });

      if (!subscription || subscription.status !== 'ACTIVE') {
        return false;
      }

      // Check attendance quota
      if (subscription.monthlyAttendance >= subscription.studentTier.attendanceQuota) {
        return false;
      }

      // Check if already joined
      const existingParticipation = await prisma.videoSessionParticipant.findUnique({
        where: {
          sessionId_userId: {
            sessionId,
            userId
          }
        }
      });

      if (existingParticipation) {
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error checking live class eligibility:', error);
      return false;
    }
  }

  /**
   * Calculate prorated amount for subscription changes
   */
  private static async calculateProratedAmount(
    currentSubscription: any,
    newTier: any,
    immediateUpgrade: boolean
  ): Promise<number> {
    const now = new Date();
    const endDate = new Date(currentSubscription.endDate);
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    const totalDays = Math.ceil((endDate.getTime() - new Date(currentSubscription.startDate).getTime()) / (24 * 60 * 60 * 1000));

    if (immediateUpgrade) {
      // Calculate prorated credit for remaining days on current plan
      const currentPlanCredit = (currentSubscription.studentTier.price / totalDays) * daysRemaining;
      
      // Calculate prorated charge for remaining days on new plan
      const newPlanCharge = (newTier.price / totalDays) * daysRemaining;
      
      return Math.max(0, newPlanCharge - currentPlanCredit);
    }

    return 0;
  }

  /**
   * Reset monthly quotas
   */
  static async resetMonthlyQuotas() {
    try {
      const result = await prisma.studentSubscription.updateMany({
        where: {
          status: 'ACTIVE'
        },
        data: {
          monthlyEnrollments: 0,
          monthlyAttendance: 0
        }
      });

      logger.info(`Reset monthly quotas for ${result.count} subscriptions`);
      return result.count;
    } catch (error) {
      logger.error('Error resetting monthly quotas:', error);
      throw error;
    }
  }

  /**
   * Get subscription usage statistics
   */
  static async getSubscriptionUsage(userId: string) {
    try {
      const subscription = await prisma.studentSubscription.findUnique({
        where: { studentId: userId },
        include: { studentTier: true }
      });

      if (!subscription) {
        return null;
      }

      const activeEnrollments = await prisma.studentCourseEnrollment.count({
        where: {
          studentId: userId,
          isActive: true
        }
      });

      const monthlyAttendance = await prisma.videoSessionParticipant.count({
        where: {
          userId,
          joinedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      });

      return {
        subscription,
        usage: {
          currentEnrollments: activeEnrollments,
          maxEnrollments: subscription.studentTier.enrollmentQuota,
          monthlyAttendance,
          maxMonthlyAttendance: subscription.studentTier.attendanceQuota,
          enrollmentUsagePercentage: (activeEnrollments / subscription.studentTier.enrollmentQuota) * 100,
          attendanceUsagePercentage: (monthlyAttendance / subscription.studentTier.attendanceQuota) * 100
        }
      };
    } catch (error) {
      logger.error('Error getting subscription usage:', error);
      throw error;
    }
  }
} 