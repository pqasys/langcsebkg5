# Course Cards Subscription Display Implementation

## Overview
This document summarizes the changes made to display subscription data instead of pricing in course listing/display cards for platform-wide (subscription-based) courses.

## Business Rule
**Platform-wide courses that require subscription should display subscription tier information instead of individual course pricing**, as their access is determined by subscription tiers rather than individual course pricing.

## Changes Made

### 1. File Modified: `components/CourseCard.tsx`

#### Interface Updates
- **Added subscription fields** to the `Course` interface:
  - `requiresSubscription?: boolean`
  - `subscriptionTier?: string`
  - `isPlatformCourse?: boolean`
  - `marketingType?: string`

#### Logic Updates
- **Added subscription detection logic** in `courseData` calculation:
  ```typescript
  const isSubscriptionBased = course.institutionId === null && (
    course.requiresSubscription || 
    course.marketingType === 'LIVE_ONLINE' || 
    course.marketingType === 'BLENDED'
  );
  ```

- **Added subscription tier lookup** using `getStudentTier()` from `@/lib/subscription-pricing`

#### Display Updates
- **Updated price display section** to show subscription information for subscription-based courses:
  - Shows "Subscription Required" badge
  - Displays subscription tier name (e.g., "Basic Plan", "Premium Plan")
  - Shows "From $X/month" pricing from subscription tier
  - Maintains regular pricing display for non-subscription courses

- **Updated action button text**:
  - Shows "Subscribe" for subscription-based courses
  - Shows "Enroll" for regular courses

### 2. File Modified: `components/EnhancedCourseCard.tsx`

#### Interface Updates
- **Added subscription fields** to the course interface:
  - `requiresSubscription?: boolean`
  - `subscriptionTier?: string`
  - `isPlatformCourse?: boolean`
  - `marketingType?: string`
  - `institutionId?: string`

#### Logic Updates
- **Added subscription detection logic**:
  ```typescript
  const isSubscriptionBased = course.institutionId === null && (
    course.requiresSubscription || 
    course.marketingType === 'LIVE_ONLINE' || 
    course.marketingType === 'BLENDED'
  );
  ```

- **Added subscription tier lookup** using `getStudentTier()`

#### Display Updates
- **Updated price display section** to show subscription information:
  - Shows "Subscription" badge
  - Displays subscription tier name
  - Shows "From $X/month" pricing
  - Maintains regular pricing display for non-subscription courses

- **Updated action button text**:
  - Shows "Subscribe Now" for subscription-based courses
  - Shows "Enroll Now" for regular courses

### 3. File Modified: `app/student/courses/page.tsx`

#### Interface Updates
- **Added subscription fields** to the `Course` interface:
  - `requiresSubscription?: boolean`
  - `subscriptionTier?: string`
  - `isPlatformCourse?: boolean`
  - `institutionId?: string`

#### Display Updates
- **Updated course details grid** to show subscription information:
  - Changes "Pricing:" label to "Subscription:" for subscription-based courses
  - Shows subscription tier name instead of pricing period
  - Maintains regular pricing display for non-subscription courses

## Technical Implementation Details

### Conditional Logic
The subscription detection logic uses the condition:
```typescript
course.institutionId === null && (
  course.requiresSubscription || 
  course.marketingType === 'LIVE_ONLINE' || 
  course.marketingType === 'BLENDED'
)
```

### Subscription Tier Lookup
Uses the `getStudentTier()` function from `@/lib/subscription-pricing` to get tier information:
```typescript
const subscriptionInfo = isSubscriptionBased && course.subscriptionTier 
  ? getStudentTier(course.subscriptionTier) 
  : null;
```

### Visual Indicators
- **Subscription badges**: Blue-themed badges indicating subscription requirement
- **Tier badges**: Outline badges showing the specific subscription tier
- **Pricing display**: Shows "From $X/month" format for subscription courses
- **Button text**: Different text for subscription vs. enrollment actions

## User Experience

### For Subscription-Based Courses
1. **Visual indicators**: Clear badges showing subscription requirement
2. **Tier information**: Shows which subscription tier is required
3. **Pricing context**: Shows monthly subscription cost instead of course price
4. **Action clarity**: "Subscribe" button instead of "Enroll"

### For Regular Courses
- All pricing and enrollment displays remain unchanged
- No impact on existing functionality

## Business Impact

### Positive Effects
- **Clarity**: Students clearly understand subscription requirements upfront
- **Consistency**: Aligns with the subscription-based business model
- **User experience**: Reduces confusion about pricing for subscription courses
- **Conversion**: Clear call-to-action for subscription courses

### Compliance
- Aligns with the business rule that platform subscription courses should not show individual pricing
- Maintains consistency with the subscription tier pricing model
- Supports the separation between platform-wide and institution-specific course pricing

## Testing Considerations

### Test Scenarios
1. **Subscription course display**: Verify subscription information is shown correctly
2. **Regular course display**: Verify pricing information remains unchanged
3. **Mixed course lists**: Verify both types display correctly in the same list
4. **Subscription tier variations**: Verify different tiers display correctly
5. **Button functionality**: Verify subscribe/enroll buttons work appropriately

### Edge Cases
- Courses without subscription tier information
- Courses with invalid subscription tier values
- Mixed course types in search results
- Responsive design on different screen sizes

## Related Documentation
- `docs/SUBSCRIPTION_COURSE_RULES.md` - Business rules for subscription courses
- `docs/ADMIN_PRICING_FIELDS_DISABLE_IMPLEMENTATION.md` - Admin form pricing field disablement
- `lib/subscription-pricing.ts` - Subscription pricing data source
