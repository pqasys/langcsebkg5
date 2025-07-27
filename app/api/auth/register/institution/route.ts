import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, description, country, state, city, address, subscriptionPlan, billingCycle = 'MONTHLY', startTrial = true } = body;

    // Validate required fields
    if (!name || !email || !password || !description || !country || !city || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and institution in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date();
      
      // Create user first
      const user = await tx.user.create({
        data: {
          id: uuidv4(),
          email,
          password: hashedPassword,
          role: 'INSTITUTION',
          name: name,
          createdAt: now,
          updatedAt: now
        },
      });

      // Create institution with user reference
      const institution = await tx.institution.create({
        data: {
          id: uuidv4(),
          name,
          description,
          country,
          state,
          city,
          address,
          email,
          status: 'PENDING_APPROVAL',
          isApproved: false,
          createdAt: now,
          updatedAt: now,
          user: {
            connect: { id: user.id }
          }
        },
      });

      // Create institution subscription if plan is selected
      if (subscriptionPlan && ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(subscriptionPlan)) {
        const subscriptionPlans = SubscriptionCommissionService.getSubscriptionPlans();
        const plan = subscriptionPlans.find(p => p.planType === subscriptionPlan);
        
        if (plan) {
          const calculatedAmount = billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice;
          const startDate = new Date();
          const endDate = new Date();
          
          // Set trial period or regular billing period
          if (startTrial) {
            endDate.setDate(endDate.getDate() + 14); // 14-day trial for institutions
          } else {
            endDate.setMonth(endDate.getMonth() + (billingCycle === 'ANNUAL' ? 12 : 1));
          }

          const subscription = await tx.institutionSubscription.create({
            data: {
              institutionId: institution.id,
              planType: subscriptionPlan,
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
          await tx.institutionBillingHistory.create({
            data: {
              subscriptionId: subscription.id,
              billingDate: startDate,
              amount: calculatedAmount,
              currency: 'USD',
              status: 'PAID',
              paymentMethod: 'MANUAL',
              invoiceNumber: `INST-INV-${Date.now()}`,
              description: `Initial payment for ${subscriptionPlan} plan`
            }
          });

          // Log the action
          await tx.institutionSubscriptionLog.create({
            data: {
              subscriptionId: subscription.id,
              action: 'CREATE',
              newPlan: subscriptionPlan,
              newAmount: calculatedAmount,
              newBillingCycle: billingCycle,
              userId: user.id,
              reason: 'New subscription created during registration'
            }
          });
        }
      }

      return { user, institution };
    });

    return NextResponse.json(
      { 
        message: 'Institution registered successfully. Please wait for admin approval.',
        status: 'PENDING_APPROVAL'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:');
    return NextResponse.json(
      { message: 'Error registering institution' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 