import { NextRequest } from 'next/server';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogContext {
  userId?: string;
  institutionId?: string;
  courseId?: string;
  moduleId?: string;
  quizId?: string;
  questionId?: string;
  paymentId?: string;
  enrollmentId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  path?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  stack?: string;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext, error?: Error): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    
    let formattedMessage = `[${timestamp}] ${levelName}: ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formattedMessage += ` | Context: ${JSON.stringify(context)}`;
    }
    
    if (error) {
      formattedMessage += ` | Error: ${error.message}`;
      if (this.isDevelopment && error.stack) {
        formattedMessage += ` | Stack: ${error.stack}`;
      }
    }
    
    return formattedMessage;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context, error);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        // // // console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        // // // console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedMessage);
        break;
    }

    // In production, you might want to send logs to a service like DataDog, LogRocket, etc.
    if (!this.isDevelopment && level >= LogLevel.ERROR) {
      this.sendToExternalService(level, message, context, error);
    }
  }

  private sendToExternalService(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    // TODO: Implement external logging service integration (see roadmap: 'Security - audit logging system')
    // Examples: DataDog, LogRocket, Sentry, etc.
    // This is where you'd send logs to your preferred service
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  // Helper method to extract context from NextRequest
  extractContextFromRequest(req: NextRequest): LogContext {
    const context: LogContext = {
      method: req.method,
      path: req.nextUrl?.pathname,
      ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
    };

    // Extract user ID from headers if available
    const userId = req.headers.get('x-user-id');
    if (userId) context.userId = userId;

    // Extract institution ID from headers if available
    const institutionId = req.headers.get('x-institution-id');
    if (institutionId) context.institutionId = institutionId;

    return context;
  }

  // Helper method for API route logging
  logApiRequest(req: NextRequest, message: string, level: LogLevel = LogLevel.INFO, error?: Error): void {
    const context = this.extractContextFromRequest(req);
    this.log(level, message, context, error);
  }

  // Helper method for database operation logging
  logDatabaseOperation(operation: string, table: string, context?: LogContext, error?: Error): void {
    const message = `Database ${operation} on ${table}`;
    if (error) {
      this.error(message, context, error);
    } else {
      this.info(message, context);
    }
  }

  // Helper method for payment operation logging
  logPaymentOperation(operation: string, paymentId: string, amount?: number, context?: LogContext, error?: Error): void {
    const message = `Payment ${operation}${amount ? ` - $${amount}` : ''}`;
    const paymentContext = { ...context, paymentId };
    if (error) {
      this.error(message, paymentContext, error);
    } else {
      this.info(message, paymentContext);
    }
  }

  // Helper method for enrollment operation logging
  logEnrollmentOperation(operation: string, enrollmentId: string, courseId?: string, context?: LogContext, error?: Error): void {
    const message = `Enrollment ${operation}`;
    const enrollmentContext = { ...context, enrollmentId, courseId };
    if (error) {
      this.error(message, enrollmentContext, error);
    } else {
      this.info(message, enrollmentContext);
    }
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext, error?: Error) => logger.warn(message, context, error);
export const logError = (message: string, context?: LogContext, error?: Error) => logger.error(message, context, error);
export const logFatal = (message: string, context?: LogContext, error?: Error) => logger.fatal(message, context, error); 