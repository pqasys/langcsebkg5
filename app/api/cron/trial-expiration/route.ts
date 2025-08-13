import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to ensure this is called by the scheduler
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;
    
    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('🔄 Starting trial expiration check...');

    // Find all trial subscriptions that are expiring today or have expired
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Process expired trials and create fallback plans
    console.log('🔄 Processing expired trials and creating fallback plans...');
    const fallbackResults = await SubscriptionCommissionService.processExpiredTrials();
    
    console.log(` Created ${fallbackResults.studentFallbacks} student fallbacks and ${fallbackResults.institutionFallbacks} institution fallbacks`);

    // Check institution trials that are expiring today (but not yet expired)
    const expiringInstitutionTrials = await prisma.institutionSubscription.findMany({
      where: {
        status: 'TRIAL',
        endDate: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        institution: true
      }
    });

    console.log(`Found ${expiringInstitutionTrials.length} expiring institution trials`);

    for (const trial of expiringInstitutionTrials) {
      try {
        // Check if trial has actually expired
        if (trial.endDate <= now) {
          // HYBRID APPROACH: Check if institution has a payment method
          const institution = await prisma.institution.findUnique({
            where: { id: trial.institutionId },
            include: { user: true }
          });

          if (institution?.stripeCustomerId) {
            // Institution has payment method, convert to active subscription
            await prisma.institutionSubscription.update({
              where: { id: trial.id },
              data: {
                status: 'ACTIVE',
                metadata: {
                  ...trial.metadata,
                  trialEnded: true,
                  trialEndedAt: now.toISOString(),
                  paymentMethodAvailable: true
                }
              }
            });

            // Create billing history entry for the first payment
            await prisma.institutionBillingHistory.create({
              data: {
                subscriptionId: trial.id,
                billingDate: now,
                amount: trial.amount,
                currency: trial.currency,
                status: 'PENDING', // Will be marked as PAID when payment is processed
                paymentMethod: 'AUTO_BILL',
                invoiceNumber: `INV-${Date.now()}-${trial.id}`,
                description: `First billing after trial for ${trial.planType} plan`
              }
            });

            // Log the trial expiration
            await prisma.institutionSubscriptionLog.create({
              data: {
                subscriptionId: trial.id,
                action: 'TRIAL_EXPIRED',
                oldPlan: trial.planType,
                newPlan: trial.planType,
                oldAmount: trial.amount,
                newAmount: trial.amount,
                oldBillingCycle: trial.billingCycle,
                newBillingCycle: trial.billingCycle,
                userId: 'SYSTEM',
                reason: 'Trial period expired, subscription activated with payment method'
              }
            });

            console.log(` Converted institution trial ${trial.id} to active subscription (payment method available)`);
          } else {
            // HYBRID APPROACH: No payment method, require payment collection
            await prisma.institutionSubscription.update({
              where: { id: trial.id },
              data: {
                status: 'PAYMENT_REQUIRED',
                metadata: {
                  ...trial.metadata,
                  trialEnded: true,
                  trialEndedAt: now.toISOString(),
                  paymentMethodAvailable: false,
                  paymentCollectionStarted: now.toISOString()
                }
              }
            });

            // Log the trial expiration with payment required
            await prisma.institutionSubscriptionLog.create({
              data: {
                subscriptionId: trial.id,
                action: 'TRIAL_EXPIRED_PAYMENT_REQUIRED',
                oldPlan: trial.planType,
                newPlan: trial.planType,
                oldAmount: trial.amount,
                newAmount: trial.amount,
                oldBillingCycle: trial.billingCycle,
                newBillingCycle: trial.billingCycle,
                userId: 'SYSTEM',
                reason: 'Trial period expired, payment required to continue'
              }
            });

            // Send payment required notification
            if (institution?.user?.id) {
              try {
                const { notificationService } = await import('@/lib/notification');
                await notificationService.sendNotification(institution.user.id, {
                  type: 'TRIAL_EXPIRED_PAYMENT_REQUIRED',
                  title: 'Trial Expired - Payment Required',
                  message: 'Your trial has expired. Please add a payment method to continue your subscription.',
                  metadata: {
                    subscriptionId: trial.id,
                    planType: trial.planType,
                    amount: trial.amount
                  }
                });
              } catch (error) {
                console.error('Error sending payment required notification:', error);
              }
            }

            console.log(` Institution trial ${trial.id} expired, payment required`);
          }
        }
      } catch (error) {
        console.error('❌ Error processing institution trial ${trial.id}:');
      }
    }

    // Check student trials that are expiring today (but not yet expired)
    const expiringStudentTrials = await prisma.studentSubscription.findMany({
      where: {
        status: 'TRIAL',
        endDate: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        student: true
      }
    });

    console.log(`Found ${expiringStudentTrials.length} expiring student trials`);

    for (const trial of expiringStudentTrials) {
      try {
        // Check if trial has actually expired
        if (trial.endDate <= now) {
          // HYBRID APPROACH: Check if user has a payment method
          const student = await prisma.student.findUnique({
            where: { id: trial.studentId },
            include: { user: true }
          });

          if (student?.stripeCustomerId) {
            // User has payment method, convert to active subscription
            await prisma.studentSubscription.update({
              where: { id: trial.id },
              data: {
                status: 'ACTIVE',
                metadata: {
                  ...trial.metadata,
                  trialEnded: true,
                  trialEndedAt: now.toISOString(),
                  paymentMethodAvailable: true
                }
              }
            });

            // Create billing history entry for the first payment
            await prisma.studentBillingHistory.create({
              data: {
                subscriptionId: trial.id,
                billingDate: now,
                amount: trial.amount,
                currency: trial.currency,
                status: 'PENDING', // Will be marked as PAID when payment is processed
                paymentMethod: 'AUTO_BILL',
                invoiceNumber: `STU-INV-${Date.now()}-${trial.id}`,
                description: `First billing after trial for ${trial.planType} plan`
              }
            });

            // Log the trial expiration
            await prisma.subscriptionLog.create({
              data: {
                subscriptionId: trial.id,
                action: 'TRIAL_EXPIRED',
                oldPlan: trial.planType,
                newPlan: trial.planType,
                oldAmount: trial.amount,
                newAmount: trial.amount,
                oldBillingCycle: trial.billingCycle,
                newBillingCycle: trial.billingCycle,
                userId: 'SYSTEM',
                reason: 'Trial period expired, subscription activated with payment method'
              }
            });

            console.log(` Converted student trial ${trial.id} to active subscription (payment method available)`);
          } else {
            // HYBRID APPROACH: No payment method, require payment collection
            await prisma.studentSubscription.update({
              where: { id: trial.id },
              data: {
                status: 'PAYMENT_REQUIRED',
                metadata: {
                  ...trial.metadata,
                  trialEnded: true,
                  trialEndedAt: now.toISOString(),
                  paymentMethodAvailable: false,
                  paymentCollectionStarted: now.toISOString()
                }
              }
            });

            // Log the trial expiration with payment required
            await prisma.subscriptionLog.create({
              data: {
                subscriptionId: trial.id,
                action: 'TRIAL_EXPIRED_PAYMENT_REQUIRED',
                oldPlan: trial.planType,
                newPlan: trial.planType,
                oldAmount: trial.amount,
                newAmount: trial.amount,
                oldBillingCycle: trial.billingCycle,
                newBillingCycle: trial.billingCycle,
                userId: 'SYSTEM',
                reason: 'Trial period expired, payment required to continue'
              }
            });

            // Send payment required notification
            if (student?.user?.id) {
              try {
                const { notificationService } = await import('@/lib/notification');
                await notificationService.sendNotification(student.user.id, {
                  type: 'TRIAL_EXPIRED_PAYMENT_REQUIRED',
                  title: 'Trial Expired - Payment Required',
                  message: 'Your trial has expired. Please add a payment method to continue your subscription.',
                  metadata: {
                    subscriptionId: trial.id,
                    planType: trial.planType,
                    amount: trial.amount
                  }
                });
              } catch (error) {
                console.error('Error sending payment required notification:', error);
              }
            }

            console.log(` Student trial ${trial.id} expired, payment required`);
          }
        }
      } catch (error) {
        console.error('❌ Error processing student trial ${trial.id}:');
      }
    }

    // Handle recurring billing for active subscriptions
    console.log('🔄 Processing recurring billing...');

    // Find active subscriptions that need renewal
    const renewingInstitutionSubscriptions = await prisma.institutionSubscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          gte: today,
          lt: tomorrow
        },
        autoRenew: true
      }
    });

    console.log(`Found ${renewingInstitutionSubscriptions.length} renewing institution subscriptions`);

    for (const subscription of renewingInstitutionSubscriptions) {
      try {
        // Calculate new end date
        const newEndDate = new Date(subscription.endDate);
        if (subscription.billingCycle === 'ANNUAL') {
          newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        } else {
          newEndDate.setMonth(newEndDate.getMonth() + 1);
        }

        // Update subscription
        await prisma.institutionSubscription.update({
          where: { id: subscription.id },
          data: {
            endDate: newEndDate,
            updatedAt: new Date()
          }
        });

        // Create billing history entry
        await prisma.institutionBillingHistory.create({
          data: {
            subscriptionId: subscription.id,
            billingDate: now,
            amount: subscription.amount,
            currency: subscription.currency,
            status: 'PENDING',
            paymentMethod: 'AUTO_BILL',
            invoiceNumber: `INV-${Date.now()}-${subscription.id}`,
            description: `Recurring billing for ${subscription.planType} plan`
          }
        });

        // Log the renewal
        await prisma.institutionSubscriptionLog.create({
          data: {
            subscriptionId: subscription.id,
            action: 'RENEW',
            oldPlan: subscription.planType,
            newPlan: subscription.planType,
            oldAmount: subscription.amount,
            newAmount: subscription.amount,
            oldBillingCycle: subscription.billingCycle,
            newBillingCycle: subscription.billingCycle,
            userId: 'SYSTEM',
            reason: 'Automatic renewal'
          }
        });

        console.log(` Renewed institution subscription ${subscription.id}`);
      } catch (error) {
        console.error('❌ Error renewing institution subscription ${subscription.id}:');
      }
    }

    // Handle student subscription renewals
    const renewingStudentSubscriptions = await prisma.studentSubscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          gte: today,
          lt: tomorrow
        },
        autoRenew: true
      }
    });

    console.log(`Found ${renewingStudentSubscriptions.length} renewing student subscriptions`);

    for (const subscription of renewingStudentSubscriptions) {
      try {
        // Calculate new end date
        const newEndDate = new Date(subscription.endDate);
        if (subscription.billingCycle === 'ANNUAL') {
          newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        } else {
          newEndDate.setMonth(newEndDate.getMonth() + 1);
        }

        // Update subscription
        await prisma.studentSubscription.update({
          where: { id: subscription.id },
          data: {
            endDate: newEndDate,
            updatedAt: new Date()
          }
        });

        // Create billing history entry
        await prisma.studentBillingHistory.create({
          data: {
            subscriptionId: subscription.id,
            billingDate: now,
            amount: subscription.amount,
            currency: subscription.currency,
            status: 'PENDING',
            paymentMethod: 'AUTO_BILL',
            invoiceNumber: `STU-INV-${Date.now()}-${subscription.id}`,
            description: `Recurring billing for ${subscription.planType} plan`
          }
        });

        // Log the renewal
        await prisma.subscriptionLog.create({
          data: {
            subscriptionId: subscription.id,
            action: 'RENEW',
            oldPlan: subscription.planType,
            newPlan: subscription.planType,
            oldAmount: subscription.amount,
            newAmount: subscription.amount,
            oldBillingCycle: subscription.billingCycle,
            newBillingCycle: subscription.billingCycle,
            userId: 'SYSTEM',
            reason: 'Automatic renewal'
          }
        });

        console.log(` Renewed student subscription ${subscription.id}`);
      } catch (error) {
        console.error('❌ Error renewing student subscription ${subscription.id}:');
      }
    }

    console.log('✅ Trial expiration and billing check completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Trial expiration and billing check completed',
      processed: {
        institutionTrials: expiringInstitutionTrials.length,
        studentTrials: expiringStudentTrials.length,
        institutionRenewals: renewingInstitutionSubscriptions.length,
        studentRenewals: renewingStudentSubscriptions.length,
        fallbacks: fallbackResults
      }
    });

  } catch (error) {
    console.error('❌ Error in trial expiration cron job:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 