import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

export interface PlatformCourseEnrollmentRequest {
  userId: string;
  courseId: string;
  enrollmentType?: string;
}

export interface PlatformCourseAccessRequest {
  userId: string;
  courseId: string;
}

export interface PlatformCourseEnrollmentResult {
  success: boolean;
  enrollmentId?: string;
  errors?: string[];
  warnings?: string[];
}

export interface PlatformCourseAccessResult {
  hasAccess: boolean;
  reason?: string;
  subscriptionTier?: string;
  accessExpiry?: Date;
  accessMethod?: 'DIRECT' | 'SUBSCRIPTION' | 'INSTITUTION' | 'NONE';
  enrollmentStatus?: string;
  institutionId?: string;
}

export class PlatformCourseGovernanceService {
  /**
   * Validate platform course enrollment
   */
  static async validatePlatformCourseEnrollment(request: PlatformCourseEnrollmentRequest): Promise<PlatformCourseEnrollmentResult> {
    try {
      const { userId, courseId } = request;

      // Get the course
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        return {
          success: false,
          errors: ['Course not found']
        };
      }

      // Check if it's a platform course
      if (!course.isPlatformCourse) {
        return {
          success: false,
          errors: ['This is not a platform course']
        };
      }

      // Check if course requires subscription
      if (course.requiresSubscription) {
        return await this.validateSubscriptionBasedEnrollment(userId, course);
      }

      // For non-subscription courses, check basic enrollment limits
      return await this.validateBasicEnrollment(userId, course);

    } catch (error) {
      logger.error('Error validating platform course enrollment:', error);
      return {
        success: false,
        errors: ['Internal validation error']
      };
    }
  }

  /**
   * Validate subscription-based enrollment
   */
  private static async validateSubscriptionBasedEnrollment(
    userId: string,
    course: any
  ): Promise<PlatformCourseEnrollmentResult> {
    try {
      // Get user's subscription
      const subscription = await prisma.studentSubscription.findUnique({
        where: { studentId: userId },
        include: { studentTier: true }
      });

      if (!subscription || subscription.status !== 'ACTIVE') {
        return {
          success: false,
          errors: ['Active subscription required for this course'],
          warnings: [course.subscriptionTier ? `Required tier: ${course.subscriptionTier}` : '']
        };
      }

      // Check subscription tier requirement
      if (course.subscriptionTier && subscription.planType !== course.subscriptionTier) {
        return {
          success: false,
          errors: [`Subscription tier ${course.subscriptionTier} required`],
          warnings: [`Current tier: ${subscription.planType}`]
        };
      }

      // Check enrollment quota
      if (subscription.currentEnrollments >= subscription.studentTier.enrollmentQuota) {
        return {
          success: false,
          errors: ['Enrollment limit reached'],
          warnings: [`Quota: ${subscription.studentTier.enrollmentQuota} (Used: ${subscription.currentEnrollments})`]
        };
      }

      // Check monthly enrollment quota
      if (subscription.monthlyEnrollments >= subscription.studentTier.enrollmentQuota) {
        return {
          success: false,
          errors: ['Monthly enrollment quota exceeded'],
          warnings: [`Quota: ${subscription.studentTier.enrollmentQuota} (Used: ${subscription.monthlyEnrollments})`]
        };
      }

      // Check if already enrolled
      const existingEnrollment = await prisma.studentCourseEnrollment.findFirst({
        where: {
          studentId: userId,
          courseId: course.id,
          isActive: true
        }
      });

      if (existingEnrollment) {
        return {
          success: false,
          errors: ['Already enrolled in this course']
        };
      }

      return {
        success: true,
        warnings: [`Quota remaining: ${subscription.studentTier.enrollmentQuota - subscription.currentEnrollments}`]
      };

    } catch (error) {
      logger.error('Error validating subscription-based enrollment:', error);
      return {
        success: false,
        errors: ['Error validating subscription']
      };
    }
  }

  /**
   * Validate basic enrollment (non-subscription courses)
   */
  private static async validateBasicEnrollment(
    userId: string,
    course: any
  ): Promise<PlatformCourseEnrollmentResult> {
    try {
      // Check if already enrolled
      const existingEnrollment = await prisma.studentCourseEnrollment.findFirst({
        where: {
          studentId: userId,
          courseId: course.id,
          isActive: true
        }
      });

      if (existingEnrollment) {
        return {
          success: false,
          errors: ['Already enrolled in this course']
        };
      }

      // Check course capacity
      const currentEnrollments = await prisma.studentCourseEnrollment.count({
        where: {
          courseId: course.id,
          isActive: true
        }
      });

      if (currentEnrollments >= course.maxStudents) {
        return {
          success: false,
          errors: ['Course is at maximum capacity']
        };
      }

      return {
        success: true
      };

    } catch (error) {
      logger.error('Error validating basic enrollment:', error);
      return {
        success: false,
        errors: ['Error validating enrollment']
      };
    }
  }

  /**
   * Enroll user in platform course with governance
   */
  static async enrollInPlatformCourse(
    request: PlatformCourseEnrollmentRequest
  ): Promise<PlatformCourseEnrollmentResult> {
    try {
      const { userId, courseId } = request;

      // Validate enrollment
      const validation = await this.validatePlatformCourseEnrollment(request);
      if (!validation.success) {
        return {
          success: false,
          errors: validation.errors || ['Enrollment validation failed']
        };
      }

      // Get course details
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        return {
          success: false,
          errors: ['Course not found']
        };
      }

      // Create enrollment
      const enrollmentData: any = {
        studentId: userId,
        courseId,
        status: 'ACTIVE',
        progress: 0,
        startDate: new Date(),
        isActive: true,
        isPlatformCourse: true,
        accessMethod: request.enrollmentType || 'SUBSCRIPTION'
      };

      // Add subscription-specific data if applicable
      if (course.requiresSubscription) {
        const subscription = await prisma.studentSubscription.findUnique({
          where: { studentId: userId }
        });

        if (subscription) {
          enrollmentData.subscriptionId = subscription.id;
          enrollmentData.subscriptionTier = subscription.planType;
          enrollmentData.enrollmentQuotaUsed = true;
        }
      }

      const enrollment = await prisma.studentCourseEnrollment.create({
        data: enrollmentData
      });

      // Update subscription usage if applicable
      if (course.requiresSubscription) {
        await this.updateSubscriptionUsage(userId, 'enrollment');
      }

      logger.info(`User ${userId} enrolled in platform course ${courseId}`);

      return {
        success: true,
        enrollmentId: enrollment.id
      };

    } catch (error) {
      logger.error('Error enrolling in platform course:', error);
      return {
        success: false,
        errors: ['Failed to enroll in course']
      };
    }
  }

  /**
   * Check platform course access for user
   */
  static async checkPlatformCourseAccess(
    userId: string,
    courseId: string
  ): Promise<PlatformCourseAccessResult> {
    try {
      // Get the course
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course || !course.isPlatformCourse) {
        return {
          hasAccess: false,
          reason: 'Course not found or not a platform course'
        };
      }

      // Check direct enrollment
      const enrollment = await prisma.studentCourseEnrollment.findFirst({
        where: {
          studentId: userId,
          courseId,
          isActive: true
        }
      });

      if (enrollment) {
        return {
          hasAccess: true,
          accessMethod: enrollment.accessMethod as any,
          enrollmentStatus: enrollment.status,
          accessExpiry: enrollment.accessExpiry || undefined
        };
      }

      // Check subscription access
      if (course.requiresSubscription) {
        const subscription = await prisma.studentSubscription.findUnique({
          where: { studentId: userId },
          include: { studentTier: true }
        });

        if (subscription && subscription.status === 'ACTIVE') {
          // Check if subscription tier matches requirement
          if (!course.subscriptionTier || subscription.planType === course.subscriptionTier) {
            return {
              hasAccess: true,
              accessMethod: 'SUBSCRIPTION',
              subscriptionTier: subscription.planType
            };
          }
        }
      }

      // Check institution access
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { institutionId: true }
      });

      if (user?.institutionId) {
        return {
          hasAccess: false,
          accessMethod: 'INSTITUTION',
          institutionId: user.institutionId
        };
      }

      return {
        hasAccess: false,
        accessMethod: 'NONE',
        reason: 'No access found'
      };

    } catch (error) {
      logger.error('Error checking platform course access:', error);
      return {
        hasAccess: false,
        accessMethod: 'NONE',
        reason: 'Internal access check error'
      };
    }
  }

  /**
   * Get platform course enrollment statistics
   */
  static async getPlatformCourseStats(courseId: string) {
    try {
      const [totalEnrollments, activeEnrollments, completedEnrollments] = await Promise.all([
        prisma.studentCourseEnrollment.count({
          where: { courseId }
        }),
        prisma.studentCourseEnrollment.count({
          where: {
            courseId,
            isActive: true
          }
        }),
        prisma.studentCourseEnrollment.count({
          where: {
            courseId,
            status: 'COMPLETED'
          }
        })
      ]);

      const enrollmentByMethod = await prisma.studentCourseEnrollment.groupBy({
        by: ['accessMethod'],
        where: { courseId },
        _count: {
          id: true
        }
      });

      const subscriptionEnrollments = await prisma.studentCourseEnrollment.count({
        where: {
          courseId,
          subscriptionId: {
            not: null
          }
        }
      });

      return {
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0,
        enrollmentByMethod: enrollmentByMethod.reduce((acc, item) => {
          acc[item.accessMethod] = item._count.id;
          return acc;
        }, {} as Record<string, number>),
        subscriptionEnrollments
      };

    } catch (error) {
      logger.error('Error getting platform course stats:', error);
      throw error;
    }
  }

  /**
   * Update subscription usage
   */
  private static async updateSubscriptionUsage(userId: string, type: 'enrollment' | 'attendance') {
    try {
      const updateData: any = {};
      
      if (type === 'enrollment') {
        updateData.currentEnrollments = { increment: 1 };
        updateData.monthlyEnrollments = { increment: 1 };
      } else if (type === 'attendance') {
        updateData.monthlyAttendance = { increment: 1 };
      }

      await prisma.studentSubscription.update({
        where: { studentId: userId },
        data: updateData
      });

    } catch (error) {
      logger.error('Error updating subscription usage:', error);
    }
  }

  /**
   * Get user's platform course enrollments
   */
  static async getUserPlatformCourseEnrollments(userId: string) {
    try {
      const enrollments = await prisma.studentCourseEnrollment.findMany({
        where: {
          studentId: userId,
          isPlatformCourse: true,
          isActive: true
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              level: true,
              status: true,
              courseType: true,
              deliveryMode: true
            }
          }
        },
        orderBy: {
          startDate: 'desc'
        }
      });

      return enrollments;

    } catch (error) {
      logger.error('Error getting user platform course enrollments:', error);
      throw error;
    }
  }

  /**
   * Cancel platform course enrollment
   */
  static async cancelPlatformCourseEnrollment(userId: string, courseId: string) {
    try {
      const enrollment = await prisma.studentCourseEnrollment.findFirst({
        where: {
          studentId: userId,
          courseId,
          isActive: true
        }
      });

      if (!enrollment) {
        return {
          success: false,
          errors: ['Enrollment not found']
        };
      }

      // Update enrollment
      await prisma.studentCourseEnrollment.update({
        where: { id: enrollment.id },
        data: {
          isActive: false,
          status: 'CANCELLED',
          endDate: new Date()
        }
      });

      // Update subscription usage if applicable
      if (enrollment.subscriptionId) {
        await prisma.studentSubscription.update({
          where: { id: enrollment.subscriptionId },
          data: {
            currentEnrollments: { decrement: 1 }
          }
        });
      }

      logger.info(`User ${userId} cancelled enrollment in platform course ${courseId}`);

      return {
        success: true
      };

    } catch (error) {
      logger.error('Error cancelling platform course enrollment:', error);
      return {
        success: false,
        errors: ['Failed to cancel enrollment']
      };
    }
  }
} 