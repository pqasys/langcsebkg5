import { prisma } from './prisma';
import { logger } from './logger';
import { LanguageAttendanceThresholdService } from './language-attendance-threshold-service';
import { AttendanceAnalysisCache } from './cache-service';

export interface AttendanceThresholdConfig {
  minAttendanceThreshold: number; // Minimum students required (e.g., 4)
  profitMarginThreshold: number;  // Students needed for profit (e.g., 8)
  instructorHourlyRate: number;   // Cost per hour (e.g., $25)
  platformRevenuePerStudent: number; // Revenue per student (e.g., $24.99)
  autoCancelIfBelowThreshold: boolean;
  cancellationDeadlineHours: number; // Hours before class to check (e.g., 24)
}

export interface AttendanceAnalysis {
  sessionId: string;
  currentEnrollments: number;
  minRequired: number;
  profitThreshold: number;
  isProfitable: boolean;
  willRun: boolean;
  instructorCost: number;
  platformRevenue: number;
  netProfit: number;
  margin: number;
  recommendations: string[];
}

export interface ThresholdCheckResult {
  sessionId: string;
  status: 'PENDING' | 'PASSED' | 'FAILED' | 'CANCELLED';
  currentEnrollments: number;
  minRequired: number;
  profitThreshold: number;
  isProfitable: boolean;
  willRun: boolean;
  action: 'PROCEED' | 'CANCEL' | 'WARN' | 'EXTEND';
  message: string;
  deadline?: Date;
}

export class LiveClassAttendanceService {
  private static readonly DEFAULT_CONFIG: AttendanceThresholdConfig = {
    minAttendanceThreshold: 4,
    profitMarginThreshold: 8,
    instructorHourlyRate: 25.0,
    platformRevenuePerStudent: 24.99,
    autoCancelIfBelowThreshold: true,
    cancellationDeadlineHours: 24
  };

  /**
   * Analyze attendance threshold for a live class session
   */
  static async analyzeAttendanceThreshold(sessionId: string): Promise<AttendanceAnalysis> {
    try {
      // Check cache first
      const cachedAnalysis = AttendanceAnalysisCache.getAnalysis(sessionId);
      if (cachedAnalysis) {
        logger.debug(`Cache hit for attendance analysis: ${sessionId}`);
        return cachedAnalysis;
      }

      const session = await prisma.videoSession.findUnique({
        where: { id: sessionId },
        include: {
          participants: {
            where: { role: 'PARTICIPANT' }
          }
        }
      });

      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const config = await this.getSessionConfig(session);
      const currentEnrollments = session.participants.length;
      const durationHours = session.duration / 60; // Convert minutes to hours
      
      // Calculate costs and revenue
      const instructorCost = config.instructorHourlyRate * durationHours;
      const platformRevenue = currentEnrollments * config.platformRevenuePerStudent;
      const netProfit = platformRevenue - instructorCost;
      const margin = platformRevenue > 0 ? (netProfit / platformRevenue) * 100 : 0;

      // Determine if class will run and is profitable
      const willRun = currentEnrollments >= config.minAttendanceThreshold;
      const isProfitable = currentEnrollments >= config.profitMarginThreshold;

      // Generate recommendations
      const recommendations: string[] = [];
      
      if (!willRun) {
        recommendations.push(`Need ${config.minAttendanceThreshold - currentEnrollments} more students to run this class`);
      }
      
      if (!isProfitable) {
        recommendations.push(`Need ${config.profitMarginThreshold - currentEnrollments} more students for profitability`);
      }
      
      if (currentEnrollments === 0) {
        recommendations.push('Consider promoting this class or adjusting the schedule');
      } else if (currentEnrollments < config.minAttendanceThreshold) {
        recommendations.push('Consider extending enrollment deadline or offering incentives');
      }

      const analysis = {
        sessionId,
        currentEnrollments,
        minRequired: config.minAttendanceThreshold,
        profitThreshold: config.profitMarginThreshold,
        isProfitable,
        willRun,
        instructorCost,
        platformRevenue,
        netProfit,
        margin,
        recommendations
      };

      // Cache the analysis
      AttendanceAnalysisCache.setAnalysis(sessionId, analysis);

      return analysis;
    } catch (error) {
      logger.error('Error analyzing attendance threshold:', error);
      throw error;
    }
  }

  /**
   * Check if a session meets attendance threshold and determine action
   */
  static async checkAttendanceThreshold(sessionId: string): Promise<ThresholdCheckResult> {
    try {
      const analysis = await this.analyzeAttendanceThreshold(sessionId);
      const session = await prisma.videoSession.findUnique({
        where: { id: sessionId }
      });

      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const config = await this.getSessionConfig(session);
      const now = new Date();
      const timeUntilClass = session.startTime.getTime() - now.getTime();
      const hoursUntilClass = timeUntilClass / (1000 * 60 * 60);

      let status: 'PENDING' | 'PASSED' | 'FAILED' | 'CANCELLED' = 'PENDING';
      let action: 'PROCEED' | 'CANCEL' | 'WARN' | 'EXTEND' = 'PROCEED';
      let message = '';

      // Determine status and action based on enrollment and timing
      if (analysis.willRun) {
        status = 'PASSED';
        action = 'PROCEED';
        message = `Class will run with ${analysis.currentEnrollments} students`;
      } else {
        if (hoursUntilClass <= config.cancellationDeadlineHours) {
          // Past cancellation deadline - must decide now
          if (config.autoCancelIfBelowThreshold) {
            status = 'FAILED';
            action = 'CANCEL';
            message = `Class cancelled due to insufficient enrollment (${analysis.currentEnrollments}/${analysis.minRequired})`;
          } else {
            status = 'FAILED';
            action = 'WARN';
            message = `Class will run with insufficient enrollment (${analysis.currentEnrollments}/${analysis.minRequired})`;
          }
        } else {
          // Still time for more enrollments
          status = 'PENDING';
          action = 'EXTEND';
          message = `Waiting for more enrollments (${analysis.currentEnrollments}/${analysis.minRequired})`;
        }
      }

      // Update session status
      await prisma.videoSession.update({
        where: { id: sessionId },
        data: {
          thresholdCheckStatus: status,
          attendanceCheckTime: now
        }
      });

      return {
        sessionId,
        status,
        currentEnrollments: analysis.currentEnrollments,
        minRequired: analysis.minRequired,
        profitThreshold: analysis.profitThreshold,
        isProfitable: analysis.isProfitable,
        willRun: analysis.willRun,
        action,
        message,
        deadline: session.cancellationDeadline
      };
    } catch (error) {
      logger.error('Error checking attendance threshold:', error);
      throw error;
    }
  }

  /**
   * Automatically cancel sessions that don't meet minimum threshold
   */
  static async autoCancelBelowThresholdSessions(): Promise<{
    cancelled: string[];
    warnings: string[];
    errors: string[];
  }> {
    const result = {
      cancelled: [] as string[],
      warnings: [] as string[],
      errors: [] as string[]
    };

    try {
      // Find sessions that need threshold checking
      const sessionsToCheck = await prisma.videoSession.findMany({
        where: {
          status: 'SCHEDULED',
          startTime: {
            gte: new Date() // Future sessions only
          },
          thresholdCheckStatus: {
            in: ['PENDING', 'FAILED']
          }
        }
      });

      for (const session of sessionsToCheck) {
        try {
          const checkResult = await this.checkAttendanceThreshold(session.id);
          
          if (checkResult.action === 'CANCEL') {
            // Cancel the session
            await prisma.videoSession.update({
              where: { id: session.id },
              data: {
                status: 'CANCELLED',
                isCancelled: true,
                thresholdCheckStatus: 'CANCELLED'
              }
            });

            // Notify participants
            await this.notifySessionCancellation(session.id, checkResult.message);
            
            result.cancelled.push(session.id);
            logger.info(`Auto-cancelled session ${session.id}: ${checkResult.message}`);
          } else if (checkResult.action === 'WARN') {
            // Send warning to instructor
            await this.notifyInstructorWarning(session.id, checkResult.message);
            result.warnings.push(session.id);
          }
        } catch (error) {
          logger.error(`Error processing session ${session.id}:`, error);
          result.errors.push(session.id);
        }
      }
    } catch (error) {
      logger.error('Error in auto-cancel process:', error);
      result.errors.push('GENERAL_ERROR');
    }

    return result;
  }

  /**
   * Set up automatic threshold checking for a session
   */
  static async setupThresholdChecking(sessionId: string): Promise<void> {
    try {
      const session = await prisma.videoSession.findUnique({
        where: { id: sessionId }
      });

      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const config = await this.getSessionConfig(session);
      
      // Set cancellation deadline (e.g., 24 hours before class)
      const cancellationDeadline = new Date(session.startTime.getTime() - (config.cancellationDeadlineHours * 60 * 60 * 1000));
      
      // Set attendance check time (e.g., 2 hours before cancellation deadline)
      const attendanceCheckTime = new Date(cancellationDeadline.getTime() - (2 * 60 * 60 * 1000));

      await prisma.videoSession.update({
        where: { id: sessionId },
        data: {
          cancellationDeadline,
          attendanceCheckTime,
          thresholdCheckStatus: 'PENDING'
        }
      });

      logger.info(`Set up threshold checking for session ${sessionId}`);
    } catch (error) {
      logger.error('Error setting up threshold checking:', error);
      throw error;
    }
  }

  /**
   * Get profitability report for a session
   */
  static async getProfitabilityReport(sessionId: string): Promise<{
    sessionId: string;
    title: string;
    startTime: Date;
    duration: number;
    currentEnrollments: number;
    minRequired: number;
    profitThreshold: number;
    instructorCost: number;
    platformRevenue: number;
    netProfit: number;
    margin: number;
    status: string;
    recommendations: string[];
  }> {
    try {
      const analysis = await this.analyzeAttendanceThreshold(sessionId);
      const session = await prisma.videoSession.findUnique({
        where: { id: sessionId }
      });

      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      return {
        sessionId: analysis.sessionId,
        title: session.title,
        startTime: session.startTime,
        duration: session.duration,
        currentEnrollments: analysis.currentEnrollments,
        minRequired: analysis.minRequired,
        profitThreshold: analysis.profitThreshold,
        instructorCost: analysis.instructorCost,
        platformRevenue: analysis.platformRevenue,
        netProfit: analysis.netProfit,
        margin: analysis.margin,
        status: session.thresholdCheckStatus,
        recommendations: analysis.recommendations
      };
    } catch (error) {
      logger.error('Error generating profitability report:', error);
      throw error;
    }
  }

  /**
   * Get session configuration (with language-specific defaults)
   */
  private static async getSessionConfig(session: any): Promise<AttendanceThresholdConfig> {
    // First check if session has custom thresholds set
    if (session.minAttendanceThreshold || session.profitMarginThreshold || session.instructorHourlyRate || session.platformRevenuePerStudent) {
      return {
        minAttendanceThreshold: session.minAttendanceThreshold || this.DEFAULT_CONFIG.minAttendanceThreshold,
        profitMarginThreshold: session.profitMarginThreshold || this.DEFAULT_CONFIG.profitMarginThreshold,
        instructorHourlyRate: session.instructorHourlyRate || this.DEFAULT_CONFIG.instructorHourlyRate,
        platformRevenuePerStudent: session.platformRevenuePerStudent || this.DEFAULT_CONFIG.platformRevenuePerStudent,
        autoCancelIfBelowThreshold: session.autoCancelIfBelowThreshold ?? this.DEFAULT_CONFIG.autoCancelIfBelowThreshold,
        cancellationDeadlineHours: this.DEFAULT_CONFIG.cancellationDeadlineHours
      };
    }

    // Try to get language-specific configuration
    try {
      const languageConfig = await LanguageAttendanceThresholdService.getThresholdConfig(
        session.language,
        session.country, // If we have country info in the session
        session.region   // If we have region info in the session
      );

      if (languageConfig) {
        logger.info(`Using language-specific threshold config for ${session.language}:`, {
          minAttendance: languageConfig.minAttendanceThreshold,
          profitThreshold: languageConfig.profitMarginThreshold,
          instructorRate: languageConfig.instructorHourlyRate
        });

        return {
          minAttendanceThreshold: languageConfig.minAttendanceThreshold,
          profitMarginThreshold: languageConfig.profitMarginThreshold,
          instructorHourlyRate: languageConfig.instructorHourlyRate,
          platformRevenuePerStudent: languageConfig.platformRevenuePerStudent,
          autoCancelIfBelowThreshold: languageConfig.autoCancelIfBelowThreshold,
          cancellationDeadlineHours: languageConfig.cancellationDeadlineHours
        };
      }
    } catch (error) {
      logger.warn(`Failed to get language-specific config for ${session.language}, using defaults:`, error);
    }

    // Fall back to default configuration
    return this.DEFAULT_CONFIG;
  }

  /**
   * Notify participants of session cancellation
   */
  private static async notifySessionCancellation(sessionId: string, reason: string): Promise<void> {
    try {
      const participants = await prisma.videoSessionParticipant.findMany({
        where: { sessionId },
        include: { user: true }
      });

      // TODO: Implement notification system
      // This could be email, push notification, in-app notification, etc.
      logger.info(`Notifying ${participants.length} participants of session ${sessionId} cancellation: ${reason}`);
      
      // For now, just log the notification
      for (const participant of participants) {
        logger.info(`Cancellation notification for user ${participant.userId}: ${reason}`);
      }
    } catch (error) {
      logger.error('Error notifying participants of cancellation:', error);
    }
  }

  /**
   * Notify instructor of low enrollment warning
   */
  private static async notifyInstructorWarning(sessionId: string, message: string): Promise<void> {
    try {
      const session = await prisma.videoSession.findUnique({
        where: { id: sessionId },
        include: { instructor: true }
      });

      if (session?.instructor) {
        // TODO: Implement instructor notification system
        logger.info(`Warning notification for instructor ${session.instructorId}: ${message}`);
      }
    } catch (error) {
      logger.error('Error notifying instructor of warning:', error);
    }
  }
}
