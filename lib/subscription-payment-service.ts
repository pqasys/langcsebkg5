import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';
import { notificationService } from '@/lib/notification';
import { logger } from './logger';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(`STRIPE_SECRET_KEY is not set - Context: throw new Error('STRIPE_SECRET_KEY is not set');...`);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export interface SubscriptionPaymentData {
  planType: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'BASIC' | 'PREMIUM' | 'PRO';
  billingCycle: 'MONTHLY' | 'ANNUAL';
  amount: number;
  currency: string;
  customerId?: string;
  paymentMethodId?: string;
  startTrial?: boolean;
  metadata?: Record<string, any>;
}

export interface InstitutionSubscriptionPaymentData extends SubscriptionPaymentData {
  institutionId: string;
  userId: string;
}

export interface StudentSubscriptionPaymentData extends SubscriptionPaymentData {
  studentId: string;
  userId: string;
}

export class SubscriptionPaymentService {
  /**
   * Create a payment intent for institution subscription
   */
  static async createInstitutionSubscriptionPayment(
    data: InstitutionSubscriptionPaymentData
  ) {
    try {
      const { institutionId, planType, billingCycle, amount, currency, startTrial = false, metadata = {} } = data;

      // Get institution details
      const institution = await prisma.institution.findUnique({
        where: { id: institutionId }
      });

      if (!institution) {
        throw new Error(`Institution not found - Context: include: { users: true }...`);
      }

      // Create or get Stripe customer
      let customerId = institution.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: institution.email || 'institution@example.com',
          name: institution.name,
          metadata: {
            institutionId,
            type: 'institution'
          }
        });

        customerId = customer.id;
        
        // Update institution with Stripe customer ID
        await prisma.institution.update({
          where: { id: institutionId },
          data: { stripeCustomerId: customerId }
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        customer: customerId,
        metadata: {
          institutionId,
          planType,
          billingCycle,
          startTrial: startTrial.toString(),
          type: 'institution_subscription',
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
        setup_future_usage: startTrial ? 'off_session' : undefined, // For trial subscriptions
      });

      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        customerId
      };
    } catch (error) {
      logger.error('Error creating institution subscription payment:');
      throw error;
    }
  }

  /**
   * Create a payment intent for student subscription
   */
  static async createStudentSubscriptionPayment(
    data: StudentSubscriptionPaymentData
  ) {
    try {
      const { studentId, planType, billingCycle, amount, currency, startTrial = false, metadata = {} } = data;

      // Get student details
      const student = await prisma.student.findUnique({
        where: { id: studentId }
      });

      if (!student) {
        throw new Error(`Student not found - Context: where: { id: studentId },...`);
      }

      // Create or get Stripe customer
      let customerId = student.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: student.email,
          name: student.name,
          metadata: {
            studentId,
            type: 'student'
          }
        });

        customerId = customer.id;
        
        // Update student with Stripe customer ID
        await prisma.student.update({
          where: { id: studentId },
          data: { stripeCustomerId: customerId }
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        customer: customerId,
        metadata: {
          studentId,
          planType,
          billingCycle,
          startTrial: startTrial.toString(),
          type: 'student_subscription',
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
        setup_future_usage: startTrial ? 'off_session' : undefined, // For trial subscriptions
      });

      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        customerId
      };
    } catch (error) {
      logger.error('Error creating student subscription payment:');
      throw error;
    }
  }

  /**
   * Handle successful subscription payment
   */
  static async handleSubscriptionPaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    try {
      const { 
        institutionId, 
        studentId, 
        planType, 
        billingCycle, 
        startTrial,
        type 
      } = paymentIntent.metadata;

      const amount = paymentIntent.amount / 100; // Convert from cents
      const startTrialBool = startTrial === 'true';

      if (type === 'institution_subscription' && institutionId) {
        await this.handleInstitutionSubscriptionPayment(
          institutionId,
          planType as 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE',
          billingCycle as 'MONTHLY' | 'ANNUAL',
          amount,
          paymentIntent.id,
          startTrialBool
        );
      } else if (type === 'student_subscription' && studentId) {
        await this.handleStudentSubscriptionPayment(
          studentId,
          planType as 'BASIC' | 'PREMIUM' | 'PRO',
          billingCycle as 'MONTHLY' | 'ANNUAL',
          amount,
          paymentIntent.id,
          startTrialBool
        );
      }
    } catch (error) {
      logger.error('Error handling subscription payment success:');
      throw error;
    }
  }

  /**
   * Handle institution subscription payment success
   */
  private static async handleInstitutionSubscriptionPayment(
    institutionId: string,
    planType: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE',
    billingCycle: 'MONTHLY' | 'ANNUAL',
    amount: number,
    paymentIntentId: string,
    startTrial: boolean
  ) {
    await prisma.$transaction(async (tx) => {
      // Create subscription
      const subscription = await SubscriptionCommissionService.createSubscription(
        institutionId,
        planType,
        billingCycle,
        'SYSTEM', // System user for payment-initiated subscriptions
        startTrial,
        amount
      );

      // Update billing history with payment details
      await tx.institutionBillingHistory.updateMany({
        where: {
          subscriptionId: subscription.id,
          status: startTrial ? 'TRIAL' : 'PAID'
        },
        data: {
          status: 'PAID',
          paymentMethod: 'STRIPE',
          transactionId: paymentIntentId,
          paidAt: new Date()
        }
      });

      // Create payment record
      await tx.payment.create({
        data: {
          enrollmentId: null, // No enrollment for subscription payments
          amount,
          currency: 'USD',
          status: 'COMPLETED',
          paymentMethod: 'STRIPE',
          paymentId: paymentIntentId,
          metadata: {
            type: 'institution_subscription',
            subscriptionId: subscription.id,
            planType,
            billingCycle,
            startTrial
          }
        }
      });
    });

    // Send subscription activation notification
    try {
      const institution = await prisma.institution.findUnique({
        where: { id: institutionId }
      });

      if (institution) {
        await notificationService.sendSubscriptionStatusNotification(
          institution.id,
          subscription.id,
          {
            oldStatus: 'PENDING',
            newStatus: startTrial ? 'TRIAL' : 'ACTIVE',
            planName: `${planType} Plan`,
            reason: startTrial ? 'Trial started' : 'Payment successful',
            effectiveDate: new Date(),
            studentName: institution.name
          }
        );
      }
    } catch (error) {
      logger.error('Failed to send institution subscription notification:', error);
    }
  }

  /**
   * Handle student subscription payment success
   */
  private static async handleStudentSubscriptionPayment(
    studentId: string,
    planType: 'BASIC' | 'PREMIUM' | 'PRO',
    billingCycle: 'MONTHLY' | 'ANNUAL',
    amount: number,
    paymentIntentId: string,
    startTrial: boolean
  ) {
    await prisma.$transaction(async (tx) => {
      // Get plan details
      const subscriptionPlans = SubscriptionCommissionService.getStudentSubscriptionPlans();
      const plan = subscriptionPlans.find(p => p.planType === planType);

      if (!plan) {
        throw new Error(`Invalid plan type: ${planType} - Context: const subscriptionPlans = SubscriptionCommissionSe...`);
      }

      const calculatedAmount = billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice;
      const startDate = new Date();
      const endDate = new Date();
      
      // Set trial period or regular billing period
      if (startTrial) {
        endDate.setDate(endDate.getDate() + 7); // 7-day trial for students
      } else {
        endDate.setMonth(endDate.getMonth() + (billingCycle === 'ANNUAL' ? 12 : 1));
      }

      // Create subscription
      const subscription = await tx.studentSubscription.create({
        data: {
          studentId,
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

      // Create billing history entry
      await tx.studentBillingHistory.create({
        data: {
          subscriptionId: subscription.id,
          billingDate: startDate,
          amount: calculatedAmount,
          currency: 'USD',
          status: 'PAID',
          paymentMethod: 'STRIPE',
          transactionId: paymentIntentId,
          invoiceNumber: `STU-INV-${Date.now()}`,
          description: startTrial ? `Trial subscription for ${planType} plan` : `Initial payment for ${planType} plan`
        }
      });

      // Create payment record
      await tx.payment.create({
        data: {
          enrollmentId: null, // No enrollment for subscription payments
          amount,
          currency: 'USD',
          status: 'COMPLETED',
          paymentMethod: 'STRIPE',
          paymentId: paymentIntentId,
          metadata: {
            type: 'student_subscription',
            subscriptionId: subscription.id,
            planType,
            billingCycle,
            startTrial
          }
        }
      });
    });

    // Send subscription activation notification
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId }
      });

      if (student) {
        await notificationService.sendSubscriptionStatusNotification(
          student.id,
          subscription.id,
          {
            oldStatus: 'PENDING',
            newStatus: startTrial ? 'TRIAL' : 'ACTIVE',
            planName: `${planType} Plan`,
            reason: startTrial ? 'Trial started' : 'Payment successful',
            effectiveDate: new Date(),
            studentName: student.name
          }
        );
      }
    } catch (error) {
      logger.error('Failed to send student subscription notification:', error);
    }
  }

  /**
   * Create a subscription with payment processing
   */
  static async createSubscriptionWithPayment(
    data: InstitutionSubscriptionPaymentData | StudentSubscriptionPaymentData
  ) {
    try {
      // Create payment intent
      let paymentResult;
      if ('institutionId' in data) {
        paymentResult = await this.createInstitutionSubscriptionPayment(data);
      } else {
        paymentResult = await this.createStudentSubscriptionPayment(data);
      }

      return paymentResult;
    } catch (error) {
      logger.error('Error creating subscription with payment:');
      throw error;
    }
  }

  /**
   * Handle subscription payment failure
   */
  static async handleSubscriptionPaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    try {
      const { institutionId, studentId, type } = paymentIntent.metadata;

      // Log payment failure
      await prisma.payment.create({
        data: {
          enrollmentId: null,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: 'FAILED',
          paymentMethod: 'STRIPE',
          paymentId: paymentIntent.id,
          metadata: {
            type: 'subscription_payment_failure',
            error: paymentIntent.last_payment_error?.message || 'Payment failed',
            institutionId,
            studentId
          }
        }
      });

      // Send failure notification
      try {
        if (type === 'institution_subscription' && institutionId) {
          const institution = await prisma.institution.findUnique({
            where: { id: institutionId }
          });

          if (institution) {
            await notificationService.sendSubscriptionStatusNotification(
              institution.id,
              'failed-payment',
              {
                oldStatus: 'PENDING',
                newStatus: 'FAILED',
                planName: 'Subscription Plan',
                reason: paymentIntent.last_payment_error?.message || 'Payment failed',
                effectiveDate: new Date(),
                studentName: institution.name
              }
            );
          }
        } else if (type === 'student_subscription' && studentId) {
          const student = await prisma.student.findUnique({
            where: { id: studentId }
          });

          if (student) {
            await notificationService.sendSubscriptionStatusNotification(
              student.id,
              'failed-payment',
              {
                oldStatus: 'PENDING',
                newStatus: 'FAILED',
                planName: 'Subscription Plan',
                reason: paymentIntent.last_payment_error?.message || 'Payment failed',
                effectiveDate: new Date(),
                studentName: student.name
              }
            );
          }
        }
      } catch (error) {
        logger.error('Failed to send subscription payment failure notification:', error);
      }
    } catch (error) {
      logger.error('Error handling subscription payment failure:');
      throw error;
    }
  }
}
