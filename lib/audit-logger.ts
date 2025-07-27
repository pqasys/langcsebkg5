import { prisma } from './prisma';
import { logger } from './logger';

export interface AuditLogData {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: unknown;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'AUTHENTICATION' | 'AUTHORIZATION' | 'DATA_ACCESS' | 'DATA_MODIFICATION' | 'SYSTEM' | 'SECURITY' | 'PAYMENT' | 'USER_ACTION';
  metadata?: unknown;
}

export interface AuditLogQuery {
  userId?: string;
  action?: string;
  resource?: string;
  severity?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

class AuditLogger {
  private static instance: AuditLogger;

  private constructor() {}

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Log an audit event
   */
  public async log(data: AuditLogData): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          details: data.details,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          sessionId: data.sessionId,
          severity: data.severity,
          category: data.category,
          metadata: data.metadata,
          timestamp: new Date()
        }
      });

      // Log to console for development
      if (process.env.NODE_ENV === 'development') {
        // // // console.log(` AUDIT: ${data.action} on ${data.resource} by ${data.userId || 'anonymous'} (${data.severity})`);
      }
    } catch (error) {
      logger.error('Failed to log audit event:');
      // Don't throw error to avoid breaking application flow
    }
  }

  /**
   * Log authentication events
   */
  public async logAuthEvent(
    userId: string,
    action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'PASSWORD_RESET' | 'PASSWORD_CHANGE' | 'ACCOUNT_LOCKED',
    details?: unknown,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const severity = action === 'LOGIN_FAILED' || action === 'ACCOUNT_LOCKED' ? 'HIGH' : 'LOW';
    
    await this.log({
      userId,
      action,
      resource: 'AUTH',
      details,
      ipAddress,
      userAgent,
      severity,
      category: 'AUTHENTICATION'
    });
  }

  /**
   * Log data access events
   */
  public async logDataAccess(
    userId: string,
    resource: string,
    resourceId: string,
    action: 'READ' | 'LIST' | 'SEARCH',
    details?: unknown,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
      severity: 'LOW',
      category: 'DATA_ACCESS'
    });
  }

  /**
   * Log data modification events
   */
  public async logDataModification(
    userId: string,
    resource: string,
    resourceId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'BULK_UPDATE' | 'BULK_DELETE',
    details?: unknown,
    ipAddress?: string
  ): Promise<void> {
    const severity = action === 'DELETE' || action === 'BULK_DELETE' ? 'HIGH' : 'MEDIUM';
    
    await this.log({
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
      severity,
      category: 'DATA_MODIFICATION'
    });
  }

  /**
   * Log payment events
   */
  public async logPaymentEvent(
    userId: string,
    action: 'PAYMENT_INITIATED' | 'PAYMENT_COMPLETED' | 'PAYMENT_FAILED' | 'REFUND_ISSUED',
    amount: number,
    currency: string,
    paymentMethod: string,
    details?: unknown,
    ipAddress?: string
  ): Promise<void> {
    const severity = action === 'PAYMENT_FAILED' ? 'HIGH' : 'MEDIUM';
    
    await this.log({
      userId,
      action,
      resource: 'PAYMENT',
      details: {
        amount,
        currency,
        paymentMethod,
        ...details
      },
      ipAddress,
      severity,
      category: 'PAYMENT'
    });
  }

  /**
   * Log security events
   */
  public async logSecurityEvent(
    userId: string,
    action: 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_ACTIVITY' | 'UNAUTHORIZED_ACCESS' | 'PERMISSION_DENIED' | 'ACCOUNT_COMPROMISED',
    details?: unknown,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const severity = action === 'ACCOUNT_COMPROMISED' ? 'CRITICAL' : 'HIGH';
    
    await this.log({
      userId,
      action,
      resource: 'SECURITY',
      details,
      ipAddress,
      userAgent,
      severity,
      category: 'SECURITY'
    });
  }

  /**
   * Log system events
   */
  public async logSystemEvent(
    action: 'SYSTEM_STARTUP' | 'SYSTEM_SHUTDOWN' | 'MAINTENANCE_MODE' | 'BACKUP_CREATED' | 'ERROR_OCCURRED',
    details?: unknown
  ): Promise<void> {
    await this.log({
      action,
      resource: 'SYSTEM',
      details,
      severity: 'LOW',
      category: 'SYSTEM'
    });
  }

  /**
   * Query audit logs
   */
  public async queryLogs(query: AuditLogQuery): Promise<{
    logs: unknown[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      userId,
      action,
      resource,
      severity,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = query;

    const whereClause: unknown = {};

    if (userId) whereClause.userId = userId;
    if (action) whereClause.action = action;
    if (resource) whereClause.resource = resource;
    if (severity) whereClause.severity = severity;
    if (category) whereClause.category = category;
    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp.gte = startDate;
      if (endDate) whereClause.timestamp.lte = endDate;
    }

    const offset = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.auditLog.count({ where: whereClause })
    ]);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Get audit statistics
   */
  public async getStats(startDate?: Date, endDate?: Date): Promise<{
    totalEvents: number;
    eventsByCategory: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    topUsers: Array<{ userId: string; count: number }>;
    topActions: Array<{ action: string; count: number }>;
    securityEvents: number;
    failedAuthAttempts: number;
  }> {
    const whereClause: unknown = {};
    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp.gte = startDate;
      if (endDate) whereClause.timestamp.lte = endDate;
    }

    const [
      totalEvents,
      eventsByCategory,
      eventsBySeverity,
      topUsers,
      topActions,
      securityEvents,
      failedAuthAttempts
    ] = await Promise.all([
      prisma.auditLog.count({ where: whereClause }),
      prisma.auditLog.groupBy({
        by: ['category'],
        _count: { category: true },
        where: whereClause
      }),
      prisma.auditLog.groupBy({
        by: ['severity'],
        _count: { severity: true },
        where: whereClause
      }),
      prisma.auditLog.groupBy({
        by: ['userId'],
        _count: { userId: true },
        where: { ...whereClause, userId: { not: null } },
        orderBy: { _count: { userId: 'desc' } },
        take: 10
      }),
      prisma.auditLog.groupBy({
        by: ['action'],
        _count: { action: true },
        where: whereClause,
        orderBy: { _count: { action: 'desc' } },
        take: 10
      }),
      prisma.auditLog.count({
        where: { ...whereClause, category: 'SECURITY' }
      }),
      prisma.auditLog.count({
        where: { ...whereClause, action: 'LOGIN_FAILED' }
      })
    ]);

    return {
      totalEvents,
      eventsByCategory: eventsByCategory.reduce((acc, item) => {
        acc[item.category] = item._count.category;
        return acc;
      }, {} as Record<string, number>),
      eventsBySeverity: eventsBySeverity.reduce((acc, item) => {
        acc[item.severity] = item._count.severity;
        return acc;
      }, {} as Record<string, number>),
      topUsers: topUsers.map(item => ({
        userId: item.userId!,
        count: item._count.userId
      })),
      topActions: topActions.map(item => ({
        action: item.action,
        count: item._count.action
      })),
      securityEvents,
      failedAuthAttempts
    };
  }

  /**
   * Export audit logs
   */
  public async exportLogs(query: AuditLogQuery, format: 'CSV' | 'JSON' = 'CSV'): Promise<string> {
    const { logs } = await this.queryLogs({ ...query, limit: 10000 });

    if (format === 'JSON') {
      return JSON.stringify(logs, null, 2);
    }

    // CSV format
    const headers = ['Timestamp', 'User ID', 'Action', 'Resource', 'Resource ID', 'Severity', 'Category', 'IP Address'];
    const csvRows = [headers.join(',')];

    logs.forEach(log => {
      const row = [
        log.timestamp.toISOString(),
        log.userId || '',
        log.action,
        log.resource,
        log.resourceId || '',
        log.severity,
        log.category,
        log.ipAddress || ''
      ].map(field => `"${field}"`).join(',');
      
      csvRows.push(row);
    });

    return csvRows.join('\n');
  }

  /**
   * Clean up old audit logs
   */
  public async cleanupOldLogs(daysToKeep: number = 365): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate
        }
      }
    });

    return result.count;
  }
}

export const auditLogger = AuditLogger.getInstance();

// Export auditLog as an alias for backward compatibility
export const auditLog = auditLogger.log.bind(auditLogger);

// Convenience functions for common audit events
export const auditEvents = {
  // Authentication events
  login: (userId: string, ipAddress?: string, userAgent?: string) =>
    auditLogger.logAuthEvent(userId, 'LOGIN', undefined, ipAddress, userAgent),
  
  loginFailed: (email: string, ipAddress?: string, userAgent?: string) =>
    auditLogger.logAuthEvent('anonymous', 'LOGIN_FAILED', { email }, ipAddress, userAgent),
  
  logout: (userId: string, ipAddress?: string) =>
    auditLogger.logAuthEvent(userId, 'LOGOUT', undefined, ipAddress),
  
  passwordReset: (userId: string, ipAddress?: string) =>
    auditLogger.logAuthEvent(userId, 'PASSWORD_RESET', undefined, ipAddress),
  
  // Data events
  create: (userId: string, resource: string, resourceId: string, details?: unknown, ipAddress?: string) =>
    auditLogger.logDataModification(userId, resource, resourceId, 'CREATE', details, ipAddress),
  
  update: (userId: string, resource: string, resourceId: string, details?: unknown, ipAddress?: string) =>
    auditLogger.logDataModification(userId, resource, resourceId, 'UPDATE', details, ipAddress),
  
  delete: (userId: string, resource: string, resourceId: string, details?: unknown, ipAddress?: string) =>
    auditLogger.logDataModification(userId, resource, resourceId, 'DELETE', details, ipAddress),
  
  read: (userId: string, resource: string, resourceId: string, ipAddress?: string) =>
    auditLogger.logDataAccess(userId, resource, resourceId, 'READ', undefined, ipAddress),
  
  // Payment events
  paymentCompleted: (userId: string, amount: number, currency: string, paymentMethod: string, details?: unknown, ipAddress?: string) =>
    auditLogger.logPaymentEvent(userId, 'PAYMENT_COMPLETED', amount, currency, paymentMethod, details, ipAddress),
  
  paymentFailed: (userId: string, amount: number, currency: string, paymentMethod: string, details?: unknown, ipAddress?: string) =>
    auditLogger.logPaymentEvent(userId, 'PAYMENT_FAILED', amount, currency, paymentMethod, details, ipAddress),
  
  // Security events
  unauthorizedAccess: (userId: string, resource: string, ipAddress?: string, userAgent?: string) =>
    auditLogger.logSecurityEvent(userId, 'UNAUTHORIZED_ACCESS', { resource }, ipAddress, userAgent),
  
  rateLimitExceeded: (userId: string, ipAddress?: string) =>
    auditLogger.logSecurityEvent(userId, 'RATE_LIMIT_EXCEEDED', undefined, ipAddress),
  
  // System events
  systemStartup: () => auditLogger.logSystemEvent('SYSTEM_STARTUP'),
  systemError: (error: Error) => auditLogger.logSystemEvent('ERROR_OCCURRED', { message: error.message, stack: error.stack })
}; 