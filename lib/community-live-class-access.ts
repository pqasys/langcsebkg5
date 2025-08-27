import { prisma } from './prisma';
import { logger } from './logger';

export interface LiveClassAccessStatus {
  hasAccess: boolean;
  reason?: string;
  restrictions?: {
    maxSessionsPerMonth: number;
    sessionDuration: number;
    groupSize: 'large' | 'small' | 'personal';
    features: string[];
    restrictions: string[];
  };
  upgradePrompt?: {
    message: string;
    cta: string;
    planType: 'PREMIUM' | 'PRO';
  };
}

export interface UserSessionUsage {
  sessionsThisMonth: number;
  lastSessionDate?: Date;
  totalSessions: number;
}

export class CommunityLiveClassAccessService {
  /**
   * Check if user can access live classes based on their subscription
   */
  static async checkUserAccess(userId: string): Promise<LiveClassAccessStatus> {
    try {
      // Get user's subscription
      const subscription = await prisma.studentSubscription.findUnique({
        where: { studentId: userId },
        include: { studentTier: true }
      });

      if (!subscription) {
        // Free user - apply freemium restrictions
        return this.getFreeUserAccess();
      }

      // Check subscription status
      if (subscription.status !== 'ACTIVE') {
        return this.getFreeUserAccess();
      }

      // Apply tier-based access
      switch (subscription.planType) {
        case 'BASIC':
          return this.getBasicUserAccess();
        case 'PREMIUM':
          return this.getPremiumUserAccess();
        case 'PRO':
          return this.getProUserAccess();
        default:
          return this.getFreeUserAccess();
      }
    } catch (error) {
      logger.error('Error checking live class access:', error);
      return this.getFreeUserAccess();
    }
  }

  /**
   * Get user's session usage for the current month
   */
  static async getUserSessionUsage(userId: string): Promise<UserSessionUsage> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Count sessions this month
      const sessionsThisMonth = await prisma.communityCircleEvent.count({
        where: {
          type: 'LIVE_CLASS',
          attendees: {
            some: {
              userId: userId
            }
          },
          date: {
            gte: startOfMonth
          }
        }
      });

      // Get last session date
      const lastSession = await prisma.communityCircleEvent.findFirst({
        where: {
          type: 'LIVE_CLASS',
          attendees: {
            some: {
              userId: userId
            }
          }
        },
        orderBy: {
          date: 'desc'
        },
        select: {
          date: true
        }
      });

      // Get total sessions
      const totalSessions = await prisma.communityCircleEvent.count({
        where: {
          type: 'LIVE_CLASS',
          attendees: {
            some: {
              userId: userId
            }
          }
        }
      });

      return {
        sessionsThisMonth,
        lastSessionDate: lastSession?.date,
        totalSessions
      };
    } catch (error) {
      logger.error('Error getting user session usage:', error);
      return {
        sessionsThisMonth: 0,
        totalSessions: 0
      };
    }
  }

  /**
   * Check if user can join a specific live class event
   */
  static async canJoinLiveClass(userId: string, eventId: string): Promise<LiveClassAccessStatus> {
    try {
      // Get the event
      const event = await prisma.communityCircleEvent.findUnique({
        where: { id: eventId },
        include: {
          attendees: true
        }
      });

      if (!event || event.type !== 'LIVE_CLASS') {
        return {
          hasAccess: false,
          reason: 'Event not found or not a live class'
        };
      }

      // Check basic access
      const accessStatus = await this.checkUserAccess(userId);
      if (!accessStatus.hasAccess) {
        return accessStatus;
      }

      // Check session limits for free users
      if (accessStatus.restrictions?.maxSessionsPerMonth) {
        const usage = await this.getUserSessionUsage(userId);
        if (usage.sessionsThisMonth >= accessStatus.restrictions.maxSessionsPerMonth) {
          return {
            hasAccess: false,
            reason: `You've reached your monthly limit of ${accessStatus.restrictions.maxSessionsPerMonth} sessions`,
            upgradePrompt: {
              message: "Upgrade to Premium for unlimited live class sessions!",
              cta: "Upgrade Now",
              planType: 'PREMIUM'
            }
          };
        }
      }

      // Check if user is already attending
      const isAttending = event.attendees.some(attendee => attendee.userId === userId);
      if (isAttending) {
        return {
          hasAccess: false,
          reason: 'You are already registered for this session'
        };
      }

      // Check max attendees
      if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
        return {
          hasAccess: false,
          reason: 'This session is full'
        };
      }

      return accessStatus;
    } catch (error) {
      logger.error('Error checking live class join access:', error);
      return {
        hasAccess: false,
        reason: 'Error checking access'
      };
    }
  }

  /**
   * Apply restrictions to event creation based on user's subscription
   */
  static async validateEventCreation(userId: string, eventData: any): Promise<{ valid: boolean; reason?: string; restrictions?: any }> {
    try {
      const accessStatus = await this.checkUserAccess(userId);
      
      if (!accessStatus.hasAccess) {
        return {
          valid: false,
          reason: accessStatus.reason
        };
      }

      const restrictions = accessStatus.restrictions;
      if (!restrictions) {
        return { valid: true };
      }

      // Check duration limit
      if (eventData.duration > restrictions.sessionDuration) {
        return {
          valid: false,
          reason: `Free users can only create sessions up to ${restrictions.sessionDuration} minutes. Upgrade to Premium for longer sessions.`,
          restrictions: {
            maxDuration: restrictions.sessionDuration
          }
        };
      }

      // Check group size restrictions
      if (eventData.maxAttendees) {
        const maxAllowed = restrictions.groupSize === 'large' ? 20 : 
                          restrictions.groupSize === 'small' ? 10 : 5;
        
        if (eventData.maxAttendees > maxAllowed) {
          return {
            valid: false,
            reason: `Free users can only create sessions with up to ${maxAllowed} attendees. Upgrade to Premium for larger groups.`,
            restrictions: {
              maxAttendees: maxAllowed
            }
          };
        }
      }

      return { valid: true };
    } catch (error) {
      logger.error('Error validating event creation:', error);
      return {
        valid: false,
        reason: 'Error validating event creation'
      };
    }
  }

  /**
   * Get upgrade prompt based on user's current usage
   */
  static async getUpgradePrompt(userId: string): Promise<{ message: string; cta: string; planType: 'PREMIUM' | 'PRO' } | null> {
    try {
      const usage = await this.getUserSessionUsage(userId);
      const accessStatus = await this.checkUserAccess(userId);

      // If user already has premium access, no upgrade needed
      if (accessStatus.hasAccess && !accessStatus.restrictions?.maxSessionsPerMonth) {
        return null;
      }

      // Different prompts based on usage
      if (usage.totalSessions === 0) {
        return {
          message: "Ready to start your language learning journey? Upgrade to Premium for unlimited live sessions!",
          cta: "Start Learning",
          planType: 'PREMIUM'
        };
      } else if (usage.sessionsThisMonth >= 1) {
        return {
          message: "Loved your first session? Get unlimited access with Premium!",
          cta: "Get Unlimited Access",
          planType: 'PREMIUM'
        };
      } else if (usage.totalSessions >= 5) {
        return {
          message: "You're making great progress! Upgrade to Pro for personalized tutoring and advanced features.",
          cta: "Upgrade to Pro",
          planType: 'PRO'
        };
      }

      return {
        message: "Unlock unlimited live sessions and advanced features with Premium!",
        cta: "Upgrade Now",
        planType: 'PREMIUM'
      };
    } catch (error) {
      logger.error('Error getting upgrade prompt:', error);
      return null;
    }
  }

  // Private methods for different access levels
  private static getFreeUserAccess(): LiveClassAccessStatus {
    return {
      hasAccess: true,
      restrictions: {
        maxSessionsPerMonth: 1,
        sessionDuration: 30,
        groupSize: 'large',
        features: ['basic-video', 'chat'],
        restrictions: ['no-recording', 'no-materials', 'no-hd-video']
      },
      upgradePrompt: {
        message: "Upgrade to Premium for unlimited sessions and better features!",
        cta: "Upgrade Now",
        planType: 'PREMIUM'
      }
    };
  }

  private static getBasicUserAccess(): LiveClassAccessStatus {
    return {
      hasAccess: false,
      reason: 'Live classes require Premium or Pro subscription',
      upgradePrompt: {
        message: "Live classes are available with Premium and Pro plans!",
        cta: "Upgrade to Premium",
        planType: 'PREMIUM'
      }
    };
  }

  private static getPremiumUserAccess(): LiveClassAccessStatus {
    return {
      hasAccess: true,
      restrictions: {
        maxSessionsPerMonth: 10,
        sessionDuration: 60,
        groupSize: 'small',
        features: ['hd-video', 'chat', 'screen-share', 'materials'],
        restrictions: ['no-recording']
      }
    };
  }

  private static getProUserAccess(): LiveClassAccessStatus {
    return {
      hasAccess: true,
      restrictions: {
        maxSessionsPerMonth: -1, // Unlimited
        sessionDuration: 120,
        groupSize: 'personal',
        features: ['all-features'],
        restrictions: []
      }
    };
  }
}
