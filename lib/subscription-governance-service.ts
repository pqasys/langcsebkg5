import { prisma } from './prisma';

/**
 * Subscription Enrollment Governance Service
 * 
 * This service handles all subscription-based enrollment governance including:
 * - Enrollment limit checking
 * - Attendance quota management
 * - Plan downgrade handling
 * - Usage tracking and analytics
 */

export interface EnrollmentCheckResult {
  canEnroll: boolean;
  reason?: string;
  limits?: {
    current: number;
    max: number;
    remaining: number;
  };
}

export interface AttendanceCheckResult {
  canAttend: boolean;
  reason?: string;
  quotaInfo?: {
    used: number;
    max: number;
    remaining: number;
  };
}

export interface SubscriptionUsage {
  subscription: any;
  usage: {
    enrollments: {
      current: number;
      max: number;
      percentage: number;
    };
    monthlyAttendance: {
      current: number;
      max: number;
      percentage: number;
    };
    monthlyEnrollments: {
      current: number;
      max: number;
      percentage: number;
    };
  };
  activeEnrollments: any[];
}

export class SubscriptionGovernanceService {
  /**
   * Check if user can enroll in platform course
   */
  static async canEnrollInPlatformCourse(userId: string, courseId: string): Promise<EnrollmentCheckResult> {
    const subscription = await prisma.studentSubscription.findFirst({
      where: {
        studentId: userId,
        status: 'ACTIVE'
      }
    });
    
    if (!subscription) {
      return {
        canEnroll: false,
        reason: 'No active subscription required for platform courses'
      };
    }
    
    // Check enrollment limits
    const currentEnrollments = await prisma.studentCourseEnrollment.count({
      where: {
        studentId: userId,
        isPlatformCourse: true,
        isActive: true,
        subscriptionId: subscription.id
      }
    });
    
    const canEnroll = currentEnrollments < subscription.maxEnrollments;
    
    return {
      canEnroll,
      reason: canEnroll ? undefined : 'Enrollment limit reached',
      limits: {
        current: currentEnrollments,
        max: subscription.maxEnrollments,
        remaining: subscription.maxEnrollments - currentEnrollments
      }
    };
  }

  /**
   * Check if user can attend live session
   */
  static async canAttendLiveSession(userId: string, sessionId: string): Promise<AttendanceCheckResult> {
    const subscription = await prisma.studentSubscription.findFirst({
      where: {
        studentId: userId,
        status: 'ACTIVE'
      }
    });
    
    if (!subscription) {
      return {
        canAttend: false,
        reason: 'No active subscription required'
      };
    }
    
    // Check if user has unlimited attendance
    if (subscription.attendanceQuota === -1) {
      return { canAttend: true };
    }
    
    // Count this month's attendance
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyAttendance = await prisma.videoSessionParticipant.count({
      where: {
        userId,
        session: {
          startTime: {
            gte: startOfMonth
          }
        },
        quotaUsed: true
      }
    });
    
    const canAttend = monthlyAttendance < subscription.attendanceQuota;
    
    return {
      canAttend,
      reason: canAttend ? undefined : 'Monthly attendance quota reached',
      quotaInfo: {
        used: monthlyAttendance,
        max: subscription.attendanceQuota,
        remaining: subscription.attendanceQuota - monthlyAttendance
      }
    };
  }

  /**
   * Get plan limits configuration
   */
  static getPlanLimits(planType: string) {
    const limits = {
      'BASIC': {
        maxEnrollments: 1,
        maxActiveCourses: 1,
        enrollmentQuota: 1,
        attendanceQuota: 5,
        canAccessLiveClasses: true,
        canAccessRecordings: false,
        canUseHDVideo: false
      },
      'PREMIUM': {
        maxEnrollments: 3,
        maxActiveCourses: 3,
        enrollmentQuota: 5,
        attendanceQuota: 20,
        canAccessLiveClasses: true,
        canAccessRecordings: true,
        canUseHDVideo: true
      },
      'ENTERPRISE': {
        maxEnrollments: 10,
        maxActiveCourses: 10,
        enrollmentQuota: -1, // Unlimited
        attendanceQuota: -1, // Unlimited
        canAccessLiveClasses: true,
        canAccessRecordings: true,
        canUseHDVideo: true
      }
    };
    
    return limits[planType] || limits['BASIC'];
  }

  /**
   * Handle subscription downgrade
   */
  static async handleSubscriptionDowngrade(subscriptionId: string, newPlanType: string) {
    const subscription = await prisma.studentSubscription.findUnique({
      where: { id: subscriptionId },
      include: {
        enrollments: {
          where: { isActive: true }
        }
      }
    });
    
    if (!subscription) return;
    
    // Get new plan limits
    const newPlanLimits = this.getPlanLimits(newPlanType);
    
    // Check if current enrollments exceed new limits
    const currentEnrollments = subscription.enrollments.length;
    
    if (currentEnrollments > newPlanLimits.maxEnrollments) {
      // Need to deactivate excess enrollments
      const excessEnrollments = currentEnrollments - newPlanLimits.maxEnrollments;
      
      // Deactivate oldest enrollments first
      const enrollmentsToDeactivate = subscription.enrollments
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .slice(0, excessEnrollments);
      
      for (const enrollment of enrollmentsToDeactivate) {
        await prisma.studentCourseEnrollment.update({
          where: { id: enrollment.id },
          data: {
            isActive: false,
            accessExpiry: new Date() // Immediate expiry
          }
        });
      }
      
      // Send notification to user (placeholder for now)
      console.log(`Downgrade notification sent to user ${subscription.studentId}: ${enrollmentsToDeactivate.length} courses deactivated`);
    }
    
    // Update subscription with new limits
    await prisma.studentSubscription.update({
      where: { id: subscriptionId },
      data: {
        planType: newPlanType,
        maxEnrollments: newPlanLimits.maxEnrollments,
        maxActiveCourses: newPlanLimits.maxActiveCourses,
        enrollmentQuota: newPlanLimits.enrollmentQuota,
        attendanceQuota: newPlanLimits.attendanceQuota,
        currentEnrollments: Math.min(currentEnrollments, newPlanLimits.maxEnrollments)
      }
    });
  }

  /**
   * Get subscription usage analytics
   */
  static async getSubscriptionUsage(userId: string): Promise<SubscriptionUsage | null> {
    const subscription = await prisma.studentSubscription.findFirst({
      where: {
        studentId: userId,
        status: 'ACTIVE'
      },
      include: {
        enrollments: {
          where: { isActive: true },
          include: {
            course: true
          }
        }
      }
    });
    
    if (!subscription) return null;
    
    // Calculate usage metrics
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const monthlyAttendance = await prisma.videoSessionParticipant.count({
      where: {
        userId,
        session: {
          startTime: {
            gte: currentMonth
          }
        },
        quotaUsed: true
      }
    });
    
    const planLimits = this.getPlanLimits(subscription.planType);
    
    return {
      subscription,
      usage: {
        enrollments: {
          current: subscription.currentEnrollments,
          max: planLimits.maxEnrollments,
          percentage: (subscription.currentEnrollments / planLimits.maxEnrollments) * 100
        },
        monthlyAttendance: {
          current: monthlyAttendance,
          max: planLimits.attendanceQuota,
          percentage: planLimits.attendanceQuota === -1 ? 0 : 
            (monthlyAttendance / planLimits.attendanceQuota) * 100
        },
        monthlyEnrollments: {
          current: subscription.monthlyEnrollments,
          max: planLimits.enrollmentQuota,
          percentage: planLimits.enrollmentQuota === -1 ? 0 :
            (subscription.monthlyEnrollments / planLimits.enrollmentQuota) * 100
        }
      },
      activeEnrollments: subscription.enrollments
    };
  }

  /**
   * Check and send usage alerts
   */
  static async checkUsageAlerts(userId: string) {
    const usage = await this.getSubscriptionUsage(userId);
    
    if (!usage) return;
    
    const { usage: metrics } = usage;
    
    // Enrollment limit warnings
    if (metrics.enrollments.percentage >= 80) {
      console.log(`Enrollment limit warning for user ${userId}: ${metrics.enrollments.current}/${metrics.enrollments.max} enrollments`);
      // TODO: Implement actual notification sending
    }
    
    // Attendance limit warnings
    if (metrics.monthlyAttendance.percentage >= 80) {
      console.log(`Attendance limit warning for user ${userId}: ${metrics.monthlyAttendance.current}/${metrics.monthlyAttendance.max} sessions this month`);
      // TODO: Implement actual notification sending
    }
    
    // Monthly enrollment limit warnings
    if (metrics.monthlyEnrollments.percentage >= 80) {
      console.log(`Monthly enrollment warning for user ${userId}: ${metrics.monthlyEnrollments.current}/${metrics.monthlyEnrollments.max} enrollments this month`);
      // TODO: Implement actual notification sending
    }
  }

  /**
   * Create platform course enrollment with subscription governance
   */
  static async createPlatformCourseEnrollment(userId: string, courseId: string) {
    // Check enrollment eligibility
    const enrollmentCheck = await this.canEnrollInPlatformCourse(userId, courseId);
    
    if (!enrollmentCheck.canEnroll) {
      throw new Error(enrollmentCheck.reason);
    }
    
    // Get active subscription
    const subscription = await prisma.studentSubscription.findFirst({
      where: {
        studentId: userId,
        status: 'ACTIVE'
      }
    });
    
    if (!subscription) {
      throw new Error('No active subscription found');
    }
    
    // Create enrollment
    const enrollment = await prisma.studentCourseEnrollment.create({
      data: {
        studentId: userId,
        courseId,
        enrollmentType: 'SUBSCRIPTION_BASED',
        accessMethod: 'SUBSCRIPTION',
        subscriptionId: subscription.id,
        subscriptionTier: subscription.planType,
        isPlatformCourse: true,
        enrollmentQuotaUsed: true,
        status: 'ACTIVE',
        progress: 0
      }
    });
    
    // Update subscription usage
    await prisma.studentSubscription.update({
      where: { id: subscription.id },
      data: {
        currentEnrollments: {
          increment: 1
        },
        monthlyEnrollments: {
          increment: 1
        }
      }
    });
    
    return enrollment;
  }

  /**
   * Record live session attendance with quota tracking
   */
  static async recordLiveSessionAttendance(userId: string, sessionId: string, subscriptionId: string) {
    // Check if attendance should use quota
    const subscription = await prisma.studentSubscription.findUnique({
      where: { id: subscriptionId }
    });
    
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    
    const quotaUsed = subscription.attendanceQuota !== -1; // Use quota if not unlimited
    
    // Create or update participant record
    const participant = await prisma.videoSessionParticipant.upsert({
      where: {
        sessionId_userId: {
          sessionId,
          userId
        }
      },
      update: {
        quotaUsed,
        attendanceType: quotaUsed ? 'QUOTA_BASED' : 'UNLIMITED',
        subscriptionId
      },
      create: {
        sessionId,
        userId,
        quotaUsed,
        attendanceType: quotaUsed ? 'QUOTA_BASED' : 'UNLIMITED',
        subscriptionId,
        joinedAt: new Date(),
        isActive: true
      }
    });
    
    // Update subscription monthly attendance if quota was used
    if (quotaUsed) {
      await prisma.studentSubscription.update({
        where: { id: subscriptionId },
        data: {
          monthlyAttendance: {
            increment: 1
          }
        }
      });
    }
    
    return participant;
  }
} 