# Subscription System - Immediate Fixes Implementation Guide

## Current Issues Summary

1. **Billing Cycle Limitation**: Cannot offer both monthly and annual versions of the same plan
2. **Missing Basic Plan**: Only Premium and Pro plans are showing in upgrade dialog
3. **Schema Mismatch**: Code tries to access `planType` directly instead of through `StudentTier` relation
4. **Missing Relations**: Billing history must be queried separately

## Immediate Fixes Required

### Fix 1: Remove Unique Constraint on StudentTier.planType

**Problem**: The unique constraint prevents multiple billing cycles for the same plan type.

**Solution**: Create a database migration to remove the unique constraint and add a composite unique constraint.

#### Migration Script
```sql
-- Create new migration file: prisma/migrations/YYYYMMDDHHMMSS_remove_plan_type_unique_constraint.sql

-- Step 1: Drop the unique constraint
ALTER TABLE `StudentTier` DROP INDEX `StudentTier_planType_key`;

-- Step 2: Add composite unique constraint
ALTER TABLE `StudentTier` ADD CONSTRAINT `StudentTier_planType_billingCycle_key` UNIQUE (`planType`, `billingCycle`);

-- Step 3: Add index for better performance
CREATE INDEX `StudentTier_planType_billingCycle_idx` ON `StudentTier` (`planType`, `billingCycle`);
```

#### Update Prisma Schema
```prisma
model StudentTier {
  id          String   @id @default(cuid())
  planType    String   // Remove @unique constraint
  name        String
  description String?
  price       Float
  currency    String   @default("USD")
  billingCycle BillingCycle @default(MONTHLY)
  features    Json
  maxCourses  Int
  maxLanguages Int
  isActive    Boolean  @default(true)
  
  // Relations
  subscriptions StudentSubscription[]
  
  @@unique([planType, billingCycle]) // Add composite unique constraint
  @@index([planType, billingCycle])
}
```

### Fix 2: Create Missing Student Tiers

**Problem**: Only monthly tiers exist, but annual tiers are needed.

**Solution**: Create a script to add missing annual tiers.

#### Implementation Script
```typescript
// scripts/create-annual-tiers.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAnnualTiers() {
  try {
    console.log('Creating annual student tiers...');
    
    const annualTiers = [
      {
        planType: 'BASIC',
        name: 'Basic Plan (Annual)',
        description: 'Perfect for beginners starting their language journey - Annual billing',
        price: 124.99, // ~2 months free compared to monthly
        currency: 'USD',
        billingCycle: 'ANNUAL',
        features: {
          maxCourses: 5,
          maxLanguages: 5,
          practiceTests: 10,
          progressTracking: true,
          support: 'email',
          basicAccess: true
        },
        maxCourses: 5,
        maxLanguages: 5,
        isActive: true
      },
      {
        planType: 'PREMIUM',
        name: 'Premium Plan (Annual)',
        description: 'Most popular choice for serious language learners - Annual billing',
        price: 239.99, // ~2 months free compared to monthly
        currency: 'USD',
        billingCycle: 'ANNUAL',
        features: {
          maxCourses: 20,
          maxLanguages: -1, // Unlimited
          practiceTests: 50,
          progressTracking: true,
          support: 'priority',
          offlineAccess: true,
          certificateDownload: true,
          liveConversations: true,
          aiLearning: true
        },
        maxCourses: 20,
        maxLanguages: -1,
        isActive: true
      },
      {
        planType: 'PRO',
        name: 'Pro Plan (Annual)',
        description: 'Complete language learning experience with personal tutoring - Annual billing',
        price: 479.99, // ~2 months free compared to monthly
        currency: 'USD',
        billingCycle: 'ANNUAL',
        features: {
          maxCourses: -1, // Unlimited
          maxLanguages: -1, // Unlimited
          practiceTests: -1, // Unlimited
          progressTracking: true,
          support: 'dedicated',
          offlineAccess: true,
          certificateDownload: true,
          liveConversations: true,
          aiLearning: true,
          oneOnOneTutoring: true,
          personalizedLearning: true,
          groupSessions: true
        },
        maxCourses: -1,
        maxLanguages: -1,
        isActive: true
      }
    ];

    for (const tier of annualTiers) {
      const existingTier = await prisma.studentTier.findFirst({
        where: {
          planType: tier.planType,
          billingCycle: tier.billingCycle
        }
      });

      if (!existingTier) {
        const createdTier = await prisma.studentTier.create({
          data: tier
        });
        console.log(`✅ Created: ${createdTier.name} (${createdTier.planType} - ${createdTier.billingCycle})`);
      } else {
        console.log(`⏭️  Skipped: ${tier.name} already exists`);
      }
    }

    console.log('🎉 Annual tiers setup complete!');
  } catch (error) {
    console.error('❌ Error creating annual tiers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAnnualTiers();
```

### Fix 3: Update Subscription Service to Handle Billing Cycles

**Problem**: The subscription service doesn't properly handle different billing cycles.

**Solution**: Update the service to find the correct tier based on both plan type and billing cycle.

#### Updated Service Method
```typescript
// lib/subscription-commission-service.ts

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

    // Find the appropriate StudentTier with both planType and billingCycle
    const studentTier = await prisma.studentTier.findFirst({
      where: { 
        planType,
        billingCycle,
        isActive: true
      }
    });

    if (!studentTier) {
      throw new Error(`Student tier not found for plan: ${planType} with billing cycle: ${billingCycle}. Please ensure all tiers are created.`);
    }

    const calculatedAmount = amount || studentTier.price;
    const startDate = new Date();
    const endDate = new Date();
    
    // Set trial period or regular billing period
    if (startTrial) {
      endDate.setDate(endDate.getDate() + 7); // 7-day trial for students
    } else {
      // Calculate end date based on billing cycle
      if (billingCycle === 'ANNUAL') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }
    }

    // Get existing subscription for logging
    const existingSubscription = await prisma.studentSubscription.findUnique({
      where: { studentId },
      include: { studentTier: true }
    });

    // Create or update subscription
    const subscription = await prisma.studentSubscription.upsert({
      where: { studentId },
      update: {
        studentTierId: studentTier.id,
        status: startTrial ? 'TRIAL' : 'ACTIVE',
        endDate,
        autoRenew: true,
        metadata: startTrial ? { isTrial: true, trialEndDate: endDate.toISOString() } : {},
        updatedAt: new Date()
      },
      create: {
        studentId,
        studentTierId: studentTier.id,
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
      existingSubscription?.studentTier?.planType,
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

    // Return subscription with tier information
    return {
      ...subscription,
      planType: studentTier.planType,
      billingCycle: studentTier.billingCycle,
      amount: calculatedAmount,
      currency: studentTier.currency,
      features: studentTier.features
    };
  } catch (error) {
    console.error('Error creating student subscription:', error);
    throw error;
  }
}
```

### Fix 4: Update Frontend to Show All Plans

**Problem**: The upgrade dialog only shows Premium and Pro plans, missing Basic.

**Solution**: Update the StudentSubscriptionCard component to show all available plans.

#### Updated Component
```typescript
// components/student/StudentSubscriptionCard.tsx

// In the upgrade dialog section
<SelectContent>
  {subscriptionData.currentPlan !== 'BASIC' && (
    <SelectItem value="BASIC">Basic</SelectItem>
  )}
  {subscriptionData.currentPlan !== 'PREMIUM' && (
    <SelectItem value="PREMIUM">Premium</SelectItem>
  )}
  {subscriptionData.currentPlan !== 'PRO' && (
    <SelectItem value="PRO">Pro</SelectItem>
  )}
</SelectContent>
```

### Fix 5: Add Billing Cycle Selection

**Problem**: Users can't choose between monthly and annual billing.

**Solution**: Add billing cycle selection to the subscription interface.

#### Updated Subscription Interface
```typescript
// components/student/StudentSubscriptionCard.tsx

interface SubscriptionFormData {
  planType: 'BASIC' | 'PREMIUM' | 'PRO';
  billingCycle: 'MONTHLY' | 'ANNUAL';
}

// Add billing cycle selection
<div className="space-y-4">
  <div>
    <Label htmlFor="planType">Select Plan</Label>
    <Select value={formData.planType} onValueChange={(value) => setFormData({...formData, planType: value as any})}>
      <SelectTrigger>
        <SelectValue placeholder="Choose a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="BASIC">Basic</SelectItem>
        <SelectItem value="PREMIUM">Premium</SelectItem>
        <SelectItem value="PRO">Pro</SelectItem>
      </SelectContent>
    </Select>
  </div>
  
  <div>
    <Label htmlFor="billingCycle">Billing Cycle</Label>
    <Select value={formData.billingCycle} onValueChange={(value) => setFormData({...formData, billingCycle: value as any})}>
      <SelectTrigger>
        <SelectValue placeholder="Choose billing cycle" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MONTHLY">Monthly</SelectItem>
        <SelectItem value="ANNUAL">Annual (Save 20%)</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
```

## Implementation Steps

### Step 1: Database Migration
```bash
# Create and run the migration
npx prisma migrate dev --name remove_plan_type_unique_constraint

# Verify the changes
npx prisma studio
```

### Step 2: Create Annual Tiers
```bash
# Run the script to create annual tiers
npx tsx scripts/create-annual-tiers.ts

# Verify tiers were created
npx tsx scripts/check-current-tiers.ts
```

### Step 3: Update Application Code
```bash
# Update the subscription service
# Update the frontend components
# Test the changes

npm run build
npm run dev
```

### Step 4: Test the Implementation
```bash
# Test subscription creation with different billing cycles
# Test the upgrade dialog shows all plans
# Test subscription status display
```

## Verification Checklist

- [ ] Database migration completed successfully
- [ ] Annual tiers created in database
- [ ] Subscription service handles billing cycles correctly
- [ ] Frontend shows all three plans (Basic, Premium, Pro)
- [ ] Billing cycle selection works
- [ ] Subscription creation works for both monthly and annual
- [ ] Subscription status displays correctly
- [ ] No Prisma errors in console
- [ ] All existing functionality still works

## Rollback Plan

If issues arise, the following rollback steps can be taken:

1. **Database Rollback**: Revert the migration using `npx prisma migrate reset`
2. **Code Rollback**: Revert the service and component changes
3. **Tier Cleanup**: Remove annual tiers if needed

## Next Steps After Implementation

1. **Monitor**: Watch for any errors or issues
2. **Test**: Comprehensive testing of all subscription flows
3. **Document**: Update user documentation for new billing options
4. **Plan**: Begin work on the long-term architectural improvements 