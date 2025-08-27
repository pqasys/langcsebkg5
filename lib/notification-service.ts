import { prisma } from './prisma';
import { logger } from './logger';
import { LanguageAttendanceThresholdService } from './language-attendance-threshold-service';
import { NotificationTemplateCache } from './cache-service';

export interface NotificationTemplate {
  id: string;
  type: 'EMAIL' | 'IN_APP' | 'PUSH';
  language: string;
  country?: string;
  region?: string;
  subject?: string;
  title: string;
  message: string;
  isActive: boolean;
}

export interface NotificationData {
  userId: string;
  type: 'LIVE_CLASS_CANCELLED' | 'LIVE_CLASS_WARNING' | 'THRESHOLD_UPDATE' | 'LOW_ENROLLMENT';
  language: string;
  country?: string;
  region?: string;
  data: Record<string, any>;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export class NotificationService {
  /**
   * Send notification with language-specific context
   */
  static async sendNotification(notificationData: NotificationData): Promise<void> {
    try {
      // Get language-specific notification template
      const template = await this.getNotificationTemplate(
        notificationData.type,
        notificationData.language,
        notificationData.country,
        notificationData.region
      );

      if (!template) {
        logger.warn(`No notification template found for ${notificationData.type} in ${notificationData.language}`);
        return;
      }

      // Process template with data
      const processedTemplate = this.processTemplate(template, notificationData.data);

      // Create notification record
      await prisma.notification.create({
        data: {
          userId: notificationData.userId,
          type: notificationData.type,
          title: processedTemplate.title,
          message: processedTemplate.message,
          data: notificationData.data,
          priority: notificationData.priority,
          language: notificationData.language,
          country: notificationData.country,
          region: notificationData.region,
          isRead: false,
          createdAt: new Date()
        }
      });

      // Send via different channels based on template type
      if (template.type === 'EMAIL') {
        await this.sendEmailNotification(notificationData.userId, processedTemplate);
      } else if (template.type === 'PUSH') {
        await this.sendPushNotification(notificationData.userId, processedTemplate);
      }

      logger.info(`Notification sent to user ${notificationData.userId}: ${notificationData.type}`);
    } catch (error) {
      logger.error('Error sending notification:', error);
    }
  }

  /**
   * Send live class cancellation notification with language context
   */
  static async sendLiveClassCancellationNotification(
    sessionId: string,
    reason: string,
    language: string,
    country?: string,
    region?: string
  ): Promise<void> {
    try {
      const session = await prisma.videoSession.findUnique({
        where: { id: sessionId },
        include: {
          participants: {
            where: { role: 'PARTICIPANT' },
            include: { user: true }
          },
          instructor: true
        }
      });

      if (!session) {
        logger.error(`Session ${sessionId} not found for cancellation notification`);
        return;
      }

      // Get language-specific threshold config for context
      const thresholdConfig = await LanguageAttendanceThresholdService.getThresholdConfig(
        language,
        country,
        region
      );

      const notificationData = {
        sessionId,
        sessionTitle: session.title,
        reason,
        language,
        country,
        region,
        thresholdConfig: thresholdConfig ? {
          minStudents: thresholdConfig.minAttendanceThreshold,
          profitStudents: thresholdConfig.profitMarginThreshold,
          instructorRate: thresholdConfig.instructorHourlyRate,
          revenuePerStudent: thresholdConfig.platformRevenuePerStudent
        } : null,
        cancellationTime: new Date().toISOString(),
        instructorName: session.instructor?.name || 'Instructor'
      };

      // Send notifications to all participants
      for (const participant of session.participants) {
        await this.sendNotification({
          userId: participant.userId,
          type: 'LIVE_CLASS_CANCELLED',
          language,
          country,
          region,
          data: notificationData,
          priority: 'HIGH'
        });
      }

      logger.info(`Cancellation notifications sent to ${session.participants.length} participants for session ${sessionId}`);
    } catch (error) {
      logger.error('Error sending live class cancellation notifications:', error);
    }
  }

  /**
   * Send low enrollment warning notification with language context
   */
  static async sendLowEnrollmentWarningNotification(
    sessionId: string,
    currentEnrollments: number,
    minRequired: number,
    language: string,
    country?: string,
    region?: string
  ): Promise<void> {
    try {
      const session = await prisma.videoSession.findUnique({
        where: { id: sessionId },
        include: { instructor: true }
      });

      if (!session) {
        logger.error(`Session ${sessionId} not found for warning notification`);
        return;
      }

      // Get language-specific threshold config
      const thresholdConfig = await LanguageAttendanceThresholdService.getThresholdConfig(
        language,
        country,
        region
      );

      const notificationData = {
        sessionId,
        sessionTitle: session.title,
        currentEnrollments,
        minRequired,
        language,
        country,
        region,
        thresholdConfig: thresholdConfig ? {
          minStudents: thresholdConfig.minAttendanceThreshold,
          profitStudents: thresholdConfig.profitMarginThreshold,
          instructorRate: thresholdConfig.instructorHourlyRate,
          revenuePerStudent: thresholdConfig.platformRevenuePerStudent
        } : null,
        warningTime: new Date().toISOString(),
        timeUntilClass: Math.floor((session.startTime.getTime() - new Date().getTime()) / (1000 * 60 * 60))
      };

      // Send warning to instructor
      await this.sendNotification({
        userId: session.instructorId,
        type: 'LIVE_CLASS_WARNING',
        language,
        country,
        region,
        data: notificationData,
        priority: 'MEDIUM'
      });

      logger.info(`Low enrollment warning sent to instructor ${session.instructorId} for session ${sessionId}`);
    } catch (error) {
      logger.error('Error sending low enrollment warning notification:', error);
    }
  }

  /**
   * Send threshold configuration update notification
   */
  static async sendThresholdUpdateNotification(
    configId: string,
    updatedBy: string,
    language: string,
    country?: string,
    region?: string
  ): Promise<void> {
    try {
      const config = await prisma.languageAttendanceThreshold.findUnique({
        where: { id: configId },
        include: { updatedByUser: true }
      });

      if (!config) {
        logger.error(`Threshold config ${configId} not found for update notification`);
        return;
      }

      const notificationData = {
        configId,
        language,
        country,
        region,
        updatedBy: config.updatedByUser?.name || 'Admin',
        updateTime: new Date().toISOString(),
        changes: {
          minAttendance: config.minAttendanceThreshold,
          profitThreshold: config.profitMarginThreshold,
          instructorRate: config.instructorHourlyRate,
          revenuePerStudent: config.platformRevenuePerStudent,
          autoCancel: config.autoCancelIfBelowThreshold,
          cancellationHours: config.cancellationDeadlineHours,
          priority: config.priority,
          isActive: config.isActive
        }
      };

      // Send notification to all admins
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' }
      });

      for (const admin of admins) {
        await this.sendNotification({
          userId: admin.id,
          type: 'THRESHOLD_UPDATE',
          language,
          country,
          region,
          data: notificationData,
          priority: 'LOW'
        });
      }

      logger.info(`Threshold update notifications sent to ${admins.length} admins`);
    } catch (error) {
      logger.error('Error sending threshold update notifications:', error);
    }
  }

  /**
   * Get notification template with language-specific matching
   */
  private static async getNotificationTemplate(
    type: string,
    language: string,
    country?: string,
    region?: string
  ): Promise<NotificationTemplate | null> {
    try {
      // Find templates that could match
      const templates = await prisma.notificationTemplate.findMany({
        where: {
          type,
          isActive: true,
          OR: [
            // Exact match
            {
              language,
              country: country || null,
              region: region || null
            },
            // Language + country match
            {
              language,
              country: country || null,
              region: null
            },
            // Language + region match
            {
              language,
              country: null,
              region: region || null
            },
            // Language only match
            {
              language,
              country: null,
              region: null
            }
          ]
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      if (templates.length === 0) {
        return null;
      }

      // Score templates based on specificity (similar to threshold matching)
      const scoredTemplates = templates.map(template => {
        let score = 0;
        
        if (template.language === language) {
          score += 10;
          
          if (template.country === country && template.region === region) {
            score += 30;
          } else if (template.country === country && !template.region) {
            score += 20;
          } else if (template.region === region && !template.country) {
            score += 15;
          } else if (!template.country && !template.region) {
            score += 5;
          }
        }

        score += template.priority || 0;

        return { template, score };
      });

      // Return the highest scoring template
      const bestMatch = scoredTemplates.reduce((best, current) => 
        current.score > best.score ? current : best
      );

      return bestMatch.template;
    } catch (error) {
      logger.error('Error getting notification template:', error);
      return null;
    }
  }

  /**
   * Process template with data variables
   */
  private static processTemplate(template: NotificationTemplate, data: Record<string, any>): {
    title: string;
    message: string;
  } {
    let title = template.title;
    let message = template.message;

    // Replace variables in template
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      title = title.replace(new RegExp(placeholder, 'g'), String(value));
      message = message.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return { title, message };
  }

  /**
   * Send email notification
   */
  private static async sendEmailNotification(userId: string, template: { title: string; message: string }): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user?.email) {
        logger.warn(`No email found for user ${userId}`);
        return;
      }

      // TODO: Implement actual email sending logic
      // This could use SendGrid, AWS SES, or any other email service
      logger.info(`Email notification would be sent to ${user.email}: ${template.title}`);
    } catch (error) {
      logger.error('Error sending email notification:', error);
    }
  }

  /**
   * Send push notification
   */
  private static async sendPushNotification(userId: string, template: { title: string; message: string }): Promise<void> {
    try {
      // TODO: Implement actual push notification logic
      // This could use Firebase Cloud Messaging, OneSignal, or any other push service
      logger.info(`Push notification would be sent to user ${userId}: ${template.title}`);
    } catch (error) {
      logger.error('Error sending push notification:', error);
    }
  }

  /**
   * Get user notifications with language filtering
   */
  static async getUserNotifications(
    userId: string,
    language?: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      const where: any = { userId };
      
      if (language) {
        where.language = language;
      }

      return await prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit
      });
    } catch (error) {
      logger.error('Error getting user notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      });
    } catch (error) {
      logger.error('Error marking notification as read:', error);
    }
  }

  /**
   * Get notification statistics by language
   */
  static async getNotificationStats(language?: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    byLanguage: Record<string, number>;
  }> {
    try {
      const where: any = {};
      if (language) {
        where.language = language;
      }

      const [total, unread, byType, byLanguage] = await Promise.all([
        prisma.notification.count({ where }),
        prisma.notification.count({ where: { ...where, isRead: false } }),
        prisma.notification.groupBy({
          by: ['type'],
          where,
          _count: { type: true }
        }),
        prisma.notification.groupBy({
          by: ['language'],
          where,
          _count: { language: true }
        })
      ]);

      return {
        total,
        unread,
        byType: byType.reduce((acc, item) => {
          acc[item.type] = item._count.type;
          return acc;
        }, {} as Record<string, number>),
        byLanguage: byLanguage.reduce((acc, item) => {
          acc[item.language] = item._count.language;
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      logger.error('Error getting notification stats:', error);
      return { total: 0, unread: 0, byType: {}, byLanguage: {} };
    }
  }
}
