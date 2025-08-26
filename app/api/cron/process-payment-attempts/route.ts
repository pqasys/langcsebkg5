import { NextRequest, NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';
import { PostTrialPaymentService } from '@/lib/post-trial-payment-service';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to ensure this is called by the scheduler
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;
    
    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting payment attempts processing...');

    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000)); // 3 days ago

    // Find subscriptions that need payment attempts
    const [studentSubscriptions, institutionSubscriptions] = await Promise.all([
      prisma.studentSubscription.findMany({
        where: {
          status: 'PAYMENT_REQUIRED',
          metadata: {
            path: ['paymentCollectionStarted'],
            gte: threeDaysAgo.toISOString()
          }
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
          status: 'PAYMENT_REQUIRED',
          metadata: {
            path: ['paymentCollectionStarted'],
            gte: threeDaysAgo.toISOString()
          }
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

    console.log(`Found ${studentSubscriptions.length} student subscriptions needing payment attempts`);
    console.log(`Found ${institutionSubscriptions.length} institution subscriptions needing payment attempts`);

    let processedCount = 0;
    let successCount = 0;
    let failureCount = 0;

    // Process student subscriptions
    for (const subscription of studentSubscriptions) {
      try {
        const attemptNumber = await PostTrialPaymentService['getPaymentAttemptNumber'](subscription.id);
        
        if (attemptNumber >= 3) {
          // Max attempts reached, create fallback plan
          await PostTrialPaymentService['createFallbackPlan'](subscription.id, 'STUDENT');
          console.log(`✅ Created fallback plan for student subscription ${subscription.id}`);
          successCount++;
        } else {
          // Send payment reminder
          if (subscription.student?.user?.id) {
            try {
              const { notificationService } = await import('@/lib/notification');
              await notificationService.sendNotification(subscription.student.user.id, {
                type: 'PAYMENT_REMINDER',
                title: 'Payment Reminder',
                message: `Your subscription payment is due. This is attempt ${attemptNumber + 1} of 3.`,
                metadata: {
                  subscriptionId: subscription.id,
                  attemptNumber: attemptNumber + 1,
                  maxAttempts: 3
                }
              });
              console.log(`📧 Sent payment reminder for student subscription ${subscription.id}`);
            } catch (error) {
              console.error('Error sending payment reminder:', error);
            }
          }
        }
        processedCount++;
      } catch (error) {
        console.error(`❌ Error processing student subscription ${subscription.id}:`, error);
        failureCount++;
      }
    }

    // Process institution subscriptions
    for (const subscription of institutionSubscriptions) {
      try {
        const attemptNumber = await PostTrialPaymentService['getPaymentAttemptNumber'](subscription.id);
        
        if (attemptNumber >= 3) {
          // Max attempts reached, create fallback plan
          await PostTrialPaymentService['createFallbackPlan'](subscription.id, 'INSTITUTION');
          console.log(`✅ Created fallback plan for institution subscription ${subscription.id}`);
          successCount++;
        } else {
          // Send payment reminder
          if (subscription.institution?.user?.id) {
            try {
              const { notificationService } = await import('@/lib/notification');
              await notificationService.sendNotification(subscription.institution.user.id, {
                type: 'PAYMENT_REMINDER',
                title: 'Payment Reminder',
                message: `Your subscription payment is due. This is attempt ${attemptNumber + 1} of 3.`,
                metadata: {
                  subscriptionId: subscription.id,
                  attemptNumber: attemptNumber + 1,
                  maxAttempts: 3
                }
              });
              console.log(`📧 Sent payment reminder for institution subscription ${subscription.id}`);
            } catch (error) {
              console.error('Error sending payment reminder:', error);
            }
          }
        }
        processedCount++;
      } catch (error) {
        console.error(`❌ Error processing institution subscription ${subscription.id}:`, error);
        failureCount++;
      }
    }

    console.log(`✅ Payment attempts processing completed:`);
    console.log(`   - Processed: ${processedCount}`);
    console.log(`   - Success: ${successCount}`);
    console.log(`   - Failures: ${failureCount}`);

    return NextResponse.json({
      success: true,
      message: 'Payment attempts processing completed',
      stats: {
        processed: processedCount,
        success: successCount,
        failures: failureCount
      }
    });

  } catch (error) {
    console.error('❌ Error in payment attempts processing:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
