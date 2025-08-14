# Subscription Course Rules - Updated Implementation

## Overview

This document outlines the current rules for determining which courses require subscriptions and how the system handles different course types.

## Current Rules (Updated)

### **Primary Rule: Institution vs Platform Courses**

**Only platform courses (institutionId = null) can be subscription-based.**

- **Platform Courses** (`institutionId = null`): Can be subscription-based
- **Institution Courses** (`institutionId != null`): Never subscription-based, regardless of marketing type

### **Subscription Determination Logic**

For a course to require a subscription, **ALL** of the following must be true:

1. **Course must be a platform course**: `course.institutionId === null`
2. **AND** at least one of the following:
   - `course.requiresSubscription === true` (explicitly set)
   - `course.marketingType === 'LIVE_ONLINE'`
   - `course.marketingType === 'BLENDED'`

### **Code Implementation**

```typescript
// UPDATED RULE: Only platform courses (institutionId = null) can be subscription-based
// Institution courses (institutionId != null) are never subscription-based, regardless of marketing type
const requiresSubscription = course.institutionId === null && (
  course.requiresSubscription || 
  course.marketingType === 'LIVE_ONLINE' || 
  course.marketingType === 'BLENDED'
);
```

## Course Types and Subscription Requirements

### **Platform Courses (institutionId = null)**

| Marketing Type | requiresSubscription | Subscription Required? |
|----------------|---------------------|----------------------|
| `SELF_PACED` | `false` | ❌ No |
| `SELF_PACED` | `true` | ✅ Yes |
| `LIVE_ONLINE` | `false` | ✅ Yes (due to marketing type) |
| `LIVE_ONLINE` | `true` | ✅ Yes |
| `BLENDED` | `false` | ✅ Yes (due to marketing type) |
| `BLENDED` | `true` | ✅ Yes |
| `IN_PERSON` | `false` | ❌ No |
| `IN_PERSON` | `true` | ✅ Yes |

### **Institution Courses (institutionId != null)**

| Marketing Type | requiresSubscription | Subscription Required? |
|----------------|---------------------|----------------------|
| `SELF_PACED` | `false` | ❌ No |
| `SELF_PACED` | `true` | ❌ No (overridden by institution rule) |
| `LIVE_ONLINE` | `false` | ❌ No (overridden by institution rule) |
| `LIVE_ONLINE` | `true` | ❌ No (overridden by institution rule) |
| `BLENDED` | `false` | ❌ No (overridden by institution rule) |
| `BLENDED` | `true` | ❌ No (overridden by institution rule) |
| `IN_PERSON` | `false` | ❌ No |
| `IN_PERSON` | `true` | ❌ No (overridden by institution rule) |

## Implementation Changes

### **1. Institution Course Form**

- **Disabled Fields**: `requiresSubscription` and `subscriptionTier` are now disabled for institutions
- **Visual Indication**: Fields show as disabled with explanatory text
- **Forced Values**: Always set to `false` and `null` respectively

### **2. API Enforcement**

- **Course Creation**: Institution courses always have `requiresSubscription: false` and `subscriptionTier: null`
- **Course Updates**: Institution courses cannot be updated to require subscriptions
- **Enrollment Logic**: Updated to check `institutionId` first before determining subscription requirements

### **3. Frontend Components**

- **Enrollment Modals**: Updated logic to respect the new rules
- **Course Display**: Subscription badges only show for platform courses
- **Student Dashboard**: Subscription requirements only displayed for platform courses

## Business Logic

### **Why This Change?**

1. **Clear Separation**: Platform courses vs institution courses have distinct business models
2. **Institution Autonomy**: Institutions can create live online courses without platform subscription requirements
3. **Simplified Pricing**: Institution courses use their own pricing models (weekly, monthly, full course)
4. **Future Flexibility**: Institution subscription implementation can be added later without affecting current logic

### **User Experience**

- **Platform Courses**: Users need subscriptions for premium content and live features
- **Institution Courses**: Users pay per course or enrollment period, no platform subscription required
- **Clear Messaging**: UI clearly indicates which courses require subscriptions

## Migration Notes

### **Existing Data**

- **Platform Courses**: No changes needed, existing logic preserved
- **Institution Courses**: Any existing `requiresSubscription: true` will be ignored in enrollment logic
- **Database**: No data migration required, logic changes handle the enforcement

### **Testing**

- Verify institution courses never require subscriptions regardless of marketing type
- Verify platform courses maintain existing subscription logic
- Test enrollment flows for both course types
- Verify UI correctly displays subscription requirements

## Future Considerations

### **Institution Subscriptions**

When institution subscription features are implemented:

1. **Separate Logic**: Institution subscriptions will be handled separately from platform subscriptions
2. **Course Access**: Institution courses may have their own subscription tiers
3. **Hybrid Access**: Users with both platform and institution subscriptions will have access to both

### **Marketing Type Changes**

- `LIVE_ONLINE` and `BLENDED` marketing types no longer automatically require subscriptions for institution courses
- Institutions can create live online courses with their own pricing models
- Platform courses maintain the existing behavior for these marketing types
