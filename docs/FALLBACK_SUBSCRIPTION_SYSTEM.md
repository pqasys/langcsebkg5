# Fallback Subscription System

## Overview

The fallback subscription system automatically creates free/default plans for users when their trial periods expire without payment. This ensures users maintain access to basic platform features while encouraging them to upgrade to paid plans.

## How It Works

### Trial Expiration Process

1. **Trial Period**: Users start with a trial subscription (7 days for students, 14 days for institutions)
2. **Expiration Check**: The cron job runs daily to check for expired trials
3. **Fallback Creation**: When a trial expires, a fallback plan is automatically created
4. **User Notification**: Users are informed about their fallback plan status

### Fallback Plans

#### Student Fallback Plan (FREE)
- **Plan Type**: `FREE`
- **Price**: $0/month
- **Features**:
  - 2 courses maximum
  - 3 practice tests
  - Basic progress tracking
  - Community support
  - Basic platform access

#### Institution Fallback Plan (DEFAULT)
- **Plan Type**: `DEFAULT`
- **Price**: $0/month
- **Features**:
  - 50 students maximum
  - 5 courses maximum
  - 20% commission rate (default)
  - Basic analytics
  - Email support
  - Basic platform access

## Technical Implementation

### Service Methods

#### `SubscriptionCommissionService.getStudentFallbackPlan()`
Returns the student fallback plan definition.

#### `SubscriptionCommissionService.getInstitutionFallbackPlan()`
Returns the institution fallback plan definition.

#### `SubscriptionCommissionService.handleStudentTrialExpiration(studentId)`
Handles trial expiration for a specific student:
- Finds expired trial subscription
- Creates fallback subscription
- Updates trial status to EXPIRED
- Creates subscription logs

#### `SubscriptionCommissionService.handleInstitutionTrialExpiration(institutionId)`
Handles trial expiration for a specific institution:
- Finds expired trial subscription
- Creates fallback subscription
- Updates institution commission rate
- Updates trial status to EXPIRED
- Creates subscription logs

#### `SubscriptionCommissionService.processExpiredTrials()`
Processes all expired trials and creates fallback plans:
- Finds all expired student and institution trials
- Creates fallback plans for each
- Returns processing statistics

### Database Changes

#### Subscription Metadata
Fallback subscriptions include metadata to identify them:
```json
{
  "isFallback": true,
  "originalTrialId": "trial-subscription-id",
  "fallbackReason": "Trial expired without payment",
  "originalCommissionRate": 15
}
```

#### Subscription Logs
Fallback creation is logged with action `FALLBACK_CREATED`:
- Old plan: Original trial plan
- New plan: Fallback plan type
- Reason: "Trial expired, fallback plan created"

### Cron Job Integration

The existing trial expiration cron job (`/api/cron/trial-expiration`) has been updated to:
1. Process expired trials and create fallback plans
2. Handle regular trial-to-active conversions
3. Process recurring billing

### API Endpoints

#### Admin Fallback Processing
`POST /api/admin/process-fallbacks`
- Admin-only endpoint to manually trigger fallback processing
- Useful for testing and manual intervention

## User Experience

### Fallback Plan Indicators

#### Institution Dashboard
- Fallback plans show a blue information banner
- Commission rate is clearly displayed
- Upgrade options are prominently featured
- Cancel option is disabled for fallback plans

#### Student Dashboard
- Fallback plans show a blue information banner
- Limited features are clearly indicated
- Upgrade options are prominently featured
- Cancel option is disabled for fallback plans

### Upgrade Flow

Users on fallback plans can upgrade at any time:
1. Navigate to subscription management
2. Select desired paid plan
3. Complete payment
4. Fallback plan is replaced with paid plan

## Configuration

### Default Commission Rate
The default commission rate for institutions is configurable in the fallback plan definition:
```typescript
{
  commissionRate: 20, // Default commission rate
}
```

### Fallback Plan Features
Fallback plan features can be customized in the service methods:
- Course limits
- Student limits
- Support level
- Analytics access

## Monitoring and Logging

### Subscription Logs
All fallback plan activities are logged:
- `FALLBACK_CREATED`: When fallback plan is created
- `TRIAL_EXPIRED`: When trial expires
- `UPGRADE`: When user upgrades from fallback

### Metrics
The system tracks:
- Number of fallback plans created
- Conversion rate from fallback to paid
- Trial expiration rates
- Commission rate changes

## Testing

### Manual Testing
Use the test script to verify fallback functionality:
```bash
npm run ts-node scripts/test-fallback-system.ts
```

### Admin Testing
Use the admin API to trigger fallback processing:
```bash
curl -X POST /api/admin/process-fallbacks \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Benefits

### For Users
- **Continuous Access**: No service interruption after trial
- **Clear Upgrade Path**: Easy to understand upgrade options
- **Risk-Free Trial**: Can try platform without commitment

### For Business
- **Reduced Churn**: Users don't lose access after trial
- **Conversion Opportunity**: Fallback plans encourage upgrades
- **Revenue Protection**: Default commission rates maintain revenue
- **User Retention**: Keeps users engaged with platform

## Future Enhancements

1. **Automated Notifications**: Email/SMS reminders about fallback status
2. **Gradual Feature Reduction**: Progressive limitation of features
3. **Personalized Upgrade Offers**: Targeted upgrade incentives
4. **Fallback Plan Customization**: Institution-specific fallback plans
5. **Analytics Dashboard**: Fallback plan performance metrics

## Troubleshooting

### Common Issues

1. **Fallback Plan Not Created**
   - Check cron job execution
   - Verify trial expiration dates
   - Check subscription service logs

2. **Commission Rate Not Updated**
   - Verify institution record update
   - Check fallback plan features
   - Review subscription status method

3. **User Can't Upgrade**
   - Check fallback plan metadata
   - Verify upgrade eligibility logic
   - Review subscription management UI

### Debug Steps

1. Check subscription logs for `FALLBACK_CREATED` actions
2. Verify trial expiration dates in database
3. Test fallback processing manually
4. Review subscription status responses
5. Check UI components for fallback indicators 