import { prisma } from './prisma';
import { logger } from './logger';

export type ContentAccessStatus = {
  hasAccess: boolean;
  reason?: string;
  enrollment?: {
    id: string;
    status: string;
    paymentStatus: string;
    startDate: Date;
    endDate: Date;
  };
};

export async function checkContentAccess(
  userId: string,
  courseId: string
): Promise<ContentAccessStatus> {
  try {
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        courseId,
        studentId: userId,
      },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        hasContentAccess: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!enrollment) {
      return {
        hasAccess: false,
        reason: 'Not enrolled in this course',
      };
    }

    if (enrollment.status === 'PENDING_PAYMENT') {
      return {
        hasAccess: false,
        reason: 'Payment pending',
        enrollment,
      };
    }

    if (!enrollment.hasContentAccess) {
      return {
        hasAccess: false,
        reason: 'Content access not granted',
        enrollment,
      };
    }

    const now = new Date();
    if (now < enrollment.startDate) {
      return {
        hasAccess: false,
        reason: 'Course has not started yet',
        enrollment,
      };
    }

    if (now > enrollment.endDate) {
      return {
        hasAccess: false,
        reason: 'Course has ended',
        enrollment,
      };
    }

    return {
      hasAccess: true,
      enrollment,
    };
  } catch (error) {
    logger.error('Content access check error:');
    return {
      hasAccess: false,
      reason: 'Error checking content access',
    };
  }
} 