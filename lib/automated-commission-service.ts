import { prisma } from '@/lib/prisma';
import { SubscriptionCommissionService } from './subscription-commission-service';
import { logger } from './logger';

export interface CommissionCalculation {
  paymentId: string;
  enrollmentId: string;
  institutionId: string;
  studentId: string;
  courseId: string;
  paymentAmount: number;
  commissionRate: number;
  commissionAmount: number;
  institutionShare: number;
  currency: string;
  calculatedAt: Date;
}

export interface CommissionSummary {
  institutionId: string;
  institutionName: string;
  totalRevenue: number;
  totalCommission: number;
  totalInstitutionShare: number;
  commissionRate: number;
  period: {
    start: Date;
    end: Date;
  };
  paymentCount: number;
}

export class AutomatedCommissionService {
  /**
   * Calculate commission for a payment based on institution's subscription tier
   */
  static async calculateCommissionForPayment(paymentId: string): Promise<CommissionCalculation> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        enrollment: {
          include: {
            course: {
              include: {
                institution: {
                  include: {
                    subscription: true
                  }
                }
              }
            },
            student: true
          }
        }
      }
    });

    if (!payment) {
      throw new Error(`Payment not found - Context: throw new Error('Payment not found');...`);
    }

    if (payment.status !== 'COMPLETED') {
      throw new Error(`Payment is not completed - Context: }...`);
    }

    const institution = payment.enrollment.course.institution;
    const subscription = institution.subscription;

    if (!subscription || subscription.status !== 'ACTIVE') {
      throw new Error(`Institution does not have an active subscription - Context: ...`);
    }

    // Get commission rate from subscription tier
    const commissionTier = await prisma.commissionTier.findUnique({
      where: { planType: subscription.planType }
    });

    if (!commissionTier) {
      throw new Error(`Commission tier not found for plan: ${subscription.planType} - Context: where: { planType: subscription.planType }...`);
    }

    const commissionRate = commissionTier.commissionRate;
    const commissionAmount = (payment.amount * commissionRate) / 100;
    const institutionShare = payment.amount - commissionAmount;

    const calculation: CommissionCalculation = {
      paymentId: payment.id,
      enrollmentId: payment.enrollmentId,
      institutionId: institution.id,
      studentId: payment.enrollment.studentId,
      courseId: payment.enrollment.courseId,
      paymentAmount: payment.amount,
      commissionRate,
      commissionAmount,
      institutionShare,
      currency: payment.currency || 'USD',
      calculatedAt: new Date()
    };

    // Update or create commission record
    await this.updateCommissionRecord(calculation);

    return calculation;
  }

  /**
   * Update commission record in the database
   */
  private static async updateCommissionRecord(calculation: CommissionCalculation) {
    const existingCommission = await prisma.institutionCommission.findFirst({
      where: {
        institutionId: calculation.institutionId,
        paymentId: calculation.paymentId
      }
    });

    if (existingCommission) {
      // Update existing commission record
      await prisma.institutionCommission.update({
        where: { id: existingCommission.id },
        data: {
          amount: calculation.commissionAmount,
          commissionRate: calculation.commissionRate,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new commission record
      await prisma.institutionCommission.create({
        data: {
          institutionId: calculation.institutionId,
          paymentId: calculation.paymentId,
          amount: calculation.commissionAmount,
          commissionRate: calculation.commissionRate,
          status: 'PENDING',
          currency: calculation.currency
        }
      });
    }
  }

  /**
   * Calculate commissions for all pending payments
   */
  static async calculatePendingCommissions(): Promise<CommissionCalculation[]> {
    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        institutionCommission: null
      },
      include: {
        enrollment: {
          include: {
            course: {
              include: {
                institution: {
                  include: {
                    subscription: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const calculations: CommissionCalculation[] = [];

    for (const payment of pendingPayments) {
      try {
        const calculation = await this.calculateCommissionForPayment(payment.id);
        calculations.push(calculation);
      } catch (error) {
        logger.error('Failed to calculate commission for payment ${payment.id}:');
      }
    }

    return calculations;
  }

  /**
   * Get commission summary for an institution in a date range
   */
  static async getCommissionSummary(
    institutionId: string,
    startDate: Date,
    endDate: Date
  ): Promise<CommissionSummary> {
    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
      include: { subscription: true }
    });

    if (!institution) {
      throw new Error(`Institution not found - Context: const institution = await prisma.institution.findU...`);
    }

    const payments = await prisma.payment.findMany({
      where: {
        enrollment: {
          course: {
            institutionId
          }
        },
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        institutionCommission: true
      }
    });

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalCommission = payments.reduce((sum, payment) => {
      return sum + (payment.institutionCommission?.amount || 0);
    }, 0);

    const commissionRate = institution.subscription?.planType === 'STARTER' ? 25 :
                          institution.subscription?.planType === 'PROFESSIONAL' ? 15 :
                          institution.subscription?.planType === 'ENTERPRISE' ? 10 : 0;

    return {
      institutionId,
      institutionName: institution.name,
      totalRevenue,
      totalCommission,
      totalInstitutionShare: totalRevenue - totalCommission,
      commissionRate,
      period: { start: startDate, end: endDate },
      paymentCount: payments.length
    };
  }

  /**
   * Process commission payout for an institution
   */
  static async processCommissionPayout(
    institutionId: string,
    amount: number,
    payoutMethod: string,
    reference: string
  ) {
    const pendingCommissions = await prisma.institutionCommission.findMany({
      where: {
        institutionId,
        status: 'PENDING'
      }
    });

    if (pendingCommissions.length === 0) {
      throw new Error('No pending commissions found');
    }

    const totalPendingAmount = pendingCommissions.reduce((sum, commission) => sum + commission.amount, 0);

    if (amount > totalPendingAmount) {
      throw new Error('Payout amount exceeds pending commission amount');
    }

    // Create payout record
    const payout = await prisma.institutionPayout.create({
      data: {
        institutionId,
        amount,
        status: 'PROCESSING',
        payoutMethod,
        reference,
        currency: 'USD'
      }
    });

    // Mark commissions as paid
    await prisma.institutionCommission.updateMany({
      where: {
        institutionId,
        status: 'PENDING'
      },
      data: {
        status: 'PAID',
        payoutId: payout.id
      }
    });

    return payout;
  }

  /**
   * Get commission analytics for admin dashboard
   */
  static async getCommissionAnalytics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [monthlyCommissions, yearlyCommissions, totalCommissions] = await Promise.all([
      prisma.institutionCommission.aggregate({
        where: {
          createdAt: { gte: startOfMonth }
        },
        _sum: { amount: true },
        _count: true
      }),
      prisma.institutionCommission.aggregate({
        where: {
          createdAt: { gte: startOfYear }
        },
        _sum: { amount: true },
        _count: true
      }),
      prisma.institutionCommission.aggregate({
        _sum: { amount: true },
        _count: true
      })
    ]);

    const topInstitutions = await prisma.institution.findMany({
      include: {
        _count: {
          select: {
            courses: true
          }
        },
        institutionCommission: {
          where: {
            createdAt: { gte: startOfMonth }
          }
        }
      },
      orderBy: {
        institutionCommission: {
          _count: 'desc'
        }
      },
      take: 5
    });

    return {
      monthly: {
        total: monthlyCommissions._sum.amount || 0,
        count: monthlyCommissions._count
      },
      yearly: {
        total: yearlyCommissions._sum.amount || 0,
        count: yearlyCommissions._count
      },
      allTime: {
        total: totalCommissions._sum.amount || 0,
        count: totalCommissions._count
      },
      topInstitutions: topInstitutions.map(inst => ({
        id: inst.id,
        name: inst.name,
        commissionAmount: inst.institutionCommission.reduce((sum, comm) => sum + comm.amount, 0),
        courseCount: inst._count.courses
      }))
    };
  }

  /**
   * Recalculate commissions for a specific date range (for corrections)
   */
  static async recalculateCommissions(
    startDate: Date,
    endDate: Date,
    institutionId?: string
  ) {
    const whereClause: unknown = {
      status: 'COMPLETED',
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    };

    if (institutionId) {
      whereClause.enrollment = {
        course: {
          institutionId
        }
      };
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        enrollment: {
          include: {
            course: {
              include: {
                institution: {
                  include: {
                    subscription: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const recalculations: CommissionCalculation[] = [];

    for (const payment of payments) {
      try {
        const calculation = await this.calculateCommissionForPayment(payment.id);
        recalculations.push(calculation);
      } catch (error) {
        logger.error('Failed to recalculate commission for payment ${payment.id}:');
      }
    }

    return recalculations;
  }
} 