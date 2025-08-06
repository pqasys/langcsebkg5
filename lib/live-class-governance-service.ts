import { prisma } from './prisma';
import { logger } from './logger';
import { SubscriptionManagementService } from './subscription-management-service';

export interface LiveClassValidationRequest {
  instructorId: string;
  startTime: Date;
  endTime: Date;
  maxParticipants: number;
  institutionId?: string;
  courseId?: string;
}

export interface InstructorAvailability {
  isAvailable: boolean;
  conflicts: any[];
  nextAvailableSlot?: Date;
}

export interface LiveClassCreationResult {
  success: boolean;
  sessionId?: string;
  errors?: string[];
  warnings?: string[];
}

export class LiveClassGovernanceService {
  /**
   * Validate live class creation with comprehensive checks
   */
  static async validateLiveClassCreation(request: LiveClassValidationRequest): Promise<LiveClassCreationResult> {
    const { instructorId, startTime, endTime, maxParticipants, institutionId, courseId } = request;
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // 1. Validate instructor exists and has proper role
      const instructor = await prisma.user.findUnique({
        where: { id: instructorId },
        include: { institution: true }
      });

      if (!instructor) {
        errors.push('Instructor not found');
        return { success: false, errors };
      }

      if (instructor.role !== 'INSTRUCTOR' && instructor.role !== 'INSTITUTION_STAFF') {
        errors.push('User is not authorized as an instructor');
        return { success: false, errors };
      }

      // 2. Check instructor availability
      const availability = await this.checkInstructorAvailability(instructorId, startTime, endTime);
      if (!availability.isAvailable) {
        errors.push(`Instructor has conflicting sessions: ${availability.conflicts.map(c => c.title).join(', ')}`);
        return { success: false, errors };
      }

      // 3. Validate institution association
      if (institutionId) {
        const institution = await prisma.institution.findUnique({
          where: { id: institutionId }
        });

        if (!institution) {
          errors.push('Institution not found');
          return { success: false, errors };
        }

        // Check if instructor belongs to this institution
        if (instructor.institutionId !== institutionId) {
          errors.push('Instructor does not belong to the specified institution');
          return { success: false, errors };
        }
      }

      // 4. Validate course association
      if (courseId) {
        const course = await prisma.course.findUnique({
          where: { id: courseId }
        });

        if (!course) {
          errors.push('Course not found');
          return { success: false, errors };
        }

        // Check if course belongs to the same institution
        if (institutionId && course.institutionId !== institutionId) {
          errors.push('Course does not belong to the specified institution');
          return { success: false, errors };
        }
      }

      // 5. Check instructor's live class limits
      const instructorLimits = await this.checkInstructorLiveClassLimits(instructorId);
      if (!instructorLimits.canCreate) {
        errors.push(`Instructor has reached live class limit: ${instructorLimits.current}/${instructorLimits.max}`);
        return { success: false, errors };
      }

      // 6. Validate time constraints
      const timeValidation = this.validateTimeConstraints(startTime, endTime);
      if (!timeValidation.isValid) {
        errors.push(timeValidation.error);
        return { success: false, errors };
      }

      // 7. Validate participant limits
      if (maxParticipants < 1 || maxParticipants > 100) {
        errors.push('Maximum participants must be between 1 and 100');
        return { success: false, errors };
      }

      // 8. Check for overlapping sessions in the same course
      if (courseId) {
        const overlappingSessions = await this.checkCourseSessionOverlap(courseId, startTime, endTime);
        if (overlappingSessions.length > 0) {
          warnings.push(`Found ${overlappingSessions.length} overlapping sessions in the same course`);
        }
      }

      return {
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined
      };

    } catch (error) {
      logger.error('Error validating live class creation:', error);
      return {
        success: false,
        errors: ['Internal validation error']
      };
    }
  }

  /**
   * Check instructor availability for a time slot
   */
  static async checkInstructorAvailability(
    instructorId: string,
    startTime: Date,
    endTime: Date
  ): Promise<InstructorAvailability> {
    try {
      const conflicts = await prisma.videoSession.findMany({
        where: {
          instructorId,
          status: {
            in: ['SCHEDULED', 'ACTIVE']
          },
          OR: [
            {
              startTime: {
                lt: endTime,
                gte: startTime
              }
            },
            {
              endTime: {
                gt: startTime,
                lte: endTime
              }
            },
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gte: endTime } }
              ]
            }
          ]
        },
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          status: true
        }
      });

      const isAvailable = conflicts.length === 0;

      // Find next available slot
      let nextAvailableSlot: Date | undefined;
      if (!isAvailable) {
        const sortedConflicts = conflicts.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
        nextAvailableSlot = new Date(sortedConflicts[sortedConflicts.length - 1].endTime);
      }

      return {
        isAvailable,
        conflicts,
        nextAvailableSlot
      };
    } catch (error) {
      logger.error('Error checking instructor availability:', error);
      return {
        isAvailable: false,
        conflicts: []
      };
    }
  }

  /**
   * Check instructor's live class limits based on subscription
   */
  static async checkInstructorLiveClassLimits(instructorId: string) {
    try {
      // Get instructor's subscription
      const subscription = await prisma.studentSubscription.findUnique({
        where: { studentId: instructorId },
        include: { studentTier: true }
      });

      if (!subscription || subscription.status !== 'ACTIVE') {
        return {
          canCreate: false,
          current: 0,
          max: 0,
          reason: 'No active subscription'
        };
      }

      // Count current live classes
      const currentLiveClasses = await prisma.videoSession.count({
        where: {
          instructorId,
          status: {
            in: ['SCHEDULED', 'ACTIVE']
          },
          startTime: {
            gte: new Date()
          }
        }
      });

      const maxLiveClasses = subscription.studentTier.maxLiveClasses;
      const canCreate = currentLiveClasses < maxLiveClasses;

      return {
        canCreate,
        current: currentLiveClasses,
        max: maxLiveClasses,
        reason: canCreate ? undefined : 'Live class limit exceeded'
      };
    } catch (error) {
      logger.error('Error checking instructor live class limits:', error);
      return {
        canCreate: false,
        current: 0,
        max: 0,
        reason: 'Error checking limits'
      };
    }
  }

  /**
   * Validate time constraints for live class
   */
  static validateTimeConstraints(startTime: Date, endTime: Date) {
    const now = new Date();
    const minAdvanceTime = 30 * 60 * 1000; // 30 minutes
    const maxDuration = 4 * 60 * 60 * 1000; // 4 hours

    // Check if start time is in the future
    if (startTime <= now) {
      return {
        isValid: false,
        error: 'Start time must be in the future'
      };
    }

    // Check minimum advance notice
    if (startTime.getTime() - now.getTime() < minAdvanceTime) {
      return {
        isValid: false,
        error: 'Live class must be scheduled at least 30 minutes in advance'
      };
    }

    // Check if end time is after start time
    if (endTime <= startTime) {
      return {
        isValid: false,
        error: 'End time must be after start time'
      };
    }

    // Check maximum duration
    const duration = endTime.getTime() - startTime.getTime();
    if (duration > maxDuration) {
      return {
        isValid: false,
        error: 'Live class duration cannot exceed 4 hours'
      };
    }

    return {
      isValid: true,
      error: undefined
    };
  }

  /**
   * Check for overlapping sessions in the same course
   */
  static async checkCourseSessionOverlap(courseId: string, startTime: Date, endTime: Date) {
    try {
      const overlappingSessions = await prisma.videoSession.findMany({
        where: {
          courseId,
          status: {
            in: ['SCHEDULED', 'ACTIVE']
          },
          OR: [
            {
              startTime: {
                lt: endTime,
                gte: startTime
              }
            },
            {
              endTime: {
                gt: startTime,
                lte: endTime
              }
            }
          ]
        },
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true
        }
      });

      return overlappingSessions;
    } catch (error) {
      logger.error('Error checking course session overlap:', error);
      return [];
    }
  }

  /**
   * Create live class with governance validation
   */
  static async createLiveClassWithGovernance(sessionData: any): Promise<LiveClassCreationResult> {
    try {
      // Validate the session creation
      const validation = await this.validateLiveClassCreation({
        instructorId: sessionData.instructorId,
        startTime: new Date(sessionData.startTime),
        endTime: new Date(sessionData.endTime),
        maxParticipants: sessionData.maxParticipants || 10,
        institutionId: sessionData.institutionId,
        courseId: sessionData.courseId
      });

      if (!validation.success) {
        return validation;
      }

      // Create the live class
      const liveClass = await prisma.videoSession.create({
        data: {
          ...sessionData,
          startTime: new Date(sessionData.startTime),
          endTime: new Date(sessionData.endTime),
          status: 'SCHEDULED'
        }
      });

      logger.info(`Live class created with governance validation: ${liveClass.id}`);

      return {
        success: true,
        sessionId: liveClass.id,
        warnings: validation.warnings
      };

    } catch (error) {
      logger.error('Error creating live class with governance:', error);
      return {
        success: false,
        errors: ['Failed to create live class']
      };
    }
  }

  /**
   * Handle instructor unavailability
   */
  static async handleInstructorUnavailability(instructorId: string, date: Date) {
    try {
      // Find affected sessions
      const affectedSessions = await prisma.videoSession.findMany({
        where: {
          instructorId,
          startTime: {
            gte: date
          },
          status: 'SCHEDULED'
        },
        include: {
          participants: true
        }
      });

      // Cancel or reschedule sessions
      for (const session of affectedSessions) {
        // Cancel the session
        await prisma.videoSession.update({
          where: { id: session.id },
          data: {
            status: 'CANCELLED',
            metadata: {
              ...(session.metadata as any || {}),
              cancellationReason: 'Instructor unavailable',
              cancelledAt: new Date()
            }
          }
        });

        // Notify participants
        for (const participant of session.participants) {
          // Here you would implement notification logic
          logger.info(`Notifying participant ${participant.userId} about cancelled session ${session.id}`);
        }
      }

      logger.info(`Handled instructor unavailability for ${affectedSessions.length} sessions`);

      return {
        success: true,
        affectedSessions: affectedSessions.length,
        cancelledSessions: affectedSessions.map(s => s.id)
      };

    } catch (error) {
      logger.error('Error handling instructor unavailability:', error);
      throw error;
    }
  }

  /**
   * Validate user can join live class
   */
  static async validateUserCanJoinLiveClass(userId: string, sessionId: string): Promise<boolean> {
    try {
      // Check if user can join based on subscription
      const canJoin = await SubscriptionManagementService.canJoinLiveClass(userId, sessionId);
      if (!canJoin) {
        return false;
      }

      // Get the session
      const session = await prisma.videoSession.findUnique({
        where: { id: sessionId },
        include: {
          participants: true
        }
      });

      if (!session) {
        return false;
      }

      // Check if session is active
      if (session.status !== 'ACTIVE') {
        return false;
      }

      // Check if session is at capacity
      if (session.participants.length >= session.maxParticipants) {
        return false;
      }

      // Check if user is already a participant
      const isAlreadyParticipant = session.participants.some(p => p.userId === userId);
      if (isAlreadyParticipant) {
        return false;
      }

      return true;

    } catch (error) {
      logger.error('Error validating user can join live class:', error);
      return false;
    }
  }

  /**
   * Get instructor's live class statistics
   */
  static async getInstructorLiveClassStats(instructorId: string) {
    try {
      const [totalSessions, activeSessions, completedSessions, cancelledSessions] = await Promise.all([
        prisma.videoSession.count({
          where: { instructorId }
        }),
        prisma.videoSession.count({
          where: {
            instructorId,
            status: 'ACTIVE'
          }
        }),
        prisma.videoSession.count({
          where: {
            instructorId,
            status: 'COMPLETED'
          }
        }),
        prisma.videoSession.count({
          where: {
            instructorId,
            status: 'CANCELLED'
          }
        })
      ]);

      const totalParticipants = await prisma.videoSessionParticipant.count({
        where: {
          session: {
            instructorId
          }
        }
      });

      return {
        totalSessions,
        activeSessions,
        completedSessions,
        cancelledSessions,
        totalParticipants,
        completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
        cancellationRate: totalSessions > 0 ? (cancelledSessions / totalSessions) * 100 : 0
      };

    } catch (error) {
      logger.error('Error getting instructor live class stats:', error);
      throw error;
    }
  }
} 