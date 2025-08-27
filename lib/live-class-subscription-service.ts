import { prisma } from './prisma';
import { logger } from './logger';

export interface SubscriptionUsage {
  userId: string;
  month: string; // YYYY-MM format
  totalHoursAttended: number;
  maxHoursAllowed: number;
  remainingHours: number;
  sessionsAttended: number;
  lastAttendanceDate?: Date;
}

export interface SessionAttendance {
  sessionId: string;
  userId: string;
  sessionTitle: string;
  sessionDate: Date;
  durationMinutes: number;
  durationHours: number;
  attended: boolean;
}

export class LiveClassSubscriptionService {
  private static readonly STANDARD_LESSON_DURATION = 60; // minutes
  private static readonly MONTHLY_HOURS_LIMIT = 4; // hours
  private static readonly PREMIUM_MONTHLY_HOURS_LIMIT = 8; // hours for premium users

  /**
   * Get current month's subscription usage for a user
   */
  static async getUserSubscriptionUsage(userId: string): Promise<SubscriptionUsage> {
    try {
      const currentMonth = this.getCurrentMonth();
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionStatus: true }
      });

      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      const maxHoursAllowed = user.subscriptionStatus === 'premium' 
        ? this.PREMIUM_MONTHLY_HOURS_LIMIT 
        : this.MONTHLY_HOURS_LIMIT;

      // Get all attended sessions for the current month
      const attendedSessions = await this.getUserAttendedSessions(userId, currentMonth);
      
      const totalHoursAttended = attendedSessions.reduce((total, session) => {
        return total + session.durationHours;
      }, 0);

      const remainingHours = Math.max(0, maxHoursAllowed - totalHoursAttended);

      return {
        userId,
        month: currentMonth,
        totalHoursAttended,
        maxHoursAllowed,
        remainingHours,
        sessionsAttended: attendedSessions.length,
        lastAttendanceDate: attendedSessions.length > 0 
          ? attendedSessions[attendedSessions.length - 1].sessionDate 
          : undefined
      };
    } catch (error) {
      logger.error('Error getting user subscription usage:', error);
      throw error;
    }
  }

  /**
   * Check if user can attend a specific session based on subscription limits
   */
  static async canUserAttendSession(userId: string, sessionId: string): Promise<{
    canAttend: boolean;
    reason?: string;
    usage: SubscriptionUsage;
  }> {
    try {
      const session = await prisma.videoSession.findUnique({
        where: { id: sessionId },
        select: {
          id: true,
          title: true,
          duration: true,
          startTime: true
        }
      });

      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      // Enforce 60-minute duration for live classes
      if (session.duration !== this.STANDARD_LESSON_DURATION) {
        return {
          canAttend: false,
          reason: `Live class sessions must be exactly ${this.STANDARD_LESSON_DURATION} minutes duration`,
          usage: await this.getUserSubscriptionUsage(userId)
        };
      }

      const usage = await this.getUserSubscriptionUsage(userId);
      const sessionHours = session.duration / 60;

      if (usage.remainingHours < sessionHours) {
        return {
          canAttend: false,
          reason: `Insufficient subscription hours. You have ${usage.remainingHours} hours remaining, but this session requires ${sessionHours} hours.`,
          usage
        };
      }

      return {
        canAttend: true,
        usage
      };
    } catch (error) {
      logger.error('Error checking if user can attend session:', error);
      throw error;
    }
  }

  /**
   * Record user attendance for a session
   */
  static async recordSessionAttendance(
    userId: string, 
    sessionId: string, 
    attended: boolean = true
  ): Promise<void> {
    try {
      const session = await prisma.videoSession.findUnique({
        where: { id: sessionId },
        select: {
          id: true,
          duration: true,
          startTime: true
        }
      });

      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      // Verify session duration is 60 minutes
      if (session.duration !== this.STANDARD_LESSON_DURATION) {
        throw new Error(`Invalid session duration. Live classes must be ${this.STANDARD_LESSON_DURATION} minutes.`);
      }

      // Check if attendance already recorded
      const existingAttendance = await prisma.videoSessionAttendance.findUnique({
        where: {
          userId_sessionId: {
            userId,
            sessionId
          }
        }
      });

      if (existingAttendance) {
        // Update existing attendance
        await prisma.videoSessionAttendance.update({
          where: {
            userId_sessionId: {
              userId,
              sessionId
            }
          },
          data: {
            attended,
            attendedAt: attended ? new Date() : null,
            updatedAt: new Date()
          }
        });
      } else {
        // Create new attendance record
        await prisma.videoSessionAttendance.create({
          data: {
            userId,
            sessionId,
            attended,
            attendedAt: attended ? new Date() : null
          }
        });
      }

      logger.info(`Recorded attendance for user ${userId} in session ${sessionId}: ${attended}`);
    } catch (error) {
      logger.error('Error recording session attendance:', error);
      throw error;
    }
  }

  /**
   * Get user's attended sessions for a specific month
   */
  static async getUserAttendedSessions(
    userId: string, 
    month: string
  ): Promise<SessionAttendance[]> {
    try {
      const [year, monthNum] = month.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59);

      const attendances = await prisma.videoSessionAttendance.findMany({
        where: {
          userId,
          attended: true,
          session: {
            startTime: {
              gte: startDate,
              lte: endDate
            }
          }
        },
        include: {
          session: {
            select: {
              id: true,
              title: true,
              duration: true,
              startTime: true
            }
          }
        },
        orderBy: {
          attendedAt: 'asc'
        }
      });

      return attendances.map(attendance => ({
        sessionId: attendance.sessionId,
        userId: attendance.userId,
        sessionTitle: attendance.session.title,
        sessionDate: attendance.session.startTime,
        durationMinutes: attendance.session.duration,
        durationHours: attendance.session.duration / 60,
        attended: attendance.attended
      }));
    } catch (error) {
      logger.error('Error getting user attended sessions:', error);
      throw error;
    }
  }

  /**
   * Get subscription usage history for a user
   */
  static async getUserSubscriptionHistory(
    userId: string, 
    months: number = 6
  ): Promise<SubscriptionUsage[]> {
    try {
      const history: SubscriptionUsage[] = [];
      const currentDate = new Date();

      for (let i = 0; i < months; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const month = this.formatMonth(date);
        
        const usage = await this.getUserSubscriptionUsageForMonth(userId, month);
        history.push(usage);
      }

      return history;
    } catch (error) {
      logger.error('Error getting user subscription history:', error);
      throw error;
    }
  }

  /**
   * Validate session duration when creating or updating sessions
   */
  static validateSessionDuration(durationMinutes: number): {
    isValid: boolean;
    reason?: string;
  } {
    if (durationMinutes !== this.STANDARD_LESSON_DURATION) {
      return {
        isValid: false,
        reason: `Live class sessions must be exactly ${this.STANDARD_LESSON_DURATION} minutes duration. Current duration: ${durationMinutes} minutes.`
      };
    }

    return { isValid: true };
  }

  /**
   * Get subscription usage statistics for admin dashboard
   */
  static async getSubscriptionStatistics(month?: string): Promise<{
    totalUsers: number;
    activeUsers: number;
    averageHoursUsed: number;
    totalHoursUsed: number;
    subscriptionDistribution: {
      basic: number;
      premium: number;
    };
    topUsers: Array<{
      userId: string;
      userName: string;
      hoursUsed: number;
      subscriptionStatus: string;
    }>;
  }> {
    try {
      const targetMonth = month || this.getCurrentMonth();
      const [year, monthNum] = targetMonth.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59);

      // Get all users with their subscription status
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          subscriptionStatus: true
        }
      });

      const totalUsers = users.length;
      const subscriptionDistribution = {
        basic: users.filter(u => u.subscriptionStatus === 'basic').length,
        premium: users.filter(u => u.subscriptionStatus === 'premium').length
      };

      // Get attendance data for the month
      const attendances = await prisma.videoSessionAttendance.findMany({
        where: {
          attended: true,
          session: {
            startTime: {
              gte: startDate,
              lte: endDate
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              subscriptionStatus: true
            }
          },
          session: {
            select: {
              duration: true
            }
          }
        }
      });

      // Calculate statistics
      const userHoursMap = new Map<string, number>();
      let totalHoursUsed = 0;
      let activeUsers = 0;

      for (const attendance of attendances) {
        const hours = attendance.session.duration / 60;
        const currentHours = userHoursMap.get(attendance.userId) || 0;
        userHoursMap.set(attendance.userId, currentHours + hours);
        totalHoursUsed += hours;
      }

      activeUsers = userHoursMap.size;

      // Get top users by hours used
      const topUsers = Array.from(userHoursMap.entries())
        .map(([userId, hoursUsed]) => {
          const user = users.find(u => u.id === userId);
          return {
            userId,
            userName: user?.name || 'Unknown',
            hoursUsed,
            subscriptionStatus: user?.subscriptionStatus || 'basic'
          };
        })
        .sort((a, b) => b.hoursUsed - a.hoursUsed)
        .slice(0, 10);

      const averageHoursUsed = activeUsers > 0 ? totalHoursUsed / activeUsers : 0;

      return {
        totalUsers,
        activeUsers,
        averageHoursUsed: Math.round(averageHoursUsed * 100) / 100,
        totalHoursUsed: Math.round(totalHoursUsed * 100) / 100,
        subscriptionDistribution,
        topUsers
      };
    } catch (error) {
      logger.error('Error getting subscription statistics:', error);
      throw error;
    }
  }

  /**
   * Get subscription usage for a specific month
   */
  private static async getUserSubscriptionUsageForMonth(
    userId: string, 
    month: string
  ): Promise<SubscriptionUsage> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true }
    });

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const maxHoursAllowed = user.subscriptionStatus === 'premium' 
      ? this.PREMIUM_MONTHLY_HOURS_LIMIT 
      : this.MONTHLY_HOURS_LIMIT;

    const attendedSessions = await this.getUserAttendedSessions(userId, month);
    
    const totalHoursAttended = attendedSessions.reduce((total, session) => {
      return total + session.durationHours;
    }, 0);

    const remainingHours = Math.max(0, maxHoursAllowed - totalHoursAttended);

    return {
      userId,
      month,
      totalHoursAttended,
      maxHoursAllowed,
      remainingHours,
      sessionsAttended: attendedSessions.length,
      lastAttendanceDate: attendedSessions.length > 0 
        ? attendedSessions[attendedSessions.length - 1].sessionDate 
        : undefined
    };
  }

  /**
   * Get current month in YYYY-MM format
   */
  private static getCurrentMonth(): string {
    const now = new Date();
    return this.formatMonth(now);
  }

  /**
   * Format date to YYYY-MM format
   */
  private static formatMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}
