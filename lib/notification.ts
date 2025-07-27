import { prisma } from './prisma';
import { emailService } from './email';
import { webSocketService, sendCourseNotification, sendPaymentNotification, sendSystemAlert } from './websocket';
import { logger } from './logger';

export interface NotificationData {
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  templateId?: string;
  type: 'email' | 'sms' | 'push' | 'system' | 'websocket';
  subject?: string;
  title: string;
  content: string;
  metadata?: unknown;
  createdBy?: string;
}

export interface TemplateVariables {
  [key: string]: string | number | boolean;
}

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Send a notification using a template
   */
  public async sendNotificationWithTemplate(
    templateName: string,
    recipientId: string,
    variables: TemplateVariables,
    metadata?: unknown,
    createdBy?: string
  ) {
    try {
      // Get the template
      const template = await prisma.notificationTemplate.findFirst({
        where: { name: templateName, isActive: true }
      });

      if (!template) {
        throw new Error(`Template '${templateName}' not found or inactive`);
      }

      // Get recipient info
      const recipient = await prisma.user.findUnique({
        where: { id: recipientId }
      });

      if (!recipient) {
        throw new Error(`Recipient with ID '${recipientId}' not found`);
      }

      // Process template content with variables
      const processedContent = this.processTemplate(template.content, variables);
      const processedTitle = this.processTemplate(template.title, variables);
      const processedSubject = template.subject ? this.processTemplate(template.subject, variables) : undefined;

      // Send the notification
      return await this.sendNotification({
        recipientId,
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        templateId: template.id,
        type: template.type as 'email' | 'sms' | 'push' | 'system' | 'websocket',
        subject: processedSubject,
        title: processedTitle,
        content: processedContent,
        metadata,
        createdBy
      });
    } catch (error) {
      logger.error('Error sending notification with template:');
      throw error;
    }
  }

  /**
   * Send a direct notification without using a template
   */
  public async sendNotification(data: NotificationData) {
    try {
      // Create notification log entry
      const notificationLog = await prisma.notificationLog.create({
        data: {
          templateId: data.templateId,
          recipientId: data.recipientId,
          recipientEmail: data.recipientEmail,
          recipientName: data.recipientName,
          type: data.type,
          subject: data.subject,
          title: data.title,
          content: data.content,
          status: 'pending',
          metadata: data.metadata,
          createdBy: data.createdBy
        }
      });

      let status = 'sent';
      let errorMessage = null;

      try {
        // Send based on type
        switch (data.type) {
          case 'email':
            await this.sendEmailNotification(data);
            break;
          case 'sms':
            await this.sendSMSNotification(data);
            break;
          case 'push':
            await this.sendPushNotification(data);
            break;
          case 'system':
            await this.sendSystemNotification(data);
            break;
          case 'websocket':
            await this.sendWebSocketNotification(data);
            break;
          default:
            throw new Error('Unsupported notification type: ' + data.type);
        }
      } catch (error) {
        status = 'failed';
        errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to send ${data.type} notification:`, error);
        
        // Log additional details for debugging
        console.error('❌ Notification delivery failed:', {
          type: data.type,
          recipientEmail: data.recipientEmail,
          subject: data.subject,
          error: error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
          } : error
        });
      }

      // Update notification log with result
      await prisma.notificationLog.update({
        where: { id: notificationLog.id },
        data: {
          status,
          errorMessage,
          sentAt: status === 'sent' ? new Date() : null
        }
      });

      return notificationLog;
    } catch (error) {
      logger.error('Error in sendNotification:');
      throw error;
    }
  }

  /**
   * Process template content by replacing variables
   */
  private processTemplate(content: string, variables: TemplateVariables): string {
    let processedContent = content;
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), String(value));
    }
    
    return processedContent;
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(data: NotificationData) {
    await emailService.sendEmail({
      to: data.recipientEmail,
      subject: data.subject || data.title,
      html: data.content
    });
  }

  /**
   * Send SMS notification (placeholder for future implementation)
   */
  private async sendSMSNotification(data: NotificationData) {
    // TODO: Implement SMS service integration (see roadmap: 'Reminder System - SMS reminders')
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log(`SMS notification would be sent to ${data.recipientEmail}: ${data.content}`);
    throw new Error('SMS notifications not yet implemented');
  }

  /**
   * Send push notification (placeholder for future implementation)
   */
  private async sendPushNotification(data: NotificationData) {
    // TODO: Implement push notification service integration (see roadmap: 'Mobile - push notifications')
    console.log(`Push notification would be sent to ${data.recipientEmail}: ${data.content}`);
    throw new Error(`Push notifications not yet implemented - Context: // TODO: Implement push notification service integ...`);
  }

  /**
   * Send system notification (creates a system notification record)
   */
  private async sendSystemNotification(data: NotificationData) {
    await prisma.systemNotification.create({
      data: {
        title: data.title,
        content: data.content,
        type: 'info',
        priority: 'normal',
        isActive: true,
        isGlobal: false,
        targetRoles: 'student', // Default to student role
        createdBy: data.createdBy || data.recipientId
      }
    });
  }

  /**
   * Send WebSocket notification
   */
  private async sendWebSocketNotification(data: NotificationData) {
    const message = {
      type: 'notification' as const,
      data: {
        title: data.title,
        content: data.content,
        metadata: data.metadata
      },
      timestamp: new Date(),
      userId: data.recipientId
    };

    await webSocketService.sendToUser(data.recipientId, message);
  }

  /**
   * Send course enrollment notification with WebSocket
   */
  public async sendCourseEnrollmentNotification(
    userId: string,
    courseId: string,
    courseName: string,
    institutionName: string,
    enrollmentDetails: unknown
  ) {
    try {
      // Send WebSocket notification
      await sendCourseNotification(userId, courseId, 'enrollment', {
        message: `Successfully enrolled in ${courseName}`,
        courseName,
        institutionName,
        enrollmentDetails
      });

      // Also send email notification
      await this.sendNotificationWithTemplate(
        'course_enrollment',
        userId,
        {
          name: enrollmentDetails.studentName || 'Student',
          courseName,
          institutionName,
          duration: enrollmentDetails.duration || '8 weeks',
          startDate: enrollmentDetails.startDate || new Date().toLocaleDateString()
        },
        {
          enrollmentId: enrollmentDetails.enrollmentId,
          courseId,
          institutionId: enrollmentDetails.institutionId,
          paymentAmount: enrollmentDetails.paymentAmount
        },
        'SYSTEM'
      );

      console.log('✅ Course enrollment notifications sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send course enrollment notifications:');
      throw error;
    }
  }

  /**
   * Send payment confirmation notification with WebSocket
   */
  public async sendPaymentConfirmationNotification(
    userId: string,
    paymentId: string,
    amount: number,
    courseName: string,
    paymentDetails: unknown
  ) {
    try {
      // Send WebSocket notification
      await sendPaymentNotification(userId, paymentId, 'confirmation', {
        message: `Payment of $${amount} confirmed for ${courseName}`,
        amount,
        courseName,
        paymentDetails
      });

      // Also send email notification
      await this.sendNotificationWithTemplate(
        'payment_confirmation',
        userId,
        {
          name: paymentDetails.studentName || 'Student',
          amount: `$${amount.toFixed(2)}`,
          referenceNumber: paymentDetails.referenceNumber || paymentId,
          date: new Date().toLocaleDateString(),
          courseName
        },
        {
          paymentId,
          courseId: paymentDetails.courseId,
          enrollmentId: paymentDetails.enrollmentId
        },
        'SYSTEM'
      );

      console.log('✅ Payment confirmation notifications sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send payment confirmation notifications:');
      throw error;
    }
  }

  /**
   * Send system maintenance alert
   */
  public async sendSystemMaintenanceAlert(
    userId: string,
    maintenanceDetails: {
      title: string;
      message: string;
      scheduledTime?: string;
      duration?: string;
    }
  ) {
    try {
      await sendSystemAlert(userId, 'maintenance', {
        title: maintenanceDetails.title,
        message: maintenanceDetails.message,
        scheduledTime: maintenanceDetails.scheduledTime,
        duration: maintenanceDetails.duration
      });

      console.log('✅ System maintenance alert sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send system maintenance alert:');
      throw error;
    }
  }

  /**
   * Send course update notification
   */
  public async sendCourseUpdateNotification(
    userId: string,
    courseId: string,
    updateType: 'content' | 'schedule' | 'assignment' | 'announcement',
    updateDetails: unknown
  ) {
    try {
      await sendCourseNotification(userId, courseId, 'update', {
        message: `Course ${updateDetails.courseName} has been updated`,
        updateType,
        updateDetails
      });

      console.log('✅ Course update notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send course update notification:');
      throw error;
    }
  }

  /**
   * Create default notification templates
   */
  public async createDefaultTemplates(createdBy: string) {
    const defaultTemplates = [
      {
        name: 'welcome_email',
        type: 'email',
        subject: 'Welcome to Our Platform!',
        title: 'Welcome to Our Platform!',
        content: `
          <h1>Welcome to Our Platform!</h1>
          <p>Dear {{name}},</p>
          <p>Thank you for joining our platform. We're excited to have you on board!</p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The Team</p>
        `,
        category: 'system',
        isDefault: true
      },
      {
        name: 'password_reset',
        type: 'email',
        subject: 'Password Reset Request',
        title: 'Password Reset Request',
        content: `
          <h1>Password Reset Request</h1>
          <p>Dear {{name}},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <p><a href="{{resetUrl}}">Reset Password</a></p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Team</p>
        `,
        category: 'security',
        isDefault: true
      },
      {
        name: 'payment_confirmation',
        type: 'email',
        subject: 'Payment Confirmation',
        title: 'Payment Confirmation',
        content: `
          <h1>Payment Confirmation</h1>
          <p>Dear {{name}},</p>
          <p>Your payment has been confirmed. Here are the details:</p>
          <ul>
            <li>Amount: {{amount}}</li>
            <li>Reference: {{referenceNumber}}</li>
            <li>Date: {{date}}</li>
          </ul>
          <p>Thank you for your payment!</p>
          <p>Best regards,<br>The Team</p>
        `,
        category: 'payment',
        isDefault: true
      },
      {
        name: 'payment_failed',
        type: 'email',
        subject: 'Payment Failed',
        title: 'Payment Failed',
        content: `
          <h1>Payment Failed</h1>
          <p>Dear {{name}},</p>
          <p>We were unable to process your payment. Here are the details:</p>
          <ul>
            <li>Amount: {{amount}}</li>
            <li>Reference: {{referenceNumber}}</li>
            <li>Error: {{error}}</li>
          </ul>
          <p>Please try again or contact support if the issue persists.</p>
          <p>Best regards,<br>The Team</p>
        `,
        category: 'payment',
        isDefault: true
      },
      {
        name: 'payment_reminder',
        type: 'email',
        subject: 'Payment Reminder',
        title: 'Payment Reminder',
        content: `
          <h1>Payment Reminder</h1>
          <p>Dear {{name}},</p>
          <p>This is a reminder that your payment is due. Here are the details:</p>
          <ul>
            <li>Amount: {{amount}}</li>
            <li>Due Date: {{dueDate}}</li>
            <li>Days Remaining: {{daysRemaining}}</li>
          </ul>
          <p>Please complete your payment to maintain your enrollment.</p>
          <p>Best regards,<br>The Team</p>
        `,
        category: 'payment',
        isDefault: true
      },
      {
        name: 'course_enrollment',
        type: 'email',
        subject: 'Course Enrollment Confirmation',
        title: 'Course Enrollment Confirmation',
        content: `
          <h1>Course Enrollment Confirmation</h1>
          <p>Dear {{name}},</p>
          <p>You have been successfully enrolled in the course: <strong>{{courseName}}</strong></p>
          <p>Course details:</p>
          <ul>
            <li>Institution: {{institutionName}}</li>
            <li>Duration: {{duration}}</li>
            <li>Start Date: {{startDate}}</li>
          </ul>
          <p>You can now access your course materials and begin learning!</p>
          <p>Best regards,<br>The Team</p>
        `,
        category: 'course',
        isDefault: true
      },
      {
        name: 'course_completion',
        type: 'email',
        subject: 'Course Completion Certificate',
        title: 'Course Completion Certificate',
        content: `
          <h1>Congratulations on Completing Your Course!</h1>
          <p>Dear {{name}},</p>
          <p>Congratulations! You have successfully completed the course: <strong>{{courseName}}</strong></p>
          <p>Your final score: {{score}}%</p>
          <p>You can download your certificate from your dashboard.</p>
          <p>Keep up the great work!</p>
          <p>Best regards,<br>The Team</p>
        `,
        category: 'course',
        isDefault: true
      },
      {
        name: 'quiz_reminder',
        type: 'email',
        subject: 'Quiz Reminder',
        title: 'Quiz Reminder',
        content: `
          <h1>Quiz Reminder</h1>
          <p>Dear {{name}},</p>
          <p>This is a reminder that you have a quiz due: <strong>{{quizName}}</strong></p>
          <p>Quiz details:</p>
          <ul>
            <li>Module: {{moduleName}}</li>
            <li>Due Date: {{dueDate}}</li>
            <li>Time Limit: {{timeLimit}} minutes</li>
          </ul>
          <p>Please complete the quiz to continue your progress.</p>
          <p>Best regards,<br>The Team</p>
        `,
        category: 'course',
        isDefault: true
      },
      {
        name: 'commission_earned',
        type: 'email',
        subject: 'Commission Earned - {{institutionName}}',
        title: 'Commission Earned',
        content: `
          <h1>Commission Earned</h1>
          <p>Dear {{institutionName}},</p>
          <p>Congratulations! You have earned a commission from a student enrollment.</p>
          <p>Commission details:</p>
          <ul>
            <li>Student: {{studentName}}</li>
            <li>Course: {{courseName}}</li>
            <li>Enrollment Amount: {{enrollmentAmount}}</li>
            <li>Commission Rate: {{commissionRate}}%</li>
            <li>Commission Amount: {{commissionAmount}}</li>
            <li>Date: {{date}}</li>
          </ul>
          <p>Your commission will be processed and added to your next payout.</p>
          <p>Best regards,<br>The Platform Team</p>
        `,
        category: 'commission',
        isDefault: true
      },
      {
        name: 'commission_payout',
        type: 'email',
        subject: 'Commission Payout - {{institutionName}}',
        title: 'Commission Payout',
        content: `
          <h1>Commission Payout</h1>
          <p>Dear {{institutionName}},</p>
          <p>Your commission payout has been processed successfully.</p>
          <p>Payout details:</p>
          <ul>
            <li>Payout Amount: {{payoutAmount}}</li>
            <li>Period: {{startDate}} to {{endDate}}</li>
            <li>Total Commissions: {{totalCommissions}}</li>
            <li>Transaction ID: {{transactionId}}</li>
            <li>Date: {{date}}</li>
          </ul>
          <p>The funds should appear in your account within 3-5 business days.</p>
          <p>Best regards,<br>The Platform Team</p>
        `,
        category: 'commission',
        isDefault: true
      },
      {
        name: 'subscription_renewal_reminder',
        type: 'email',
        subject: 'Subscription Renewal Reminder - {{institutionName}}',
        title: 'Subscription Renewal Reminder',
        content: `
          <h1>Subscription Renewal Reminder</h1>
          <p>Dear {{institutionName}},</p>
          <p>This is a friendly reminder that your subscription will renew soon.</p>
          <p>Subscription details:</p>
          <ul>
            <li>Current Plan: {{planName}}</li>
            <li>Renewal Date: {{renewalDate}}</li>
            <li>Amount: {{amount}}</li>
            <li>Days Remaining: {{daysRemaining}}</li>
          </ul>
          <p>Your subscription will automatically renew unless cancelled before the renewal date.</p>
          <p>Best regards,<br>The Platform Team</p>
        `,
        category: 'subscription',
        isDefault: true
      },
      {
        name: 'subscription_expired',
        type: 'email',
        subject: 'Subscription Expired - {{institutionName}}',
        title: 'Subscription Expired',
        content: `
          <h1>Subscription Expired</h1>
          <p>Dear {{institutionName}},</p>
          <p>Your subscription has expired. Some features may be limited until you renew.</p>
          <p>Subscription details:</p>
          <ul>
            <li>Previous Plan: {{planName}}</li>
            <li>Expired Date: {{expiredDate}}</li>
            <li>Renewal Amount: {{amount}}</li>
          </ul>
          <p>Please renew your subscription to continue enjoying all platform features.</p>
          <p>Best regards,<br>The Platform Team</p>
        `,
        category: 'subscription',
        isDefault: true
      },
      {
        name: 'subscription_upgraded',
        type: 'email',
        subject: 'Subscription Upgraded - {{institutionName}}',
        title: 'Subscription Upgraded',
        content: `
          <h1>Subscription Upgraded</h1>
          <p>Dear {{institutionName}},</p>
          <p>Your subscription has been successfully upgraded!</p>
          <p>Upgrade details:</p>
          <ul>
            <li>New Plan: {{newPlanName}}</li>
            <li>Previous Plan: {{oldPlanName}}</li>
            <li>Upgrade Amount: {{upgradeAmount}}</li>
            <li>Effective Date: {{effectiveDate}}</li>
            <li>New Features: {{newFeatures}}</li>
          </ul>
          <p>You now have access to additional features and benefits.</p>
          <p>Best regards,<br>The Platform Team</p>
        `,
        category: 'subscription',
        isDefault: true
      },
      {
        name: 'subscription_downgraded',
        type: 'email',
        subject: 'Subscription Downgraded - {{institutionName}}',
        title: 'Subscription Downgraded',
        content: `
          <h1>Subscription Downgraded</h1>
          <p>Dear {{institutionName}},</p>
          <p>Your subscription has been downgraded as requested.</p>
          <p>Downgrade details:</p>
          <ul>
            <li>New Plan: {{newPlanName}}</li>
            <li>Previous Plan: {{oldPlanName}}</li>
            <li>Effective Date: {{effectiveDate}}</li>
            <li>Changes: {{changes}}</li>
          </ul>
          <p>Some features may no longer be available. You can upgrade again anytime.</p>
          <p>Best regards,<br>The Platform Team</p>
        `,
        category: 'subscription',
        isDefault: true
      },
      {
        name: 'subscription_payment_failed',
        type: 'email',
        subject: 'Subscription Payment Failed - {{institutionName}}',
        title: 'Subscription Payment Failed',
        content: `
          <h1>Subscription Payment Failed</h1>
          <p>Dear {{institutionName}},</p>
          <p>We were unable to process your subscription payment.</p>
          <p>Payment details:</p>
          <ul>
            <li>Plan: {{planName}}</li>
            <li>Amount: {{amount}}</li>
            <li>Due Date: {{dueDate}}</li>
            <li>Error: {{error}}</li>
          </ul>
          <p>Please update your payment method to avoid service interruption.</p>
          <p>Best regards,<br>The Platform Team</p>
        `,
        category: 'subscription',
        isDefault: true
      },
      {
        name: 'commission_rate_changed',
        type: 'email',
        subject: 'Commission Rate Updated - {{institutionName}}',
        title: 'Commission Rate Updated',
        content: `
          <h1>Commission Rate Updated</h1>
          <p>Dear {{institutionName}},</p>
          <p>Your commission rate has been updated by the platform administrator.</p>
          <p>Rate change details:</p>
          <ul>
            <li>Previous Rate: {{oldRate}}%</li>
            <li>New Rate: {{newRate}}%</li>
            <li>Effective Date: {{effectiveDate}}</li>
            <li>Reason: {{reason}}</li>
          </ul>
          <p>This change will apply to all future enrollments.</p>
          <p>Best regards,<br>The Platform Team</p>
        `,
        category: 'commission',
        isDefault: true
      }
    ];

    // Check existing templates first
    const existingTemplates = await prisma.notificationTemplate.findMany({
      where: {
        name: {
          in: defaultTemplates.map(t => t.name)
        }
      },
      select: { name: true }
    });

    const existingNames = new Set(existingTemplates.map(t => t.name));
    const templatesToCreate = defaultTemplates.filter(t => !existingNames.has(t.name));
    const templatesToSkip = defaultTemplates.filter(t => existingNames.has(t.name));

    console.log(`Found ${existingTemplates.length} existing templates`);
    console.log(`Will create ${templatesToCreate.length} new templates`);
    console.log(`Will skip ${templatesToSkip.length} existing templates`);

    // Create new templates
    const createdTemplates = [];
    for (const template of templatesToCreate) {
      try {
        const created = await prisma.notificationTemplate.create({
          data: {
            ...template,
            createdBy
          }
        });
        createdTemplates.push(created.name);
        console.log(` Created template: ${template.name}`);
      } catch (error) {
        logger.error('❌ Failed to create template ${template.name}:');
      }
    }

    // Log skipped templates
    if (templatesToSkip.length > 0) {
      console.log(`⏭️  Skipped existing templates: ${templatesToSkip.map(t => t.name).join(', ')}`);
    }

    return {
      total: defaultTemplates.length,
      created: createdTemplates.length,
      skipped: templatesToSkip.length,
      createdTemplates,
      skippedTemplates: templatesToSkip.map(t => t.name)
    };
  }

  /**
   * Get notification statistics
   */
  public async getNotificationStats() {
    const [
      totalNotifications,
      sentNotifications,
      failedNotifications,
      emailNotifications,
      systemNotifications
    ] = await Promise.all([
      prisma.notificationLog.count(),
      prisma.notificationLog.count({ where: { status: 'sent' } }),
      prisma.notificationLog.count({ where: { status: 'failed' } }),
      prisma.notificationLog.count({ where: { type: 'email' } }),
      prisma.notificationLog.count({ where: { type: 'system' } })
    ]);

    return {
      total: totalNotifications,
      sent: sentNotifications,
      failed: failedNotifications,
      email: emailNotifications,
      system: systemNotifications,
      successRate: totalNotifications > 0 ? (sentNotifications / totalNotifications) * 100 : 0
    };
  }

  /**
   * Send course completion notification
   */
  public async sendCourseCompletionNotification(
    userId: string,
    courseId: string,
    courseName: string,
    completionDetails: {
      score: number;
      completionDate: Date;
      totalModules: number;
      totalQuizzes: number;
    }
  ) {
    try {
      // Send WebSocket notification
      await sendCourseNotification(userId, courseId, 'completion', {
        message: `Congratulations! You've completed ${courseName}`,
        courseName,
        score: completionDetails.score,
        completionDate: completionDetails.completionDate
      });

      // Send email notification
      await this.sendNotificationWithTemplate(
        'course_completion',
        userId,
        {
          name: completionDetails.studentName || 'Student',
          courseName,
          score: `${completionDetails.score}%`,
          completionDate: completionDetails.completionDate.toLocaleDateString(),
          totalModules: completionDetails.totalModules,
          totalQuizzes: completionDetails.totalQuizzes
        },
        {
          courseId,
          completionDate: completionDetails.completionDate.toISOString(),
          score: completionDetails.score
        },
        'SYSTEM'
      );

      console.log('✅ Course completion notifications sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send course completion notifications:', error);
      throw error;
    }
  }

  /**
   * Send quiz completion notification
   */
  public async sendQuizCompletionNotification(
    userId: string,
    quizId: string,
    quizName: string,
    moduleName: string,
    courseName: string,
    quizDetails: {
      score: number;
      totalQuestions: number;
      correctAnswers: number;
      timeTaken: number;
      passed: boolean;
    }
  ) {
    try {
      const templateName = quizDetails.passed ? 'quiz_passed' : 'quiz_failed';
      
      await this.sendNotificationWithTemplate(
        templateName,
        userId,
        {
          name: quizDetails.studentName || 'Student',
          quizName,
          moduleName,
          courseName,
          score: `${quizDetails.score}%`,
          totalQuestions: quizDetails.totalQuestions,
          correctAnswers: quizDetails.correctAnswers,
          timeTaken: `${Math.round(quizDetails.timeTaken / 60)} minutes`,
          passed: quizDetails.passed ? 'passed' : 'failed'
        },
        {
          quizId,
          moduleName,
          courseName,
          score: quizDetails.score,
          passed: quizDetails.passed
        },
        'SYSTEM'
      );

      console.log('✅ Quiz completion notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send quiz completion notification:', error);
      throw error;
    }
  }

  /**
   * Send achievement unlocked notification
   */
  public async sendAchievementNotification(
    userId: string,
    achievementId: string,
    achievementDetails: {
      name: string;
      description: string;
      type: string;
      points: number;
      icon?: string;
    }
  ) {
    try {
      // Send WebSocket notification
      await webSocketService.sendToUser(userId, {
        type: 'achievement',
        data: {
          title: 'Achievement Unlocked!',
          message: `You've earned the "${achievementDetails.name}" achievement!`,
          achievement: achievementDetails
        },
        timestamp: new Date()
      });

      // Send email notification
      await this.sendNotificationWithTemplate(
        'achievement_unlocked',
        userId,
        {
          name: achievementDetails.studentName || 'Student',
          achievementName: achievementDetails.name,
          achievementDescription: achievementDetails.description,
          points: achievementDetails.points,
          type: achievementDetails.type
        },
        {
          achievementId,
          type: achievementDetails.type,
          points: achievementDetails.points
        },
        'SYSTEM'
      );

      console.log('✅ Achievement notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send achievement notification:', error);
      throw error;
    }
  }

  /**
   * Send subscription status change notification
   */
  public async sendSubscriptionStatusNotification(
    userId: string,
    subscriptionId: string,
    statusChange: {
      oldStatus: string;
      newStatus: string;
      planName: string;
      reason?: string;
      effectiveDate: Date;
    }
  ) {
    try {
      const templateName = this.getSubscriptionStatusTemplate(statusChange.newStatus);
      
      await this.sendNotificationWithTemplate(
        templateName,
        userId,
        {
          name: statusChange.studentName || 'Student',
          planName: statusChange.planName,
          oldStatus: statusChange.oldStatus,
          newStatus: statusChange.newStatus,
          effectiveDate: statusChange.effectiveDate.toLocaleDateString(),
          reason: statusChange.reason || 'System update'
        },
        {
          subscriptionId,
          oldStatus: statusChange.oldStatus,
          newStatus: statusChange.newStatus,
          effectiveDate: statusChange.effectiveDate.toISOString()
        },
        'SYSTEM'
      );

      console.log('✅ Subscription status notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send subscription status notification:', error);
      throw error;
    }
  }

  /**
   * Send password reset notification
   */
  public async sendPasswordResetNotification(
    userId: string,
    resetToken: string,
    resetUrl: string
  ) {
    try {
      await this.sendNotificationWithTemplate(
        'password_reset',
        userId,
        {
          name: 'User',
          resetUrl: resetUrl
        },
        {
          resetToken,
          requestedAt: new Date().toISOString()
        },
        'SYSTEM'
      );

      console.log('✅ Password reset notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send password reset notification:', error);
      throw error;
    }
  }

  /**
   * Send account update notification
   */
  public async sendAccountUpdateNotification(
    userId: string,
    updateType: 'profile' | 'email' | 'password' | 'preferences',
    updateDetails: unknown
  ) {
    try {
      await this.sendNotificationWithTemplate(
        'account_update',
        userId,
        {
          name: updateDetails.userName || 'User',
          updateType: updateType,
          updateDate: new Date().toLocaleDateString(),
          details: updateDetails.description || 'Your account has been updated'
        },
        {
          updateType,
          updateDetails,
          updatedAt: new Date().toISOString()
        },
        'SYSTEM'
      );

      console.log('✅ Account update notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send account update notification:', error);
      throw error;
    }
  }

  /**
   * Send payment reminder notification
   */
  public async sendPaymentReminderNotification(
    userId: string,
    paymentDetails: {
      amount: number;
      dueDate: Date;
      daysRemaining: number;
      courseName?: string;
      subscriptionPlan?: string;
    }
  ) {
    try {
      const templateName = paymentDetails.courseName ? 'course_payment_reminder' : 'subscription_payment_reminder';
      
      await this.sendNotificationWithTemplate(
        templateName,
        userId,
        {
          name: paymentDetails.userName || 'Student',
          amount: `$${paymentDetails.amount.toFixed(2)}`,
          dueDate: paymentDetails.dueDate.toLocaleDateString(),
          daysRemaining: paymentDetails.daysRemaining,
          courseName: paymentDetails.courseName || '',
          subscriptionPlan: paymentDetails.subscriptionPlan || ''
        },
        {
          amount: paymentDetails.amount,
          dueDate: paymentDetails.dueDate.toISOString(),
          daysRemaining: paymentDetails.daysRemaining
        },
        'SYSTEM'
      );

      console.log('✅ Payment reminder notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send payment reminder notification:', error);
      throw error;
    }
  }

  /**
   * Send module completion notification
   */
  public async sendModuleCompletionNotification(
    userId: string,
    moduleId: string,
    moduleName: string,
    courseName: string,
    moduleDetails: {
      progress: number;
      totalContent: number;
      completedContent: number;
    }
  ) {
    try {
      await this.sendNotificationWithTemplate(
        'module_completion',
        userId,
        {
          name: moduleDetails.studentName || 'Student',
          moduleName,
          courseName,
          progress: `${moduleDetails.progress}%`,
          totalContent: moduleDetails.totalContent,
          completedContent: moduleDetails.completedContent
        },
        {
          moduleId,
          courseName,
          progress: moduleDetails.progress
        },
        'SYSTEM'
      );

      console.log('✅ Module completion notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send module completion notification:', error);
      throw error;
    }
  }

  /**
   * Send course enrollment notification
   */
  public async sendCourseEnrollmentNotification(
    userId: string,
    enrollmentId: string,
    enrollmentDetails: {
      courseName: string;
      institutionName: string;
      amount: number;
      startDate: Date;
      endDate: Date;
      studentName: string;
    }
  ) {
    try {
      await this.sendNotificationWithTemplate(
        'course_enrollment',
        userId,
        {
          name: enrollmentDetails.studentName,
          courseName: enrollmentDetails.courseName,
          institutionName: enrollmentDetails.institutionName,
          amount: `$${enrollmentDetails.amount.toFixed(2)}`,
          startDate: enrollmentDetails.startDate.toLocaleDateString(),
          endDate: enrollmentDetails.endDate.toLocaleDateString()
        },
        {
          enrollmentId,
          courseName: enrollmentDetails.courseName,
          amount: enrollmentDetails.amount
        },
        'SYSTEM'
      );

      console.log('✅ Course enrollment notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send course enrollment notification:', error);
      throw error;
    }
  }

  /**
   * Send learning streak notification
   */
  public async sendLearningStreakNotification(
    userId: string,
    streakDetails: {
      currentStreak: number;
      previousStreak: number;
      milestone: number;
    }
  ) {
    try {
      await this.sendNotificationWithTemplate(
        'learning_streak',
        userId,
        {
          name: streakDetails.studentName || 'Student',
          currentStreak: streakDetails.currentStreak,
          previousStreak: streakDetails.previousStreak,
          milestone: streakDetails.milestone
        },
        {
          currentStreak: streakDetails.currentStreak,
          milestone: streakDetails.milestone
        },
        'SYSTEM'
      );

      console.log('✅ Learning streak notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send learning streak notification:', error);
      throw error;
    }
  }

  /**
   * Send payment failure notification
   */
  public async sendPaymentFailureNotification(
    userId: string,
    enrollmentId: string,
    paymentDetails: {
      amount: number;
      referenceNumber: string;
      error: string;
      courseName: string;
      studentName: string;
    }
  ) {
    try {
      await this.sendNotificationWithTemplate(
        'payment_failed',
        userId,
        {
          name: paymentDetails.studentName,
          amount: `$${paymentDetails.amount.toFixed(2)}`,
          referenceNumber: paymentDetails.referenceNumber,
          error: paymentDetails.error,
          courseName: paymentDetails.courseName,
          date: new Date().toLocaleDateString()
        },
        {
          enrollmentId,
          amount: paymentDetails.amount,
          error: paymentDetails.error
        },
        'SYSTEM'
      );

      console.log('✅ Payment failure notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send payment failure notification:', error);
      throw error;
    }
  }

  /**
   * Send refund confirmation notification
   */
  public async sendRefundConfirmationNotification(
    userId: string,
    enrollmentId: string,
    refundDetails: {
      originalAmount: number;
      refundAmount: number;
      referenceNumber: string;
      refundedAt: Date;
      courseName: string;
      studentName: string;
    }
  ) {
    try {
      await this.sendNotificationWithTemplate(
        'refund_confirmation',
        userId,
        {
          name: refundDetails.studentName,
          originalAmount: `$${refundDetails.originalAmount.toFixed(2)}`,
          refundAmount: `$${refundDetails.refundAmount.toFixed(2)}`,
          referenceNumber: refundDetails.referenceNumber,
          refundedAt: refundDetails.refundedAt.toLocaleDateString(),
          courseName: refundDetails.courseName
        },
        {
          enrollmentId,
          originalAmount: refundDetails.originalAmount,
          refundAmount: refundDetails.refundAmount
        },
        'SYSTEM'
      );

      console.log('✅ Refund confirmation notification sent successfully');
    } catch (error) {
      logger.error('❌ Failed to send refund confirmation notification:', error);
      throw error;
    }
  }

  /**
   * Helper method to get subscription status template
   */
  private getSubscriptionStatusTemplate(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'subscription_activated';
      case 'CANCELLED':
        return 'subscription_cancelled';
      case 'EXPIRED':
        return 'subscription_expired';
      case 'PAST_DUE':
        return 'subscription_past_due';
      case 'TRIAL':
        return 'subscription_trial';
      default:
        return 'subscription_update';
    }
  }
}

export const notificationService = NotificationService.getInstance(); 