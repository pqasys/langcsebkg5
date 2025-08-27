import { prisma } from './prisma';
import { logger } from './logger';

export interface ThresholdEffectivenessMetrics {
  language: string;
  country?: string;
  region?: string;
  totalSessions: number;
  sessionsAboveThreshold: number;
  sessionsBelowThreshold: number;
  cancellationRate: number;
  averageAttendance: number;
  averageInstructorCost: number;
  averageRevenue: number;
  profitMargin: number;
  thresholdConfig: {
    minAttendanceThreshold: number;
    profitMarginThreshold: number;
    instructorHourlyRate: number;
    platformRevenuePerStudent: number;
  };
  timeRange: {
    startDate: Date;
    endDate: Date;
  };
}

export interface LanguagePerformanceComparison {
  language: string;
  metrics: ThresholdEffectivenessMetrics;
  rank: number;
  improvement: number; // percentage change from previous period
}

export interface ThresholdAnalysisReport {
  summary: {
    totalLanguages: number;
    totalSessions: number;
    overallCancellationRate: number;
    averageProfitMargin: number;
    bestPerformingLanguage: string;
    worstPerformingLanguage: string;
  };
  languageMetrics: ThresholdEffectivenessMetrics[];
  recommendations: string[];
  generatedAt: Date;
}

export class AnalyticsService {
  /**
   * Generate comprehensive threshold effectiveness report for all languages
   */
  static async generateThresholdEffectivenessReport(
    startDate: Date,
    endDate: Date,
    includeCancelled: boolean = true
  ): Promise<ThresholdAnalysisReport> {
    try {
      logger.info('Generating threshold effectiveness report', {
        startDate,
        endDate,
        includeCancelled
      });

      // Get all language threshold configurations
      const thresholdConfigs = await prisma.languageAttendanceThreshold.findMany({
        include: {
          createdBy: {
            select: { name: true, email: true }
          }
        }
      });

      const languageMetrics: ThresholdEffectivenessMetrics[] = [];
      let totalSessions = 0;
      let totalCancelledSessions = 0;
      let totalRevenue = 0;
      let totalCost = 0;

      // Analyze each language
      for (const config of thresholdConfigs) {
        const metrics = await this.analyzeLanguageThresholdEffectiveness(
          config.language,
          startDate,
          endDate,
          config,
          includeCancelled
        );

        if (metrics) {
          languageMetrics.push(metrics);
          totalSessions += metrics.totalSessions;
          totalCancelledSessions += metrics.sessionsBelowThreshold;
          totalRevenue += metrics.averageRevenue * metrics.totalSessions;
          totalCost += metrics.averageInstructorCost * metrics.totalSessions;
        }
      }

      // Calculate summary statistics
      const overallCancellationRate = totalSessions > 0 
        ? (totalCancelledSessions / totalSessions) * 100 
        : 0;
      
      const averageProfitMargin = totalCost > 0 
        ? ((totalRevenue - totalCost) / totalCost) * 100 
        : 0;

      // Find best and worst performing languages
      const sortedMetrics = [...languageMetrics].sort((a, b) => b.profitMargin - a.profitMargin);
      const bestPerformingLanguage = sortedMetrics[0]?.language || 'N/A';
      const worstPerformingLanguage = sortedMetrics[sortedMetrics.length - 1]?.language || 'N/A';

      // Generate recommendations
      const recommendations = this.generateRecommendations(languageMetrics, overallCancellationRate);

      const report: ThresholdAnalysisReport = {
        summary: {
          totalLanguages: languageMetrics.length,
          totalSessions,
          overallCancellationRate,
          averageProfitMargin,
          bestPerformingLanguage,
          worstPerformingLanguage
        },
        languageMetrics,
        recommendations,
        generatedAt: new Date()
      };

      logger.info('Threshold effectiveness report generated successfully', {
        totalLanguages: report.summary.totalLanguages,
        totalSessions: report.summary.totalSessions
      });

      return report;
    } catch (error) {
      logger.error('Error generating threshold effectiveness report', { error });
      throw error;
    }
  }

  /**
   * Analyze threshold effectiveness for a specific language
   */
  static async analyzeLanguageThresholdEffectiveness(
    language: string,
    startDate: Date,
    endDate: Date,
    thresholdConfig: any,
    includeCancelled: boolean = true
  ): Promise<ThresholdEffectivenessMetrics | null> {
    try {
      // Get all sessions for this language in the time range
      const sessions = await prisma.videoSession.findMany({
        where: {
          language,
          scheduledAt: {
            gte: startDate,
            lte: endDate
          },
          ...(includeCancelled ? {} : { status: { not: 'CANCELLED' } })
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

      let sessionsAboveThreshold = 0;
      let sessionsBelowThreshold = 0;
      let totalAttendance = 0;
      let totalRevenue = 0;
      let totalCost = 0;

      // Analyze each session
      for (const session of sessions) {
        const actualAttendance = session._count.attendances;
        const expectedAttendance = thresholdConfig.minAttendanceThreshold;
        const instructorCost = thresholdConfig.instructorHourlyRate;
        const revenuePerStudent = thresholdConfig.platformRevenuePerStudent;

        if (actualAttendance >= expectedAttendance) {
          sessionsAboveThreshold++;
        } else {
          sessionsBelowThreshold++;
        }

        totalAttendance += actualAttendance;
        totalRevenue += actualAttendance * revenuePerStudent;
        totalCost += instructorCost;
      }

      const totalSessions = sessions.length;
      const cancellationRate = (sessionsBelowThreshold / totalSessions) * 100;
      const averageAttendance = totalAttendance / totalSessions;
      const averageRevenue = totalRevenue / totalSessions;
      const averageInstructorCost = totalCost / totalSessions;
      const profitMargin = averageInstructorCost > 0 
        ? ((averageRevenue - averageInstructorCost) / averageInstructorCost) * 100 
        : 0;

      return {
        language,
        country: thresholdConfig.country,
        region: thresholdConfig.region,
        totalSessions,
        sessionsAboveThreshold,
        sessionsBelowThreshold,
        cancellationRate,
        averageAttendance,
        averageInstructorCost,
        averageRevenue,
        profitMargin,
        thresholdConfig: {
          minAttendanceThreshold: thresholdConfig.minAttendanceThreshold,
          profitMarginThreshold: thresholdConfig.profitMarginThreshold,
          instructorHourlyRate: thresholdConfig.instructorHourlyRate,
          platformRevenuePerStudent: thresholdConfig.platformRevenuePerStudent
        },
        timeRange: { startDate, endDate }
      };
    } catch (error) {
      logger.error('Error analyzing language threshold effectiveness', {
        language,
        error
      });
      throw error;
    }
  }

  /**
   * Compare language performance across different time periods
   */
  static async compareLanguagePerformance(
    language: string,
    currentPeriod: { startDate: Date; endDate: Date },
    previousPeriod: { startDate: Date; endDate: Date }
  ): Promise<LanguagePerformanceComparison | null> {
    try {
      const thresholdConfig = await prisma.languageAttendanceThreshold.findFirst({
        where: { language }
      });

      if (!thresholdConfig) {
        return null;
      }

      const currentMetrics = await this.analyzeLanguageThresholdEffectiveness(
        language,
        currentPeriod.startDate,
        currentPeriod.endDate,
        thresholdConfig
      );

      const previousMetrics = await this.analyzeLanguageThresholdEffectiveness(
        language,
        previousPeriod.startDate,
        previousPeriod.endDate,
        thresholdConfig
      );

      if (!currentMetrics || !previousMetrics) {
        return null;
      }

      const improvement = previousMetrics.profitMargin > 0
        ? ((currentMetrics.profitMargin - previousMetrics.profitMargin) / previousMetrics.profitMargin) * 100
        : 0;

      return {
        language,
        metrics: currentMetrics,
        rank: 0, // Will be set by calling function
        improvement
      };
    } catch (error) {
      logger.error('Error comparing language performance', {
        language,
        error
      });
      throw error;
    }
  }

  /**
   * Get top performing languages by profit margin
   */
  static async getTopPerformingLanguages(
    startDate: Date,
    endDate: Date,
    limit: number = 10
  ): Promise<LanguagePerformanceComparison[]> {
    try {
      const report = await this.generateThresholdEffectivenessReport(startDate, endDate);
      
      const comparisons: LanguagePerformanceComparison[] = [];
      
      for (const metrics of report.languageMetrics) {
        const thresholdConfig = await prisma.languageAttendanceThreshold.findFirst({
          where: { language: metrics.language }
        });

        if (thresholdConfig) {
          // Calculate previous period for comparison
          const periodDuration = endDate.getTime() - startDate.getTime();
          const previousEndDate = new Date(startDate.getTime() - 1);
          const previousStartDate = new Date(previousEndDate.getTime() - periodDuration);

          const comparison = await this.compareLanguagePerformance(
            metrics.language,
            { startDate, endDate },
            { startDate: previousStartDate, endDate: previousEndDate }
          );

          if (comparison) {
            comparisons.push(comparison);
          }
        }
      }

      // Sort by profit margin and assign ranks
      comparisons.sort((a, b) => b.metrics.profitMargin - a.metrics.profitMargin);
      comparisons.forEach((comparison, index) => {
        comparison.rank = index + 1;
      });

      return comparisons.slice(0, limit);
    } catch (error) {
      logger.error('Error getting top performing languages', { error });
      throw error;
    }
  }

  /**
   * Generate recommendations based on analytics data
   */
  private static generateRecommendations(
    languageMetrics: ThresholdEffectivenessMetrics[],
    overallCancellationRate: number
  ): string[] {
    const recommendations: string[] = [];

    // High cancellation rate recommendations
    if (overallCancellationRate > 30) {
      recommendations.push(
        'High cancellation rate detected. Consider reducing minimum attendance thresholds or improving marketing efforts.'
      );
    }

    // Language-specific recommendations
    for (const metrics of languageMetrics) {
      if (metrics.cancellationRate > 50) {
        recommendations.push(
          `${metrics.language}: Very high cancellation rate (${metrics.cancellationRate.toFixed(1)}%). Consider reducing threshold from ${metrics.thresholdConfig.minAttendanceThreshold} to ${Math.max(2, metrics.thresholdConfig.minAttendanceThreshold - 2)}.`
        );
      }

      if (metrics.profitMargin < 0) {
        recommendations.push(
          `${metrics.language}: Negative profit margin detected. Consider increasing platform revenue per student or reducing instructor costs.`
        );
      }

      if (metrics.averageAttendance > metrics.thresholdConfig.minAttendanceThreshold * 1.5) {
        recommendations.push(
          `${metrics.language}: Consistently high attendance. Consider increasing threshold to ${Math.min(20, metrics.thresholdConfig.minAttendanceThreshold + 2)} to maximize profitability.`
        );
      }
    }

    // General recommendations
    if (languageMetrics.length > 0) {
      const avgProfitMargin = languageMetrics.reduce((sum, m) => sum + m.profitMargin, 0) / languageMetrics.length;
      
      if (avgProfitMargin < 20) {
        recommendations.push(
          'Overall profit margins are below target. Consider reviewing pricing strategy and cost structure.'
        );
      }
    }

    return recommendations;
  }

  /**
   * Get real-time threshold performance metrics
   */
  static async getRealTimeThresholdMetrics(): Promise<{
    activeSessions: number;
    sessionsAtRisk: number;
    sessionsAboveThreshold: number;
    totalExpectedRevenue: number;
    totalExpectedCost: number;
  }> {
    try {
      const now = new Date();
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Get sessions scheduled in the next 24 hours
      const upcomingSessions = await prisma.videoSession.findMany({
        where: {
          scheduledAt: {
            gte: now,
            lte: next24Hours
          },
          status: 'SCHEDULED'
        },
        include: {
          attendances: true,
          _count: {
            select: { attendances: true }
          }
        }
      });

      let sessionsAtRisk = 0;
      let sessionsAboveThreshold = 0;
      let totalExpectedRevenue = 0;
      let totalExpectedCost = 0;

      for (const session of upcomingSessions) {
        const thresholdConfig = await prisma.languageAttendanceThreshold.findFirst({
          where: { language: session.language }
        });

        if (thresholdConfig) {
          const currentAttendance = session._count.attendances;
          const expectedAttendance = thresholdConfig.minAttendanceThreshold;

          if (currentAttendance < expectedAttendance) {
            sessionsAtRisk++;
          } else {
            sessionsAboveThreshold++;
          }

          totalExpectedRevenue += currentAttendance * thresholdConfig.platformRevenuePerStudent;
          totalExpectedCost += thresholdConfig.instructorHourlyRate;
        }
      }

      return {
        activeSessions: upcomingSessions.length,
        sessionsAtRisk,
        sessionsAboveThreshold,
        totalExpectedRevenue,
        totalExpectedCost
      };
    } catch (error) {
      logger.error('Error getting real-time threshold metrics', { error });
      throw error;
    }
  }
}
