import { prisma } from './prisma';
import { logger } from './logger';
import { NotificationService } from './notification-service';

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  language: string;
  country?: string;
  region?: string;
  metric: 'CANCELLATION_RATE' | 'PROFIT_MARGIN' | 'ATTENDANCE_THRESHOLD' | 'REVENUE_DROP';
  operator: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'NOT_EQUALS';
  threshold: number;
  timeWindow: number; // in minutes
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  enabled: boolean;
  notificationChannels: string[]; // email, slack, webhook, etc.
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  ruleId: string;
  language: string;
  country?: string;
  region?: string;
  metric: string;
  currentValue: number;
  threshold: number;
  severity: string;
  message: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  triggeredAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  acknowledgedBy?: string;
}

export interface MonitoringMetrics {
  language: string;
  country?: string;
  region?: string;
  cancellationRate: number;
  profitMargin: number;
  averageAttendance: number;
  totalSessions: number;
  sessionsAtRisk: number;
  expectedRevenue: number;
  actualRevenue: number;
  revenueDrop: number;
  lastUpdated: Date;
}

export class MonitoringService {
  /**
   * Create a new alert rule
   */
  static async createAlertRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertRule> {
    try {
      logger.info('Creating alert rule', {
        name: rule.name,
        language: rule.language,
        metric: rule.metric,
        createdBy: rule.createdBy
      });

      const alertRule = await prisma.alertRule.create({
        data: {
          name: rule.name,
          description: rule.description,
          language: rule.language,
          country: rule.country,
          region: rule.region,
          metric: rule.metric,
          operator: rule.operator,
          threshold: rule.threshold,
          timeWindow: rule.timeWindow,
          severity: rule.severity,
          enabled: rule.enabled,
          notificationChannels: rule.notificationChannels,
          createdBy: rule.createdBy
        }
      });

      logger.info('Alert rule created successfully', { ruleId: alertRule.id });
      return this.mapPrismaToAlertRule(alertRule);
    } catch (error) {
      logger.error('Error creating alert rule', { error });
      throw error;
    }
  }

  /**
   * Get all alert rules for a language
   */
  static async getAlertRules(language: string): Promise<AlertRule[]> {
    try {
      const rules = await prisma.alertRule.findMany({
        where: { language },
        orderBy: { createdAt: 'desc' }
      });

      return rules.map(rule => this.mapPrismaToAlertRule(rule));
    } catch (error) {
      logger.error('Error getting alert rules', { language, error });
      throw error;
    }
  }

  /**
   * Update alert rule
   */
  static async updateAlertRule(ruleId: string, updates: Partial<AlertRule>): Promise<AlertRule> {
    try {
      const rule = await prisma.alertRule.update({
        where: { id: ruleId },
        data: updates
      });

      return this.mapPrismaToAlertRule(rule);
    } catch (error) {
      logger.error('Error updating alert rule', { ruleId, error });
      throw error;
    }
  }

  /**
   * Delete alert rule
   */
  static async deleteAlertRule(ruleId: string): Promise<void> {
    try {
      await prisma.alertRule.delete({
        where: { id: ruleId }
      });

      logger.info('Alert rule deleted', { ruleId });
    } catch (error) {
      logger.error('Error deleting alert rule', { ruleId, error });
      throw error;
    }
  }

  /**
   * Get current monitoring metrics for a language
   */
  static async getMonitoringMetrics(
    language: string,
    country?: string,
    region?: string
  ): Promise<MonitoringMetrics | null> {
    try {
      const now = new Date();
      const timeWindow = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours

      // Get sessions in the time window
      const sessions = await prisma.videoSession.findMany({
        where: {
          language,
          country: country || null,
          region: region || null,
          scheduledAt: {
            gte: timeWindow,
            lte: now
          }
        },
        include: {
          attendances: true,
          _count: {
            select: { attendances: true }
          }
        }
      });

      if (sessions.length === 0) {
        return null;
      }

      // Calculate metrics
      let totalSessions = sessions.length;
      let sessionsAtRisk = 0;
      let totalAttendance = 0;
      let totalExpectedRevenue = 0;
      let totalActualRevenue = 0;

      for (const session of sessions) {
        const attendance = session._count.attendances;
        totalAttendance += attendance;

        // Get threshold config for this session
        const thresholdConfig = await prisma.languageAttendanceThreshold.findFirst({
          where: { language }
        });

        if (thresholdConfig) {
          const expectedAttendance = thresholdConfig.minAttendanceThreshold;
          if (attendance < expectedAttendance) {
            sessionsAtRisk++;
          }

          totalExpectedRevenue += expectedAttendance * thresholdConfig.platformRevenuePerStudent;
          totalActualRevenue += attendance * thresholdConfig.platformRevenuePerStudent;
        }
      }

      const cancellationRate = (sessionsAtRisk / totalSessions) * 100;
      const averageAttendance = totalAttendance / totalSessions;
      const revenueDrop = totalExpectedRevenue > 0 
        ? ((totalExpectedRevenue - totalActualRevenue) / totalExpectedRevenue) * 100 
        : 0;

      // Calculate profit margin (simplified)
      const totalCost = sessions.length * 50; // Assuming $50 per session
      const profitMargin = totalCost > 0 
        ? ((totalActualRevenue - totalCost) / totalCost) * 100 
        : 0;

      return {
        language,
        country,
        region,
        cancellationRate,
        profitMargin,
        averageAttendance,
        totalSessions,
        sessionsAtRisk,
        expectedRevenue: totalExpectedRevenue,
        actualRevenue: totalActualRevenue,
        revenueDrop,
        lastUpdated: now
      };
    } catch (error) {
      logger.error('Error getting monitoring metrics', { language, country, region, error });
      throw error;
    }
  }

  /**
   * Check alert rules and trigger alerts
   */
  static async checkAlertRules(): Promise<Alert[]> {
    try {
      logger.info('Checking alert rules');

      const alertRules = await prisma.alertRule.findMany({
        where: { enabled: true }
      });

      const triggeredAlerts: Alert[] = [];

      for (const rule of alertRules) {
        const metrics = await this.getMonitoringMetrics(
          rule.language,
          rule.country || undefined,
          rule.region || undefined
        );

        if (!metrics) continue;

        const currentValue = this.getMetricValue(metrics, rule.metric);
        const shouldTrigger = this.evaluateAlertCondition(
          currentValue,
          rule.operator,
          rule.threshold
        );

        if (shouldTrigger) {
          // Check if there's already an active alert for this rule
          const existingAlert = await prisma.alert.findFirst({
            where: {
              ruleId: rule.id,
              status: 'ACTIVE'
            }
          });

          if (!existingAlert) {
            const alert = await this.createAlert(rule, currentValue, metrics);
            triggeredAlerts.push(alert);

            // Send notifications
            await this.sendAlertNotifications(alert, rule);
          }
        }
      }

      logger.info('Alert rules check completed', {
        totalRules: alertRules.length,
        triggeredAlerts: triggeredAlerts.length
      });

      return triggeredAlerts;
    } catch (error) {
      logger.error('Error checking alert rules', { error });
      throw error;
    }
  }

  /**
   * Get metric value from monitoring metrics
   */
  private static getMetricValue(metrics: MonitoringMetrics, metric: string): number {
    switch (metric) {
      case 'CANCELLATION_RATE':
        return metrics.cancellationRate;
      case 'PROFIT_MARGIN':
        return metrics.profitMargin;
      case 'ATTENDANCE_THRESHOLD':
        return metrics.averageAttendance;
      case 'REVENUE_DROP':
        return metrics.revenueDrop;
      default:
        return 0;
    }
  }

  /**
   * Evaluate alert condition
   */
  private static evaluateAlertCondition(
    currentValue: number,
    operator: string,
    threshold: number
  ): boolean {
    switch (operator) {
      case 'GREATER_THAN':
        return currentValue > threshold;
      case 'LESS_THAN':
        return currentValue < threshold;
      case 'EQUALS':
        return currentValue === threshold;
      case 'NOT_EQUALS':
        return currentValue !== threshold;
      default:
        return false;
    }
  }

  /**
   * Create alert record
   */
  private static async createAlert(
    rule: any,
    currentValue: number,
    metrics: MonitoringMetrics
  ): Promise<Alert> {
    const message = this.generateAlertMessage(rule, currentValue, metrics);

    const alert = await prisma.alert.create({
      data: {
        ruleId: rule.id,
        language: rule.language,
        country: rule.country,
        region: rule.region,
        metric: rule.metric,
        currentValue,
        threshold: rule.threshold,
        severity: rule.severity,
        message,
        status: 'ACTIVE',
        triggeredAt: new Date()
      }
    });

    return this.mapPrismaToAlert(alert);
  }

  /**
   * Generate alert message
   */
  private static generateAlertMessage(
    rule: any,
    currentValue: number,
    metrics: MonitoringMetrics
  ): string {
    const metricName = rule.metric.replace('_', ' ').toLowerCase();
    const operatorText = rule.operator.replace('_', ' ').toLowerCase();

    return `${rule.name}: ${metricName} is ${currentValue.toFixed(2)} which is ${operatorText} the threshold of ${rule.threshold}. Language: ${rule.language}, Severity: ${rule.severity}`;
  }

  /**
   * Send alert notifications
   */
  private static async sendAlertNotifications(alert: Alert, rule: any): Promise<void> {
    try {
      for (const channel of rule.notificationChannels) {
        switch (channel) {
          case 'email':
            await NotificationService.sendAlertEmail(alert, rule);
            break;
          case 'slack':
            await NotificationService.sendAlertSlack(alert, rule);
            break;
          case 'webhook':
            await NotificationService.sendAlertWebhook(alert, rule);
            break;
          default:
            logger.warn('Unknown notification channel', { channel });
        }
      }

      logger.info('Alert notifications sent', {
        alertId: alert.id,
        channels: rule.notificationChannels
      });
    } catch (error) {
      logger.error('Error sending alert notifications', { alertId: alert.id, error });
    }
  }

  /**
   * Get active alerts
   */
  static async getActiveAlerts(language?: string): Promise<Alert[]> {
    try {
      const whereClause: any = { status: 'ACTIVE' };
      if (language) {
        whereClause.language = language;
      }

      const alerts = await prisma.alert.findMany({
        where: whereClause,
        orderBy: { triggeredAt: 'desc' }
      });

      return alerts.map(alert => this.mapPrismaToAlert(alert));
    } catch (error) {
      logger.error('Error getting active alerts', { error });
      throw error;
    }
  }

  /**
   * Acknowledge alert
   */
  static async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<Alert> {
    try {
      const alert = await prisma.alert.update({
        where: { id: alertId },
        data: {
          status: 'ACKNOWLEDGED',
          acknowledgedAt: new Date(),
          acknowledgedBy
        }
      });

      return this.mapPrismaToAlert(alert);
    } catch (error) {
      logger.error('Error acknowledging alert', { alertId, error });
      throw error;
    }
  }

  /**
   * Resolve alert
   */
  static async resolveAlert(alertId: string): Promise<Alert> {
    try {
      const alert = await prisma.alert.update({
        where: { id: alertId },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date()
        }
      });

      return this.mapPrismaToAlert(alert);
    } catch (error) {
      logger.error('Error resolving alert', { alertId, error });
      throw error;
    }
  }

  /**
   * Get alert statistics
   */
  static async getAlertStatistics(days: number = 7): Promise<{
    totalAlerts: number;
    activeAlerts: number;
    acknowledgedAlerts: number;
    resolvedAlerts: number;
    alertsBySeverity: Record<string, number>;
    alertsByLanguage: Record<string, number>;
  }> {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const alerts = await prisma.alert.findMany({
        where: {
          triggeredAt: {
            gte: startDate
          }
        }
      });

      const statistics = {
        totalAlerts: alerts.length,
        activeAlerts: alerts.filter(a => a.status === 'ACTIVE').length,
        acknowledgedAlerts: alerts.filter(a => a.status === 'ACKNOWLEDGED').length,
        resolvedAlerts: alerts.filter(a => a.status === 'RESOLVED').length,
        alertsBySeverity: {} as Record<string, number>,
        alertsByLanguage: {} as Record<string, number>
      };

      // Count by severity
      alerts.forEach(alert => {
        statistics.alertsBySeverity[alert.severity] = 
          (statistics.alertsBySeverity[alert.severity] || 0) + 1;
      });

      // Count by language
      alerts.forEach(alert => {
        statistics.alertsByLanguage[alert.language] = 
          (statistics.alertsByLanguage[alert.language] || 0) + 1;
      });

      return statistics;
    } catch (error) {
      logger.error('Error getting alert statistics', { error });
      throw error;
    }
  }

  /**
   * Map Prisma model to AlertRule interface
   */
  private static mapPrismaToAlertRule(prismaModel: any): AlertRule {
    return {
      id: prismaModel.id,
      name: prismaModel.name,
      description: prismaModel.description,
      language: prismaModel.language,
      country: prismaModel.country,
      region: prismaModel.region,
      metric: prismaModel.metric,
      operator: prismaModel.operator,
      threshold: prismaModel.threshold,
      timeWindow: prismaModel.timeWindow,
      severity: prismaModel.severity,
      enabled: prismaModel.enabled,
      notificationChannels: prismaModel.notificationChannels,
      createdBy: prismaModel.createdBy,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt
    };
  }

  /**
   * Map Prisma model to Alert interface
   */
  private static mapPrismaToAlert(prismaModel: any): Alert {
    return {
      id: prismaModel.id,
      ruleId: prismaModel.ruleId,
      language: prismaModel.language,
      country: prismaModel.country,
      region: prismaModel.region,
      metric: prismaModel.metric,
      currentValue: prismaModel.currentValue,
      threshold: prismaModel.threshold,
      severity: prismaModel.severity,
      message: prismaModel.message,
      status: prismaModel.status,
      triggeredAt: prismaModel.triggeredAt,
      acknowledgedAt: prismaModel.acknowledgedAt,
      resolvedAt: prismaModel.resolvedAt,
      acknowledgedBy: prismaModel.acknowledgedBy
    };
  }
}
