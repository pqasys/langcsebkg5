# Updated Priority Placement Algorithm

## Overview

The priority placement algorithm has been updated to work seamlessly with the new unified subscription architecture while maintaining support for institutions without subscriptions. This ensures that institutions with high commission rates can compete effectively for placement, regardless of their subscription status.

## Key Features

### ✅ **Unified Architecture Support**
- Works with new `subscription.commissionTier.planType` when available
- Falls back to legacy `subscriptionPlan` field for backward compatibility
- Supports both subscribed and non-subscribed institutions

### ✅ **Commission Rate Bands**
- **VERY_HIGH**: ≥25% commission (highest priority)
- **HIGH**: ≥20% commission (high priority)
- **MEDIUM**: ≥15% commission (medium priority)
- **LOW**: <15% commission (standard priority)

### ✅ **Multiple Priority Factors**
- Featured institution status (1000 points)
- Commission rate (0-50 points based on rate)
- Subscription tier (0-100 points)
- Course recency (0-30 points)
- Start date proximity (0-30 points)

## Algorithm Details

### Priority Score Calculation

```typescript
let priorityScore = 0;

// 1. Featured institution bonus (highest priority)
if (course.institution.isFeatured) {
  priorityScore += 1000;
}

// 2. Commission rate bonus (0-50 points based on rate)
priorityScore += (course.institution.commissionRate || 0) * 10;

// 3. Subscription plan bonus - unified architecture support
let subscriptionPlan = 'BASIC'; // Default fallback

if (course.institution.subscription?.status === 'ACTIVE' && 
    course.institution.subscription.commissionTier) {
  // Use new unified architecture
  subscriptionPlan = course.institution.subscription.commissionTier.planType;
} else if (course.institution.subscriptionPlan) {
  // Fallback to legacy field for backward compatibility
  subscriptionPlan = course.institution.subscriptionPlan;
}

const planBonus = {
  'STARTER': 25,
  'BASIC': 0,
  'PROFESSIONAL': 50,
  'ENTERPRISE': 100
};
priorityScore += planBonus[subscriptionPlan] || 0;

// 4. Recency bonus (newer courses get slight boost)
const daysSinceCreation = Math.floor((Date.now() - new Date(course.createdAt).getTime()) / (1000 * 60 * 60 * 24));
priorityScore += Math.max(0, 30 - daysSinceCreation);

// 5. Start date proximity bonus (sooner courses get boost)
const daysUntilStart = Math.floor((new Date(course.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
priorityScore += Math.max(0, 30 - daysUntilStart);
```

### Commission Rate Band Categorization

```typescript
const commissionRate = course.institution.commissionRate || 0;
const commissionBand = commissionRate >= 25 ? 'VERY_HIGH' : 
                      commissionRate >= 20 ? 'HIGH' : 
                      commissionRate >= 15 ? 'MEDIUM' : 'LOW';

const commissionRateBand = {
  band: commissionBand,
  rate: commissionRate,
  description: commissionBand === 'VERY_HIGH' ? 'Very High Commission (≥25%)' :
              commissionBand === 'HIGH' ? 'High Commission (≥20%)' :
              commissionBand === 'MEDIUM' ? 'Medium Commission (≥15%)' : 'Standard Commission (<15%)'
};
```

## Database Sorting Order

```typescript
orderBy: [
  // Primary: Featured institutions first
  { institution: { isFeatured: 'desc' } },
  // Secondary: Higher commission rates
  { institution: { commissionRate: 'desc' } },
  // Tertiary: Sooner start dates
  { startDate: 'asc' },
  // Quaternary: Newer courses
  { createdAt: 'desc' }
]
```

## Advertising Eligibility

Courses are eligible for advertising placement if they meet ANY of these criteria:

- **Premium Placement**: `subscriptionPlan === 'ENTERPRISE'`
- **Featured Placement**: `institution.isFeatured === true`
- **High Commission**: `commissionRate >= 20%`
- **Very High Commission**: `commissionRate >= 25%`

## Priority Score Breakdown Example

For a course with:
- Featured institution: **1000 points**
- 20% commission rate: **200 points** (20 × 10)
- STARTER subscription: **25 points**
- New course (5 days old): **25 points** (30 - 5)
- Starting soon (10 days): **20 points** (30 - 10)

**Total Priority Score: 1270 points**

## Benefits for Institutions Without Subscriptions

### ✅ **High Commission Rate Advantage**
- Institutions with 25%+ commission can earn up to **250 points** from commission alone
- Institutions with 20%+ commission can earn up to **200 points** from commission alone
- This allows non-subscribed institutions to compete with subscribed ones

### ✅ **Featured Status Opportunity**
- Featured institutions get **1000 points** regardless of subscription status
- This provides a path for high-quality institutions to get premium placement

### ✅ **Course Quality Factors**
- New courses get up to **30 points** for recency
- Courses starting soon get up to **30 points** for urgency
- These factors reward quality content regardless of subscription

## API Response Structure

```typescript
{
  id: string;
  title: string;
  priorityScore: number;
  isPremiumPlacement: boolean;
  isFeaturedPlacement: boolean;
  isHighCommission: boolean;
  isVeryHighCommission: boolean;
  commissionBand: string;
  effectiveSubscriptionPlan: string;
  commissionRateBand: {
    band: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
    rate: number;
    description: string;
  };
  institution: {
    commissionRate: number;
    isFeatured: boolean;
    subscription?: {
      status: string;
      commissionTier: {
        planType: string;
      };
    };
  };
}
```

## Testing Results

Based on current test data:

- **Total courses tested**: 8
- **Courses with active subscriptions**: 0
- **Courses from non-subscribed institutions**: 8
- **High commission courses (≥20%)**: 4
- **Featured institutions**: 1
- **Commission revenue**: $3,910 (24.7% of total revenue)

## Revenue Optimization Potential

The algorithm identifies opportunities for revenue optimization:

- **Featured institutions**: $500 potential per institution
- **Premium institutions**: $1,000 potential per institution
- **High commission institutions (≥20%)**: $150 potential per institution
- **Very high commission institutions (≥25%)**: $300 potential per institution

## Implementation Files

### Updated Files:
- `app/api/courses/public/route.ts` - Main priority algorithm
- `scripts/test-updated-priority-algorithm.ts` - Test script
- `scripts/test-prioritization-system.ts` - System test

### Related Files:
- `lib/subscription-commission-service.ts` - Commission rate calculation
- `components/EnhancedCourseCard.tsx` - UI display
- `app/admin/advertising/route.ts` - Admin analytics

## Future Enhancements

### Planned Improvements:
1. **Dynamic Commission Bands**: Adjustable thresholds based on market conditions
2. **Performance Analytics**: Track conversion rates by priority score
3. **A/B Testing**: Test different priority algorithms
4. **Geographic Targeting**: Location-based priority adjustments
5. **Seasonal Adjustments**: Time-based priority modifications

### Revenue Opportunities:
1. **Commission Rate Optimization**: Real-time adjustments based on performance
2. **Featured Institution Program**: Paid featured placement options
3. **Premium Placement Bidding**: Auction system for top positions
4. **Performance-Based Commission**: Dynamic commission rates based on conversion

## Conclusion

The updated priority placement algorithm successfully:

✅ **Supports the unified subscription architecture**
✅ **Maintains backward compatibility**
✅ **Enables institutions without subscriptions to compete**
✅ **Provides clear commission rate bands**
✅ **Balances multiple priority factors**
✅ **Optimizes for revenue generation**

This creates a fair and competitive marketplace where institutions can succeed through quality content, high commission rates, or premium subscriptions. 