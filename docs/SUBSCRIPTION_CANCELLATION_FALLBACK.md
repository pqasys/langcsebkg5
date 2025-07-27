# Subscription Cancellation and Fallback Commission Rate

## Overview

This document describes the implementation of subscription cancellation functionality for institutions, allowing them to unsubscribe from their default STARTER plan and fall back to their institution's default commission rate.

## Key Features

### 1. Subscription Cancellation
- Institutions can cancel their active subscriptions through the UI
- Cancellation immediately deactivates the subscription
- Users are informed about the consequences of cancellation
- Cancellation is logged for audit purposes

### 2. Commission Rate Fallback
- When a subscription is cancelled, the system automatically falls back to the institution's default commission rate
- The fallback logic is implemented in `SubscriptionCommissionService.getCommissionRate()`
- Commission rates are determined by:
  - **Active subscription**: Uses the subscription plan's commission rate
  - **No active subscription**: Uses the institution's default commission rate

### 3. UI Components

#### Subscription Management Card
- Shows current subscription status and commission rate
- Displays different states for active vs. no subscription
- Provides clear information about commission rate changes
- Includes cancellation button with confirmation dialog

#### No Subscription State
- Clear messaging about using institution default rate
- Call-to-action to view available plans
- Information about trial periods

### 4. API Endpoints

#### GET `/api/institution/subscription`
- Returns subscription data including fallback information
- Provides `hasActiveSubscription` flag
- Returns effective commission rate (subscription or fallback)

#### DELETE `/api/institution/subscription`
- Cancels the institution's active subscription
- Updates subscription status to 'CANCELLED'
- Logs the cancellation action

## Implementation Details

### Commission Rate Logic

```typescript
// In SubscriptionCommissionService.getCommissionRate()
if (institution.subscription && institution.subscription.status === 'ACTIVE') {
  // Use subscription-based commission rate
  const commissionTier = await prisma.commissionTier.findUnique({
    where: { planType: institution.subscription.planType }
  });
  return commissionTier.commissionRate;
}

// Fallback to institution's default commission rate
return institution.commissionRate;
```

### Subscription Status Response

The API returns comprehensive subscription status including:
- `hasActiveSubscription`: Boolean indicating if subscription is active
- `effectiveCommissionRate`: Current commission rate (subscription or fallback)
- `institutionDefaultRate`: Institution's default commission rate
- `canCancel`: Whether subscription can be cancelled

### UI State Management

The subscription management card handles two main states:

1. **Active Subscription State**:
   - Shows current plan details
   - Displays subscription-based commission rate
   - Provides upgrade/downgrade/cancel options
   - Shows billing information

2. **No Active Subscription State**:
   - Shows fallback commission rate
   - Explains that institution default rate is being used
   - Provides option to view available plans
   - Mentions trial period availability

## Commission Rate Examples

| Scenario | Commission Rate | Source |
|----------|----------------|---------|
| STARTER subscription active | 25% | Subscription tier |
| PROFESSIONAL subscription active | 15% | Subscription tier |
| ENTERPRISE subscription active | 10% | Subscription tier |
| No active subscription | Variable | Institution default |
| Cancelled subscription | Variable | Institution default |

## Testing

The functionality has been tested with various scenarios:

1. **Same Rate Fallback**: When institution default = subscription rate
2. **Different Rate Fallback**: When institution default ≠ subscription rate
3. **Multiple Plan Testing**: Testing with different subscription plans
4. **Reactivation**: Verifying subscription can be reactivated after cancellation

## Benefits

1. **Flexibility**: Institutions can choose to use their default rates
2. **Transparency**: Clear indication of which rate is being used
3. **Audit Trail**: All cancellation actions are logged
4. **User Control**: Institutions can manage their subscription status
5. **Fallback Safety**: System always has a valid commission rate

## Future Enhancements

1. **Grace Period**: Optional grace period before fallback takes effect
2. **Partial Cancellation**: Allow cancellation of specific features
3. **Rate Locking**: Option to lock in rates for a period
4. **Bulk Operations**: Cancel multiple subscriptions at once
5. **Advanced Analytics**: Track commission rate changes over time 