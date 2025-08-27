import { prisma } from './prisma';
import { logger } from './logger';

export interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  language: string;
  country?: string;
  region?: string;
  variantA: {
    minAttendanceThreshold: number;
    profitMarginThreshold: number;
    instructorHourlyRate: number;
    platformRevenuePerStudent: number;
  };
  variantB: {
    minAttendanceThreshold: number;
    profitMarginThreshold: number;
    instructorHourlyRate: number;
    platformRevenuePerStudent: number;
  };
  trafficSplit: number; // percentage of traffic to variant B (0-100)
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ABTestResult {
  testId: string;
  variant: 'A' | 'B';
  totalSessions: number;
  sessionsAboveThreshold: number;
  sessionsBelowThreshold: number;
  cancellationRate: number;
  averageAttendance: number;
  averageRevenue: number;
  averageCost: number;
  profitMargin: number;
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
}

export interface ABTestComparison {
  testId: string;
  testName: string;
  language: string;
  variantAResults: ABTestResult;
  variantBResults: ABTestResult;
  winner: 'A' | 'B' | 'TIE' | 'INSUFFICIENT_DATA';
  confidence: number; // statistical confidence level (0-100)
  improvement: {
    cancellationRate: number;
    profitMargin: number;
    revenue: number;
  };
  recommendations: string[];
}

export class ABTestingService {
  /**
   * Create a new A/B test configuration
   */
  static async createABTest(config: Omit<ABTestConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ABTestConfig> {
    try {
      logger.info('Creating A/B test configuration', {
        name: config.name,
        language: config.language,
        createdBy: config.createdBy
      });

      const abTest = await prisma.aBTest.create({
        data: {
          name: config.name,
          description: config.description,
          language: config.language,
          country: config.country,
          region: config.region,
          variantAThreshold: config.variantA.minAttendanceThreshold,
          variantAProfitMargin: config.variantA.profitMarginThreshold,
          variantAInstructorRate: config.variantA.instructorHourlyRate,
          variantAPlatformRevenue: config.variantA.platformRevenuePerStudent,
          variantBThreshold: config.variantB.minAttendanceThreshold,
          variantBProfitMargin: config.variantB.profitMarginThreshold,
          variantBInstructorRate: config.variantB.instructorHourlyRate,
          variantBPlatformRevenue: config.variantB.platformRevenuePerStudent,
          trafficSplit: config.trafficSplit,
          startDate: config.startDate,
          endDate: config.endDate,
          status: config.status,
          createdBy: config.createdBy
        }
      });

      logger.info('A/B test configuration created successfully', { testId: abTest.id });
      return this.mapPrismaToABTestConfig(abTest);
    } catch (error) {
      logger.error('Error creating A/B test configuration', { error });
      throw error;
    }
  }

  /**
   * Get A/B test configuration by ID
   */
  static async getABTest(testId: string): Promise<ABTestConfig | null> {
    try {
      const abTest = await prisma.aBTest.findUnique({
        where: { id: testId }
      });

      return abTest ? this.mapPrismaToABTestConfig(abTest) : null;
    } catch (error) {
      logger.error('Error getting A/B test configuration', { testId, error });
      throw error;
    }
  }

  /**
   * Get all A/B tests for a language
   */
  static async getABTestsByLanguage(language: string): Promise<ABTestConfig[]> {
    try {
      const abTests = await prisma.aBTest.findMany({
        where: { language },
        orderBy: { createdAt: 'desc' }
      });

      return abTests.map(test => this.mapPrismaToABTestConfig(test));
    } catch (error) {
      logger.error('Error getting A/B tests by language', { language, error });
      throw error;
    }
  }

  /**
   * Update A/B test status
   */
  static async updateABTestStatus(testId: string, status: ABTestConfig['status']): Promise<ABTestConfig> {
    try {
      logger.info('Updating A/B test status', { testId, status });

      const abTest = await prisma.aBTest.update({
        where: { id: testId },
        data: { status }
      });

      return this.mapPrismaToABTestConfig(abTest);
    } catch (error) {
      logger.error('Error updating A/B test status', { testId, status, error });
      throw error;
    }
  }

  /**
   * Get variant assignment for a session
   */
  static async getVariantAssignment(
    language: string,
    country?: string,
    region?: string
  ): Promise<'A' | 'B' | null> {
    try {
      // Find active A/B test for this language/country/region
      const activeTest = await prisma.aBTest.findFirst({
        where: {
          language,
          country: country || null,
          region: region || null,
          status: 'ACTIVE',
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        }
      });

      if (!activeTest) {
        return null;
      }

      // Simple random assignment based on traffic split
      const random = Math.random() * 100;
      return random < activeTest.trafficSplit ? 'B' : 'A';
    } catch (error) {
      logger.error('Error getting variant assignment', { language, country, region, error });
      return null;
    }
  }

  /**
   * Get threshold configuration for a variant
   */
  static async getVariantThresholdConfig(
    testId: string,
    variant: 'A' | 'B'
  ): Promise<{
    minAttendanceThreshold: number;
    profitMarginThreshold: number;
    instructorHourlyRate: number;
    platformRevenuePerStudent: number;
  } | null> {
    try {
      const abTest = await prisma.aBTest.findUnique({
        where: { id: testId }
      });

      if (!abTest) {
        return null;
      }

      if (variant === 'A') {
        return {
          minAttendanceThreshold: abTest.variantAThreshold,
          profitMarginThreshold: abTest.variantAProfitMargin,
          instructorHourlyRate: abTest.variantAInstructorRate,
          platformRevenuePerStudent: abTest.variantAPlatformRevenue
        };
      } else {
        return {
          minAttendanceThreshold: abTest.variantBThreshold,
          profitMarginThreshold: abTest.variantBProfitMargin,
          instructorHourlyRate: abTest.variantBInstructorRate,
          platformRevenuePerStudent: abTest.variantBPlatformRevenue
        };
      }
    } catch (error) {
      logger.error('Error getting variant threshold config', { testId, variant, error });
      return null;
    }
  }

  /**
   * Record session result for A/B test
   */
  static async recordSessionResult(
    testId: string,
    variant: 'A' | 'B',
    sessionId: string,
    attendance: number,
    revenue: number,
    cost: number
  ): Promise<void> {
    try {
      await prisma.aBTestSession.create({
        data: {
          testId,
          variant,
          sessionId,
          attendance,
          revenue,
          cost,
          profit: revenue - cost
        }
      });
    } catch (error) {
      logger.error('Error recording session result', { testId, variant, sessionId, error });
      throw error;
    }
  }

  /**
   * Calculate A/B test results
   */
  static async calculateABTestResults(testId: string): Promise<ABTestComparison | null> {
    try {
      const abTest = await prisma.aBTest.findUnique({
        where: { id: testId }
      });

      if (!abTest) {
        return null;
      }

      // Get session results for both variants
      const variantASessions = await prisma.aBTestSession.findMany({
        where: { testId, variant: 'A' }
      });

      const variantBSessions = await prisma.aBTestSession.findMany({
        where: { testId, variant: 'B' }
      });

      // Calculate results for variant A
      const variantAResults = this.calculateVariantResults(variantASessions, 'A');

      // Calculate results for variant B
      const variantBResults = this.calculateVariantResults(variantBSessions, 'B');

      // Determine winner and confidence
      const { winner, confidence } = this.determineWinner(variantAResults, variantBResults);

      // Calculate improvements
      const improvement = {
        cancellationRate: variantAResults.cancellationRate - variantBResults.cancellationRate,
        profitMargin: variantBResults.profitMargin - variantAResults.profitMargin,
        revenue: variantBResults.averageRevenue - variantAResults.averageRevenue
      };

      // Generate recommendations
      const recommendations = this.generateABTestRecommendations(
        variantAResults,
        variantBResults,
        winner
      );

      return {
        testId,
        testName: abTest.name,
        language: abTest.language,
        variantAResults,
        variantBResults,
        winner,
        confidence,
        improvement,
        recommendations
      };
    } catch (error) {
      logger.error('Error calculating A/B test results', { testId, error });
      throw error;
    }
  }

  /**
   * Calculate results for a single variant
   */
  private static calculateVariantResults(sessions: any[], variant: 'A' | 'B'): ABTestResult {
    if (sessions.length === 0) {
      return {
        testId: '',
        variant,
        totalSessions: 0,
        sessionsAboveThreshold: 0,
        sessionsBelowThreshold: 0,
        cancellationRate: 0,
        averageAttendance: 0,
        averageRevenue: 0,
        averageCost: 0,
        profitMargin: 0,
        totalRevenue: 0,
        totalCost: 0,
        netProfit: 0
      };
    }

    const totalSessions = sessions.length;
    const totalAttendance = sessions.reduce((sum, s) => sum + s.attendance, 0);
    const totalRevenue = sessions.reduce((sum, s) => sum + s.revenue, 0);
    const totalCost = sessions.reduce((sum, s) => sum + s.cost, 0);
    const netProfit = sessions.reduce((sum, s) => sum + s.profit, 0);

    // For simplicity, assume sessions with attendance > 0 are above threshold
    const sessionsAboveThreshold = sessions.filter(s => s.attendance > 0).length;
    const sessionsBelowThreshold = totalSessions - sessionsAboveThreshold;

    return {
      testId: '',
      variant,
      totalSessions,
      sessionsAboveThreshold,
      sessionsBelowThreshold,
      cancellationRate: (sessionsBelowThreshold / totalSessions) * 100,
      averageAttendance: totalAttendance / totalSessions,
      averageRevenue: totalRevenue / totalSessions,
      averageCost: totalCost / totalSessions,
      profitMargin: totalCost > 0 ? (netProfit / totalCost) * 100 : 0,
      totalRevenue,
      totalCost,
      netProfit
    };
  }

  /**
   * Determine winner and confidence level
   */
  private static determineWinner(
    variantA: ABTestResult,
    variantB: ABTestResult
  ): { winner: 'A' | 'B' | 'TIE' | 'INSUFFICIENT_DATA'; confidence: number } {
    // Check for sufficient data
    if (variantA.totalSessions < 10 || variantB.totalSessions < 10) {
      return { winner: 'INSUFFICIENT_DATA', confidence: 0 };
    }

    // Simple comparison based on profit margin
    const marginDiff = variantB.profitMargin - variantA.profitMargin;
    const confidence = Math.min(100, Math.abs(marginDiff) * 10); // Simple confidence calculation

    if (Math.abs(marginDiff) < 1) {
      return { winner: 'TIE', confidence };
    }

    return {
      winner: marginDiff > 0 ? 'B' : 'A',
      confidence
    };
  }

  /**
   * Generate recommendations based on A/B test results
   */
  private static generateABTestRecommendations(
    variantA: ABTestResult,
    variantB: ABTestResult,
    winner: 'A' | 'B' | 'TIE' | 'INSUFFICIENT_DATA'
  ): string[] {
    const recommendations: string[] = [];

    if (winner === 'INSUFFICIENT_DATA') {
      recommendations.push('Insufficient data to determine winner. Continue testing for more sessions.');
      return recommendations;
    }

    if (winner === 'TIE') {
      recommendations.push('Both variants performed similarly. Consider testing additional variants or extending the test period.');
      return recommendations;
    }

    const winningVariant = winner === 'A' ? variantA : variantB;
    const losingVariant = winner === 'A' ? variantB : variantA;

    recommendations.push(`Variant ${winner} performed better with ${winningVariant.profitMargin.toFixed(1)}% profit margin vs ${losingVariant.profitMargin.toFixed(1)}%.`);

    if (winningVariant.cancellationRate < losingVariant.cancellationRate) {
      recommendations.push(`Variant ${winner} had lower cancellation rate (${winningVariant.cancellationRate.toFixed(1)}% vs ${losingVariant.cancellationRate.toFixed(1)}%).`);
    }

    if (winningVariant.averageAttendance > losingVariant.averageAttendance) {
      recommendations.push(`Variant ${winner} achieved higher average attendance (${winningVariant.averageAttendance.toFixed(1)} vs ${losingVariant.averageAttendance.toFixed(1)}).`);
    }

    recommendations.push(`Consider implementing the winning configuration (Variant ${winner}) as the default for this language.`);

    return recommendations;
  }

  /**
   * Map Prisma model to ABTestConfig interface
   */
  private static mapPrismaToABTestConfig(prismaModel: any): ABTestConfig {
    return {
      id: prismaModel.id,
      name: prismaModel.name,
      description: prismaModel.description,
      language: prismaModel.language,
      country: prismaModel.country,
      region: prismaModel.region,
      variantA: {
        minAttendanceThreshold: prismaModel.variantAThreshold,
        profitMarginThreshold: prismaModel.variantAProfitMargin,
        instructorHourlyRate: prismaModel.variantAInstructorRate,
        platformRevenuePerStudent: prismaModel.variantAPlatformRevenue
      },
      variantB: {
        minAttendanceThreshold: prismaModel.variantBThreshold,
        profitMarginThreshold: prismaModel.variantBProfitMargin,
        instructorHourlyRate: prismaModel.variantBInstructorRate,
        platformRevenuePerStudent: prismaModel.variantBPlatformRevenue
      },
      trafficSplit: prismaModel.trafficSplit,
      startDate: prismaModel.startDate,
      endDate: prismaModel.endDate,
      status: prismaModel.status,
      createdBy: prismaModel.createdBy,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt
    };
  }
}
