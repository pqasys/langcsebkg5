#!/usr/bin/env tsx

import { AutomatedCommissionService } from '../lib/automated-commission-service';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

/**
 * Automated Commission Calculation Cron Job
 * 
 * This script should be run periodically (e.g., every hour) to:
 * 1. Calculate commissions for new payments
 * 2. Process pending commissions
 * 3. Generate commission reports
 * 4. Send notifications for significant events
 */

async function runAutomatedCommissionCalculation() {
  const startTime = new Date();
  logger.info('Starting automated commission calculation job', { startTime });

  try {
    // Step 1: Calculate commissions for all pending payments
    logger.info('Calculating commissions for pending payments...');
    const calculations = await AutomatedCommissionService.calculatePendingCommissions();
    
    logger.info(`Completed ${calculations.length} commission calculations`, {
      totalCommission: calculations.reduce((sum, calc) => sum + calc.commissionAmount, 0),
      calculationsCount: calculations.length
    });

    // Step 2: Get commission analytics for reporting
    logger.info('Generating commission analytics...');
    const analytics = await AutomatedCommissionService.getCommissionAnalytics();
    
    logger.info('Commission analytics generated', {
      monthlyTotal: analytics.monthly.total,
      yearlyTotal: analytics.yearly.total,
      allTimeTotal: analytics.allTime.total,
      topInstitutionsCount: analytics.topInstitutions.length
    });

    // Step 3: Check for institutions with high pending commissions
    const highValueInstitutions = analytics.topInstitutions.filter(inst => inst.commissionAmount > 1000);
    
    if (highValueInstitutions.length > 0) {
      logger.info('High-value institutions detected', {
        institutions: highValueInstitutions.map(inst => ({
          name: inst.name,
          commissionAmount: inst.commissionAmount
        }))
      });
    }

    // Step 4: Process any overdue payouts (optional - can be done manually)
    // This could be automated based on business rules
    
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    
    logger.info('Automated commission calculation job completed successfully', {
      endTime,
      duration: `${duration}ms`,
      calculationsProcessed: calculations.length,
      totalCommissionCalculated: calculations.reduce((sum, calc) => sum + calc.commissionAmount, 0)
    });

  } catch (error) {
    logger.error('Error in automated commission calculation job', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // In production, you might want to send alerts here
    throw error;
  }
}

/**
 * Generate daily commission report
 */
async function generateDailyCommissionReport() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  try {
    logger.info('Generating daily commission report...');
    
    // Get all institutions with their daily commission data
    const institutions = await prisma.institution.findMany({
      include: {
        subscription: true,
        institutionCommission: {
          where: {
            createdAt: {
              gte: startOfDay,
              lt: endOfDay
            }
          }
        }
      }
    });

    const report = {
      date: today.toISOString().split('T')[0],
      totalInstitutions: institutions.length,
      activeSubscriptions: institutions.filter(inst => inst.subscription?.status === 'ACTIVE').length,
      totalCommissions: institutions.reduce((sum, inst) => 
        sum + inst.institutionCommission.reduce((commSum, comm) => commSum + comm.amount, 0), 0
      ),
      institutions: institutions.map(inst => ({
        name: inst.name,
        planType: inst.subscription?.planType || 'NONE',
        commissionRate: inst.commissionRate,
        dailyCommissions: inst.institutionCommission.reduce((sum, comm) => sum + comm.amount, 0)
      }))
    };

    logger.info('Daily commission report generated', {
      date: report.date,
      totalCommissions: report.totalCommissions,
      activeSubscriptions: report.activeSubscriptions
    });

    return report;
  } catch (error) {
    logger.error('Error generating daily commission report', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

/**
 * Check for subscription renewals and expirations
 */
async function checkSubscriptionStatus() {
  try {
    logger.info('Checking subscription status...');
    
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // Find subscriptions expiring soon
    const expiringSubscriptions = await prisma.institutionSubscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          gte: today,
          lte: thirtyDaysFromNow
        }
      },
      include: {
        institution: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (expiringSubscriptions.length > 0) {
      logger.info('Found subscriptions expiring soon', {
        count: expiringSubscriptions.length,
        subscriptions: expiringSubscriptions.map(sub => ({
          institution: sub.institution.name,
          planType: sub.planType,
          endDate: sub.endDate
        }))
      });
    }

    // Find expired subscriptions
    const expiredSubscriptions = await prisma.institutionSubscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lt: today
        }
      },
      include: {
        institution: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (expiredSubscriptions.length > 0) {
      logger.info('Found expired subscriptions', {
        count: expiredSubscriptions.length,
        subscriptions: expiredSubscriptions.map(sub => ({
          institution: sub.institution.name,
          planType: sub.planType,
          endDate: sub.endDate
        }))
      });

      // Update expired subscriptions
      for (const subscription of expiredSubscriptions) {
        await prisma.institutionSubscription.update({
          where: { id: subscription.id },
          data: { status: 'EXPIRED' }
        });
      }
    }

  } catch (error) {
    logger.error('Error checking subscription status', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

/**
 * Main function to run all automated tasks
 */
async function main() {
  const args = process.argv.slice(2);
  const task = args[0] || 'all';

  try {
    switch (task) {
      case 'commissions':
        await runAutomatedCommissionCalculation();
        break;
      
      case 'report':
        await generateDailyCommissionReport();
        break;
      
      case 'subscriptions':
        await checkSubscriptionStatus();
        break;
      
      case 'all':
        await runAutomatedCommissionCalculation();
        await generateDailyCommissionReport();
        await checkSubscriptionStatus();
        break;
      
      default:
        logger.error('Invalid task. Use: commissions, report, subscriptions, or all');
        process.exit(1);
    }

    logger.info('All tasks completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error in main execution', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

export {
  runAutomatedCommissionCalculation,
  generateDailyCommissionReport,
  checkSubscriptionStatus
}; 