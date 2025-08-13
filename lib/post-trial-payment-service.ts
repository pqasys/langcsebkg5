import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { logger } from '@/lib/logger';
import { notificationService } from '@/lib/notification';

export interface PostTrialPaymentData {
  subscriptionId: string;
  userId: string;
  userType: 'STUDENT' | 'INSTITUTION';
  planType: string;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  amount: number;
  currency: string;
}

export interface PaymentAttemptResult {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
  requiresAction?: boolean;
}

export class PostTrialPaymentService {
  /**
   * Maximum number of payment attempts before falling back to free plan
   */
  private static readonly MAX_PAYMENT_ATTEMPTS = 3;
  
  /**
   * Days between payment attempts
   */
  private static readonly DAYS_BETWEEN_ATTEMPTS = 3;

  /**
   * Create a payment intent for post-trial payment collection
   */
  static async createPostTrialPaymentIntent(data: PostTrialPaymentData): Promise<PaymentAttemptResult> {
    try {
      const { subscriptionId, userId, userType, planType, billingCycle, amount, currency } = data;

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          student: true,
          institution: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get subscription details
      const subscription = userType === 'STUDENT' 
        ? await prisma.studentSubscription.findUnique({ where: { id: subscriptionId } })
        : await prisma.institutionSubscription.findUnique({ where: { id: subscriptionId } });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Check if subscription is in payment collection state
      if (subscription.status !== 'PAYMENT_REQUIRED') {
        throw new Error('Subscription is not in payment collection state');
      }

      // Get or create Stripe customer
      const customerId = userType === 'STUDENT' 
        ? user.student?.stripeCustomerId 
        : user.institution?.stripeCustomerId;

      let stripeCustomerId = customerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId,
            userType,
            subscriptionId
          }
        });

        stripeCustomerId = customer.id;

        // Update user with Stripe customer ID
        if (userType === 'STUDENT' && user.student) {
          await prisma.student.update({
            where: { id: user.student.id },
            data: { stripeCustomerId }
          });
        } else if (userType === 'INSTITUTION' && user.institution) {
          await prisma.institution.update({
            where: { id: user.institution.id },
            data: { stripeCustomerId }
          });
        }
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        customer: stripeCustomerId,
        metadata: {
          subscriptionId,
          userId,
          userType,
          planType,
          billingCycle,
          type: 'post_trial_payment',
          attemptNumber: await this.getPaymentAttemptNumber(subscriptionId)
        },
        automatic_payment_methods: {
          enabled: true,
        },
        setup_future_usage: 'off_session', // For recurring billing
      });

      // Update subscription with payment attempt
      await this.recordPaymentAttempt(subscriptionId, userType, paymentIntent.id);

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        requiresAction: paymentIntent.status === 'requires_action'
      };

    } catch (error) {
      logger.error('Error creating post-trial payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Handle successful post-trial payment
   */
  static async handlePostTrialPaymentSuccess(paymentIntentId: string): Promise<void> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const { subscriptionId, userType, planType, billingCycle } = paymentIntent.metadata;

      if (userType === 'STUDENT') {
        await this.handleStudentPostTrialPaymentSuccess(subscriptionId, paymentIntent);
      } else {
        await this.handleInstitutionPostTrialPaymentSuccess(subscriptionId, paymentIntent);
      }

      // Send success notification
      await this.sendPaymentSuccessNotification(subscriptionId, userType);

    } catch (error) {
      logger.error('Error handling post-trial payment success:', error);
      throw error;
    }
  }

  /**
   * Handle failed post-trial payment
   */
  static async handlePostTrialPaymentFailure(subscriptionId: string, userType: 'STUDENT' | 'INSTITUTION', error: string): Promise<void> {
    try {
      const attemptNumber = await this.getPaymentAttemptNumber(subscriptionId);
      
      if (attemptNumber >= this.MAX_PAYMENT_ATTEMPTS) {
        // Max attempts reached, create fallback plan
        await this.createFallbackPlan(subscriptionId, userType);
        await this.sendMaxAttemptsReachedNotification(subscriptionId, userType);
      } else {
        // Schedule next payment attempt
        await this.scheduleNextPaymentAttempt(subscriptionId, userType);
        await this.sendPaymentFailureNotification(subscriptionId, userType, attemptNumber);
      }

    } catch (error) {
      logger.error('Error handling post-trial payment failure:', error);
      throw error;
    }
  }

  /**
   * Get the current payment attempt number for a subscription
   */
  private static async getPaymentAttemptNumber(subscriptionId: string): Promise<number> {
    const attempts = await prisma.subscriptionLog.count({
      where: {
        subscriptionId,
        action: 'PAYMENT_ATTEMPT'
      }
    });
    return attempts + 1;
  }

  /**
   * Record a payment attempt
   */
  private static async recordPaymentAttempt(subscriptionId: string, userType: 'STUDENT' | 'INSTITUTION', paymentIntentId: string): Promise<void> {
    await prisma.subscriptionLog.create({
      data: {
        subscriptionId,
        action: 'PAYMENT_ATTEMPT',
        userId: 'SYSTEM',
        reason: `Payment attempt for post-trial subscription`,
        metadata: {
          paymentIntentId,
          userType,
          timestamp: new Date().toISOString()
        }
      }
    });
  }

  /**
   * Handle successful student post-trial payment
   */
  private static async handleStudentPostTrialPaymentSuccess(subscriptionId: string, paymentIntent: Stripe.PaymentIntent): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Update subscription status
      await tx.studentSubscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'ACTIVE',
          metadata: {
            postTrialPaymentCompleted: true,
            paymentIntentId: paymentIntent.id,
            paymentCompletedAt: new Date().toISOString()
          }
        }
      });

      // Create billing history entry
      await tx.studentBillingHistory.create({
        data: {
          subscriptionId,
          billingDate: new Date(),
          amount: paymentIntent.amount / 100, // Convert from cents
          currency: paymentIntent.currency.toUpperCase(),
          status: 'PAID',
          paymentMethod: 'STRIPE',
          transactionId: paymentIntent.id,
          invoiceNumber: `STU-POST-TRIAL-${Date.now()}`,
          description: 'Post-trial payment successful'
        }
      });

      // Log the successful payment
      await tx.subscriptionLog.create({
        data: {
          subscriptionId,
          action: 'POST_TRIAL_PAYMENT_SUCCESS',
          userId: 'SYSTEM',
          reason: 'Post-trial payment completed successfully',
          metadata: {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
          }
        }
      });
    });
  }

  /**
   * Handle successful institution post-trial payment
   */
  private static async handleInstitutionPostTrialPaymentSuccess(subscriptionId: string, paymentIntent: Stripe.PaymentIntent): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Update subscription status
      await tx.institutionSubscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'ACTIVE',
          metadata: {
            postTrialPaymentCompleted: true,
            paymentIntentId: paymentIntent.id,
            paymentCompletedAt: new Date().toISOString()
          }
        }
      });

      // Create billing history entry
      await tx.institutionBillingHistory.create({
        data: {
          subscriptionId,
          billingDate: new Date(),
          amount: paymentIntent.amount / 100, // Convert from cents
          currency: paymentIntent.currency.toUpperCase(),
          status: 'PAID',
          paymentMethod: 'STRIPE',
          transactionId: paymentIntent.id,
          invoiceNumber: `INST-POST-TRIAL-${Date.now()}`,
          description: 'Post-trial payment successful'
        }
      });

      // Log the successful payment
      await tx.institutionSubscriptionLog.create({
        data: {
          subscriptionId,
          action: 'POST_TRIAL_PAYMENT_SUCCESS',
          userId: 'SYSTEM',
          reason: 'Post-trial payment completed successfully',
          metadata: {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
          }
        }
      });
    });
  }

  /**
   * Create fallback plan when max payment attempts are reached
   */
  private static async createFallbackPlan(subscriptionId: string, userType: 'STUDENT' | 'INSTITUTION'): Promise<void> {
    if (userType === 'STUDENT') {
      // Import the service to avoid circular dependency
      const { SubscriptionCommissionService } = await import('./subscription-commission-service');
      await SubscriptionCommissionService.handleStudentTrialExpiration(subscriptionId);
    } else {
      const { SubscriptionCommissionService } = await import('./subscription-commission-service');
      await SubscriptionCommissionService.handleInstitutionTrialExpiration(subscriptionId);
    }
  }

  /**
   * Schedule next payment attempt
   */
  private static async scheduleNextPaymentAttempt(subscriptionId: string, userType: 'STUDENT' | 'INSTITUTION'): Promise<void> {
    const nextAttemptDate = new Date();
    nextAttemptDate.setDate(nextAttemptDate.getDate() + this.DAYS_BETWEEN_ATTEMPTS);

    const logData = {
      subscriptionId,
      action: 'NEXT_PAYMENT_ATTEMPT_SCHEDULED',
      userId: 'SYSTEM',
      reason: 'Scheduled next payment attempt after failure',
      metadata: {
        nextAttemptDate: nextAttemptDate.toISOString(),
        userType
      }
    };

    if (userType === 'STUDENT') {
      await prisma.subscriptionLog.create({ data: logData });
    } else {
      await prisma.institutionSubscriptionLog.create({ data: logData });
    }
  }

  /**
   * Send payment success notification
   */
  private static async sendPaymentSuccessNotification(subscriptionId: string, userType: 'STUDENT' | 'INSTITUTION'): Promise<void> {
    try {
      const subscription = userType === 'STUDENT'
        ? await prisma.studentSubscription.findUnique({ 
            where: { id: subscriptionId },
            include: { student: { include: { user: true } } }
          })
        : await prisma.institutionSubscription.findUnique({
            where: { id: subscriptionId },
            include: { institution: { include: { user: true } } }
          });

      if (subscription) {
        const userId = userType === 'STUDENT' 
          ? subscription.student?.user?.id 
          : subscription.institution?.user?.id;

        if (userId) {
          await notificationService.sendNotification(userId, {
            type: 'POST_TRIAL_PAYMENT_SUCCESS',
            title: 'Payment Successful!',
            message: 'Your subscription has been activated. Welcome back!',
            metadata: {
              subscriptionId,
              userType,
              planType: subscription.planType
            }
          });
        }
      }
    } catch (error) {
      logger.error('Error sending payment success notification:', error);
    }
  }

  /**
   * Send payment failure notification
   */
  private static async sendPaymentFailureNotification(subscriptionId: string, userType: 'STUDENT' | 'INSTITUTION', attemptNumber: number): Promise<void> {
    try {
      const subscription = userType === 'STUDENT'
        ? await prisma.studentSubscription.findUnique({ 
            where: { id: subscriptionId },
            include: { student: { include: { user: true } } }
          })
        : await prisma.institutionSubscription.findUnique({
            where: { id: subscriptionId },
            include: { institution: { include: { user: true } } }
          });

      if (subscription) {
        const userId = userType === 'STUDENT' 
          ? subscription.student?.user?.id 
          : subscription.institution?.user?.id;

        if (userId) {
          const remainingAttempts = this.MAX_PAYMENT_ATTEMPTS - attemptNumber;
          await notificationService.sendNotification(userId, {
            type: 'POST_TRIAL_PAYMENT_FAILURE',
            title: 'Payment Failed',
            message: `Payment attempt failed. You have ${remainingAttempts} more attempts before your account is limited.`,
            metadata: {
              subscriptionId,
              userType,
              attemptNumber,
              remainingAttempts
            }
          });
        }
      }
    } catch (error) {
      logger.error('Error sending payment failure notification:', error);
    }
  }

  /**
   * Send max attempts reached notification
   */
  private static async sendMaxAttemptsReachedNotification(subscriptionId: string, userType: 'STUDENT' | 'INSTITUTION'): Promise<void> {
    try {
      const subscription = userType === 'STUDENT'
        ? await prisma.studentSubscription.findUnique({ 
            where: { id: subscriptionId },
            include: { student: { include: { user: true } } }
          })
        : await prisma.institutionSubscription.findUnique({
            where: { id: subscriptionId },
            include: { institution: { include: { user: true } } }
          });

      if (subscription) {
        const userId = userType === 'STUDENT' 
          ? subscription.student?.user?.id 
          : subscription.institution?.user?.id;

        if (userId) {
          await notificationService.sendNotification(userId, {
            type: 'MAX_PAYMENT_ATTEMPTS_REACHED',
            title: 'Account Limited',
            message: 'Maximum payment attempts reached. Your account has been limited to basic features.',
            metadata: {
              subscriptionId,
              userType,
              planType: subscription.planType
            }
          });
        }
      }
    } catch (error) {
      logger.error('Error sending max attempts notification:', error);
    }
  }

  /**
   * Get subscriptions that need payment collection
   */
  static async getSubscriptionsNeedingPayment(): Promise<{
    studentSubscriptions: any[];
    institutionSubscriptions: any[];
  }> {
    const [studentSubscriptions, institutionSubscriptions] = await Promise.all([
      prisma.studentSubscription.findMany({
        where: {
          status: 'PAYMENT_REQUIRED'
        },
        include: {
          student: {
            include: {
              user: true
            }
          }
        }
      }),
      prisma.institutionSubscription.findMany({
        where: {
          status: 'PAYMENT_REQUIRED'
        },
        include: {
          institution: {
            include: {
              user: true
            }
          }
        }
      })
    ]);

    return {
      studentSubscriptions,
      institutionSubscriptions
    };
  }
}
