import { prisma } from './prisma';
import { logger } from './logger';

export interface UsageMetrics {
  userId: string;
  subscriptionId: string;
  currentEnrollments: number;
  maxEnrollments: number;
  monthlyEnrollments: number;
  monthlyAttendance: number;
  maxMonthlyAttendance: number;
  usagePercentage: number;
  isApproachingLimit: boolean;
  daysUntilReset: number;
}

export interface PlatformUsageStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalEnrollments: number;
  totalLiveClasses: number;
  averageCompletionRate: number;
  topCourses: Array<{
    courseId: string;
    title: string;
    enrollments: number;
    completionRate: number;
  }>;
  subscriptionDistribution: Record<string, number>;
}

export interface AlertThresholds {
  enrollmentUsageThreshold: number; // percentage
  attendanceUsageThreshold: number; // percentage
  gracePeriodThreshold: number; // days
}

export class UsageAnalyticsService {
  private static readonly DEFAULT_ALERT_THRESHOLDS: AlertThresholds = {
    enrollmentUsageThreshold: 80, // 80%
    attendanceUsageThreshold: 80, // 80%
    gracePeriodThreshold: 3 // 3 days
  };

  /**
   * Track enrollment usage for a user
   */
  static async trackEnrollmentUsage(userId: string, courseId: string): Promise<void> {
    try {
      // Get user's subscription
      const subscription = await prisma.studentSubscription.findUnique({
        where: { studentId: userId },
        include: { studentTier: true }
      });

      if (!subscription) {
        logger.warn(`No subscription found for user ${userId} when tracking enrollment usage`);
        return;
      }

      // Update usage metrics
      await prisma.studentSubscription.update({
        where: { studentId: userId },
        data: {
          currentEnrollments: { increment: 1 },
          monthlyEnrollments: { increment: 1 }
        }
      });

      // Check if approaching limits
      const usageMetrics = await this.getUserUsageMetrics(userId);
      if (usageMetrics.isApproachingLimit) {
        await this.generateUsageAlert(userId, 'ENROLLMENT_LIMIT_APPROACHING', usageMetrics);
      }

      logger.info(`Tracked enrollment usage for user ${userId} in course ${courseId}`);

    } catch (error) {
      logger.error('Error tracking enrollment usage:', error);
    }
  }

  /**
   * Track live class attendance for a user
   */
  static async trackAttendanceUsage(userId: string, sessionId: string): Promise<void> {
    try {
      // Get user's subscription
      const subscription = await prisma.studentSubscription.findUnique({
        where: { studentId: userId },
        include: { studentTier: true }
      });

      if (!subscription) {
        logger.warn(`No subscription found for user ${userId} when tracking attendance usage`);
        return;
      }

      // Update attendance metrics
      await prisma.studentSubscription.update({
        where: { studentId: userId },
        data: {
          monthlyAttendance: { increment: 1 }
        }
      });

      // Check if approaching limits
      const usageMetrics = await this.getUserUsageMetrics(userId);
      if (usageMetrics.isApproachingLimit) {
        await this.generateUsageAlert(userId, 'ATTENDANCE_LIMIT_APPROACHING', usageMetrics);
      }

      logger.info(`Tracked attendance usage for user ${userId} in session ${sessionId}`);

    } catch (error) {
      logger.error('Error tracking attendance usage:', error);
    }
  }

  /**
   * Get comprehensive usage metrics for a user
   */
  static async getUserUsageMetrics(userId: string): Promise<UsageMetrics> {
    try {
      const subscription = await prisma.studentSubscription.findUnique({
        where: { studentId: userId },
        include: { studentTier: true }
      });

      if (!subscription) {
        throw new Error('No subscription found for user');
      }

      const currentEnrollments = await prisma.studentCourseEnrollment.count({
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

      const maxEnrollments = subscription.studentTier.enrollmentQuota;
      const maxMonthlyAttendance = subscription.studentTier.attendanceQuota;

      const enrollmentUsagePercentage = (currentEnrollments / maxEnrollments) * 100;
      const attendanceUsagePercentage = (monthlyAttendance / maxMonthlyAttendance) * 100;

      const isApproachingLimit = 
        enrollmentUsagePercentage >= this.DEFAULT_ALERT_THRESHOLDS.enrollmentUsageThreshold ||
        attendanceUsagePercentage >= this.DEFAULT_ALERT_THRESHOLDS.attendanceUsageThreshold;

      // Calculate days until monthly reset
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const daysUntilReset = Math.ceil((nextMonth.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

      return {
        userId,
        subscriptionId: subscription.id,
        currentEnrollments,
        maxEnrollments,
        monthlyEnrollments: subscription.monthlyEnrollments,
        monthlyAttendance,
        maxMonthlyAttendance,
        usagePercentage: Math.max(enrollmentUsagePercentage, attendanceUsagePercentage),
        isApproachingLimit,
        daysUntilReset
      };

    } catch (error) {
      logger.error('Error getting user usage metrics:', error);
      throw error;
    }
  }

  /**
   * Generate usage alerts for approaching limits
   */
  private static async generateUsageAlert(
    userId: string, 
    alertType: string, 
    usageMetrics: UsageMetrics
  ): Promise<void> {
    try {
      // Create alert record
      await prisma.systemNotification.create({
        data: {
          title: 'Usage Limit Alert',
          content: this.generateAlertMessage(alertType, usageMetrics),
          type: alertType,
          priority: 'MEDIUM',
          isActive: true,
          isGlobal: false,
          createdBy: userId // Use createdBy instead of userId
        }
      });

      logger.info(`Generated usage alert for user ${userId}: ${alertType}`);

    } catch (error) {
      logger.error('Error generating usage alert:', error);
    }
  }

  /**
   * Generate alert message based on alert type
   */
  private static generateAlertMessage(alertType: string, usageMetrics: UsageMetrics): string {
    switch (alertType) {
      case 'ENROLLMENT_LIMIT_APPROACHING':
        return `You have used ${usageMetrics.currentEnrollments}/${usageMetrics.maxEnrollments} enrollments (${Math.round(usageMetrics.usagePercentage)}%). Consider upgrading your subscription for more enrollments.`;
      
      case 'ATTENDANCE_LIMIT_APPROACHING':
        return `You have attended ${usageMetrics.monthlyAttendance}/${usageMetrics.maxMonthlyAttendance} live classes this month (${Math.round(usageMetrics.usagePercentage)}%). Consider upgrading your subscription for more live class access.`;
      
      default:
        return 'You are approaching your usage limits. Consider upgrading your subscription.';
    }
  }

  /**
   * Get platform-wide usage statistics
   */
  static async getPlatformUsageStats(): Promise<PlatformUsageStats> {
    try {
      const [
        totalUsers,
        activeSubscriptions,
        totalEnrollments,
        totalLiveClasses
      ] = await Promise.all([
        prisma.user.count({
          where: { role: 'STUDENT' }
        }),
        prisma.studentSubscription.count({
          where: { status: 'ACTIVE' }
        }),
        prisma.studentCourseEnrollment.count({
          where: { isActive: true }
        }),
        prisma.videoSession.count({
          where: {
            status: {
              in: ['SCHEDULED', 'ACTIVE', 'COMPLETED']
            }
          }
        })
      ]);

      // Get top courses by enrollment
      const topCourses = await prisma.studentCourseEnrollment.groupBy({
        by: ['courseId'],
        where: { isActive: true },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      });

      // Get completion rates for top courses
      const topCoursesWithStats = await Promise.all(
        topCourses.map(async (course) => {
          const [totalEnrollments, completedEnrollments] = await Promise.all([
            prisma.studentCourseEnrollment.count({
              where: { courseId: course.courseId }
            }),
            prisma.studentCourseEnrollment.count({
              where: {
                courseId: course.courseId,
                status: 'COMPLETED'
              }
            })
          ]);

          const courseDetails = await prisma.course.findUnique({
            where: { id: course.courseId },
            select: { title: true }
          });

          return {
            courseId: course.courseId,
            title: courseDetails?.title || 'Unknown Course',
            enrollments: course._count.id,
            completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0
          };
        })
      );

      // Get subscription distribution
      const subscriptionDistribution = await prisma.studentSubscription.groupBy({
        by: ['planType'],
        where: { status: 'ACTIVE' },
        _count: {
          id: true
        }
      });

      const distribution = subscriptionDistribution.reduce((acc, item) => {
        acc[item.planType] = item._count.id;
        return acc;
      }, {} as Record<string, number>);

      // Calculate average completion rate
      const [totalCourseEnrollments, totalCompletedEnrollments] = await Promise.all([
        prisma.studentCourseEnrollment.count(),
        prisma.studentCourseEnrollment.count({
          where: { status: 'COMPLETED' }
        })
      ]);

      const averageCompletionRate = totalCourseEnrollments > 0 
        ? (totalCompletedEnrollments / totalCourseEnrollments) * 100 
        : 0;

      return {
        totalUsers,
        activeSubscriptions,
        totalEnrollments,
        totalLiveClasses,
        averageCompletionRate,
        topCourses: topCoursesWithStats,
        subscriptionDistribution: distribution
      };

    } catch (error) {
      logger.error('Error getting platform usage stats:', error);
      throw error;
    }
  }

  /**
   * Get users approaching usage limits
   */
  static async getUsersApproachingLimits(): Promise<UsageMetrics[]> {
    try {
      const subscriptions = await prisma.studentSubscription.findMany({
        where: { status: 'ACTIVE' },
        include: { studentTier: true }
      });

      const usersWithMetrics = await Promise.all(
        subscriptions.map(async (subscription) => {
          try {
            return await this.getUserUsageMetrics(subscription.studentId);
          } catch (error) {
            logger.error(`Error getting metrics for user ${subscription.studentId}:`, error);
            return null;
          }
        })
      );

      return usersWithMetrics
        .filter((metrics): metrics is UsageMetrics => metrics !== null)
        .filter(metrics => metrics.isApproachingLimit)
        .sort((a, b) => b.usagePercentage - a.usagePercentage);

    } catch (error) {
      logger.error('Error getting users approaching limits:', error);
      throw error;
    }
  }

  /**
   * Generate subscription report for an institution
   */
  static async generateInstitutionReport(institutionId: string) {
    try {
      const [
        totalCourses,
        totalEnrollments,
        totalLiveClasses,
        totalRevenue
      ] = await Promise.all([
        prisma.course.count({
          where: { institutionId }
        }),
        prisma.studentCourseEnrollment.count({
          where: {
            course: { institutionId },
            isActive: true
          }
        }),
        prisma.videoSession.count({
          where: { institutionId }
        }),
        prisma.booking.aggregate({
          where: { institutionId },
          _sum: { amount: true }
        })
      ]);

      // Get course completion rates
      const courses = await prisma.course.findMany({
        where: { institutionId },
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              videoSessions: true
            }
          }
        }
      });

      const courseStats = await Promise.all(
        courses.map(async (course) => {
          const [totalEnrollments, completedEnrollments] = await Promise.all([
            prisma.studentCourseEnrollment.count({
              where: { courseId: course.id }
            }),
            prisma.studentCourseEnrollment.count({
              where: {
                courseId: course.id,
                status: 'COMPLETED'
              }
            })
          ]);

          return {
            courseId: course.id,
            title: course.title,
            totalEnrollments,
            completedEnrollments,
            completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0,
            liveClasses: course._count.videoSessions
          };
        })
      );

      return {
        institutionId,
        totalCourses,
        totalEnrollments,
        totalLiveClasses,
        totalRevenue: totalRevenue._sum.amount || 0,
        courseStats,
        averageCompletionRate: courseStats.length > 0 
          ? courseStats.reduce((sum, course) => sum + course.completionRate, 0) / courseStats.length 
          : 0
      };

    } catch (error) {
      logger.error('Error generating institution report:', error);
      throw error;
    }
  }

  /**
   * Monitor and alert on system health
   */
  static async monitorSystemHealth(): Promise<{
    isHealthy: boolean;
    issues: string[];
    metrics: Record<string, any>;
  }> {
    const issues: string[] = [];
    const metrics: Record<string, any> = {};

    try {
      // Check database connectivity
      try {
        await prisma.$queryRaw`SELECT 1`;
        metrics.databaseStatus = 'healthy';
      } catch (error) {
        issues.push('Database connectivity issue');
        metrics.databaseStatus = 'unhealthy';
      }

      // Check for expired subscriptions
      const expiredSubscriptions = await prisma.studentSubscription.count({
        where: {
          status: 'ACTIVE',
          endDate: {
            lt: new Date()
          }
        }
      });

      if (expiredSubscriptions > 0) {
        issues.push(`${expiredSubscriptions} expired subscriptions found`);
      }
      metrics.expiredSubscriptions = expiredSubscriptions;

      // Check for orphaned enrollments
      const orphanedEnrollments = await prisma.studentCourseEnrollment.count({
        where: {
          isActive: true,
          course: null
        }
      });

      if (orphanedEnrollments > 0) {
        issues.push(`${orphanedEnrollments} orphaned enrollments found`);
      }
      metrics.orphanedEnrollments = orphanedEnrollments;

      // Check system performance
      const startTime = Date.now();
      await prisma.studentSubscription.count();
      const queryTime = Date.now() - startTime;
      
      if (queryTime > 1000) {
        issues.push('Slow database queries detected');
      }
      metrics.averageQueryTime = queryTime;

      return {
        isHealthy: issues.length === 0,
        issues,
        metrics
      };

    } catch (error) {
      logger.error('Error monitoring system health:', error);
      return {
        isHealthy: false,
        issues: ['System health monitoring failed'],
        metrics: {}
      };
    }
  }
} 