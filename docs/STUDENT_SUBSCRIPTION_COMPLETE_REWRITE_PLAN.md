# Student Subscription Complete Rewrite Plan (No Database Reset)

## 🚨 **CRITICAL CONSTRAINT: NO DATABASE RESET**

**UPDATE: All current student subscription data is test data and can be safely discarded.**

This plan ensures **zero data loss** while completely rewriting the student subscription system to match the proper schema design. Since existing data is test data, we can take a more direct approach.

## 📋 **Phase 1: Pre-Migration Analysis & Preparation**

### 1.1 Current State Assessment
- **Current Schema**: StudentSubscription has direct fields (planType, billingCycle, amount, etc.)
- **Target Schema**: StudentSubscription uses studentTierId to reference StudentTier
- **Data Risk**: Existing test subscriptions can be safely cleared and recreated

### 1.2 Data Backup Strategy (Optional - Test Data)
```bash
# Optional: Create backup of current test subscription data
mysqldump -u root -p langcsebkg4a student_subscriptions > backup_test_student_subscriptions_$(date +%Y%m%d_%H%M%S).sql
mysqldump -u root -p langcsebkg4a student_billing_history > backup_test_student_billing_history_$(date +%Y%m%d_%H%M%S).sql
mysqldump -u root -p langcsebkg4a subscription_logs > backup_test_subscription_logs_$(date +%Y%m%d_%H%M%S).sql
```

### 1.3 Simplified Migration Approach
Since all data is test data, we can:
- Clear existing test subscription data
- Create proper StudentTier records
- Start fresh with the correct schema
- No complex migration needed

## 📋 **Phase 2: Database Cleanup & Setup (Simplified)**

### 2.1 Clear Test Data
```sql
-- Step 1: Clear all test subscription data
DELETE FROM subscription_logs WHERE subscriptionId IN (SELECT id FROM student_subscriptions);
DELETE FROM student_billing_history WHERE subscriptionId IN (SELECT id FROM student_subscriptions);
DELETE FROM student_subscriptions;
```

### 2.2 Create Standard StudentTier Records
```sql
-- Step 2: Create standard StudentTier records
INSERT INTO student_tiers (id, planType, name, description, price, currency, billingCycle, features, maxCourses, maxLanguages, isActive, createdAt, updatedAt) VALUES
('basic-monthly', 'BASIC', 'Basic Plan (Monthly)', 'Basic student subscription with monthly billing', 12.99, 'USD', 'MONTHLY', '{"courses": 5, "languages": 3, "practiceTests": 10, "progressTracking": true, "support": "email"}', 5, 3, true, NOW(), NOW()),
('basic-annual', 'BASIC', 'Basic Plan (Annual)', 'Basic student subscription with annual billing', 129.99, 'USD', 'ANNUAL', '{"courses": 5, "languages": 3, "practiceTests": 10, "progressTracking": true, "support": "email"}', 5, 3, true, NOW(), NOW()),
('premium-monthly', 'PREMIUM', 'Premium Plan (Monthly)', 'Premium student subscription with monthly billing', 24.99, 'USD', 'MONTHLY', '{"courses": 20, "languages": 8, "practiceTests": 50, "progressTracking": true, "support": "priority", "offlineAccess": true, "certificateDownload": true}', 20, 8, true, NOW(), NOW()),
('premium-annual', 'PREMIUM', 'Premium Plan (Annual)', 'Premium student subscription with annual billing', 249.99, 'USD', 'ANNUAL', '{"courses": 20, "languages": 8, "practiceTests": 50, "progressTracking": true, "support": "priority", "offlineAccess": true, "certificateDownload": true}', 20, 8, true, NOW(), NOW()),
('pro-monthly', 'PRO', 'Pro Plan (Monthly)', 'Pro student subscription with monthly billing', 49.99, 'USD', 'MONTHLY', '{"courses": -1, "languages": -1, "practiceTests": -1, "progressTracking": true, "support": "24/7", "offlineAccess": true, "certificateDownload": true, "personalTutoring": true, "customLearningPaths": true}', -1, -1, true, NOW(), NOW()),
('pro-annual', 'PRO', 'Pro Plan (Annual)', 'Pro student subscription with annual billing', 499.99, 'USD', 'ANNUAL', '{"courses": -1, "languages": -1, "practiceTests": -1, "progressTracking": true, "support": "24/7", "offlineAccess": true, "certificateDownload": true, "personalTutoring": true, "customLearningPaths": true}', -1, -1, true, NOW(), NOW());
```

### 2.3 Verify Setup
```sql
-- Step 3: Verify StudentTier records created successfully
SELECT planType, billingCycle, price, isActive FROM student_tiers ORDER BY planType, billingCycle;
```

## 📋 **Phase 3: Service Layer Rewrite**

### 3.1 Update SubscriptionCommissionService

#### 3.1.1 Fix getStudentSubscriptionStatus()
```typescript
static async getStudentSubscriptionStatus(studentId: string): Promise<StudentSubscriptionStatus> {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        subscriptions: {
          include: {
            studentTier: true, // ✅ Use proper relation
            billingHistory: {
              orderBy: { billingDate: 'desc' },
              take: 10
            }
          }
        }
      }
    });

    if (!student) {
      throw new Error('Student not found: ' + studentId);
    }

    const currentSubscription = student.subscriptions[0];
    const hasActiveSubscription = currentSubscription && 
      ['ACTIVE', 'TRIAL', 'PAST_DUE'].includes(currentSubscription.status);

    // ✅ Get plan details from studentTier relation
    const currentPlan = currentSubscription?.studentTier?.planType;
    const subscriptionEndDate = currentSubscription?.endDate;
    const nextBillingDate = currentSubscription?.endDate;

    // Check if subscription is a fallback plan
    const isFallback = currentSubscription?.metadata?.isFallback || false;

    // Determine upgrade/downgrade options
    const canUpgrade = !isFallback && hasActiveSubscription && 
      currentSubscription?.studentTier?.planType !== 'PRO';
    const canDowngrade = !isFallback && hasActiveSubscription && 
      currentSubscription?.studentTier?.planType !== 'BASIC';
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
      features: currentSubscription?.studentTier?.features as Record<string, any> || {},
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
```

#### 3.1.2 Create New createStudentSubscription() Method
```typescript
static async createStudentSubscription(
  studentId: string,
  planType: 'BASIC' | 'PREMIUM' | 'PRO',
  billingCycle: 'MONTHLY' | 'ANNUAL' = 'MONTHLY',
  userId: string,
  startTrial: boolean = false,
  amount?: number
): Promise<any> {
  try {
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
      existingSubscription?.studentTier?.planType,
      planType,
      existingSubscription?.studentTier?.price,
      calculatedAmount,
      existingSubscription?.studentTier?.billingCycle,
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
```

### 3.2 Update SubscriptionPaymentService
```typescript
private static async handleStudentSubscriptionPayment(
  studentId: string,
  planType: 'BASIC' | 'PREMIUM' | 'PRO',
  billingCycle: 'MONTHLY' | 'ANNUAL',
  amount: number,
  paymentIntentId: string,
  startTrial: boolean
) {
  await prisma.$transaction(async (tx) => {
    // Find the appropriate StudentTier
    const studentTier = await tx.studentTier.findFirst({
      where: { 
        planType,
        billingCycle,
        isActive: true
      }
    });

    if (!studentTier) {
      throw new Error(`Student tier not found for plan: ${planType}`);
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

    // Create subscription using new service method
    const subscription = await SubscriptionCommissionService.createStudentSubscription(
      studentId,
      planType,
      billingCycle,
      'SYSTEM', // userId for system operations
      startTrial,
      calculatedAmount
    );

    // Create billing history entry
    await tx.studentBillingHistory.create({
      data: {
        subscriptionId: subscription.id,
        billingDate: startDate,
        amount: calculatedAmount,
        currency: studentTier.currency,
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
        enrollmentId: null,
        amount,
        currency: studentTier.currency,
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
}
```

## 📋 **Phase 4: API Route Rewrite**

### 4.1 Complete Rewrite of /api/student/subscription/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SubscriptionCommissionService } from '@/lib/subscription-commission-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Since user ID and student ID are the same
    const studentId = session.user.id;

    // Get comprehensive subscription status
    const subscriptionStatus = await SubscriptionCommissionService.getStudentSubscriptionStatus(studentId);
    
    // Get subscription logs
    const logs = await SubscriptionCommissionService.getStudentSubscriptionLogs(studentId, 10);

    return NextResponse.json({
      subscriptionStatus,
      logs
    });
  } catch (error) {
    console.error('Error fetching student subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;
    const body = await request.json();
    const { planType, billingCycle = 'MONTHLY', amount, startTrial = false } = body;

    if (!planType || !['BASIC', 'PREMIUM', 'PRO'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Check if student already has a subscription
    const existingSubscription = await prisma.studentSubscription.findUnique({
      where: { studentId }
    });

    if (existingSubscription && ['ACTIVE', 'PAST_DUE', 'TRIAL'].includes(existingSubscription.status)) {
      return NextResponse.json({ error: 'Active subscription already exists' }, { status: 400 });
    }

    // Create subscription using new service method
    const subscription = await SubscriptionCommissionService.createStudentSubscription(
      studentId,
      planType,
      billingCycle,
      session.user.id,
      startTrial,
      amount
    );

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription: {
        id: subscription.id,
        planType: subscription.studentTier?.planType,
        status: subscription.status,
        startDate: subscription.startDate.toISOString(),
        endDate: subscription.endDate.toISOString(),
        billingCycle: subscription.studentTier?.billingCycle,
        amount: subscription.studentTier?.price,
        currency: subscription.studentTier?.currency,
        features: subscription.studentTier?.features,
        autoRenew: subscription.autoRenew
      }
    });
  } catch (error) {
    console.error('Error creating student subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;
    const body = await request.json();
    const { planType, billingCycle, action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    let subscription;

    switch (action) {
      case 'UPGRADE':
        if (!planType || !['BASIC', 'PREMIUM', 'PRO'].includes(planType)) {
          return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
        }
        subscription = await SubscriptionCommissionService.createStudentSubscription(
          studentId,
          planType,
          billingCycle || 'MONTHLY',
          session.user.id
        );
        break;

      case 'DOWNGRADE':
        if (!planType || !['BASIC', 'PREMIUM'].includes(planType)) {
          return NextResponse.json({ error: 'Invalid plan type for downgrade' }, { status: 400 });
        }
        subscription = await SubscriptionCommissionService.createStudentSubscription(
          studentId,
          planType,
          billingCycle || 'MONTHLY',
          session.user.id
        );
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Subscription updated successfully',
      subscription: {
        id: subscription.id,
        planType: subscription.studentTier?.planType,
        status: subscription.status,
        startDate: subscription.startDate.toISOString(),
        endDate: subscription.endDate.toISOString(),
        billingCycle: subscription.studentTier?.billingCycle,
        amount: subscription.studentTier?.price,
        currency: subscription.studentTier?.currency,
        features: subscription.studentTier?.features,
        autoRenew: subscription.autoRenew
      }
    });
  } catch (error) {
    console.error('Error updating student subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;

    // Get current subscription
    const subscription = await prisma.studentSubscription.findUnique({
      where: { studentId }
    });

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason') || 'Subscription cancelled by user';

    // Cancel subscription
    const cancelledSubscription = await prisma.studentSubscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
        cancelledAt: new Date(),
        autoRenew: false,
        updatedAt: new Date()
      }
    });

    // Log the cancellation
    await prisma.subscriptionLog.create({
      data: {
        subscriptionId: cancelledSubscription.id,
        action: 'CANCEL',
        oldPlan: subscription.studentTier?.planType,
        oldAmount: subscription.studentTier?.price,
        oldBillingCycle: subscription.studentTier?.billingCycle,
        userId: session.user.id,
        reason
      }
    });

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      subscription: {
        id: cancelledSubscription.id,
        status: cancelledSubscription.status,
        cancelledAt: cancelledSubscription.cancelledAt?.toISOString()
      }
    });
  } catch (error) {
    console.error('Error cancelling student subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 📋 **Phase 5: Frontend Updates**

### 5.1 Update StudentSubscriptionCard Component
```typescript
// Update response handling to work with new API structure
const fetchSubscriptionData = async () => {
  try {
    const [subscriptionRes, logsRes] = await Promise.all([
      fetch('/api/student/subscription'),
      fetch('/api/student/subscription/logs?limit=10')
    ]);

    if (subscriptionRes.ok) {
      const data = await subscriptionRes.json();
      // ✅ Handle new response structure
      setSubscriptionData(data.subscriptionStatus);
      setLogs(data.logs || []);
    }
  } catch (error) {
    console.error('Error occurred:', error);
    toast.error('Failed to load subscription data');
  } finally {
    setLoading(false);
  }
};
```

### 5.2 Update Other Frontend Components
- Update all components that consume student subscription data
- Ensure they handle the new response structure
- Update any hardcoded plan references

## 📋 **Phase 6: Testing & Validation**

### 6.1 Data Integrity Tests
```typescript
// Test script to verify migration integrity
async function verifyMigrationIntegrity() {
  // Check all subscriptions have valid studentTierId
  const orphanedSubscriptions = await prisma.studentSubscription.findMany({
    where: {
      OR: [
        { studentTierId: null },
        { studentTierId: '' }
      ]
    }
  });

  if (orphanedSubscriptions.length > 0) {
    console.error('❌ Found orphaned subscriptions:', orphanedSubscriptions.length);
    return false;
  }

  // Check all billing history is properly linked
  const orphanedBilling = await prisma.studentBillingHistory.findMany({
    where: {
      subscription: null
    }
  });

  if (orphanedBilling.length > 0) {
    console.error('❌ Found orphaned billing history:', orphanedBilling.length);
    return false;
  }

  console.log('✅ Migration integrity verified');
  return true;
}
```

### 6.2 API Functionality Tests
- Test all CRUD operations on student subscriptions
- Verify proper error handling
- Test subscription upgrades/downgrades
- Test billing history creation

### 6.3 Frontend Integration Tests
- Test subscription card displays correctly
- Test plan selection and payment flow
- Test subscription management actions

## 📋 **Phase 7: Deployment Strategy**

### 7.1 Pre-Deployment Checklist
- [ ] Database backups completed
- [ ] Migration scripts tested on staging
- [ ] All service methods updated
- [ ] API routes rewritten and tested
- [ ] Frontend components updated
- [ ] Integration tests passing

### 7.2 Deployment Steps
1. **Stop application** (planned downtime)
2. **Run database migration** (preserves all data)
3. **Deploy updated code**
4. **Run integrity verification**
5. **Start application**
6. **Monitor for errors**

### 7.3 Rollback Plan
- Keep old code as backup
- Database migration is reversible
- Can rollback to previous version if issues arise

## 📋 **Phase 8: Post-Deployment Monitoring**

### 8.1 Key Metrics to Monitor
- API response times
- Error rates
- Subscription creation success rate
- Payment processing success rate
- Frontend error rates

### 8.2 Alert Thresholds
- API error rate > 1%
- Subscription creation failure > 5%
- Payment processing failure > 2%

## 🎯 **Success Criteria**

### Technical Success
- [ ] Zero data loss during migration
- [ ] All existing subscriptions continue to work
- [ ] New subscriptions use proper tier-based system
- [ ] API response times remain acceptable
- [ ] No breaking changes to frontend

### Business Success
- [ ] Subscription management continues to work
- [ ] Payment processing remains functional
- [ ] User experience is maintained or improved
- [ ] Admin interface works with new system

## ⚠️ **Risk Mitigation**

### High-Risk Areas
1. **Data Migration**: Multiple backup strategies
2. **API Changes**: Comprehensive testing
3. **Frontend Integration**: Gradual rollout
4. **Payment Processing**: Extensive validation

### Contingency Plans
1. **Database Issues**: Immediate rollback to backup
2. **API Failures**: Fallback to previous version
3. **Frontend Issues**: Feature flags for gradual rollout
4. **Payment Issues**: Manual intervention procedures

## 📅 **Timeline Estimate (Simplified)**

- **Phase 1-2 (Database Cleanup & Setup)**: 0.5-1 day
- **Phase 3 (Service Layer)**: 2-3 days
- **Phase 4 (API Routes)**: 1-2 days
- **Phase 5 (Frontend)**: 1-2 days
- **Phase 6 (Testing)**: 1-2 days
- **Phase 7 (Deployment)**: 0.5 day
- **Phase 8 (Monitoring)**: Ongoing

**Total Estimated Time**: 6-10 days (Reduced by 2-3 days)

## 🚀 **Next Steps (Simplified)**

1. **Approve this plan**
2. **Optional: Create test data backup** (if desired for reference)
3. **Begin Phase 1 implementation**
4. **Clear test data and create StudentTier records**
5. **Deploy and monitor**

**Note**: Since all data is test data, we can proceed more aggressively with the implementation.

This plan ensures a complete rewrite while maintaining **zero data loss** and **minimal system disruption**. 