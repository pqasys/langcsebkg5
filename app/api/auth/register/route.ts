import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service'
import { logger, logError } from '../../../../lib/logger';
import { notificationService } from '@/lib/notification';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Registration request data:', data)
    const { name, email, password, role, subscriptionPlan, billingCycle = 'MONTHLY', startTrial = true } = data

    // Validate required fields
    if (!name || !email || !password || !role) {
      console.log('Missing fields:', { 
        name: !!name, 
        email: !!email, 
        password: !!password, 
        role: !!role,
        nameValue: name,
        emailValue: email,
        roleValue: role
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email)
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('Found existing user:', {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        createdAt: existingUser.createdAt
      })
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const now = new Date()

    // Create user and institution in a transaction if role is INSTITUTION
    if (role === 'INSTITUTION') {
      console.log('Creating institution user...')
      const result = await prisma.$transaction(async (tx) => {
        // Create user first
        const user = await tx.user.create({
          data: {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            role,
            createdAt: now,
            updatedAt: now
          }
        })
        console.log('Created user:', user)

        // Create institution with user reference
        const institution = await tx.institution.create({
          data: {
            id: uuidv4(),
            name,
            email,
            description: 'Institution description will be updated after approval',
            country: 'To be updated',
            state: 'To be updated',
            city: 'To be updated',
            address: 'To be updated',
            status: 'PENDING',
            isApproved: false,
            createdAt: now,
            updatedAt: now,
            currency: 'USD',
            commissionRate: 0
          }
        })
        console.log('Created institution:', institution)

        // Update user with institution reference
        await tx.user.update({
          where: { id: user.id },
          data: { institutionId: institution.id }
        })

        return { user, institution }
      })

      return NextResponse.json({
        message: 'Institution registered successfully. Please wait for admin approval.',
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role
        }
      })
    }

    // For STUDENT role, create both user and student records
    if (role === 'STUDENT') {
      let subscriptionInfo: unknown = null;
      
      const result = await prisma.$transaction(async (tx) => {
        // Create user first
        const user = await tx.user.create({
          data: {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            role,
            createdAt: now,
            updatedAt: now
          }
        })

        // Create student record without an institution ID
        const student = await tx.student.create({
          data: {
            id: user.id, // Use the same ID as the user
            name,
            email,
            status: 'active',
            created_at: now,
            updated_at: now,
            last_active: now
          }
        })

        // Create student subscription if plan is selected
        if (subscriptionPlan && ['BASIC', 'PREMIUM', 'PRO'].includes(subscriptionPlan)) {
          // First, get or create the student tier
          let studentTier = await tx.studentTier.findUnique({
            where: { planType: subscriptionPlan }
          });

          if (!studentTier) {
            // Create the tier if it doesn't exist
            const tierData = {
              BASIC: {
                name: 'Basic Plan',
                description: 'Perfect for beginners starting their language journey',
                price: 12.99,
                features: {
                  maxCourses: 5,
                  maxLanguages: 5,
                  practiceTests: 10,
                  progressTracking: true,
                  support: 'email'
                }
              },
              PREMIUM: {
                name: 'Premium Plan',
                description: 'Most popular choice for serious language learners',
                price: 24.99,
                features: {
                  maxCourses: 15,
                  maxLanguages: 15,
                  practiceTests: 50,
                  progressTracking: true,
                  support: 'priority',
                  liveConversation: true
                }
              },
              PRO: {
                name: 'Pro Plan',
                description: 'Complete language learning experience with personal tutoring',
                price: 49.99,
                features: {
                  maxCourses: -1, // unlimited
                  maxLanguages: -1, // unlimited
                  practiceTests: -1, // unlimited
                  progressTracking: true,
                  support: '24/7',
                  liveConversation: true,
                  personalTutor: true
                }
              }
            };

            const planData = tierData[subscriptionPlan as keyof typeof tierData];
            studentTier = await tx.studentTier.create({
              data: {
                planType: subscriptionPlan,
                name: planData.name,
                description: planData.description,
                price: planData.price,
                billingCycle: billingCycle,
                features: planData.features,
                maxCourses: planData.features.maxCourses,
                maxLanguages: planData.features.maxLanguages
              }
            });
          }

          const startDate = new Date();
          const endDate = new Date();
          
          // Set trial period or regular billing period
          if (startTrial) {
            endDate.setDate(endDate.getDate() + 7); // 7-day trial for students
          } else {
            endDate.setMonth(endDate.getMonth() + (billingCycle === 'ANNUAL' ? 12 : 1));
          }

          const subscription = await tx.studentSubscription.create({
            data: {
              studentId: student.id,
              studentTierId: studentTier.id,
              status: startTrial ? 'TRIAL' : 'ACTIVE',
              startDate,
              endDate,
              autoRenew: true,
              metadata: startTrial ? { 
                isTrial: true, 
                trialEndDate: endDate.toISOString(),
                billingCycle: billingCycle
              } : { billingCycle: billingCycle }
            }
          });

          // Create billing history entry
          await tx.studentBillingHistory.create({
            data: {
              subscriptionId: subscription.id,
              billingDate: startDate,
              amount: studentTier.price,
              currency: 'USD',
              status: 'PAID',
              paymentMethod: 'MANUAL',
              invoiceNumber: `STU-INV-${Date.now()}`,
              description: `Initial payment for ${subscriptionPlan} plan`
            }
          });

          // Log the action
          await tx.subscriptionLog.create({
            data: {
              subscriptionId: subscription.id,
              action: 'CREATE',
              newPlan: subscriptionPlan,
              newAmount: studentTier.price,
              newBillingCycle: billingCycle,
              userId: user.id,
              reason: 'New subscription created during registration'
            }
          });

          // Store subscription info for notification after transaction
          subscriptionInfo = {
            planName: studentTier.name,
            planType: subscriptionPlan,
            amount: studentTier.price,
            billingCycle: billingCycle,
            isTrial: startTrial,
            trialEndDate: startTrial ? endDate.toISOString() : null
          };
        }

        return { user, student }
      })

      // Send welcome notification
      try {
        console.log('Sending welcome notification...');
        
        await notificationService.sendNotificationWithTemplate(
          'welcome_email',
          result.user.id,
          {
            name: result.user.name
          },
          {
            registrationType: 'student',
            hasSubscription: !!subscriptionPlan,
            subscriptionPlan: subscriptionPlan || 'none',
            billingCycle: billingCycle
          },
          'SYSTEM'
        );
        
        console.log('✅ Welcome notification sent successfully');
      } catch (notificationError) {
        console.error('❌ Failed to send welcome notification:', notificationError);
        // Don't fail the registration if notification fails
      }

      // Send subscription confirmation notification if subscription was created
      if (subscriptionInfo) {
        try {
          console.log('Sending subscription confirmation notification...');
          
          await notificationService.sendNotificationWithTemplate(
            'payment_confirmation',
            result.user.id,
            {
              name: result.user.name,
              amount: `$${subscriptionInfo.amount.toFixed(2)}`,
              referenceNumber: `SUB-${Date.now()}`,
              date: new Date().toLocaleDateString(),
              planName: subscriptionInfo.planName
            },
            {
              subscriptionId: subscriptionInfo.planType,
              planType: subscriptionInfo.planType,
              billingCycle: subscriptionInfo.billingCycle,
              isTrial: subscriptionInfo.isTrial,
              trialEndDate: subscriptionInfo.trialEndDate
            },
            'SYSTEM'
          );
          
          console.log('✅ Subscription confirmation notification sent successfully');
        } catch (subscriptionNotificationError) {
          console.error('❌ Failed to send subscription confirmation notification:', subscriptionNotificationError);
          // Don't fail the registration if notification fails
        }
      }

      // Create notification preferences for student
      try {
        await prisma.studentNotificationPreferences.upsert({
          where: { student_id: result.user.id },
          update: {},
          create: {
            student_id: result.user.id,
            email_notifications: true,
            push_notifications: true,
            sms_notifications: false,
            course_updates: true,
            course_reminders: true,
            course_announcements: true,
            course_schedule: true,
            assignment_reminders: true,
            assignment_deadlines: true,
            assignment_feedback: true,
            assignment_grades: true,
            payment_reminders: true,
            payment_confirmation: true,
            payment_receipts: true,
            payment_failed: true,
            progress_updates: true,
            achievement_alerts: true,
            milestone_reached: true,
            instructor_messages: true,
            group_messages: true,
            system_announcements: true,
            notification_frequency: 'DAILY'
          }
        });
        console.log('✅ Notification preferences created/updated');
      } catch (prefError) {
        console.error('❌ Failed to create notification preferences:', prefError);
        // Don't fail the registration if preferences creation fails
      }

      return NextResponse.json({
        message: 'Student registered successfully',
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role
        }
      })
    }



    // For other roles, just create the user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role,
        createdAt: now,
        updatedAt: now
      }
    })

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { error: 'Failed to register user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    )
  }
} 