# Hybrid Payment Collection Implementation

## Overview

The Hybrid Payment Collection system implements Option 3 from the payment collection strategy. This approach allows users to start trials without providing payment information, but requires payment after trial expiration, with fallback to free plans only after payment attempts fail.

## How It Works

### 1. Trial Period (7 days for students, 14 days for institutions)
- Users can start trials **without providing payment method**
- Full access to subscription features during trial
- No payment information required upfront

### 2. Trial Expiration Check
When a trial expires, the system checks:
- **If user has payment method**: Convert to active subscription and attempt billing
- **If no payment method**: Set status to `PAYMENT_REQUIRED` and initiate payment collection

### 3. Payment Collection Process
- Users receive notification that payment is required
- Payment modal appears in the UI
- Users can add payment method and complete payment
- **3 payment attempts** allowed before fallback

### 4. Fallback System
- After 3 failed payment attempts, user gets free plan with limited features
- User can upgrade at any time by completing payment

## Technical Implementation

### Core Components

#### 1. PostTrialPaymentService (`lib/post-trial-payment-service.ts`)
- Handles payment intent creation for post-trial payments
- Manages payment attempts and failure handling
- Coordinates with fallback system
- Sends notifications for payment status

#### 2. Updated Trial Expiration Cron (`app/api/cron/trial-expiration/route.ts`)
- Implements hybrid logic for trial expiration
- Checks for payment method availability
- Sets appropriate subscription status
- Sends payment required notifications

#### 3. Payment Collection APIs
- `POST /api/student/subscription/post-trial-payment`
- `POST /api/institution/subscription/post-trial-payment`
- Create payment intents for post-trial payments
- Handle payment processing

#### 4. Payment Attempts Cron (`app/api/cron/process-payment-attempts/route.ts`)
- Runs every 3 days to process payment attempts
- Sends payment reminders
- Creates fallback plans after max attempts

#### 5. Webhook Handler (`app/api/webhooks/post-trial-payment/route.ts`)
- Processes Stripe webhook events
- Handles payment success/failure
- Updates subscription status

#### 6. Payment Modal Component (`components/PostTrialPaymentModal.tsx`)
- React component for payment collection UI
- Integrates with Stripe Elements
- Handles payment success/failure states

### Database Schema Changes

#### New Subscription Status
```sql
-- New status for subscriptions requiring payment
'PAYMENT_REQUIRED' -- After trial expires without payment method
```

#### Enhanced Metadata
```json
{
  "trialEnded": true,
  "trialEndedAt": "2024-01-01T00:00:00Z",
  "paymentMethodAvailable": false,
  "paymentCollectionStarted": "2024-01-01T00:00:00Z"
}
```

### Payment Flow

#### 1. Trial Expiration
```typescript
// Check if user has payment method
if (user.stripeCustomerId) {
  // Convert to active subscription
  subscription.status = 'ACTIVE';
} else {
  // Require payment collection
  subscription.status = 'PAYMENT_REQUIRED';
  sendPaymentRequiredNotification();
}
```

#### 2. Payment Collection
```typescript
// Create payment intent
const paymentResult = await PostTrialPaymentService.createPostTrialPaymentIntent({
  subscriptionId,
  userId,
  userType: 'STUDENT',
  planType: subscription.planType,
  billingCycle: subscription.billingCycle,
  amount: subscription.amount,
  currency: subscription.currency
});
```

#### 3. Payment Processing
```typescript
// Handle payment success
await PostTrialPaymentService.handlePostTrialPaymentSuccess(paymentIntentId);

// Handle payment failure
await PostTrialPaymentService.handlePostTrialPaymentFailure(
  subscriptionId,
  userType,
  errorMessage
);
```

#### 4. Fallback Creation
```typescript
// After 3 failed attempts
if (attemptNumber >= 3) {
  await createFallbackPlan(subscriptionId, userType);
  sendMaxAttemptsReachedNotification();
}
```

## Configuration

### Environment Variables
```env
# Stripe configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cron configuration
CRON_SECRET=your-cron-secret
```

### Payment Attempt Settings
```typescript
// In PostTrialPaymentService
private static readonly MAX_PAYMENT_ATTEMPTS = 3;
private static readonly DAYS_BETWEEN_ATTEMPTS = 3;
```

## User Experience

### 1. Trial Start
- User signs up and starts trial
- No payment information required
- Full access to subscription features

### 2. Trial Expiration
- User receives notification about trial expiration
- Payment modal appears in UI
- Clear messaging about payment requirement

### 3. Payment Collection
- User can add payment method
- Multiple payment attempts allowed
- Clear feedback on payment status

### 4. Fallback Plan
- After failed attempts, user gets limited free plan
- Clear upgrade path available
- No service interruption

## Benefits

### For Users
- **Risk-free trials**: No payment required upfront
- **Flexible payment**: Multiple attempts to complete payment
- **No service interruption**: Fallback to free plan
- **Clear upgrade path**: Easy to upgrade from fallback

### For Business
- **Higher trial conversion**: Lower barrier to entry
- **Revenue protection**: Payment collection after trial
- **Reduced churn**: Fallback plans keep users engaged
- **Better user experience**: Gradual payment collection

## Monitoring and Analytics

### Key Metrics
- Trial to payment conversion rate
- Payment attempt success rate
- Fallback plan usage
- Upgrade from fallback rate

### Logging
- All payment attempts logged
- Trial expiration events tracked
- Fallback plan creation recorded
- Payment success/failure events

## Testing

### Manual Testing
```bash
# Test trial expiration
npm run test:trial-expiration

# Test payment collection
npm run test:payment-collection

# Test fallback system
npm run test:fallback-system
```

### API Testing
```bash
# Test post-trial payment endpoint
curl -X POST /api/student/subscription/post-trial-payment \
  -H "Content-Type: application/json" \
  -d '{"subscriptionId": "sub_123"}'
```

## Future Enhancements

### 1. Automated Payment Retry
- Automatic retry of failed payments
- Smart retry scheduling based on failure reasons

### 2. Payment Method Pre-filling
- Remember payment methods from previous attempts
- Auto-fill payment forms

### 3. Personalized Payment Offers
- Discounts for users on fallback plans
- Targeted upgrade incentives

### 4. Advanced Analytics
- Payment behavior analysis
- Conversion optimization insights
- Churn prediction models

## Troubleshooting

### Common Issues

#### 1. Payment Intent Creation Fails
- Check Stripe API keys
- Verify subscription status
- Check user permissions

#### 2. Webhook Processing Errors
- Verify webhook signature
- Check webhook endpoint configuration
- Review webhook event types

#### 3. Fallback Plan Not Created
- Check cron job execution
- Verify payment attempt counting
- Review subscription status

### Debug Steps

1. Check subscription logs for payment attempts
2. Verify Stripe customer creation
3. Review webhook event processing
4. Check notification delivery
5. Validate fallback plan creation

## Security Considerations

### Payment Security
- All payments processed through Stripe
- PCI compliance maintained
- Secure webhook signature verification

### Data Protection
- Payment information not stored locally
- User consent for payment processing
- Secure API authentication

### Access Control
- Subscription ownership verification
- Payment method validation
- Admin-only fallback management
