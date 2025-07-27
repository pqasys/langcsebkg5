import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RevenueMetrics {
  totalRevenue: number;
  subscriptionRevenue: number;
  commissionRevenue: number;
  studentRevenue: number;
  growthRate: number;
  topRevenueSources: Array<{
    name: string;
    revenue: number;
    percentage: number;
  }>;
}

export interface RevenueBreakdown {
  byInstitution: Array<{
    institutionId: string;
    institutionName: string;
    subscriptionRevenue: number;
    commissionRevenue: number;
    totalRevenue: number;
    studentCount: number;
    courseCount: number;
  }>;
  byPlan: Array<{
    planType: string;
    subscriptionCount: number;
    subscriptionRevenue: number;
    commissionRate: number;
    totalCommission: number;
  }>;
  byTimeframe: Array<{
    period: string;
    revenue: number;
    growth: number;
  }>;
}

export interface RevenueProjection {
  projectedRevenue: number;
  growthRate: number;
  factors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export class RevenueTrackingService {
  /**
   * Get comprehensive revenue metrics for a given time period
   */
  static async getRevenueMetrics(startDate: Date, endDate: Date): Promise<RevenueMetrics> {
    try {
      // Get payments in the date range
      const payments = await prisma.payment.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: 'COMPLETED',
        },
        include: {
          enrollment: {
            include: {
              course: {
                include: {
                  institution: true,
                },
              },
            },
          },
        },
      });

      // Get subscription revenue from institution billing history
      const institutionSubscriptions = await prisma.institutionBillingHistory.findMany({
        where: {
          billingDate: {
            gte: startDate,
            lte: endDate,
          },
          status: 'PAID',
        },
        include: {
          subscription: {
            include: {
              institution: true,
              commissionTier: true,
            },
          },
        },
      });

      // Get student subscription revenue
      const studentSubscriptions = await prisma.studentBillingHistory.findMany({
        where: {
          billingDate: {
            gte: startDate,
            lte: endDate,
          },
          status: 'PAID',
        },
        include: {
          subscription: {
            include: {
              student: true,
              studentTier: true,
            },
          },
        },
      });

      // Calculate total revenue from payments
      const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

      // Calculate commission revenue from payments
      const commissionRevenue = payments.reduce((sum, payment) => sum + payment.commissionAmount, 0);

      // Calculate subscription revenue from institution subscriptions
      const subscriptionRevenue = institutionSubscriptions.reduce((sum, billing) => sum + billing.amount, 0);

      // Calculate student revenue (payments minus commission)
      const studentRevenue = totalRevenue - commissionRevenue;

      // Calculate growth rate by comparing with previous period
      const previousStartDate = new Date(startDate);
      const previousEndDate = new Date(endDate);
      const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      previousStartDate.setDate(previousStartDate.getDate() - periodDays);
      previousEndDate.setDate(previousEndDate.getDate() - periodDays);

      const previousPayments = await prisma.payment.findMany({
        where: {
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate,
          },
          status: 'COMPLETED',
        },
      });

      const previousRevenue = previousPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const growthRate = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      // Calculate top revenue sources by institution
      const revenueByInstitution = new Map<string, number>();
      payments.forEach(payment => {
        const institutionName = payment.enrollment.course.institution.name;
        const current = revenueByInstitution.get(institutionName) || 0;
        revenueByInstitution.set(institutionName, current + payment.amount);
      });

      const topRevenueSources = Array.from(revenueByInstitution.entries())
        .map(([name, revenue]) => ({
          name,
          revenue,
          percentage: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      return {
        totalRevenue,
        subscriptionRevenue,
        commissionRevenue,
        studentRevenue,
        growthRate,
        topRevenueSources,
      };
    } catch (error) {
      console.error('Error calculating revenue metrics:', error);
      throw new Error(`Failed to calculate revenue metrics - Context: throw new Error('Failed to calculate revenue metri...);
    }
  }

  /**
   * Get detailed revenue breakdown by institution, plan, and timeframe
   */
  static async getRevenueBreakdown(startDate: Date, endDate: Date): Promise<RevenueBreakdown> {
    try {
      // Get payments with enrollment and course data
      const payments = await prisma.payment.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: 'COMPLETED',
        },
        include: {
          enrollment: {
            include: {
              course: {
                include: {
                  institution: true,
                },
              },
            },
          },
        },
      });

      // Get institution subscriptions
      const institutionSubscriptions = await prisma.institutionBillingHistory.findMany({
        where: {
          billingDate: {
            gte: startDate,
            lte: endDate,
          },
          status: 'PAID',
        },
        include: {
          subscription: {
            include: {
              institution: true,
              commissionTier: true,
            },
          },
        },
      });

      // Calculate breakdown by institution
      const institutionMap = new Map<string, {
        institutionId: string;
        institutionName: string;
        subscriptionRevenue: number;
        commissionRevenue: number;
        totalRevenue: number;
        studentCount: number;
        courseCount: number;
      }>();

      // Process payments for commission revenue
      payments.forEach(payment => {
        const institutionId = payment.enrollment.course.institutionId;
        const institutionName = payment.enrollment.course.institution.name;
        
        if (!institutionMap.has(institutionId)) {
          institutionMap.set(institutionId, {
            institutionId,
            institutionName,
            subscriptionRevenue: 0,
            commissionRevenue: 0,
            totalRevenue: 0,
            studentCount: 0,
            courseCount: 0,
          });
        }

        const institution = institutionMap.get(institutionId)!;
        institution.commissionRevenue += payment.commissionAmount;
        institution.totalRevenue += payment.amount;
      });

      // Process institution subscriptions for subscription revenue
      institutionSubscriptions.forEach(billing => {
        const institutionId = billing.subscription.institutionId;
        const institutionName = billing.subscription.institution.name;
        
        if (!institutionMap.has(institutionId)) {
          institutionMap.set(institutionId, {
            institutionId,
            institutionName,
            subscriptionRevenue: 0,
            commissionRevenue: 0,
            totalRevenue: 0,
            studentCount: 0,
            courseCount: 0,
          });
        }

        const institution = institutionMap.get(institutionId)!;
        institution.subscriptionRevenue += billing.amount;
        institution.totalRevenue += billing.amount;
      });

      // Get student and course counts for each institution
      for (const [institutionId, institution] of institutionMap) {
        const studentCount = await prisma.studentCourseEnrollment.count({
          where: {
            course: {
              institutionId,
            },
            status: 'ACTIVE',
          },
        });

        const courseCount = await prisma.course.count({
          where: {
            institutionId,
            status: 'ACTIVE',
          },
        });

        institution.studentCount = studentCount;
        institution.courseCount = courseCount;
      }

      const byInstitution = Array.from(institutionMap.values())
        .sort((a, b) => b.totalRevenue - a.totalRevenue);

      // Calculate breakdown by plan
      const planMap = new Map<string, {
        planType: string;
        subscriptionCount: number;
        subscriptionRevenue: number;
        commissionRate: number;
        totalCommission: number;
      }>();

      institutionSubscriptions.forEach(billing => {
        const planType = billing.subscription.commissionTier.planType;
        
        if (!planMap.has(planType)) {
          planMap.set(planType, {
            planType,
            subscriptionCount: 0,
            subscriptionRevenue: 0,
            commissionRate: billing.subscription.commissionTier.commissionRate,
            totalCommission: 0,
          });
        }

        const plan = planMap.get(planType)!;
        plan.subscriptionCount += 1;
        plan.subscriptionRevenue += billing.amount;
        plan.totalCommission += billing.amount * (billing.subscription.commissionTier.commissionRate / 100);
      });

      const byPlan = Array.from(planMap.values())
        .sort((a, b) => b.subscriptionRevenue - a.subscriptionRevenue);

      // Calculate breakdown by timeframe (monthly for the last 12 months)
      const byTimeframe: Array<{ period: string; revenue: number; growth: number }> = [];
      
      for (let i = 11; i >= 0; i--) {
        const periodStart = new Date();
        periodStart.setMonth(periodStart.getMonth() - i);
        periodStart.setDate(1);
        periodStart.setHours(0, 0, 0, 0);

        const periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        periodEnd.setDate(0);
        periodEnd.setHours(23, 59, 59, 999);

        const periodPayments = await prisma.payment.findMany({
          where: {
            createdAt: {
              gte: periodStart,
              lte: periodEnd,
            },
            status: 'COMPLETED',
          },
        });

        const periodRevenue = periodPayments.reduce((sum, payment) => sum + payment.amount, 0);
        
        // Calculate growth compared to previous month
        let growth = 0;
        if (i < 11) {
          const previousPeriodStart = new Date(periodStart);
          previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
          
          const previousPeriodEnd = new Date(periodEnd);
          previousPeriodEnd.setMonth(previousPeriodEnd.getMonth() - 1);

          const previousPeriodPayments = await prisma.payment.findMany({
            where: {
              createdAt: {
                gte: previousPeriodStart,
                lte: previousPeriodEnd,
              },
              status: 'COMPLETED',
            },
          });

          const previousPeriodRevenue = previousPeriodPayments.reduce((sum, payment) => sum + payment.amount, 0);
          growth = previousPeriodRevenue > 0 ? ((periodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 : 0;
        }

        byTimeframe.push({
          period: periodStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: periodRevenue,
          growth,
        });
      }

      return {
        byInstitution,
        byPlan,
        byTimeframe,
      };
    } catch (error) {
      console.error('Error calculating revenue breakdown:', error);
      throw new Error(Failed to calculate revenue breakdown - Context: console.error('Error calculating revenue breakdown...`);
    }
  }

  /**
   * Get revenue projections based on current trends
   */
  static async getRevenueProjection(): Promise<RevenueProjection> {
    try {
      // Get revenue data for the last 6 months to calculate trends
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      const payments = await prisma.payment.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: 'COMPLETED',
        },
      });

      // Calculate monthly averages
      const monthlyRevenues: number[] = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() - i);
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(0);
        monthEnd.setHours(23, 59, 59, 999);

        const monthPayments = payments.filter(payment => 
          payment.createdAt >= monthStart && payment.createdAt <= monthEnd
        );

        const monthRevenue = monthPayments.reduce((sum, payment) => sum + payment.amount, 0);
        monthlyRevenues.push(monthRevenue);
      }

      // Calculate growth rate
      const recentMonths = monthlyRevenues.slice(-3);
      const olderMonths = monthlyRevenues.slice(0, 3);
      
      const recentAverage = recentMonths.reduce((sum, revenue) => sum + revenue, 0) / recentMonths.length;
      const olderAverage = olderMonths.reduce((sum, revenue) => sum + revenue, 0) / olderMonths.length;
      
      const growthRate = olderAverage > 0 ? ((recentAverage - olderAverage) / olderAverage) * 100 : 0;

      // Project next month's revenue
      const projectedRevenue = recentAverage * (1 + (growthRate / 100));

      // Identify growth factors
      const factors = [];

      // Check for new institutions
      const newInstitutions = await prisma.institution.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      });

      if (newInstitutions > 0) {
        factors.push({
          factor: 'New Institutions',
          impact: newInstitutions * 1000, // Estimated $1000 per new institution
          description: `${newInstitutions} new institutions joined`,
        });
      }

      // Check for subscription upgrades
      const recentUpgrades = await prisma.institutionSubscriptionLog.count({
        where: {
          action: 'UPGRADE',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      });

      if (recentUpgrades > 0) {
        factors.push({
          factor: 'Subscription Upgrades',
          impact: recentUpgrades * 500, // Estimated $500 per upgrade
          description: `${recentUpgrades} institutions upgraded their plans`,
        });
      }

      // Check for student growth
      const newStudents = await prisma.studentCourseEnrollment.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      });

      if (newStudents > 0) {
        factors.push({
          factor: 'New Students',
          impact: newStudents * 50, // Estimated $50 per new student
          description: `${newStudents} new student enrollments`,
        });
      }

      return {
        projectedRevenue,
        growthRate,
        factors,
      };
    } catch (error) {
      console.error('Error calculating revenue projection:', error);
      throw new Error(`Failed to calculate revenue projection - Context: growthRate,...);
    }
  }

  /**
   * Generate comprehensive revenue report
   */
  static async generateRevenueReport(
    startDate: Date, 
    endDate: Date, 
    format: 'json' | 'csv' = 'json'
  ): Promise<any> {
    try {
      const [metrics, breakdown, projection] = await Promise.all([
        this.getRevenueMetrics(startDate, endDate),
        this.getRevenueBreakdown(startDate, endDate),
        this.getRevenueProjection(),
      ]);

      const report = {
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        summary: {
          totalRevenue: metrics.totalRevenue,
          subscriptionRevenue: metrics.subscriptionRevenue,
          commissionRevenue: metrics.commissionRevenue,
          studentRevenue: metrics.studentRevenue,
          growthRate: metrics.growthRate,
        },
        breakdown,
        projection,
        generatedAt: new Date().toISOString(),
      };

      if (format === 'csv') {
        return this.convertToCSV(report);
      }

      return report;
    } catch (error) {
      console.error('Error generating revenue report:', error);
      throw new Error(Failed to generate revenue report - Context: return this.convertToCSV(report);...`);
    }
  }

  /**
   * Convert report to CSV format
   */
  private static convertToCSV(report: unknown): string {
    const csvRows = [];

    // Summary section
    csvRows.push('Revenue Summary');
    csvRows.push('Metric,Value');
    csvRows.push(`Total Revenue,${report.summary.totalRevenue}`);
    csvRows.push(`Subscription Revenue,${report.summary.subscriptionRevenue}`);
    csvRows.push(`Commission Revenue,${report.summary.commissionRevenue}`);
    csvRows.push(`Student Revenue,${report.summary.studentRevenue}`);
    csvRows.push(`Growth Rate,${report.summary.growthRate}%`);
    csvRows.push('');

    // Institution breakdown
    csvRows.push('Revenue by Institution');
    csvRows.push('Institution,Subscription Revenue,Commission Revenue,Total Revenue,Students,Courses');
    report.breakdown.byInstitution.forEach((inst: unknown) => {
      csvRows.push(`${inst.institutionName},${inst.subscriptionRevenue},${inst.commissionRevenue},${inst.totalRevenue},${inst.studentCount},${inst.courseCount}`);
    });
    csvRows.push('');

    // Plan breakdown
    csvRows.push('Revenue by Plan');
    csvRows.push('Plan Type,Subscriptions,Revenue,Commission Rate,Total Commission');
    report.breakdown.byPlan.forEach((plan: unknown) => {
      csvRows.push(`${plan.planType},${plan.subscriptionCount},${plan.subscriptionRevenue},${plan.commissionRate}%,${plan.totalCommission}`);
    });
    csvRows.push('');

    // Timeframe breakdown
    csvRows.push('Revenue by Timeframe');
    csvRows.push('Period,Revenue,Growth');
    report.breakdown.byTimeframe.forEach((timeframe: unknown) => {
      csvRows.push(`${timeframe.period},${timeframe.revenue},${timeframe.growth}%`);
    });

    return csvRows.join('\n');
  }
}
