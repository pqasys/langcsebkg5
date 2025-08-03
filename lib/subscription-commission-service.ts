import { prisma } from '@/lib/prisma';
import { getAllStudentTiers, getAllInstitutionTiers } from '@/lib/subscription-pricing';

export interface CommissionTier {
  planType: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  commissionRate: number;
  features: Record<string, any>;
}

export interface SubscriptionPlan {
  planType: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  monthlyPrice: number;
  annualPrice: number;
  features: Record<string, any>;
}

export interface StudentSubscriptionPlan {
  planType: 'BASIC' | 'PREMIUM' | 'PRO';
  monthlyPrice: number;
  annualPrice: number;
  features: Record<string, any>;
}

export interface InstitutionSubscriptionStatus {
  hasActiveSubscription: boolean;
  currentPlan?: string;
  commissionRate: number;
  features: Record<string, any>;
  subscriptionEndDate?: Date;
  canUpgrade: boolean;
  canDowngrade: boolean;
  canCancel: boolean;
  nextBillingDate?: Date;
  billingHistory: BillingHistoryItem[];
  isFallback: boolean;
}

export interface StudentSubscriptionStatus {
  hasActiveSubscription: boolean;
  currentPlan?: string;
  features: Record<string, any>;
  subscriptionEndDate?: Date;
  canUpgrade: boolean;
  canDowngrade: boolean;
  canCancel: boolean;
  nextBillingDate?: Date;
  billingHistory: BillingHistoryItem[];
  isFallback: boolean;
}

export interface BillingHistoryItem {
  id: string;
  billingDate: Date;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  invoiceNumber?: string;
  description?: string;
}

export interface SubscriptionLogItem {
  id: string;
  action: string;
  oldPlan?: string;
  newPlan?: string;
  oldAmount?: number;
  newAmount?: number;
  oldBillingCycle?: string;
  newBillingCycle?: string;
  reason?: string;
  createdAt: Date;
}

export class SubscriptionCommissionService {
  /**
   * Get commission rate for an institution based on their subscription
   */
  static async getCommissionRate(institutionId: string): Promise<number> {
    try {
      // Get institution with subscription
      const institution = await prisma.institution.findUnique({
        where: { id: institutionId },
        include: {
          subscription: {
            include: {
              commissionTier: true
            }
          }
        }
      });

      if (!institution) {
        throw new Error('Institution not found');
      }

      // If institution has an active subscription, use subscription-based commission
      if (institution.subscription && institution.subscription.status === 'ACTIVE' && institution.subscription.commissionTier) {
        return institution.subscription.commissionTier.commissionRate;
      }

      // Fallback to institution's default commission rate
      return institution.commissionRate || 20; // Default fallback rate
    } catch (error) {
      console.error('Error getting commission rate:', error);
      throw error;
    }
  }

  /**
   * Get subscription status for an institution
   */
  static async getSubscriptionStatus(institutionId: string): Promise<InstitutionSubscriptionStatus> {
    try {
      const institution = await prisma.institution.findUnique({
        where: { id: institutionId },
        include: {
          subscription: {
            include: {
              commissionTier: true,
              billingHistory: {
                orderBy: { billingDate: 'desc' },
                take: 10
              }
            }
          }
        }
      });

      if (!institution) {
        throw new Error('Institution not found: ' + institutionId);
      }

      const hasActiveSubscription = institution.subscription && 
        ['ACTIVE', 'TRIAL', 'PAST_DUE'].includes(institution.subscription.status);

      const currentPlan = institution.subscription?.commissionTier?.planType;
      const subscriptionEndDate = institution.subscription?.endDate;
      const nextBillingDate = institution.subscription?.endDate;

      // Determine commission rate with proper null checks
      let commissionRate = 20; // Default fallback rate
      
      // First try to get from institution's commission rate
      if (institution.commissionRate !== null && institution.commissionRate !== undefined) {
        commissionRate = institution.commissionRate;
      }
      
      // If institution has an active subscription, try to get from subscription's commission tier
      if (institution.subscription && institution.subscription.status === 'ACTIVE' && institution.subscription.commissionTier) {
        commissionRate = institution.subscription.commissionTier.commissionRate;
      }

      // Check if subscription is a fallback plan
      const isFallback = institution.subscription?.metadata?.isFallback || false;

      // Determine upgrade/downgrade options
      const canUpgrade = !isFallback && hasActiveSubscription && 
        institution.subscription?.commissionTier?.planType !== 'ENTERPRISE';
      const canDowngrade = !isFallback && hasActiveSubscription && 
        institution.subscription?.commissionTier?.planType !== 'STARTER';
      const canCancel = hasActiveSubscription && !isFallback;

      const billingHistory: BillingHistoryItem[] = institution.subscription?.billingHistory?.map(bill => ({
        id: bill.id,
        billingDate: bill.billingDate,
        amount: bill.amount,
        currency: bill.currency,
        status: bill.status,
        paymentMethod: bill.paymentMethod,
        transactionId: bill.transactionId,
        invoiceNumber: bill.invoiceNumber,
        description: bill.description
      })) || [];

      return {
        hasActiveSubscription,
        currentPlan,
        commissionRate,
        features: institution.subscription?.commissionTier?.features as Record<string, any> || {},
        subscriptionEndDate,
        canUpgrade,
        canDowngrade,
        canCancel,
        nextBillingDate,
        billingHistory,
        isFallback
      };
    } catch (error) {
      console.error('Error getting institution subscription status:', error);
      throw error;
    }
  }

  /**
 * Get subscription status for a user (student or non-student)
 * 
 * IMPORTANT: This method handles subscriptions for ALL user types:
 * - Students: Regular course-taking users
 * - Admins: Platform administrators with premium access  
 * - Institution Staff: Staff members with personal subscriptions
 * - Regular Users: Any user who wants premium features
 * 
 * The 'studentId' field in StudentSubscription actually stores any user ID,
 * not just student IDs. This naming is historical and should be considered
 * for future refactoring to UserSubscription.
 */
static async getUserSubscriptionStatus(userId: string): Promise<StudentSubscriptionStatus> {
  try {
    // Validate that the user exists before checking subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Check for subscription using the user ID (which could be a student ID or regular user ID)
    // This handles both students and non-student users with subscriptions
    const currentSubscription = await prisma.studentSubscription.findUnique({
      where: { studentId: userId },
      include: {
        billingHistory: {
          orderBy: { billingDate: 'desc' },
          take: 10
        }
      }
    });

      const hasActiveSubscription = currentSubscription && 
        ['ACTIVE', 'TRIAL', 'PAST_DUE'].includes(currentSubscription.status);

      // Get plan details from subscription
      const currentPlan = currentSubscription?.planType;
      const subscriptionEndDate = currentSubscription?.endDate;
      const nextBillingDate = currentSubscription?.endDate;

      // Check if subscription is a fallback plan
      const isFallback = currentSubscription?.metadata?.isFallback || false;

      // Determine upgrade/downgrade options
      const canUpgrade = !isFallback && hasActiveSubscription && 
        currentSubscription?.planType !== 'PRO';
      const canDowngrade = !isFallback && hasActiveSubscription && 
        currentSubscription?.planType !== 'BASIC';
      const canCancel = hasActiveSubscription && !isFallback;

      const billingHistory: BillingHistoryItem[] = currentSubscription?.billingHistory?.map(bill => ({
        id: bill.id,
        billingDate: bill.billingDate,
        amount: bill.amount,
        currency: bill.currency,
        status: bill.status,
        paymentMethod: bill.paymentMethod,
        transactionId: bill.transactionId,
        invoiceNumber: bill.invoiceNumber,
        description: bill.description
      })) || [];

      return {
        hasActiveSubscription,
        currentPlan,
        features: currentSubscription?.features as Record<string, any> || {},
        subscriptionEndDate,
        canUpgrade,
        canDowngrade,
        canCancel,
        nextBillingDate,
        billingHistory,
        isFallback
      };
    } catch (error) {
      console.error('Error getting student subscription status:', error);
      throw error;
    }
  }

  /**
   * Create or update user subscription (currently named for historical reasons)
   * 
   * IMPORTANT: This method creates subscriptions for ALL user types, not just students:
   * - Students: Regular course-taking users
   * - Admins: Platform administrators with premium access
   * - Institution Staff: Staff members with personal subscriptions  
   * - Regular Users: Any user who wants premium features
   * 
   * The 'studentId' parameter actually accepts any user ID, not just student IDs.
   * This naming is historical and should be considered for future refactoring.
   * 
   * @param studentId - The user ID (can be any user type, not just students)
   * @param planType - The subscription plan type
   * @param billingCycle - Monthly or annual billing
   * @param userId - The ID of the user performing the action (for logging)
   * @param startTrial - Whether to start a trial subscription
   * @param amount - Optional custom amount (overrides tier pricing)
   */
  static async createStudentSubscription(
    studentId: string,
    planType: 'BASIC' | 'PREMIUM' | 'PRO',
    billingCycle: 'MONTHLY' | 'ANNUAL' = 'MONTHLY',
    userId: string,
    startTrial: boolean = false,
    amount?: number
  ): Promise<any> {
    try {
      // Validate that the user exists before creating subscription
      const user = await prisma.user.findUnique({
        where: { id: studentId },
        select: { id: true, role: true, name: true }
      });

      if (!user) {
        throw new Error(`User not found: ${studentId}. Cannot create subscription for non-existent user.`);
      }

      // Validate that the acting user exists
      const actingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true }
      });

      if (!actingUser) {
        throw new Error(`Acting user not found: ${userId}. Cannot create subscription with invalid acting user.`);
      }

      // Find the appropriate StudentTier
      const studentTier = await prisma.studentTier.findFirst({
        where: { 
          planType,
          billingCycle,
          isActive: true
        }
      });

      if (!studentTier) {
        throw new Error('Student tier not found for plan: ' + planType);
      }

      const calculatedAmount = amount || studentTier.price;
      const startDate = new Date();
      const endDate = new Date();
      
      // Set trial period or regular billing period
      if (startTrial) {
        endDate.setDate(endDate.getDate() + 7); // 7-day trial for students
      } else {
        endDate.setMonth(endDate.getMonth() + (billingCycle === 'ANNUAL' ? 12 : 1));
      }

      // Get existing subscription for logging
      const existingSubscription = await prisma.studentSubscription.findUnique({
        where: { studentId }
      });

      // Create or update subscription
      const subscription = await prisma.studentSubscription.upsert({
        where: { studentId },
        update: {
          studentTierId: studentTier.id, // ✅ Use studentTierId
          status: startTrial ? 'TRIAL' : 'ACTIVE',
          endDate,
          autoRenew: true,
          metadata: startTrial ? { isTrial: true, trialEndDate: endDate.toISOString() } : {},
          updatedAt: new Date()
        },
        create: {
          studentId,
          studentTierId: studentTier.id, // ✅ Use studentTierId
          status: startTrial ? 'TRIAL' : 'ACTIVE',
          startDate,
          endDate,
          autoRenew: true,
          metadata: startTrial ? { isTrial: true, trialEndDate: endDate.toISOString() } : {}
        }
      });

      // Log the action
      await this.logStudentSubscriptionAction(
        subscription.id,
        existingSubscription ? 'UPGRADE' : 'CREATE',
        existingSubscription?.planType,
        planType,
        existingSubscription?.amount,
        calculatedAmount,
        existingSubscription?.billingCycle,
        billingCycle,
        userId,
        existingSubscription ? 'Plan upgrade' : (startTrial ? 'Trial subscription created' : 'New subscription created')
      );

      // Create billing history entry
      await this.createStudentBillingHistory(
        subscription.id,
        startDate,
        calculatedAmount,
        studentTier.currency,
        startTrial ? 'TRIAL' : 'PAID',
        'MANUAL',
        undefined,
        startTrial ? `Trial subscription for ${planType} plan` : `Initial payment for ${planType} plan`
      );

      return subscription;
    } catch (error) {
      console.error('Error creating student subscription:', error);
      throw error;
    }
  }

  /**
   * Create or update institution subscription
   */
  static async createSubscription(
    institutionId: string,
    planType: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE',
    billingCycle: 'MONTHLY' | 'ANNUAL' = 'MONTHLY',
    userId: string,
    startTrial: boolean = false,
    amount?: number
  ): Promise<any> {
    try {
      const subscriptionPlans = this.getSubscriptionPlans();
      const plan = subscriptionPlans.find(p => p.planType === planType);

      if (!plan) {
        throw new Error('Invalid plan type: ' + planType);
      }

      const calculatedAmount = amount || (billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice);
      const startDate = new Date();
      const endDate = new Date();
      
      // Set trial period or regular billing period
      if (startTrial) {
        endDate.setDate(endDate.getDate() + 14); // 14-day trial for institutions
      } else {
        endDate.setMonth(endDate.getMonth() + (billingCycle === 'ANNUAL' ? 12 : 1));
      }

      // Get existing subscription for logging
      const existingSubscription = await prisma.institutionSubscription.findUnique({
        where: { institutionId }
      });

      // Create or update subscription
      const subscription = await prisma.institutionSubscription.upsert({
        where: { institutionId },
        update: {
          planType,
          status: startTrial ? 'TRIAL' : 'ACTIVE',
          endDate,
          billingCycle,
          amount: calculatedAmount,
          features: plan.features,
          autoRenew: true,
          metadata: startTrial ? { isTrial: true, trialEndDate: endDate.toISOString() } : {},
          updatedAt: new Date()
        },
        create: {
          institutionId,
          planType,
          status: startTrial ? 'TRIAL' : 'ACTIVE',
          startDate,
          endDate,
          billingCycle,
          amount: calculatedAmount,
          currency: 'USD',
          features: plan.features,
          autoRenew: true,
          metadata: startTrial ? { isTrial: true, trialEndDate: endDate.toISOString() } : {}
        }
      });

      // Log the action
      await this.logInstitutionSubscriptionAction(
        subscription.id,
        existingSubscription ? 'UPGRADE' : 'CREATE',
        existingSubscription?.planType,
        planType,
        existingSubscription?.amount,
        calculatedAmount,
        existingSubscription?.billingCycle,
        billingCycle,
        userId,
        existingSubscription ? 'Plan upgrade' : (startTrial ? 'Trial subscription created' : 'New subscription created')
      );

      // Create billing history entry
      await this.createInstitutionBillingHistory(
        subscription.id,
        startDate,
        calculatedAmount,
        'USD',
        startTrial ? 'TRIAL' : 'PAID',
        'MANUAL',
        undefined,
        startTrial ? `Trial subscription for ${planType} plan` : `Initial payment for ${planType} plan`
      );

      // Update institution's commission rate
      const commissionTier = await prisma.commissionTier.findUnique({
        where: { planType }
      });

      if (commissionTier) {
        await prisma.institution.update({
          where: { id: institutionId },
          data: { commissionRate: commissionTier.commissionRate }
        });
      }

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Downgrade institution subscription
   */
  static async downgradeSubscription(
    institutionId: string,
    newPlanType: 'STARTER' | 'PROFESSIONAL',
    userId: string,
    reason?: string
  ): Promise<any> {
    try {
      const currentSubscription = await prisma.institutionSubscription.findUnique({
        where: { institutionId }
      });

      if (!currentSubscription || currentSubscription.status !== 'ACTIVE') {
        throw new Error('No active subscription found');
      }

      // Validate downgrade
      if (currentSubscription.planType === 'STARTER') {
        throw new Error('Cannot downgrade from STARTER plan');
      }

      if (newPlanType === 'ENTERPRISE') {
        throw new Error('Cannot downgrade to ENTERPRISE plan');
      }

      const subscriptionPlans = this.getSubscriptionPlans();
      const newPlan = subscriptionPlans.find(p => p.planType === newPlanType);

      if (!newPlan) {
        throw new Error('Invalid plan type: ' + newPlanType);
      }

      const newAmount = currentSubscription.billingCycle === 'ANNUAL' 
        ? newPlan.annualPrice 
        : newPlan.monthlyPrice;

      // Update subscription
      const updatedSubscription = await prisma.institutionSubscription.update({
        where: { institutionId },
        data: {
          planType: newPlanType,
          amount: newAmount,
          features: newPlan.features,
          updatedAt: new Date()
        }
      });

      // Log the downgrade
      await this.logInstitutionSubscriptionAction(
        updatedSubscription.id,
        'DOWNGRADE',
        currentSubscription.planType,
        newPlanType,
        currentSubscription.amount,
        newAmount,
        currentSubscription.billingCycle,
        currentSubscription.billingCycle,
        userId,
        reason || 'Plan downgrade'
      );

      // Update institution's commission rate
      const commissionTier = await prisma.commissionTier.findUnique({
        where: { planType: newPlanType }
      });

      if (commissionTier) {
        await prisma.institution.update({
          where: { id: institutionId },
          data: { commissionRate: commissionTier.commissionRate }
        });
      }

      return updatedSubscription;
    } catch (error) {
      console.error('Error downgrading subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel institution subscription
   */
  static async cancelSubscription(
    institutionId: string,
    userId: string,
    reason?: string
  ): Promise<any> {
    try {
      const subscription = await prisma.institutionSubscription.findUnique({
        where: { institutionId }
      });

      if (!subscription || subscription.status !== 'ACTIVE') {
        throw new Error('No active subscription found');
      }

      // Update subscription
      const cancelledSubscription = await prisma.institutionSubscription.update({
        where: { institutionId },
        data: {
          status: 'CANCELLED',
          cancellationReason: reason,
          cancelledAt: new Date(),
          autoRenew: false,
          updatedAt: new Date()
        }
      });

      // Log the cancellation
      await this.logInstitutionSubscriptionAction(
        cancelledSubscription.id,
        'CANCEL',
        subscription.planType,
        undefined,
        subscription.amount,
        undefined,
        subscription.billingCycle,
        undefined,
        userId,
        reason || 'Subscription cancelled'
      );

      // Reset to default commission rate (25% for STARTER)
      await prisma.institution.update({
        where: { id: institutionId },
        data: { commissionRate: 25.0 }
      });

      return cancelledSubscription;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  /**
   * Reactivate institution subscription
   */
  static async reactivateSubscription(
    institutionId: string,
    userId: string
  ): Promise<any> {
    try {
      const subscription = await prisma.institutionSubscription.findUnique({
        where: { institutionId }
      });

      if (!subscription || subscription.status !== 'CANCELLED') {
        throw new Error('No cancelled subscription found');
      }

      // Calculate new end date from current date
      const newEndDate = new Date();
      newEndDate.setMonth(newEndDate.getMonth() + (subscription.billingCycle === 'ANNUAL' ? 12 : 1));

      // Reactivate subscription
      const reactivatedSubscription = await prisma.institutionSubscription.update({
        where: { institutionId },
        data: {
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: newEndDate,
          autoRenew: true,
          cancellationReason: null,
          cancelledAt: null,
          updatedAt: new Date()
        }
      });

      // Log the reactivation
      await this.logInstitutionSubscriptionAction(
        reactivatedSubscription.id,
        'REACTIVATE',
        undefined,
        subscription.planType,
        undefined,
        subscription.amount,
        undefined,
        subscription.billingCycle,
        userId,
        'Subscription reactivated'
      );

      // Update institution's commission rate
      const commissionTier = await prisma.commissionTier.findUnique({
        where: { planType: subscription.planType }
      });

      if (commissionTier) {
        await prisma.institution.update({
          where: { id: institutionId },
          data: { commissionRate: commissionTier.commissionRate }
        });
      }

      return reactivatedSubscription;
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  /**
   * Get institution subscription logs
   */
  static async getInstitutionSubscriptionLogs(
    institutionId: string,
    limit: number = 20
  ): Promise<SubscriptionLogItem[]> {
    try {
      const subscription = await prisma.institutionSubscription.findUnique({
        where: { institutionId }
      });

      if (!subscription) {
        return [];
      }

      const logs = await prisma.institutionSubscriptionLog.findMany({
        where: { subscriptionId: subscription.id },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return logs.map(log => ({
        id: log.id,
        action: log.action,
        oldPlan: log.oldPlan || undefined,
        newPlan: log.newPlan || undefined,
        oldAmount: log.oldAmount || undefined,
        newAmount: log.newAmount || undefined,
        oldBillingCycle: log.oldBillingCycle || undefined,
        newBillingCycle: log.newBillingCycle || undefined,
        reason: log.reason || undefined,
        createdAt: log.createdAt
      }));
    } catch (error) {
      console.error('Error getting subscription logs:', error);
      throw error;
    }
  }

  /**
   * Get student subscription logs
   */
  static async getStudentSubscriptionLogs(
    studentId: string,
    limit: number = 20
  ): Promise<SubscriptionLogItem[]> {
    try {
      const subscription = await prisma.studentSubscription.findUnique({
        where: { 
          studentId
        }
      });

      if (!subscription) {
        return [];
      }

      const logs = await prisma.subscriptionLog.findMany({
        where: { subscriptionId: subscription.id },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return logs.map(log => ({
        id: log.id,
        action: log.action,
        oldPlan: log.oldPlan || undefined,
        newPlan: log.newPlan || undefined,
        oldAmount: log.oldAmount || undefined,
        newAmount: log.newAmount || undefined,
        oldBillingCycle: log.oldBillingCycle || undefined,
        newBillingCycle: log.newBillingCycle || undefined,
        reason: log.reason || undefined,
        createdAt: log.createdAt
      }));
    } catch (error) {
      console.error('Error getting student subscription logs:', error);
      throw error;
    }
  }

  /**
   * Log institution subscription action
   */
  private static async logInstitutionSubscriptionAction(
    subscriptionId: string,
    action: string,
    oldPlan?: string,
    newPlan?: string,
    oldAmount?: number,
    newAmount?: number,
    oldBillingCycle?: string,
    newBillingCycle?: string,
    userId: string,
    reason?: string
  ): Promise<void> {
    try {
      await prisma.institutionSubscriptionLog.create({
        data: {
          subscriptionId,
          action,
          oldPlan,
          newPlan,
          oldAmount,
          newAmount,
          oldBillingCycle,
          newBillingCycle,
          userId,
          reason
        }
      });
    } catch (error) {
      console.error('Error logging subscription action:', error);
    }
  }

  /**
   * Create institution billing history entry
   */
  private static async createInstitutionBillingHistory(
    subscriptionId: string,
    billingDate: Date,
    amount: number,
    currency: string,
    status: string,
    paymentMethod?: string,
    transactionId?: string,
    description?: string
  ): Promise<void> {
    try {
      await prisma.institutionBillingHistory.create({
        data: {
          subscriptionId,
          billingDate,
          amount,
          currency,
          status,
          paymentMethod,
          transactionId,
          invoiceNumber: `INV-${Date.now()}`,
          description
        }
      });
    } catch (error) {
      console.error('Error creating billing history:', error);
    }
  }

  /**
   * Log student subscription action
   */
  private static async logStudentSubscriptionAction(
    subscriptionId: string,
    action: string,
    oldPlan?: string,
    newPlan?: string,
    oldAmount?: number,
    newAmount?: number,
    oldBillingCycle?: string,
    newBillingCycle?: string,
    userId: string,
    reason?: string
  ): Promise<void> {
    try {
      await prisma.subscriptionLog.create({
        data: {
          subscriptionId,
          action,
          oldPlan,
          newPlan,
          oldAmount,
          newAmount,
          oldBillingCycle,
          newBillingCycle,
          userId,
          reason
        }
      });
    } catch (error) {
      console.error('Error logging student subscription action:', error);
    }
  }

  /**
   * Create student billing history entry
   */
  private static async createStudentBillingHistory(
    subscriptionId: string,
    billingDate: Date,
    amount: number,
    currency: string,
    status: string,
    paymentMethod?: string,
    transactionId?: string,
    description?: string
  ): Promise<void> {
    try {
      await prisma.studentBillingHistory.create({
        data: {
          subscriptionId,
          billingDate,
          amount,
          currency,
          status,
          paymentMethod,
          transactionId,
          invoiceNumber: `STU-INV-${Date.now()}`,
          description
        }
      });
    } catch (error) {
      console.error('Error creating student billing history:', error);
    }
  }

  /**
   * Get all available subscription plans
   */
  static getSubscriptionPlans(): SubscriptionPlan[] {
    const institutionTiers = getAllInstitutionTiers();
    return institutionTiers.map(tier => ({
      planType: tier.planType,
      monthlyPrice: tier.price,
      annualPrice: tier.annualPrice,
      features: tier.features
    }));
  }

  /**
   * Get all available student subscription plans
   */
  static getStudentSubscriptionPlans(): StudentSubscriptionPlan[] {
    const studentTiers = getAllStudentTiers();
    return studentTiers.map(tier => ({
      planType: tier.planType,
      monthlyPrice: tier.price,
      annualPrice: tier.annualPrice,
      features: tier.features
    }));
  }

  /**
   * Get fallback student subscription plan (FREE plan)
   */
  static getStudentFallbackPlan(): StudentSubscriptionPlan {
    return {
      planType: 'FREE',
      monthlyPrice: 0,
      annualPrice: 0,
      features: {
        maxCourses: 2,
        practiceTests: 3,
        progressTracking: true,
        support: 'community',
        basicAccess: true
      }
    };
  }

  /**
   * Get fallback institution subscription plan (default commission rate)
   */
  static getInstitutionFallbackPlan(): SubscriptionPlan {
    return {
      planType: 'DEFAULT',
      monthlyPrice: 0,
      annualPrice: 0,
      features: {
        maxStudents: 50,
        maxCourses: 5,
        commissionRate: 20, // Default commission rate
        analytics: 'basic',
        support: 'email',
        basicAccess: true
      }
    };
  }

  /**
   * Get commission tiers
   */
  static async getCommissionTiers(): Promise<CommissionTier[]> {
    try {
      const tiers = await prisma.commissionTier.findMany({
        where: { isActive: true },
        orderBy: { commissionRate: 'asc' }
      });

      return tiers.map(tier => ({
        planType: tier.planType as 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE',
        commissionRate: tier.commissionRate,
        features: tier.features as Record<string, any>
      }));
    } catch (error) {
      console.error('Error getting commission tiers:', error);
      throw error;
    }
  }

  /**
   * Check if institution has access to a specific feature
   */
  static async checkFeatureAccess(
    institutionId: string,
    feature: string
  ): Promise<boolean> {
    try {
      const institution = await prisma.institution.findUnique({
        where: { id: institutionId },
        include: { subscription: true }
      });

      if (!institution?.subscription || institution.subscription.status !== 'ACTIVE') {
        return false;
      }

      const features = institution.subscription.features as Record<string, any>;
      return features[feature] === true;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }

  /**
   * Get usage statistics for an institution
   */
  static async getUsageStats(institutionId: string): Promise<any> {
    try {
      const [studentCount, courseCount, revenueGenerated] = await Promise.all([
        prisma.studentCourseEnrollment.count({
          where: {
            course: { institutionId },
            status: 'ACTIVE'
          }
        }),
        prisma.course.count({
          where: { institutionId }
        }),
        prisma.payment.aggregate({
          where: {
            enrollment: {
              course: { institutionId }
            },
            status: 'COMPLETED'
          },
          _sum: { amount: true }
        })
      ]);

      return {
        activeStudents: studentCount,
        totalCourses: courseCount,
        revenueGenerated: revenueGenerated._sum.amount || 0
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      throw error;
    }
  }

  /**
   * Handle trial expiration for student subscriptions
   */
  static async handleStudentTrialExpiration(studentId: string): Promise<void> {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { subscriptions: true }
      });

      if (!student) {
        throw new Error('Student not found: ' + studentId);
      }

      // Find expired trial subscription
      const expiredTrial = student.subscriptions.find(sub => 
        sub.status === 'TRIAL' && sub.endDate <= new Date()
      );

      if (!expiredTrial) {
        return; // No expired trial found
      }

      // Get fallback plan
      const fallbackPlan = this.getStudentFallbackPlan();

      // Create fallback subscription
      const fallbackSubscription = await prisma.studentSubscription.create({
        data: {
          studentId: student.id,
          planType: fallbackPlan.planType,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          billingCycle: 'ANNUAL',
          amount: 0,
          currency: 'USD',
          features: fallbackPlan.features,
          autoRenew: true,
          metadata: {
            isFallback: true,
            originalTrialId: expiredTrial.id,
            fallbackReason: 'Trial expired without payment'
          }
        }
      });

      // Update expired trial status
      await prisma.studentSubscription.update({
        where: { id: expiredTrial.id },
        data: {
          status: 'EXPIRED',
          metadata: {
            ...expiredTrial.metadata,
            trialExpired: true,
            fallbackCreated: true,
            fallbackSubscriptionId: fallbackSubscription.id
          }
        }
      });

      // Log the fallback creation
      await prisma.subscriptionLog.create({
        data: {
          subscriptionId: fallbackSubscription.id,
          action: 'FALLBACK_CREATED',
          oldPlan: expiredTrial.planType,
          newPlan: fallbackPlan.planType,
          oldAmount: expiredTrial.amount,
          newAmount: 0,
          oldBillingCycle: expiredTrial.billingCycle,
          newBillingCycle: 'ANNUAL',
          userId: 'SYSTEM',
          reason: 'Trial expired, fallback free plan created'
        }
      });

      // // // // // // // // // // // // // // // // // // // // // console.log(` Created fallback subscription for student ${studentId}`);
    } catch (error) {
      console.error(`❌ Error handling student trial expiration for ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Handle trial expiration for institution subscriptions
   */
  static async handleInstitutionTrialExpiration(institutionId: string): Promise<void> {
    try {
      const institution = await prisma.institution.findUnique({
        where: { id: institutionId },
        include: { subscription: true }
      });

      if (!institution) {
        throw new Error('Institution not found: ' + institutionId);
      }

      // Find expired trial subscription
      const expiredTrial = institution.subscription;
      if (!expiredTrial || expiredTrial.status !== 'TRIAL' || expiredTrial.endDate > new Date()) {
        return; // No expired trial found
      }

      // Get fallback plan
      const fallbackPlan = this.getInstitutionFallbackPlan();

      // Create fallback subscription
      const fallbackSubscription = await prisma.institutionSubscription.create({
        data: {
          institutionId: institution.id,
          planType: fallbackPlan.planType,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          billingCycle: 'ANNUAL',
          amount: 0,
          currency: 'USD',
          features: fallbackPlan.features,
          autoRenew: true,
          metadata: {
            isFallback: true,
            originalTrialId: expiredTrial.id,
            fallbackReason: 'Trial expired without payment',
            originalCommissionRate: institution.commissionRate
          }
        }
      });

      // Update institution's commission rate to fallback rate
      await prisma.institution.update({
        where: { id: institution.id },
        data: {
          commissionRate: fallbackPlan.features.commissionRate
        }
      });

      // Update expired trial status
      await prisma.institutionSubscription.update({
        where: { id: expiredTrial.id },
        data: {
          status: 'EXPIRED',
          metadata: {
            ...expiredTrial.metadata,
            trialExpired: true,
            fallbackCreated: true,
            fallbackSubscriptionId: fallbackSubscription.id
          }
        }
      });

      // Log the fallback creation
      await prisma.institutionSubscriptionLog.create({
        data: {
          subscriptionId: fallbackSubscription.id,
          action: 'FALLBACK_CREATED',
          oldPlan: expiredTrial.planType,
          newPlan: fallbackPlan.planType,
          oldAmount: expiredTrial.amount,
          newAmount: 0,
          oldBillingCycle: expiredTrial.billingCycle,
          newBillingCycle: 'ANNUAL',
          userId: 'SYSTEM',
          reason: 'Trial expired, fallback plan with default commission created'
        }
      });

      console.log(` Created fallback subscription for institution ${institutionId}`);
    } catch (error) {
      console.error(`❌ Error handling institution trial expiration for ${institutionId}:`, error);
      throw error;
    }
  }

  /**
   * Process all expired trials and create fallback plans
   */
  static async processExpiredTrials(): Promise<{
    studentFallbacks: number;
    institutionFallbacks: number;
  }> {
    try {
      console.log('🔄 Processing expired trials and creating fallback plans...');

      const now = new Date();
      let studentFallbacks = 0;
      let institutionFallbacks = 0;

      // Find expired student trials
      const expiredStudentTrials = await prisma.studentSubscription.findMany({
        where: {
          status: 'TRIAL',
          endDate: { lte: now }
        },
        include: {
          student: true
        }
      });

      console.log(`Found ${expiredStudentTrials.length} expired student trials`);

      for (const trial of expiredStudentTrials) {
        try {
          await this.handleStudentTrialExpiration(trial.studentId);
          studentFallbacks++;
        } catch (error) {
          console.error(`Failed to process student trial ${trial.id}:`, error);
        }
      }

      // Find expired institution trials
      const expiredInstitutionTrials = await prisma.institutionSubscription.findMany({
        where: {
          status: 'TRIAL',
          endDate: { lte: now }
        },
        include: {
          institution: true
        }
      });

      console.log(`Found ${expiredInstitutionTrials.length} expired institution trials`);

      for (const trial of expiredInstitutionTrials) {
        try {
          await this.handleInstitutionTrialExpiration(trial.institutionId);
          institutionFallbacks++;
        } catch (error) {
          console.error(`Failed to process institution trial ${trial.id}:`, error);
        }
      }

      console.log(` Created ${studentFallbacks} student fallbacks and ${institutionFallbacks} institution fallbacks`);

      return {
        studentFallbacks,
        institutionFallbacks
      };
    } catch (error) {
      console.error('❌ Error processing expired trials:', error);
      throw error;
    }
  }
} 